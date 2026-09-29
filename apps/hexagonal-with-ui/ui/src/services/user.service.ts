import { CreateUserPayload, User } from "../types/user.types";
import { request } from "./api-client";

/**
 * Registers a new user account with the hexagonal backend.
 *
 * @param payload - The user details containing name and email.
 * @returns A promise resolving to the newly created User entity.
 */
export async function registerUser(payload: CreateUserPayload): Promise<User> {
  return request<User>("/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Fetches all registered users from the backend.
 *
 * @returns A promise resolving to an array of User entities.
 */
export async function fetchUsers(): Promise<User[]> {
  return request<User[]>("/users", {
    method: "GET",
  });
}

/**
 * Fetches a single user entity by unique identifier.
 *
 * @param id - The UUID of the user to retrieve.
 * @returns A promise resolving to the User entity.
 */
export async function fetchUserById(id: string): Promise<User> {
  return request<User>(`/users/${encodeURIComponent(id)}`, {
    method: "GET",
  });
}
