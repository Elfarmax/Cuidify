/**
 * Lógica del Asistente Inteligente Cuidify
 * Implementación para TFG - Frontend Vanilla JS
 */

const ChatCuidify = {
    isOpen: false,

    // Inicializar el chat e inyectar estilos/HTML
    init() {
        this.injectStyles();
        this.render();
    },

    injectStyles() {
        const styles = `
            /* El botón flotante (Launcher) con el azul exacto de tu botón 'Registrarse' */
            .chat-launcher { 
                position: fixed; bottom: 30px; right: 30px; 
                background: #6384f6; /* Azul claro corporativo */
                color: white; width: 60px; height: 60px; 
                border-radius: 50%; border: none; cursor: pointer; 
                box-shadow: 0 4px 15px rgba(99, 132, 246, 0.4); 
                font-size: 24px; z-index: 9999; transition: all 0.3s; 
            }
            .chat-launcher:hover { transform: scale(1.1); background: #4f71eb; }

            .chat-window { 
                position: fixed; bottom: 100px; right: 30px; 
                width: 350px; height: 480px; background: white; 
                border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); 
                display: none; flex-direction: column; overflow: hidden; 
                z-index: 9999; font-family: 'Inter', 'Segoe UI', sans-serif; 
                border: 1px solid #eef2ff;
            }

            /* Cabecera con degradado suave similar al estilo de la web */
            .chat-header { 
                background: linear-gradient(135deg, #6384f6 0%, #4f71eb 100%); 
                color: white; padding: 18px; font-weight: 600; 
                display: flex; justify-content: space-between; align-items: center; 
            }

            .chat-messages { 
                flex: 1; padding: 15px; overflow-y: auto; 
                background: #fcfdfe; display: flex; flex-direction: column; gap: 12px; 
            }

            .message { 
                max-width: 85%; padding: 10px 16px; border-radius: 18px; 
                font-size: 14px; line-height: 1.5; 
            }

            /* Mensaje del usuario con el azul claro de la web */
            .message.user { 
                align-self: flex-end; 
                background: #6384f6; 
                color: white; 
                border-bottom-right-radius: 4px; 
            }

            /* Mensaje del bot en un gris muy suave azulado */
            .message.bot { 
                align-self: flex-start; 
                background: #f1f5ff; 
                color: #2e3a59; 
                border: 1px solid #e0e7ff; 
                border-bottom-left-radius: 4px; 
            }

            .chat-footer { 
                padding: 15px; background: white; 
                border-top: 1px solid #f0f2f8; display: flex; gap: 8px; 
                align-items: center;
            }

            .chat-input { 
                flex: 1; border: 1.5px solid #e2e8f0; padding: 10px 15px; 
                border-radius: 25px; outline: none; font-size: 14px;
                transition: border-color 0.2s;
            }
            .chat-input:focus { border-color: #6384f6; }

            /* Botón de enviar */
            .chat-send { 
                background: #6384f6; color: white; border: none; 
                width: 38px; height: 38px; border-radius: 50%; 
                cursor: pointer; display: flex; align-items: center; 
                justify-content: center; transition: background 0.2s;
            }
            .chat-send:hover { background: #4f71eb; }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    },

    render() {
        const chatHTML = `
            <button class="chat-launcher" id="chatLauncher">💬</button>
            <div class="chat-window" id="chatWindow">
                <div class="chat-header">
                    <span>Asistente Cuidify</span>
                    <button onclick="ChatCuidify.toggle()" style="background:none; border:none; color:white; cursor:pointer; font-size:18px;">✕</button>
                </div>
                <div class="chat-messages" id="chatMessages">
                    <div class="message bot">¡Hola! Soy tu asistente de Cuidify. ¿En qué puedo ayudarte hoy con el cuidado de tus mayores?</div>
                </div>
                <div class="chat-footer">
                    <input type="text" class="chat-input" id="chatInput" placeholder="Escribe tu duda aquí...">
                    <button class="chat-send" id="chatSend">➤</button>
                </div>
                <div style="font-size: 9px; text-align: center; padding-bottom: 5px; color: #94a3b8;">
                    IA de apoyo. No sustituye consejo médico.
                </div>
            </div>
        `;
        const container = document.createElement('div');
        container.innerHTML = chatHTML;
        document.body.appendChild(container);

        // Eventos
        document.getElementById('chatLauncher').onclick = () => this.toggle();
        document.getElementById('chatSend').onclick = () => this.sendMessage();
        document.getElementById('chatInput').onkeypress = (e) => { if (e.key === 'Enter') this.sendMessage(); };
    },

    toggle() {
        this.isOpen = !this.isOpen;
        document.getElementById('chatWindow').style.display = this.isOpen ? 'flex' : 'none';
    },

    async sendMessage() {
        const input = document.getElementById('chatInput');
        const text = input.value.trim();
        if (!text) return;

        this.addMessage(text, 'user');
        input.value = '';

        try {
            const response = await fetch("http://localhost:3000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text })
            });
            const data = await response.json();
            this.addMessage(data.response || data.error, 'bot');
        } catch (error) {
            this.addMessage("Lo siento, no puedo conectar con el servidor.", 'bot');
        }
    },

    addMessage(text, side) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${side}`;
        msgDiv.innerText = text;
        const box = document.getElementById('chatMessages');
        box.appendChild(msgDiv);
        box.scrollTop = box.scrollHeight;
    }
};

// Arrancar el chat cuando cargue la página
window.onload = () => ChatCuidify.init();