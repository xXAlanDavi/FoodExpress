// Simulación de usuarios
let users = JSON.parse(localStorage.getItem('users')) || [];

// Evento de Login
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    alert("✅ Inicio de sesión exitoso");
    window.location.href = "../pages/productos.html"; // ✅ Ruta absoluta desde raíz
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
  alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
  window.location.href = "../pages/login.html"; // ✅ Ruta absoluta desde raíz
});