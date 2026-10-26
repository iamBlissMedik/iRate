import { HttpClient } from "./http";
import { createApi, type IrateApi } from "./api";

let browserApi: IrateApi | null = null;

/**
 * The singleton browser API. All requests are same-origin to the Next.js BFF,
 * so the browser never sees or stores a token — cookies are httpOnly.
 */
export function getBrowserApi(): IrateApi {
  browserApi ??= createApi(new HttpClient({ baseUrl: "", withCredentials: true }));
  return browserApi;
}
