import { test, expect, vi } from "vitest";
import axios from "axios";
import { submitLogin } from "../user.fonction";

// Moquer Axios
vi.mock("axios");

test("submitLogin should return mocked response data", async () => {
  const email = "test@test.com";
  const password = "password123";

  // define mocked response data
  const mockResponse = {
    id: "2f6e58d1-f9a1-400-8332-d11cfeea292d",
    username: "test",
    access_token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJmNmU1OGQxLWY5YTEtNDBiMC04MzMyLWQxMWNmZWVhMjkyZCIsImVtYWlsIjoiY2FodXphYy5wQGdtYWlsLmNvbSIsImlhdCI6MTczNzM5MTMwNywiZXhwIjoxNzM3Mzk0OTA3fQ.xDDQZ8Kz9bpL7KPnQZcd_NKnjVg85Md6liqVhCc1NtQ",
  };

  // Configurer le mock pour retourner la réponse simulée
  //@ts-ignore
  axios.post.mockResolvedValue(mockResponse);

  const mockEvent = { preventDefault: vi.fn() };

  // function to test
  const response = await submitLogin(mockEvent, password, email);

  // Assertions mises à jour
  //const baseURL = import.meta.VITE_API;
  expect(axios.post).toHaveBeenCalledOnce(); // function called one time
  expect(axios.post).toHaveBeenCalledWith(
    `http://localhost:3000/api/auth/login`,
    {
      email: email,
      password: password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  ); // function called with expected arguments

  expect(response).toEqual(mockResponse);
});


