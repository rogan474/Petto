//ОБЩИЕ ЭЛЕМЕНТЫ
const form = document.querySelector("#registerForm");
const submitBtn = document.querySelector("#submitBtn");
const successModal = document.querySelector("#successModal");
const modalClose = document.querySelector("#modalClose");
let touched = {
  username: false,
  fullName: false,
  email: false,
  password: false
};
//ОБЩИЕ ФУНКЦИИ
function showSuccess(input, errorElement) {
  input.classList.remove("error");
  input.classList.add("success");
  errorElement.textContent = "";
}
function validateSingleField(input, errorElement, validator) {
  const result = validator(input.value);
  if (result.valid) {
    showSuccess(input,errorElement);
  } else {
    showError(input, errorElement, result.message);
  }
}
//ВАЛИДАЦИЯ ИМЕНИ ПОЛЬЗОВАТЕЛЯ
const username = document.querySelector("#username");
const usernameError = document.querySelector("#usernameError");
function validateUsername(value) {
  const trimmed = value.trim();
  if (trimmed === "") return { valid: false, message: "Введите имя пользователя"};
  if (trimmed.length > 20) return { valid: false, message: "Максимум 20 символов"};
  if (!/^[а-яА-Яa-zA-Z0-9_]+$/.test(trimmed)) return { valid: false, message: "Только буквы, цифры и _"};
}
username.addEventListener("input", () => {
  if (touched.username) validateSingleField(username, usernameError, validateUsername);
  updateSubmitState();
  saveDraft();
});
username.addEventListener("blur", () => {
  touched.username = true;
  validateSingleField(username, usernameError, validateUsername);
  updateSubmitState();
});
//ВАЛИДАЦИЯ ИМЕНИ И ФАМИЛИИ 
const fullName = document.querySelector("#name");
const nameError = document.querySelector("#nameError");
 function validateName(value) {
  const trimmed = value.trim();
  if (trimmed === "") return { valid: false, message: "Введите имя и фамилию"};
  if (trimmed.length < 2) return { valid: false, message: "Слишком короткое имя"};
  return { valid: true, message: ""};
 }
 fullName.addEventListener("input", () => {
  if (touched.fullName) validateSingleField(fullName, nameError, validateName);
  updateSubmitState();
  saveDraft();
 });
 fullName.addEventListener("blur", () => {
  touched.fullName = true;
  validateSingleField(fullName> nameError, validateName);
  updateSubmitState();
 });
 //ВАЛИДАЦИЯ EMAIL
 const email = document.querySelector("#email");
 const emailError = document.querySelector("#emailError");
 function validateEmail(value) {
  const trimmed = value.trim();
  if (trimmed === "") return { valid: false, message: "Введите email"};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return { valid: false, message: "Неверный email"};
  return { valid: true, message: ""};
 }
 email.addEventListener("input", () => {
  if (touched.email) validateSingleField(email, emailError,validateEmail);
  updateSubmitState();
  saveDraft();
 });
 email.addEventListener("blur", () => {
  touched.email = true;
  validateSingleField(email, emailError, validateEmail);
  updateSubmitState();
 });
 //ВАЛИДАЦИЯ ПАРОЛЯ
 const password = document.querySelector("#password");
 const passwordError = document.querySelector("#passwordError");
 function validatePassword(value) {
  if (value === "") return { valid: false, message: "Введите пароль"};
  if (value.length < 8) return { valid: false, message: "Минимум 8 символов"};
  if (!/[a-zA-Z]/.test(value)) return { valid: false, message: "Добавте букву"};
  if (!/\d/.test(value)) return { velid: false, message: "Добавте цифру"};
  return { valid: true, message: ""};
 }
 password.addEventListener("input", (event) => {
  if (touched.password) validateSingleField(password, passwordError, validatePassword);
  updateStrength(event.target.value);
  updateSubmitState();
 });
 password.addEventListener("blur", () => {
  touched.password = true;
  validateSingleField(password, passwordError, validatePassword);
  updateSubmitState();
 });
 //СИЛА ПАРОЛЯ
 const strengthFill = document.querySelector("#strengthFill");
 const strengthText = document.querySelector("#strengthText");
 const levels = [
  { width: "0%", color: "#eee", text: ""},
  { width: "25%", color: "#e74c3c", text: "Очень слабый"},
  { width: "50%", color: "#f39c12", text: "Слабый"},
  { width: "75%", color: "#3498db", text: "Средний"},
  { width: "100%", color: "#27ae60", text: "Сильный"},
 ];
 function checkStrength(value) {
  let strength = 0;
  if (value.length >= 8) strength++;
  if (/[a-z]/.test(value)) strength++;
  if (/\d/.test(value)) strength++;
  if (/[^a-zA-Z0-9]/.test(value)) strength++;
  if (value.length >= 12) strength++;
  return Math.min(strength, 4);
 }
 function updateStrength(value) {
  const strength = checkStrength(value);
  const level = levels[strength];
  if (!strengthFill || !strengthText) return;
  strengthFill.style.width = level.width;
  strengthFill.style.background = level.color;
  strengthText.textContent = level.text;
  strengthText.style.color = level.color;
 }
 //ВАЛИДАЦИЯ СОГЛАСИЯ
 const terms = document.querySelector("#terms");
 const termsError = document.querySelector("#termsError");
 function validateTerms() {
  if (!terms.checked) return { valid: false, message: "Отметьте согласие"};
  return { valid: true, message: ""};
 }
 terms.addEventListener("change", () => {
  termsError.textContent = terms.checked ? "" : "Отметьте согласие";
  updateSubmitState();
 });
 //ОБЩАЯ ПРОВЕРКА ФОРМЫ
 function validateForm() {
  const r1 = validateUsername(username.value);
  const r2 = validatename(fullName.value);
  const r3 = validateEmail(email.value);
  const r4 = validatePassword(password.value);
  const r5 = validateTerms();
  const allValid = r1.valid && r2.valid && r3.valid && r4.valid && r5.valid;
  submitBtn.disabled = !allValid;
  return allValid;
 }
 function updateSubmitState() {
  const r1 = validateUsername(username.value).valid;
  const r2 = validateName(fullName.value).valid;
  const r3 = validateEmail(email.value).valid;
  const r4 = validatePassword(password.value).valid;
  const r5 = validateTerms().valid;
  submitBtn.disabled = !(r1 && r2 && r3 && r4 && r5);
 }
 //ЧЕРНОВИК
 function saveDraft() {
  const draft = { username: username.value, email: email.value, name: fullName.value};
  try { localStorage.setItem("registerDraft", JSON.stringify(draft)); } catch (e) {}
 }
 function loadDraft() {
  try {
    const saved = localStorage.getItem("registerDraft");
    if (!saved) return;
    const draft = JSON.parse(saved);
    username.value = draft.username || "";
    email.value = draft.email || "";
    fullName.value = draft.name || "";
  } catch (e) {}
 }
 function clearDraft() {
  try { localStorage.removeItem("registerDraft"); } catch (e) {}
 }
 //ПОКАЗ ПАРОЛЯ
 const togglePassword = document.querySelector("#togglePassword");
 if (togglePassword) {
  togglePassword.addEventListener("click", () => {
    if (password.type === "password") {
      password.type = "text";
      togglePassword.textContent = "🙈";
    } else {
      password.type = "password";
      togglePassword.textContent = "👁️";
    }
  });
 }
//МОДАЛКА И ЗАГРУЗКА
function showModal() {
  successModal.classList.add("active");
}
function hideModal() {
  successModal.classList.remove("active");
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
  touched = { username: true, fullName: true, email: true, password: true};
  validateSingleField(username, usernameError, validateUsername);
  validateSingleField(fullName, nameError, validateName);
  validateSingleField(email, emailError, validateEmail);
  validateSingleField(password, passwordError, validatePassword);
  termsError.textContent = terms.checked ? "" : "Отметьте согласие";
  if (!validateForm()) return;
  setLoading(true);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  setLoading(false);
  showModal();
  form.reset();
  submitBtn.disabled = true;
  [username, fullName, email, password].forEach((input) => {
    input.classList.remove("seccess");
  });
  termsError.textContent = "";
  updateStrength("");
  clearDraft();
});
//ЗАПУСК
loadDraft();
updateStrength(password.value);
updateSubmitState();
if (!email.value) email.focus();
else if (!username.value) username.focus();
else if (!fullName.value) fullName.focus();