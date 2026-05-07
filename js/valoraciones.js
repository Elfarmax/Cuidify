document.addEventListener("DOMContentLoaded", async () => {
  const usuario = JSON.parse(localStorage.getItem("usuario_sesion"));
  const form = document.getElementById("formComentario");
  const loginMsg = document.getElementById("login-required-msg");

  // Ocultar mensaje de login y mostrar siempre el formulario
  if (loginMsg) loginMsg.style.display = "none";
  if (form) form.style.display = "grid";

  // Si hay sesión, rellenar el nombre automáticamente
  if (usuario && document.getElementById("nombre")) {
    document.getElementById("nombre").value =
      usuario.nombre + " " + (usuario.apellidos || "");
  }

  // Cargar valoraciones de la BD
  await cargarValoracionesIndex();

  // Enviar valoración
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Comprobar sesión al enviar
      if (!usuario) {
        alert(
          "⚠️ Para publicar una valoración necesitas tener una cuenta. ¡Regístrate gratis!",
        );
        return;
      }

      const puntuacion = document.getElementById("rating").value;
      const comentario = document.getElementById("mensaje").value;
      const autor_nombre = document.getElementById("nombre").value;

      if (!puntuacion || !comentario) return alert("Rellena todos los campos");

      try {
        const res = await fetch("http://localhost:3000/valoraciones", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // En el index, la valoración es general, así que enviamos null
            cuidador_id: null,
            autor_nombre,
            puntuacion: parseInt(puntuacion),
            comentario,
          }),
        });

        if (res.ok) {
          alert("¡Valoración publicada!");
          document.getElementById("mensaje").value = "";
          // Opcional: resetear el select de estrellas
          document.getElementById("rating").value = "5";
          await cargarValoracionesIndex();
        } else {
          const errorData = await res.json();
          alert("Error al publicar: " + (errorData.detail || "Error desconocido"));
        }
      } catch (err) {
        console.error("Error en la petición:", err);
        alert("No se pudo conectar con el servidor.");
      }
    });
  }
});

async function cargarValoracionesIndex() {
  try {
    const res = await fetch("http://localhost:3000/valoraciones/todas");
    const valoraciones = await res.json();
    const grid = document.getElementById("testimoniosGrid");

    if (!grid) return;
    if (!valoraciones || valoraciones.length === 0) {
      grid.innerHTML = "<p>No hay valoraciones disponibles.</p>";
      return;
    }

    grid.innerHTML = valoraciones
      .map(
        (v) => `
        <div class="testimonio-card">
          <div class="estrellas">${"⭐".repeat(v.puntuacion || 5)}</div>
          <p class="texto-testimonio">"${v.comentario}"</p>
          <div class="autor-info">
            <div class="avatar">${v.autor_nombre ? v.autor_nombre.charAt(0).toUpperCase() : "?"}</div>
            <div>
              <h4>${v.autor_nombre || "Anónimo"}</h4>
              <span>${v.created_at ? new Date(v.created_at).toLocaleDateString("es-ES") : "Reciente"}</span>
            </div>
          </div>
        </div>
      `,
      )
      .join("");
  } catch (err) {
    console.error("Error cargando valoraciones:", err);
  }
}