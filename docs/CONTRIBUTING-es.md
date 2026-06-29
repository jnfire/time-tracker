# Contribuir a Time Tracker

Antes de nada, ¡gracias por tomarte el tiempo de contribuir! 🎉

A continuación se detallan un conjunto de pautas para contribuir a este proyecto.

## ¿Cómo puedo contribuir?

### Informar de errores (Bugs)
Si encuentras un error, por favor crea una *issue* proporcionando tanto detalle como sea posible:
- Pasos para reproducir el error.
- Comportamiento esperado.
- Comportamiento real.
- Capturas de pantalla o volcados de datos de ejemplo (¡asegúrate de que no contengan datos personales o sensibles!).

### Sugerir Mejoras
¡Las sugerencias de mejoras son bienvenidas! Por favor, crea una *issue* describiendo tu idea, por qué sería útil y cómo debería funcionar en consonancia con la filosofía serverless y Sober UI.

### Pull Requests
1. Haz un *Fork* del repositorio y crea tu rama a partir de `main`.
2. Realiza tus cambios en tu rama.
3. Si has añadido código de lógica, añade pruebas en el directorio `src/__tests__/`.
4. Asegúrate de que las pruebas pasan correctamente (`npm run test`).
5. Asegúrate de que tu código sigue el estilo y la arquitectura existente (lógica de negocio 100% agnóstica en `/core`, componentes de vista desacoplados).
6. ¡Envía tu *Pull Request*!

## Configuración del Entorno de Desarrollo Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/jaiver/time-tracker.git
   cd time-tracker
   ```

2. **Instalar dependencias:**
   Este proyecto usa `npm` como gestor de paquetes.
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Ejecutar las pruebas:**
   Usamos Vitest para las pruebas unitarias de nuestra capa lógica `core/`.
   ```bash
   npm run test
   ```

## Visión General de la Arquitectura
Por favor, lee [`docs/ARCHITECTURE-es.md`](./ARCHITECTURE-es.md) para entender cómo está estructurado el código antes de realizar cambios significativos.
