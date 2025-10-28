// Función para verificar si el usuario está logueado
function verificarLogin() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    // No redirigir, solo devolver false
    return false;
  }
  return true;
}

// Función para cargar la navbar con el perfil del usuario
function cargarNavbar() {
  const userProfile = document.getElementById('userProfile');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  if (currentUser) {
    userProfile.innerHTML = `
      <div class="user-menu">
        <img src="${currentUser.avatar || '../assets/images/user-avatar.png'}" alt="Perfil" class="user-avatar">
        <span class="user-name">${currentUser.nombre}</span>
        <i class="fas fa-chevron-down dropdown-icon"></i>
      </div>
    `;
  } else {
    userProfile.innerHTML = `<a href="login.html" class="profile-link">Iniciar Sesión</a>`;
  }
}