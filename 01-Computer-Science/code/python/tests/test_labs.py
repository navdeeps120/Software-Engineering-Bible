from __future__ import annotations

import os
import sys
import unittest

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from seb_cs.bits import bit_at, bytes_to_u16, bytes_to_u32, set_bit, to_binary_string, u16_to_bytes, u32_to_bytes
from seb_cs.float_inspect import float64_from_bits, inspect_float64
from seb_cs.utf8 import Utf8Error, decode_utf8, encode_utf8
from seb_cs.framing import crc32, decode_frame, encode_frame, frame_to_json, json_to_frame
from seb_cs.vm import Op, assemble, run
from seb_cs.parser import eval_expr, parse_expression, tokenize, transition
from seb_cs.runtime import BoundedBuffer, format_http_response, parse_http_request, safe_increment, would_deadlock_orders
from seb_cs.netdemo import tcp_echo_once, udp_echo_once


class LabsTest(unittest.TestCase):
    def test_bits(self) -> None:
        self.assertEqual(bit_at(0b1010, 1), 1)
        self.assertEqual(set_bit(0, 3, 1), 8)
        self.assertEqual(to_binary_string(5, 8), "00000101")
        self.assertEqual(list(u16_to_bytes(0x1234, "le")), [0x34, 0x12])
        self.assertEqual(bytes_to_u16(u16_to_bytes(0x1234, "le"), 0, "le"), 0x1234)
        self.assertEqual(bytes_to_u32(u32_to_bytes(0x01020304, "be"), 0, "be"), 0x01020304)

    def test_float(self) -> None:
        one = inspect_float64(1.0)
        self.assertEqual(one.sign, 0)
        self.assertEqual(one.exponent, 1023)
        neg_zero = inspect_float64(-0.0)
        self.assertEqual(neg_zero.sign, 1)
        self.assertTrue(neg_zero.is_zero)
        self.assertEqual(float64_from_bits(one.bits), 1.0)

    def test_utf8(self) -> None:
        text = "A¥€😀"
        self.assertEqual(decode_utf8(encode_utf8(text)), text)
        with self.assertRaises(Utf8Error):
            decode_utf8(bytes([0xC0, 0xAF]))
        with self.assertRaises(Utf8Error):
            decode_utf8(bytes([0xE2, 0x82]))

    def test_framing(self) -> None:
        payload = b"hello"
        self.assertGreater(crc32(payload), 0)
        frame = encode_frame(payload)
        decoded, consumed = decode_frame(frame)
        self.assertEqual(decoded, payload)
        self.assertEqual(consumed, len(frame))
        self.assertEqual(frame_to_json(json_to_frame({"ok": True})), {"ok": True})

    def test_vm(self) -> None:
        code = assemble([(Op.PUSH, 2), (Op.PUSH, 3), Op.ADD, (Op.PUSH, 4), Op.MUL, Op.PRINT, Op.HALT])
        _, output = run(code)
        self.assertEqual(output, [20])

    def test_parser(self) -> None:
        self.assertTrue(any(t.type == "number" for t in tokenize("1 + 2*3")))
        self.assertEqual(eval_expr(parse_expression("(2+3)*4")), 20)
        self.assertEqual(transition("closed", "connect"), "connecting")

    def test_runtime(self) -> None:
        buf = BoundedBuffer(1)
        self.assertTrue(buf.try_push(1))
        self.assertFalse(buf.try_push(2))
        self.assertEqual(buf.try_pop(), 1)
        req = parse_http_request("GET / HTTP/1.0\r\nHost: x\r\n\r\n")
        self.assertEqual(req.method, "GET")
        self.assertIn("HTTP/1.0 200 OK", format_http_response(200, "ok"))
        self.assertEqual(safe_increment(10, 4), 40)
        self.assertTrue(would_deadlock_orders(("A", "B"), ("B", "A")))

    def test_netdemo(self) -> None:
        self.assertEqual(tcp_echo_once("ping"), "ping")
        self.assertEqual(udp_echo_once("pong"), "pong")


if __name__ == "__main__":
    unittest.main()
