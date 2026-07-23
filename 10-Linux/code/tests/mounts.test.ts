import { describe, expect, it } from "vitest";
import { MountTable } from "../src/mounts.js";

describe("MountTable", () => {
  it("resolves longest mount prefix", () => {
    const t = new MountTable();
    t.add({
      device: "/dev/sda1",
      mountpoint: "/",
      fstype: "ext4",
      totalBytes: 1000,
      usedBytes: 100,
      totalInodes: 100,
      usedInodes: 10,
    });
    t.add({
      device: "/dev/sdb1",
      mountpoint: "/var",
      fstype: "xfs",
      totalBytes: 500,
      usedBytes: 400,
      totalInodes: 50,
      usedInodes: 40,
    });
    expect(t.resolve("/var/log/app")?.mountpoint).toBe("/var");
    expect(t.resolve("/home")?.mountpoint).toBe("/");
  });

  it("simulates ENOSPC bytes and inodes", () => {
    const t = new MountTable();
    t.add({
      device: "/dev/sda1",
      mountpoint: "/",
      fstype: "ext4",
      totalBytes: 100,
      usedBytes: 90,
      totalInodes: 5,
      usedInodes: 4,
    });
    expect(t.allocate("/tmp/a", 20).ok).toBe(false);
    expect((t.allocate("/tmp/a", 20) as { reason: string }).reason).toBe(
      "enospc_bytes",
    );
    expect(t.allocate("/tmp/b", 5).ok).toBe(true);
    expect(t.allocate("/tmp/c", 1).ok).toBe(false);
    expect((t.allocate("/tmp/c", 1) as { reason: string }).reason).toBe(
      "enospc_inodes",
    );
  });
});
