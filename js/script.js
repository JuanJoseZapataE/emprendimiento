// --- Carrito global con localStorage y renderizado en cualquier página ---
let cartItems = [];
let nexocoinBalance = 0;

function loadCart() {
  const savedCart = localStorage.getItem('cartItems');
  cartItems = savedCart ? JSON.parse(savedCart) : [];
}

function saveCart() {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function renderCart() {
  const cartTableBody = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  if (!cartTableBody || !cartTotal) return;
  cartTableBody.innerHTML = '';
  let total = 0;
  if (cartItems.length === 0) {
    cartTableBody.innerHTML = '<tr><td colspan="3" class="text-center">El carrito está vacío.</td></tr>';
  } else {
    cartItems.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.name}</td>
        <td>$${item.price.toLocaleString('es-CO')}</td>
        <td><button class="btn btn-sm btn-danger" onclick="removeItem(${index})">Eliminar</button></td>
      `;
      cartTableBody.appendChild(tr);
      total += item.price;
    });
  }
  cartTotal.textContent = `$${total.toLocaleString('es-CO')}`;
}

function removeItem(index) {
  cartItems.splice(index, 1);
  saveCart();
  renderCart();
}

function addToCart(name, price) {
  cartItems.push({ name, price });
  saveCart();
  renderCart();
}

function attachAddToCartEvents() {
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.onclick = () => {
      const name = button.getAttribute('data-name');
      const price = parseFloat(button.getAttribute('data-price'));
      addToCart(name, price);
    };
  });
}

// --- Nexocoin Virtual Store Logic ---
function loadNexocoin() {
  const saved = localStorage.getItem('nexocoinBalance');
  nexocoinBalance = saved ? parseInt(saved) : 0;
  renderNexocoinBalance();
}

function saveNexocoin() {
  localStorage.setItem('nexocoinBalance', nexocoinBalance);
  renderNexocoinBalance();
}

function renderNexocoinBalance() {
  const balanceEl = document.getElementById('nexocoin-balance');
  if (balanceEl) {
    balanceEl.textContent = nexocoinBalance.toLocaleString('es-CO');
  }
}

function attachNexocoinBuyEvents() {
  document.querySelectorAll('.buy-nexocoin').forEach(button => {
    button.onclick = () => {
      const amount = parseInt(button.getAttribute('data-amount'));
      showTransactionModal(() => {
        nexocoinBalance += amount;
        saveNexocoin();
      });
    };
  });
}

function showTransactionModal(callback) {
  let modal = document.getElementById('transaction-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'transaction-modal';
    modal.innerHTML = `
      <div class="modal fade show" tabindex="-1" style="display:block; background:rgba(0,0,0,0.7);">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content bg-dark text-white">
            <div class="modal-header">
              <h5 class="modal-title">Procesando transacción...</h5>
            </div>
            <div class="modal-body text-center">
              <div class="spinner-border text-warning mb-3" role="status"></div>
              <p>Por favor espera...</p>
            </div>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }
  setTimeout(() => {
    modal.remove();
    if (callback) callback();
  }, 1800);
}

// --- Inicialización global para todas las páginas ---
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  renderCart();
  attachAddToCartEvents();
  loadNexocoin();
  attachNexocoinBuyEvents();
  renderNexocoinBalance();

  // Mostrar modal del carrito al hacer clic en el botón flotante
  const cartBtn = document.getElementById('floating-cart-btn');
  if (cartBtn) {
    cartBtn.addEventListener('click', function() {
      // Renderizar el carrito antes de mostrar el modal
      renderCart();
      const cartModalEl = document.getElementById('cartModal');
      if (cartModalEl) {
        const cartModal = new bootstrap.Modal(cartModalEl);
        cartModal.show();
      }
    });
  }

  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.onclick = function() {
      showLoadingAndSuccess(() => {
        // Vaciar carrito después de la compra
        cartItems = [];
        saveCart();
        renderCart();
        // Cerrar el modal del carrito si está abierto
        const cartModalEl = document.getElementById('cartModal');
        if (cartModalEl) {
          const cartModal = bootstrap.Modal.getInstance(cartModalEl);
          if (cartModal) cartModal.hide();
        }
        // Mostrar la vista de productos
        const mainSection = document.getElementById('main-section');
        if (mainSection) mainSection.classList.remove('d-none');
      });
    };
  }
});

function showLoadingAndSuccess(callback) {
  // Crear modal de cargando
  let modal = document.getElementById('loading-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'loading-modal';
    modal.innerHTML = `
      <div class="modal fade show" tabindex="-1" style="display:block; background:rgba(0,0,0,0.7);">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content bg-dark text-white">
            <div class="modal-header">
              <h5 class="modal-title">Procesando compra...</h5>
            </div>
            <div class="modal-body text-center">
              <div class="spinner-border text-warning mb-3" role="status"></div>
              <p>Por favor espera...</p>
            </div>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }
  setTimeout(() => {
    modal.innerHTML = `
      <div class="modal fade show" tabindex="-1" style="display:block; background:rgba(0,0,0,0.7);">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content bg-success text-white">
            <div class="modal-header">
              <h5 class="modal-title">¡Compra realizada con éxito!</h5>
            </div>
            <div class="modal-body text-center">
              <div class="mb-3">
                <svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' fill='currentColor' class='bi bi-check-circle' viewBox='0 0 16 16'>
                  <path d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.97 11.03a.75.75 0 0 0 1.07 0l3.992-3.992a.75.75 0 1 0-1.06-1.06L7.5 9.439 6.03 7.97a.75.75 0 1 0-1.06 1.06l1.5 1.5z'/>
                </svg>
              </div>
              <p>¡Gracias por tu compra!</p>
            </div>
          </div>
        </div>
      </div>`;
    setTimeout(() => {
      modal.remove();
      if (typeof callback === 'function') callback();
    }, 1500);
  }, 1500);
}
