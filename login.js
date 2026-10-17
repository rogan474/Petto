// ==========================================
// 1. ПОИСК ЭЛЕМЕНТОВ
// ==========================================
const form = document.querySelector("#loginForm");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const emailError = document.querySelector("#emailError");
const passwordError = document.querySelector("#passwordError");
const submitBtn = document.querySelector("#submitBtn");
const togglePassword = document.querySelector("#togglePassword");

const successModal = document.querySelector("#successModal");
const modalClose = document.querySelector("#modalClose");

// ==========================================
// 2. ОБЪЯВЛЕНИЕ ФУНКЦИЙ
// ==========================================
const validateEmail = (value) => {
  const trimmed = value.trim();
  if (!trimmed) return { valid: false, message: "Введите email" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return { valid: false, message: "Неверный email" };
  return { valid: true, message: "" };
};

const validatePassword = (value) => {
  if (!value) return { valid: false, message: "Введите пароль" };
  if (value.length < 8) return { valid: false, message: "Минимум 8 символов" };
  return { valid: true, message: "" };
};

const showError = (input, el, msg) => {
  input.classList.add("error");
  input.classList.remove("success");
  el.textContent = msg;
};

const showSuccess = (input, el) => {
  input.classList.remove("error");
  input.classList.add("success");
  el.textContent = "";
};

const validateSingleField = (input, errorElement, validator) => {
  const result = validator(input.value);
  if (result.valid) {
    showSuccess(input, errorElement);
  } else {
    showError(input, errorElement, result.message);
  }
};

const updateSubmitState = () => {
  const r1 = validateEmail(email.value).valid;
  const r2 = validatePassword(password.value).valid;
  submitBtn.disabled = !(r1 && r2);
};

const validateForm = () => {
  const r1 = validateEmail(email.value);
  const r2 = validatePassword(password.value);
  const ok = r1.valid && r2.valid;
  submitBtn.disabled = !ok;
  return ok;
};

const showModal = () => {
  if (successModal) successModal.classList.add("active");
};

const hideModal = () => {
  if (successModal) successModal.classList.remove("active");
};

const setLoading = (isLoading) => {
  if (isLoading) {
    submitBtn.classList.add("loading");
    submitBtn.disabled = true;
  } else {
    submitBtn.classList.remove("loading");
    submitBtn.disabled = false;
  }
};

// ==========================================
// 3. СОБЫТИЯ
// ==========================================
let touched = {
  email: false,
  password: false
};

// --- Email ---
email.addEventListener("input", () => {
  if (touched.email) validateSingleField(email, emailError, validateEmail);
  updateSubmitState();
});
email.addEventListener("blur", () => {
  touched.email = true;
  validateSingleField(email, emailError, validateEmail);
  updateSubmitState();
});

// --- Пароль ---
password.addEventListener("input", () => {
  if (touched.password) validateSingleField(password, passwordError, validatePassword);
  updateSubmitState();
});
password.addEventListener("blur", () => {
  touched.password = true;
  validateSingleField(password, passwordError, validatePassword);
  updateSubmitState();
});

// --- Кнопка "Глаз" ---
if (togglePassword) {
  togglePassword.addEventListener("click", () => {
    password.type = password.type === "password" ? "text" : "password";
    togglePassword.textContent = password.type === "password" ? "👁️" : "🙈";
  });
}

// --- Закрытие модалки ---
if (modalClose) {
  modalClose.addEventListener("click", hideModal);
}
if (successModal) {
  successModal.addEventListener("click", (event) => {
    if (event.target === successModal) hideModal();
  });
}

// --- ОТПРАВКА ФОРМЫ (с загрузкой) ---
form.addEventListener("submit", async (event) => {
  event.preventDefault();
 
  // 1. Показываем ошибки
  touched = { email: true, password: true };
  validateSingleField(email, emailError, validateEmail);
  validateSingleField(password, passwordError, validatePassword);

  // 2. Если есть ошибки — прерываем
  if (!validateForm()) return;

  // 3. Включаем спиннер
  setLoading(true);

  // 4. Имитация запроса (1.5 секунды)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // 5. Выключаем спиннер и показываем модалку
  setLoading(false);
  showModal();

  // 6. Очищаем форму
  form.reset();
  submitBtn.disabled = true;
  [email, password].forEach((input) => input.classList.remove("success"));
});

// ==========================================
// 4. СТАРТ ПРОГРАММЫ
// ==========================================
updateSubmitState();
if (!email.value) email.focus();