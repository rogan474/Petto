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

const slidesData = [
  { img: 'img/cat1.png', title: 'Барсик', text: 'Ищет друга для игр' },
  { img: 'img/puppy.png', title: 'Шарик', text: 'Очень любит обнимашки' },
  { img: 'img/hamster.png', title: 'Хома', text: 'Маленький, но смелый' },
  { img: 'img/parrot.png', title: 'Кеша', text: 'Любит поболтать' },
  { img: 'img/shesh.png', title: 'Мурка', text: 'Просто самая красивая' }
];

let currentSlide = 0;
let slideTimer;

const sliderTrack = document.getElementById('sliderTrack');
const sliderDots = document.getElementById('sliderDots');
const sliderContainer = document.getElementById('sliderContainer');

if (sliderTrack) {
  function renderSlider() {
    sliderTrack.innerHTML = '';
    sliderDots.innerHTML = '';
    slidesData.forEach((slide, index) => {
      const div = document.createElement('div');
      div.className = 'slide';
      div.innerHTML = `
        <img src="${slide.img}" alt="${slide.title}">
        <div class="slide-content">
          <h3>${slide.title}</h3>
          <p>${slide.text}</p>
        </div>
      `;
      sliderTrack.appendChild(div);
       const dot = document.createElement('div');
      dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => goToSlide(index));
      sliderDots.appendChild(dot);
    });
    updateSlider();
  }

  function updateSlider() {
    sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    document.querySelectorAll('.slider-dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }

  function goToSlide(index) {
    currentSlide = (index + slidesData.length) % slidesData.length;
    updateSlider();
  }
  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

   document.getElementById('btnNext').addEventListener('click', nextSlide);
  document.getElementById('btnPrev').addEventListener('click', prevSlide);

  function startTimer() { slideTimer = setInterval(nextSlide, 3000); }
  function stopTimer() { clearInterval(slideTimer); }
  sliderContainer.addEventListener('mouseenter', stopTimer);
  sliderContainer.addEventListener('mouseleave', startTimer);

  let startX = 0;
  sliderContainer.addEventListener('touchstart', e => startX = e.touches[0].clientX);
  sliderContainer.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) dx < 0 ? nextSlide() : prevSlide();
  });

  renderSlider();
  startTimer();
}

const friendsData = [
  { id: 1, name: 'Алиса', pet: 'Кошка', match: 95, img: 'img/cat1.png' },
  { id: 2, name: 'Максим', pet: 'Собака', match: 88, img: 'img/puppy.png' },
  { id: 3, name: 'Олег', pet: 'Попугай', match: 76, img: 'img/parrot.png' },
  { id: 4, name: 'Марина', pet: 'Хомяк', match: 91, img: 'img/hamster.png' },
  { id: 5, name: 'Дима', pet: 'Кошка', match: 82, img: 'img/shesh.png' },
  { id: 6, name: 'Света', pet: 'Собака', match: 99, img: 'img/amyr1.png' }
];

let friendsCart = JSON.parse(localStorage.getItem('friendsCartData')) || [];

const friendsCatalog = document.getElementById('friendsCatalog');
const friendsCartList = document.getElementById('friendsCartList');
const friendsCartTotal = document.getElementById('friendsCartTotal');

