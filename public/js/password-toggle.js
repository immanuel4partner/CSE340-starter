document.addEventListener("DOMContentLoaded", () => {
  const toggleButtons = document.querySelectorAll(".toggle-password");

  toggleButtons.forEach((toggleBtn) => {
    const pwdInput = document.getElementById(
      toggleBtn.getAttribute("data-target")
    );

    if (!pwdInput) return;

    toggleBtn.addEventListener("click", () => {
      const isPassword = pwdInput.type === "password";

      // toggle input type
      pwdInput.type = isPassword ? "text" : "password";

      // toggle icon
      toggleBtn.textContent = isPassword ? "🙈" : "👁️";

      // accessibility state
      toggleBtn.setAttribute("aria-pressed", String(isPassword));
    });
  });
});