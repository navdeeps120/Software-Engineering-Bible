/**
 * Educational /proc/<pid>/status + /proc/<pid>/stat parser (fixture text).
 */

export type ProcStatus = {
  name: string;
  state: string;
  pid: number;
  ppid: number;
  uid: number;
  vmRssKb: number;
  vmSizeKb: number;
  threads: number;
};

export function parseProcStatus(text: string): ProcStatus {
  const get = (key: string): string => {
    const line = text.split("\n").find((l) => l.startsWith(`${key}:`));
    if (!line) throw new Error(`missing ${key}`);
    return line.slice(key.length + 1).trim();
  };
  const num = (key: string) => Number.parseInt(get(key).split(/\s+/)[0]!, 10);
  return {
    name: get("Name"),
    state: get("State").charAt(0),
    pid: num("Pid"),
    ppid: num("PPid"),
    uid: num("Uid"),
    vmRssKb: num("VmRSS"),
    vmSizeKb: num("VmSize"),
    threads: num("Threads"),
  };
}

/** Minimal /proc/<pid>/stat field extract (pid, comm, state, ppid). */
export function parseProcStat(line: string): {
  pid: number;
  comm: string;
  state: string;
  ppid: number;
} {
  const open = line.indexOf("(");
  const close = line.lastIndexOf(")");
  if (open < 0 || close < 0) throw new Error("invalid stat line");
  const pid = Number.parseInt(line.slice(0, open).trim(), 10);
  const comm = line.slice(open + 1, close);
  const rest = line.slice(close + 2).split(/\s+/);
  return { pid, comm, state: rest[0]!, ppid: Number.parseInt(rest[1]!, 10) };
}
