// --- PANIER ---
let cart = [];

// Charger panier
function loadCart() {
  const storedCart = localStorage.getItem('cart');
  if (storedCart) cart = JSON.parse(storedCart);
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
function filterCategory(category, btn) {
  const clubsSection = document.getElementById('clubs');
  const internationalsSection = document.getElementById('internationals');
  const tabButtons = document.querySelectorAll('.tab-button');

  // Masquer toutes les sections
  clubsSection.style.display = 'none';
  internationalsSection.style.display = 'none';

  // Retirer la classe active de tous les boutons
  tabButtons.forEach(button => button.classList.remove('active'));

  // Afficher la section sélectionnée
  if (category === 'clubs') {
    clubsSection.style.display = 'flex';
  } else if (category === 'internationals') {
    internationalsSection.style.display = 'flex';
  }

  // Ajouter la classe active au bouton cliqué
  btn.classList.add('active');
}

// Ajouter produit avec taille
function addToCart(button, product, price, image) {
  loadCart();
  const productCard = button.parentElement;
  const size = productCard.querySelector(".size-select").value;

  if(size === ""){
    alert("Veuillez choisir une taille");
    return;
  }

  const existing = cart.find(item => item.product === product && item.size === size);
  if (existing) existing.quantity += 1;
  else cart.push({ product, price, image, size, quantity: 1 });

  saveCart();

  button.innerText = "✓ Ajouté";
  button.style.backgroundColor = "green";
}

// Supprimer produit
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  displayCart();
}

// Augmenter / diminuer quantité
function increaseQty(index){ cart[index].quantity += 1; saveCart(); displayCart(); }
function decreaseQty(index){ 
  if(cart[index].quantity > 1) cart[index].quantity -= 1;
  else cart.splice(index,1);
  saveCart(); displayCart(); 
}

// --- LIVRAISON ---
function getDeliveryCost(){
  const zone = document.getElementById("delivery-zone");
  if(!zone) return 0;
  return parseInt(zone.value) || 0;
}

// --- AFFICHAGE PANIER ---
function displayCart() {
  loadCart();

  const cartItems = document.getElementById('cart-items');
  const totalElement = document.getElementById('total');
  const emptyDiv = document.getElementById('cart-empty');

  if(!cartItems) return;

  let total = 0;
  cartItems.innerHTML = '';

  if(cart.length === 0) emptyDiv.style.display = 'block';
  else emptyDiv.style.display = 'none';

  cart.forEach((item, index) => {
    const li = document.createElement('li');
    const subtotal = item.price * item.quantity;

    li.innerHTML = `
      <img src="${item.image}" style="width:60px;margin-right:10px;">
      ${item.product}<br>
      Taille : ${item.size}<br>
      ${item.price} FCFA<br>
      Quantité : 
      <button onclick="decreaseQty(${index})">-</button>
      ${item.quantity}
      <button onclick="increaseQty(${index})">+</button><br>
      <strong>${subtotal} FCFA</strong>
    `;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Supprimer';
    removeBtn.onclick = () => removeFromCart(index);
    li.appendChild(removeBtn);

    cartItems.appendChild(li);
    total += subtotal;
  });

  // Livraison
  const delivery = getDeliveryCost();
  const finalTotal = total + delivery;
  totalElement.textContent = `Total : ${finalTotal} FCFA`;

  updateCartCount();

  const payButton = document.querySelector('.pay-button');
  if(payButton) payButton.href = `https://pay.wave.com/m/M_sn_fN7W0RiQbIXt/c/sn/?amount=${finalTotal}`;
}

// Mise à jour total si livraison change
function updateTotal(){ displayCart(); }

// --- ENVOI FORMULAIRE ---
function sendOrder(event){
  event.preventDefault();

  const name = document.getElementById('client-name').value;
  const address = document.getElementById('client-address').value;
  const zone = document.getElementById('delivery-zone').options[document.getElementById('delivery-zone').selectedIndex].text;
  const geolocation = document.getElementById('client-location').value;

  if(!name || !address || !zone){
    alert("Veuillez remplir tous les champs de livraison.");
    return;
  }

  // Préparer email via Formspree ou EmailJS
  const orderData = {
    name, address, zone, geolocation, cart: cart
  };

  // Exemple avec Formspree
  fetch("https://formspree.io/f/yourFormID", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  }).then(res=>{
    if(res.ok){
      alert("Commande envoyée avec succès !");
      localStorage.removeItem('cart');
      displayCart();
    } else {
      alert("Erreur lors de l'envoi de la commande.");
    }
  });
}

// --- INIT ---
document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  updateCartCount();
  displayCart();

  // Formulaire livraison
  const orderForm = document.getElementById('order-form');
  if(orderForm) orderForm.addEventListener('submit', sendOrder);
});
