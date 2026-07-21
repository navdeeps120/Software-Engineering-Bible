from __future__ import annotations

from typing import Any, Callable


class Descriptor:
    def __set_name__(self, owner: type, name: str) -> None:
        self.public_name = name
        self.private_name = f"_{name}"

    def __get__(self, obj: object | None, owner: type | None = None) -> Any:
        if obj is None:
            return self
        return getattr(obj, self.private_name)

    def __set__(self, obj: object, value: Any) -> None:
        setattr(obj, self.private_name, value)


class Validated(Descriptor):
    def __init__(self, validator: Callable[[Any], bool], message: str = "invalid value") -> None:
        self.validator = validator
        self.message = message

    def __set__(self, obj: object, value: Any) -> None:
        if not self.validator(value):
            raise ValueError(self.message)
        super().__set__(obj, value)


def is_data_descriptor(obj: object) -> bool:
    cls = type(obj)
    return hasattr(cls, "__set__") or hasattr(cls, "__delete__")
