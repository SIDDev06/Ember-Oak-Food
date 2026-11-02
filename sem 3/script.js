// Smooth scrolling for navigation links
document.querySelectorAll('.nav-links a, .hero-buttons a').forEach(function (link) {
  link.addEventListener('click', function (e) {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== ORDER SYSTEM =====
let order = [];  // each item: { name, price, image, qty }

const modal = document.getElementById('order-modal');
const orderItems = document.getElementById('order-items');
const orderTotal = document.getElementById('order-total');
const orderMessage = document.getElementById('order-message');

// Open / close popup
function openModal() {
  orderMessage.textContent = '';
  renderOrder();
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';   // stops page scrolling behind popup
}
function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Add a food to the order (or increase quantity if already there)
function addToOrder(name, price, image) {
  const existing = order.find(function (item) { return item.name === name; });
  if (existing) {
    existing.qty++;
  } else {
    order.push({ name: name, price: price, image: image, qty: 1 });
  }
}

// Draw the order list and total
function renderOrder() {
  if (order.length === 0) {
    orderItems.innerHTML = '<p class="empty-text">Your order is empty. Add some food from the menu!</p>';
    orderTotal.textContent = '$0';
    return;
  }

  let html = '';
  let total = 0;
  order.forEach(function (item, index) {
    const lineTotal = item.price * item.qty;
    total += lineTotal;
    html += `
      <div class="order-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="order-item-info">
          <h4>${item.name}</h4>
          <span>$${item.price} × ${item.qty} = $${lineTotal}</span>
        </div>
        <div class="qty-box">
          <button class="qty-btn" data-action="minus" data-index="${index}">−</button>
          <strong>${item.qty}</strong>
          <button class="qty-btn" data-action="plus" data-index="${index}">+</button>
        </div>
        <button class="remove-btn" data-action="remove" data-index="${index}">Remove</button>
      </div>`;
  });
  orderItems.innerHTML = html;
  orderTotal.textContent = '$' + total;
}

// "Add to Order" buttons (food cards + signature dish)
document.querySelectorAll('.add-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    const card = btn.closest('.food-card');
    let name, price, image;

    if (card) {
      name = card.querySelector('h3').textContent;
      price = parseFloat(card.querySelector('.price').textContent.replace('$', ''));
      image = card.querySelector('img').src;
    } else {
      // Signature dish section
      const sig = btn.closest('.signature');
      name = sig.querySelector('h2').textContent;
      price = parseFloat(sig.querySelector('.signature-price').textContent.replace('$', ''));
      image = sig.querySelector('img').src;
    }

    addToOrder(name, price, image);
    openModal();
  });
});

// "Order" and "Order Now" buttons just open the popup
document.querySelectorAll('.order-btn').forEach(function (btn) {
  btn.addEventListener('click', openModal);
});

// + / - / Remove buttons inside the popup
orderItems.addEventListener('click', function (e) {
  const action = e.target.dataset.action;
  const index = e.target.dataset.index;
  if (!action) return;

  if (action === 'plus') order[index].qty++;
  if (action === 'minus') {
    order[index].qty--;
    if (order[index].qty === 0) order.splice(index, 1);
  }
  if (action === 'remove') order.splice(index, 1);

  renderOrder();
});

// Place Order
document.getElementById('place-order').addEventListener('click', function () {
  if (order.length === 0) {
    orderMessage.style.color = '#e57373';
    orderMessage.textContent = 'Please add some food first.';
    return;
  }
  order = [];
  renderOrder();
  orderMessage.style.color = '#7bd88f';
  orderMessage.textContent = 'Order placed successfully!';
});

// Close popup: X button, or click the dark area outside the box
document.getElementById('close-modal').addEventListener('click', closeModal);
modal.addEventListener('click', function (e) {
  if (e.target === modal) closeModal();
});

// Press Escape to close popup
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeModal();
});

// If any image fails to load, show a simple dark placeholder instead
document.addEventListener('error', function (e) {
  if (e.target.tagName === 'IMG' && !e.target.dataset.failed) {
    e.target.dataset.failed = 'true';
    e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%25" height="100%25" fill="%231c1c1c"/><text x="50%25" y="50%25" fill="%23d89b3c" font-size="24" text-anchor="middle">Image coming soon</text></svg>';
  }
}, true);