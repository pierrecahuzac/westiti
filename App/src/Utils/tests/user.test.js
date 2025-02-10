import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { submitLogin } from "../../Utils/user.fonction"; 

describe("submitLogin function", () => {
  beforeEach(() => {
    vi.restoreAllMocks(); 
  });
 
  it("should return a valid response when sucess auth", async () => {

    const fakeEvent = { preventDefault: vi.fn() };

    vi.spyOn(axios, "post").mockResolvedValueOnce({
      data: {
        id: "123",
        username: "TestUser",
        access_token: "fake_token_123",
      },
    });

    const response = await submitLogin(fakeEvent, "password123", "test@example.com");

    expect(response?.data).toEqual({
      id: "123",
      username: "TestUser",
      access_token: "fake_token_123",
    });

    expect(fakeEvent.preventDefault).toHaveBeenCalled();
  });

  it("should return a 401 error with bad credentials", async () => {
    const fakeEvent = { preventDefault: vi.fn() };


    vi.spyOn(axios, "post").mockRejectedValueOnce({
      response: {
        status: 401,
        data: { message: "Bad credentials" },
      },
    });

    const response = await submitLogin(fakeEvent, "wrongpassword", "wrong@example.com");

    expect(response.response.status).toBe(401);
  });

  it("shoud rerturn a network error", async () => {
    const fakeEvent = { preventDefault: vi.fn() };

    vi.spyOn(axios, "post").mockRejectedValueOnce(new Error("Network Error"));
    const mockedLogin = vi.fn(submitLogin)
    const response = await mockedLogin(fakeEvent, "password123", "test@example.com");

    expect(response.message).toBe("Network Error");
  });
});
