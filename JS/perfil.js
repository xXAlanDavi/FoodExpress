/* =======================================================
   PERFIL DE USUARIO (simulado con localStorage)
   ======================================================= */

// === Elementos del DOM ===
const loginMessage = document.getElementById('loginMessage');
const profileContent = document.getElementById('profileContent');
const navbarAvatar = document.getElementById('navbarAvatar');
const navbarUserName = document.getElementById('navbarUserName');
const avatarImage = document.getElementById('avatarImage');
const avatarUpload = document.getElementById('avatarUpload');
const logoutModal = document.getElementById('logoutModal');
const confirmLogout = document.getElementById('confirmLogout');
const cancelLogout = document.getElementById('cancelLogout');

// === Imagen predeterminada ===
const DEFAULT_AVATAR = "../assets/images/default-avatar.png";

// === Función: Verificar si hay sesión iniciada ===
function verificarLogin() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const isLoggedIn = !!currentUser;

  loginMessage.style.display = isLoggedIn ? 'none' : 'block';
  profileContent.style.display = isLoggedIn ? 'block' : 'none';

  return isLoggedIn;
}

// === Función: Cargar datos del usuario al perfil ===
function cargarPerfilUsuario() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) return;

  // Si el usuario no tiene avatar, asignar el predeterminado
  if (!currentUser.avatar || currentUser.avatar.trim() === "") {
    currentUser.avatar = DEFAULT_AVATAR;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }

  // Actualizar datos visuales
  document.getElementById('userName').textContent = currentUser.nombre || 'Usuario';
  document.getElementById('userEmail').textContent = currentUser.email || 'Sin correo';
  document.getElementById('nombre').value = currentUser.nombre || '';
  document.getElementById('email').value = currentUser.email || '';
  document.getElementById('telefono').value = currentUser.telefono || '';
  document.getElementById('direccion').value = currentUser.direccion || '';

  // Actualizar avatar
  avatarImage.src = currentUser.avatar;
  navbarAvatar.src = currentUser.avatar;

  // Nombre en navbar
  navbarUserName.textContent = currentUser.nombre || 'Mi Perfil';
}

// === Función: Guardar cambios de perfil ===
function guardarCambiosPerfil(e) {
  e.preventDefault();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) return;

  currentUser.nombre = document.getElementById('nombre').value.trim();
  currentUser.email = document.getElementById('email').value.trim();
  currentUser.telefono = document.getElementById('telefono').value.trim();
  currentUser.direccion = document.getElementById('direccion').value.trim();

  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  alert('✅ Cambios guardados correctamente');
  cargarPerfilUsuario();
}

// === Función: Cambiar contraseña ===
function cambiarContrasena(e) {
  e.preventDefault();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) return;

  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (currentPassword !== currentUser.password)
    return alert('❌ La contraseña actual es incorrecta');
  if (newPassword !== confirmPassword)
    return alert('❌ Las contraseñas no coinciden');

  currentUser.password = newPassword;
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  alert('🔒 Contraseña actualizada correctamente');
  document.getElementById('passwordForm').reset();
}

// === Función: Cambiar foto de perfil ===
function cambiarFotoPerfil(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = event => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    currentUser.avatar = event.target.result;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    avatarImage.src = event.target.result;
    navbarAvatar.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

// === Modal de cierre de sesión ===
function mostrarModalLogout() {
  logoutModal.classList.add('active');
}

confirmLogout.addEventListener('click', () => {
  logoutModal.classList.remove('active');

  // Mostrar pantalla de carga
  const logoutLoader = document.getElementById('logoutLoader');
  logoutLoader.classList.add('active');

  // Eliminar sesión después de un breve retraso
  setTimeout(() => {
    localStorage.removeItem('currentUser');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
  }, 500);
});

cancelLogout.addEventListener('click', () => {
  logoutModal.classList.remove('active');
});

// === Actualizar contador del carrito ===
function actualizarCarritoNavbar() {
  const cartCount = document.getElementById('cartCount');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

  if (!currentUser || pedidos.length === 0) {
    cartCount.style.display = 'none';
    return;
  }

  const misPedidos = pedidos.filter(p => p.cliente === currentUser.nombre);
  const ultimo = misPedidos[misPedidos.length - 1];
  const totalProductos = ultimo?.productos?.length || 0;

  cartCount.textContent = totalProductos;
  cartCount.style.display = totalProductos > 0 ? 'block' : 'none';
}

// === Inicialización ===
document.addEventListener('DOMContentLoaded', () => {
  if (verificarLogin()) {
    cargarPerfilUsuario();
    actualizarCarritoNavbar();
  }
});

document.getElementById('profileForm').addEventListener('submit', guardarCambiosPerfil);
document.getElementById('passwordForm').addEventListener('submit', cambiarContrasena);
document.getElementById('logoutBtn').addEventListener('click', mostrarModalLogout);
avatarUpload.addEventListener('change', cambiarFotoPerfil);


