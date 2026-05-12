document.addEventListener("DOMContentLoaded", () => {
  let user = JSON.parse(localStorage.getItem("usuario_sesion"));

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  renderProfile(user);

  const formEdit = document.getElementById("form-edit-profile");
  if (formEdit) {
    formEdit.onsubmit = (e) => {
      e.preventDefault();

      user.nombre = document.getElementById("edit-nombre").value;
      user.apellidos = document.getElementById("edit-apellidos").value;
      user.bio = document.getElementById("edit-bio").value;
      user.telefono = document.getElementById("edit-phone").value;
      user.precio = document.getElementById("edit-precio").value;

      localStorage.setItem("usuario_sesion", JSON.stringify(user));

      renderProfile(user);
      toggleEditMode();
      alert("✅ Perfil actualizado correctamente");
      window.location.reload();
    };
  }
});

function renderProfile(user) {
  document.getElementById("display-name").innerText =
    `${user.nombre} ${user.apellidos}`;
  document.getElementById("display-email").innerText = user.email;
  document.getElementById("display-bio").innerText =
    user.bio || "Añade una biografía profesional para destacar...";

  const roleElement = document.getElementById("display-role");
  roleElement.innerText =
    user.role === "cuidador"
      ? "👷 Profesional de Cuidados"
      : "👨‍👩‍👧 Cliente/Familia";

  if (user.nombre) {
    document.getElementById("avatar-char").innerText = user.nombre
      .charAt(0)
      .toUpperCase();
  }

  const emailLink = document.getElementById("display-email");
  emailLink.href = `mailto:${user.email}`;
  emailLink.innerText = `📧 ${user.email}`;

  const phoneLink = document.getElementById("display-phone-link");
  if (user.telefono) {
    phoneLink.href = `tel:${user.telefono}`;
    phoneLink.innerText = `📱 ${user.telefono}`;
  } else {
    phoneLink.innerText = "📱 Añadir teléfono";
  }

  const precioElement = document.getElementById("display-precio");
  precioElement.innerText = user.precio
    ? `${user.precio}€/hora`
    : "A consultar";

  document.getElementById("edit-nombre").value = user.nombre || "";
  document.getElementById("edit-apellidos").value = user.apellidos || "";
  document.getElementById("edit-bio").value = user.bio || "";
  document.getElementById("edit-phone").value = user.telefono || "";
  document.getElementById("edit-precio").value = user.precio || "";

  loadAllData();
}

function toggleEditMode() {
  const viewMode = document.getElementById("view-mode");
  const editMode = document.getElementById("edit-mode");

  if (viewMode.style.display === "none") {
    viewMode.style.display = "block";
    editMode.style.display = "none";
  } else {
    viewMode.style.display = "none";
    editMode.style.display = "block";
  }
}

// ========== SKILLS ==========
let skillsData = JSON.parse(localStorage.getItem("user_skills")) || [];

function toggleSkillsMenu() {
  const panel = document.getElementById("skills-edit-panel");
  panel.style.display = panel.style.display === "none" ? "block" : "none";
}

function addSkill() {
  const input = document.getElementById("input-skill-name");
  const skill = input.value.trim();

  if (!skill) {
    alert("Por favor, ingresa una especialidad");
    return;
  }

  if (skillsData.length >= 5) {
    alert("Máximo 5 especialidades");
    return;
  }

  if (!skillsData.includes(skill)) {
    skillsData.push(skill);
    localStorage.setItem("user_skills", JSON.stringify(skillsData));
    input.value = "";
    renderSkills();
    toggleSkillsMenu();
  }
}

function removeSkill(skill) {
  skillsData = skillsData.filter((s) => s !== skill);
  localStorage.setItem("user_skills", JSON.stringify(skillsData));
  renderSkills();
}

