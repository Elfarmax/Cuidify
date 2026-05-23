require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// =========================================
// CONEXIÓN A POSTGRESQL
// =========================================
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "casacuidadoDB",
  password: process.env.DB_PASSWORD || "HR",
  port: process.env.DB_PORT || 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error adquiriendo cliente DB", err.stack);
  }
  console.log("Conexión a PostgreSQL establecida con éxito");
  release();
});

// =========================================
// REGISTRO
// =========================================
app.post("/register", async (req, res) => {
  const {
    nombre,
    apellidos,
    dni,
    email,
    password_hash,
    telefono,
    rol,
    bio,
    precio_hora,
    habilidades,
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const userQuery = `
      INSERT INTO usuarios (
        nombre,
        apellidos,
        dni,
        email,
        password_hash,
        telefono,
        rol,
        bio,
        precio_hora
      )
      VALUES (
        $1,
        $2,
        pgp_sym_encrypt($3, 'clave_secreta_tfg'),
        $4,
        crypt($5, gen_salt('bf')),
        pgp_sym_encrypt($6, 'clave_secreta_tfg'),
        $7,
        $8,
        $9
      )
      RETURNING id, nombre, apellidos, rol, bio, precio_hora
    `;

    const values = [
      nombre,
      apellidos,
      dni || "",
      email,
      password_hash,
      telefono || "",
      rol,
      bio,
      precio_hora || 0,
    ];

    console.log("Intentando registrar usuario:", email);

    const userRes = await client.query(userQuery, values);
    const newUser = userRes.rows[0];

    if (habilidades && Array.isArray(habilidades)) {
      for (let skill of habilidades) {
        await client.query(
          "INSERT INTO atributos_usuario (usuario_id, tipo, valor) VALUES ($1, $2, $3)",
          [newUser.id, "habilidad", skill]
        );
      }
    }

    await client.query("COMMIT");

    res.status(200).json({
      message: "Usuario registrado correctamente",
      user: newUser,
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error en registro:", err.message);

    res.status(500).json({
      error: "Error interno en la base de datos",
      detail: err.message,
    });
  } finally {
    client.release();
  }
});

// =========================================
// LOGIN (CORREGIDO)
// =========================================
app.post("/login", async (req, res) => {
  const { email, password_hash } = req.body;

  try {
    const query = `
      SELECT 
        id,
        nombre,
        apellidos,
        rol,
        bio,
        precio_hora,
        email,
        pgp_sym_decrypt(telefono, 'clave_secreta_tfg') AS telefono,
        pgp_sym_decrypt(dni, 'clave_secreta_tfg') AS dni
      FROM usuarios
      WHERE email = $1
      AND password_hash = crypt($2, password_hash)
    `;

    const result = await pool.query(query, [email, password_hash]);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(401).json({ error: "Email o contraseña incorrectos" });
    }

  } catch (err) {
    console.error("Error en login:", err.message);
    res.status(500).json({ error: "Error en el servidor durante el login" });
  }
});

// =========================================
// VALORACIONES
// =========================================
app.get("/valoraciones/todas", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM valoraciones 
      ORDER BY created_at DESC 
      LIMIT 10
    `);

    res.status(200).json(result.rows);

  } catch (err) {
    res.status(500).json({ error: "Error al obtener valoraciones" });
  }
});

app.get("/valoraciones/:cuidador_id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM valoraciones WHERE cuidador_id = $1 ORDER BY created_at DESC`,
      [req.params.cuidador_id]
    );

    res.status(200).json(result.rows);

  } catch (err) {
    res.status(500).json({ error: "Error al obtener valoraciones" });
  }
});

app.post("/valoraciones", async (req, res) => {
  const { cuidador_id, autor_nombre, puntuacion, comentario } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO valoraciones (cuidador_id, autor_nombre, puntuacion, comentario)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [cuidador_id || null, autor_nombre, parseInt(puntuacion), comentario]
    );

    res.status(200).json({
      message: "Valoración guardada",
      valoracion: result.rows[0],
    });

  } catch (err) {
    res.status(500).json({
      error: "Error al guardar la valoración",
      detail: err.message,
    });
  }
});

// =========================================
// IA CHAT (GROQ)
// =========================================
function anonimizar(texto) {
  if (!texto) return "";
  return texto
    .replace(/\b\d{9}\b/g, "[teléfono]")
    .replace(/\S+@\S+\.\S+/g, "[email]");
}

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!message) {
      return res.status(400).json({ error: "No message" });
    }

    if (!apiKey) {
      return res.status(500).json({ error: "Falta GROQ_API_KEY" });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "Eres asistente de Cuidify, breve y empático.",
          },
          {
            role: "user",
            content: anonimizar(message),
          },
        ],
        temperature: 0.6,
        max_tokens: 300,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: data.error?.message || "Error en IA",
      });
    }

    res.json({
      response: data.choices?.[0]?.message?.content || "",
    });

  } catch (error) {
    res.status(500).json({
      error: "Error en chat IA",
    });
  }
});

// =========================================
// START SERVER
// =========================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("-----------------------------------------");
  console.log("Servidor CasaCuidadoPro corriendo en:");
  console.log(`http://localhost:${PORT}`);
  console.log("-----------------------------------------");
});