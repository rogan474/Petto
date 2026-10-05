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