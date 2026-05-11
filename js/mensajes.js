document.addEventListener("DOMContentLoaded", () => {
  // Verificar si el usuario está autenticado
  const userSession = JSON.parse(localStorage.getItem("usuario_sesion"));
  if (!userSession) {
    window.location.href = "login.html";
    return;
  }

  // Cargar mensajes del localStorage
  loadMessages();

  const searchInput = document.getElementById("search-messages");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearch = e.target.value;
      const mensajes =
        JSON.parse(localStorage.getItem("mensajes_usuario")) || mensajesEjemplo;
      renderMessages(mensajes, currentFilter, currentSearch);
    });
  }

  filterMessages(currentFilter);

  const mensajeAbrirId = localStorage.getItem("mensajes_abrir");
  if (mensajeAbrirId) {
    openMessage(Number(mensajeAbrirId));
    localStorage.removeItem("mensajes_abrir");
  }
});

// Simulamos una lista de mensajes de ejemplo
const mensajesEjemplo = [
  {
    id: 1,
    remitente: "María López",
    avatar: "M",
    asunto: "Disponibilidad para cuidar a mi padre",
    mensaje:
      "Hola, vi tu perfil y me interesa contratar tus servicios para el cuidado de mi padre. ¿Cuál es tu disponibilidad?",
    fecha: "2024-04-05",
    leido: false,
    archivado: false,
    respuestas: [],
  },
  {
    id: 2,
    remitente: "Juan García",
    avatar: "J",
    asunto: "Consulta sobre servicios",
    mensaje:
      "Necesito ayuda con limpieza de mi casa. ¿Tienes experiencia? ¿Cuál es tu tarifa?",
    fecha: "2024-04-04",
    leido: true,
    archivado: false,
    respuestas: [],
  },
  {
    id: 3,
    remitente: "Ana Martínez",
    avatar: "A",
    asunto: "Oferta de trabajo disponible",
    mensaje:
      "Tengo una oportunidad de trabajo que se ajusta a tu perfil. Interesado en conocer más detalles?",
    fecha: "2024-04-03",
    leido: true,
    archivado: false,
    respuestas: [],
  },
];

let selectedMessageId = null;
let currentFilter = "todos";
let currentSearch = "";

function loadMessages() {
  let mensajes =
    JSON.parse(localStorage.getItem("mensajes_usuario")) || mensajesEjemplo;

  if (!localStorage.getItem("mensajes_usuario")) {
    localStorage.setItem("mensajes_usuario", JSON.stringify(mensajesEjemplo));
  }

  renderMessages(mensajes, currentFilter, currentSearch);
  updateFilterCounts(mensajes);
  return mensajes;
}

function renderMessages(mensajes, filtro = "todos", search = "") {
  const lista = document.getElementById("mensajes-lista");
  let mensajesFiltrados = mensajes.slice();

  if (filtro === "noLeidos") {
    mensajesFiltrados = mensajesFiltrados.filter((m) => !m.leido);
  } else if (filtro === "archivados") {
    mensajesFiltrados = mensajesFiltrados.filter((m) => m.archivado);
  }

  if (search.trim()) {
    const query = search.trim().toLowerCase();
    mensajesFiltrados = mensajesFiltrados.filter(
      (m) =>
        m.remitente.toLowerCase().includes(query) ||
        m.asunto.toLowerCase().includes(query) ||
        m.mensaje.toLowerCase().includes(query),
    );
  }

  if (mensajesFiltrados.length === 0) {
    lista.innerHTML = `
      <div class="message-empty-state">
        <p class="message-empty-title">📭 No hay mensajes</p>
        <p class="message-empty-text">Aún no tienes conversaciones que mostrar. Usa el botón de contactar para crear una nueva negociación.</p>
      </div>
    `;
    return;
  }

  lista.innerHTML = mensajesFiltrados
    .map((mensaje) => {
      const isSelected = selectedMessageId === mensaje.id;
      const cardState = mensaje.leido ? "" : "message-card-new";
      const cardSelected = isSelected ? "message-card-selected" : "";

      return `
        <div class="message-card ${cardState} ${cardSelected}" onclick="openMessage(${mensaje.id})">
          <div class="message-card-avatar">${mensaje.avatar}</div>
          <div class="message-card-meta">
            <div class="message-card-title">
              <strong>${mensaje.remitente}</strong>
              <span class="message-card-time">${formatDate(mensaje.fecha)}</span>
            </div>
            <p class="message-card-subject">${mensaje.asunto}</p>
            <p class="message-card-preview">${mensaje.mensaje || (mensaje.respuestas && mensaje.respuestas.length > 0 ? mensaje.respuestas[mensaje.respuestas.length - 1].texto : "Pulsa para escribir tu primer mensaje...")}</p>
          </div>
          <div class="message-card-actions">
            ${!mensaje.archivado ? `<button onclick="archiveMessage(event, ${mensaje.id})" class="btn-outline btn-small">📦 Archivar</button>` : ""}
            <button onclick="deleteMessage(event, ${mensaje.id})" class="btn-outline btn-small btn-danger">🗑️ Eliminar</button>
          </div>
        </div>
      `;
    })
    .join("");
}

function openMessage(id) {
  const mensajes =
    JSON.parse(localStorage.getItem("mensajes_usuario")) || mensajesEjemplo;
  const mensaje = mensajes.find((m) => m.id === id);

  if (!mensaje) {
    return;
  }

  mensaje.leido = true;
  localStorage.setItem("mensajes_usuario", JSON.stringify(mensajes));
  selectedMessageId = id;

  renderMessages(mensajes, currentFilter, currentSearch);
  renderMessageDetail(mensaje);
}

