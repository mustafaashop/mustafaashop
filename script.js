
let cart = [];

// Charger panier
function loadCart() {
  const storedCart = localStorage.getItem('cart');
  if (storedCart) {
    cart = JSON.parse(storedCart);
  }
}

// Sauvegarder panier
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

// Badge nombre d'articles
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('cart-count');
  if (badge) badge.textContent = count;
}

// Filtrer catégories
function filterCategory(category) {
  const clubsSection = document.getElementById('clubs');
  const internationalsSection = document.getElementById('internationals');
  const tabButtons = document.querySelectorAll('.tab-button');

  clubsSection.style.display = 'none';
  internationalsSection.style.display = 'none';

  tabButtons.forEach(btn => btn.classList.remove('active'));

  if (category === 'clubs') {
    clubsSection.style.display = 'flex';
  } else {
    internationalsSection.style.display = 'flex';
  }

  event.target.classList.add('active');
}

// Ajouter produit
function addToCart(product, price, image) {

  loadCart();

  const existing = cart.find(item => item.product === product && item.image === image);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ product, price, image, quantity: 1 });
  }

  saveCart();

  // feedback visuel
  const btn = event.target;
  btn.innerText = "✓ Ajouté";
  btn.style.backgroundColor = "green";
}

// Supprimer produit
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  displayCart();
}

// Augmenter quantité
function increaseQty(index){
  cart[index].quantity += 1;
  saveCart();
  displayCart();
}

// Diminuer quantité
function decreaseQty(index){
  if(cart[index].quantity > 1){
    cart[index].quantity -= 1;
  } else {
    cart.splice(index,1);
  }
  saveCart();
  displayCart();
}

// Affichage panier
function displayCart() {

  loadCart();

  const cartItems = document.getElementById('cart-items');
  const totalElement = document.getElementById('total');
  const emptyDiv = document.getElementById('cart-empty');

  if(!cartItems) return;

  let total = 0;

  cartItems.innerHTML = '';

  if (cart.length === 0) {
    emptyDiv.style.display = 'block';
  } else {
    emptyDiv.style.display = 'none';
  }

  cart.forEach((item, index) => {

    const li = document.createElement('li');

    const subtotal = item.price * item.quantity;

    li.innerHTML = `
      <img src="${item.image}" style="width:60px;margin-right:10px;">
      ${item.product}
      <br>
      ${item.price} FCFA
      <br>
      Quantité :
      <button onclick="decreaseQty(${index})">-</button>
      ${item.quantity}
      <button onclick="increaseQty(${index})">+</button>
      <br>
      <strong>${subtotal} FCFA</strong>
    `;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Supprimer';
    removeBtn.onclick = () => removeFromCart(index);

    li.appendChild(removeBtn);

    cartItems.appendChild(li);

    total += subtotal;
  });

  totalElement.textContent = `Total : ${total} FCFA`;

  updateCartCount();

  const payButton = document.querySelector('.pay-button');
  if (payButton) {
    payButton.href =
      `https://pay.wave.com/m/M_sn_fN7W0RiQbIXt/c/sn/?amount=${total}`;
  }
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  updateCartCount();
  displayCart();
});
