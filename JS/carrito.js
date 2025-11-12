// --- carrito.js ---
// 🟢 Control central del carrito y su dropdown

document.addEventListener("DOMContentLoaded", inicializarCarrito);

function inicializarCarrito() {
  const cartBtn = document.querySelector(".cart-btn");
  const cartCount = document.getElementById("cartCount");
  if (!cartBtn || !cartCount) return;

  // 🟢 Crear dropdown si no existe
  if (!document.querySelector(".cart-dropdown")) {
    const dropdown = document.createElement("div");
    dropdown.classList.add("cart-dropdown");
    dropdown.innerHTML = `
      <div class="cart-dropdown-header">
        <h4>Tu Carrito</h4>
        <button class="close-cart" id="cerrarCarrito">✖</button>
      </div>
      <div id="cartItems" class="cart-items"></div>
      <div class="cart-dropdown-footer">
        <div id="cartTotal" class="cart-total">Total: $0</div>
        <button id="realizarPedido" class="cart-action-btn">Realizar Pedido</button>
        <button id="verHistorial" class="cart-action-btn secondary">Ver Historial</button>
      </div>
    `;
    document.body.appendChild(dropdown);
  }

  const dropdown = document.querySelector(".cart-dropdown");

  // 🟢 Toggle abrir/cerrar carrito
  cartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    dropdown.classList.toggle("open");
    renderizarCarrito();
  });

  // 🟢 Cerrar solo con el botón ✖
  document.getElementById("cerrarCarrito").addEventListener("click", () => {
    dropdown.classList.remove("open");
  });

  // 🟢 Acciones dentro del carrito
  document.getElementById("realizarPedido").addEventListener("click", realizarPedido);
  document.getElementById("verHistorial").addEventListener("click", () => {
    window.location.href = "pedidos.html";
  });

  actualizarContadorCarrito();

  // 🟢 Evitar que el carrito se cierre al interactuar dentro
  dropdown.addEventListener("click", (e) => e.stopPropagation());

  // 🟢 Cerrar solo si se hace clic fuera (no dentro)
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && !cartBtn.contains(e.target)) {
      dropdown.classList.remove("open");
    }
  });
}

// --- Funciones principales ---

function obtenerCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function eliminarDelCarrito(id) {
  let carrito = obtenerCarrito().filter(item => item.id !== id);
  guardarCarrito(carrito);
  renderizarCarrito();
  actualizarContadorCarrito();
}

// 🟢 Actualiza el número del icono del carrito
function actualizarContadorCarrito() {
  const cartCount = document.getElementById("cartCount");
  const carrito = obtenerCarrito();
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  if (totalItems > 0) {
    cartCount.textContent = totalItems;
    cartCount.style.display = "inline-block";
  } else {
    cartCount.style.display = "none";
  }
}

// 🟢 Renderiza los productos dentro del dropdown
function renderizarCarrito() {
  const carrito = obtenerCarrito();
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  if (!cartItems || !cartTotal) return;

  if (carrito.length === 0) {
    cartItems.innerHTML = `<p class="empty">Tu carrito está vacío</p>`;
    cartTotal.textContent = "Total: $0";
    return;
  }

  let total = 0;
  cartItems.innerHTML = "";

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <span>${item.nombre} x ${item.cantidad}</span>
      <div class="cart-actions">
        <span>$${subtotal}</span>
        <button class="remove-btn" data-id="${item.id}">✖</button>
      </div>
    `;
    cartItems.appendChild(div);
  });

  cartTotal.textContent = `Total: $${total.toFixed(2)}`;

  // 🟢 Añadir eventos a los botones de eliminar
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // Evita que se cierre el dropdown
      eliminarDelCarrito(parseInt(btn.dataset.id));
    });
  });
}

// --- 🟢 Realizar pedido ---
// --- 🟢 Realizar pedido ---
function realizarPedido() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const carrito = obtenerCarrito();

  if (!currentUser) {
    mostrarModal("⚠️ Inicia sesión", "Debes iniciar sesión para realizar un pedido.", "warning");
    setTimeout(() => window.location.href = "login.html", 1500);
    return;
  }

  if (carrito.length === 0) {
    mostrarModal("🛒 Carrito vacío", "Agrega productos antes de realizar un pedido.", "error");
    return;
  }

  const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
  const nuevoPedido = {
    id: pedidos.length + 1,
    cliente: currentUser.nombre,
    productos: carrito,
    fecha: new Date().toLocaleDateString(),
    estado: "pendiente"
  };

  pedidos.push(nuevoPedido);
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
  localStorage.removeItem("carrito");

  mostrarModal("✅ Pedido realizado", "Tu pedido se ha guardado correctamente.", "success");
  renderizarCarrito();
  actualizarContadorCarrito();
}

// --- 🧩 Modal elegante reutilizable ---
function mostrarModal(titulo, mensaje, tipo = "info") {
  const modal = document.createElement("div");
  modal.classList.add("modal-overlay");

  let color;
  switch (tipo) {
    case "success": color = "#2ecc71"; break;
    case "error": color = "#e74c3c"; break;
    case "warning": color = "#f1c40f"; break;
    default: color = "#3498db"; // info
  }

  modal.innerHTML = `
    <div class="modal-content" style="border-top: 6px solid ${color}">
      <h2 style="color:${color}">${titulo}</h2>
      <p>${mensaje}</p>
      <button id="cerrarModalBtn" style="background:${color}">Aceptar</button>
    </div>
  `;

  document.body.appendChild(modal);

  const cerrar = modal.querySelector("#cerrarModalBtn");
  cerrar.addEventListener("click", () => modal.remove());
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });
}

// --- Exportar funciones globales ---
window.mostrarModal = mostrarModal;
window.actualizarContadorCarrito = actualizarContadorCarrito;