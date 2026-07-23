"use strict";

const form = document.getElementById("login-form");
const userInput = document.getElementById("name-input");
const passwordInput = document.getElementById("password-input");
const submitBtn = document.getElementById("submit-input");
const errorMsg = document.getElementById("error-msg");

const showError = (msg) => {
  errorMsg.textContent = msg;
  errorMsg.classList.remove("hidden");
};

const hideError = () => {
  errorMsg.classList.add("hidden");
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideError();

  const username = userInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username) {
    showError("Username is required");
    userInput.focus();
    return;
  }

  if (!password) {
    showError("Password is required");
    passwordInput.focus();
    return;
  }

  submitBtn.disabled = true;
  submitBtn.value = "Logging in...";

  try {
    const res = await fetch("/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: username, password }),
    });

    if (res.ok) {
      window.location.href = "/";
    } else {
      showError("Invalid username or password");
    }
  } catch {
    showError("Something went wrong. Try again.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.value = "Send";
  }
});
