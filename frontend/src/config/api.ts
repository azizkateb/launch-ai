const API_URL = "https://launch-ai.onrender.com";
const DEFAULT_TIMEOUT = 20000;

export async function apiFetch(path: string, options: RequestInit = {}, timeout = DEFAULT_TIMEOUT) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeout);

  try {
    const url = `${API_URL}${path}`;
    const response = await fetch(url, { ...options, signal: controller.signal });
    const contentType = response.headers.get("Content-Type") ?? "";
    const isJson = contentType.includes("application/json");

    const payload = isJson
      ? await response.json().catch(() => null)
      : await response.text().then((text) => (text ? { message: text } : null));

    if (!response.ok) {
      const message = payload?.error || payload?.message || `${response.status} ${response.statusText}`;
      throw new Error(message);
    }

    if (payload === null || payload === undefined) {
      throw new Error("Invalid response from server. Please try again.");
    }

    return payload;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }

    if (error instanceof Error && error.message.includes("Failed to fetch")) {
      throw new Error("Unable to reach the backend. Please check your network or try again later.");
    }

    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export default API_URL;
