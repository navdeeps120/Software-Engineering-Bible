import { describe, expect, it } from "vitest";
import { parseProcStat, parseProcStatus } from "../src/procfs.js";

const FIXTURE = `
Name:	nginx
State:	S (sleeping)
Pid:	42
PPid:	1
Uid:	1000	1000	1000	1000
VmRSS:	    4096 kB
VmSize:	   20480 kB
Threads:	4
`.trim();

describe("procfs parsers", () => {
  it("parses status fixture", () => {
    const s = parseProcStatus(FIXTURE);
    expect(s.name).toBe("nginx");
    expect(s.state).toBe("S");
    expect(s.pid).toBe(42);
    expect(s.ppid).toBe(1);
    expect(s.uid).toBe(1000);
    expect(s.vmRssKb).toBe(4096);
    expect(s.vmSizeKb).toBe(20480);
    expect(s.threads).toBe(4);
  });

  it("parses stat with spaces in comm", () => {
    const p = parseProcStat("10 (my app) S 1 10 10 0 -1");
    expect(p.pid).toBe(10);
    expect(p.comm).toBe("my app");
    expect(p.state).toBe("S");
    expect(p.ppid).toBe(1);
  });
});
