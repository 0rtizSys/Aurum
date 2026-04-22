# Documentación Técnica Frontend - Aurum Dashboard

Esta es la documentación técnica oficial del **Aurum Dashboard**, orientada a desarrolladores frontend, arquitectos y encargados de integración backend.

El dashboard de Aurum está construido bajo una arquitectura reactiva, fuertemente tipada y centralizada en los datos (*Data-Driven*). Sigue una estética de diseño *Stealth Minimalist*.

---

## 1. Arquitectura del Proyecto

El entorno del frontend de Aurum (`src/dashboard/frontend/src/`) mantiene una jerarquía de responsabilidades estricta.

### Jerarquía de Carpetas

*   **`types/`**: Contiene `dashboard.ts`. Define los contratos estrictos del dominio. El sistema de tipos aquí rige la forma de la UI y los *payloads* del backend.
*   **`data/`**: Contiene `commandCatalog.ts`. Funciona como el *Single Source of Truth* (SSOT).
*   **`hooks/`**: Contiene `useCommandManager.ts`. Aísla el estado del cliente y la lógica de negocio lejos de los componentes visuales.
*   **`components/ui/`**: Primitivas visuales agnósticas al dominio (ej. `Button`, `Input`, `Badge`). No conocen nada de "comandos" ni "economía".
*   **`components/dashboard/`**: Componentes específicos de dominio (ej. `CommandEditor`, `PreviewPanel`). Componen las primitivas de la UI e interactúan con la estructura de `CommandDefinition`.
*   **`pages/`**: Vistas de nivel superior (`Dashboard` y `Maintenance`) que dictan la disposición de los componentes y manejan la inyección inicial de estado.

### ¿Por qué separar `ui/` de `dashboard/`?
Esta división asegura que las piezas fundamentales (`ui/`) sean estúpidas y altamente reutilizables. Si el día de mañana Aurum necesita una vista fuera del contexto de "comandos" (ej. configuración de perfil), los componentes de `ui/` pueden usarse tal cual sin arrastrar dependencias complejas del `commandCatalog`.

### Sistema de Tipos Estrictos
En `types/dashboard.ts`, interfaces como `CommandDefinition` dictan qué opciones tiene cada comando. Esto asegura que si el catálogo exige que una opción se llame "visibility" y sea booleana, el formulario automáticamente renderizará un toggle y el compilador de TypeScript atrapará cualquier intento de pasar un string en su lugar.

---

## 2. Flujo de Datos (Data Flow)

El recorrido de la información desde el usuario hasta la preparación del *payload* sigue este flujo unidireccional:

1.  **Interacción (UI)**: El usuario edita un valor en el componente `FieldControl` (dentro de `CommandEditor.tsx`).
2.  **Captura (Action)**: El componente llama a la prop `onChange`, que a su vez ejecuta `onFieldChange(field.id, value)`.
3.  **Estado (Hook)**: La función `updateField` de `useCommandManager.ts` recibe el cambio y actualiza el diccionario `drafts` para el comando activo, borrando los errores previos de ese campo en `errorsByCommand`.
4.  **Validación**: Cuando el usuario hace clic en "Prepare payload", se ejecuta `prepareDraft()`. El hook invoca `validateDraft(command, activeDraft)`, comprobando reglas de tipos, min, max, y required.
5.  **Output (Contrato Visual)**: Si no hay errores, se genera el estado `preparedByCommand`, que incluye un string formateado por `buildPayloadPreview`. El resultado es inyectado en `PreviewPanel` para su lectura o copiado.

---

## 3. Contrato de API (Puntos de Integración)

Actualmente, el frontend **no hace el fetch final** (Punto de Integración futuro). Solo prepara el *payload* y hace validaciones en cliente. Cuando llegue el momento de enlazar la red, la función `prepareDraft` (o un nuevo método en `useCommandManager`) enviará exactamente las peticiones descritas abajo.

### GET `/api/status` (Implementado en `App.tsx`)
Petición obligatoria en la inicialización para determinar el enrutamiento.
**Respuesta Esperada:**
```json
{
  "inMaintenance": false
}
```

### POST `/api/commands/execute`
Utilizado para disparar slash commands desde el panel.

**Ejemplo 1: Ejecutar `/add_balance`**
```javascript
// FETCH SUGERIDO
fetch("/api/commands/execute", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    commandId: "add_balance",
    slash: "/add_balance",
    transport: {
      method: "POST",
      route: "/api/commands/execute"
    },
    context: {
      requiresGuild: true,
      audience: "admin",
      module: "economy-moderation"
    },
    options: {
      method: "wallet",
      amount: 1000,
      user: "@member",
      visibility: false
    }
  })
});
```

### PATCH `/api/settings/economy/symbol`
Utilizado para configuraciones de servidor que actualizan recursos existentes.

