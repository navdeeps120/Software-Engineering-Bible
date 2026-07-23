import { describe, expect, it } from "vitest";
import {
  applyUmask,
  canUnlinkInStickyDir,
  checkAccess,
} from "../src/permissions.js";

describe("permissions", () => {
  it("applies owner/group/other DAC", () => {
    const file = { mode: 0o640, uid: 1000, gid: 100 };
    expect(checkAccess(file, { uid: 1000, gids: [100] }, "r")).toBe(true);
    expect(checkAccess(file, { uid: 1000, gids: [100] }, "w")).toBe(true);
    expect(checkAccess(file, { uid: 2000, gids: [100] }, "r")).toBe(true);
    expect(checkAccess(file, { uid: 2000, gids: [100] }, "w")).toBe(false);
    expect(checkAccess(file, { uid: 3000, gids: [300] }, "r")).toBe(false);
  });

  it("honors named user ACL over group", () => {
    const file = {
      mode: 0o640,
      uid: 1,
      gid: 1,
      aclUsers: new Map([[50, 0o7]]),
    };
    expect(checkAccess(file, { uid: 50, gids: [99] }, "x")).toBe(true);
  });

  it("sticky bit protects others' files", () => {
    const dir = { mode: 0o1777, uid: 0, gid: 0, sticky: true };
    expect(canUnlinkInStickyDir(dir, 100, { uid: 100, gids: [100] })).toBe(true);
    expect(canUnlinkInStickyDir(dir, 100, { uid: 200, gids: [200] })).toBe(false);
    expect(canUnlinkInStickyDir(dir, 100, { uid: 0, gids: [0] })).toBe(true);
  });

  it("applyUmask clears bits", () => {
    expect(applyUmask(0o666, 0o022)).toBe(0o644);
  });
});
