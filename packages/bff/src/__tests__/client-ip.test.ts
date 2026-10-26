import { describe, expect, it } from "vitest";
import { resolveClientIp } from "../client-ip";

const xff = (value?: string) =>
  new Headers(value === undefined ? {} : { "x-forwarded-for": value });

describe("resolveClientIp", () => {
  it("uses the address Next.js recorded when there is no proxy (hops = 0)", () => {
    expect(resolveClientIp(xff("203.0.113.7"), 0)).toBe("203.0.113.7");
  });

  it("takes the entry added by our one trusted proxy, ignoring what the client sent", () => {
    // The client claimed 1.1.1.1; our proxy appended the address it really saw.
    expect(resolveClientIp(xff("1.1.1.1, 203.0.113.7"), 1)).toBe("203.0.113.7");
  });

  it("walks back past every trusted proxy", () => {
    // client-supplied, real client (seen by the CDN), CDN (seen by the load balancer)
    expect(resolveClientIp(xff("1.1.1.1, 203.0.113.7, 10.0.0.2"), 2)).toBe("203.0.113.7");
  });

  it("trusts nothing when the chain is shorter than the configured proxies", () => {
    expect(resolveClientIp(xff("203.0.113.7"), 2)).toBeUndefined();
    expect(resolveClientIp(xff(), 0)).toBeUndefined();
    expect(resolveClientIp(xff(""), 1)).toBeUndefined();
  });

  it.each([
    ["203.0.113.7:51234", "203.0.113.7"],
    ["2001:db8::1", "2001:db8::1"],
    ["[2001:db8::1]:443", "2001:db8::1"],
    ["::ffff:203.0.113.7", "::ffff:203.0.113.7"],
  ])("normalises %s", (entry, ip) => {
    expect(resolveClientIp(xff(entry), 1)).toBe(ip);
  });

  it.each(["unknown", "evil.example.com", "999.1.1.1", "1.2.3.4; drop", "<script>"])(
    "rejects a non-IP value (%s)",
    (entry) => {
      expect(resolveClientIp(xff(entry), 1)).toBeUndefined();
    },
  );
});
