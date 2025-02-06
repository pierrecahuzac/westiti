import { submitLogin } from "../user.fonction";
import {describe, expect, it, beforeAll, afterEach, afterAll, vi} from "vitest";

import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const mockedCredentials = {
  email: "test@test.com",
  password: "T35t!!32**",
};

describe("submitLogin", () => {
  let mock 

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset(); 
  });

  afterAll(() => {
    mock.restore(); 
  });
  
  it("use should login with goods credentials", async () => {
    // awaiting good response
    const mockResponse = {
      data: {
        id: "123456789",
        username: "test",       
        access_token:        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      },
    };
    // user mocked datas 
    const email = mockedCredentials.email;
    const password = mockedCredentials.password;
   
    mock
      .onPost(`${import.meta.env.VITE_API_URL}/auth/login`)
      .reply(200, mockResponse);
    
    const mockEvent = { preventDefault: vi.fn() };
    const response = await submitLogin(mockEvent,password, email);
    
    expect(response.status).toBe(200);
    expect(response.data).toStrictEqual(mockResponse);
  });

  it("should failed with bad credentials", async () => {
    // awaiting bad response
    const mockErrorResponse = {
      response: {
        status: 401,
        data: {
          message: "Bad credentials",
        },
      },
    };
    mock
      .onPost(`${import.meta.env.VITE_API_URL}/user/login`)
      .reply(401, mockErrorResponse);

    const mockEvent = { preventDefault: vi.fn() };
    try {
      await submitLogin(
        mockEvent,
        mockedCredentials.password,
        mockedCredentials.email
      );
    } catch (error) {
      expect(error.response.status).toBe(401);
      expect(error.response.data.message).toBe("Bad credentials");
    }
  });
});