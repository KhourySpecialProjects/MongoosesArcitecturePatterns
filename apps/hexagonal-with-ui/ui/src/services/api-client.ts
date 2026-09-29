import { STRINGS } from "../constants/strings";

/**
 * Custom error class representing an HTTP or network failure from the API client.
 */
export class ApiClientError extends Error {
  /** The HTTP status code returned by the server, if any. */
  public readonly status?: number;

  /**
   * Constructs a new ApiClientError instance.
   *
   * @param message - The human-readable error description.
   * @param status - The optional HTTP status code.
   */
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
  }
}

/**
 * Executes an HTTP request against the backend API with unified error parsing and response serialization.
 *
 * @template T - Expected type of the JSON response payload.
 * @param endpoint - The relative endpoint path (e.g. "/users").
 * @param options - Standard Fetch RequestInit configuration options.
 * @returns A promise resolving to the parsed response data of type T.
 * @throws {ApiClientError} When the HTTP status indicates an error or network failure occurs.
 */
export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "/api";
  const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage: string = STRINGS.ERRORS.UNKNOWN_ERROR;
      try {
        const errorData = await response.json();
        if (errorData && typeof errorData.error === "string") {
          errorMessage = errorData.error;
        } else if (errorData && typeof errorData.message === "string") {
          errorMessage = errorData.message;
        }
      } catch {
        errorMessage = response.statusText || `${STRINGS.ERRORS.UNKNOWN_ERROR} (${response.status})`;
      }
      throw new ApiClientError(errorMessage, response.status);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new ApiClientError(error.message || STRINGS.ERRORS.NETWORK_ERROR);
    }
    throw new ApiClientError(STRINGS.ERRORS.NETWORK_ERROR);
  }
}
