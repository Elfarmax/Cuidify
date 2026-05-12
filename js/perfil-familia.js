document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario_sesion"));

  if (!usuario || usuario.role !== "familia") {
    window.location.href = "index.html";
    return;
  }

  renderPerfilFamilia(usuario);
  cargarFamiliar();
  cargarServicios();

  // Formulario editar perfil
  const formEdit = document.getElementById("form-edit-profile");
  if (formEdit) {
    formEdit.onsubmit = (e) => {
      e.preventDefault();
      usuario.nombre = document.getElementById("edit-nombre").value;
      usuario.apellidos = document.getElementById("edit-apellidos").value;
      usuario.telefono = document.getElementById("edit-phone").value;
      localStorage.setItem("usuario_sesion", JSON.stringify(usuario));
      renderPerfilFamilia(usuario);
      toggleEditMode();
      alert("Perfil actualizado correctamente");
    };
  }

  // Guardar familiar
  const btnGuardarFamiliar = document.getElementById("btn-guardar-familiar");
  if (btnGuardarFamiliar) {
    btnGuardarFamiliar.addEventListener("click", () => {
      const nombre = document.getElementById("familiar-nombre").value.trim();
      const parentesco = document.getElementById("familiar-parentesco").value;
      const edad = document.getElementById("familiar-edad").value;
      const necesidades = document
        .getElementById("familiar-necesidades")
        .value.trim();

      if (!nombre || !parentesco) {
        alert("Por favor rellena al menos el nombre y el parentesco.");
        return;
      }

      const familiar = { nombre, parentesco, edad, necesidades };
      localStorage.setItem("familiar_datos", JSON.stringify(familiar));
      alert("Datos del familiar guardados correctamente.");
      mostrarFamiliarGuardado(familiar);
    });
  }

  // Guardar servicios
  const btnGuardarServicios = document.getElementById("btn-guardar-servicios");
  if (btnGuardarServicios) {
    btnGuardarServicios.addEventListener("click", () => {
      const checkboxes = document.querySelectorAll(".servicio-check:checked");
      const servicios = Array.from(checkboxes).map((cb) => cb.value);
      localStorage.setItem("servicios_necesitados", JSON.stringify(servicios));
      alert("Preferencias guardadas correctamente.");
    });
  }
});

function renderPerfilFamilia(usuario) {
  document.getElementById("display-name").innerText =
    `${usuario.nombre} ${usuario.apellidos || ""}`;
  document.getElementById("avatar-char").innerText = usuario.nombre
    .charAt(0)
    .toUpperCase();
  document.getElementById("display-bio").innerText =
    usuario.bio || "Sin informacion añadida.";

  const emailLink = document.getElementById("display-email");
  emailLink.href = `mailto:${usuario.email}`;
  emailLink.innerText = usuario.email || "";

  const phoneLink = document.getElementById("display-phone-link");
  if (usuario.telefono) {
    phoneLink.href = `tel:${usuario.telefono}`;
    phoneLink.innerText = usuario.telefono;
  } else {
    phoneLink.innerText = "Añadir telefono";
  }

  document.getElementById("edit-nombre").value = usuario.nombre || "";
  document.getElementById("edit-apellidos").value = usuario.apellidos || "";
  document.getElementById("edit-phone").value = usuario.telefono || "";
}

function cargarFamiliar() {
  const familiar = JSON.parse(localStorage.getItem("familiar_datos"));
  if (!familiar) return;

  document.getElementById("familiar-nombre").value = familiar.nombre || "";
  document.getElementById("familiar-parentesco").value =
    familiar.parentesco || "";
  document.getElementById("familiar-edad").value = familiar.edad || "";
  document.getElementById("familiar-necesidades").value =
    familiar.necesidades || "";

  mostrarFamiliarGuardado(familiar);
}

function mostrarFamiliarGuardado(familiar) {
  const resumen = document.getElementById("familiar-resumen");
  if (!resumen) return;

  resumen.innerHTML = `
    <div style="padding: 12px; background: #f0f4ff; border-radius: 8px; border-left: 4px solid #6e8efb; margin-top: 15px;">
      <p style="margin: 0; font-weight: 600; color: #0f172a;">${familiar.nombre} - ${familiar.parentesco}</p>
      ${familiar.edad ? `<p style="margin: 4px 0 0; color: #64748b; font-size: 0.9rem;">Edad: ${familiar.edad} años</p>` : ""}
      ${familiar.necesidades ? `<p style="margin: 4px 0 0; color: #64748b; font-size: 0.9rem;">${familiar.necesidades}</p>` : ""}
    </div>
  `;
}

function cargarServicios() {
  const servicios =
    JSON.parse(localStorage.getItem("servicios_necesitados")) || [];
  const checkboxes = document.querySelectorAll(".servicio-check");
  checkboxes.forEach((cb) => {
    if (servicios.includes(cb.value)) {
      cb.checked = true;
    }
  });
}

function toggleEditMode() {
  const editMode = document.getElementById("edit-mode");
  editMode.style.display = editMode.style.display === "none" ? "block" : "none";
}
