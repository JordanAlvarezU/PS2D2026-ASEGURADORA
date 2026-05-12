# PS2D2026-ASEGURADORA

Este es el repositorio oficial para la plataforma de **Euro American Assistance**. A continuación, encontrarás una guía paso a paso sobre cómo clonar (descargar) el proyecto, configurarlo en tu computadora para trabajar y cómo subir tus cambios.

---

## 🚀 1. Cómo bajar el proyecto y configurarlo por primera vez

Sigue estos pasos **solo la primera vez** que vayas a trabajar en el proyecto desde tu computadora.

### Paso 1: Clonar el repositorio
Abre tu terminal (o la consola de Visual Studio Code) y ejecuta este comando para descargar el código a tu máquina:
```bash
git clone https://github.com/JordanAlvarezU/PS2D2026-ASEGURADORA.git
```
Luego, entra a la carpeta del proyecto:
```bash
cd PS2D2026-ASEGURADORA
```

### Paso 2: Instalar las dependencias
Este proyecto usa **Node.js**. Para instalar todas las librerías necesarias (como React, Next.js, Firebase, etc.), ejecuta:
```bash
npm install
```

### Paso 3: Configurar las Variables de Entorno
Para que la aplicación se conecte correctamente a la base de datos de Firebase, necesitas un archivo especial.
1. Busca en la raíz del proyecto un archivo llamado `.env.example`.
2. Haz una copia de ese archivo y renómbrala a `.env.local`.
3. Pide a un administrador (o revisa el chat del equipo) los valores correctos de cada variable y pégalos en el archivo `.env.local`.

> [!WARNING]  
> **NUNCA** subas el archivo `.env.local` a GitHub. Ya está ignorado por defecto en el `.gitignore`, así que no te preocupes, pero no lo modifiques para forzar su subida.

### Paso 4: Correr el proyecto
Una vez instaladas las dependencias y con el `.env.local` listo, levanta el servidor de desarrollo:
```bash
npm run dev
```
Abre **http://localhost:3000** en tu navegador para ver la página funcionando.

---

## 🛠️ 2. Cómo trabajar y subir tus cambios a GitHub

Cada vez que vayas a hacer una mejora, sigue esta rutina para evitar conflictos y sobreescribir el trabajo de tus compañeros.

### Paso 1: Actualizar tu código ANTES de empezar a trabajar
Siempre que te sientes a trabajar, baja los últimos cambios que tus compañeros hayan subido:
```bash
git pull origin main
```

### Paso 2: Guarda tus cambios (Commit)
Una vez que hayas modificado el código y comprobado que funciona bien (usando `npm run dev`), prepara tus archivos para subirlos:

```bash
# 1. Agrega todos los archivos modificados
git add .

# 2. Crea un "paquete" con un mensaje descriptivo de lo que hiciste
git commit -m "Agregué la sección de promociones en el inicio"
```

### Paso 3: Sube tus cambios a GitHub (Push)
Sube tu paquete al repositorio para que todos lo puedan ver:
```bash
git push origin main
```
> [!TIP]  
> Si al hacer `git push` te da error, probablemente alguien más subió código mientras tú trabajabas. Para solucionarlo, haz `git pull origin main`, resuelve cualquier conflicto si te lo pide el editor, y luego vuelve a intentar el `git push`.

---

## 📂 Estructura Principal del Proyecto
- **`/src/app`**: Aquí están todas las pantallas/rutas (Página principal, Cotizador, Panel de Admin).
- **`/src/components`**: Componentes reutilizables (Botones, Navbar, Footer, Secciones).
- **`/src/lib/firebase.ts`**: Configuración de la base de datos.
- **`/src/lib/useAppData.ts`**: El "Hook" o función que descarga los productos y destinos de la base de datos automáticamente.
