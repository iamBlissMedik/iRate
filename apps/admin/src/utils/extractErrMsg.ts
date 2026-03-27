import axios from "axios";

export function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    // can also safely check nested response message
    return (
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "An error occurred"
    );
  }

  if (err instanceof Error) {
    return err.message || "An error occurred";
  }

  if (typeof err === "string") return err;

  return "An error occurred";
}
