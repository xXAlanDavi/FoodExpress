// Simulación de usuarios
let users = JSON.parse(localStorage.getItem('users')) || [];

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

    // Guardar usuario
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
  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (users.some(u => u.email === email)) {
    alert("❌ Este correo ya está registrado");
    return;
  }

  users.push({ nombre, email, password });
  localStorage.setItem('users', JSON.stringify(users));

  // Mostrar pantalla de carga antes de redirigir
  const loader = document.getElementById('loader');
  loader.style.display = 'flex';
  document.querySelector('.loader-text').textContent = 'Creando tu cuenta...';

  setTimeout(() => {
    window.location.href = "../pages/productos.html";
  }, 2000);
});
