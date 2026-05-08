/* ========== RECIPE DATA ========== */
const recipeData = {
  Biryani:  { image:"biryani.jpg",  tag:"Rice Dish",  time:"40 min", price:12.99, rating:4.8, category:"Rice",      desc:"Aromatic basmati rice layered with spiced chicken, saffron, and caramelized onions — a Mughal royal classic.", ingredients:["2 cups Basmati Rice","500g Chicken","1 cup Yogurt","2 Onions (sliced)","Saffron + Warm Milk","Whole Spices","Ghee & Fresh Mint"], steps:"Marinate chicken in yogurt and spices for 1 hour. Cook onions golden brown. Par-boil rice. Layer rice with chicken and saffron milk. Dum cook on low heat 25 minutes." },
  Pizza:    { image:"pizza.jpg",    tag:"Fast Food",  time:"30 min", price:9.99,  rating:4.5, category:"Fast Food", desc:"Crispy Italian-style pizza loaded with melted mozzarella, fresh basil, and rich tomato sauce on a golden crust.", ingredients:["Pizza Dough","½ cup Tomato Sauce","1.5 cups Mozzarella","Bell Peppers","Olives","Oregano & Basil","Olive Oil"], steps:"Stretch dough on floured surface. Spread tomato sauce. Add cheese and toppings. Bake at 220°C for 15-18 minutes until crust is golden." },
  Burger:   { image:"burger.jpg",   tag:"Fast Food",  time:"20 min", price:7.99,  rating:4.6, category:"Fast Food", desc:"Juicy beef patty with fresh lettuce, tomato, melted cheese, pickles, and special sauce in a toasted sesame bun.", ingredients:["2 Beef Patties","2 Burger Buns","Cheddar Cheese","Lettuce & Tomato","Pickles","Special Sauce","Salt & Pepper"], steps:"Season patties and grill 4 minutes per side. Toast buns until golden. Layer sauce, lettuce, patty, cheese, tomato, and pickles." },
  Pasta:    { image:"pasta.jpg",    tag:"Italian",    time:"25 min", price:10.99, rating:4.7, category:"Italian",   desc:"Creamy penne pasta tossed in rich garlic cream sauce, finished with parmesan cheese and fresh aromatic basil.", ingredients:["250g Penne Pasta","3 cloves Garlic","1 cup Heavy Cream","½ cup Parmesan","Olive Oil","Salt & Black Pepper","Fresh Basil"], steps:"Boil pasta al dente. Sauté garlic in olive oil 2 minutes. Add cream and simmer 5 minutes. Toss pasta in sauce. Finish with parmesan and basil." },
  Momos:    { image:"momos.jpg",    tag:"Dumplings",  time:"35 min", price:6.99,  rating:4.4, category:"Snack",     desc:"Soft steamed dumplings filled with spiced minced chicken and vegetables, served with fiery red chutney.", ingredients:["2 cups All-Purpose Flour","250g Minced Chicken","Cabbage & Ginger","Garlic & Green Onion","Soy Sauce","Sesame Oil","Salt"], steps:"Make dough, rest 30 minutes. Mix filling with all seasonings. Roll small circles, fill and pleat edges. Steam for 12-15 minutes. Serve hot with red chutney." },
  Sandwich: { image:"sandwitch.jpg",tag:"Snack",      time:"10 min", price:5.99,  rating:4.3, category:"Snack",     desc:"Fresh layered sandwich with crisp vegetables, melted cheese, and a tangy cream cheese spread — quick and satisfying.", ingredients:["4 Bread Slices","Cream Cheese / Mayo","Cucumber & Tomato","Lettuce","Cheddar Slice","Mustard Sauce","Salt & Pepper"], steps:"Spread cream cheese generously on bread. Layer with lettuce, cucumber, tomato, and cheddar cheese. Add second bread slice. Slice diagonally and serve immediately." }
};

/* ========== IMAGE PATH HELPER ========== */
function getImgPath(filename) {
  return window.location.pathname.includes("/pages/")
    ? `../sources/${filename}`
    : `sources/${filename}`;
}

