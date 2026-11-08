# MiniMundos — Documento de diseño inicial v0.1

**Fecha:** 2026-11-08  
**Estado:** Concepto aprobado; implementación pendiente  
**Plazo objetivo:** prototipo jugable para enero de 2027  
**Equipo/ritmo supuesto:** una persona, 4 horas por día, 4 días por semana (~16 h/semana)  
**Producto:** juego familiar y cooperativo 3D, freemium, ampliable por sectores/islas.

## Visión
MiniMundos es un universo familiar donde cualquier jugador puede explorar territorios, desbloquear sectores, cultivar y decorar un jardín, construir mejoras y criar mascotas persistentes. Se juega en solitario (con compañeros automáticos que resuelven tareas desatendidas) o con familiares y amigos que realizan simultáneamente actividades de diferente complejidad. **No hay competición ni PvP en el juego base**. Un eventual mundo competitivo sería una expansión separada y opcional, no un requisito de este proyecto.

## Pilares no negociables
1. **Libertad de actividad:** jugar una sesión solo para regar, sembrar, cuidar la mascota o decorar debe ser divertido y producir algún progreso; explorar es opcional en cada sesión.
2. **Cooperación inclusiva:** varias personas pueden contribuir a la misma misión desde tareas distintas (rompecabezas fáciles/difíciles, combate, recolección). Los asistentes cubren tareas no elegidas.
3. **Dificultad por perfil:** al crear el personaje se solicita un **rango de edad** para establecer dificultad inicial; la experiencia se adapta luego a los resultados y se permite elegir dificultad manualmente. El rango no es una medida rígida de habilidad. Guardar solo los datos de edad mínimos necesarios; aplicar protección de cuentas infantiles.
4. **Progreso persistente:** inventario, jardín, mascotas, desbloqueos y territorio se conservan entre sesiones; permisos explícitos para editar jardines ajenos.
5. **Contenido modular:** nuevos sectores, recetas, plantas, guardianes y variantes de acertijos mediante datos/configuraciones, evitando copiar código y crear parches.
6. **Monetización justa:** vender personalización cosmética, nunca ventajas indispensables ni acelerar dolencias de una mascota mediante pagos.

## Bucle principal
**Jardín/hogar → cuidar mascota y cultivar → explorar y resolver actividades → obtener materiales/semillas/huevos → construir, mejorar y ampliar jardín → desbloquear nuevo sector → repetir.**
También existen bucles cortos autónomos: regar/cosechar/decorar, cuidar mascota, fabricar o realizar un minijuego suelto.

## Jardín
- Terreno inicial pequeño, expansión mediante recursos hallados explorando.
- Plantas con etapas de crecimiento; regar, cosechar y obtener semillas.
- Banco de elaboración, caminos, cercas, fuentes, estanques y hábitats para mascotas.
- Objetos decorativos colocables; ciertas estructuras aportan funciones (cultivo, almacenamiento, cuidado de mascota).
- Jardín personal primero; jardín comunitario con permisos de acceso/edición después.

## Exploración
- Islas o sectores conectados mediante dispositivos restaurables.
- Actividades simultáneas conectadas: p. ej. circuito de energía sencillo, circuito avanzado y guardián protector.
- La misma actividad cambia complejidad y presentación conforme al perfil de quien la usa.
- Motores reutilizables: conectar circuitos, clasificar, memoria/secuencias, recolección, combate simple, reparar/colocar.
- Los desafíos deben tener combinaciones y contextos distintos, no solo recolores.
- Bot de apoyo para estaciones no ocupadas. En la versión inicial se simula progreso con reglas deterministas y animaciones, no con IA general.
- En modo asistido, el jugador puede participar en combate con protecciones y telegráficos claros; dificultades más altas no bloquean recompensas esenciales.

## MASCOTAS — Sistema central tipo Tamagotchi
**Las mascotas no son accesorios inertes: conviven con el jugador y tienen interacciones útiles.**

