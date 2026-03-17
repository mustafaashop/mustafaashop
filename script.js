let cart = [];

// Fonction pour filtrer les catégories
function filterCategory(category, event) {
  const clubsSection = document.getElementById('clubs');
  const internationalsSection = document.getElementById('internationals');
  const tabButtons = document.querySelectorAll('.tab-button');

  clubsSection.style.display = 'none';
  internationalsSection.style.display = 'none';
  tabButtons.forEach(btn => btn.classList.remove('active'));

  if (category === 'clubs') {
    clubsSection.style.display = 'flex';
  } else if (category === 'internationals') {
    internationalsSection.style.display = 'flex';
  }

  if (event) {
    event.target.classList.add('active');
  }
}

// Notification stylisée (barre en haut)
function showNotification(message) {
  const notif = document.createElement('div');
  notif.textContent = message;
  notif.style.position = 'fixed';
  notif.style.top = '-50px'; // commence hors écran
  notif.style.left = '50%';
  notif.style.transform = 'translateX(-50%)';
  notif.style.background = '#28a745';
  notif.style.color = '#fff';
  notif.style.padding = '12px 20px';
  notif.style.borderRadius = '5px';
  notif.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
  notif.style.zIndex = '9999';
  notif.style.transition = 'top 0.5s ease';
  document.body.appendChild(notif);

  // Animation d’entrée
  setTimeout(() => {
    notif.style.top = '20px';
  }, 100);

  // Disparition après 2,5 secondes
  setTimeout(() => {
    notif.style.top = '-50px';
    setTimeout(() => notif.remove(), 500);
  }, 2500);
}

// Ajouter un produit au panier
function addToCart(product, price, image) {
  cart.push({ product, price, image });
  showNotification(`${product} ajouté au panier ✅`);
  saveCart();
  displayCart();
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
  const storedCart = localStorage.getItem('cart');
  if (storedCart) {
    cart = JSON.parse(storedCart);
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  displayCart();
}

function displayCart() {
  const cartItems = document.getElementById('cart-items');
  const totalElement = document.getElementById('total');
  const emptyDiv = document.getElementById('cart-empty');
  const cartCount = document.getElementById('cart-count');
  let total = 0;
    // Mise à jour du compteur en bas
  const cartBottomCount = document.getElementById('cart-bottom-count');
  if (cartBottomCount) {
    cartBottomCount.textContent = cart.length;
  
  cartItems.innerHTML = '';
  if (cart.length === 0) {
    emptyDiv.style.display = 'block';
  } else {
    emptyDiv.style.display = 'none';
  }

  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${item.image}" alt="${item.product}" style="width: 50px; height: auto; margin-right: 10px;">
      ${item.product} - ${item.price} FCFA
    `;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Supprimer';
    removeBtn.className = 'remove-btn';
    removeBtn.onclick = function() {
      removeFromCart(index);
    };

    li.appendChild(removeBtn);
    cartItems.appendChild(li);
    total += item.price;
  });

  totalElement.textContent = `Total : ${total} FCFA`;

  if (cartCount) {
    cartCount.textContent = cart.length;
    cartCount.style.display = cart.length > 0 ? 'inline-block' : 'none';
  }

  const payButton = document.querySelector('.pay-button');
  if (payButton) {
    if (total > 0) {
      payButton.href = `https://pay.wave.com/m/M_sn_fN7W0RiQbIXt/c/sn/?amount=${total}&success_url=${encodeURIComponent(window.location.origin + '/Confirmation.html')}&failure_url=${encodeURIComponent(window.location.origin + '/cart.html')}`;
      payButton.classList.remove('disabled');
    } else {
      payButton.removeAttribute('href');
      payButton.classList.add('disabled');
    }
  }
}

function clearCart() {
  cart = [];
  saveCart();
  displayCart();
}

document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  if (document.getElementById('cart-items')) {
    displayCart();
  }

  const receipt = document.getElementById('receipt');
  const totalElement = document.getElementById('total');
  const storedCart = localStorage.getItem('cart');
  let total = 0;

  if (receipt && storedCart) {
    const parsedCart = JSON.parse(storedCart);
    const grouped = {};

    parsedCart.forEach(item => {
      const key = item.product + '|' + item.image;
      if (grouped[key]) {
        grouped[key].quantity += 1;
      } else {
        grouped[key] = {
          price: item.price,
          quantity: 1,
          image: item.image,
          product: item.product
        };
      }
    });

    for (const [key, data] of Object.entries(grouped)) {
      const li = document.createElement('li');
      const subtotal = data.price * data.quantity;
      li.innerHTML = `
        <img src="${data.image}" alt="${data.product}" style="width: 50px; height: auto; margin-right: 10px;">
        ${data.product} x${data.quantity} — ${subtotal.toLocaleString()} FCFA
      `;
      receipt.appendChild(li);
      total += subtotal;
    }

    totalElement.textContent = `Total : ${total.toLocaleString()} FCFA`;
  } else if (receipt) {
    receipt.innerHTML = '<li>Votre panier était vide.</li>';
  }

  const form = document.getElementById('request-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const jersey = document.getElementById('jersey').value.trim();
      const message = document.getElementById('message').value.trim();

      const fullMessage = `Bonjour Mustafaa Shop, je m'appelle ${name} et je cherche le maillot suivant : ${jersey}. ${message ? 'Détails : ' + message : ''}`;
      const encodedMessage = encodeURIComponent(fullMessage);
      const whatsappURL = `https://wa.me/221785257421?text=${encodedMessage}`;

      window.open(whatsappURL, '_blank');
    });
  }
});