/* ========== CART (localStorage) ========== */
function getCart() {
  return JSON.parse(localStorage.getItem("recipehub_cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("recipehub_cart", JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const cart  = getCart();
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll(".cart-badge").forEach(el => {
    el.textContent = total > 0 ? total : "";
  });
}

function addToCart(name) {
  const cart = getCart();
  const idx  = cart.findIndex(i => i.name === name);
  if (idx > -1) {
    cart[idx].qty += 1;
  } else {
    const d = recipeData[name];
    cart.push({ name, price: d.price, category: d.tag, image: d.image, qty: 1 });
  }
  saveCart(cart);
  showToast(`✅ ${name} added to cart!`);
}

/* ========== RECIPE MODAL ========== */
function showRecipe(name) {
  const d = recipeData[name];
  if (!d) return;

  document.getElementById("modal-img").src           = getImgPath(d.image);
  document.getElementById("modal-img").alt            = name;
  document.getElementById("modal-title").textContent  = name;
  document.getElementById("modal-tag").textContent    = `${d.tag} · ${d.time}`;
  document.getElementById("modal-price").textContent  = `$${d.price.toFixed(2)}`;
  document.getElementById("modal-desc").textContent   = d.desc;
  document.getElementById("modal-steps").textContent  = d.steps;

  const list = document.getElementById("modal-ingredients");
  list.innerHTML = "";
  d.ingredients.forEach(ing => {
    const li = document.createElement("li");
    li.textContent = ing;
    list.appendChild(li);
  });

  const btn = document.getElementById("modal-cart-btn");
  if (btn) btn.onclick = () => { addToCart(name); closeModal(); };

  document.getElementById("recipeModal").classList.add("active");
}

function closeModal() {
  document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("active"));
}

window.addEventListener("click", e => {
  document.querySelectorAll(".modal-overlay").forEach(m => {
    if (e.target === m) closeModal();
  });
});

/* ========== SEARCH & FILTER ========== */
function filterRecipes() {
  const query     = (document.getElementById("search-name")?.value   || "").toLowerCase();
  const category  = (document.getElementById("search-cat")?.value    || "").toLowerCase();
  const maxPrice  = parseFloat(document.getElementById("search-price")?.value  || "9999");
  const minRating = parseFloat(document.getElementById("search-rating")?.value || "0");

  document.querySelectorAll(".recipe-row").forEach(row => {
    const name  = row.dataset.name.toLowerCase();
    const cat   = row.dataset.category.toLowerCase();
    const price = parseFloat(row.dataset.price);
    const rat   = parseFloat(row.dataset.rating);
    const show  = name.includes(query) && (category === "" || cat.includes(category)) && price <= maxPrice && rat >= minRating;
    row.style.display = show ? "" : "none";
  });

  document.querySelectorAll(".recipe-card-wrap").forEach(card => {
    const name  = card.dataset.name.toLowerCase();
    const cat   = card.dataset.category.toLowerCase();
    const price = parseFloat(card.dataset.price);
    const rat   = parseFloat(card.dataset.rating);
    const show  = name.includes(query) && (category === "" || cat.includes(category)) && price <= maxPrice && rat >= minRating;
    card.style.display = show ? "" : "none";
  });
}

function resetSearch() {
  ["search-name","search-cat","search-price","search-rating"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  filterRecipes();
}

/* ========== DASHBOARD ACTIONS ========== */
function dashAction(action) {
  if (action === "cart") { window.location.href = "cart.html"; return; }
  if (action === "add")  { document.getElementById("addModal")?.classList.add("active"); return; }
  const messages = {
    view:   "📋 Showing all recipes in the table below.",
    update: "✏️ Select a recipe row to update.",
    delete: "🗑️ Select a recipe row to delete."
  };
  showToast(messages[action] || "Action performed!");
}

/* ========== ADD RECIPE ========== */
function submitNewRecipe() {
  const name  = document.getElementById("new-name")?.value.trim();
  const cat   = document.getElementById("new-cat")?.value;
  const time  = document.getElementById("new-time")?.value.trim();
  const price = document.getElementById("new-price")?.value.trim();
  if (!name || !cat || !time || !price) { showToast("⚠️ Please fill all fields!"); return; }
  showToast(`✅ "${name}" recipe added successfully!`);
  closeModal();
}

/* ========== CART RENDER ========== */
function renderCart() {
  const cart      = getCart();
  const container = document.getElementById("cart-items");
  const emptyMsg  = document.getElementById("cart-empty");
  const summary   = document.getElementById("cart-summary");
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = "";
    if (emptyMsg) emptyMsg.classList.remove("hidden");
    if (summary)  summary.classList.add("hidden");
    return;
  }

  if (emptyMsg) emptyMsg.classList.add("hidden");
  if (summary)  summary.classList.remove("hidden");

  container.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <img src="${getImgPath(item.image)}" alt="${item.name}">
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <p class="cat">${item.category}</p>
        <p class="item-price">$${(item.price * item.qty).toFixed(2)}</p>
        <div class="qty-control">
          <button class="qty-btn" onclick="changeQty(${idx},-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${idx},+1)">+</button>
        </div>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${idx})" title="Remove">🗑️</button>
    </div>
  `).join("");

  updateSummary(cart);
}

function changeQty(idx, delta) {
  const cart = getCart();
  cart[idx].qty = Math.max(1, cart[idx].qty + delta);
  saveCart(cart);
  renderCart();
}

function removeFromCart(idx) {
  const cart = getCart();
  const name = cart[idx].name;
  cart.splice(idx, 1);
  saveCart(cart);
  renderCart();
  showToast(`🗑️ ${name} removed from cart`);
}

function updateSummary(cart) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = subtotal > 0 ? 2.99 : 0;
  const total    = subtotal + delivery;
  const el = id => document.getElementById(id);
  if (el("subtotal"))   el("subtotal").textContent   = `$${subtotal.toFixed(2)}`;
  if (el("delivery"))   el("delivery").textContent   = `$${delivery.toFixed(2)}`;
  if (el("total"))      el("total").textContent      = `$${total.toFixed(2)}`;
  if (el("item-count")) el("item-count").textContent = cart.reduce((s,i) => s + i.qty, 0);
}

function clearCart() {
  saveCart([]);
  renderCart();
  showToast("🗑️ Cart cleared!");
}

function checkout() {
  if (getCart().length === 0) { showToast("⚠️ Your cart is empty!"); return; }
  saveCart([]);
  renderCart();
  showToast("🎉 Order placed successfully! Thank you!");
}

/* ========== TOGGLE NAV MENU ========== */
function toggleMenu() {
  const menu = document.getElementById("navMenu");
  if (!menu) return;
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}

/* ========== FORMS ========== */
function submitForm(type) {
  if (type === "login") {
    const email = document.getElementById("login-email")?.value.trim();
    const pass  = document.getElementById("login-pass")?.value.trim();
    if (!email || !pass) { showToast("⚠️ Please fill all fields!"); return; }
    showToast("✅ Logged in successfully!");
    setTimeout(() => window.location.href = "dashboard.html", 1000);
    return;
  }
  if (type === "register") {
    const name  = document.getElementById("reg-name")?.value.trim();
    const email = document.getElementById("reg-email")?.value.trim();
    const pass  = document.getElementById("reg-pass")?.value.trim();
    if (!name || !email || !pass) { showToast("⚠️ Please fill all fields!"); return; }
    showToast("✅ Account created! Please login.");
    setTimeout(() => window.location.href = "login.html", 1200);
    return;
  }
  if (type === "contact") {
    showToast("✅ Message sent! We'll reply soon.");
    return;
  }
}

/* ========== TOAST ========== */
function showToast(msg, duration = 3000) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), duration);
}

/* ========== INIT ========== */
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  if (document.getElementById("cart-items")) renderCart();
});