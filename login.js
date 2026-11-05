//ОБЩИЕ ЭЛЕМЕНТЫ
const form = document.querySelector("#loginForm");
const submitBtn = document.querySelector("#submitBtn");
const successModal = document.querySelector("#successModal");
const modalClose = document.querySelector("#modalClose");

let touched = {
  email: false,
  password: false
};
//ОБЩИЕ ФУНКЦИИ
function showError(input, el, msg) {
  input.classList.add("error");
  input.classList.remove("success");
  el.textContent = msg;
}
function showSuccess(input, el) {
  input.classList.remove("error");
  input.classList.add("success");
  el.textContent = "";
}
function validateSingleField(input, errorElement, validator) {
  const result = validator(input.value);
  if (result.valid) {
    showSuccess(input, errorElement);
  } else {
    showError(input, errorElement, result.message);
  }
}
//ВАЛИДАЦИЯ EMAIL
const email = document.querySelector("#email");
const emailError = document.querySelector("#emailError");
function validateEmail(value) {
  const trimmer = value.trim();
  if (!trimmer) return { valid: false, message: "Введите email"};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmer)) return { valid: false, message: "Неверный email"};
  return { valid: true, message: ""};
}
email.addEventListener("input", ( => {
  if (touched.email) validateSingleField(email, emailError, validateEmail);
  updateSubmitState ();
}));
email.addEventListener("blur", () => {
  touched.email = true;
  validateSingleField(email, emailError, validateEmail);
  updateSubmitState();
});
//ПАРОЛЬ
const password = document.querySelector("#password");
const passwordError = document.querySelector("#passwordError");
function validatePassword(value) {
  if (!value) return { valid: false, message: "Введите пароль"};
  if (value.length < 8) return {valid: false, message: "Минимум 8 символов"};
  return {valid: true, message: ""}; 
}
password.addEventListener("input", () => {
  if (touched.password) validateSingleField(password, passwordError, validatePassword);
  updateSubmitState();
});
password.addEventListener("blur", () => {
  touched.password = true;
  validateSingleField(password, passwordError, validatePassword);
  updateSubmitState();
});
//ОБЩАЯ ПРОВЕРКА ФОРМЫ
function updateSubmitState() {
  const r1 = validateEmail(email.value).valid;
  const r2 = validatePassword(password.value).valid;
  submitBtn.disabled = !(r1 && r2);
}
function validateForm() {
  const r1 = validateEmail(email.value);
  const r2 = validatePassword(password.value);
  const ok = r1.valid && r2.valid;
  submitBtn.disabled = !ok;
  return ok;
}
//ПОКАЗА ПАРОЛЯ
const togglePassword = document.querySelector("#togglePassword");
if (togglePassword) {
  togglePassword.addEventListener("click", () => {
    password.type = password.type === "password" ? "text" : "password";
    togglePassword.textContent = password.type === "password" ? "👁️" : "🙈";
  });
}
//МОДАЛКА И ЗАГРУЗКА
function showModal() {
  if (successModal) successModal.classList.add("active");
}
function hideModal() {
  if (successModal) successModal.classList.remove("active");
}
function setLoading(isLoading) {
  if (isLoading) {
    submitBtn.classList.add("loading");
    submitBtn.disabled = true;
  } else {
    submitBtn.classList.remove("loading");
    submitBtn.disabled = false;
  }
}
if (modalClose) {
  modalClose.addEventListener("click", hideModal);
}
if (successModal) {
  successModal.addEventListener("click", (event) => {
    if (event.target === successModal) hideModal();
  });
}
//ОТПРАВКА ФОРМЫ
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  touched = { email: true, password: true};
  validateSingleField(email, emailError, validateEmail);
  validateSingleField(password, passwordError, validatePassword);
  if (!validateForm()) return;
  setLoading(true);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  setLoading(false);
  showModal();
  form.requestFullscreen();
  submitBtn.disabled = true;
  [email, password].forEach((input) => input.classList.remove("success"));
});
//ЗАПУСК
updateSubmitState();
if (!email.value) email.focus();