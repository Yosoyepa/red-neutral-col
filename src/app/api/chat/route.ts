import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextRequest, NextResponse } from "next/server"

// Inicializar Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// Prompt del sistema especializado en neutralidad de red
const SYSTEM_PROMPT = `Eres un asistente experto en neutralidad de la red en Colombia. Tu objetivo es educar y ayudar a los usuarios a entender:

1. Qué es la neutralidad de la red y por qué es importante
2. Los derechos de los usuarios de internet en Colombia según la regulación vigente
3. Cómo interpretar los resultados de las pruebas de velocidad y restricciones
4. Las prácticas permitidas y prohibidas para los ISPs en Colombia
5. Cómo reportar violaciones a la neutralidad de red ante la CRC (Comisión de Regulación de Comunicaciones)

Contexto importante sobre Colombia:
- La Resolución CRC 5050 de 2016 establece las reglas de neutralidad de red
- Los ISPs no pueden bloquear, interferir, discriminar ni restringir el acceso a contenidos legales
- Los usuarios tienen derecho a acceder a cualquier contenido, aplicación o servicio legal
- Las prácticas de zero-rating están reguladas y deben cumplir ciertos criterios

Responde de manera clara, amigable y educativa. Si el usuario comparte resultados de pruebas, ayúdale a interpretarlos y sugiere acciones si detectas posibles violaciones.`

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "API key no configurada" },
        { status: 500 }
      )
    }

    // Crear el modelo
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" })

    // Construir el contexto de la conversación
    const conversationHistory = history.map((msg: any) => {
      return `${msg.role === "user" ? "Usuario" : "Asistente"}: ${msg.content}`
    }).join("\n\n")

    // Crear el prompt completo
    const fullPrompt = `${SYSTEM_PROMPT}

Historial de conversación:
${conversationHistory}

Usuario: ${message}

Asistente:`

    // Generar respuesta
    const result = await model.generateContent(fullPrompt)
    const response = result.response
    const text = response.text()

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error en la API de chat:", error)
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    )
  }
}
