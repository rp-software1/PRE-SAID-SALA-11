sala: I-SALA-11
curso: PRE-SAID — Desarrollo Moderno con IA y CLI
dia: 4
estado: en_progreso
loom: (agregar link al terminar)

---

## Bloques

- [x] A — Comandas + Tickets (cerrar backend)
- [x] B — Frontend Next.js: páginas del restaurante visibles en navegador
- [ ] C — Flujo completo end-to-end + Loom + PR

## Verificación final

- [ ] 5 módulos backend funcionando (Platos, Mesas, Pedidos, Comandas, Tickets)
- [ ] Frontend Next.js mostrando datos del backend en el navegador
- [ ] Flujo completo: crear mesa → crear platos → crear pedido → ver en frontend
- [ ] CHANGES.md actualizado
- [ ] feedback*dia4*[tunombre].md completado y commiteado
- [ ] PR creado y enviado a sala par

hecklist de code review

### Fase 4 — Code Review del Frotnted

| ID     | Qué revisar                                                                | Hallazgo                          | Estado |
| :----- | :------------------------------------------------------------------------- | :-------------------------------- | :----: |
| **R1** | ¿Las páginas hacen fetch a http://localhost:3000 (backend real)?           | si lo hace                        |  [✔]   |
| **R2** | ¿Si el backend no responde, muestra mensaje de error (no pantalla blanca)? | Si, no muestra pantalla blanca\_  |  [✔]   |
| **R3** | ¿La navegación funciona entre todas las páginas?                           | Si funciona                       |  [✔ ]  |
| **R4** | ¿El formulario de crear plato realmente crea un plato en el backend?       | si crea un plato en el backend    |  [✔]   |
| **R5** | ¿El cambio de estado de mesa se refleja sin refrescar la página?           | si da si se refleja sin recargar  |  [✔]   |
| **R6** | ¿La IA creó componentes reutilizables o repitió código?                    | no creo componentes reutilizables |  [-]   |
| **R7** | ¿Los estilos Tailwind se ven coherentes entre páginas?                     | si se ven coherentes              |  [✔]   |

"Actualiza CHANGES.md: agrega los módulos Comandas y Tickets del backend, y todas las páginas del frontend con sus componentes."

---
