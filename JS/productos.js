// --- productos.js ---
// Muestra los productos y permite agregarlos al carrito con modal global

// Lista de productos simulados
const productos = [
  { id: 1, nombre: "Hamburguesa", precio: 15, img: "../assets/images/classicBurguer.jpg", descripcion: "Deliciosa hamburguesa" },
  { id: 2, nombre: "Pizza", precio: 20, img: "../assets/images/Pizza de Pepperoni.jpg", descripcion: "Pizza de pepperoni" },
  { id: 3, nombre: "Refresco", precio: 5, img: "../assets/images/producto3.jpg", descripcion: "Refresco frío" },
  { id: 4, nombre: "Papas Fritas", precio: 8, img: "../assets/images/producto4.jpg", descripcion: "Crispitas doradas" },
  { id: 5, nombre: "Combo Familiar", precio: 35, img: "../assets/images/combofamiliar.jpg", descripcion: "2 hamburguesas + 2 refrescos" }
];

// Renderizar productos en pantalla
function renderizarProductos() {
  const contenedor = document.getElementById("productos-lista");
  if (!contenedor) return;

  contenedor.innerHTML = productos.map(p => `
    <div class="product-item">
      <img src="${p.img}" alt="${p.nombre}">
      <div class="product-info">
        <h3>${p.nombre}</h3>
        <p>${p.descripcion}</p>
        <div class="price">$${p.precio}</div>
        <button class="add-to-cart" onclick="agregarAlCarrito(${p.id})">Agregar al Carrito</button>
      </div>
    </div>
  `).join("");
}

// Agregar producto al carrito
function agregarAlCarrito(idProducto) {
  const producto = productos.find(p => p.id === idProducto);
  if (!producto) return;

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const item = carrito.find(i => i.id === producto.id);

  if (item) {
    item.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));

  // Actualizar contador visual (usa función global si existe)
  if (typeof actualizarContadorCarrito === "function") {
    actualizarContadorCarrito();
  }

  // Mostrar modal de éxito
  mostrarModalExito();
}

// Función para mostrar el modal de éxito
function mostrarModalExito() {
  const modal = document.getElementById("successModal");
  const closeBtn = document.getElementById("closeModalBtn");

  if (!modal) return;

  modal.style.display = "flex";

  closeBtn.onclick = () => {
    modal.style.display = "none";
  };

  modal.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };
}

// Cargar productos y perfil al iniciar
document.addEventListener("DOMContentLoaded", () => {
  renderizarProductos();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navbarAvatar = document.getElementById("navbarAvatar");
  const navbarUserName = document.getElementById("navbarUserName");

  const DEFAULT_AVATAR = "../assets/images/default-avatar.png";

  if (currentUser) {
    navbarAvatar.src = currentUser.avatar || DEFAULT_AVATAR;
    navbarUserName.textContent = currentUser.nombre || "Usuario";
  } else {
    navbarAvatar.src = DEFAULT_AVATAR;
    navbarUserName.textContent = "Mi Perfil";
  }
});
