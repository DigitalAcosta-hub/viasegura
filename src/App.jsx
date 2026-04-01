import { useState } from "react"

const RESPUESTAS = {
  "extintor vencido": "Según el Art. 126 de la Ley 769/2002, el extintor vencido puede ser causal de inmovilización. Sin embargo, exige que te citen a comparendo primero. Pide la placa del agente y que diligencie todo en el sistema SIMIT.",
  "luz quemada": "Una luz quemada es infracción menor. Puedes solicitar una orden de corrección en lugar de comparendo. Si te lo imponen, guarda la factura de reparación para impugnarlo.",
  "documentos": "Según el Art. 30 debes llevar: licencia de conducción vigente, tarjeta de propiedad, SOAT vigente y revisión técnicomecánica (RTM). Para motos también el casco reglamentario.",
  "comparendo": "Un comparendo es válido solo si: el agente se identifica con su placa, te informa la norma infringida, lo registra en el SIMIT y te entrega copia. Sin alguno de estos pasos, puedes impugnarlo.",
  "retener vehiculo": "Tu vehículo solo puede ser inmovilizado si no portas documentos, tienes comparendos en firme, o hay infracción grave. Sin causa legal puedes denunciar ante la Superintendencia de Transporte.",
}

function buscarRespuesta(pregunta) {
  const p = pregunta.toLowerCase()
  for (const clave in RESPUESTAS) {
    if (p.includes(clave)) return RESPUESTAS[clave]
  }
  return null
}

