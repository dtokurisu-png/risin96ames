# La Convergencia — concepto PvP de objetivo compartido (revisión 2026-11-08)
Estado: propuesta de vertical slice; NO implementación ni sustitución del diseño completo anterior.
Origen: proyecto 6v6 definido en agosto 2026, recuperado de decisiones previas.

## Fórmula comercial deseada
- Free-to-play, **un mapa principal**, 1–12 jugadores (objetivo máximo **6v6**), solo o con amigos, equipos competitivos y rivales reales cuando estén disponibles.
- **Personajes completos y equilibrados**, mejora mediante habilidad humana, no estadísticas compradas ni grindeo para subir atributos.
- Partidas repetibles y competitivas con reglas fáciles de aprender y profundidad por cooperación y decisiones.
- Monetización: skins, peinados, entrada/celebraciones, animaciones de efectos legibles, compañeros cosméticos y pase cosmético. Ningún poder pagado.
- Un mapa no equivale a bajos costos: equilibrar habilidades, networking, seguridad y adquisición/retención comunitaria continúa siendo labor intensiva.

## Concepto original recuperado
- Un santuario/mapa top-down de **seis zonas exteriores**, **dos nexos intermedios** y **un núcleo central**. Sin lanes ni torres clásicas.
- Desarrollo del conflicto inicial 1v1 → 3v3 → 6v6 (modelo original; verificar balance).
- Llaves de Vínculo/objetivos aleatorios distribuidos entre zonas. Modalidades de interacción: **escolta**, **reliquia vinculada** y **carga transferible**. Pases, robos, intercambios físicos de roles y rutas alternativas/jungla.
- Objetivo final del diseño completo: completar nexos y sostener el corazón/núcleo durante aproximadamente **cinco minutos**.
- Roles funcionales: **vanguardista, duelista, cazador, especialista, apoyo, explorador**; subarquetipos como tanque, DPS, mago, asesino, sanador y escudos.
- Beneficios temporales de mapa, no progreso estadístico entre partidas.
- Ranking/contextual y combate deben depender de validación en servidor autoritativo.

## Vertical slice propuesta (sujeta a validación)
Un solo mapa compacto con **un artefacto transportable** que aparece en el centro; hay que recogerlo, trasladarlo al punto de entrega, proteger al portador, interceptar y robar; ganar al lograr 3 entregas o mayor puntuación en 10–12 minutos. Portar el artefacto restringe capacidad ofensiva; se puede soltar/pasar/robar. Sin torres ni compras de equipo durante match. Esto es **un modo inicial derivado** de cargas transferibles, NO reemplaza permanentemente las llaves, seis zonas y dos nexos originales.

- Día 1 del prototipo: 1v1 y bots; primera prueba online 2v2; primer modo público propuesto 3v3; meta de sala 6v6 cuando red y balance se hayan probado.
- Primer roster: 4 héroes (vanguardia, duelista, apoyo, explorador). 3 habilidades activas + definitiva por héroe, todas disponibles desde el inicio; evaluar si es demasiado para presupuesto inicial y reducir a 2+1 en MVP si necesario.
- Modos: salas privadas con amigos, emparejamiento público tras pruebas; completar plazas con bots etiquetados; no fingir que bots son humanos.
- No crear varias arenas, inventarios largos, tienda compleja o clasificación en vertical slice.

## Arquitectura técnica recomendada para evaluar
Cliente web 2D/2.5D Phaser/PixiJS o Three.js restringido; TypeScript; servidor autoritativo con Colyseus (rooms, matchmaking, sincronización, servidor Node.js) o alternativa equivalente; simulación de movimiento/ataques validada, tasas y latencia medidas. GitHub Pages puede hospedar cliente, no el proceso de servidor de tiempo real.
Pruebas mínimas: 2 equipos con dos navegadores/PC separados, desconexión/reconexión, daño validado en servidor, victoria consistente, bots, colisiones, latencia e input.

## Riesgos reales
96 h/6 semanas alcanzan para **prototipo PvP** con muy poco contenido, NO garantía de producto monetizable en producción. 6v6 añade latencia, emparejamiento, IA, balance y errores. Un F2P necesita concurrencia real para emparejamiento; mantener modos bot/offline y salas privadas para base pequeña. Distribución/marketing no está incluido en crear la aplicación.

## Hoja de ruta sugerida (6 semanas / ~96h)
1. Semana 1: mini-mapa, un héroe, movimiento y combate local con colisiones.
2. Semana 2: servidor autoritativo, sincronización con 2 clientes reales.
3. Semana 3: reliquia, pasar/soltar/robar, puntuación y victoria, 2v2.
4. Semana 4: héroes adicionales y bots iniciales; pruebas 3v3, salas privadas.
5. Semana 5: HUD, reconexión, efectos, sonido, estabilidad.
6. Semana 6: pruebas externas de latencia, balance, corrección y beta online; sin prometer tienda real/ranked para enero.

## Decisión estratégica pendiente
Comparar vertical slice PvP con juego 2D premium de alcance menor: freemium con cosméticos solo generará ingresos si hay audiencia suficiente y compras voluntarias; no prometer USD 4,500 netos mensuales a corto plazo. Si el usuario prioriza competitivo online como premisa, sí construir red desde primera fase, no posponerla como expansión.

## Estado de cartera
MiniMundos, R.O.K., RING: LEGACY y WILDBOUND conservan identidad propia; La Convergencia se registra como juego de arena 6v6 diferenciado, no como reemplazo automático de R.O.K.
