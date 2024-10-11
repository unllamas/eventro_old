# Eventro 🎟️

Eventro es una plataforma para la búsqueda y gestión de eventos.

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

## Funcionamiento 

### Tipos de eventos en Nostr

Eventro utiliza tipos de eventos específicos de Nostr para gestionar la creación de eventos y la emisión de tickets:

- **Evento Principal (`kind: 10600`)**: Nota reemplazable que representa la creación y modificación de un evento. Los eventos pueden ser actualizados para asegurar que los asistentes tengan la información más reciente.
- **Ticket (`kind: 30601`)**: Nota regular que gestiona la propiedad y la transferencia de tickets. Esto garantiza que los tickets puedan ser revendidos o transferidos entre usuarios mientras se mantiene la información actualizada.
- **Check-in (`kind: 20602`)**: Nota efímera que maneja la validación de tickets al ingresar a un evento. Una vez que un ticket se utiliza para el check-in, se marca como consumido y no puede volver a usarse.

### Evento 

```js
{
  "kind": 10600,
  "pubkey": "<npub-owner>",
  "content": "<content from event on string>",
  "tags": [
    // Metadata
    ["d", "<UUID>"],
    ["a", "<kind>:<npub-owner>:<UUID>"]
    ["title", "<title of event>"],
    ["image", "<image url>", "256x256"],

    // Dates
    ["start", "<unix timestamp in seconds>"],
    ["end", "<unix timestamp in seconds>"],

    // Location
    ["location", `<location description>`],
    ["g", "<geohash>"],

    // Publishers
    ["p", "<npub-owner>", "owner"],
    ["p", "<npub-mod>", "mod"],

    // Tags
    ["t", "<tag name>"],
    ["t", "<tag name>"],

    // Tickets
    ["ticket", "<title>", "<description>", "<amount>", "sat/<token>", "<quantity>"],
    ["ticket", "<title>", "<description>", "<amount>", "sat/<token>", "<quantity>"],

    // Relays
    ["relays", "<relay-url>", ...]
  ]
}
```

### Ticket

```js
{
  "kind": 30601,
  "pubkey": "<npub-user>",
  "content": "Tickets purchased.",
  "tags": [
      // Metadata
      ["a", "<kind>:<npub-user>:<d tag value>"]
      ["e", "<32-bytes lowercase hex of the id of principal event>"],

      // Payment
      ["bolt11", "<invoice>"],

      // Tickets
      ["ticket", "<title>", "<quantity>"],
      ["ticket", "<title>", "<quantity>"],

      // Relays
      ["relays", "<relay-url>", ...]

      // Status
      ["status", "purchased/transferred"],
  ]
}
```

### Check-in

```js
{
  "kind": 20602,
  "pubkey": "<npub-mod/owner>",
  "content": "Check-in.",
  "tags": [
      // Metadata
      ["a", "<kind>:<npub-mod/owner>:<d tag value>"]
      ["e", "<32-bytes lowercase hex of the id of ticket event>"],

      // User
      ["p", "<npub-user>"],

      // Ticket
      ["check-in", "<title>", "<quantity>"],
      ["check-in", "<title>", "<quantity>"],

      // Relays
      ["relays", "<relay-url>", ...]
  ]
}
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