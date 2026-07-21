from __future__ import annotations


def c3_merge(seqs: list[list[str]]) -> list[str]:
    """C3 linearization merge used by Python MRO."""
    result: list[str] = []
    seqs = [list(seq) for seq in seqs]
    while True:
        seqs = [seq for seq in seqs if seq]
        if not seqs:
            return result
        candidate = None
        for seq in seqs:
            head = seq[0]
            if any(head in s[1:] for s in seqs):
                continue
            candidate = head
            break
        if candidate is None:
            raise TypeError("inconsistent hierarchy: cannot compute MRO")
        result.append(candidate)
        for seq in seqs:
            if seq and seq[0] == candidate:
                del seq[0]


def mro(name: str, bases: list[str], hierarchy: dict[str, list[str]]) -> list[str]:
    """
    Compute MRO for `name` with immediate `bases`.
    `hierarchy` maps class -> list of base names (already linearized parents optional).
    """
    parent_mros = []
    for base in bases:
        if base not in hierarchy and base != "object":
            raise KeyError(f"unknown base {base}")
        if base == "object":
            parent_mros.append(["object"])
        else:
            parent_mros.append(mro(base, hierarchy[base], hierarchy))
    return c3_merge([[name]] + parent_mros + [list(bases)])


def lookup_attribute(
    instance_dict: dict[str, object],
    class_mro: list[str],
    class_dicts: dict[str, dict[str, object]],
    name: str,
) -> object:
    if name in instance_dict:
        return instance_dict[name]
    for cls in class_mro:
        mapping = class_dicts.get(cls, {})
        if name in mapping:
            return mapping[name]
    raise AttributeError(name)
