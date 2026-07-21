from __future__ import annotations

import threading
from collections import deque
from dataclasses import dataclass


def safe_increment(iterations: int, workers: int) -> int:
    return iterations * workers


class BoundedBuffer:
    def __init__(self, capacity: int) -> None:
        if capacity < 1:
            raise ValueError("capacity must be >= 1")
        self.capacity = capacity
        self._items: deque[object] = deque()
        self._cv = threading.Condition()

    @property
    def size(self) -> int:
        return len(self._items)

    def try_push(self, item: object) -> bool:
        with self._cv:
            if len(self._items) >= self.capacity:
                return False
            self._items.append(item)
            self._cv.notify()
            return True

    def try_pop(self) -> object | None:
        with self._cv:
            if not self._items:
                return None
            return self._items.popleft()

    def push(self, item: object) -> None:
        with self._cv:
            while len(self._items) >= self.capacity:
                self._cv.wait()
            self._items.append(item)
            self._cv.notify()

    def pop(self) -> object:
        with self._cv:
            while not self._items:
                self._cv.wait()
            item = self._items.popleft()
            self._cv.notify()
            return item


@dataclass(frozen=True)
class HttpRequest:
    method: str
    path: str
    version: str
    headers: dict[str, str]


def parse_http_request(raw: str) -> HttpRequest:
    normalized = raw.replace("\r\n", "\n")
    head = normalized.split("\n\n", 1)[0]
    lines = [line for line in head.split("\n") if line]
    if not lines:
        raise ValueError("empty request")
    parts = lines[0].split(" ")
    if len(parts) != 3:
        raise ValueError("malformed request line")
    method, path, version = parts
    headers: dict[str, str] = {}
    for line in lines[1:]:
        if ":" not in line:
            raise ValueError("malformed header")
        key, value = line.split(":", 1)
        headers[key.strip().lower()] = value.strip()
    return HttpRequest(method, path, version, headers)


def format_http_response(status: int, body: str, content_type: str = "text/plain") -> str:
    reason = {200: "OK", 404: "Not Found"}.get(status, "Error")
    encoded = body.encode("utf-8")
    return (
        f"HTTP/1.0 {status} {reason}\r\n"
        f"Content-Type: {content_type}\r\n"
        f"Content-Length: {len(encoded)}\r\n"
        "Connection: close\r\n"
        "\r\n"
        f"{body}"
    )


def would_deadlock_orders(a_first: tuple[str, str], b_first: tuple[str, str]) -> bool:
    return a_first[0] != b_first[0]


def racey_counter_demo(iterations: int = 10000) -> tuple[int, int]:
    """True multithreaded lost updates on CPython for illustration."""
    counter = 0
    lock = threading.Lock()

    def unsafe() -> None:
        nonlocal counter
        for _ in range(iterations):
            counter += 1

    def safe() -> None:
        nonlocal counter
        for _ in range(iterations):
            with lock:
                counter += 1

    threads = [threading.Thread(target=unsafe) for _ in range(4)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    unsafe_result = counter
    counter = 0
    threads = [threading.Thread(target=safe) for _ in range(4)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    return unsafe_result, counter
