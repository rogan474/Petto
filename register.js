// ==========================================
// 1. ПОИСК ЭЛЕМЕНТОВ
// ==========================================
const form = document.querySelector("#registerForm");

const username = document.querySelector("#username");
const email = document.querySelector("#email");
const fullName = document.querySelector("#name");
const password = document.querySelector("#password");
const terms = document.querySelector("#terms");

const strengthFill = document.querySelector("#strengthFill");
const strengthText = document.querySelector("#strengthText");

const successModal = document.querySelector("#successModal");
const modalClose = document.querySelector("#modalClose");

const usernameError = document.querySelector("#usernameError");
const emailError = document.querySelector("#emailError");
const nameError = document.querySelector("#nameError");
const passwordError = document.querySelector("#passwordError");
const termsError = document.querySelector("#termsError");

const submitBtn = document.querySelector("#submitBtn");
const togglePassword = document.querySelector("#togglePassword");

// ==========================================
// 2. ОБЪЯВЛЕНИЕ ФУНКЦИЙ
// ==========================================

// --- Валидация полей ---
const validateUsername = (value) => {
  const trimmed = value.trim();
  if (trimmed === "") return { valid: false, message: "Введите имя пользователя" };
  if (trimmed.length > 20) return { valid: false, message: "Максимум 20 символов" };
  if (!/^[а-яА-Яa-zA-Z0-9_]+$/.test(trimmed)) return { valid: false, message: "Только буквы, цифры и _" };
  return { valid: true, message: "" };
};

const validateName = (value) => {
  const trimmed = value.trim();
  if (trimmed === "") return { valid: false, message: "Введите имя и фамилию" };
  if (trimmed.length < 2) return { valid: false, message: "Слишком короткое имя" };
  return { valid: true, message: "" };
};

