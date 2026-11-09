# WILDTRAP — Bestiario del bosque v0.1
**Fecha:** 2026-11-09  
**Estado:** propuesta de diseño registrada; no implica modelos ni sistemas programados.  
**Terminología acordada:** las criaturas coleccionables que acompañan, protegen, evolucionan y combaten con los jugadores se denominan **Guardianes** (antes «mascotas»). Las diez especies de este archivo son **fauna salvaje del escenario**, distintas de los Guardianes coleccionables. Algunas especies especiales podrían convertirse en Guardianes en actualizaciones posteriores, pero **no es una función inicial**.

## Visión de ecosistema
El bosque donde se buscan los huevos de Guardianes debe sentirse vivo: no todos los habitantes atacan a la vista. Hay fauna pasiva, territorial, ladrona, depredadora, centinela y protectora de nidos. Los encuentros dependen de la semilla de partida, sectores, objetivos, nidos, rutas y presupuesto de población. Las criaturas pueden interactuar entre sí sin intervención de jugadores. El objetivo es sustentar el **bucle cooperativo de sigilo, búsqueda, riesgo, rescate y extracción**, no convertir cada expedición en oleadas de combate.

## Propuestas de 10 especies
| # | Criatura | Aspecto / fantasía | Papel | Comportamiento distintivo |
|---|---|---|---|---|
| 1 | **Muscarabajo** | Escarabajo robusto con caparazón cubierto de musgo y pequeñas raíces | Recolector pasivo | Recolecta semillas/recursos en grupos; huye al recibir daño; puede delatar rutas hacia recursos |
| 2 | **Espinorro** | Pequeña bestia cuadrúpeda con púas de madera | Defensor territorial | Eriza púas, avisa de intrusos y embiste si se invade su nido |
| 3 | **Trastín** | Duendecillo silvestre pequeño, orejas largas y manos grandes | Ladrón | Se esconde y trata de llevarse recursos o huevos **caídos en el suelo**, a un escondite recuperable |
| 4 | **Lobrisco** | Cazador canino fantástico, patas largas, lomo arqueado, ojos brillantes | Cazador de manada | Rodea al equipo, persigue objetivos separados y coordina persecuciones simples |
| 5 | **Luminácaro** | Insecto alado con alas amplias y antenas luminosas | Volador de control/alerta | Destellos que desorientan de forma breve y pueden avisar a otras criaturas |
| 6 | **Raizón** | Criatura pesada formada por raíces, corteza y piedras | Tanque/bloqueador | Resiste, custodia estrechamientos y fuerza rodeos; ataques lentos y telegrafiados |
| 7 | **Glupín** | Anfibio fantástico brillante con bolsas de aire en cuello | Habitante de humedales | Saltos, empujones de burbujas e inmovilización breve y evitable |
| 8 | **Rocadillo** | Bestia redondeada cubierta por placas minerales | Embestidor | Se enrolla, rueda en línea recta y choca contra obstáculos |
| 9 | **Ecosombra** | Ser alado nocturno, oscuro, orejas enormes y ojos luminosos | Centinela acústico | Investiga ruido y da la alarma, atrayendo refuerzos |
| 10 | **Cornazul** | Reptil fantástico compacto, dos cuernos y placas coloridas | Protector de nidos | Patrulla, ruge y pide apoyo al detectar ladrones de huevos |

**Nombres y aspecto:** provisionales, sujetos a aprobación mediante concept art. No copiar criaturas existentes de otras franquicias.

## Relaciones y situaciones del ecosistema
- Los **Lobriscos** pueden cazar **Muscarabajos** cuando coinciden en una zona; los jugadores pueden aprovechar la distracción.
- Los **Trastines** pueden hurtar botín abandonado o huevos caídos y esconderlos; debe existir la oportunidad justa de recuperarlos.
- Los **Ecosombras** reaccionan al ruido y pueden despertar a defensores territoriales, incluidos **Espinorros** y **Cornazules**.
- Las rutas de **Muscarabajos** pueden llevar a materiales, mientras **Raizones** bloquean accesos y **Rocadillos** abren momentos para esquivar.
- Las especies cambian entre partidas; no deben poblar siempre todos los sectores ni actuar como enemigos permanentes.

## Ejemplo de expedición
Un equipo de 1–4 jugadores entra a recuperar un huevo especial. Puede seguir a Muscarabajos hacia recursos, evitar un Ecosombra para no atraer Lobriscos, distraer a un protector del nido mientras otro roba el huevo y recuperar un bolso caído antes de que un Trastín oculte parte del botín. Tras conseguir el huevo, el equipo debate si arriesgar una segunda incursión o extraer. Posiciones, nidos, mezcla de especies y objetivo varían con la semilla.

## Alcance y prioridades
**Catálogo conceptual:** 10 especies; **no significa implementar las diez en la primera versión**. Para una primera versión jugable, prototipar **5 roles reutilizables**: recolector, ladrón, cazador, centinela y defensor territorial. Posibles especies para probar esos roles: Muscarabajo, Trastín, Lobrisco, Ecosombra y Cornazul (selección propuesta, no cerrada). Después incorporar Raizón, Espinorro, Rocadillo, Luminácaro y Glupín según pruebas y presupuesto.

Arquitectura sugerida: componentes compartidos de percepción (visión/ruido), máquina de estados (patrullar, investigar, alertar, perseguir, huir, robar, defender), pertenencia territorial, tablas de aparición por sector, compatibilidad entre especies y presupuesto máximo de unidades activas. La presentación 3D seguirá el estilo de fantasía estilizada con **siluetas claras, materiales sencillos, geometría económica y animaciones contenidas** para Three.js/Blender/Tripo.

## Próxima producción artística
Diseñar individualmente las primeras dos criaturas salvajes, cada una aislada sobre fondo alfa y con modelo fácilmente realizable en polígonos moderados. No generar las dos hasta escogerlas con el usuario.
