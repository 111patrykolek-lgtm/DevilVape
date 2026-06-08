// Lista produktów (wspólna dla index + sklep)
const products = [
  { id: 1, name: "Inferno Mango", desc: "Soczyste mango z lodowym wykończeniem.", price: 39.9, rating: 4.9, reviews: 145, img: "img/inferno-mango.png" },
  { id: 2, name: "Crimson Berry", desc: "Mieszanka malin, jagód i czerwonych owoców.", price: 39.9, rating: 4.8, reviews: 129, img: "img/crimson-berry.png" },
  { id: 3, name: "Black Cherry Ice", desc: "Głęboka wiśnia z chłodzącym efektem.", price: 39.9, rating: 4.9, reviews: 112, img: "img/black-cherry.png" },
  { id: 4, name: "Golden Tobacco", desc: "Szlachetny tytoniowy smak o złotym charakterze.", price: 39.9, rating: 4.7, reviews: 98, img: "img/golden-tobacco.png" },
  { id: 5, name: "Frozen Devil Mint", desc: "Mocne, lodowe orzeźwienie z nutą mięty.", price: 39.9, rating: 4.9, reviews: 116, img: "img/frozen-devil.png" }
];

// Render kart produktowych jeśli na stronie jest #products-grid
function renderProducts() {
  const productsGrid = document.getElementById("products-grid");
  if (!productsGrid) return;

  productsGrid.innerHTML = "";
  products.forEach(p => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-img">
        <img src="${p.img}" alt="${p.name}">
      </div>
      <h3 class="product-name">${p.name}</h3>
      <p class="product-desc">${p.desc}</p>
      <div class="product-rating">★ ${p.rating.toFixed(1)} (${p.reviews})</div>
      <div class="product-footer">
        <span class="product-price">${p.price.toFixed(2).replace(".", ",")} zł</span>
        <button class="btn btn-secondary" data-id="${p.id}">Dodaj</button>
      </div>
    `;
    productsGrid.appendChild(card);
  });

  document.querySelectorAll(".product-card button").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id, 10);
      addToCart(id);
    });
  });
}

// KOSZYK
let cart = [];
const cartCount = document.getElementById("cart-count");
const cartOverlay = document.getElementById("cart-overlay");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

function saveCart() {
  localStorage.setItem("devilvape_cart", JSON.stringify(cart));
}

function loadCart() {
  const data = localStorage.getItem("devilvape_cart");
  if (data) {
    cart = JSON.parse(data);
  }
}

function updateCartCount() {
  if (!cartCount) return;
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = count;
}

function renderCart() {
  if (!cartItems || !cartTotal) return;

  cartItems.innerHTML = "";
  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Twój koszyk jest pusty.</p>";
    cartTotal.textContent = "0,00 zł";
    return;
  }

  let total = 0;
  cart.forEach(item => {
    const p = products.find(x => x.id === item.id);
    if (!p) return;
    const line = p.price * item.qty;
    total += line;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <span class="cart-item-name">${p.name} × ${item.qty}</span>
      <span class="cart-item-price">${line.toFixed(2).replace(".", ",")} zł</span>
      <button class="cart-item-remove" data-id="${item.id}">Usuń</button>
    `;
    cartItems.appendChild(div);
  });
  cartTotal.textContent = total.toFixed(2).replace(".", ",") + " zł";

  document.querySelectorAll(".cart-item-remove").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id, 10);
      removeFromCart(id);
    });
  });
}

function addToCart(id) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }
  saveCart();
  updateCartCount();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCartCount();
  renderCart();
}

// Obsługa przycisku koszyka (tylko jeśli są elementy)
const cartBtn = document.querySelector(".cart-btn");
const cartClose = document.getElementById("cart-close");

if (cartBtn && cartOverlay) {
  cartBtn.addEventListener("click", () => {
    cartOverlay.classList.add("active");
  });
}
if (cartClose && cartOverlay) {
  cartClose.addEventListener("click", () => {
    cartOverlay.classList.remove("active");
  });
}

// CHECKOUT
const goCheckout = document.getElementById("go-checkout");
const checkoutOverlay = document.getElementById("checkout-overlay");
const checkoutClose = document.getElementById("checkout-close");
const checkoutForm = document.getElementById("checkout-form");

if (goCheckout && checkoutOverlay) {
  goCheckout.addEventListener("click", () => {
    checkoutOverlay.classList.add("active");
  });
}
if (checkoutClose && checkoutOverlay) {
  checkoutClose.addEventListener("click", () => {
    checkoutOverlay.classList.remove("active");
  });
}
if (checkoutForm) {
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Zamówienie złożone! (demo – tutaj byłoby przekierowanie do operatora płatności).");
    cart = [];
    saveCart();
    updateCartCount();
    renderCart();
    if (checkoutOverlay) checkoutOverlay.classList.remove("active");
    if (cartOverlay) cartOverlay.classList.remove("active");
  });
}

// Newsletter (bez błędu jeśli brak formularza)
const newsletterForm = document.getElementById("newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("newsletter-email");
    if (!emailInput) return;
    alert("Dziękujemy za zapis do newslettera: " + emailInput.value);
    emailInput.value = "";
  });
}

// Burger / mobile nav
const burger = document.getElementById("burger");
const navMobile = document.getElementById("nav-mobile");
if (burger && navMobile) {
  burger.addEventListener("click", () => {
    navMobile.classList.toggle("open");
  });
}

// Inicjalizacja
loadCart();
updateCartCount();
renderCart();
renderProducts();
