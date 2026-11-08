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