### Necesidades y estados
- **Hambre:** alimentación con alimentos cultivados/comprados mediante moneda ganada jugando.
- **Ánimo/vínculo:** acariciar, jugar minijuegos sencillos, acompañar exploraciones.
- **Energía:** descansar en un hábitat/cama; cansancio cambia animaciones y limita acciones secundarias.
- **Salud:** enfermedades leves eventuales, con síntomas visuales comprensibles; buscar hierbas, preparar remedios y cuidar. **Sin muerte permanente**, sin enfermedad irreversible por no conectarse y sin incentivos para pagar por curación.
- **Crecimiento:** bebé → juvenil → adulto, mediante cuidados y actividades; desbloquea animaciones, interacciones y apariencias.
- **Personalidad:** rasgos lúdicos (curioso, juguetón, tranquilo) que modifican reacciones y preferencias, sin crear ventajas competitivas.

### Utilidad sin pay-to-win
- Acompañar a su cuidador en el jardín y la exploración.
- Ayudas ligeras: indicar recursos cercanos, recoger elementos comunes ocasionalmente, recordar que una planta necesita agua o activar animaciones para facilitar minijuegos.
- Poderes de mascota que alteren la progresión solo se ganan jugando y deben tener alternativas equivalentes; aspectos premium únicamente estéticos.

### Crianza / reproducción e intercambio (planificados; pos-MVP)
- Dos mascotas adultas compatibles pueden criar; condiciones: bienestar y consentimiento de propietarios cuando corresponda.
- La cría hereda un conjunto limitado de rasgos cosméticos procedurales/paletas, con restricciones de diversidad y límites de capacidad del hábitat.
- Se requiere **diseño de control anti-duplicados**, IDs únicos y registros transaccionales antes de abrir intercambio.
- Intercambio entre cuentas habilitadas, con confirmación doble y controles especiales para cuentas infantiles; prohibir apuestas, mercados por dinero real y prácticas de explotación.
- Evitar mecánicas de rareza pagada que se comporten como cajas de azar. Mantener obtención justa y transparente.
- Enfermedad y salud no se heredan como penalización que obligue a gastar.

### Catálogo visual
- Línea tierna: brotes, conejos mágicos, criaturas redondas de colores.
- Línea épica: pequeños dragones, lobos luminosos, guardianes de cristal; todas pasan por etapas de crecimiento.
- Monetizar variantes visuales, accesorios, hábitats y animaciones, nunca capacidad básica de cuidado/reproducción.

## Perfil de dificultad
- Rango inicial sugerido: 5–7, 8–12, 13–17, 18+ (ajustable tras revisión de requisitos de plataforma).
- Dificultad **asistida / estándar / desafiante**, con adaptatividad y posibilidad de cambiar.
- Las versiones de una estación ofrecen dificultad individual sin dividir la misión compartida.
- Guardar mínimos datos sobre menores y aplicar autorización parental para compras, chats y funciones sociales.

## Monetización freemium
- Gratis: exploración y progreso fundamental, primera mascota, cuidado, jardín, actividades y contenidos principales.
- Pago: skins de mascota/avatar, gestos, accesorios, construcciones y paisajes decorativos, paquetes temáticos.
- Evitar temporizadores de castigo, estrés por hambre/enfermedad, presión a menores y mejoras de pago que bloqueen la jugabilidad.
- Compras integradas requieren autorización de tutor donde aplique; seguridad, privacidad infantil y cumplimiento de políticas de cada tienda antes de publicar.

## Versión jugable de enero 2027 — alcance recomendado
Un único sector 3D estilizado, un jardín editable y guardado local, un avatar, una mascota inicial con alimentar/acariciar/descansar, necesidad visual de hambre/ánimo, dos etapas de crecimiento o progreso visible hacia ellas, plantas simples con sembrar/regar/cosechar, un generador con acertijo parametrizable, un encuentro con guardián básico, recursos y desbloqueo de una ampliación del jardín. Controles de PC/táctil por definir.

**Fuera de la primera entrega:** multijugador online real, intercambio, reproducción, enfermedades complejas, pagos integrados, múltiples biomas, clasificaciones, PvP, economía remota. Se preparan interfaces/datos para añadirlos después. Si el objetivo es monetizar en enero, se necesitará reconsiderar alcance y tiempos de certificación de tiendas.