function renderSkills() {
  const container = document.getElementById("skills-container");

  if (skillsData.length === 0) {
    container.innerHTML =
      '<p class="empty-state">No hay especialidades añadidas</p>';
    return;
  }

  container.innerHTML = skillsData
    .map(
      (skill) => `
    <div style="background: linear-gradient(135deg, #6e8efb, #5a75e6); color: white; padding: 8px 16px; border-radius: 20px; font-weight: 500; display: flex; align-items: center; gap: 8px;">
      🎯 ${skill}
      <button type="button" onclick="removeSkill('${skill}')" class="remove-btn" style="background: rgba(255,255,255,0.3); border: none; color: white; padding: 2px 6px; border-radius: 4px; cursor: pointer; font-weight: bold; transition: all 0.2s;">✕</button>
    </div>
  `,
    )
    .join("");
}

// ========== CERTIFICACIONES ==========
let certificationsData =
  JSON.parse(localStorage.getItem("user_certifications")) || [];

function addCertificate(type) {
  let certValue = "";

  if (type === "select") {
    const select = document.getElementById("select-cert-oficial");
    certValue = select.value;
    select.value = "";
  } else {
    const input = document.getElementById("input-cert-libre");
    certValue = input.value.trim();
    if (!certValue) {
      alert("Por favor, ingresa una certificación");
      return;
    }
    input.value = "";
  }

  if (!certValue) return;

  if (certificationsData.length >= 5) {
    alert("Máximo 5 certificaciones");
    return;
  }

  if (!certificationsData.includes(certValue)) {
    certificationsData.push(certValue);
    localStorage.setItem(
      "user_certifications",
      JSON.stringify(certificationsData),
    );
    renderCertifications();
  }
}

function removeCertification(cert) {
  certificationsData = certificationsData.filter((c) => c !== cert);
  localStorage.setItem(
    "user_certifications",
    JSON.stringify(certificationsData),
  );
  renderCertifications();
}

function renderCertifications() {
  const container = document.getElementById("selected-certs-container");

  if (certificationsData.length === 0) {
    container.innerHTML =
      '<p class="empty-state">Añade tus certificaciones profesionales</p>';
    return;
  }

  container.innerHTML = certificationsData
    .map(
      (cert) => `
    <div style="background: linear-gradient(135deg, #6e8efb, #5a75e6); color: white; padding: 8px 16px; border-radius: 20px; font-weight: 500; display: flex; align-items: center; gap: 8px;">
      🎓 ${cert}
      <button type="button" onclick="removeCertification('${cert}')" class="remove-btn" style="background: rgba(255,255,255,0.3); border: none; color: white; padding: 2px 6px; border-radius: 4px; cursor: pointer; font-weight: bold;">✕</button>
    </div>
  `,
    )
    .join("");
}

// ========== EQUIPAMIENTO ==========
let equipmentData = JSON.parse(localStorage.getItem("user_equipment")) || [];

function addEquipo() {
  const input = document.getElementById("input-equipo-libre");
  const equipo = input.value.trim();

  if (!equipo) {
    alert("Por favor, ingresa un equipo");
    return;
  }

  if (equipmentData.length >= 10) {
    alert("Máximo 10 equipos");
    return;
  }

  if (!equipmentData.includes(equipo)) {
    equipmentData.push(equipo);
    localStorage.setItem("user_equipment", JSON.stringify(equipmentData));
    input.value = "";
    renderEquipment();
  }
}

function removeEquipo(item) {
  equipmentData = equipmentData.filter((e) => e !== item);
  localStorage.setItem("user_equipment", JSON.stringify(equipmentData));
  renderEquipment();
}

function renderEquipment() {
  const container = document.getElementById("selected-equipo-container");

  if (equipmentData.length === 0) {
    container.innerHTML = '<p class="empty-state">Añade tu equipamiento</p>';
    return;
  }

  container.innerHTML = equipmentData
    .map(
      (item) => `
    <div style="background: linear-gradient(135deg, #6e8efb, #5a75e6); color: white; padding: 8px 16px; border-radius: 20px; font-weight: 500; display: flex; align-items: center; gap: 8px;">
      🛠️ ${item}
      <button type="button" onclick="removeEquipo('${item}')" class="remove-btn" style="background: rgba(255,255,255,0.3); border: none; color: white; padding: 2px 6px; border-radius: 4px; cursor: pointer; font-weight: bold;">✕</button>
    </div>
  `,
    )
    .join("");
}

