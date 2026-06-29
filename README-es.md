# Time Tracker ⏱️

*Read this in [English](README.md).*

Una herramienta web rápida, privada y sin servidor para el seguimiento del tiempo de trabajo diseñada para desarrolladores y usuarios técnicos. Permite medir el tiempo global de tu jornada diaria y asignar bloques de tiempo a tareas específicas.

Todo el procesamiento se realiza localmente en tu navegador web, lo que garantiza una **privacidad total** de tus datos. Construida con **Vue 3 (Composition API)**, **TypeScript**, y un núcleo de lógica de negocio agnóstico al framework.

## ✨ Características Principales
- **Totalizador de Jornada:** El temporizador grande en pantalla muestra el tiempo acumulado de todo el día seleccionado.
- **Modelo Relacional Local:** Las tareas tienen su propia entidad en `localStorage` para evitar duplicación. Puedes asociar la misma tarea a varios días y recuperarla fácilmente.
- **Click-to-Track:** Pulsa directamente sobre cualquier tarea del listado del día para seleccionarla como activa e iniciar o conmutar el cronómetro de inmediato.
- **Tiempos Ajustables:** Añade o resta tiempo fácilmente (ej. +15m, -30m) en cualquier tarea a través del modal de "Editar". Los ajustes se guardan como eventos de corrección transparentes en la línea temporal.
- **Recuperación de Tarea Reciente:** Carga por defecto la última tarea activa en la que se trabajó cada día, permitiendo reanudar el trabajo al instante.
- **Seguridad en Pestaña:** Pausa automáticamente el reloj activo si la pestaña o ventana del navegador se cierra o recarga por accidente, previniendo la corrupción de los registros.
- **Privacidad Total:** Todo ocurre 100% en el cliente. Tus datos nunca salen de tu navegador.

## 🛠️ Tecnologías Utilizadas
- **Vue.js 3** (Composition API) + **Vite**
- **TypeScript** para un código robusto y tipado.
- **Vue-i18n** para soporte bilingüe (ES/EN).
- **Vanilla CSS** siguiendo los tokens de diseño **Sober UI** (soporte claro/oscuro nativo).

## 📁 Estructura del Proyecto
El proyecto separa estrictamente la lógica de negocio de la capa de vista para facilitar la legibilidad y futura migración a librerías comunes. Puedes ver los detalles en [docs/ARCHITECTURE-es.md](docs/ARCHITECTURE-es.md).

## 🚀 Cómo ejecutarlo localmente
Consulta nuestra guía detallada en [docs/CONTRIBUTING-es.md](docs/CONTRIBUTING-es.md).

## 🗺️ Roadmap del Proyecto
Próximas características planificadas para desarrollo:
- [ ] **Sincronización en la Nube:** Sincronizar tus datos con una base de datos segura (característica de backoffice monetizable).
- [ ] **Panel de Analíticas Avanzadas:** Gráficos detallados de productividad, distribución de tareas y métricas de tiempo (característica de backoffice monetizable).
- [ ] **Exportaciones CSV y Estándares:** Adaptar los formatos de exportación para ser compatibles con otros sistemas consolidados de recolección de horas.
- [ ] **Límites de Edición a Pasado:** Configurar limitaciones de fecha para evitar la modificación de registros más allá de cierto límite.
- [ ] **Borrado Automático de Historial:** Eliminación automática programable de registros locales para liberar espacio en el navegador.

## 📄 Licencia
Este proyecto está licenciado bajo la **GNU General Public License v3.0 (GPL-3.0)**. Consulta el archivo `LICENSE` para más detalles.
