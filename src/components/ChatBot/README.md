# ChatBot de Neutralidad de Red

## Descripción
Este componente implementa un asistente virtual especializado en temas de neutralidad de la red en Colombia. Utiliza la API de Google Gemini para proporcionar respuestas inteligentes y contextualizadas.

## Características
- 🤖 Asistente especializado en neutralidad de red
- 💬 Interfaz de chat flotante y responsiva
- 🧠 Integración con Google Gemini AI
- 📱 Diseño adaptativo para móviles
- 🎨 Animaciones fluidas y UX amigable

## Configuración

### 1. Obtener API Key de Gemini
1. Visita [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API key
3. Copia la API key generada

### 2. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto:

```env
GEMINI_API_KEY=tu_api_key_aqui
```

## Estructura de componentes

- `ChatButton.tsx` - Botón flotante para abrir el chat
- `ChatWindow.tsx` - Ventana principal del chat
- `index.tsx` - Componente contenedor
- `/api/chat/route.ts` - API route para manejar las peticiones a Gemini

## Uso
El componente se integra automáticamente en todas las páginas a través del layout principal.

## Prompts especializados
El asistente está entrenado para responder sobre:
- Conceptos de neutralidad de red
- Regulación colombiana (Resolución CRC 5050 de 2016)
- Derechos de los usuarios
- Interpretación de resultados de pruebas
- Cómo reportar violaciones ante la CRC

## Personalización
Puedes modificar el prompt del sistema en `/api/chat/route.ts` para ajustar el comportamiento del asistente.
