document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
  
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
  
    // Roles
    if (user === "admin" && pass === "admin123") {
      window.location.href = "panel-admin.html";
    } else if (user === "usuario" && pass === "usuario123") {
      window.location.href = "panel-usuario.html";
    } else {
      alert("Credenciales inválidas");
    }
  });
  