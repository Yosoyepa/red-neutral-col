# 🗄️ Configuración de Base de Datos - Red Neutral COL

Esta guía detalla cómo configurar la base de datos PostgreSQL para el proyecto usando Prisma como ORM.

## 📋 Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Opción 1: Usar Supabase (Recomendado)](#opción-1-usar-supabase-recomendado)
- [Opción 2: PostgreSQL Local](#opción-2-postgresql-local)
- [Configuración de Prisma](#configuración-de-prisma)
- [Migraciones](#migraciones)
- [Troubleshooting](#troubleshooting)

## 🔧 Requisitos Previos

- Node.js 18+
- pnpm instalado (`npm install -g pnpm`)
- Cuenta en Supabase (gratis) o PostgreSQL local

## 🌐 Opción 1: Usar Supabase (Recomendado)

### Paso 1: Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto
4. Guarda la contraseña de la base de datos

### Paso 2: Obtener Connection String

1. En el dashboard de Supabase, ve a **Settings** → **Database**
2. Busca la sección **Connection string**
3. Copia el string de **URI** mode
4. Se verá algo así:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
   ```

### Paso 3: Configurar Variables de Entorno

1. Copia el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```

2. Edita `.env` y pega tu connection string:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres?schema=public"
   ```

## 💻 Opción 2: PostgreSQL Local

### Paso 1: Instalar PostgreSQL

#### Windows
- Descarga desde [postgresql.org](https://www.postgresql.org/download/windows/)
- Ejecuta el instalador
- Recuerda el puerto (por defecto 5432) y contraseña

#### macOS
```bash
brew install postgresql
brew services start postgresql
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Paso 2: Crear Base de Datos

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE red_neutral_col;

# Salir
\q
```

### Paso 3: Configurar Variables de Entorno

```env
DATABASE_URL="postgresql://postgres:tu-contraseña@localhost:5432/red_neutral_col?schema=public"
```

## 🔨 Configuración de Prisma

### Paso 1: Instalar Dependencias

```bash
# Si no lo has hecho aún
pnpm install
```

### Paso 2: Generar Cliente de Prisma

```bash
npx prisma generate
```

Esto genera el cliente de Prisma basado en tu schema.

### Paso 3: Aplicar Migraciones

```bash
# Aplicar todas las migraciones existentes
npx prisma migrate deploy

# O crear una nueva migración si has modificado el schema
npx prisma migrate dev --name descripcion_del_cambio
```

### Paso 4: Verificar la Conexión

```bash
# Abrir Prisma Studio para ver tu base de datos
npx prisma studio
```

Se abrirá en http://localhost:5555

## 📊 Schema de la Base de Datos

El schema actual de la base de datos está en `prisma/schema.prisma`:

```prisma
model TestResult {
  id                  String    @id @default(cuid())
  isp                 String
  city                String
  downloadSpeed       Float
  uploadSpeed         Float
  ping                Int
  jitter              Float
  throttlingRatio     Float?
  
  // Campos para pruebas de servicios específicos
  videoStreamingSpeed Float?
  socialMediaSpeed    Float?
  generalWebSpeed     Float?
  
  // Campos para compartir resultados
  shareId             String?   @unique
  isPublic            Boolean   @default(false)
  sharedAt            DateTime?
  
  testDate            DateTime  @default(now())
  createdAt           DateTime  @default(now())
}
```

## 🔄 Migraciones

### Crear Nueva Migración

Cuando modifiques el schema:

```bash
# 1. Edita prisma/schema.prisma
# 2. Crea la migración
npx prisma migrate dev --name nombre_descriptivo

# Ejemplo:
npx prisma migrate dev --name add_user_location
```

### Ver Historial de Migraciones

```bash
npx prisma migrate status
```

### Resetear Base de Datos (⚠️ Cuidado en Producción)

```bash
# Esto borrará todos los datos
npx prisma migrate reset
```

## 🐛 Troubleshooting

### Error: "Can't reach database server"

**Solución:**
1. Verifica que PostgreSQL esté corriendo
2. Verifica el connection string en `.env`
3. Verifica firewall/puertos

### Error: "Environment variable not found: DATABASE_URL"

**Solución:**
1. Asegúrate de tener el archivo `.env`
2. Verifica que `DATABASE_URL` esté definida
3. Reinicia el servidor de desarrollo

### Error: "The table does not exist"

**Solución:**
```bash
# Aplicar migraciones pendientes
npx prisma migrate deploy

# O resetear y migrar de nuevo
npx prisma migrate reset
```

### Error en Supabase: "Too many connections"

**Solución:**
1. En Supabase, ve a Settings → Database
2. Aumenta el pool size o espera a que se liberen conexiones
3. Considera usar connection pooling

## 📝 Comandos Útiles

```bash
# Ver el estado de las migraciones
npx prisma migrate status

# Generar el cliente después de cambios en schema
npx prisma generate

# Abrir GUI para explorar datos
npx prisma studio

# Formatear el schema
npx prisma format

# Validar el schema
npx prisma validate

# Ver el SQL que generará una migración
npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script
```

## 🔐 Seguridad

### Mejores Prácticas

1. **Nunca commits el archivo `.env`**
2. **Usa diferentes bases de datos** para desarrollo y producción
3. **Habilita SSL** en producción:
   ```env
   DATABASE_URL="postgresql://...?sslmode=require"
   ```
4. **Limita permisos** del usuario de base de datos
5. **Realiza backups regulares** en producción

### Backup en Supabase

1. Ve a Settings → Backups
2. Los backups se realizan automáticamente
3. Puedes descargar backups manualmente

## 🚀 Deployment

### Para Vercel

1. En Vercel, añade la variable de entorno:
   - Name: `DATABASE_URL`
   - Value: Tu connection string de producción

2. Vercel ejecutará automáticamente:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

### Verificar en Producción

```bash
# Ver logs de migración en Vercel
vercel logs

# O usar Prisma Studio con la DB de producción
DATABASE_URL="tu-url-de-produccion" npx prisma studio
```

## 📚 Recursos Adicionales

- [Documentación de Prisma](https://www.prisma.io/docs)
- [Guía de Supabase](https://supabase.com/docs/guides/database)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)

## ❓ ¿Necesitas Ayuda?

Si tienes problemas con la configuración de la base de datos:

1. Revisa los logs de error completos
2. Busca en la [documentación de Prisma](https://www.prisma.io/docs)
3. Abre un issue en el repositorio
4. Contacta a: andradeunigarrojuancarlos@gmail.com
