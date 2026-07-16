# Cambio de Requisitos — Día 7

## Cambio 1: Cantidades por plato
- **¿Cuántos archivos se modificaron?**
   Se modificaron exactamente 9 archivos (8 archivos de código `.ts` y la base de datos `db.sqlite`).
- **¿Se rompió algo? ¿Qué?**
  Sí. Al cambiar la relación de ManyToMany por la nueva entidad `PedidoItem`:
  1. Se rompió el payload esperado en `crear-pedido.dto.ts` (se borró `platoIds: number[]` y se reemplazó por `items: PedidoItemDto[]`).

- **¿El total se calcula correctamente con cantidades?**
  Sí. En `pedidos.service.ts` (línea 144), el código multiplica el precio del plato por la cantidad solicitada (`subtotal: Number(plato.precio) * item.cantidad`), y luego en la creación del pedido (línea 45) reduce esos subtotales sumándolos para calcular el total exacto.

## Cambio 2: Mesa auto-ocupada
- **¿Hubo dependencias circulares? ¿Cómo las resolvieron?**
  **No hubo dependencias circulares reales.** Analizando los módulos, ni `MesasModule` importa a `PedidosModule` ni a `TicketsModule`. La dependencia solo va en un sentido (Pedidos -> Mesas y Tickets -> Mesas). Sin embargo, en el código se resolvió utilizando `forwardRef(() => MesasService)` en `PedidosService` y `TicketsService`, y `forwardRef(() => MesasModule)` en `TicketsModule`. Aunque esto evitó cualquier error, su uso fue innecesario/preventivo ya que no existía un ciclo real.
- **¿Usaron diagnóstico cruzado? ¿Fue útil?**
  Sí se uso el diagnostico cruzado para entender como interactuaban los diferentes módulos y prever que al cambiar el estado de un ticket al final del ciclo de vida, había que propagar ese cambio hasta la mesa para liberarla.
- **¿El flujo completo funciona (crear pedido → mesa ocupada → pagar → mesa disponible)?**
  Sí. En el código actual, el método `crear` de `PedidosService` incluye `await this.mesasService.cambiarEstado(mesa.id, EstadoMesa.OCUPADA);` y el método `pagar` de `TicketsService` incluye `await this.mesasService.cambiarEstado(ticket.mesa.id, EstadoMesa.DISPONIBLE);`.

## La pregunta clave
**Si estos dos cambios hubieran estado en una spec desde el Día 1, ¿habrían sido más fáciles de implementar? ¿Qué habría dicho esa spec?**

Sí, mucho más fáciles. Implementarlo desde el Día 1 habría evitado el trabajo de crear una relación ManyToMany para luego tener que destruirla, crear `PedidoItem`, y refactorizar métodos (como los DTOs y `comandas.service.ts`) que ya estaban terminados. También habría evitado tocar múltiples servicios ya construidos para inyectar `MesasService`.

**La spec habría dicho:**
1. "Cada plato en un pedido debe registrar una **cantidad**. El total del pedido debe ser la suma del precio del plato multiplicado por su cantidad, implementando una entidad intermedia (ej. PedidoItem)."
2. "La creación de un pedido debe cambiar automáticamente el estado de la mesa a **OCUPADA**, y el pago de un ticket debe devolver la mesa al estado **DISPONIBLE**."