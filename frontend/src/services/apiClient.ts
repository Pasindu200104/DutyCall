// The address of the mock API. It can be changed with the VITE_API_URL setting.
const API_URL: string = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

// A custom error that carries a friendly message the UI can show to the user.
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// One function used by every service to talk to the API, so error handling lives in one place.
export async function request<ResponseType>(
  path: string,
  options: RequestInit = {}
): Promise<ResponseType> {
  let response: Response;

  // Step 1: send the request. If this fails, the server is off or the network is down.
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new ApiError(
      "Cannot reach the server. Check your connection and make sure the backend is running on port 4000.",
      0
    );
  }

  // Step 2: if the server answered with an error code, turn it into a friendly message.
  if (!response.ok) {
    if (response.status === 404) {
      throw new ApiError("We could not find what you were looking for.", 404);
    }
    throw new ApiError("Something went wrong on the server. Please try again.", response.status);
  }

  // Step 3: delete requests return an empty body, so only read JSON when there is some.
  const text = await response.text();
  return (text ? JSON.parse(text) : null) as ResponseType;
}