// ========== EXPERIENCIA ==========
let experienceData = JSON.parse(localStorage.getItem("user_experience")) || [];

function addExperiencia() {
  const titulo = document.getElementById("input-exp-titulo").value.trim();
  const fecha = document.getElementById("input-exp-fecha").value.trim();
  const descripcion = document
    .getElementById("input-exp-descripcion")
    .value.trim();

  if (!titulo || !fecha) {
    alert("Por favor, rellena el título y la fecha");
    return;
  }

  experienceData.push({ titulo, fecha, descripcion });
  localStorage.setItem("user_experience", JSON.stringify(experienceData));

  document.getElementById("input-exp-titulo").value = "";
  document.getElementById("input-exp-fecha").value = "";
  document.getElementById("input-exp-descripcion").value = "";

  renderExperience();
}

function removeExperiencia(index) {
  experienceData.splice(index, 1);
  localStorage.setItem("user_experience", JSON.stringify(experienceData));
  renderExperience();
}

function renderExperience() {
  const container = document.getElementById("experience-container");
  if (experienceData.length === 0) {
    container.innerHTML =
      '<p class="empty-state">No hay experiencia añadida</p>';
    return;
  }
  container.innerHTML = experienceData
    .map(
      (exp, index) => `
    <div class="experience-item">
      <div class="experience-header">
        <h4 class="experience-title">${exp.titulo}</h4>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span class="experience-date">${exp.fecha}</span>
          <button type="button" onclick="removeExperiencia(${index})" style="background: #fee2e2; border: none; color: #b91c1c; padding: 2px 8px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 0.8rem;">Eliminar</button>
        </div>
      </div>
      ${exp.descripcion ? `<p class="experience-description">${exp.descripcion}</p>` : ""}
    </div>
  `,
    )
    .join("");
}

// ========== IDIOMAS ==========
let languagesData = JSON.parse(localStorage.getItem("user_languages")) || [];

function addIdioma() {
  const nombre = document.getElementById("input-idioma-nombre").value.trim();
  const nivel = document.getElementById("input-idioma-nivel").value;

  if (!nombre || !nivel) {
    alert("Por favor, rellena el idioma y el nivel");
    return;
  }

  languagesData.push({ nombre, nivel });
  localStorage.setItem("user_languages", JSON.stringify(languagesData));

  document.getElementById("input-idioma-nombre").value = "";
  document.getElementById("input-idioma-nivel").value = "";

  renderLanguages();
}

function removeIdioma(index) {
  languagesData.splice(index, 1);
  localStorage.setItem("user_languages", JSON.stringify(languagesData));
  renderLanguages();
}

function renderLanguages() {
  const container = document.getElementById("languages-container");
  if (languagesData.length === 0) {
    container.innerHTML = '<p class="empty-state">No hay idiomas añadidos</p>';
    return;
  }
  container.innerHTML = languagesData
    .map(
      (lang, index) => `
    <div class="language-item">
      <span class="language-name">${lang.nombre}</span>
      <div style="display: flex; align-items: center; gap: 10px;">
        <span class="language-level">${lang.nivel}</span>
        <button type="button" onclick="removeIdioma(${index})" style="background: #fee2e2; border: none; color: #b91c1c; padding: 2px 8px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 0.8rem;">✕</button>
      </div>
    </div>
  `,
    )
    .join("");
}

// Cargar todos los datos al iniciar
function loadAllData() {
  renderSkills();
  renderCertifications();
  renderEquipment();
  renderExperience();
  renderLanguages();
}
