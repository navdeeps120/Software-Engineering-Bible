import { describe, expect, it } from "vitest";
import { SocketTable } from "../src/sockets.js";

describe("SocketTable", () => {
  it("filters and detects pressure", () => {
    const t = new SocketTable();
    t.add({
      proto: "tcp",
      local: "0.0.0.0:80",
      peer: "0.0.0.0:*",
      state: "LISTEN",
      inode: 1,
    });
    for (let i = 0; i < 5; i++) {
      t.add({
        proto: "tcp",
        local: "10.0.0.1:80",
        peer: `10.0.0.2:${4000 + i}`,
        state: "ESTAB",
        inode: 10 + i,
        pid: 42,
      });
    }
    t.add({
      proto: "tcp",
      local: "10.0.0.1:80",
      peer: "10.0.0.3:9",
      state: "TIME-WAIT",
      inode: 99,
    });
    expect(t.list({ state: "ESTAB" })).toHaveLength(5);
    expect(t.pressure({ estab: 3, timeWait: 10 })).toContain("estab_exhaustion");
    expect(t.pressure({ estab: 10, timeWait: 0 })).toContain("time_wait_pileup");
  });
});
