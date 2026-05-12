document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("form-login");

  if (formLogin) {
    formLogin.onsubmit = async (e) => {
      e.preventDefault();

      const email = document.getElementById("login-email").value;
      const pass = document.getElementById("login-password").value;

      try {
        const response = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password_hash: pass }),
        });

        if (response.ok) {
          const userData = await response.json();

          const sesion = {
            id: userData.id,
            nombre: userData.nombre,
            apellidos: userData.apellidos,
            email: userData.email,
            role: userData.rol,
            bio: userData.bio || "",
            telefono: userData.telefono || "",
          };

          localStorage.setItem("usuario_sesion", JSON.stringify(sesion));

          // Redirigir según el rol
          if (userData.rol === "cuidador") {
            window.location.href = "perfil.html";
          } else {
            window.location.href = "perfil-familia.html";
          }
        } else {
          alert("Correo o contraseña incorrectos en la base de datos.");
        }
      } catch (error) {
        console.warn(
          "Conexión fallida con el servidor. Iniciando sesión local de prueba...",
        );

        const backupUser = {
          nombre: "Usuario",
          apellidos: "Visitante",
          email: email,
          role: "cuidador",
          bio: "Sesión iniciada sin servidor activo.",
          telefono: "",
        };

        localStorage.setItem("usuario_sesion", JSON.stringify(backupUser));
        alert("Entrando en modo local (Servidor offline)");
        window.location.href = "perfil.html";
      }
    };
  }
});
