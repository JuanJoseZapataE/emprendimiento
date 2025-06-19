let cartItems = [];
const cartList = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

// Cargar carrito desde localStorage al iniciar
window.addEventListener('DOMContentLoaded', () => {
  const savedCart = localStorage.getItem('cartItems');
  if (savedCart) {
    cartItems = JSON.parse(savedCart);
    updateCart();
  }
  attachAddToCartEvents();
});

function attachAddToCartEvents() {
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.onclick = () => {
      const name = button.getAttribute('data-name');
      const price = parseFloat(button.getAttribute('data-price'));
      cartItems.push({ name, price });
      saveCart();
      updateCart();
    };
  });
}

function updateCart() {
  cartList.innerHTML = '';
  let total = 0;
  cartItems.forEach((item, index) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between');
    li.innerHTML = `
      ${item.name} - $${item.price}
      <button class="btn btn-sm btn-danger" onclick="removeItem(${index})">Eliminar</button>
    `;
    cartList.appendChild(li);
    total += item.price;
  });
  cartTotal.textContent = total.toFixed(2);
}

function removeItem(index) {
  cartItems.splice(index, 1);
  saveCart();
  updateCart();
}

function saveCart() {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Navegación entre tienda y carrito
const mainSection = document.getElementById('main-section');
const cartSection = document.getElementById('cart-section');
const goToCartBtn = document.getElementById('go-to-cart');
const backToShopBtn = document.getElementById('back-to-shop');

if (goToCartBtn) {
  goToCartBtn.onclick = () => {
    mainSection.classList.add('d-none');
    cartSection.classList.remove('d-none');
    updateCart();
  };
}
if (backToShopBtn) {
  backToShopBtn.onclick = () => {
    cartSection.classList.add('d-none');
    mainSection.classList.remove('d-none');
  };
}