const validateEmail = (value) => {
  const trimmed = value.trim();
  if (trimmed === "") return { valid: false, message: "Введите email" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return { valid: false, message: "Неверный email" };
  return { valid: true, message: "" };
};

const validatePassword = (value) => {
  if (value === "") return { valid: false, message: "Введите пароль" };
  if (value.length < 8) return { valid: false, message: "Минимум 8 символов" };
  if (!/[a-zA-Z]/.test(value)) return { valid: false, message: "Добавьте букву" };
  if (!/\d/.test(value)) return { valid: false, message: "Добавьте цифру" };
  return { valid: true, message: "" };
};

const validateTerms = () => {
  if (!terms.checked) return { valid: false, message: "Отметьте согласие" };
  return { valid: true, message: "" };
};

// --- Показ состояний (ошибка/успех) ---
const showError = (input, errorElement, message) => {
  input.classList.add("error");
  input.classList.remove("success");
  errorElement.textContent = message;
};

const showSuccess = (input, errorElement) => {
  input.classList.remove("error");
  input.classList.add("success");
  errorElement.textContent = "";
};

const validateSingleField = (input, errorElement, validator) => {
  const result = validator(input.value);
  if (result.valid) {
    showSuccess(input, errorElement);
  } else {
    showError(input, errorElement, result.message);
  }
};

// --- Общая проверка формы ---
const validateForm = () => {
  const r1 = validateUsername(username.value);
  const r2 = validateName(fullName.value);
  const r3 = validateEmail(email.value);
  const r4 = validatePassword(password.value);
  const r5 = validateTerms();

  const allValid = r1.valid && r2.valid && r3.valid && r4.valid && r5.valid;
  submitBtn.disabled = !allValid;
  return allValid;
};

const updateSubmitState = () => {
  const r1 = validateUsername(username.value).valid;
  const r2 = validateName(fullName.value).valid;
  const r3 = validateEmail(email.value).valid;
  const r4 = validatePassword(password.value).valid;
  const r5 = validateTerms().valid;
  submitBtn.disabled = !(r1 && r2 && r3 && r4 && r5);
};

// --- Шкала надежности пароля ---
const checkStrength = (value) => {
  let strength = 0;
  if (value.length >= 8) strength++;
  if (/[a-z]/.test(value)) strength++;
  if (/\d/.test(value)) strength++;
  if (/[^a-zA-Z0-9]/.test(value)) strength++;
  if (value.length >= 12) strength++;
  return Math.min(strength, 4);
};

const levels = [
  { width: "0%", color: "#eee", text: "" },
  { width: "25%", color: "#e74c3c", text: "Очень слабый" },
  { width: "50%", color: "#f39c12", text: "Слабый" },
  { width: "75%", color: "#3498db", text: "Средний" },
  { width: "100%", color: "#27ae60", text: "Сильный" },
];

const updateStrength = (value) => {
  const strength = checkStrength(value);
  const level = levels[strength];
  if (!strengthFill || !strengthText) return;
  strengthFill.style.width = level.width;
  strengthFill.style.background = level.color;
  strengthText.textContent = level.text;
  strengthText.style.color = level.color;
};

// --- Работа с черновиком ---
const saveDraft = () => {
  const draft = { username: username.value, email: email.value, name: fullName.value };
  try { localStorage.setItem("registerDraft", JSON.stringify(draft)); } catch (e) {}
};

const loadDraft = () => {
  try {
    const saved = localStorage.getItem("registerDraft");
    if (!saved) return;
    const draft = JSON.parse(saved);
    username.value = draft.username || "";
    email.value = draft.email || "";
    fullName.value = draft.name || "";
  } catch (e) {}
};

const clearDraft = () => {
  try { localStorage.removeItem("registerDraft"); } catch (e) {}
};

// --- Работа с модалкой и загрузкой ---
const showModal = () => {
  successModal.classList.add("active");
};

const hideModal = () => {
  successModal.classList.remove("active");
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
  username: false,
  fullName: false,
  email: false,
  password: false
};

// --- Имя пользователя ---
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

// --- Имя и фамилия ---
fullName.addEventListener("input", () => {
  if (touched.fullName) validateSingleField(fullName, nameError, validateName);
  updateSubmitState();
  saveDraft();
});
fullName.addEventListener("blur", () => {
  touched.fullName = true;
  validateSingleField(fullName, nameError, validateName);
  updateSubmitState();
});

// --- Email ---
email.addEventListener("input", () => {
  if (touched.email) validateSingleField(email, emailError, validateEmail);
  updateSubmitState();
  saveDraft();
});
email.addEventListener("blur", () => {
  touched.email = true;
  validateSingleField(email, emailError, validateEmail);
  updateSubmitState();
});

// --- Пароль ---
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

// --- Галочка согласия ---
terms.addEventListener("change", () => {
  termsError.textContent = terms.checked ? "" : "Отметьте согласие";
  updateSubmitState();
});

// --- Кнопка "Глаз" ---
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

  // 1. Принудительно показываем ошибки
  touched = { username: true, fullName: true, email: true, password: true };
  validateSingleField(username, usernameError, validateUsername);
  validateSingleField(fullName, nameError, validateName);
  validateSingleField(email, emailError, validateEmail);
  validateSingleField(password, passwordError, validatePassword);
  termsError.textContent = terms.checked ? "" : "Отметьте согласие";

  // 2. Если есть ошибки — прерываем
  if (!validateForm()) return;

  // 3. Включаем спиннер
  setLoading(true);

  // 4. Имитация запроса на сервер (2 секунды)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // 5. Выключаем спиннер и показываем модалку
  setLoading(false);
  showModal();

  // 6. Очищаем форму
  form.reset();
  submitBtn.disabled = true;
  [username, fullName, email, password].forEach((input) => {
    input.classList.remove("success");
  });
  termsError.textContent = "";
  updateStrength("");
  clearDraft();
});

// ==========================================
// 4. СТАРТ ПРОГРАММЫ
// ==========================================
loadDraft();
updateStrength(password.value);
updateSubmitState();

if (!email.value) email.focus();
else if (!username.value) username.focus();
else if (!fullName.value) fullName.focus();