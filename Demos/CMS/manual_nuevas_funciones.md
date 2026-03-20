# Manual de Nuevas Funciones del CMS

¡Bienvenido! Este manual detalla cómo utilizar las **14 nuevas funciones** implementadas en la última actualización del CMS para mejorar la seguridad, la gestión y los reportes de cobranzas.

---

## Fase A — Seguridad y Privacidad

### 1. Bloqueo por intentos fallidos de Login
- **Dónde:** Pantalla principal de Acceso (`login.html`).
- **Cómo funciona:** Si un usuario (tanto Administrador como Cajero) introduce una contraseña incorrecta **3 veces seguidas**, la pantalla de login se bloqueará por **30 segundos**. Verás un contador regresivo rojo y el botón de "Ingresar" se desactivará temporalmente para proteger el sistema contra ataques.

### 2. Cambio de Contraseña de Usuario
- **Dónde:** Panel Principal (Dashboard).
- **Cómo funciona (Administrador y Cajero):** 
  En la esquina superior izquierda de la pantalla, junto al logo del CMS en la barra de navegación superior (navbar), verás un icono de candado (`Cambiar Contraseña`).
  1. Hacé clic en el icono.
  2. Aparecerá una ventana donde debés ingresar tu nueva contraseña (mínimo 6 caracteres) y confirmarla.
  3. Clickeá en **Guardar**. Se actualizará inmediatamente en la base de datos de Auth.

---

## Fase B — Sesión y Alertas

### 3. Cierre Automático de Sesión (Auto-Logout)
- **Dónde:** Todas las secciones del sistema.
- **Cómo funciona:** Si dejas la pestaña del CMS abierta y sin uso durante **14 minutos**, saltará una alerta emergente avisándote que la sesión expirará en 60 segundos por inactividad. Puedes hacer clic en "Continuar Sesión" para seguir trabajando. Si llegas a los 15 minutos exactos sin mover el mouse o teclear algo, el sistema cerrará tu sesión automáticamente y te devolverá al login.

### 4. Alerta de Cuotas Vencidas (Solo Administradores)
- **Dónde:** Dashboard Principal (`dashboard.html`).
- **Cómo funciona:** Al entrar como **Admin**, visualizarás inmediatamente debajo del título del Dashboard un banner rojo advirtiéndote si existen cuotas en la base de datos cuya fecha de vencimiento (`due_date`) sea **anterior al día de hoy** y sigan marcadas como "Pendientes". Podrás ver el total consolidado en Gs. de esa deuda y un botón rápido para ir a la sección "Búsqueda" para gestionarlas.

---

## Fase C — Tickets y Recibos

### 5. Envío Rápido de Comprobantes por WhatsApp
- **Dónde:** Ventana de impresión de comprobante (`ticket.html`).
- **Cómo funciona:** Al registrar un pago en la pestaña Búsqueda, se te abrirá la ventana emergente habitual del ticket. Ahora verás un nuevo botón verde **WhatsApp** al lado de "Imprimir Comprobante".
  Al darle clic, se abrirá la aplicación WhatsApp Web o la App de Escritorio con un texto pre-armado y estructurado incluyendo los datos del alumno, curso, cuota, fecha y el monto pagado, listo para enviárselo al cliente.

### 6. Numeración Exclusiva de Recibos
- **Dónde:** Tickets impresos.
- **Cómo funciona:** Todo ticket o comprobante que se cobra a partir de ahora, genera automáticamente un identificador (ID) secuencial e irrepetible (`receipt_number`) incrustado desde la Base de Datos. Este número te servirá para cruces contables más exactos a futuro.

---

## Fase D — Gestión de Alumnos

### 7. Reprogramar Vencimientos (Re-agendamiento)
- **Dónde:** Sección "Búsqueda" (`search.html`).
- **Cómo funciona:** Al buscar un alumno y ver sus cuotas pendientes, notarás un icono azul con un **lápiz/calendario** (`btn-reschedule`) en la columna de acción de cualquier cuota PENDIENTE.
  1. Dale clic.
  2. Elegí la nueva fecha de vencimiento acordada con el alumno.
  3. Dale a **Guardar Fecha**. Esto es ideal si el alumno pidió retrasar 5 días su pago y no querés que aparezca como Deuda Vencida en rojo en los reportes.

