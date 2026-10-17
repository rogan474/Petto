//ПЕРЕКЛЮЧЕНИЕ ТЕМЫ
const themeBtn = document.querySelector("#themeBtn");
function getSavedTheme() {
    try {
        return localStorage.getItem("theme");
    } catch (e) {
        return null;
    }
}
function saveTheme(theme) {
    try {
        localStorage.setItem("theme", theme)
    } catch (e) {
    }
}
if (getSavedTheme() === "dark") {
    document.body.classList.add("dark");
}
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    saveTheme(isDark ? "dark" : "light");
})

//КНОПКА "НАВЕРХ"
const scrollTopBtn = document.querySelector("#scrollTopBtn");
window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add("visible");
    } else {
        scrollTopBtn.classList.remove("visible");
    }
});
scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

//ФИЛЬРАЦИЯ КАРТОЧЕК
const filterButtons = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".card");
const filterCount = document.querySelector("#filterCount");
function filterCards(category) {
    let visibleCount = 0;
    
    cards.forEach((card) => {
        if (category === "all" || card.dataset.category === category) {
            card.classList.remove("hidden");
            visibleCount++;
        } else {
            card.classList.add("hidden");
        }
    });
    if (filterCount) {
        filterCount.textContent = visibleCount;
    }
}
filterCards("all");
filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
    
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        
    
        const category = button.dataset.filter;
        filterCards(category);
    });
});

//БУРГЕР
const burgerBtn = document.querySelector("#burgerBtn");
const mobileNav = document.querySelector("#mobileNav");

// 2. Открываем/закрываем меню по клику на бургер
burgerBtn.addEventListener("click", () => {
    mobileNav.classList.toggle("open");
    burgerBtn.classList.toggle("active");
    document.body.classList.toggle("menu-open");
});

// 3. Закрываем меню при клике на ссылку
const mobileLinks = mobileNav.querySelectorAll("a");
mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
        mobileNav.classList.remove("open");
        burgerBtn.classList.remove("active");
        document.body.classList.remove("menu-open");
    });
});
