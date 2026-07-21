from __future__ import annotations

import socket
import threading


def tcp_echo_once(message: str, host: str = "127.0.0.1") -> str:
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind((host, 0))
    server.listen(1)
    port = server.getsockname()[1]

    def serve() -> None:
        conn, _ = server.accept()
        with conn:
            data = conn.recv(4096)
            conn.sendall(data)

    thread = threading.Thread(target=serve, daemon=True)
    thread.start()
    with socket.create_connection((host, port), timeout=2) as client:
        client.sendall(message.encode("utf-8"))
        reply = client.recv(4096).decode("utf-8")
    server.close()
    thread.join(timeout=2)
    return reply


def udp_echo_once(message: str, host: str = "127.0.0.1") -> str:
    server = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    server.bind((host, 0))
    port = server.getsockname()[1]

    def serve() -> None:
        data, addr = server.recvfrom(4096)
        server.sendto(data, addr)

    thread = threading.Thread(target=serve, daemon=True)
    thread.start()
    client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    client.settimeout(2)
    client.sendto(message.encode("utf-8"), (host, port))
    data, _ = client.recvfrom(4096)
    client.close()
    server.close()
    thread.join(timeout=2)
    return data.decode("utf-8")
