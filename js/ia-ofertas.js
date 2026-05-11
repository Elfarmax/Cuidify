document.addEventListener("DOMContentLoaded", () => {
  // Verificar si el usuario está autenticado
  const userSession = JSON.parse(localStorage.getItem("usuario_sesion"));
  if (!userSession) {
    window.location.href = "login.html";
    return;
  }

  // Cargar ofertas de IA
  loadIAOffers();
  setupOfferListListener();

  const refreshButton = document.getElementById("refresh-offers-btn");
  if (refreshButton) {
    refreshButton.addEventListener("click", refreshOffers);
  }

  const savePreferencesButton = document.getElementById("save-preferences-btn");
  if (savePreferencesButton) {
    savePreferencesButton.addEventListener("click", savePreferences);
  }

  const themeSelector = document.getElementById("theme-selector");
  if (themeSelector) {
    themeSelector.addEventListener("change", (e) => {
      if (typeof applyTheme === "function") {
        applyTheme(e.target.value);
      }
    });
  }

  const logoLink = document.getElementById("logo-link");
  if (logoLink) {
    logoLink.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  document.getElementById("max-distance").addEventListener("input", (e) => {
    document.getElementById("distance-value").textContent =
      e.target.value + " km";
  });

  document.getElementById("min-salary").addEventListener("input", (e) => {
    document.getElementById("salary-value").textContent =
      e.target.value + "€/hora";
  });

  // Cargar preferencias guardadas
  loadPreferencesFromStorage();
});

// Ofertas de ejemplo generadas por "IA"
const ofertasIAEjemplo = [
  {
    id: 1,
    titulo: "Cuidador/a de Persona Dependiente - Madrid Centro",
    empresa: "Familia García López",
    ubicacion: "Madrid",
    distancia: 3,
    salario: 18,
    tipo: "Jornada Completa",
    descripcion:
      "Se busca cuidador/a profesional para persona mayor de 75 años. Experiencia en movilidad y cuidado básico.",
    requisitos: [
      "Experiencia mínima 5 años",
      "Auxiliar de Enfermería",
      "Referencias",
    ],
    compatibilidad: 95,
    fechaPublicacion: "2024-04-05",
  },
  {
    id: 2,
    titulo: "Asistente Doméstico - Limpieza y Cuidado",
    empresa: "Familia Martínez Ruiz",
    ubicacion: "Madrid",
    distancia: 8,
    salario: 15,
    tipo: "Media Jornada",
    descripcion:
      "Buscamos profesional para limpieza profunda y cuidado de mascotas. Disponibilidad flexible.",
    requisitos: ["Experiencia demostrada", "Responsable", "Amante de animales"],
    compatibilidad: 87,
    fechaPublicacion: "2024-04-04",
  },
  {
    id: 3,
    titulo: "Cuidador de Bebé - Horarios Flexibles",
    empresa: "Familia Sánchez González",
    ubicacion: "Madrid",
    distancia: 5,
    salario: 16,
    tipo: "A Demanda",
    descripcion:
      "Necesitamos educador/a infantil profesional para cuidado de bebé de 6 meses. Horarios flexibles según disponibilidad.",
    requisitos: [
      "Técnico en Educación Infantil",
      "Primeros Auxilios",
      "Experiencia con bebés",
    ],
    compatibilidad: 92,
    fechaPublicacion: "2024-04-03",
  },
  {
    id: 4,
    titulo: "Especialista en Cuidado de Mayores",
    empresa: "Centro de Día Madrid",
    ubicacion: "Madrid",
    distancia: 12,
    salario: 17,
    tipo: "Jornada Completa",
    descripcion:
      "Se requiere profesional especializado en Alzheimer y demencia. Centro con muy buenas condiciones.",
    requisitos: [
      "Especialista en Alzheimer",
      "Paciencia",
      "Formación continua",
    ],
    compatibilidad: 89,
    fechaPublicacion: "2024-04-02",
  },
  {
    id: 5,
    titulo: "Limpiador/a Profesional - Vivienda Particular",
    empresa: "Familia López Fernández",
    ubicacion: "Madrid",
    distancia: 7,
    salario: 14,
    tipo: "Puntuales",
    descripcion:
      "Profesional con herramientas propias para limpieza profunda de vivienda. Material propio es ventaja.",
    requisitos: ["Experiencia en limpieza", "Propia herramienta", "Referencia"],
    compatibilidad: 84,
    fechaPublicacion: "2024-04-01",
  },
];

function loadIAOffers(filtro = null) {
  // Obtener preferencias guardadas
  const prefs = JSON.parse(localStorage.getItem("ia_ofertas_prefs")) || {
    maxDistance: 15,
    minSalary: 15,
    horariosFlexibles: false,
    tiempoCompleto: false,
  };

  // Filtrar ofertas según preferencias
  let ofertasFiltradas = ofertasIAEjemplo.filter((oferta) => {
    if (oferta.distancia > prefs.maxDistance) return false;
    if (oferta.salario < prefs.minSalary) return false;
    if (prefs.horariosFlexibles && oferta.tipo === "Jornada Completa")
      return false;
    if (prefs.tiempoCompleto && oferta.tipo !== "Jornada Completa")
      return false;
    return true;
  });

  // Calcular puntuación de compatibilidad promedio
  const compatibilidadPromedio = Math.round(
    ofertasFiltradas.reduce((sum, o) => sum + o.compatibilidad, 0) /
      ofertasFiltradas.length || 0,
  );

  document.getElementById("compatibility-score").textContent =
    compatibilidadPromedio;

  renderOffers(ofertasFiltradas);
}

function renderOffers(ofertas) {
  const lista = document.getElementById("ofertas-ia-lista");

  if (ofertas.length === 0) {
    lista.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; color: #999; padding: 40px 20px;">
        <p style="font-size: 1.1rem;">🔍 No hay ofertas que coincidan con tus preferencias</p>
        <p style="margin-top: 10px; font-size: 0.95rem;">Intenta ajustar los filtros para ver más opciones</p>
      </div>
    `;
    return;
  }

  lista.innerHTML = ofertas
    .sort((a, b) => b.compatibilidad - a.compatibilidad)
    .map(
      (oferta) => `
      <div class="offer-card" data-offer-card-id="${oferta.id}"
           style="padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; cursor: pointer; transition: all 0.3s ease; background: #fff; position: relative; overflow: hidden;"
           onmouseover="this.style.boxShadow='0 8px 20px rgba(110, 142, 251, 0.15)'; this.style.transform='translateY(-4px)'"
           onmouseout="this.style.boxShadow='none'; this.style.transform='translateY(0)'">
        
        <!-- Badge de compatibilidad -->
        <div style="position: absolute; top: 15px; right: 15px; background: linear-gradient(135deg, #6e8efb, #5a75e6); color: white; padding: 6px 12px; border-radius: 20px; font-weight: 600; font-size: 0.85rem;">
          ${oferta.compatibilidad}% 🎯
        </div>

        <!-- Contenido -->
        <h3 style="margin: 0 0 10px 0; font-size: 1.1rem; color: var(--text-main); padding-right: 80px;">
          ${oferta.titulo}
        </h3>

        <p style="margin: 8px 0; color: #666; font-size: 0.95rem;">
          👥 ${oferta.empresa}
        </p>

        <div style="display: flex; gap: 15px; margin: 12px 0; flex-wrap: wrap;">
          <span style="display: inline-flex; align-items: center; gap: 5px; color: #475569; font-size: 0.9rem;">
            📍 ${oferta.ubicacion} (${oferta.distancia} km)
          </span>
          <span style="display: inline-flex; align-items: center; gap: 5px; color: #16a34a; font-size: 0.9rem; font-weight: 600;">
            💰 ${oferta.salario}€/hora
          </span>
        </div>

        <div style="display: flex; gap: 10px; margin: 12px 0; flex-wrap: wrap;">
          <span style="display: inline-block; background: #f0f4ff; color: #6e8efb; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 500;">
            ${oferta.tipo}
          </span>
          <span style="display: inline-block; background: #f0f9ff; color: #0284c7; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem;">
            Publicado ${formatDateRelative(oferta.fechaPublicacion)}
          </span>
        </div>

        <p style="margin: 12px 0 0 0; color: #666; font-size: 0.9rem; line-height: 1.4;">
          ${oferta.descripcion}
        </p>

        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
          <button class="btn-primary contact-offer-btn" type="button" data-offer-id="${oferta.id}"
                  style="padding: 10px 20px; font-size: 0.9rem; width: 100%;">
            📞 Contactar
          </button>
        </div>
      </div>
    `,
    )
    .join("");
}

function setupOfferListListener() {
  const lista = document.getElementById("ofertas-ia-lista");
  if (!lista) return;

  lista.addEventListener("click", (event) => {
    const button = event.target.closest(".contact-offer-btn");
    if (button) {
      event.stopPropagation();
      const ofertaId = Number(button.dataset.offerId);
      if (!Number.isNaN(ofertaId)) {
        contactOffer(ofertaId);
      }
      return;
    }

    const card = event.target.closest(".offer-card");
    if (card && card.dataset.offerCardId) {
      const ofertaId = Number(card.dataset.offerCardId);
      if (!Number.isNaN(ofertaId)) {
        openOfferDetail(ofertaId);
      }
    }
  });
}

function openOfferDetail(id) {
  const oferta = ofertasIAEjemplo.find((o) => o.id === id);

  if (oferta) {
    alert(`
Oferta: ${oferta.titulo}

Empresa: ${oferta.empresa}
Ubicación: ${oferta.ubicacion} (${oferta.distancia} km)
Salario: ${oferta.salario}€/hora
Tipo: ${oferta.tipo}
Compatibilidad: ${oferta.compatibilidad}%

Descripción:
${oferta.descripcion}

Requisitos:
${oferta.requisitos.map((r, i) => `${i + 1}. ${r}`).join("\n")}

Funcionalidad de solicitud próximamente disponible.
    `);
  }
}

function contactOffer(id) {
  console.log("contactOffer called", id);
  const oferta = ofertasIAEjemplo.find((o) => o.id === id);

  if (oferta) {
    const userSession =
      JSON.parse(localStorage.getItem("usuario_sesion")) || {};
    let mensajes = JSON.parse(localStorage.getItem("mensajes_usuario")) || [];

    const nuevoMensaje = {
      id: Date.now(),
      remitente: oferta.empresa,
      avatar: oferta.empresa.charAt(0).toUpperCase(),
      asunto: `Interés en oferta: ${oferta.titulo}`,
      mensaje: `Hola ${userSession.nombre || "Usuario"}, he visto tu interés en la oferta "${oferta.titulo}". Me gustaría discutir los detalles y disponibilidad. ¿Cuándo podríamos hablar?`,
      fecha: new Date().toISOString().split("T")[0],
      leido: false,
      archivado: false,
      respuestas: [],
    };

    mensajes.push(nuevoMensaje);
    localStorage.setItem("mensajes_usuario", JSON.stringify(mensajes));
    localStorage.setItem("mensajes_abrir", String(nuevoMensaje.id));

    console.log("contactOffer: mensaje creado", nuevoMensaje);
    alert(
      "✅ Éxito: el contacto se ha enviado. Te llevo a Mensajes para negociar.",
    );
    window.location.assign("./mensajes.html");
  }
}

function savePreferences() {
  const prefs = {
    maxDistance: parseInt(document.getElementById("max-distance").value),
    minSalary: parseInt(document.getElementById("min-salary").value),
    horariosFlexibles: document.getElementById("pref-horarios-flexibles")
      .checked,
    tiempoCompleto: document.getElementById("pref-tiempo-completo").checked,
  };

  localStorage.setItem("ia_ofertas_prefs", JSON.stringify(prefs));
  alert("✅ Preferencias guardadas correctamente");

  // Recargar ofertas con nuevas preferencias
  loadIAOffers();
}

function loadPreferencesFromStorage() {
  const prefs = JSON.parse(localStorage.getItem("ia_ofertas_prefs")) || {
    maxDistance: 15,
    minSalary: 15,
    horariosFlexibles: false,
    tiempoCompleto: false,
  };

  document.getElementById("max-distance").value = prefs.maxDistance;
  document.getElementById("distance-value").textContent =
    prefs.maxDistance + " km";

  document.getElementById("min-salary").value = prefs.minSalary;
  document.getElementById("salary-value").textContent =
    prefs.minSalary + "€/hora";

  document.getElementById("pref-horarios-flexibles").checked =
    prefs.horariosFlexibles;
  document.getElementById("pref-tiempo-completo").checked =
    prefs.tiempoCompleto;
}

function refreshOffers(event) {
  // Simular espera de carga
  const btn = event.target;
  const originalText = btn.textContent;
  btn.textContent = "⏳ Actualizando...";
  btn.disabled = true;

  setTimeout(() => {
    loadIAOffers();
    btn.textContent = originalText;
    btn.disabled = false;
    alert("✅ Ofertas actualizadas");
  }, 1500);
}

function formatDateRelative(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "hoy";
  if (diffDays === 1) return "ayer";
  if (diffDays < 7) return `hace ${diffDays} días`;
  if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} semanas`;
  return `hace ${Math.floor(diffDays / 30)} meses`;
}
