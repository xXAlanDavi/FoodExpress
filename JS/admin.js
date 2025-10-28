document.addEventListener('DOMContentLoaded', function() {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

  // Mostrar clientes
  const clientesBody = document.getElementById('clientes-body');
  if (clientesBody) {
    users.forEach(user => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${user.nombre}</td>
        <td>${user.email}</td>
        <td><button onclick="eliminarUsuario('${user.email}')">🗑️ Eliminar</button></td>
      `;
      clientesBody.appendChild(tr);
    });
  }

  // Mostrar pedidos con selector de estado
  const pedidosBody = document.getElementById('pedidos-body');
  if (pedidosBody) {
    pedidos.forEach(pedido => {
      let total = pedido.productos.reduce((sum, p) => sum + p.precio, 0);
      let productosNombres = pedido.productos.map(p => p.nombre).join(", ");

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${pedido.id}</td>
        <td>${pedido.cliente}</td>
        <td>
          <select class="estado-select" onchange="actualizarEstado(${pedido.id}, this.value)">
            <option value="pendiente" ${pedido.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
            <option value="enviado" ${pedido.estado === 'enviado' ? 'selected' : ''}>Enviado</option>
            <option value="entregado" ${pedido.estado === 'entregado' ? 'selected' : ''}>Entregado</option>
          </select>
        </td>
        <td>
          <strong>Total:</strong> $${total.toFixed(2)}<br>
          <small>${productosNombres}</small>
        </td>
      `;
      pedidosBody.appendChild(tr);
    });
  }

  // Estilos dinámicos para estados (opcional)
  const style = document.createElement('style');
  style.textContent = `
    .estado-select {
  padding: 0.4rem 0.8rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.estado-select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.estado-select option[value="pendiente"] { color: #e67e22; }
.estado-select option[value="enviado"] { color: #27ae60; }
.estado-select option[value="entregado"] { color: #2980b9; }
  `;
  document.head.appendChild(style);
});

// Eliminar usuario
window.eliminarUsuario = function(email) {
  if (confirm(`¿Eliminar al usuario ${email}? Esta acción no se puede deshacer.`)) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const nuevosUsuarios = users.filter(u => u.email !== email);
    localStorage.setItem('users', JSON.stringify(nuevosUsuarios));
    alert(`Usuario ${email} eliminado.`);
    location.reload();
  }
};

// Actualizar estado del pedido
window.actualizarEstado = function(id, estado) {
  let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
  const indice = pedidos.findIndex(p => p.id === id);

  if (indice !== -1) {
    const estadoAnterior = pedidos[indice].estado;
    pedidos[indice].estado = estado;
    localStorage.setItem('pedidos', JSON.stringify(pedidos));

    // Notificación amigable
    const mensajes = {
      pendiente: "El pedido está pendiente de preparación.",
      enviado: "¡El pedido ha sido enviado!",
      entregado: "✅ El pedido ha sido entregado al cliente."
    };

    alert(`Estado actualizado: ${mensajes[estado] || estado}`);

    // Opcional: recargar solo la tabla, no toda la página
    // location.reload(); // <-- Puedes quitarlo si haces actualización dinámica

    // Recargar página para ver cambios reflejados
    location.reload();
  } else {
    alert("No se encontró el pedido.");
  }
};