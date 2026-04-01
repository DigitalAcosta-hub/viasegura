import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())

app.post("/api/chat", async (req, res) => {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: "Eres un asistente experto en normas de tránsito de Colombia (Ley 769 de 2002). Responde claro, breve y en español. Máximo 3 frases. Cita artículos cuando sea relevante.",
        messages: req.body.messages
      })
    })
    const data = await response.json()
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: "Error del servidor" })
  }
})

app.listen(3001, () => {
  console.log("Servidor corriendo en puerto 3001")
})
