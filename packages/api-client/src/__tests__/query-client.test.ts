import { describe, expect, it, vi } from "vitest";
import { ApiError } from "../errors";
import { createQueryClient } from "../react/query-client";

const unauthorized = new ApiError({ status: 401, message: "Session expired" });
const serverError = new ApiError({ status: 500, message: "Boom" });

function setup() {
  const onError = vi.fn();
  const onUnauthorized = vi.fn();
  const client = createQueryClient({ onError, onUnauthorized });
  vi.spyOn(console, "error").mockImplementation(() => {});
  return { client, onError, onUnauthorized };
}

describe("createQueryClient", () => {
  it("routes a query 401 to onUnauthorized without an error toast", async () => {
    const { client, onError, onUnauthorized } = setup();
    await client
      .fetchQuery({ queryKey: ["q"], queryFn: () => Promise.reject(unauthorized) })
      .catch(() => {});
    expect(onUnauthorized).toHaveBeenCalledOnce();
    expect(onError).not.toHaveBeenCalled();
  });

  it("reports other query failures through onError", async () => {
    const { client, onError } = setup();
    await client
      .fetchQuery({ queryKey: ["q"], queryFn: () => Promise.reject(serverError), retry: false })
      .catch(() => {});
    expect(onError).toHaveBeenCalledWith("Boom", serverError);
  });

  it("leaves mutation errors to the caller, except 401", async () => {
    const { client, onError, onUnauthorized } = setup();
    const run = (error: ApiError) =>
      client
        .getMutationCache()
        .build(client, { mutationFn: () => Promise.reject(error) })
        .execute(undefined)
        .catch(() => {});
    await run(serverError);
    expect(onError).not.toHaveBeenCalled();
    await run(unauthorized);
    expect(onUnauthorized).toHaveBeenCalledOnce();
  });
});
