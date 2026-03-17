let cart = [];

// Fonction pour filtrer les catégories
function filterCategory(category) {
  const clubsSection = document.getElementById('clubs');
  const internationalsSection = document.getElementById('internationals');
  const tabButtons = document.querySelectorAll('.tab-button');

  // Masquer toutes les sections
  clubsSection.style.display = 'none';
  internationalsSection.style.display = 'none';

  // Désactiver tous les boutons
  tabButtons.forEach(btn => btn.classList.remove('active'));

  // Afficher la section sélectionnée
  if (category === 'clubs') {
    clubsSection.style.display = 'flex';
  } else if (category === 'internationals') {
    internationalsSection.style.display = 'flex';
  }

  // Activer le bouton correspondant
  event.target.classList.add('active');
}

// Fonction pour ajouter un produit au panier
function addToCart(product, price, image) {
  cart.push({ product, price, image });
  alert(`${product} ajouté au panier.`);
  saveCart();
  displayCart(); // mise à jour immédiate du panier
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

// Fonction pour supprimer un article du panier
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  displayCart();
}

function displayCart() {
  loadCart();
  const cartItems = document.getElementById('cart-items');
  const totalElement = document.getElementById('total');
  const emptyDiv = document.getElementById('cart-empty');
  let total = 0;

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

    // Ajout du bouton "Supprimer"
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

  const payButton = document.querySelector('.pay-button');
  if (payButton) {
    payButton.href = `https://pay.wave.com/m/M_sn_fN7W0RiQbIXt/c/sn/?amount=${total}&success_url=${encodeURIComponent(window.location.origin + '/Confirmation.html')}&failure_url=${encodeURIComponent(window.location.origin + '/cart.html')}`;
  }
}

if (document.getElementById('cart-items')) {
  displayCart();
}

function clearCart() {
  cart = [];
  saveCart();
  displayCart();
}

document.addEventListener('DOMContentLoaded', () => {
  const receipt = document.getElementById('receipt');
  const totalElement = document.getElementById('total');
  const storedCart = localStorage.getItem('cart');
  let total = 0;

  if (storedCart) {
    const cart = JSON.parse(storedCart);

    const grouped = {};
    cart.forEach(item => {
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
    localStorage.removeItem('cart');
  } else {
    receipt.innerHTML = '<li>Votre panier était vide.</li>';
  }
});

document.addEventListener('DOMContentLoaded', () => {
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