export default function App() {
  const [pantalla, setPantalla] = useState("inicio")
  const [mensajes, setMensajes] = useState([
    { de: "bot", texto: "Hola 👋 Soy tu asistente de normas de tránsito en Colombia. ¿Qué quieres saber hoy?" }
  ])
  const [input, setInput] = useState("")
  const [cargando, setCargando] = useState(false)

  async function enviarMensaje() {
    if (!input.trim()) return
    const pregunta = input.trim()
    setInput("")
    setMensajes(prev => [...prev, { de: "usuario", texto: pregunta }])
    setCargando(true)

    const respuestaLocal = buscarRespuesta(pregunta)
    if (respuestaLocal) {
      setTimeout(() => {
        setMensajes(prev => [...prev, { de: "bot", texto: respuestaLocal }])
        setCargando(false)
      }, 800)
      return
    }

    try {
      const res = await fetch("http://http://http://http://http://https://viasegura-production.up.railway.app/api/chat/api/chat/api/chat/api/chat/api/chat/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: pregunta }]
        })
      })
      const data = await res.json()
      const texto = data.content?.map(i => i.text || "").join("") || "No pude responder en este momento."
      setMensajes(prev => [...prev, { de: "bot", texto }])
    } catch {
      setMensajes(prev => [...prev, { de: "bot", texto: "Hubo un error. Verifica tu conexión e intenta de nuevo." }])
    }
    setCargando(false)
  }

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", fontFamily: "sans-serif", height: "100vh", display: "flex", flexDirection: "column" }}>
      
      <div style={{ background: "#1B4F8A", color: "white", padding: "16px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 24 }}>🛡️</span>
        <div>
          <div style={{ fontWeight: "bold", fontSize: 16 }}>ViaSegura Colombia</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>Tu guía de normas de tránsito</div>
        </div>
      </div>

      <div style={{ display: "flex", borderBottom: "1px solid #ddd", background: "white" }}>
        {["inicio", "chat", "derechos", "normas"].map(tab => (
          <button key={tab} onClick={() => setPantalla(tab)} style={{
            flex: 1, padding: "10px 4px", fontSize: 12, border: "none", background: "none", cursor: "pointer",
            borderBottom: pantalla === tab ? "2px solid #1B4F8A" : "2px solid transparent",
            color: pantalla === tab ? "#1B4F8A" : "#666", fontWeight: pantalla === tab ? "bold" : "normal",
            textTransform: "capitalize"
          }}>{tab === "chat" ? "Asistente" : tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
        ))}
      </div>

      {pantalla === "inicio" && (
        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ background: "#1B4F8A", color: "white", padding: 16, fontSize: 13, lineHeight: 1.6 }}>
            <strong style={{ fontSize: 15 }}>Conoce tus derechos como conductor 🇨🇴</strong><br />
            Consulta normas, habla con el asistente y nunca te dejes intimidar.
          </div>
          <div style={{ background: "#E6F1FB", border: "1px solid #B5D4F4", margin: 14, borderRadius: 8, padding: 12, fontSize: 12, color: "#0C447C", lineHeight: 1.5 }}>
            ℹ️ Los agentes deben identificarse con su placa y explicar la infracción antes de imponer cualquier comparendo.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "0 14px" }}>
            {[
              { icon: "🤖", titulo: "Asistente IA", sub: "Pregunta lo que quieras", tab: "chat" },
              { icon: "⚖️", titulo: "Mis derechos", sub: "Frente a un agente", tab: "derechos" },
              { icon: "📋", titulo: "Normas", sub: "Código de tránsito", tab: "normas" },
              { icon: "💰", titulo: "Multas", sub: "Consultar valores", tab: "inicio" },
            ].map(c => (
              <div key={c.titulo} onClick={() => setPantalla(c.tab)} style={{ background: "#f5f5f5", border: "1px solid #ddd", borderRadius: 8, padding: 12, cursor: "pointer" }}>
                <div style={{ fontSize: 22 }}>{c.icon}</div>
                <div style={{ fontSize: 12, fontWeight: "bold", marginTop: 6 }}>{c.titulo}</div>
                <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{c.sub}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pantalla === "chat" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {mensajes.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.de === "usuario" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "80%", padding: "9px 12px", borderRadius: 14, fontSize: 13, lineHeight: 1.5,
                  background: m.de === "usuario" ? "#1B4F8A" : "#f0f0f0",
                  color: m.de === "usuario" ? "white" : "#333",
                  borderBottomRightRadius: m.de === "usuario" ? 4 : 14,
                  borderBottomLeftRadius: m.de === "bot" ? 4 : 14,
                }}>{m.texto}</div>
              </div>
            ))}
            {cargando && (
              <div style={{ display: "flex", gap: 4, padding: 8 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, background: "#999", borderRadius: "50%", animation: "bounce 1s infinite", animationDelay: `${i*0.2}s` }} />)}
              </div>
            )}
          </div>
          <div style={{ padding: 10, borderTop: "1px solid #ddd", display: "flex", gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && enviarMensaje()}
              placeholder="Escribe tu pregunta..." style={{ flex: 1, padding: "8px 12px", borderRadius: 20, border: "1px solid #ddd", fontSize: 13 }} />
            <button onClick={enviarMensaje} style={{ background: "#1B4F8A", color: "white", border: "none", borderRadius: "50%", width: 36, height: 36, fontSize: 16, cursor: "pointer" }}>➤</button>
          </div>
        </div>
      )}

      {pantalla === "derechos" && (
        <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { titulo: "Exigir identificación del agente", desc: "Tienes derecho a pedir la placa y nombre del agente antes de cualquier procedimiento." },
            { titulo: "Conocer el motivo de la detención", desc: "El agente debe informarte qué norma infringiste y cuál artículo del código aplica." },
            { titulo: "No puedes ser retenido sin causa", desc: "Si no hay infracción clara, tienes derecho a continuar. La detención arbitraria es ilegal." },
            { titulo: "Recibir copia del comparendo", desc: "Debes recibir copia inmediatamente. Sin copia, el comparendo puede ser impugnado." },
            { titulo: "Apelar cualquier sanción", desc: "Puedes impugnar el comparendo ante el organismo de tránsito en los términos legales." },
          ].map(d => (
            <div key={d.titulo} style={{ background: "white", border: "1px solid #ddd", borderLeft: "3px solid #1B4F8A", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 13, fontWeight: "bold", marginBottom: 4 }}>{d.titulo}</div>
              <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>{d.desc}</div>
            </div>
          ))}
        </div>
      )}

      {pantalla === "normas" && (
        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ padding: "12px 12px 8px" }}>
            <input placeholder="Buscar norma o artículo..." style={{ width: "100%", padding: "8px 12px", borderRadius: 20, border: "1px solid #ddd", fontSize: 13 }} />
          </div>
          {[
            { titulo: "Velocidad máxima en zona urbana", sub: "Art. 106 - Ley 769/2002", tipo: "Todos" },
            { titulo: "Uso obligatorio de casco", sub: "Art. 94 - Conductor y parrillero", tipo: "Motos" },
            { titulo: "Cinturón de seguridad", sub: "Art. 82 - Todos los ocupantes", tipo: "Carros" },
            { titulo: "Revisión técnicomecánica", sub: "Art. 50 - Según año del vehículo", tipo: "Todos" },
            { titulo: "Documentos obligatorios", sub: "Art. 30 - Licencia, SOAT, RTM", tipo: "Todos" },
            { titulo: "Límite de peso por eje", sub: "Art. 179 - Vehículos de carga", tipo: "Camiones" },
          ].map(n => (
            <div key={n.titulo} style={{ padding: "10px 14px", borderBottom: "1px solid #eee" }}>
              <div style={{ fontSize: 13, fontWeight: "bold" }}>{n.titulo}</div>
              <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{n.sub}</div>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, marginTop: 4, display: "inline-block",
                background: n.tipo === "Motos" ? "#E1F5EE" : n.tipo === "Carros" ? "#E6F1FB" : n.tipo === "Camiones" ? "#FAEEDA" : "#F1EFE8",
                color: n.tipo === "Motos" ? "#0F6E56" : n.tipo === "Carros" ? "#185FA5" : n.tipo === "Camiones" ? "#854F0B" : "#5F5E5A",
              }}>{n.tipo}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}