# CHANGES — restaurante-backend

Registro de cambios relevantes del proyecto PRE-SAID · Sala 11.

---

## Día 4 — Módulo Comandas

### Resumen

Se agregó el módulo **Comandas** completo. Se estableció una relación `ManyToOne` con **Pedido**. Las comandas manejan estados (recibida, en_preparacion, lista) y validan el ID del pedido durante la creación. También se configuraron las relaciones anidadas para devolver el pedido y sus platos correspondientes en las peticiones GET, resolviendo las dependencias inyectando directamente los repositorios con `TypeOrmModule.forFeature([Comanda, Pedido])` para mantener el principio de aislamiento sin alterar `PedidosModule`.

### Archivos creados

```
src/comandas/
├── entities/
│   ├── estado-comanda.enum.ts       # Enum: recibida, en_preparacion, lista
│   └── comanda.entity.ts            # Entidad Comanda con ManyToOne a Pedido
├── dto/
│   ├── create-comanda.dto.ts        # DTO para POST /comandas
│   └── update-estado-comanda.dto.ts # DTO para PATCH /comandas/:id/estado
├── comandas.controller.ts           # Endpoints POST, GET y PATCH de estado
├── comandas.service.ts              # Lógica de negocio y validaciones
└── comandas.module.ts               # Módulo de comandas
```

### Archivos modificados

* `src/app.module.ts`: Se importó y registró `ComandasModule` y la entidad `Comanda`.


## Día 3 — Módulo Pedidos

### Resumen

Se agregó el módulo **Pedidos** con CRUD completo, relaciones TypeORM con **Mesa** y **Plato**, validación de IDs antes de crear/actualizar, cálculo automático del total y carga de relaciones en las respuestas GET.

### Archivos creados

```
src/pedidos/
├── entities/
│   ├── estado-pedido.enum.ts    # Enum: pendiente, en_preparacion, listo, entregado
│   └── pedido.entity.ts         # Entidad Pedido + relaciones
├── dto/
│   ├── crear-pedido.dto.ts      # mesaId (number), platoIds (number[])
│   ├── actualizar-pedido.dto.ts # mesaId y platoIds opcionales
│   └── cambiar-estado-pedido.dto.ts
├── pedidos.service.ts
├── pedidos.controller.ts
└── pedidos.module.ts
```

### Archivo modificado

- `src/app.module.ts` — Registro de la entidad `Pedido` en TypeORM e import de `PedidosModule`.

### Relaciones configuradas

| Relación | Lado propietario | Detalle |
|----------|------------------|---------|
| **ManyToOne** → Mesa | `Pedido` | `@JoinColumn({ name: 'mesaId' })` — FK en tabla `pedidos` |
| **ManyToMany** → Plato | `Pedido` | `@JoinTable({ name: 'pedido_platos' })` — tabla intermedia `pedido_platos` |

**No se modificaron** `plato.entity.ts` ni `mesa.entity.ts`. Las relaciones inversas (`@OneToMany`, `@ManyToMany` en Mesa/Plato) no son necesarias: TypeORM gestiona el esquema y la carga de relaciones desde el lado propietario en `Pedido`.

### Entidad `Pedido`

| Campo | Tipo | Notas |
|-------|------|--------|
| `id` | number | Autogenerado |
| `mesa` | Mesa | Relación ManyToOne |
| `platos` | Plato[] | Relación ManyToMany |
| `estado` | enum | Default `pendiente` |
| `total` | decimal | Calculado al crear/actualizar platos |
| `createdAt` / `updatedAt` | Date | Automáticos |

### API — `/pedidos`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/pedidos` | Crear pedido |
| `GET` | `/pedidos` | Listar (con `mesa` y `platos` cargados) |
| `GET` | `/pedidos/:id` | Detalle (con relaciones) |
| `PATCH` | `/pedidos/:id` | Actualizar `mesaId` y/o `platoIds` |
| `PATCH` | `/pedidos/:id/estado` | Cambiar estado del pedido |
| `DELETE` | `/pedidos/:id` | Eliminar → **204** |

### Decisiones de diseño

1. **Validación con 400, no 500** — Si `mesaId` o algún `platoId` no existe, el servicio lanza `BadRequestException` (HTTP 400). Pedido no encontrado → `NotFoundException` (404).

2. **Cálculo del total** — Suma de `precio` de cada plato. Si `platoIds` incluye duplicados (ej. `[1, 2, 2]`), cada ocurrencia cuenta para el total y para la relación ManyToMany (cantidades).

3. **Relaciones en GET** — `encontrarTodos()` y `encontrarUno()` usan `relations: { mesa: true, platos: true }` para devolver objetos anidados, no solo IDs.

4. **Repositorios locales** — `PedidosModule` importa `MesasModule` y `PlatosModule` (requisito del ejercicio) y registra `TypeOrmModule.forFeature([Pedido, Mesa, Plato])` para validar existencia con repositorios propios y controlar el código de error (400 vs 404 de los servicios de Mesa/Plato).

5. **Estado inicial** — Al crear, el pedido queda en `pendiente`. El cambio de estado va por `PATCH /pedidos/:id/estado`.

6. **Sin tests** — No se agregaron tests automatizados en este cambio.

7. **Sin cambios en entidades existentes** — `Plato` y `Mesa` permanecen intactas; no se añadió lado inverso.

### Dependencias

**No se instalaron paquetes nuevos.** El módulo reutiliza dependencias ya presentes en `package.json`:

| Paquete | Uso en Pedidos |
|---------|----------------|
| `@nestjs/common` | Controller, Service, excepciones HTTP |
| `@nestjs/typeorm` | `TypeOrmModule`, `@InjectRepository` |
| `typeorm` | Entidad, relaciones, repositorios |
| `class-validator` | Validación de DTOs |
| `class-transformer` | `@Type()` en DTOs numéricos |

### Tablas nuevas (SQLite)

Al arrancar con `synchronize: true`, TypeORM crea:

- `pedidos` — con columna `mesaId`
- `pedido_platos` — tabla intermedia pedido ↔ plato
