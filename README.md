# Sistema de Gestión de Ausencias (Asuntos Personales) - IES Albarregas 🏛️

Este proyecto es una solución Full-Stack desarrollada para digitalizar y optimizar el flujo de trabajo de las solicitudes de ausencia del personal docente del **IES Albarregas**. El sistema garantiza la soberanía y protección de los datos mediante su almacenamiento íntegro en el Centro de Procesamiento de Datos (CPD) del centro.

El proyecto ha sido auditado y refactorizado bajo los estándares de calidad de **SonarQube**, asegurando un código limpio, accesible y sin deudas técnicas ni vulnerabilidades críticas.

---

## Requisitos Previos

Para desplegar y ejecutar esta aplicación en local, asegúrese de tener instalado:
* **Java Development Kit (JDK)**: Versión 23.
* **Node.js**: Versión 18 o superior (con npm).
* **PostgreSQL**: Servidor de Base de Datos activo.

---

## Paso 1: Configuración de la Base de Datos (PostgreSQL)

Gracias a la configuración de Hibernate (`ddl-auto=update`), **no es necesario ejecutar scripts SQL manualmente**. Las tablas se generarán automáticamente al arrancar el servidor.

1. Abra su cliente de PostgreSQL (pgAdmin, DBeaver o terminal).
2. Cree una base de datos vacía llamada **`albarregas_db`**:
   `CREATE DATABASE albarregas_db;`
3. Diríjase al proyecto Backend e introduzca sus credenciales locales en el archivo de propiedades:
   * **Ruta:** `src/main/resources/application.properties`
   * **Modificar:**
     `spring.datasource.username=TU_USUARIO_POSTGRES`
     `spring.datasource.password=TU_CONTRASEÑA_POSTGRES`

---

## Paso 2: Despliegue del Backend

El servidor backend escucha peticiones en el puerto `8080`.

1. Abra la carpeta raíz del backend en su IDE (Visual Studio Code, IntelliJ, etc.).
2. Deje que Maven descargue las dependencias automáticas (como *Lombok* o el driver parcheado y seguro de *PostgreSQL 42.7.11*).
3. Ejecute la aplicación mediante su IDE o desde la terminal con el comando:
   `./mvnw spring-boot:run`
4. **Verificación:** Al arrancar por primera vez, el sistema creará automáticamente la carpeta física `uploads/` en la raíz del proyecto para almacenar los justificantes binarios.

---

## Paso 3: Despliegue del Frontend

El cliente frontend corre de forma nativa en el puerto `5173`.

1. Abra una terminal en la carpeta del frontend (`gestion-ausencias`).
2. Instale los paquetes necesarios (incluyendo `prop-types` y `react-calendar`):
   `npm install`
3. Inicie el servidor de desarrollo en local:
   `npm run dev`
4. Abra su navegador en la dirección: [http://localhost:5173](http://localhost:5173)

---

## Credenciales de Prueba (Entorno de Demostración)

La pantalla de acceso cuenta con un filtro estricto de **Consentimiento de Tratamiento de Datos (CPD)** y validación del dominio corporativo del instituto. Al ser un MVP, la contraseña acepta cualquier carácter.

* **Perfil Docente (Solicitante):**
  * **Email:** `pepe.gomez@iesalbarregas.es` *(O cualquier correo válido acabado en `@iesalbarregas.es`)*
  * **Contraseña:** *(Cualquiera)*
* **Perfil Equipo Directivo (Jefatura/Administrador):**
  * **Email:** `directivo@iesalbarregas.es` o `jefatura@iesalbarregas.es`
  * **Contraseña:** *(Cualquiera)*