## Roadmap propuesto (no compromiso)
- **Fase 1 (noviembre):** prototipo navegable, cámara/movimiento, jardín y guardado; esquema de datos para mascotas y actividades.
- **Fase 2 (finales de noviembre):** una mascota interactiva, necesidades no punitivas, alimentación, descanso, cuidado y crecimiento simple.
- **Fase 3 (diciembre):** cultivo, inventario, expansión de jardín, generador con dificultad configurable y una criatura/guardián.
- **Fase 4 (finales de diciembre a enero):** tutorial, audio, persistencia, rendimiento, pulido, pruebas con adultos y familias, primer build jugable.
- **Expansiones mensuales:** añadir módulos de isla, plantas, especies, recetas y decoración; después cooperativo online, cría/intercambio y catálogo cosmético.

## Entregables iniciales técnicos
1. Elegir plataforma y motor según las restricciones del repositorio y público (web 3D/mobile).
2. Crear repositorio de código separado del portal de Rising Games, o un paquete bien aislado; no alterar juegos existentes.
3. Configurar escena principal, controles, cámara, herramientas de prueba y guardado versionado.
4. Crear un sistema de entidades y estados **configurable por datos** para mascotas, plantas y estaciones.
5. Implementar una vertical slice completa antes de añadir islas.

## Criterios de aceptación de la primera vertical slice
- Entra a la isla, camina, interactúa con al menos 1 planta, 1 mascota y 1 dispositivo.
- Alimenta, acaricia y deja descansar a la mascota; su estado y animación cambian; el progreso se guarda y recarga.
- Siembra, riega y cosecha; usa un recurso para desbloquear una decoración o extensión.
- Completa un acertijo en dos niveles de dificultad usando el mismo motor.
- No existe competición ni presión de compra.
- Jugar sin otros humanos no bloquea ninguna función esencial.

## Decisiones pendientes
- Motor y plataforma objetivo, web vs Android vs PC; conexión y sesión universal Nexo.
- Dirección artística concreta y primera especie de mascota.
- Mecánica exacta de combate sencillo.
- Cooperativo online: modo servidor/autoritativo, sincronización y políticas infantiles.
- Reglas finales de genética cosmética, crianza, intercambio y moderación.
- Diseño comercial y fecha realista de monetización.


---

# Visión ampliada v0.2 — 2026-11-08 (decisiones y propuestas nuevas)

**Esta sección actualiza el alcance creativo anterior y prevalece cuando existe una discrepancia.** El objetivo es un **universo de minijuegos conectados** por un mismo jardín, edificios, mascotas, inventario y progresión. No es un juego de una sola mecánica ni una colección de minijuegos desconectados.

## Principio de diseño
- Un primer mundo central **completo y rejugable**: islas mágicas conectables, hogar/jardín, edificios que se construyen y mejoran, exploración, crianza/cuidado de mascotas, plantas, recursos y actividades muy distintas.
- Cada isla futura puede introducir **un tipo de actividad nuevo** y versiones/niveles de motores existentes, con combinaciones, enemigos, objetivos y recompensas nuevos.
- Progresión transversal: mejoras permanentes de edificios, máquinas, jardín, mascotas, semillas, naves o herramientas; desbloqueos por misiones. Los mundos no reinician arbitrariamente el progreso.
- Se puede jugar solo, con bots de apoyo, o en familia/amigos con actividades simultáneas adecuadas a cada jugador. **No hay competitividad en el juego base.**
- Identidad visual propia y mecánicas originales. Juegos conocidos sirven de referencias de experiencia, no de copiar niveles, personajes, arte, nombres, música ni código.