if (friendsCatalog) {
  function renderFriendsCatalog() {
    friendsCatalog.innerHTML = '';
    friendsData.forEach(friend => {
      const card = document.createElement('div');
      card.className = 'friend-card';
      const inCart = friendsCart.find(item => item.id === friend.id);
      const btnHTML = inCart 
        ? `<button class="friends-btn-add" disabled>В друзьях (${inCart.qty})</button>`
        : `<button class="friends-btn-add" onclick="addFriendToCart(${friend.id})">В друзья</button>`;
         card.innerHTML = `
        <img src="${friend.img}" alt="${friend.name}">
        <h4>${friend.name}</h4>
        <p>Питомец: ${friend.pet}<br>Совместимость: ${friend.match}%</p>
        ${btnHTML}
      `;
      friendsCatalog.appendChild(card);
    });
  }

  function renderFriendsCart() {
    friendsCartList.innerHTML = '';
    if (friendsCart.length === 0) {
      friendsCartList.innerHTML = '<p class="friends-cart-empty">Пока никого нет :(</p>';
    } else {
      friendsCart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'friends-cart-item';
        div.innerHTML = `
          <div class="friends-cart-item-info">
            <strong>${item.name}</strong>
            <small>${item.pet}</small>
          </div>
                    <div class="friends-cart-item-controls">
            <button onclick="changeFriendQty(${item.id}, -1)">-</button>
            <span>${item.qty}</span>
            <button onclick="changeFriendQty(${item.id}, 1)">+</button>
          </div>
        `;
        friendsCartList.appendChild(div);
      });
    }
    const total = friendsCart.reduce((sum, item) => sum + item.qty, 0);
    friendsCartTotal.textContent = total;
    renderFriendsCatalog();
  }
 window.addFriendToCart = function(id) {
    const item = friendsCart.find(p => p.id === id);
    if (item) { item.qty += 1; } 
    else {
      const friend = friendsData.find(p => p.id === id);
      friendsCart.push({ ...friend, qty: 1 });
    }
    saveFriendsCart();
  };

  window.changeFriendQty = function(id, delta) {
    const item = friendsCart.find(p => p.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) friendsCart = friendsCart.filter(p => p.id !== id);
    saveFriendsCart();
  };

  function saveFriendsCart() {
    localStorage.setItem('friendsCartData', JSON.stringify(friendsCart));
    renderFriendsCart();
  }
   document.getElementById('btnClearCart').addEventListener('click', () => {
    friendsCart = [];
    localStorage.removeItem('friendsCartData');
    renderFriendsCart();
  });

  renderFriendsCatalog();
  renderFriendsCart();
}

const blogData = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: 'Совет по уходу за питомцем № ' + (i + 1),
  text: 'Подробное описание того, как сделать жизнь вашего любимца лучше. Статья ' + (i + 1)
}));

const PER_PAGE = 10;
let currentPage = 1;
let filteredData = [...blogData];

const blogList = document.getElementById('blogList');
const paginationNumbers = document.getElementById('paginationNumbers');
const btnPrevPage = document.getElementById('btnPrevPage');
const btnNextPage = document.getElementById('btnNextPage');
const blogSearchInput = document.getElementById('blogSearchInput');
if (blogList) {
  const renderItem = (item) => {
    const div = document.createElement('div');
    div.className = 'blog-item';
    div.innerHTML = `<h4>${item.title}</h4><p>${item.text}</p>`;
    return div;
  };

  function renderPage(items, callback) {
    blogList.innerHTML = '';
    items.forEach(item => blogList.appendChild(callback(item)));
  }

  function getPageItems() {
    const start = (currentPage - 1) * PER_PAGE;
    return filteredData.slice(start, start + PER_PAGE);
  }
 function renderPagination() {
    const totalPages = Math.ceil(filteredData.length / PER_PAGE);
    paginationNumbers.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.className = `pagination-num ${i === currentPage ? 'active' : ''}`;
      btn.textContent = i;
      btn.addEventListener('click', () => {
        currentPage = i;
        updatePaginationUI();
        window.scrollTo({ top: document.getElementById('blogSearchInput').offsetTop - 100, behavior: 'smooth' });
      });
      paginationNumbers.appendChild(btn);
    }
    btnPrevPage.disabled = currentPage === 1;
    btnNextPage.disabled = currentPage === totalPages || totalPages === 0;
  }
 function updatePaginationUI() {
    renderPage(getPageItems(), renderItem);
    renderPagination();
  }

  btnPrevPage.addEventListener('click', () => {
    if (currentPage > 1) { currentPage--; updatePaginationUI(); }
  });
  btnNextPage.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredData.length / PER_PAGE);
    if (currentPage < totalPages) { currentPage++; updatePaginationUI(); }
  });

  blogSearchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    filteredData = blogData.filter(item => item.title.toLowerCase().includes(query));
    currentPage = 1;
    updatePaginationUI();
  });
  updatePaginationUI();
}
