// Array de productos (tus productos originales)
const productos = [
  { id: 1, nombre: "Hamburguesa", precio: 15, img: "../assets/images/classicBurguer.jpg", descripcion: "Deliciosa hamburguesa" },
  { id: 2, nombre: "Pizza", precio: 20, img: "../assets/images/Pizza de Pepperoni.jpg", descripcion: "Pizza de pepperoni" },
  { id: 3, nombre: "Refresco", precio: 5, img: "../assets/images/producto3.jpg", descripcion: "Refresco frío" },
  { id: 4, nombre: "Papas Fritas", precio: 8, img: "../assets/images/producto4.jpg", descripcion: "Crispitas doradas" },
  { id: 5, nombre: "Combo Familiar", precio: 35, img: "../assets/images/combofamiliar.jpg", descripcion: "2 hamburguesas + 2 refrescos" }
];

// Función para mostrar los productos
function verProductos() {
  const contenedor = document.getElementById('productos-lista');
  if (!contenedor) return;
  
  let html = '';
  productos.forEach(producto => {
    html += `
      <div class="product-item">
        <img src="${producto.img}" alt="${producto.nombre}">
        <div class="product-info">
          <h3>${producto.nombre}</h3>
          <p>${producto.descripcion}</p>
          <div class="price">$${producto.precio}</div>
          <button class="add-to-cart" onclick="agregarAlCarrito(${producto.id})">Agregar al Carrito</button>
        </div>
      </div>
    `;
  });
  
  contenedor.innerHTML = html;
}

// Función para agregar al carrito
function agregarAlCarrito(idProducto) {
  const producto = productos.find(p => p.id === idProducto);
  if (!producto) return;
  
  // Obtener carrito actual
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  
  // Verificar si ya existe en el carrito
  const productoExistente = carrito.find(item => item.id === idProducto);  
  if (productoExistente) {
    productoExistente.cantidad += 1;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1
    });
  }
  
  // Guardar en localStorage
  localStorage.setItem('carrito', JSON.stringify(carrito));

  
  // Actualizar vista del carrito
  mostrarCarrito();
}

// Función para eliminar producto del carrito
function eliminarDelCarrito(idProducto) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  
  // Filtrar el producto a eliminar
  carrito = carrito.filter(item => item.id !== idProducto);
  
  // Guardar carrito actualizado
  localStorage.setItem('carrito', JSON.stringify(carrito));
  
  // Actualizar vista del carrito
  mostrarCarrito();
}

// Función para mostrar el carrito
function mostrarCarrito() {
  const carritoDiv = document.getElementById('carrito');
  if (!carritoDiv) return;  
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  
  if (carrito.length === 0) {
    carritoDiv.innerHTML = '<p>Tu carrito está vacío</p>';
    return;
  }
  
  let html = '<h3>Carrito de Compras</h3>';
  let total = 0;
  
  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    html += `
      <div class="cart-item">
        <span>${item.nombre} x ${item.cantidad}</span>
        <div class="cart-actions">
          <span>$${subtotal}</span>
          <button class="remove-btn" onclick="eliminarDelCarrito(${item.id})">✖</button>
        </div>
      </div>
    `;
  });
  
  html += `<div class="total">Total: $${total}</div>`;
  html += `<button class="checkout-btn" onclick="realizarPedido()">Realizar Pedido</button>`;
  
  carritoDiv.innerHTML = html;
}

// Función para realizar el pedido
function realizarPedido() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    alert('Debes iniciar sesión para realizar un pedido');
    window.location.href = 'login.html';
    return;
  }
  
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  if (carrito.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }
  
  // Obtener pedidos existentes
  let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
  
  // Crear nuevo pedido
  const nuevoPedido = {
    id: pedidos.length + 1,
    cliente: currentUser.nombre,
    productos: carrito,
    fecha: new Date().toLocaleDateString(),
    estado: 'pendiente'
  };
  
  // Guardar pedido
  pedidos.push(nuevoPedido);
  localStorage.setItem('pedidos', JSON.stringify(pedidos));
  
  // Limpiar carrito
  localStorage.removeItem('carrito');
  
  alert('¡Pedido realizado con éxito!');
  window.location.href = 'pedidos.html';
}

// Función para ver historial de pedidos
function verHistorial() {
  window.location.href = 'pedidos.html';
}

// Función para ver perfil
function verPerfil() {
  window.location.href = 'perfil-cliente.html';
}

// Función para cerrar sesión
function cerrarSesion() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

// Cargar productos cuando la página esté lista
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('productos-lista')) {
    verProductos();
    mostrarCarrito();
  }
});