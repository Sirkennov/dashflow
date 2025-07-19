## 📄 Licencia

Este proyecto está bajo la [Licencia MIT](LICENSE).

# 🚀 Dashflow: Tu Panel de Control Administrativo

Un panel de control administrativo **moderno y responsivo** diseñado para gestionar usuarios, productos e inventario de manera eficiente. Dashflow te proporciona una visión clara de tus métricas clave y te ayuda a mantener el control de tus operaciones.

## ✨ Características Destacadas

* **Métricas Clave:** Visión rápida del total de usuarios, productos, valor del inventario y precio promedio.
* **Gestión de Stock:** Identifica fácilmente productos con bajo y alto stock para una gestión proactiva.
* **Últimos Registros:** Mantente al tanto de los usuarios y productos más recientes añadidos al sistema.
* **Interfaz Intuitiva:** Diseño limpio y moderno que facilita la navegación y el análisis de datos.
* **Diseño Responsivo:** Experiencia de usuario optimizada para cualquier dispositivo, desde móviles hasta escritorios.

## 🛠️ Tecnologías Utilizadas

Este proyecto fue construido utilizando un stack moderno y eficiente:

* **Frontend:**
    * [**React**](https://react.dev/) (`^19.1.0`)
    * [**React DOM**](https://react.dev/)
    * [**React Router DOM**](https://reactrouter.com/en/main)
    * [**React Icons**](https://react-icons.github.io/react-icons/)
* **Estilos:**
    * [**Tailwind CSS**](https://tailwindcss.com/)
* **Desarrollo y Build:**
    * [**Vite**](https://vitejs.dev/) (`^7.0.3`)
    * [**TypeScript**](https://www.typescriptlang.org/)
    * `@vitejs/plugin-react`
* **Backend / Base de Datos:**
    * [**Firebase**](https://firebase.google.com/) (`^11.10.0`)
* **Calidad de Código:**
    * [**ESLint**](https://eslint.org/)
    * `eslint-plugin-react-hooks`
    * `eslint-plugin-react-refresh`

## 🚀 Puesta en Marcha

Sigue estos pasos para tener Dashflow funcionando en tu máquina local:

### Prerequisitos

Asegúrate de tener instalado:

* [Node.js](https://nodejs.org/en/download/) (versión 18.x o superior recomendada)
* [npm](https://www.npmjs.com/) (viene con Node.js) o [Yarn](https://yarnpkg.com/lang/en/docs/install/)

### Instalación

1.  **Clona el repositorio:**

    ```bash
    git clone [https://github.com/Sirkennov/dashflow.git]
    ```

2.  **Navega al directorio del proyecto:**

    ```bash
    cd dashflow
    ```

3.  **Instala las dependencias:**

    ```bash
    npm install
    # O si prefieres Yarn:
    # yarn install
    ```

### 🔑 Configuración de Firebase

Este proyecto está diseñado para que cada usuario conecte su **propio proyecto de Firebase**. Sigue estos pasos para configurarlo:

1.  **Crea un nuevo proyecto en la Consola de Firebase:**
    * Ve a [https://console.firebase.google.com/](https://console.firebase.google.com/)
    * Haz clic en "Añadir proyecto" o "Crear un proyecto nuevo".
2.  **Añade una aplicación web a tu proyecto de Firebase:**
    * Dentro de tu nuevo proyecto de Firebase, haz clic en el icono `</>` (Web) para añadir una aplicación web.
    * Sigue los pasos y obtendrás un objeto de configuración (`firebaseConfig`). Copia todos los valores (apiKey, authDomain, projectId, etc.).
3.  **Habilita los servicios de Firebase necesarios:**
    * En tu proyecto de Firebase, ve a la sección "Build" (Crear).
    * **Authentication:** Habilita el método de inicio de sesión Correo electrónico/Contraseña.
    * **Firestore Database:** Aquí se creará la base de datos de Firestore que usarás en tu proyecto. Para que la aplicación pueda leer y escribir datos correctamente en tu base de datos de Firestore, **debes configurar las siguientes reglas de seguridad**. Ve a la sección "Firestore Database" en tu consola de Firebase, luego a la pestaña "Reglas" (Rules) y reemplaza el contenido con esto:

        ```firestore
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /users/{userId} {
              allow read, write: if request.auth != null;
            }

            match /products/{productId} {
              allow read, write: if request.auth != null;
            }

            match /{document=**} {
              allow read, write: if false;
            }
          }
        }
        ```
        Estas reglas permiten la lectura y escritura en las colecciones `users` y `products` solo si el usuario está autenticado. El acceso a cualquier otra colección está denegado por defecto.

4.  **Crea tu archivo de variables de entorno:**
    * En la **raíz de tu copia local del proyecto** (al mismo nivel que `package.json`), crea un nuevo archivo llamado `.env.local`.
    * **Copia el contenido del archivo `.env.example`** de este repositorio a tu nuevo archivo `.env.local`.
    * **Rellena las variables** con las credenciales que obtuviste de tu consola de Firebase en el paso 2:
        ```dotenv
        VITE_FIREBASE_API_KEY="TU_API_KEY_AQUI"
        VITE_FIREBASE_AUTH_DOMAIN="TU_AUTH_DOMAIN_AQUI"
        VITE_FIREBASE_PROJECT_ID="TU_PROJECT_ID_AQUI"
        VITE_FIREBASE_STORAGE_BUCKET="TU_STORAGE_BUCKET_AQUI"
        VITE_FIREBASE_MESSAGING_SENDER_ID="TU_MESSAGING_SENDER_ID_AQUI"
        VITE_FIREBASE_APP_ID="TU_APP_ID_AQUI"
        ```
5.  **Instala las dependencias y ejecuta el proyecto:**

### Ejecución en Modo Desarrollo

Para iniciar el servidor de desarrollo local:

```bash
npm run dev
# O si prefieres Yarn:
# yarn dev
```
