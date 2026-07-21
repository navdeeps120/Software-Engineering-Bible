"""Mirrors `typescript/src/intervalScheduling.ts` exactly."""

from __future__ import annotations

from typing import Dict, List, Sequence, Tuple, Union

IntervalIn = Union[Dict[str, int], Tuple[int, int], List[int]]


def interval_scheduling(intervals: Sequence[IntervalIn]) -> List[Dict[str, int]]:
    """Classic activity-selection greedy: sort by end time ascending (ties
    broken by start ascending, then original input index), greedily accept
    any interval whose start is >= the previously accepted interval's end.
    Maximizes count of non-overlapping intervals (touching endpoints do not
    count as overlapping). O(n log n).
    """

    def normalize(iv: IntervalIn) -> Dict[str, int]:
        if isinstance(iv, dict):
            return {"start": iv["start"], "end": iv["end"]}
        return {"start": iv[0], "end": iv[1]}

    normalized = [normalize(iv) for iv in intervals]
    indexed = list(enumerate(normalized))
    indexed.sort(key=lambda item: (item[1]["end"], item[1]["start"], item[0]))

    selected: List[Dict[str, int]] = []
    last_end = float("-inf")
    for _, iv in indexed:
        if iv["start"] >= last_end:
            selected.append(iv)
            last_end = iv["end"]
    return selected
