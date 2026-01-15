# Quercus Digital Menu

Una carta digital elegante y optimizada para tabletas, diseñada para el restaurante Quercus. Incluye gestión de inventario en tiempo real, soporte multi-idioma (ES/EN/FR) y un Sommelier AI impulsado por Google Gemini.

## 🚀 Cómo ponerlo en marcha (Despliegue)

### Opción 1: Vercel (Recomendada)
1. Sube estos archivos a un repositorio de GitHub.
2. Ve a [Vercel.com](https://vercel.com) e inicia sesión con GitHub.
3. Importa el repositorio.
4. **IMPORTANTE:** En la sección "Environment Variables" (Variables de Entorno), añade:
   - Nombre: `API_KEY`
   - Valor: `TU_CLAVE_DE_GOOGLE_GEMINI` (Consíguela en https://aistudio.google.com/)
5. Dale a "Deploy".

### Opción 2: Localmente
1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Crea un archivo `.env` en la raíz y añade:
   ```
   API_KEY=tu_clave_aqui
   ```
3. Arranca el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 📱 Uso en Tabletas
1. Abre la web desplegada en Safari (iPad) o Chrome (Android).
2. Pulsa el botón "Compartir" -> "Añadir a la pantalla de inicio".
3. La app se abrirá en pantalla completa como una aplicación nativa.

## ✏️ Modo Editor
- **PIN por defecto:** `1234`
- Permite:
  - Cambiar precios y textos.
  - Ocultar platos (stock agotado).
  - Añadir nuevos elementos.
  - Generar códigos QR.
  - Cambiar el logotipo.
