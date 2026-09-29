import { ConflictError, ValidationError } from "../../src/core/errors/domain-errors.js";
import { UserService } from "../../src/core/services/user.service.js";
import { InMemoryUserRepository } from "../helpers.js";

describe("UserService (Unit)", () => {
  let userRepo: InMemoryUserRepository;
  let userService: UserService;

  beforeEach(() => {
    userRepo = new InMemoryUserRepository();
    userService = new UserService(userRepo);
  });

  describe("createUser", () => {
    it("creates a new user successfully", async () => {
      const user = await userService.createUser({
        name: "Alice",
        email: "alice@example.com",
      });

      expect(user).toHaveProperty("id");
      expect(user.name).toBe("Alice");
      expect(user.email).toBe("alice@example.com");
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it("throws ValidationError if name is missing", async () => {
      await expect(
        userService.createUser({ name: "", email: "alice@example.com" })
      ).rejects.toThrow(ValidationError);
      await expect(
        userService.createUser({ name: "   ", email: "alice@example.com" })
      ).rejects.toThrow("name is required");
    });

    it("throws ValidationError if email is missing", async () => {
      await expect(
        userService.createUser({ name: "Alice", email: "" })
      ).rejects.toThrow(ValidationError);
      await expect(
        userService.createUser({ name: "Alice", email: "   " })
      ).rejects.toThrow("email is required");
    });

    it("throws ConflictError if email is already in use", async () => {
      await userService.createUser({
        name: "Alice",
        email: "alice@example.com",
      });

      await expect(
        userService.createUser({
          name: "Alice 2",
          email: "alice@example.com",
        })
      ).rejects.toThrow(ConflictError);

      await expect(
        userService.createUser({
          name: "Alice 2",
          email: "alice@example.com",
        })
      ).rejects.toThrow("email already in use");
    });
  });

  describe("listUsers & getUserById", () => {
    it("lists all users", async () => {
      const u1 = await userService.createUser({
        name: "User 1",
        email: "u1@example.com",
      });
      const u2 = await userService.createUser({
        name: "User 2",
        email: "u2@example.com",
      });

      const users = await userService.listUsers();
      expect(users.length).toBe(2);
      expect(users.map((u) => u.email)).toContain("u1@example.com");
      expect(users.map((u) => u.email)).toContain("u2@example.com");
    });

    it("gets user by ID if found", async () => {
      const created = await userService.createUser({
        name: "Alice",
        email: "alice@example.com",
      });

      const found = await userService.getUserById(created.id);
      expect(found).not.toBeNull();
      expect(found?.email).toBe("alice@example.com");
    });

    it("returns null if user ID is not found", async () => {
      const found = await userService.getUserById("non-existent-id");
      expect(found).toBeNull();
    });
  });
});
