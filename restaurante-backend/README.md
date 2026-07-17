# Restaurante Backend (PRE-SAID · Sala 11)

¡Bienvenido al código fuente del servidor (Backend) de nuestro sistema de gestión de restaurantes! 

Este proyecto proporciona toda la "inteligencia" y el manejo de datos (API REST) necesario para que la aplicación funcione. Aquí se guardan los menús, las mesas, se calculan las cuentas y se gestionan las comandas para la cocina.

---

## 📖 Introducción (Para personas no técnicas)

Imagina este Backend como el **"Cerebro y Archivero"** del restaurante. 
Cuando un mesero usa la aplicación (Frontend) para tomar un pedido, la aplicación le manda un mensaje a este Backend. Nuestro Backend revisa si la mesa existe, si los platos están disponibles, calcula el total de la cuenta, se lo anota al cocinero y finalmente guarda todo en una libreta segura (Base de Datos).

### 🧩 Módulos Principales del Sistema

El restaurante está dividido en 5 áreas clave:

1. **🍔 Platos:** El menú del restaurante. Permite crear, modificar precios y ocultar platos que se hayan agotado.
2. **🪑 Mesas:** Representa el espacio físico. Las mesas pueden estar `DISPONIBLES`, `OCUPADAS` o `RESERVADAS`.
3. **📝 Pedidos:** Lo que el cliente quiere comer. Cada pedido se vincula a una mesa e incluye múltiples platos con sus cantidades.
4. **👨‍🍳 Comandas:** Es el "ticket de cocina". Ayuda a los cocineros a saber qué preparar y cambiar el estado cuando la comida está lista.
5. **🧾 Tickets (Cuentas):** El proceso de facturación. Suma todos los pedidos de una mesa, genera la cuenta total y registra el método de pago (Efectivo/Tarjeta).

---

## 💻 Tecnologías (Para Desarrolladores)

Este proyecto está construido con herramientas modernas, robustas y de uso empresarial:

- **[NestJS 11](https://nestjs.com/):** Framework de Node.js estructurado y modular (similar a Angular, pero para servidores).
- **[TypeORM](https://typeorm.io/):** Herramienta que traduce nuestro código TypeScript a consultas de base de datos (SQL) automáticamente.
- **SQLite (`better-sqlite3`):** Base de datos ultra-ligera basada en un solo archivo.
- **TypeScript:** JavaScript con esteroides (tipado fuerte) para evitar errores.
- **Swagger:** Sistema que auto-genera documentación interactiva de la API.

---

## 🚀 Puesta en marcha (Cómo ejecutar el proyecto)

### Requisitos previos
- Tener instalado **Node.js** (versión 20 o superior).

### Pasos para iniciar

1. **Clonar e ingresar a la carpeta:**
   Asegúrate de estar dentro de la carpeta `restaurante-backend` en tu terminal.
   
2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Arrancar el servidor en modo desarrollo:**
   ```bash
   npm run start:dev
   ```

¡Listo! El servidor estará escuchando en **`http://localhost:3000`**.

---

## 🗄️ Base de Datos Local (`db.sqlite`)

Para facilitar el desarrollo, no necesitas instalar programas complicados como MySQL o PostgreSQL. 
El sistema usa **SQLite**. Al arrancar el servidor por primera vez, TypeORM creará automáticamente un archivo llamado **`db.sqlite`** en esta carpeta. 

- **¿Se rompió algo o quieres empezar de cero?** Simplemente apaga el servidor, borra el archivo `db.sqlite` y vuelve a ejecutar `npm run start:dev`. ¡El sistema creará una base de datos nueva y vacía al instante!
- *(Nota: Este archivo está ignorado en `.gitignore` para no subir datos falsos al repositorio)*.

---

## 📚 Documentación Interactiva (Swagger)

No necesitas adivinar qué rutas existen ni cómo enviar los datos. NestJS genera una documentación visual e interactiva automáticamente.

Con el servidor encendido, abre tu navegador y entra a:
👉 **[http://localhost:3000/api](http://localhost:3000/api)**

Desde ahí podrás ver todos los "Endpoints" (rutas) de Platos, Mesas, Pedidos, Comandas y Tickets. ¡Incluso puedes hacer peticiones de prueba directamente desde esa pantalla dando clic en *"Try it out"*!

---

## 🏗️ Estructura del Código

Si quieres explorar el código, esta es la anatomía básica que usamos en cada módulo (ej. `platos`):

- **`platos.controller.ts`**: (El Recepcionista). Recibe la petición web (GET, POST), lee lo que pide el usuario y se lo pasa al Service.
- **`platos.service.ts`**: (El Cerebro). Contiene la "Lógica de Negocio". Hace los cálculos matemáticos, validaciones y decide si la acción es permitida.
- **`entities/plato.entity.ts`**: (El Molde). Define qué columnas tendrá la tabla en la base de datos.
- **`dto/...`**: (Los Filtros de Seguridad). Data Transfer Objects. Definen qué datos son obligatorios y qué tipo de datos son (ej. "el precio debe ser un número positivo").

---

## 🛠️ Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run start:dev` | Arranca el servidor. Se actualiza solo cada vez que guardas un cambio en el código. |
| `npm run build` | Transforma todo el TypeScript a JavaScript puro en la carpeta `/dist`. |
| `npm run test` | Ejecuta las pruebas automatizadas (Unit Testing). |
| `npm run lint` | Revisa el código buscando errores de estilo o sintaxis. |