function renderMessageDetail(mensaje) {
  const detail = document.getElementById("message-detail");
  detail.innerHTML = `
    <div class="chat-panel">
      <div class="chat-header">
        <div class="chat-user">
          <div class="chat-avatar">${mensaje.avatar}</div>
          <div class="chat-user-details">
            <h2>${mensaje.remitente}</h2>
            <p>${mensaje.asunto}</p>
          </div>
        </div>
        <span class="chat-status">${mensaje.archivado ? "Archivado" : mensaje.leido ? "Abierto" : "Nuevo"}</span>
      </div>

      <div class="chat-history" id="chat-history">
        ${
          mensaje.mensaje
            ? `
          <div class="chat-bubble incoming">
            <p>${mensaje.mensaje}</p>
            <small>${formatDate(mensaje.fecha)}</small>
          </div>
        `
            : ""
        }
      </div>

      <div class="chat-compose">
        <label for="respuesta-text" class="chat-label">Tu mensaje</label>
        <textarea id="respuesta-text" rows="4" placeholder="Escribe tu respuesta aquí..."></textarea>
        <button class="btn-primary full" onclick="sendReply(${mensaje.id})">✉️ Enviar respuesta</button>
      </div>
    </div>
  `;

  loadRespuestas(mensaje.id);
}

function archiveMessage(event, id) {
  event.stopPropagation();
  const mensajes =
    JSON.parse(localStorage.getItem("mensajes_usuario")) || mensajesEjemplo;
  const mensaje = mensajes.find((m) => m.id === id);

  if (mensaje) {
    mensaje.archivado = true;
    localStorage.setItem("mensajes_usuario", JSON.stringify(mensajes));
    if (selectedMessageId === id) {
      selectedMessageId = null;
      document.getElementById("message-detail").innerHTML = `
        <div class="message-detail-empty">
          <h2>Selecciona un mensaje para continuar</h2>
          <p class="text-muted">El mensaje archivado ya no se muestra en la vista principal.</p>
        </div>
      `;
    }
    renderMessages(mensajes, currentFilter, currentSearch);
  }
}

function deleteMessage(event, id) {
  event.stopPropagation();
  if (confirm("¿Deseas eliminar este mensaje?")) {
    let mensajes =
      JSON.parse(localStorage.getItem("mensajes_usuario")) || mensajesEjemplo;
    mensajes = mensajes.filter((m) => m.id !== id);
    localStorage.setItem("mensajes_usuario", JSON.stringify(mensajes));
    if (selectedMessageId === id) {
      selectedMessageId = null;
      document.getElementById("message-detail").innerHTML = `
        <div class="message-detail-empty">
          <h2>Selecciona un mensaje para continuar</h2>
          <p class="text-muted">El mensaje eliminado ya no está disponible.</p>
        </div>
      `;
    }
    renderMessages(mensajes, currentFilter, currentSearch);
  }
}

function filterMessages(filtro) {
  currentFilter = filtro;
  document.querySelectorAll('[id^="filter-"]').forEach((btn) => {
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-outline");
  });

  const activeButton = document.getElementById(`filter-${filtro}`);
  if (activeButton) {
    activeButton.classList.add("btn-primary");
    activeButton.classList.remove("btn-outline");
  }

  const mensajes =
    JSON.parse(localStorage.getItem("mensajes_usuario")) || mensajesEjemplo;
  renderMessages(mensajes, currentFilter, currentSearch);
}

function updateFilterCounts(mensajes) {
  const totalNoLeidos = mensajes.filter((m) => !m.leido).length;
  const totalArchivados = mensajes.filter((m) => m.archivado).length;

  document.getElementById("filter-todos").textContent =
    `Todos (${mensajes.length})`;
  document.getElementById("filter-noLeidos").textContent =
    `Sin Leer (${totalNoLeidos})`;
  document.getElementById("filter-archivados").textContent =
    `Archivados (${totalArchivados})`;
}

function loadRespuestas(messageId) {
  const mensajes =
    JSON.parse(localStorage.getItem("mensajes_usuario")) || mensajesEjemplo;
  const mensaje = mensajes.find((m) => m.id === messageId);

  if (mensaje && mensaje.respuestas && mensaje.respuestas.length > 0) {
    const history = document.getElementById("chat-history");
    const respuestaHtml = mensaje.respuestas
      .map(
        (respuesta) => `
      <div class="chat-bubble outgoing">
        <p>${respuesta.texto}</p>
        <small>${formatDate(respuesta.fecha)}</small>
      </div>
    `,
      )
      .join("");
    history.innerHTML += respuestaHtml;
  }
}

function sendReply(messageId) {
  const respuestaText = document.getElementById("respuesta-text").value.trim();
  if (!respuestaText) {
    alert("Por favor, escribe un mensaje antes de enviar.");
    return;
  }

  const mensajes =
    JSON.parse(localStorage.getItem("mensajes_usuario")) || mensajesEjemplo;
  const mensaje = mensajes.find((m) => m.id === messageId);

  if (mensaje) {
    if (!mensaje.respuestas) mensaje.respuestas = [];
    mensaje.respuestas.push({
      texto: respuestaText,
      fecha: new Date().toISOString().split("T")[0],
    });

    localStorage.setItem("mensajes_usuario", JSON.stringify(mensajes));
    renderMessageDetail(mensaje);
    document.getElementById("respuesta-text").value = "";
    renderMessages(mensajes, currentFilter, currentSearch);
    alert("Respuesta enviada correctamente.");
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Ayer";
  } else {
    return date.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
  }
}
