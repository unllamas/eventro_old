# Eventro 🎟️

Eventro es una plataforma para la búsqueda y gestión de eventos.

## Cómo Funciona ⚙️

Eventro facilita la creación y publicación de eventos directamente en la red Nostr. Cada evento se representa como un mensaje Nostr que contiene todos los detalles relevantes.

### Estructura de un Eventro en Nostr 📄

Cada evento se define usando el [NIP-23 Long-form Content](https://github.com/nostr-protocol/nips/blob/master/23.md) y contiene una serie de campos organizados en tags y contenido:

```js
{
  "kind": 30023,
  "pubkey": "<npub1>",
  "content": "<content from event on string>",
  "tags": [
    // Metadata
    ["d", "<unique-event-identifier-123>"],
    ["title", "<title of event>"],
    ["image", "<image url>", "256x256"],

    // Dates
    ["start", "<unix timestamp in seconds>"],
    ["end", "<unix timestamp in seconds>"],

    // Location
    ["location", `<location description>`],
    ["g", "<geohash>"],

    // Publishers
    ["p", "<npub1>", "owner"],
    ["p", "<npub2>", "mod"],

    // Tags
    ["t", "<tag name>"],

    // Tickets
    ["ticket", "<title>", "<description>", "<amount>", "<token>", "<quantity>"],

    // Relays
    ["relays", "<relay-url>", ...]
  ]
}
```

## Guía de Instalación 🛠️

### Requisitos Previos

- Node.js (v18 o superior)

### Pasos de Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/unllamas/eventro.git
   cd eventro
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia la aplicación:
   ```bash
   npm run dev
   ```

## Contribuir 🤝

¡Nos encantaría contar con tu ayuda para mejorar Eventro! Sigue estos pasos para contribuir:

1. Realiza un fork del repositorio.
2. Crea una rama con tus cambios:
   ```bash
   git checkout -b feature/mi-nueva-funcionalidad
   ```
3. Realiza tus cambios y commitea:
   ```bash
   git commit -am 'Añade una nueva funcionalidad'
   ```
4. Sube tus cambios a tu fork:
   ```bash
   git push origin feature/mi-nueva-funcionalidad
   ```
5. Crea un Pull Request detallando tus mejoras.

## Licencia 📄

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

¿Tienes preguntas o sugerencias? ¡Únete a nuestra comunidad en [Discord](https://discord.gg/QESv76truh)!

Construido con ❤️ por la comunidad [Nostr Argentina](https://github.com/nostr-arg).