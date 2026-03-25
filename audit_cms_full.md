# 🔍 Auditoría Completa — CMS Cobranzas

**Fecha:** 25/03/2026 | **Archivos auditados:** 8 módulos HTML

---

## 🔴 CRÍTICO — Errores que afectan funcionalidad

### 1. [dashboard.html](file:///c:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/dashboard.html) — [exportToExcel()](file:///c:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/dashboard.html#830-831) y [exportStudentList()](file:///c:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/dashboard.html#831-832) no implementadas
**Línea 830–831**
```js
async function exportToExcel() { alert('Función de exportación simplificada. Use Reportes para talles.'); }
async function exportStudentList() { alert('Exportando alumnos...'); }
```
**Problema:** Ambas funciones son stubs que solo muestran alertas. El botón "Descargar Excel" visible en la UI no hace nada útil.
**Acción:** Implementar exportación usando SheetJS (ya incluido en la página).

---

### 2. [dashboard.html](file:///c:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/dashboard.html) — [printTicket()](file:///C:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/search.html#673-677) no pasa DNI ni fecha al ticket
**Línea 838**
```js
function printTicket(id, num, name, dni, date, amount, total, totalA, rem, course, concept) {
    window.open(`ticket.html?id=${id}&num=${num}&name=${name}&amount=${amount}&course=${course}&total=${total || ''}&concept=${concept || ''}`, '_blank');
}
```
**Problema:** Los parámetros `dni` y [date](file:///c:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/dashboard.html#837-838) se reciben como argumento pero **no se incluyen en la URL**. El ticket del dashboard siempre muestra "DNI: -" y "Vencimiento: -".
**Acción:** Agregar `&dni=${dni}&date=${date}` a la URL.

---

### 3. [dashboard.html](file:///c:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/dashboard.html) — [loadDashboardData()](file:///c:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/dashboard.html#690-715) fetchea perfil N veces
**Líneas 694–753**
```js
const { data: profile } = await supabaseClient.from('profiles').select('branch_id').eq('id', ...).single();
// Repetido dentro de loadOverdueKPI() y loadRecentPayments() y loadBillingBreakdown()
```
**Problema:** Dentro de [loadDashboardData()](file:///c:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/dashboard.html#690-715), para cada sub-función se hace un fetch independiente al perfil del usuario. Esto genera **4 consultas innecesarias** a Supabase en cada carga del dashboard.
**Acción:** Obtener `branch_id` una sola vez en [initDashboard()](file:///c:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/dashboard.html#519-546) y pasarlo como argumento a las funciones.

---

### 4. [report.html](file:///c:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/report.html) — Se llama a `getUser()` dos veces en el mismo flujo
**Líneas 359 y 416**
```js
const { data: { user } } = await supabaseClient.auth.getUser();  // primera vez
...
const { data: { user: u2 } } = await supabaseClient.auth.getUser();  // segunda vez
```
**Problema:** Duplicación innecesaria. El mismo usuario se obtiene dos veces.
**Acción:** Reutilizar la variable `user` en la sección "3. Get User Profile".

---

### 5. [report.html](file:///c:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/report.html) — Reporte imprime automáticamente al cargar
**Línea 472**
```js
setTimeout(() => { window.print(); }, 800);
```
**Problema:** Cada vez que la URL tiene parámetros, el navegador abre el diálogo de impresión automáticamente. Esto es intrusivo si se accede directamente a la URL.
**Acción:** Remover el `setTimeout` o agregar un parámetro `?autoprint=1` para hacerlo opcional.

---

### 6. [registration.html](file:///c:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/registration.html) — Cajero puede inscribir alumnos en cualquier sucursal
**Línea 355–358**
```js
const { data: branches } = await supabaseClient.from('branches').select('*').eq('active', true);
if (branches) {
    branches.forEach(b => $('#branch').append(...));
}
```
**Problema:** El selector de sucursal muestra **todas** las sucursales activas para cualquier rol, incluyendo cajeros. Un cajero puede inscribir un alumno en una sucursal que no es la suya.
**Acción:** Si el rol es `cajero`, filtrar por `branch_id` del usuario y pre-seleccionar/bloquear el selector.

---

### 7. [registration.html](file:///c:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/registration.html) — `total_payments` nunca se guarda en `students`
**Líneas 393–412**
El formulario calcula `installmentsCount` y crea las cuotas, pero **no guarda** ese valor en la tabla `students.total_payments`. Esto afecta directamente el display "Cuota X de Y" en los tickets de alumnos nuevos.
**Acción:** Agregar `total_payments: installmentsCount` en `studentData`.

---

## 🟡 MEDIO — Problemas de UX o datos inconsistentes

### 8. [search.html](file:///c:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/search.html) — [doSearch()](file:///c:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/search.html#502-516) no carga pre-query desde URL
**Líneas 502–514**
El botón "Buscar Alumno" del modal del dashboard genera `search.html?q=...`. Pero [doSearch()](file:///c:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/search.html#502-516) no lee el parámetro `q` de la URL al cargar la página.
**Acción:** Al inicializar, leer `URLSearchParams('q')` y llamar [doSearch(q)](file:///c:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/search.html#502-516).

---

### 9. [dashboard.html](file:///c:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/dashboard.html) — `birthdayAlertBannerCajero` referenciado pero puede no existir
**Línea 561**
```js
const banner = profile.role === 'admin' ? '#birthdayAlertBanner' : '#birthdayAlertBannerCajero';
```
Si no existe el elemento `#birthdayAlertBannerCajero` en el HTML del cajero view, la función falla silenciosamente. Verificar que ese ID existe en la vista del cajero.

---

### 10. [dashboard.html](file:///c:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/dashboard.html) — `recentPaymentsOffset` y `PAYMENTS_PER_PAGE` declarados pero nunca usados
**Líneas 502–503**
```js
var recentPaymentsOffset = 0;
var PAYMENTS_PER_PAGE = 8;
```
Variables declaradas globalmente que nunca se usan. Probablemente restos de una función de paginación eliminada.

---

### 11. Múltiples módulos — `#sidebarUsersItem` puede no existir en todos los HTML
En [report.html](file:///c:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/report.html), [search.html](file:///c:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/search.html), [expenses.html](file:///c:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/expenses.html), [courses.html](file:///c:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/courses.html), [registration.html](file:///c:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/registration.html), el código hace `$('#sidebarUsersItem').show()` o `.style.display = 'block'`, pero ninguno de esos sidebars tiene ese ítem con ese ID. Si algún usuario tiene rol admin y accede a esos módulos, el código falla silenciosamente (jQuery simplemente no hace nada).

---

## 🔵 MEJORAS — Oportunidades de limpieza y mantenimiento

### 12. Supabase Key expuesta en 8 archivos HTML
La misma `SUPABASE_URL` y `SUPABASE_KEY` están incrustadas en cada archivo HTML por separado. Si cambia la key, hay que actualizarla en 8 archivos. Considerar un archivo `supabase-config.js` compartido.

---

### 13. [report.html](file:///c:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/report.html) — `inactivityTimer` resetea pero aplica a todos, no solo la pantalla del reporte
El auto-logout está definido globalmente en [report.html](file:///c:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/report.html) pero el módulo de reporte a veces imprime automáticamente (punto #5). Esto puede causar que el usuario sea redirigido a login mientras imprime.

---

### 14. [sw.js](file:///c:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/sw.js) — Service Worker puede cachear versiones viejas tras un deploy
Revisar el `CACHE_NAME` en [sw.js](file:///c:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/sw.js). Si no se actualiza la versión al hacer deploy, usuarios pueden ver código viejo del cache.

---

## 📊 Resumen

| Severidad | Cant. | Descripción |
|-----------|-------|-------------|
| 🔴 Crítico | 7 | Errores funcionales o de seguridad |
| 🟡 Medio | 4 | Problemas de UX o datos |
| 🔵 Mejora | 3 | Limpieza y mantenimiento |

---

## 🛠️ Prioridad de corrección sugerida

1. **#7** — `total_payments` no se guarda al inscribir → afecta "Cuota X de Y"
2. **#2** — DNI y fecha no van al ticket desde el dashboard
3. **#6** — Cajeros pueden inscribir en cualquier sucursal
4. **#8** — El link "Buscar Alumno" del modal no pre-carga el buscador
5. **#1** — Exportar a Excel no funciona en dashboard
