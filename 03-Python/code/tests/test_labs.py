from __future__ import annotations

import sys

import pytest

from seb_python.asyncio_lite import CancelledError, EventLoop, Future
from seb_python.concurrency import BoundedSemaphorePool, map_limit
from seb_python.context import ContextStack
from seb_python.descriptors import Validated, is_data_descriptor
from seb_python.exceptions import match_exception_group, reraise_unmatched
from seb_python.gc_sim import RefcountHeap
from seb_python.imports import ImportGraph, ModuleRecord
from seb_python.iterators import CountUp, GeneratorMachine, countdown
from seb_python.logging_ctx import bind_correlation, configure_logger, correlation_id, reset_correlation
from seb_python.mro import lookup_attribute, mro
from seb_python.plugins import PluginRegistry
from seb_python.vm import Instruction, Op, run


def test_mro_and_lookup() -> None:
    hierarchy = {
        "C": ["A", "B"],
        "A": ["object"],
        "B": ["object"],
    }
    order = mro("C", ["A", "B"], hierarchy)
    assert order[0] == "C"
    assert "A" in order and "B" in order and order[-1] == "object"
    value = lookup_attribute({}, order, {"A": {"x": 1}, "B": {"x": 2}, "C": {}}, "x")
    assert value == 1


def test_descriptor_validation() -> None:
    class Person:
        age = Validated(lambda v: isinstance(v, int) and v >= 0, "age must be non-negative int")

        def __init__(self, age: int) -> None:
            self.age = age

    Person.age.__set_name__(Person, "age")
    p = Person(30)
    assert p.age == 30
    with pytest.raises(ValueError):
        p.age = -1
    assert is_data_descriptor(Person.age)


def test_iterators_and_generators() -> None:
    assert list(CountUp(0, 3)) == [0, 1, 2]
    gen = countdown(2)
    assert next(gen) == 2
    machine = GeneratorMachine(countdown(1))
    assert machine.send(None) == 1
    with pytest.raises(StopIteration) as stopped:
        machine.send(None)
    assert stopped.value.value == "done"
    assert machine.closed


def test_context_stack_cleanup() -> None:
    events: list[str] = []

    class CM:
        def __enter__(self) -> str:
            events.append("enter")
            return "resource"

        def __exit__(self, *args: object) -> bool:
            events.append("exit")
            return False

    with ContextStack() as stack:
        assert stack.enter(CM()) == "resource"
        stack.callback(lambda: events.append("callback"))
    assert events == ["enter", "callback", "exit"]


def test_exception_group_routing() -> None:
    group = ExceptionGroup("boom", [ValueError("a"), TypeError("b"), ValueError("c")])
    matched, unmatched = match_exception_group(group, ValueError)
    assert len(matched) == 2
    assert len(unmatched) == 1
    with pytest.raises(BaseExceptionGroup):
        reraise_unmatched(group, ValueError)


def test_vm_arithmetic() -> None:
    program = [
        Instruction(Op.LOAD_CONST, 0),
        Instruction(Op.LOAD_CONST, 1),
        Instruction(Op.BINARY_ADD),
        Instruction(Op.RETURN),
    ]
    assert run(program, [2, 3]) == 5


def test_refcount_and_self_cycle() -> None:
    heap = RefcountHeap()
    heap.alloc("a")
    heap.release("a")
    assert heap.nodes["a"].freed
    heap = RefcountHeap()
    heap.alloc("cycle")
    heap.add_ref("cycle", "cycle")
    # external root dropped but self-cycle remains
    heap.nodes["cycle"].refcount -= 1
    assert heap.collect_cycles() == ["cycle"]
    assert heap.nodes["cycle"].freed


def test_import_graph_orders_and_detects_cycles() -> None:
    graph = ImportGraph()
    graph.add(ModuleRecord("shared", []))
    graph.add(ModuleRecord("feature", ["shared"]))
    graph.add(ModuleRecord("app", ["feature"]))
    assert graph.load_order("app") == ["shared", "feature", "app"]
    cyclic = ImportGraph()
    cyclic.add(ModuleRecord("a", ["b"]))
    cyclic.add(ModuleRecord("b", ["a"]))
    with pytest.raises(ImportError, match="circular"):
        cyclic.load_order("a")


def test_asyncio_lite_runs_coroutine() -> None:
    loop = EventLoop()

    async def main() -> int:
        fut = Future()
        fut.set_result(21)
        value = await fut
        return value * 2

    assert loop.run_until_complete(main()) == 42


def test_asyncio_lite_cancellation() -> None:
    fut = Future()
    assert fut.cancel()
    with pytest.raises(CancelledError):
        fut.result()


def test_map_limit_preserves_order() -> None:
    assert map_limit([1, 2, 3, 4], 2, lambda x: x * 2) == [2, 4, 6, 8]
    pool = BoundedSemaphorePool(2)
    assert pool.run(lambda: 7) == 7


def test_plugin_registry() -> None:
    class Hello:
        name = "hello"

        def run(self) -> str:
            return "hi"

    registry = PluginRegistry()
    registry.register(Hello())
    assert registry.names() == ["hello"]
    assert registry.get("hello").run() == "hi"


def test_contextvar_logging(capsys: pytest.CaptureFixture[str]) -> None:
    logger = configure_logger("test-seb")
    token = bind_correlation("req-1")
    try:
        logger.info("hello")
    finally:
        reset_correlation(token)
    captured = capsys.readouterr().err + capsys.readouterr().out
    assert "req-1" in captured
    assert correlation_id.get() is None


@pytest.mark.skipif(sys.version_info < (3, 11), reason="requires ExceptionGroup")
def test_exceptiongroup_available() -> None:
    assert issubclass(ExceptionGroup, BaseException)
