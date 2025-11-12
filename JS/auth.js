// Simulación de usuarios
let users = JSON.parse(localStorage.getItem('users')) || [];

// Imagen de perfil predeterminada
const DEFAULT_AVATAR = "../assets/images/default-avatar.png";

// Evento de Login
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    // Mostrar pantalla de carga
    const loader = document.getElementById('loader');
    loader.style.display = 'flex';
    document.querySelector('.loader-text').textContent = 'Cargando por favor espere...';

    // Guardar usuario actual
    localStorage.setItem('currentUser', JSON.stringify(user));

    // Simular carga y redirigir
    setTimeout(() => {
      window.location.href = "../pages/productos.html";
    }, 2000);
  } else {
    alert("❌ Credenciales incorrectas");
  }
});

// Evento de Registro
document.getElementById('registerForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (users.some(u => u.email === email)) {
    alert("❌ Este correo ya está registrado");
    return;
  }

  // Crear nuevo usuario con imagen por defecto
  const nuevoUsuario = {
    nombre,
    email,
    password,
    telefono: "",
    direccion: "",
    avatar: DEFAULT_AVATAR
  };

  // Guardar usuario en la lista y en sesión
  users.push(nuevoUsuario);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(nuevoUsuario));

  // Mostrar pantalla de carga antes de redirigir
  const loader = document.getElementById('loader');
  loader.style.display = 'flex';
  document.querySelector('.loader-text').textContent = 'Creando tu cuenta...';

  setTimeout(() => {
    window.location.href = "../pages/productos.html";
  }, 2000);
});
