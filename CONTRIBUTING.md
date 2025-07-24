# 🤝 Guía de Contribución - Red Neutral COL

¡Gracias por tu interés en contribuir a Red Neutral COL! Este documento proporciona las pautas para contribuir al proyecto.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo Contribuir?](#cómo-contribuir)
- [Configuración del Entorno](#configuración-del-entorno)
- [Flujo de Trabajo](#flujo-de-trabajo)
- [Estándares de Código](#estándares-de-código)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Mejoras](#sugerir-mejoras)

## 📜 Código de Conducta

- Se respetuoso con otros contribuidores
- Acepta críticas constructivas
- Enfócate en lo que es mejor para la comunidad
- Muestra empatía hacia otros miembros

## 🚀 ¿Cómo Contribuir?

### 1. Fork del Repositorio

```bash
# Clona tu fork
git clone https://github.com/tu-usuario/red-neutral-col.git
cd red-neutral-col

# Añade el repositorio original como upstream
git remote add upstream https://github.com/juanandrade/red-neutral-col.git
```

### 2. Crea una Rama

```bash
# Actualiza tu main
git checkout main
git pull upstream main

# Crea una nueva rama
git checkout -b feature/nombre-descriptivo
```

### 3. Realiza tus Cambios

- Escribe código limpio y documentado
- Añade tests si es aplicable
- Actualiza la documentación si es necesario

### 4. Commit y Push

```bash
# Añade tus cambios
git add .

# Commit con mensaje descriptivo
git commit -m "feat: añadir nueva funcionalidad X"

# Push a tu fork
git push origin feature/nombre-descriptivo
```

### 5. Crea un Pull Request

- Ve a GitHub y crea un PR desde tu fork
- Describe claramente los cambios
- Referencia cualquier issue relacionado

## 🛠️ Configuración del Entorno

### Prerrequisitos

- Node.js 18+
- pnpm 8+
- PostgreSQL o cuenta en Supabase

### Instalación

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Configurar base de datos
npx prisma migrate dev
npx prisma generate

# Iniciar desarrollo
pnpm dev
```

## 📐 Flujo de Trabajo

### Branches

- `main` - Rama principal, siempre estable
- `develop` - Rama de desarrollo
- `feature/*` - Nuevas características
- `fix/*` - Corrección de bugs
- `docs/*` - Actualizaciones de documentación

### Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva característica
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato
- `refactor:` Refactorización de código
- `test:` Añadir o modificar tests
- `chore:` Tareas de mantenimiento

Ejemplos:
```bash
git commit -m "feat: añadir compartir en WhatsApp"
git commit -m "fix: corregir cálculo de throttling ratio"
git commit -m "docs: actualizar guía de instalación"
```

## 💻 Estándares de Código

### TypeScript

```typescript
// ✅ Bueno
interface SpeedTestResult {
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
  jitter: number;
}

// ❌ Evitar
interface Result {
  d: number;
  u: number;
  p: number;
  j: number;
}
```

### React

```tsx
// ✅ Bueno - Componente bien tipado
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function Button({ onClick, children, variant = 'primary' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
}

// ❌ Evitar - Sin tipos
export function Button(props) {
  return <button onClick={props.onClick}>{props.children}</button>;
}
```

### Estructura de Archivos

```
src/
├── app/              # Páginas (App Router)
├── components/       # Componentes reutilizables
│   ├── ui/          # Componentes de UI básicos
│   └── features/    # Componentes específicos
├── lib/             # Utilidades y helpers
├── hooks/           # Custom React hooks
└── types/           # TypeScript types/interfaces
```

## 🐛 Reportar Bugs

### Antes de Reportar

1. Verifica que el bug no haya sido reportado
2. Asegúrate de estar usando la última versión
3. Confirma que es un bug y no un error de configuración

### Cómo Reportar

Crea un issue con:

- **Título claro**: Describe el problema brevemente
- **Descripción**: Explica el bug en detalle
- **Pasos para reproducir**: Lista numerada
- **Comportamiento esperado**: Qué debería pasar
- **Comportamiento actual**: Qué está pasando
- **Screenshots**: Si aplica
- **Entorno**: Sistema operativo, navegador, versión

## 💡 Sugerir Mejoras

### Proceso

1. Verifica que la mejora no haya sido sugerida
2. Crea un issue con la etiqueta `enhancement`
3. Incluye:
   - Descripción clara de la mejora
   - Justificación (por qué es necesaria)
   - Posible implementación (opcional)
   - Alternativas consideradas

### Ejemplo de Propuesta

```markdown
## Propuesta: Añadir modo oscuro

### Descripción
Implementar un toggle para cambiar entre modo claro y oscuro.

### Justificación
- Mejor experiencia de usuario en ambientes con poca luz
- Reduce fatiga visual
- Es una característica esperada en apps modernas

### Implementación Sugerida
- Usar Tailwind CSS dark mode
- Guardar preferencia en localStorage
- Respetar preferencia del sistema operativo
```

## 🧪 Testing

### Ejecutar Tests

```bash
# Tests unitarios
pnpm test

# Tests e2e
pnpm test:e2e

# Coverage
pnpm test:coverage
```

### Escribir Tests

```typescript
// Ejemplo de test
describe('SpeedTest', () => {
  it('should calculate throttling ratio correctly', () => {
    const result = calculateThrottlingRatio(50, 48);
    expect(result).toBe(0.96);
  });
});
```

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Docs](https://react.dev)

## ❓ ¿Preguntas?

Si tienes preguntas, puedes:

1. Abrir un issue con la etiqueta `question`
2. Contactar al mantenedor: andradeunigarrojuancarlos@gmail.com

---

¡Gracias por contribuir a hacer el internet más transparente en Colombia! 🇨🇴
