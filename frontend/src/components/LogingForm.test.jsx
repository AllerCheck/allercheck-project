import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import "@testing-library/jest-dom";

describe("LoginForm", () => {
  test("renders login form with email and password inputs", () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByTestId("login-button")).toBeInTheDocument();
  });

  test("allows user to input email and password", () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");

    fireEvent.change(emailInput, { target: { value: "team@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "test12345" } });

    expect(emailInput.value).toBe("team@gmail.com");
    expect(passwordInput.value).toBe("test12345");
  });

  test("calls login function when form is submitted", async () => {
    global.fetch = vi.fn((url) =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve(
            url.includes("login")
              ? { token: "test-token" }
              : { first_name: "John" }
          ),
      })
    );

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId("email-input"), {
      target: { value: "team@gmail.com" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "test12345" },
    });

    // Wrapping with act to ensure state updates are handled correctly
    await act(async () => {
      fireEvent.submit(screen.getByTestId("login-form"));
    });

    // Verifying the fetch calls
    expect(fetch).toHaveBeenCalledTimes(2); // One for login, one for profile
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:5000/auth/login",
      expect.objectContaining({
        method: "POST",
      })
    );

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:5000/profile",
      expect.objectContaining({
        method: "GET",
      })
    );
  });

  test("shows alert on login failure", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: "Invalid credentials" }),
      })
    );

    window.alert = vi.fn();

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId("email-input"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "wrongpassword" },
    });

    // Wrapping with act to ensure proper async behavior
    await act(async () => {
      fireEvent.submit(screen.getByTestId("login-form"));
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith("Invalid credentials");
  });
});