### 8. Traslado de Sucursales (Solo Administradores)
- **Dónde:** Sección "Búsqueda" (`search.html`).
- **Cómo funciona:** Al buscar y abrir el legajo de un alumno activo, junto a los botones de Editar y Dar de Baja, ahora verás un botón amarillo que dice **TRASLADAR**.
  1. Hacé clic en él.
  2. De la lista desplegable, elegí a qué nueva filial irá el alumno.
  3. Confirmá. Este evento queda grabado en el registro de Auditoría.

---

## Fase E — Reportes y Excel

### 9. Exportar Listado de Alumnos
- **Dónde:** Dashboard Principal (`dashboard.html`).
- **Cómo funciona (Administrador):** Al lado del habitual botón verde de "Descargar Excel" (historial financiero), verás uno nuevo gris llamado **Exportar Alumnos**. Al pulsarlo, el sistema generará y descargará al instante un Excel (`listado_alumnos.xlsx`) con un padrón completo ordenado alfabéticamente (mostrando nombre, DNI, filial, curso y estado activo/inactivo).

### 10. Tasa de Cobro Mensual (KPI)
- **Dónde:** Tarjetas superiores del Dashboard Administrador (`dashboard.html`).
- **Cómo funciona:** Se agregó una nueva tarjeta que compara tu Total Facturado vs. el Total Esperado del mes. Automáticamente calcula qué porcentaje del dinero en la calle has recaudado en el mes en curso. *(Si se deben generar $1.000.000 y se cobraron $600.000, marca un 60% de Tasa de Cobro)*. 

### 11. Proyección de Ingresos Puros (KPI)
- **Dónde:** Tarjetas superiores del Dashboard Administrador (`dashboard.html`).
- **Cómo funciona:** Similar a la tasa de cobro, otra tarjeta calcula puntualmente toda la plata que falta llegar a caja del total mensual (resta de Total Esperado - Ingreso Efectivo), permitiéndote saber exactamente la proyección financiera que falta concretar a nivel cadena antes de fin de mes.

### 12. Rendimiento del Cajero del Día
- **Dónde:** Panel de Sucursal (Cajeros) en `dashboard.html`.
- **Cómo funciona:** Al entrar como Cajero, la vista mini-dashboard ahora calcula de forma segregada y automática el **Monto exacto cobrado solo en el día de hoy** junto a la cantidad total de pagos que procesó dicha sucursal, independiente de lo recaudado en el mes global, agilizando el control de caja chica.

---

## Fase F — Administración Avanzada (Exclusivo Admin)

### 13. Acceso Híbrido (Modo Dual Global/Sucursal)
- **Dónde:** Dashboard Principal (`dashboard.html`).
- **Cómo funciona:** Si sos Administrador y tenés una sucursal asignada (ej. Sucursal Central), verás un nuevo selector en la barra superior: **[Global] / [Sucursal]**.
  - Al elegir **Global**, verás los KPIs generales de toda la cadena.
  - Al elegir **Sucursal**, el dashboard se transformará en la vista de Cajero de tu sede, permitiéndote ver los cobros del día de la Central sin cambiar de usuario.

### 14. Gestión Maestra de Usuarios
- **Dónde:** Nueva sección **Usuarios** en el menú lateral.
- **Cómo funciona:** Esta pantalla permite al Administrador centralizar quién trabaja en cada sede.
  - Podrás ver la lista de todos los correos registrados.
  - Podrás cambiar el **Rol** (Admin o Cajero) de cualquier persona.
  - Podrás **Vincular o Cambiar** la sucursal de un empleado. Si un cajero se traslada a otra sede, simplemente cambiale la sucursal asignada aquí y sus permisos se actualizarán al instante.