**Ejemplo 2: Actualizar `/set_economy_symbol`**
```javascript
// FETCH SUGERIDO
fetch("/api/settings/economy/symbol", {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    commandId: "set_economy_symbol",
    slash: "/set_economy_symbol",
    transport: {
      method: "PATCH",
      route: "/api/settings/economy/symbol"
    },
    context: {
      requiresGuild: true,
      audience: "admin",
      module: "economy-admin"
    },
    options: {
      symbol: "AU"
    }
  })
});
```

---

## 4. Tutorial: Añadiendo un Comando

Gracias a la arquitectura orientada a datos, añadir un comando **no requiere tocar ningún componente React**.

### Paso a paso

1.  Abre `src/data/commandCatalog.ts`.
2.  Agrega un nuevo objeto al array `commandCatalog` cumpliendo la interfaz `CommandDefinition`.

**Ejemplo: Comando de Transferencia de Fondos**
```typescript
{
  id: "transfer",
  slash: "/transfer",
  title: "Transfer Funds",
  description: "Transfiere dinero entre usuarios.",
  module: "economy-public",
  audience: "public",
  availability: "pending-backend",
  method: "POST",
  route: "/api/commands/execute",
  requiresGuild: true,
  tags: ["economy", "transfer"],
  notes: ["Los fondos salen del bank del autor."],
  responsePreviewTitle: "Transferencia Exitosa",
  responsePreview: "Transferiste $500 a @amigo",
  options: [
    {
      id: "target",
      label: "Recipient",
      description: "A quién envías el dinero.",
      type: "user",
      defaultValue: "",
      required: true,
    },
    {
      id: "amount",
      label: "Amount to Send",
      description: "Cantidad exacta de la transferencia.",
      type: "number",
      defaultValue: 100,
      required: true,
      min: 1, // Validación automática en cliente
      max: 100000,
    }
  ]
}
```

### Validaciones Disponibles en `CommandFieldDefinition`
*   `required?: boolean` (Requerido u opcional).
*   **Números (`type: "number"`)**: `min` (Valor mínimo numérico), `max` (Valor máximo numérico).
*   **Textos (`type: "text" | "user"`)**: `minLength` (Largo mínimo de cadena), `maxLength` (Largo máximo de cadena).

---

## 5. Guía de Estilos: Stealth Minimalist

La identidad visual está construida con Tailwind CSS v4 para lograr un diseño "sobrio", sin colores excesivos. Todo vive bajo un tema oscuro.

*   **Fondos**: 
    *   Fondos base y contenedores profundos: `bg-slate-950`.
    *   Tarjetas, editores, paneles elevados: `bg-slate-900`.
*   **Bordes**:
    *   Todos los contenedores tienen contornos finos: `border border-slate-800`.
*   **Tipografía**:
    *   Textos principales / Títulos: `text-white` o `text-slate-200`.
    *   Descripciones / Notas: `text-slate-400`.
    *   Etiquetas diminutas (Eyebrows): `text-[11px] uppercase tracking-[0.28em] font-medium text-slate-500`.
*   **Radios de Borde (Rounded)**:
    *   Radios muy amplios para dar un aspecto suave de "hardware": `rounded-[24px]`, `rounded-[28px]`, `rounded-[32px]`.
*   **Estados de Tono**:
    *   *Active*: Destacado sutil.
    *   *Muted*: Opaco, inactivo.
    *   *Default*: Neutro.

---

## 6. Solución de Problemas (Common Pitfalls)

### El Endpoint de Status falla con "Failed to fetch" o "CORS error"
*   **Causa**: La API de Express (`/api/status`) y el servidor Vite (`localhost:5173`) corren en puertos distintos y el navegador bloquea la petición.
*   **Solución (Backend)**: Instalar y habilitar `cors` en la API de Express o usar el proxy de Vite (`vite.config.ts`) para redirigir peticiones que empiecen con `/api/` hacia el puerto de Node.

### El formulario rechaza un valor Numérico
*   **Causa**: Fallo en la conversión de String a Number en `CommandEditor.tsx` al pasar un input vacío o con letras.
*   **Solución (Hook)**: `useCommandManager` ya gestiona un chequeo `Number.isNaN(numericValue)`. Asegúrate de que el input de tipo "number" use validaciones HTML nativas `type="number"` y permita envíos nulos o cadenas vacías `""` si el campo no es requerido.

### Error de compilación en `commandCatalog.ts`
*   **Causa**: Usar un `method` inválido (ej. "PUT") o un `module` inexistente.
*   **Solución**: Los tipos son estrictos. Verifica en `types/dashboard.ts` que "PUT" esté añadido al alias de tipo union para `method` (`"GET" | "POST" | "PATCH"`). Si requieres un nuevo módulo, agrégalo a `CommandModule` y regístralo en `commandModules`.
