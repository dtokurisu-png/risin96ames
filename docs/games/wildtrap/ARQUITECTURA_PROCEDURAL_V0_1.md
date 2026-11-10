# WILDTRAP — Escenario y sistemas procedurales v0.1
**9 de noviembre de 2026.** Diseño técnico con prototipo local descargable; no significa lanzamiento web.

## Geografía
- Mapa fijo de 240×240 unidades Three.js; cinco sectores: campamento central (0,0), bosque exterior (-61,34), bosque profundo (52,43), humedales (-44,-62) y santuario (65,-52).
- Radios aproximados: campamento 21; restantes 35–40. Corredores sin obstáculos entre campamento y cada sector de unos 14 de ancho.
- La topología, colisiones críticas y rutas no cambian entre partidas; varían la vegetación y distribución de encuentros.

## Generador por semilla
- Algoritmo de PRNG reproducible: igual semilla y versión del generador => igual disposición inicial.
- Reservar primero nidos, faros, recursos y criaturas; distribuir vegetación al final con separación y exclusión de corredores. Variar paleta de suelo entre cuatro esquemas.
- Diez arquetipos visuales de vegetación: pino, hoja, hongo, tronco, matorral, roca, flor, helecho, árbol viejo y arbusto.
- Tres objetivos por expedición; recuperar al menos un huevo es la misión principal fija, mientras dos objetivos alternos se eligen de recuperar código y abrir sello, recoger muestras, activar dos faros o explorar nido.
- Probado el generador puro de manera automatizada con 250 semillas y validación de nidos, faros y despeje.

## Mecánicas iniciales del prototipo
- Control de personaje y cámara elevada. Farolera GLB como único personaje importado, con selección del archivo por el usuario. Una cápsula geométrica de prueba se muestra solamente si el GLB no está disponible.
- Movimiento, correr produce ruido y eleva amenaza; percepción de fauna con FSM básica de patrulla, persecución y retirada/aturdimiento.
- Fauna provisional representada con geometría: Muscarabajo, Lobrisco, Ecosombra y Cornazul. Las demás especies del bestiario son ampliaciones.
- Nidos, huevos, inventario (tres espacios para huevos), recursos, faros, código/sello, extracción, daño, incapacitación y mochila caída recuperable, minimapa y HUD.
- Guardado local de demostración tras extracción; no es seguro para producción, comercio ni salas online.

## Arquitectura extensible
1. Modelo de datos con mapa, semilla, slots, bioma, decoraciones, spawn, objetivos, nidos, inventarios, amenazas, fauna, Guardianes y eventos.
2. Separar generación procedural (sin render) de entidad lógica, Three.js, controles, HUD, persistencia y futura red.
3. Sala de 1–4 jugadores con backend autoritativo: clientes envían entradas, servidor valida robo de huevos, propiedad, botín, muerte, reanimación y extracción. No dar recompensas por acciones de cliente sin validar.
4. IA por componentes: visión, ruido, territorio, aggro, flanqueo, retirada, coordinación de manada; navegación real alrededor de obstáculos y presupuesto de actualizaciones por distancia.
5. Guardianes coleccionables: huevo, incubación, criatura que crece y habilidades; independientes de fauna salvaje no capturable.
6. Persistencia online posterior: IDs únicos, transacciones anti-duplicación, registro de eventos; después tienda e intercambios. Clima y elementos quedan posteriores al MVP.
7. Arte: geometrías de sustitución durante el desarrollo; modelos GLB optimizados se insertan sin alterar la estructura del mundo.

## Estado y próximos pasos
Prototipo local en archivos index.html, main.mjs, world.mjs, test-world.mjs y README.md, entregados como ZIP en la conversación. La simulación procedural pasó 250 pruebas reproducibles; NO se ha validado todavía la escena de punta a punta en un navegador real, la carga efectiva de la Farolera ni el rendimiento. NO hay multijugador, comercio, Guardianes funcionales ni backend de progreso todavía. Siguiente hito: cargar la Farolera real, jugar la misión completa en navegador y luego añadir servidor autoritativo y pruebas cooperativas.


## Implementación v0.3 — 10 noviembre 2026 (sustituye dimensiones y topología v0.1)
**Código ejecutable:** https://github.com/dtokurisu-png/wildtrap (rama main). Nuevo mapa **420×420** (aprox. 3 veces la superficie de 240×240), cinco regiones explorables y refugio fijo de spawn en esquina sureste, fuera de las cinco regiones. **Cámara al hombro**; movimiento relativo a la orientación, giro mediante arrastre de ratón. **Cinco biomas en permutación por semilla:** pradera, bosque denso, bosque antiguo, humedales y montaña. Las coordenadas de regiones y las rutas principales permanecen fijas; la montaña cambia de región, alterando alturas, mientras barreras naturales de roca/árboles tienen colisiones y accesos principales y alternativos. Existen cinco cuevas; una es elegida como punto de extracción por semilla; cinco compuertas interactivas y cinco puntos de escaleras. La Farolera GLB se carga por el jugador; resto geometría provisional. Generador probado con **1000 semillas** (120 permutaciones de bioma), sin fallos de invariantes detectados. **Limitaciones:** comprobación lógica y sintáctica, no smoke test visual completo en navegador ni pruebas de navegación agente. El multijugador continúa pendiente. En caso de contradicción, esta sección v0.3 prevalece sobre especificaciones anteriores de 240×240.
