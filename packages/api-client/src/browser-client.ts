import { HttpClient } from "./http";
import { createApi, type IrateApi } from "./api";

let browserApi: IrateApi | null = null;
let onUnauthorizedHandler: (() => void) | undefined;

/**
 * Register the app-level handler invoked when a same-origin request returns 401
 * (i.e. the BFF could not refresh the session). Apps redirect to /login here.
 */
export function setOnUnauthorized(handler: () => void) {
  onUnauthorizedHandler = handler;
}

/**
 * The singleton browser API. All requests are same-origin to the Next.js BFF,
 * so the browser never sees or stores a token — cookies are httpOnly.
 */
export function getBrowserApi(): IrateApi {
  if (!browserApi) {
    const client = new HttpClient({
      baseUrl: "",
      withCredentials: true,
      onUnauthorized: () => onUnauthorizedHandler?.(),
    });
    browserApi = createApi(client);
  }
  return browserApi;
}
