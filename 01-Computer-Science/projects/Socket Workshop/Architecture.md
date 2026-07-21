---
title: Socket Workshop — Architecture
aliases: []
track: 01-Computer-Science
topic: socket-workshop-architecture
difficulty: advanced
status: active
prerequisites:
  - "[[01-Computer-Science/projects/Socket Workshop/README|Socket Workshop]]"
tags: [project, architecture, networking]
created: 2026-07-21
updated: 2026-07-21
---

# Architecture — Socket Workshop

## TCP Echo Lifecycle

```mermaid
sequenceDiagram
    participant Test
    participant Server
    participant Client
    Test->>Server: listen(0)
    Test->>Client: connect(port)
    Client->>Server: write(message)
    Server->>Client: write(echo)
    Server->>Server: end
    Client->>Test: resolve(reply)
    Test->>Server: close
```

## UDP Echo Lifecycle

```mermaid
sequenceDiagram
    participant Client
    participant Server
    Client->>Server: sendto(msg)
    Server->>Client: sendto(msg, rinfo)
    Note over Client: 2s timeout on reply
```

## HTTP/1.0 Parser Scope

```mermaid
flowchart TD
    Raw[Raw string CRLF normalized] --> Split[Split header body]
    Split --> RequestLine[Parse METHOD PATH VERSION]
    Split --> Headers[Parse Header: Value lines]
    RequestLine --> HttpRequest[HttpRequest object]
    Headers --> HttpRequest
```

Supported for lab purposes:

- Request line: `GET /path HTTP/1.0`
- Headers terminated by blank line
- Response: status line + optional body string via `format_http_response`

Not in scope: chunked transfer, persistent connections, trailing headers.

## Layer Placement

```mermaid
flowchart BT
    App[HTTP / Framed RPC] --> TCP[TCP byte stream]
    App2[UDP datagram app] --> UDP[UDP datagram]
    TCP --> IP[IP loopback]
    UDP --> IP
```

## Related Documents

- [[01-Computer-Science/projects/Socket Workshop/README|README]]
- [[01-Computer-Science/code/typescript/src/netdemo.ts|netdemo.ts]]
- [[01-Computer-Science/code/python/seb_cs/netdemo.py|netdemo.py]]