## Inspiraciones y motores potenciales (referencias, no clones)
1. **Jardín estratégico vivo** (referencia: atractivo de cuidar plantas y defenderlas en Plants vs. Zombies): conseguir semillas en expediciones; sembrar, alimentar con nutrientes, crecer, mejorar, mover plantas para defender sus bancales de insectos; plantas de aspecto original y personalidad visual; distintos insectos (escarabajos, orugas, polillas y otros, incluidas abejas únicamente si encajan con ecosistema) y roles tácticos. **Plantas existentes permanecen**, no se replantan durante cada ataque. Dificultad de oleadas por perfil y desempeño. Prevención de daños permanentes frustrantes y de pagos forzados.
2. **Carrera de obstáculos cooperativa** (inspiración abstracta en endless runners como Subway Surfers): todos recorren el mismo trayecto en equipo, esquivan obstáculos y consiguen recursos. Sin copia de trenes/escenarios reconocibles. Aportes por jugador con ayuda adaptativa.
3. **Acción/plataformas ligera cooperativa** (referencia de ritmo y variedad: Metal Slug): misiones en ruinas, planeta alienígena u otros biomas, plataformas y combate simplificado, armas y habilidades descubiertas/mejoradas a través del juego.
4. **Defensa arcade de satélite/nave** (referencia de estructura: Galaga): proteger instalaciones, enemigos en patrones, mejoras persistentes de nave y equipamiento, niveles y oleadas diferentes.
5. **Exploración de hordas**: mantener una posición/activar mecanismos mientras criaturas atacan; mascotas con aportes al combate y búsqueda.
6. **Misterios cooperativos y tareas sociales** (inspiración abstracta de la coordinación de Among Us): encontrar anomalías, reparar sistemas, intercambiar pistas; evitar engaños obligatorios, expulsión o chat abierto para mantener carácter familiar.
7. **Conexión de circuitos / rutas**: fuente de energía y generadores, desafíos simples/avanzados por perfil, cooperativo simultáneo.
8. **Patrones y memoria**: señales, luces, secuencias; dificultad graduada.
9. **Combinación de piezas**: puzzles de agrupación con objetivos y obstáculos propios; estética/objetivos exclusivos.
10. **Recolección/cuidado**: pesca, búsqueda de semillas, limpieza de jardines y hallazgo de tesoros con ayuda de mascota.
11. **Construcción y reparación**: organizar piezas, arreglar puentes, satélites, talleres o invernaderos.
12. **Rutas y laberintos**: cartografía y exploración con secretos y ayuda de mascota.

**Meta creativa sugerida por el usuario:** **10–15 minijuegos diferentes en el primer mundo** y una expansión/un nuevo mundo aproximadamente cada mes. **Riesgo de producción:** con ~16 h/semana y una fecha de enero de 2027, esto es una meta ambiciosa, no un compromiso viable sin recortar el alcance o reutilizar mucho contenido ya existente. Antes de codificar se debe priorizar 3–4 motores realmente sólidos para el primer prototipo y planificar el catálogo completo mediante iteraciones. El primer mundo debe sentirse completo aunque no contenga 15 mecánicas distintas.

## Jardín estratégico de plantas: diseño preliminar
- Se encuentran semillas en mundos/actividades y también se cultivan variedades libres.
- Cada planta tiene familia, rango de crecimiento, aspecto, alimentación/nutrientes, resistencia, tipo de defensa y personalidad animada (caras opcionales; no copiar personajes de terceros).
- El jardín es **persistente**: las plantas cultivadas continúan existiendo, pueden moverse entre bancales, crecer, cambiar su posición defensiva y participar en alertas de insectos.
- Evento de insectos: aviso visible; el usuario elige si reorganizar plantas o usar herramientas/mascota; las oleadas tienen objetivos claros, variabilidad de rutas y tipos, contador limitado y dificultad adaptable. Sesiones infantiles menos punitivas.
- En dificultad alta, los enemigos requieren planificación, sin convertir la actividad en requisito universal para avanzar.
- Recompensas: semillas, materiales, apariencias, nutrientes obtenibles jugando y mejoras del terreno. **Monetización propuesta por usuario:** paquetes de semillas y nutrientes; **condición de diseño**: no vender ventajas exclusivas o nutrientes obligatorios, ni hacer que el mantenimiento de plantas dependa de pagos. Los paquetes de pago deberán ser cosméticos o equivalentes a obtención gratuita y claramente especificados.
- Necesita playtesting: defensa automática que sea fácil para principiantes y estratégica para veteranos.

## Mascotas como tejido conectivo de todo MiniMundos
- Las mascotas son persistentes, interactivas tipo Tamagotchi: hambre, energía, vínculo, salud no punitiva, crecimiento, cuidado, alimentación, enfermedades curables con recursos de juego.
- Acompañan minijuegos: ayudan en combate, revelan secretos, rastrean objetos, detectan rutas, apoyan puzzles, buscan semillas o alertan insectos. Las capacidades se consiguen con progreso.
- Crianza/reproducción y cambio entre amigos son sistemas futuros, con consentimiento, controles de seguridad infantil y anti-duplicación; no deben bloquear MVP.
- Variedad: criaturas épicas y tiernas; animaciones y accesorios vendibles sin ventajas injustas.

## Dificultad individual adaptable
- El jugador aporta al configurar el perfil una franja de edad apropiada y elige o ajusta dificultad; el sistema debe ofrecer asistencia y recalibrarse según desempeño.
- La **misma isla/estación** muestra circuitos, patrones, volumen de enemigos, velocidad y daño acorde con el jugador que realiza esa actividad. El resto de participantes puede estar en otro grado de desafío sin quedar bloqueado.
- Evitar inferir que todos los adultos desean dificultad extrema o que todos los niños necesitan nivel bajo. Permitir sobrescritura y mantener el reto atractivo.
- Las recompensas esenciales están disponibles en todas las dificultades. Sin marcadores competitivos obligatorios.

## Metaprogresión, economía y expansión
- **Mundo 1**: jardín/hogar central, edificios y mejoras, semillas, mascota inicial, actividades diferenciadas, guardianes y conexiones entre sectores. Debe enseñar el juego sin abrumar.
- Los materiales, planos y tecnologías obtenidos en los minijuegos impulsan construcción, mejoras y acceso a nuevos sectores.
- Ejemplos: expedición a planeta → materiales para nave; defensa de satélite → piezas permanentes; mundo boscoso → semillas/plantas; puzzle de energía → puente/isla; nuevo edificio → funcionalidad nueva.
- Misiones principales, proyectos de colección y actividades libres sostienen distintas sesiones sin cronómetros de presión.
- Expansión mensual como **objetivo de cadencia**, condicionado a contenido y QA. Datos modulares, parámetros por mundo, catálogos de prefabs, reglas de recompensa y versiones de guardado.

## Monetización, menores y originalidad
- Base gratuita y jugable indefinidamente. Venta opcional: apariencias de mascotas y avatares, decoración, especies/semillas cosméticas, nutrientes visuales/opcionales sin ventajas desproporcionadas, edificios temáticos, animaciones y hábitats.
- Cualquier paquete funcional de semillas/nutrientes debe ser también obtenible mediante juego normal, sin enfermedades o plagas artificialmente intensificadas para presionar compras.
- Cuentas infantiles: compras bajo control parental, privacidad por diseño, comunicación e intercambio limitados según normas de plataforma; no mecánicas aleatorias de pago con probabilidades opacas.
- Todo homenaje a un clásico debe reinterpretarse con mecánica, arte, UI, audio y denominaciones propias.

## Decisión pendiente de producción
Definir plataforma inicial y si se prioriza **(a) una primera versión de 3–4 motores pulidos** o **(b) una compilación de 10–15 prototipos superficiales**. Recomendación técnica: (a), sin abandonar el objetivo comercial de expandir a 10–15 actividades. El soporte multijugador real, infraestructura remota y tienda pueden incrementar mucho el calendario.


## Enlace a diseño de jardín y hogar v0.3 — 2026-11-08
**Actualización que prevalece sobre el diseño anterior del jardín defensivo:** [Sistemas de jardín, granja, animales defensores, plantas de apoyo y casa editable](SISTEMAS_JARDIN_HOGAR_V0_3.md). Las plantas no lanzan ataques directos: proveen auras, sanación y control; los animales de granja combaten a los invasores. Mascotas de compañía y animales defensores son entidades distintas. Jardín/casa persistentes y decorables, actividades familiares simultáneas, sin bloqueos de energía ni obligación de salir por falta de actividades.
