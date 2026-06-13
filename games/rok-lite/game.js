/* Rock HTML Base Prototype
   Base modular: data -> state -> render -> input -> phase flow.
*/

const PHASES = [
  { id: 'extraction', label: 'Extracción' },
  { id: 'casting', label: 'Kasteo' },
  { id: 'resolution', label: 'Resolución' },
];

const PHASE_INDICATORS = [
  { id: 'extraction', label: 'Extracción' },
  { id: 'casting', label: 'Kasteo' },
  { id: 'resolution', label: 'Resolución' },
  { id: 'wait', label: 'Espera' },
];

const CARD_KEYS = ['1','2','3','4','5','6','7','8','9','/','*','-'];
const CASTER_DIRS = {
  '7': { dr: -1, dc: -1 }, '8': { dr: -1, dc: 0 }, '9': { dr: -1, dc: 1 },
  '4': { dr: 0, dc: -1 },                         '6': { dr: 0, dc: 1 },
  '1': { dr: 1, dc: -1 },  '2': { dr: 1, dc: 0 },  '3': { dr: 1, dc: 1 },
};

const TEST_INVOCATION_MOVE_SPEED = 3;
const TEST_CASTER_MOVE_SPEED = 2;
const TEST_RESTORE_PHASES = 2;
const EXTRACTION_ORB_TRAVEL_MS = 640;
const EXTRACTION_ORB_SEQUENCE_GAP_MS = 140;
const GAME_VERSION = 'v5.3.145';
const PATCH_NOTES = [
  'Fukurō no Me ajusta precisión a 3, usa Distancia con arco, corrige trayectoria/impacto de flecha y mueve Arma extra a Humano.',
  'Costo de invocaciones pasa a control CSS por costo total y se recalcula automáticamente como dominio base + costo aleatorio según el total.',
  'Balance: Naito Sutoka sube a costo 5, kasteo 5, restauración 5 y enfriamiento registrado 5; Kagero baja a costo 1 y kasteo 0.',
  'Corrige modal/HUD de Sutoka, Back contextual, fuentes de Acechar/Oculto/Movilidad completa y reactiva Ataque extra tras el intercambio.',
  'Naito Sutoka recibe Acechar por la cualidad Acechador: 3 huecos de habilidad, movilidad completa en área rival, modal clicable y botón Back en modales.',
  'Naito Sutoka ajusta alcance a 2 y activa Oscilación parcial: barrido frontal con 100% al primer token y 50% a los siguientes.',
  'Agrega el Guardián de Luz usando el asset entregado por el usuario y lo asigna a los guardianes del jugador cuyo Kaster tenga dominio Luz.',
  'Pulido visual del retorno al Spellbook: arco continuo sin pausas, landing elemental y la carta reaparece solo después del splash final.',
  'Extracción equilibrada: se eliminan cartas x2/x3/x4 del mazo elemental, cada extracción roba 3 cartas x1 y la relación de dominios duales pasa a 60/40.',
  'Asegura que las animaciones de kasteo, extracción, retorno/restauración y destrucción queden por encima de la bomba de humo y la niebla sin mover el humo de sitio.',
  'La animación de retorno por muerte de invocación se hace más lenta y legible: destrucción en arena, subida en arco hacia el Spellbook y landing elemental al llegar.',
  'Aumenta el hitbox de invocaciones para que sea cómodo seleccionar fichas sin volver a tapar casillas/fichas detrás.',
  'Bloquea el botón de siguiente fase durante Extracción para evitar saltarse la animación y perder recursos.',
  'El icono central de la bomba de humo queda en una capa baja separada; la niebla y partículas se mantienen igual.',
  'Al clicar una casilla vacía o no válida de la arena se cierran los botones Info/Poder y se deselecciona la invocación.',
  'Reduce el collider/hitbox de fichas a un botón pequeño en la casilla base para que una ficha visualmente superpuesta no bloquee la selección de la ficha/casilla detrás.',
  'Agrega controles individuales para tokens de Kasters y cambia la muerte de invocaciones a brillo elemental + destrucción tipo estructura.',
  'Se separan los iconos planos de arena (arma, movimiento pendiente y Oculto) de la capa visual del token para que no reciban outline/glow/hover; queda una clase protegida para futuros iconos planos.',
  'La cortina de humo conserva sus nodos visuales al renderizar para que la animación no se reinicie con acciones del jugador o del rival.',
  'Las casillas de humo ahora tienen pulso desincronizado/aleatorio sin cambiar los valores de control de opacidad y escala calibrados por el usuario.',
  'Las animaciones de kasteo, extracción y viaje de cartas quedan por encima de la niebla/bomba de humo sin mover la niebla de su capa visual.',
  'El hitbox/collider de invocaciones queda limitado a la casilla base para evitar que una ficha bloquee otra 2 o 3 casillas arriba.',
  'Los grids de arena, líneas de riesgo y línea central ahora toman color del dominio visual del Kaster de cada jugador.',
  'Se separa dominio visual del Kaster del dominio real de las cartas: el Kaster controla ecosistema visual/extracción, pero costos, fondos, skins, respawn y unidades respetan su carta.',
  'Luz ajusta su paleta a dorado más oscuro tipo mantequilla/oro y Tokugawa mantiene Luz como base visual con Fuego como secundario de extracción.',
  'Corrige los fondos de dominio para cartas de Invocación/Kaster/Estructura: Luz usa el templo dorado indicado por el usuario y Fuego usa el paisaje volcánico rojo indicado por el usuario.',
  'Ieyasu Tokugawa queda coordinado con dominio primario Luz y elemento secundario Fuego para su deck elemental; la configuración ahora lee el dominio del Kaster.',
  'Caudillo usa el icono SVG correcto subido por el usuario y su descripción oficial del Excel de cualidades.',
  'Los Kasters ya no muestran chip de Elemento/Atributo debajo del tag KASTER; ahora muestran raza y cualidad como las invocaciones.',
  'Se registran Hattori Hanzo como Ninja/Asesino y Ieyasu Tokugawa como Samurai/Caudillo.',
  'Se actualiza el modal del elemento Luz - Revelación con su resumen, manejo elemental, tempo, invocaciones, fortalezas, debilidades y descripción final.',
  'Se elimina del panel ancho del Kaster el chip flotante de iconos Elemento/Atributo; los assets quedan registrados pero no se muestran ahí.',
  'Corrige Elemento Luz para usar las nubes doradas/blancas, no el skin; el panel del Kaster muestra solo iconos de Elemento/Atributo sin tag textual Luz · Revelación.',
  'El panel y la vista del Kaster ahora muestran los iconos de Elemento y Atributo según el dominio activo del Kaster.',
  'Se registra correctamente el asset de Elemento Luz como nubes doradas/blancas y el atributo Revelación como logo propio, separando ambos del icono de costo Luz.',
  'Tokugawa se asigna como Kaster activo del rival J2 con dominio principal Luz, usando su arte/token y extracción de Luz.',
  'Se integra el Kaster Tokugawa de Luz como carta/caster registrado, usando arte y token propios, sin asignarlo todavía como Kaster activo del rival.',
  'Base de dominios Luz/Oscuridad: se registran assets de Luz, costo Luz, frascos X1-X4, skin Luz y Tokugawa como caster visual preparado sin cambiar todavía el rival a Luz.',
  'Reconstrucción limpia desde v5.3.100: se conservan visuales estables y solo se reaplican cambios pedidos.',
  'Toyotomi Hideyoshi corrige el cruce de imagen carta/token.',
  'Se agrega regreso de Resolución a Kasteo solo si no hubo acciones.',
  'Se restaura el aviso correcto de movimiento obligatorio: la ficha vibra al intentar pasar fase con movimiento pendiente.',
  'Toyotomi Hideyoshi usa explícitamente su token de arena y recibe controles de tamaño reforzados para que no desaparezca por escala.',
  'El indicador de restauración de invocaciones ahora usa el mismo lenguaje de contenedor que ataque/vida, con controles propios de tamaño, posición e icono.',
  'Controles individuales de tamaño para cada ficha de invocación en arena, incluyendo Ojo de búho y Samurai Akari.',
  'Naito muestra solo botones Info y Poder cuando está seleccionada en tu resolución; el ataque vuelve al flujo normal de seleccionar objetivo.',
  'Sutoka hatsuen-dan solo puede lanzarse si no hay una cortina de humo activa; la reacción defensiva usa botón Poder con brillo breve.',
  'La cortina de humo ahora genera partículas de nube aleatorias sobre aproximadamente el 70% de las casillas del área, por encima de la arena y con transparencia suave.',
  'La bomba de humo de Naito ahora puede reaccionar contra ataques/selecciones rivales de invocaciones, Kaster, poderes y conjuros que apunten a una invocación aliada válida.',
  'Se refuerza el latido visible del icono central de la bomba de humo con controles propios de escala y opacidad.',
  'La bomba de humo ahora dura 6 fases completas desde su lanzamiento, no una ronda contada al cambio de jugador.',
  'Las invocaciones ocultas por humo ya no bloquean casillas para el rival; si el rival entra en esa casilla, la invocación oculta se desplaza a una casilla adyacente cercana al Kaster rival.',
  'Se corrige la sinergia Ninja: solo Naito Sutoka puede activar bombas; los demás Ninjas solo ganan Oculto dentro de la cortina.',
  'Se eliminan iconos repetidos de bomba en las casillas válidas; ahora el área de lanzamiento ilumina casillas y muestra el icono solo al hacer hover.',
  'Se agregan controles visuales superiores para humo, botón de poder, iconos, radio de cortina y calibración de grids.',
  'Se agrega botón directo de poder sobre los Ninjas aliados durante Resolución para que Sutoka hatsuen-dan pueda activarse sin depender del menú emergente anterior.',
  'Se refuerza el hitbox de invocaciones propias durante Resolución para recuperar movimiento, ataque y selección de objetivo.',
  'Naito sutoka puede activar Sutoka hatsuen-dan de forma voluntaria durante tu fase de Resolución, además de usarlo como reacción.',
  'Naito puede reaccionar con Sutoka hatsuen-dan cuando un Kaster o conjuro rival la selecciona como objetivo, antes de resolver el efecto.',
  'Se corrige la interacción de fichas con poder: se elimina el contador flotante de bombas sobre Naito, se restaura el click/movimiento de invocaciones normales y el menú de Naito queda con Atacar objetivo / Activar poder.',
  'Se integra el style.css subido por el usuario y se reaplican encima los estilos necesarios de humo/oculto sin el badge extra de contador en arena.',
  'Naito Sutoka ajusta alcance a 3, velocidad a 3 y recupera el factor funcional Ataque extra.',
  'El modal de Bomba de humo deja de usar la plantilla ofensiva: ahora muestra Arma / especial, aplicación táctica y sin daño base.',
  'Se corrigen los iconos invertidos de Bomba de humo y Oculto en todos los usos visuales, modales, badges y animaciones.',
  'Golpe crítico 2 baja a 3 PDA y mantiene multiplicador x2.',
  'Kagero y cualquier carta sin aplicación explícita real no renderizan chip de aplicación de daño; el overlay purga cualquier chip fantasma.',
  'Los factores ofensivos ahora usan un contenedor propio separado del alcance y la precisión.',
  'La PDA de precisión se ajusta para que precisión 6 sea acierto garantizado salvo reducción por evasión u otros efectos.',
  'Se agrega la carta aliada Ninja Naito sutoka con arte, ficha, stats base, cualidades y aplicación de daño explícita.',
  'Se agrega la carta enemiga Samurai Akari con arte, ficha, stats base de cualidades Tirador/Guerrero y costo fuego + aleatorio.',
  'Se agrega la carta aliada Ninja Ojo de búho con arte, ficha, stats base de arquero oscuro y sin activar todavía Probabilidad de letalidad ni Arma extra.',
  'Se agrega la carta enemiga Samurai Toyotomi hideyoshi con arte, ficha y stats base de héroe cuerpo a cuerpo, dejando aparte su poder y evasión para un parche posterior.',
  'Se corrige la inversión de imágenes carta/ficha en Ninja Naito sutoka y Samurai Akari, restaurando el mapeo correcto de artImage y tokenImage según los archivos originales subidos por el usuario.',
  'Se corrige el mapeo de arte/ficha de Ninja Ojo de búho: la carta usa ahora la imagen con borde y la ficha en arena usa la imagen sin borde.',
  'Se limpia el paquete eliminando archivos de respaldo y capturas sueltas no usadas por el juego.',
  'Se agrega la primera carta de tipo Hechizo: Kage no Michi, usando composición de fondo + skin y sin efecto funcional todavía.',
  'Se agrega el poder Sutoka hatsuen-dan a Ninja Naito sutoka, con modal clicable, contador de bombas y sinergia de familia Ninja.',
  'Se implementan las bombas de humo como arma arrojadiza funcional: alcance 3, cortina de humo de radio 3, duración de una ronda y consumo visual del contador.',
  'Se agrega el factor universal Oculto con icono en ficha, bloqueo de selección por la IA rival y reaplicación dinámica dentro de la cortina de humo.',
];

const CAST_ENTRY_ICON_INLINE_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 69.94 79.84\"><defs><style>.cls-1{fill:#fff;}</style></defs><g id=\"Capa_2\" data-name=\"Capa 2\"><g id=\"Capa_1-2\" data-name=\"Capa 1\"><path class=\"cls-1\" d=\"M41.29,19.66s-1,4.64-1.19,5.86c-.58,5.18-1.29,8.06-1.8,13.25a53.73,53.73,0,0,1-1,5.62c-.48,2.4-.81,4.94-4.44,4.14-.33-.08-2.32,0-1.49,2.45,2.52,7.38,5.89,14.45,9,21.59.81,1.84,2.33,1.67,3.09-.07q4.66-10.74,9-21.58a1.68,1.68,0,0,0-2-2.46c-2.9.57-3.56-1.15-3.83-3.3-.88-7.16-2.54-21.48-2.54-21.48s-.25,2.79-1.54,2.24S41.29,19.66,41.29,19.66Z\"/><path class=\"cls-1\" d=\"M39,79.41s-15.42,1.81-22.71-2c-4.65-2.42-4.91-8-.18-10.13,4.26-1.93,11.55-3.25,11.55-3.25a12.45,12.45,0,0,1,3.71.17,20.05,20.05,0,0,1-2.87,1.33,26.91,26.91,0,0,0-3.25,2c-2.91,2-2.62,5.52.73,6.78s7.09,2,10.64,3c.94.27,5,1,5.9,1.31C42.35,79,39,79.41,39,79.41Z\"/><path class=\"cls-1\" d=\"M49.83,77.81S51.36,77,52.1,76.7a29.79,29.79,0,0,0,5-2.63c1.26-.87,2.85-2.42,2.83-3.64S58.68,68,57.55,66.91a18.83,18.83,0,0,0-4-2.32c-.85-.29,2.79-.36,3.5-.28a35.06,35.06,0,0,1,8.71,2,7.2,7.2,0,0,1,4,3.93c.62,2.21-.94,4-3,5-5.39,2.7-19.15,3.39-19.15,3.39Z\"/><path class=\"cls-1\" d=\"M41.92,0c-.43,2.2-1.7,7-1.82,9.21,0,.83,1.11,1.73,1.72,2.6.68-.82,2-1.66,1.92-2.44a48.68,48.68,0,0,0-1.16-6.79C42.14,4.44,41.47,4.37,41.92,0Z\"/><path class=\"cls-1\" d=\"M27.32,47c-.7-.55-1.48-2.21-2.85-3.31-2-1.59-4.46-3.4-5.46-4.22,0-.9.06-1.59,0-2.9,4.11-1.75,6.61-5.29,8.11-9.63,1-2.84.31-3.29-2.59-3.74-2.32-.36-9.62-2.07-11.22-1.85C8.87,22,1.18,22.87.48,24.05S.36,26.42.36,27.43c2.09,4,3.85,7.49,8.43,9.18.11,1.2.05,3.09.05,3.09a36.52,36.52,0,0,0-3.53,2.65C3.15,44.43,0,49.87,0,49.87A5.29,5.29,0,0,0,.48,52.7c.18.33,2.26.54,5.11.67,4.84.23,11.93.23,15.82.17,1.64,0,2.71,0,2.81-.08,1.07-.3,2.88-.55,3-1.11a5.15,5.15,0,0,0-.87-3.61,57.7,57.7,0,0,0-4.17-5.08,21.43,21.43,0,0,1,2.14,1.08C25.84,45.63,27.26,47.11,27.32,47ZM22,50.3a2.71,2.71,0,0,1-.68.67C18.1,53.3,8,53,5.62,50.93a1.6,1.6,0,0,1-.37-.42c-1.6-2.67-.64-4.51,2.36-8.25C8.62,41,11,40.34,12,38.89c.18-.25.33-.49.46-.71a6.71,6.71,0,0,0-.46-.73C11,36,8.62,35.34,7.61,34.08c-3-3.74-4-5.57-2.36-8.25s14.58-3,16.72.22-.44,6-2.89,8.57C18,35.73,15.85,36.3,15,37.45q-.27.38-.48.72.21.34.48.72c.85,1.16,3,1.73,4.08,2.84C21.53,44.31,24.11,47.09,22,50.3Z\"/><path class=\"cls-1\" d=\"M5.62,50.21C6,47,8,44.6,11,42.85a6.05,6.05,0,0,0,2.49-2.63,7,7,0,0,0,3,2.94,9.53,9.53,0,0,1,4.75,6.47c0,.21.06.41.08.62C18.1,52.58,8,52.31,5.62,50.21Z\"/><path class=\"cls-1\" d=\"M13.49,36.94a6.86,6.86,0,0,0-3-2.95,9.75,9.75,0,0,1-3-2.68h12a3,3,0,0,1-.35.51,23.2,23.2,0,0,1-2.54,2.12A7.3,7.3,0,0,0,13.49,36.94Z\"/></g></g></svg>";

const SMOKE_BOMB_ICON_ASSET = 'assets/weapons/smoke-bomb.svg';
const HIDDEN_FACTOR_ICON_ASSET = 'assets/factors/factor-oculto.png';
const EXTRA_ATTACK_FACTOR_ICON_ASSET = 'assets/factors/factor-ataque-extra.png';

const RESTORE_ICON_INLINE_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 175.63 180.01\"><defs><style>.cls-1{fill:#fff;}</style></defs><g id=\"Capa_2\" data-name=\"Capa 2\"><g id=\"Capa_1-2\" data-name=\"Capa 1\"><g id=\"Capa_2-2\" data-name=\"Capa 2\"><g id=\"vel\"><path class=\"cls-1\" d=\"M114.39,83.48c-1.54-1.21-3.25-4.85-6.26-7.26-4.34-3.49-9.78-7.47-12-9.27,0-2,.13-3.48,0-6.36,9-3.84,14.51-11.61,17.8-21.13,2.15-6.24.68-7.22-5.68-8.21-5.1-.79-21.12-4.54-24.63-4.06C73.9,28.55,57,30.53,55.49,33.11s-.27,5.21-.27,7.42c4.59,8.78,8.45,16.44,18.5,20.15.24,2.63.11,6.78.11,6.78a80.13,80.13,0,0,0-7.74,5.81C61.35,77.84,54.5,89.78,54.5,89.78a11.61,11.61,0,0,0,1,6.21c.39.72,5,1.18,11.21,1.47,10.62.5,26.18.5,34.72.37,3.6,0,6-.11,6.17-.17,2.34-.66,6.32-1.21,6.58-2.44a11.3,11.3,0,0,0-1.91-7.92,124.87,124.87,0,0,0-9.15-11.15,45.77,45.77,0,0,1,4.69,2.37C111.14,80.47,114.26,83.72,114.39,83.48Zm-11.74,7.24a6.13,6.13,0,0,1-1.49,1.47c-7,5.12-29.08,4.52-34.39-.09a3.51,3.51,0,0,1-.82-.92c-3.51-5.86-1.4-9.9,5.18-18.1,2.22-2.77,7.4-4.22,9.64-7.4.39-.55.72-1.07,1-1.56a17.41,17.41,0,0,0-1-1.6c-2.24-3.18-7.42-4.63-9.64-7.39C64.55,46.92,62.44,42.9,66,37s32-6.58,36.7.48-1,13.15-6.34,18.81c-2.33,2.44-7.09,3.69-9,6.21-.39.55-.74,1.08-1,1.58.31.51.66,1,1,1.58,1.87,2.55,6.63,3.8,9,6.23C101.68,77.58,107.34,83.68,102.65,90.72Z\"/><path class=\"cls-1\" d=\"M66.77,90.52c.92-7.11,5.15-12.31,11.76-16.15A13.32,13.32,0,0,0,84,68.59c1.5,3.16,4,4.83,6.57,6.46,5.35,3.31,9.26,7.83,10.42,14.19.09.46.13.9.18,1.36C94.15,95.72,72.08,95.13,66.77,90.52Z\"/><path class=\"cls-1\" d=\"M84,61.4c-1.59-3.19-4-4.94-6.66-6.48A21.21,21.21,0,0,1,70.84,49H97.08a6.08,6.08,0,0,1-.77,1.13,51.3,51.3,0,0,1-5.56,4.67C88.14,56.51,85.56,58.13,84,61.4Z\"/><g id=\"Capa_2-2-2\" data-name=\"Capa 2-2\"><g id=\"Capa_2-2-2-2\" data-name=\"Capa 2-2-2\"><path class=\"cls-1\" d=\"M70.61,121H70.5l.31,1.07Zm7.56-1.42h0l.19.43.15.41.15-.75a3.33,3.33,0,0,1-.54-.07Zm-5.56,1.17.18.64v-.71a.75.75,0,0,0-.18.08Zm3.66-.92A1.88,1.88,0,0,1,76,120l.09.8v-.7ZM52.14,117.7l-.53-7.3h0c-.18-1.79-.37-3.58-.55-5.36h-.52c0,.45-.08.89-.09,1.34,0,1.33-.06,2.65-.09,4h0v4.15a3.14,3.14,0,0,1-.08.81v2.33c.31,1.1.61,2.15.9,3.2h.43a8.73,8.73,0,0,0,.44-2.32,2.62,2.62,0,0,1,.06-.88Zm20.47,3,.18.64v-.71l-.18.12Zm3.66-.92a1.88,1.88,0,0,1-.23.16l.09.8V120Z\"/><path class=\"cls-1\" d=\"M97.79,130.22A11.84,11.84,0,0,1,94.45,132a32.73,32.73,0,0,1-19.25.22,17.46,17.46,0,0,1-3.92-2,2.2,2.2,0,0,1-1-2.3c.24-1.9.32-3.83.47-5.76l-.1-1.16a19.72,19.72,0,0,1,.2-2.66c.07-.55.37-1.14,1-.87a1.72,1.72,0,0,1,.8,1.16,3.75,3.75,0,0,1,.07,1v1.12l.18.64c.75,1.38,1.83,1.87,2.81,1.4s1-1.06.53-2v-.7l.15-.26a3.48,3.48,0,0,0,.3-.26c.15-.16.59-.11.88-.07l.66.1.19.43.15.41c0,1.42.37,1.92,1.56,2.29a4,4,0,0,0,3.37-.49,7.07,7.07,0,0,0,2.17-2.15h-.23l.92-1a.55.55,0,0,0,.19-.21c.54-1,1-2.14,1.57-3.37l.2-5.85c.06-.83,0-1.88,1.17-1.87s1,1.11,1.14,1.91a3.37,3.37,0,0,0,.07.84v1.66c0,.46-.1.87-.15,1.29,0,.23,0,.46-.09.68a6.82,6.82,0,0,1-.06,1.28c.1.8.19,1.54.27,2.25h0V118c.06.47.12,1,.17,1.42h0l.33,2.6h.27a3,3,0,0,0,3.12,2.22v-3.58l.07-.93c0-.81.08-1.47.12-2.13h.1c0,.72.1,1.44.14,2.19l.09,1c-.53,2.76-.19,3.87,1.5,4.44V122a5.6,5.6,0,0,0-.06-1l.08-1,.36-6.21-.31-2.9v-8.09a33.71,33.71,0,0,1,.82-7.88,32.24,32.24,0,0,1,.8,7.89V111L98,113.8l.27,6.34.09-.63.09,2.3v4.79a1.78,1.78,0,0,0,.16.6C99.05,128.53,98.94,129.37,97.79,130.22Z\"/><path class=\"cls-1\" d=\"M96.44,62.35c1.11,1.45,1.64,21.77.68,26.22C96.07,85.9,95.52,64.41,96.44,62.35Z\"/><path class=\"cls-1\" d=\"M60.43,40c1.12,1.31,1.12,14.89,0,16.67C59.48,51,60,45.49,60.43,40Z\"/><path class=\"cls-1\" d=\"M71.93,93.94c.72,4.8.09,9.58-.22,14.63C70.79,105.73,70.88,95.35,71.93,93.94Z\"/><path class=\"cls-1\" d=\"M44.61,105.2c-1.11-3.84-.13-7.68-.07-11.52C44.79,97.52,45.61,101.35,44.61,105.2Z\"/><path class=\"cls-1\" d=\"M120.44,98.35c.12,2.84.74,5.65.33,8.66C120,106.18,119.79,99.35,120.44,98.35Z\"/><path class=\"cls-1\" d=\"M113.39,140.12l-1.07.06-2.16.14-2.5.15-2.48.15-2.5.15-4.73.32-4,.27-4,.27-4,.27h-.74l.24-.06,6.2-1.25,18.54-3.73,2.65-.54c.26,0,.26,0,.36-.15l1.84-1.94c1-1,1.93-2,2.88-3,.69-.75,1.49-1.48,2.25-2.21C119.46,134.25,115.34,138.41,113.39,140.12Z\"/><path class=\"cls-1\" d=\"M126.24,128.33a15.34,15.34,0,0,0-3.24.46,19.63,19.63,0,0,0,.34-2.76l.74-.71.14-.11a2.56,2.56,0,0,1,.48.45,8.59,8.59,0,0,1,1.82,2.57v.07A1.33,1.33,0,0,1,126.24,128.33Z\"/><path class=\"cls-1\" d=\"M126.61,133h0c-.08.06-.23.11-.26.17a8.7,8.7,0,0,1-1.41,1.93,18.47,18.47,0,0,1-4.79,3.49c-.78.41-1.61.81-2.5,1.2a1.61,1.61,0,0,1-.38.08l-2.48.13h-.57a17.69,17.69,0,0,0,7.77-8,11.64,11.64,0,0,0,3.24.74c.34,0,.69.06,1,.08Z\"/><path class=\"cls-1\" d=\"M125.19,130.62a.57.57,0,0,0-.26,0h1.68c0,.08,0,.09-.2.08H125l.61.07H126l.59.24h.2a1.77,1.77,0,0,1,.46,0l.75.08a2.46,2.46,0,0,1,.66.06c.22.06.33,0,.51.06h.23a3.75,3.75,0,0,1,.94.09s0,.06,0,.08a.3.3,0,0,1-.23,0H129a.66.66,0,0,0-.28,0,2.09,2.09,0,0,1-.5,0H128a7.91,7.91,0,0,1-1.08-.11h-.58a7.2,7.2,0,0,0-.8-.07h-.11l-.66-.07a2.65,2.65,0,0,1-.69-.06l-.67-.07h-.57c-.1,0-.11-.06,0-.08h.44l.61-.06h.42l.71-.07,1.5-.14H127a1.6,1.6,0,0,1,.31,0h.13a4,4,0,0,1,.49,0h.84c.34,0,.69-.08,1-.1h.45c.13,0,.17,0,.18.07h-.36c-.42,0-.81.09-1.22.12h-1.3a.53.53,0,0,0-.25,0h-.08a3.53,3.53,0,0,0-.46,0h-.48A1.68,1.68,0,0,0,125.19,130.62Z\"/><path class=\"cls-1\" d=\"M134.49,132.22a11.55,11.55,0,0,1-3.53,1.12,24.07,24.07,0,0,1-4.72.31c-.11.14-.18.27-.28.41l-.32.42c-.1.13-.22.27-.34.4l-.37.41-.42.41-.43.39-.47.39-.52.39-.53.38-.57.38-.61.38-.63.36-.65.35c-.23.12-.45.24-.69.35l-.73.35-.74.34-.77.33-.81.33-.82.31-.85.3-.89.3-.87.29H113a2.77,2.77,0,0,1,1.6,1.51,1.12,1.12,0,0,1-.16,1,2.78,2.78,0,0,1-.64.64s-.08,0,0,.06H114c2.12-.54,4.12-1.14,6-1.78,1.26-.44,2.45-.9,3.57-1.39a33.8,33.8,0,0,0,5.86-3.16,15.47,15.47,0,0,0,4-3.74,8.13,8.13,0,0,0,.76-1.31c.13-.29.24-.57.35-.86a.43.43,0,0,1,.07-.29C134.72,132.21,134.61,132.23,134.49,132.22Zm-7.42,7.08c-.66.06-1.33.11-2,.19h-.28a.14.14,0,0,1-.13-.09,1.84,1.84,0,0,0-.17-.22l-1,.09a4.19,4.19,0,0,0-1,.09.37.37,0,0,1,.2.07l2.63.64c.11,0,.23,0,.27.11a.94.94,0,0,1-.22.12c-.67,0-1.34.07-2,.13a.9.9,0,0,1-.33-.09.5.5,0,0,0-.16-.27l-2.28.14a.32.32,0,0,0,.12.11c.33.17.62.34.9.51s.34.18.5.27l.33.19.29.16.17.12a.54.54,0,0,1-.21.08h-.25l-1.79-.22-1-.14h-.28l-.75-.09-.51-.07-.18-.06V141H118l1.35-.58h.11a1.13,1.13,0,0,1,.51.12c-.3.1-.49.22-.78.32l-.39.18a.48.48,0,0,0,.29.1l.82.1h.29l.9.11h.15a1.21,1.21,0,0,0,.38,0,.17.17,0,0,0-.07-.13l-.64-.36h0l-.44-.26-.15-.07a2.22,2.22,0,0,1-.49-.3l.32-.12c.88,0,1.77-.1,2.65-.17,0-.07-.08-.12,0-.18l-1.19-.29c0-.08.1-.13.21-.18l2.63-.23h0a.76.76,0,0,0-.11-.14l-1.18-.25c-.06-.07,0-.11.1-.16a1.21,1.21,0,0,1,.38,0l2.25.48,1.23.26a.54.54,0,0,1,.25.09A1.24,1.24,0,0,1,127.07,139.3Zm1.62-1c-.3.2-.6.39-.89.6a.85.85,0,0,1-.34.11.53.53,0,0,1-.3-.09h-.07c-.34-.15-.67-.31-1-.49l-.31-.14-1-.45h-.12a3,3,0,0,0-.42.26l-.41.27h-.22a1,1,0,0,1-.25-.06l1.12-.74h.31l3.66.66a.57.57,0,0,1,.31.1Zm1.06-.83c-.15.13-.15.12-.53.17l-1.26.17h-.06a.77.77,0,0,1-.37,0l-.1-.09c0-.06.13-.09.3-.11l.88-.12h0c-.77-.1-1.53-.22-2.27-.34l-1.08-.14c-.05-.06,0-.11.07-.16a1.27,1.27,0,0,1,.39,0l1.17.19.67.09,1.35.2h0l-.3-.32h0l-.14-.13.11-.07a.86.86,0,0,1,.39,0h.08l.47.41.25.22Z\"/><path class=\"cls-1\" d=\"M115.61,116.71a29,29,0,0,1,3,4.83l-.72-.32a46.2,46.2,0,0,0-4.68-1.75H113l.11-.07a3,3,0,0,0,1.22-1.07,1.07,1.07,0,0,0,.1-.89,2.36,2.36,0,0,0-1.19-1.24l-.08-.06h.16C114.11,116.31,114.86,116.5,115.61,116.71Z\"/><path class=\"cls-1\" d=\"M134.61,129.08c-.3-.14-.57-.28-.85-.4a7.36,7.36,0,0,0-1-.34c-.35-.11-.72-.2-1.12-.29s-.8-.16-1.23-.22-.86-.11-1.31-.15-.89-.06-1.34-.07H126.3a11,11,0,0,0-3-3.22,24.41,24.41,0,0,0-.66-5.24,41.94,41.94,0,0,1,4.34,2.06,23,23,0,0,1,4.5,3.15,11,11,0,0,1,2.53,3.25A4.39,4.39,0,0,1,134.61,129.08Z\"/><path class=\"cls-1\" d=\"M132.73,129.39a8.39,8.39,0,0,0-2.57-.82,19.82,19.82,0,0,0-3.61-.27h-.31a15.34,15.34,0,0,0-3.24.46c-.07.37-.15.75-.24,1.13a12.89,12.89,0,0,1-.76,2.19,11.64,11.64,0,0,0,3.24.74c.34,0,.69.06,1,.08h.36a14.81,14.81,0,0,0,5.44-.79c1.16-.45,1.71-1,1.66-1.61C133.71,130.14,133.37,129.75,132.73,129.39Zm-2.35.7H130c-.42,0-.81.09-1.22.12h-1.3a.53.53,0,0,0-.25,0h-.08a3.53,3.53,0,0,0-.46,0h-.48c-.34,0-.67.06-1,.11a.57.57,0,0,0-.26,0,2,2,0,0,0,.35,0h1.29c0,.08,0,.09-.2.08H125l.61.07H126l.59.54h.2a1.77,1.77,0,0,1,.46,0l.75.08a2.46,2.46,0,0,1,.66.06c.22.06.33,0,.51.06h.23a3.75,3.75,0,0,1,.94.09s0,.06,0,.08a.3.3,0,0,1-.23,0H129a.66.66,0,0,0-.28,0,2.09,2.09,0,0,1-.5,0H128a7.91,7.91,0,0,1-1.08-.11h-.58a7.2,7.2,0,0,0-.8-.07h-.11l-.66-.07a2.65,2.65,0,0,1-.69-.06l-.67-.07h-.57c-.1,0-.11-.06,0-.08h.44l.61-.06h.42l.71-.07,1.5-.14H127a1.6,1.6,0,0,1,.31,0h.13a4,4,0,0,1,.49,0h.84c.34,0,.69-.08,1-.1h.45c.13,0,.17,0,.18.07C130.41,130.44,130.4,130.27,130.38,130.09Z\"/><path class=\"cls-1\" d=\"M134.79,130.35v.78a2.9,2.9,0,0,1-.09.59.49.49,0,0,0,0,.24c0,.08-.06.09-.14.14a12.71,12.71,0,0,1-5,1.38q-1.5.14-3,.12h-.26c.1-.2.2-.37.3-.56h0a14.81,14.81,0,0,0,5.44-.79c1.16-.45,1.71-1,1.66-1.61,0-.41-.37-.8-1-1.16a8.39,8.39,0,0,0-2.57-.82,19.82,19.82,0,0,0-3.61-.27v-.07c0-.08.11-.16.06-.24s-.1-.21-.16-.32h.76a14.27,14.27,0,0,1,2.26.12,12.38,12.38,0,0,1,5.11,1.42.18.18,0,0,1,.13.15A4.61,4.61,0,0,1,134.79,130.35Z\"/><path class=\"cls-1\" d=\"M117.22,140a44.35,44.35,0,0,1-6,2.08l-.65-.24c-.24-.07-.49-.15-.76-.21s-.53-.12-.82-.17-.57-.1-.87-.13-.63-.07-1-.09-.63,0-1,0h-1a4.9,4.9,0,0,0-.94.06l-.92.11a4.09,4.09,0,0,0-.85.15,5.72,5.72,0,0,0-2.87,1.25,1,1,0,0,0-.08,1.41.86.86,0,0,0,.2.18,1.22,1.22,0,0,1-.26.06c-1.3.17-2.63.32-4,.45s-2.69.22-4.06.3c-.84,0-1.69.09-2.54.12-2.08.08-4.15.1-6.24.07h-2.1l-2.24-.08h-.74a.54.54,0,0,1-.22,0l-.47-.27-7.24-3c-1.84-.77-3.77-1.52-5.67-2.27l-5.51-2.18-1.77-.9-.19-.08a.25.25,0,0,1,.24,0l.33.07L84,142a2.29,2.29,0,0,0,.64,0l3.57-.25,3.28-.23,3.31-.23,3.31-.24,3.28-.23,1.79-.11,2.48-.15,2.5-.15,2.5-.15,2.48-.15h.2c-.49.43-.83.68-.91.75a15.33,15.33,0,0,0,1.69-.8l1.53-.06,1.45-.09Z\"/><path class=\"cls-1\" d=\"M118.66,121.66a13.41,13.41,0,0,1,1.53,7.19l-1.69,1.61c-.39.38-.74.76-1.11,1.14-.93,1-1.87,1.92-2.8,2.89l-1.32,1.35a.21.21,0,0,1-.14.1h0v-11h.34l-.13-.06-1.73-.75-6.48-2.52c-.92-.35-1.84-.7-2.74-1.06-.71-.28-1.39-.57-2.08-.85L94,117.06l-2.7-1.13-.17-.08h.2c1.88.1,3.72.25,5.54.44,1,.11,2,.23,3,.37l-.06.06a1.7,1.7,0,0,0-.55.61.91.91,0,0,0,0,.61,1.76,1.76,0,0,0,1,1,10.88,10.88,0,0,0,4.41,1.07,14.72,14.72,0,0,0,6.44-.85l.27-.13a.45.45,0,0,1,.23,0c.9.26,1.77.53,2.6.81A42.11,42.11,0,0,1,118.66,121.66Z\"/><path class=\"cls-1\" d=\"M124,125.22l-.65.62v-1.37c.23.17.44.35.65.53S124.15,125.09,124,125.22Z\"/><path class=\"cls-1\" d=\"M57.61,142l-.21-.06a43.19,43.19,0,0,1-8.79-3.46,20.8,20.8,0,0,1-3.82-2.61h0c-.09,0-.07-.1,0-.16l1.41-1.34,3.89-3.71c.32-.3.58-.61.87-.91l2.23-2.37c.65-.69,1.3-1.39,2-2.08l.1-.09h.11a.13.13,0,0,1,.12,0V136.3l1.77.7,5.06,2,5.48,2.17,2,.82,5.45,2.27,1.83.77.2.09H77c-2-.12-4-.3-5.92-.52h0c-.19,0-.19,0-.26-.09h-.12L69,144.3a2.13,2.13,0,0,0,.31-.47.94.94,0,0,0,0-.47,1.09,1.09,0,0,0-.23-.47,2.38,2.38,0,0,0-.51-.44,5.4,5.4,0,0,0-.75-.4,9,9,0,0,0-1-.33,8.8,8.8,0,0,0-1.13-.26,18.7,18.7,0,0,0-4.29-.22A13.16,13.16,0,0,0,57.61,142Z\"/><path class=\"cls-1\" d=\"M55.86,124.6l-.25-.06-.2.2L51,129.45a13.48,13.48,0,0,1-1,1,13.48,13.48,0,0,0-1,1l-4.3,4.1-.11.1h-.07a9.14,9.14,0,0,1-2-2.54.57.57,0,0,1-.11-.28,12.06,12.06,0,0,0,4.42-1c.82-.41,1.23-.86,1.21-1.36,0-1.17-2.46-2.1-5.63-2.28v-.06A11.3,11.3,0,0,1,46.21,124a27.89,27.89,0,0,1,5-2.74,1.13,1.13,0,0,1,.45-.09l2.43-.17,2.16-.13,2.5-.15,2.51-.15,2.47-.15,2.13-.13c1.28-.08,2.54-.16,3.8-.26l4.43-.33,4.4-.33,4.68-.37h.55L56,124.57Z\"/><path class=\"cls-1\" d=\"M112.33,124.54l-.62-.13c-2.28-.43-4.49-.9-6.73-1.35l-6.74-1.37-6.71-1.37L84.79,119a2.37,2.37,0,0,0-.84,0l-4.12.31-4.43.34-4.61.35-2.94.22-1.84.11-2.53.16-2.48.15-2.47.15-2.51.15-2.5.15-1.76.11h-.11a45.41,45.41,0,0,1,5.9-2.2.85.85,0,0,1,.22.09,9.78,9.78,0,0,0,2.26.66,18.84,18.84,0,0,0,3.44.25c2.72,0,5.34-.74,6-1.79.34-.49.21-1-.36-1.45l-.13-.1a.53.53,0,0,1,.25,0c1-.14,2-.26,3.09-.37,1.55-.16,3.12-.29,4.72-.39,1-.06,1.92-.1,2.88-.14q1.08,0,2.16-.06h6.21l1.78.07h.4a.87.87,0,0,1,.39.07l1.26.53,6.07,2.53,3.42,1.45c.52.22,1.06.42,1.6.63l6.54,2.54,2.47,1,.19.07Z\"/><path class=\"cls-1\" d=\"M96.08,130.36l-4.78-2.88-.25-.13-.89-.34a.27.27,0,0,1-.12-.09H79.28l-1,.06h-.19l-.13.07-4.92,3-.21.15-.3.29h-.21l-.12.08.12.08,4.93,3,.25.13.9.38c.06,0,.11,0,.11.09H88.73l1.13-.07a3.21,3.21,0,0,1,.62,0l.13-.17,4.83-2.92.17-.08.47-.45a.3.3,0,0,1,.18-.08Zm-14.47-2.63a22.47,22.47,0,0,1,4.71-.07,16.07,16.07,0,0,1,3.44.65H78.88A13.27,13.27,0,0,1,81.61,127.73ZM81.25,133a11.65,11.65,0,0,1-3.83-1.12,2.42,2.42,0,0,1-1.19-1.15,1,1,0,0,1,0-.81h.07l5,3.08Zm5.23-1.76c-.23-.07-.46-.14-.66-.22s-.58-.19-.81-.3l-.41-.14-.34-.11-.21.07-.36.11a2.29,2.29,0,0,1-.37.12h-.08l-.45.23c-.3.1-.61.2-.88.31a3.66,3.66,0,0,1-.43.15c-.2,0-.29.12-.26.21h0a3.53,3.53,0,0,1-.65,0c-.14,0-.22-.09-.16-.15h0v-.06a.44.44,0,0,0,0-.32v-.24a.81.81,0,0,0,0-.22v-.35a.77.77,0,0,0,0-.37h0a1.28,1.28,0,0,0,0-.39h0a.48.48,0,0,0,0-.29.06.06,0,0,0,0-.06c-.07,0,0-.1,0-.15h.77a1.56,1.56,0,0,0,.47.17h.14a2.09,2.09,0,0,0,.35.13l.38.14.35.11a1.27,1.27,0,0,1,.32.13h.11a1.14,1.14,0,0,1,.25.06l.65.23a1.31,1.31,0,0,0,.27-.06l.31-.11H85a4.16,4.16,0,0,1,.62-.23h.06c.21-.1.53-.17.75-.27h.08c.25-.08.49-.16.73-.26H88v2.59c0,.06,0,.11-.19.16a3.68,3.68,0,0,1-.66-.06v-.1s0-.09-.12-.12a1.35,1.35,0,0,0-.34-.11l-.22-.14Zm4.85.55a9.2,9.2,0,0,1-2.77,1A11.61,11.61,0,0,1,87,133c.09-.09,3.65-2.22,5.13-3.07l.11-.06c.13.09.18.32.14.65a2,2,0,0,1-1.08,1.26Z\"/><path class=\"cls-1\" d=\"M106.08,114.63c-1.66-.27-3.36-.52-5.1-.73-2-.24-4-.45-6.14-.6l-2.66-.17c-.57,0-1.14-.06-1.72-.08l-2-.07h-8.8c-.9,0-1.8.06-2.7.11-1.22.06-2.43.14-3.63.23-2.66.21-5.26.48-7.8.84-1,.13-1.91.28-2.85.43-.06,0-.15,0-.16.06a21.78,21.78,0,0,1,4.9.41,9,9,0,0,1,3.41,1.3,119.75,119.75,0,0,1,27.16,0h.06l.12-.07a11.24,11.24,0,0,1,4.34-1.36,22.51,22.51,0,0,1,3.58-.23h.15Zm-26.47.47a.43.43,0,0,0-.22.06h-.46l-1.49.07h-.5s0-.1,0-.15h1.9v-.16l-.58-.39-.4-.26h-.06a.88.88,0,0,0-.27-.1c-.2,0-.17,0-.19.1l-.14.25c0,.1-.15.2-.16.31s-.08.1-.11.15,0,.12-.06.17a.44.44,0,0,1-.1.16l-.07.09a.3.3,0,0,1-.24,0h-.18c-.07,0-.11,0-.11-.06v-.07c.09-.15.18-.3.26-.45l.26-.5.27-.44a1,1,0,0,1,.07-.15l.08-.1h.1a.56.56,0,0,1,.4.07c.28.19.57.39.87.58s.33.23.5.34l.15.1.37.24a.69.69,0,0,1,.22.16S79.61,115.06,79.61,115.1Zm4.61-.17-.11.08a.55.55,0,0,1-.36,0h-.14l-.52-.18h-.15c-.13,0-.22.09-.33.13l-.24.1a1.18,1.18,0,0,1-.49.08l-.66-.23c-.34-.11-.65-.24-1-.34l-.16-.06H80c-.26,0-.32-.12-.3-.21h0l1.94-.87h.33l2.21.75v.11l-.73.31h0c.24.07.41.17.67.23.09,0,.1.07.08.1Zm3.88-1.24a6.93,6.93,0,0,1-.1.78,2.26,2.26,0,0,0,0,.52c0,.17-.1.1-.24.11s-.34,0-.34-.1v-.23a1.31,1.31,0,0,1,0-.28v-.25h0l-.46.43-.44.4h-.06c-.27,0-.42,0-.52-.08a1.88,1.88,0,0,1-.24-.25l-.31-.35-.27-.31c0-.06-.12-.12-.18-.18h0l-.23-.35s-.07-.07,0-.11a.34.34,0,0,1,.24-.06h.28l.35.4a3.45,3.45,0,0,1,.26.28,3.17,3.17,0,0,1,.34.39l.15.15h.06c.17-.16.32-.32.51-.47a3.3,3.3,0,0,0,.38-.37l.28-.26a.57.57,0,0,1,.19-.1H88c.17,0,.21,0,.21.09a.67.67,0,0,1,0,.2Zm3.62,1.54h-.8l-1.71-.08h-.08c-.15-.06,0-.13,0-.21a7.26,7.26,0,0,1,1.14.06,2.81,2.81,0,0,0,.71,0c.08,0,.09-.09.06-.14l-.17-.27h0c0-.17-.24-.33-.28-.5s-.08-.08-.19-.09a.46.46,0,0,0-.26.07l-.61.42-.38.27h-.07a1.55,1.55,0,0,1-.46.31.76.76,0,0,1-.3,0c-.15,0-.18-.07-.12-.12l.2-.15.21-.14.68-.46c.13-.1.25-.2.39-.29l.26-.19.28-.2.19-.1h.18c.14,0,.21,0,.24.09l.26.44c.09.15.18.31.28.46a1.49,1.49,0,0,1,.2.31c0,.12.18.24.22.36s-.07.06-.12.1Z\"/><path class=\"cls-1\" d=\"M55.79,119.35c-.89-.49-1.37-1-1.42-1.59a1.44,1.44,0,0,1,.52-1.12,3.78,3.78,0,0,1,.76-.55s.1,0,.06-.06a27.47,27.47,0,0,0-3,.77,57.45,57.45,0,0,0-8.92,3.2,27.52,27.52,0,0,0-6.29,3.89A10.37,10.37,0,0,0,34,128.78v.12l.67-.32.77-.29c.26-.08.55-.17.84-.24s.62-.15,1-.21l1-.17c.34,0,.7-.09,1.07-.12l1.08-.07h2.22l.12-.18a11.87,11.87,0,0,1,3.09-3.15,25.07,25.07,0,0,1,4.35-2.51c.74-.35,1.52-.68,2.34-1,1-.39,2-.75,3.1-1.1a.85.85,0,0,0,.22-.09Zm-13.5,6a.44.44,0,0,1-.24.11l-1-.14-2.94-.39h-.32c-.08,0-.1,0-.06-.08l.14-.11a3.47,3.47,0,0,0,.45.06l.54.07H39a1.2,1.2,0,0,0-.37-.15,1.76,1.76,0,0,1-.46-.06c-.15-.06-.09,0-.09-.06s.1-.09.2-.12a4.94,4.94,0,0,1,.86.11c.26,0,.44.13.46.24v.07l-.11.1.52.07H40c.09-.06.13-.13,0-.18a.89.89,0,0,0-.25-.14,4.11,4.11,0,0,0-.46-.15,2.66,2.66,0,0,0-.56-.12,2,2,0,0,0-.48-.06h-.07c0-.07.1-.14.27-.19h.16a8.19,8.19,0,0,1,1.29.26c.14.06.34.1.46.17h.09a.53.53,0,0,1,.2.13s.07.1,0,.15a.85.85,0,0,0-.14.19h.38l.84.11h.34c.12.06.14.09.11.12Zm2.11-1.7a.34.34,0,0,1-.2,0H44l-1.53-.26-.46-.06H42l.18.07c.26.06.48.15.72.23l.59.19.33.11h0a.37.37,0,0,1-.28.13H38.94c-.16,0-.23-.08-.15-.13l.14-.08h3.68l-1-.32-.8-.26-.64-.2L40,123l.16-.1a.81.81,0,0,1,.31,0l.66.11,2.75.44.37.06c.19,0,.25.1.15.17Zm1-.7-.7.45a2.18,2.18,0,0,1-.51,0l-.53-.1-1.8-.3-1.13-.22h-.24c0-.08,0-.08.18-.17,1.24.21,2.43.46,3.63.68.21,0,.11-.11.28-.13a1.16,1.16,0,0,1,.21-.16.83.83,0,0,1,.3-.14c.43,0,.5,0,.29.18Zm.89-.6h-2.5a.8.8,0,0,1-.43-.09l-.67-.5-.37-.26-.11-.09a.39.39,0,0,1,.26-.09l.32.07a.14.14,0,0,1,.09,0l.77.62a1.33,1.33,0,0,1,.19.14.45.45,0,0,0,.23,0h1.72l-.57-.51-.17.08a1.07,1.07,0,0,1-.32.16h0l-.37.22a.62.62,0,0,1-.38,0h-.15L44,122l1.1-.61h0a.81.81,0,0,1,.31,0,.26.26,0,0,1,.19.07l.18.19.07.06.11.08c.13.15.32.29.48.44h0c.14.09,0,.13-.18.16Zm3.15-1.46h-.11a.54.54,0,0,1-.18,0l-1.36-.36-.45-.1h0l.12.07c.39.18.72.37,1.11.55l.11.07c.11,0,.09.07,0,.11a.8.8,0,0,1-.3.06h-.2l-1.39-.15-.71-.13c-.44-.06-.91-.09-1.34-.15H44c-.18,0-.23-.09-.1-.14a.55.55,0,0,1,.18-.06l3.51.35h.1l-.47-.24-.91-.46-.54-.31a.18.18,0,0,1-.17-.12l.16-.07a.39.39,0,0,1,.26,0l.21.06,2.77.73.37.09h.09c.12.07.12.15,0,.2Zm2.32-.88H49.05c-.09.07,0,.13,0,.19l1,.32c0,.07-.07.11-.18.15a.73.73,0,0,1-.36,0L47.25,120l-.78-.24a.39.39,0,0,1-.22-.11l.14-.06H48.6l.21.07a.08.08,0,0,1,.08.06v0a.67.67,0,0,0,0,.2h0l2.67-.06c.37-.07.39,0,.17.12Z\"/><path class=\"cls-1\" d=\"M101.05,146a7.9,7.9,0,0,1-3-1.31h-.37c-1.29.15-2.6.27-3.93.38-.91.07-1.83.13-2.75.17-.6,0-1.2.06-1.8.09H79.79c-.53,0-1.3-.06-2-.09-1,0-2.1-.13-3.14-.21-1.25-.1-2.49-.23-3.72-.37h-.21l-.37.28-.45.27-.5.25c-.18.08-.38.16-.59.23s-.42.15-.63.21l-.72.19-.73.16-.81.13-.82.1-.86.08h-.66c1.58.26,3.21.47,4.86.67,1.91.22,3.86.4,5.83.53.83.06,1.67.11,2.5.15l1.88.09H89.24l2.58-.11c1.12-.06,2.22-.13,3.32-.22,2.66-.2,5.27-.47,7.83-.83.87-.12,1.72-.25,2.57-.39h.1A21.46,21.46,0,0,1,101.05,146Zm-30.8.21.79.29c.18.06.22.12.11.19l-.91.17-.92.17h-.27a1.28,1.28,0,0,1-.39,0c-.12,0-.17-.08-.12-.13h.1l.84-.15h.13l.56-.11h.26l-.13-.06-.84-.3h-.07c-.11,0-.14-.09,0-.15l.35-.06.88-.17.36-.06.46-.08h.18a.37.37,0,0,1,.32.06.2.2,0,0,1,0,.11l-.91.17c-.3.06-.62.1-.92.17a.49.49,0,0,0,.14-.11Zm5,.15-.83.44-.47.27-.45.24-.21.12-.24.12h-.26a.12.12,0,0,1-.13-.1,2.46,2.46,0,0,0-.15-.51,1.67,1.67,0,0,1-.08-.3h0a2.06,2.06,0,0,1-.12-.35c0-.12-.11-.24-.1-.36a.14.14,0,0,1,.06-.11.45.45,0,0,1,.23,0h.11l2,.17h.18c.12.08,0,.14-.06.21h-.41a3.12,3.12,0,0,1-.75-.06,2.58,2.58,0,0,0-.68,0c-.23,0-.12.09-.1.14s.06.19.1.29h0A1.91,1.91,0,0,1,73,147V147c0,.06,0,0,.16.12a.6.6,0,0,0,.29-.08l.68-.37h0a3.75,3.75,0,0,1,.44-.24,1,1,0,0,0,.18-.13.94.94,0,0,1,.22-.12l.2-.08a.32.32,0,0,1,.27,0,.31.31,0,0,1,.22.09l-.09.07-.31.16Zm3.36,1-1.64.43h0a1.32,1.32,0,0,1-.59-.11l-.91-.44c-.07,0,0-.07,0-.1h.15a.55.55,0,0,1,.36,0h.08l.57.28h.07l.18-.46.19-.42c.06-.12.11-.25.16-.37a1.19,1.19,0,0,1,.46,0c.08,0,.08.09.06.13l-.22.45-.09.24-.22.51h0l.45-.12c.18-.06.42-.08.58-.14h.11c.18,0,.33,0,.32.1a.1.1,0,0,1-.07-.08Zm2.72-.93-.78.23-.77.23L80,147l1,.23a.4.4,0,0,1,.18.07.14.14,0,0,1-.11.12l-1.52.45-.19.06a1.21,1.21,0,0,1-.38,0c-.11,0-.18,0-.19-.07a.06.06,0,0,1,0-.06l1.59-.46a.2.2,0,0,1-.16-.07l-1-.23-.2-.06v-.1l.32-.09.77-.22.32-.09.41-.12h.13a.53.53,0,0,1,.35,0h0Zm2.86.33v.51a2.32,2.32,0,0,1,0,.59.17.17,0,0,1-.1.13H81.5a.13.13,0,0,1,.09-.14h.07a9.68,9.68,0,0,1,.82-.54l.22-.16.75-.49a.17.17,0,0,0,.06-.06H81.79c-.13-.07-.13-.08-.09-.16h2.41a.09.09,0,0,1,0,.07c.06-.1,0,0,0,.15ZM86.73,148h-.25a.91.91,0,0,1-.33,0,.39.39,0,0,0-.26,0v-.07l-1.26-.41c-.06-.07,0-.13.15-.17s.54-.21.81-.31l.46-.16c.14,0,.16-.1.15-.16v-.28a1.28,1.28,0,0,1,.39,0c.16,0,.18.07.19.12s0,.3,0,.45l.09,1s-.07-.16-.17-.11Zm5.27-.19h-.47l-.67-.19-.67-.19-.7-.17-.38.16-1.14.5h-.55a.17.17,0,0,0,0-.1v-.09l-.31-1a1.35,1.35,0,0,0-.11-.34h0a.41.41,0,0,1,.24-.08h.28a.34.34,0,0,0,.21.14l.79.22.84.24h.09l.26-.09.59-.26.53-.24c.2-.09.2-.09.2-.19h.28c.14,0,.23,0,.26.06a.17.17,0,0,1,0,.1l.12.41c.08.26.16.53.25.8l.09.19H92Zm3.18-.2-1.81.13h-.31a1.55,1.55,0,0,1-.43,0c-.07,0-.07-.09,0-.13h0a4.43,4.43,0,0,1,.46-.61l.1-.15.41-.55v-.06a.71.71,0,0,0-.29,0l-1.4.1c-.18-.07-.18-.07-.18-.16L94,146h.27l.06.06.84,1.47h0Zm2.34-.22h-.39l-.52-.1-.3-.06-.82-.16a.25.25,0,0,1-.16-.1h.09a.55.55,0,0,1,.36,0H96l.79.16h0l-.4-.5-.32-.4-.24-.32a.9.9,0,0,1,.37-.07.26.26,0,0,1,.23.1c.09.15.25.29.32.44s.1.12.15.17l.44.57h.09a4,4,0,0,1,.49-.29l.08-.06a1,1,0,0,1,.35,0c.12,0,.16,0,.19.09Z\"/><path class=\"cls-1\" d=\"M42.61,133.51H39.86a18.11,18.11,0,0,1-4.5-.81,8.6,8.6,0,0,1-1.21-.51.22.22,0,0,0-.15-.06,6.79,6.79,0,0,0,1.1,2.47,17,17,0,0,0,5.33,4.72,45.44,45.44,0,0,0,9.36,4.12c1.5.49,4.31,1.29,4.87,1.38-.14-.14-.28-.27-.4-.4A1.16,1.16,0,0,1,54,144a3.15,3.15,0,0,1-.09-.42.93.93,0,0,1,.07-.43,1.54,1.54,0,0,1,.26-.42,2.22,2.22,0,0,1,.41-.4,4.28,4.28,0,0,1,.57-.37l.69-.35C49,139.39,44.61,136.7,42.61,133.51Zm-4.67,3.17a.49.49,0,0,1-.16-.16c.39-.26.79-.52,1.17-.8l-2.28-.41a.12.12,0,0,1-.12-.12.06.06,0,0,1,0,0l.71-.08,3.46-.4a1,1,0,0,1,.42,0s.08.09,0,.15h-.1a.48.48,0,0,0-.33.1l-.16.12c-.14.1-.28.2-.43.29s-.22.15-.32.22l-.08.06.33.06.77.14.87.15a1.19,1.19,0,0,0,.53,0c.14,0,.16.09.22.13a.33.33,0,0,1-.21.07l-1.13.13-.43.05-1.7.19a8,8,0,0,0-.84.11H38Zm1.2,1h-.06l-.79-.68c-.06,0-.07-.1,0-.15a1.21,1.21,0,0,1,.38,0h4.12c.06,0,0-.06,0-.08l-.59-.48a.79.79,0,0,1,.37-.1.16.16,0,0,1,.13.06l.81.67.1.1h-.12l-4,.59a1.82,1.82,0,0,1-.38.11Zm2.94,1-1.17-.14-.68-.07c-.21-.08-.2-.17-.09-.26a1.52,1.52,0,0,0,.22-.22l.26-.29a.46.46,0,0,1,.23-.06H41c.16,0,.23.06.18.11l-.34.35H41c.71-.14,1.42-.27,2.15-.39.36-.05.7-.12,1-.19a.59.59,0,0,1,.31.12.56.56,0,0,1-.28.1l-1.16.2a3.12,3.12,0,0,0-.69.13l-1.25.22h0l.64.07.64.08a.27.27,0,0,1,.08.07c0,.05-.07.1-.21.12Zm.37,1.15-.2-.12.54-.71a.87.87,0,0,1,.28-.05h.17l.65.06H44c.13-.18.25-.36.38-.53s.15-.21.22-.31.19-.09.36-.07a.46.46,0,0,1,.25.08c-.22.3-.45.6-.66.92H45l1.23-.25a.59.59,0,0,1,.4.16.62.62,0,0,1-.22.1l-3.49.72a1,1,0,0,1-.43,0Zm1.63.87a.88.88,0,0,1-.23,0c-.07,0-.11-.08,0-.13l.26-.16.44-.28a1.41,1.41,0,0,0,.24-.13,1.4,1.4,0,0,1,.24-.15l.7-.46a.35.35,0,0,1,.12-.07.77.77,0,0,1,.37,0h.1c0-.11.12-.13.46-.15.16.06,2.12,1,2.25,1.1s-.17.09-.34.11a.33.33,0,0,0-.25.08.66.66,0,0,1-.33.09,5.54,5.54,0,0,0-1,.06h0a6.89,6.89,0,0,0-1.11.06l-1.21,0h-.71Zm8,.87-.89.27-.77.24-1.28.39-.22.08h-.13a.38.38,0,0,1-.21,0l-.24-.1a6.5,6.5,0,0,0,.15-.9H46a1,1,0,0,1-.3-.13h.16l3.15-1h.13a.5.5,0,0,1,.34,0s.11,0,.1.1l-.23.06a6.07,6.07,0,0,1-.16.85h2.72a.73.73,0,0,1,.35.09.16.16,0,0,1-.12.12Z\"/><path class=\"cls-1\" d=\"M57.41,119l-1.37.41h-.11a3,3,0,0,1-1.32-1.14,1.15,1.15,0,0,1-.1-.87A2.78,2.78,0,0,1,56.08,116a.62.62,0,0,1,.26-.09c1.74-.4,3.54-.77,5.4-1.09h.41a22.07,22.07,0,0,1,4.52.28,10.2,10.2,0,0,1,3.94,1.27l.1.07c-.15,0-1.47.2-1.76.23a.38.38,0,0,1-.17-.08,9.5,9.5,0,0,0-3.61-1c-3.84-.45-7.72.36-8.58,1.66-.4.6-.15,1.17.72,1.7Z\"/><path class=\"cls-1\" d=\"M42.61,127.56v.06l-.3.57H41.9c-3.22-.08-6,.67-6.82,1.71-1,1.31,1.34,2.56,4.85,2.86.65,0,1.3.06,2,0h.42c.09.07.08.14.12.21a1.28,1.28,0,0,1,.11.2c0,.07.07.14.1.22h-.19a21.49,21.49,0,0,1-6.14-.58,8.77,8.77,0,0,1-2.29-.8c-.07,0-.13-.09-.14-.14s-.06-.34-.08-.51a4.18,4.18,0,0,1,0-1,4,4,0,0,1,.09-.84.8.8,0,0,1,.06-.37c.06-.12,0-.09.13-.14a12.51,12.51,0,0,1,4.82-1.35,27.26,27.26,0,0,1,3-.13h.64Z\"/><path class=\"cls-1\" d=\"M112.88,119.37l-1.42-.42a2.87,2.87,0,0,0,.66-.5,1.25,1.25,0,0,0,.31-.52.83.83,0,0,0,0-.54,1.23,1.23,0,0,0-.4-.53,3.14,3.14,0,0,0-.73-.47,6.14,6.14,0,0,0-1-.4,11.4,11.4,0,0,0-1.28-.32,17.18,17.18,0,0,0-5.06-.18,9.47,9.47,0,0,0-4,1.11l-.87-.11-.86-.1a.43.43,0,0,1,.12-.11,9.19,9.19,0,0,1,3-1.1,20.9,20.9,0,0,1,3.26-.41H107l2.29.43c1.1.21,2.17.45,3.22.69a1.74,1.74,0,0,1,.38.14,2.68,2.68,0,0,1,1.36,1.21c.31.73-.09,1.41-1.21,2Z\"/><path class=\"cls-1\" d=\"M68.87,144.38l1.6.21h.08l-.14.12q-1.8,1.35-6,1.71c-.42,0-.85.06-1.28.07h-.45c-2.66-.44-5.18-1-7.54-1.54a1,1,0,0,1-.28-.11,2.17,2.17,0,0,1-.73-.83,1,1,0,0,1-.11-.52c.06-.67.68-1.27,1.87-1.79H56c.48.12,1,.26,1.42.42l-.1.06a2.66,2.66,0,0,0-1.26,1,.89.89,0,0,0-.1.71c.2.74,1.48,1.46,3.61,1.83a18.19,18.19,0,0,0,2.34.24,15.67,15.67,0,0,0,5-.57,5.28,5.28,0,0,0,1.68-.79l.12-.1Z\"/><path class=\"cls-1\" d=\"M111.33,142.09l1.43-.42h.11a3.16,3.16,0,0,1,1.5,1.22,1,1,0,0,1,.1.81,2.1,2.1,0,0,1-1,1.15.94.94,0,0,1-.32.11c-1.86.45-3.79.86-5.81,1.22l-1,.18h-.47a19.92,19.92,0,0,1-5.38-.7,7.53,7.53,0,0,1-2.22-1s-.1,0-.09-.09l1.72-.22a9.34,9.34,0,0,0,4.63,1.33,18,18,0,0,0,4.86-.27c1.67-.36,2.72-.87,3.11-1.54S112.47,142.65,111.33,142.09Z\"/><path class=\"cls-1\" d=\"M98.12,125.52a3.12,3.12,0,0,0-.75.06H95.89l-.23-.06a37.51,37.51,0,0,0-6.81-1.2c-.93-.09-1.88-.15-2.84-.18s-1.61,0-2.42,0a43.72,43.72,0,0,0-4.44.25H79l.63-.61a.37.37,0,0,1,.23-.07c1.45-.08,2.9-.17,4.34-.27h.26l2.9.19,3.07.19L93,124a2.14,2.14,0,0,1,.43.07l4.46,1.37Z\"/><path class=\"cls-1\" d=\"M103.86,132.31l-.25-.1-1.15-.48c-.11,0-.14-.08-.11-.14a2.13,2.13,0,0,0,.2-1.29,3.4,3.4,0,0,0-1.28-2.06A13.19,13.19,0,0,0,96.89,126l-.19-.07h.23l1.7-.11h.16a.57.57,0,0,1,.26,0l1,.31a.65.65,0,0,1,.22.11l3.25,2.06.88.57c.06,0,.1.08.09.13l-.09.69-.09.71-.09.68a1.62,1.62,0,0,1-.07.58,2.28,2.28,0,0,0,0,.37A.71.71,0,0,1,103.86,132.31Z\"/><path class=\"cls-1\" d=\"M66.41,129a8.69,8.69,0,0,1-1.48-.61l.08-.07,3.32-2.15a.67.67,0,0,1,.23-.1l5.61-1.71,1-.3a2,2,0,0,1,.43-.07l1.37-.08,1.5-.1h.32l-.06.08-.63.58c-.1.1,0,.08-.32.12a34.11,34.11,0,0,0-5.3,1.08c-2.92.88-4.9,2-5.92,3.26C65,130.87,66.48,129,66.41,129Z\"/><path class=\"cls-1\" d=\"M64.51,128.68l.2.07,1.37.58c.1,0,.13.08.1.13a3,3,0,0,0-.27.82,2.62,2.62,0,0,0,0,.79,3.16,3.16,0,0,0,.7,1.36,10.6,10.6,0,0,0,4.44,2.64l.33.12h-.11l-1.25.07h-.63a1.21,1.21,0,0,1-.38,0l-.76-.2a.7.7,0,0,1-.28-.12l-1.85-1.5-1.51-1.21a.33.33,0,0,1-.13-.21,6.93,6.93,0,0,0-.1-.78,1.86,1.86,0,0,0-.07-.52c-.07-.17,0-.44-.07-.67a6.67,6.67,0,0,1-.13-1,.12.12,0,0,1,.08-.14Z\"/><path class=\"cls-1\" d=\"M89.79,137.25h0l.6-.58A32.26,32.26,0,0,0,98,134.88a8.76,8.76,0,0,0,4.16-2.87h.07l1.19.5h.13l-.07.07L100.61,135a.79.79,0,0,1-.28.13l-7,1.79a2.63,2.63,0,0,1-.39.06l-2.92.28Z\"/><path class=\"cls-1\" d=\"M89.43,136.75a3,3,0,0,1-.6.59h-.2l-4.12.39a3.38,3.38,0,0,1-.45,0l-6.51-.62-1.84-.1-.41-.07-5-1.27a.62.62,0,0,1-.19-.07c.68,0,1.35-.08,2-.12l.32.09a36.45,36.45,0,0,0,5.67,1.12c1.06.13,2.14.22,3.25.28s2.33.09,3.51.07c1.42,0,2.81-.09,4.18-.22h.22Z\"/><path class=\"cls-1\" d=\"M65.3,143.67l-.31-.09h-.2a1.85,1.85,0,0,0-.6-.2h-.11l-.2-.1c-.26-.09-.51-.18-.79-.26l-.3-.12h-.12c-.26-.09-.54-.17-.78-.27a1.66,1.66,0,0,0-.58-.11.32.32,0,0,0-.31.16h0l-.2.2-.2.13c-.08.09-.15.18-.23.26s-.12.1-.14.16-.1.09-.13.15-.15.13-.17.21h0a.18.18,0,0,0-.11.1l-.22.12a1.36,1.36,0,0,0-.24.24c-.09.14-.29.27-.38.41h-.06a.12.12,0,0,0,.09.11h.24l.42-.06h.47c.34,0,.65-.1,1-.12h1a5.59,5.59,0,0,0,1-.13,1,1,0,0,1,.24,0,7,7,0,0,0,.91-.09,1.34,1.34,0,0,1,.4,0h.1l.65-.08h.19c.17,0,.18-.1.19-.16A3.8,3.8,0,0,0,65.3,143.67Zm-.46.27H63.79l-.64.07h-.09a2.28,2.28,0,0,0-.69.07H62.3a.62.62,0,0,0-.33,0h-.56a3.05,3.05,0,0,0-.6.06H60.5c-.09,0-.15,0-.12-.06s.08-.07.1-.1a.31.31,0,0,1,.18-.25c.18-.08.11-.15.17-.23l.4-.56a.82.82,0,0,0,.12-.2l.14-.18.09-.08a.73.73,0,0,1,.35.09H62s.13,0,.15.06h0c.26.07.42.17.7.23l.2.08h.22a.23.23,0,0,0,.15.1.82.82,0,0,1,.26.1,1.59,1.59,0,0,0,.3.06.18.18,0,0,0,.13.09l.4.15h.25l.09.08.14.06A.77.77,0,0,1,64.84,143.94Z\"/><path class=\"cls-1\" d=\"M109,116.58a4.24,4.24,0,0,0-.5.18l-.27.09h-.69l.22-.06a.55.55,0,0,0,.15-.08h.21l.42-.16h0a.34.34,0,0,0-.28,0h-.11l-5,1.74a.49.49,0,0,0-.17.06l.34.11.24-.07.15-.06a1.2,1.2,0,0,1,.75,0l-.18.09a1.21,1.21,0,0,1-.3.11,1.71,1.71,0,0,0-.3.09.85.85,0,0,0,.31.13l.22-.07L109,117l.2-.07.15-.07A1,1,0,0,0,109,116.58Zm-1.71.58a.23.23,0,0,0-.12.06,1.74,1.74,0,0,0-.5.17l-.18.06a.85.85,0,0,0-.28.1.58.58,0,0,1-.22.08.67.67,0,0,0-.28.1.49.49,0,0,1-.23.08.19.19,0,0,0-.16.12,2.07,2.07,0,0,0-.42-.08h-.08l.24-.1.2-.06c.15,0,.28-.07.29-.14a1.33,1.33,0,0,0,.52-.13,1.6,1.6,0,0,1,.33-.11.4.4,0,0,0,.2-.09.64.64,0,0,1,.31-.07h.32C107.28,117.09,107.27,117.12,107.26,117.16Z\"/><path class=\"cls-1\" d=\"M89.79,136.64v-.09L91.47,135l4-3.81a1.16,1.16,0,0,1,.32-.2l.62-.37c.07,0,.12-.06.16,0s0,0,0,.06l-1,.91-5.23,4.93h0a.48.48,0,0,1-.2.07Z\"/><path class=\"cls-1\" d=\"M71.88,135.24l2.54-.15,2.53-.15,2.19-.13,2.53-.15,2.13-.13,2.54-.15,2.13-.13h1.71l-1.37.08-2.56.16-2.19.13-2.5.15-2.19.13-2.51.15-2.18.13-2.28.14a1.4,1.4,0,0,1-.29,0Z\"/><path class=\"cls-1\" d=\"M66.39,129.37l.11-.17a.62.62,0,0,1,.23.07l1.51.64,4.67,2,4.22,1.78.17.08.7.42h-.12l-.17-.07-6-2.53-5-2.11Z\"/><path class=\"cls-1\" d=\"M102,131.87l-.22-.09-7.12-3-3.21-1.35-.26-.13-.6-.36-.12-.08h.09l.25.1,2.59,1,6.4,2.7,2.14.89c.18.08.18.08.13.18Z\"/><path class=\"cls-1\" d=\"M78.26,126.79h.6l3-.18,3.21-.19,3.22-.19,3.2-.22,3.56-.21h.65a.49.49,0,0,1,.24,0,1,1,0,0,1,.27.1h-.42l-3.67.22-2.87.17-2.87.17-3.22.19-2.87.17h-2Z\"/><path class=\"cls-1\" d=\"M78.1,124.63h.51a.1.1,0,0,1-.07.09c-.31.31-.64.61-1,.91L72.91,130a4.09,4.09,0,0,1-.62.4h-.22l.79-.75L78,124.81Z\"/><path class=\"cls-1\" d=\"M98.61,125.57l1.54-.1,1.46-.09,1.54-.09,1.53-.09,1.51-.09,1.6-.11,1.53-.09,1.51-.09,1.54-.1c-.07-.07-.26-.1-.33-.17h.06l.62.11c.22,0,.3,0,.22.18h-.18l-2.12.16-2.21.14-2.51.15-2.28.12-2.54.15-1.84.11h-.09a1.09,1.09,0,0,1-.36,0Z\"/><path class=\"cls-1\" d=\"M79.54,123.71a3.53,3.53,0,0,1-.46,0,.08.08,0,0,1,.06-.08l2.06-2,2.7-2.55L84,119a.93.93,0,0,1,.41-.12h.13l-.06.07-4.85,4.67Z\"/><path class=\"cls-1\" d=\"M84.67,141.91h.12l-.54.12h-.2l.07-.09,1.45-1.41,3.22-3,.1-.09h.45l-4.72,4.45h0Z\"/><path class=\"cls-1\" d=\"M103.72,132.59a.7.7,0,0,1,.19-.15c.24.08.42.17.62.25l.57.24.59.25.57.24.59.25.59.24.58.24.59.25.57.24.59.25.59.25.57.24.59.25.58.24.59.25c.12,0,.1-.1.21-.13a.28.28,0,0,1,0,.28l-.27.06h-.09Z\"/><path class=\"cls-1\" d=\"M55.87,125l-.22.18h0v-.31h.26l.13,0,6.86,2.89,1.57.66.24.1a.6.6,0,0,1-.21.14l-.16-.06L61,127.24,56,125Z\"/><path class=\"cls-1\" d=\"M69.61,135.53l-13.38.8.06.08a.51.51,0,0,1-.3,0l-.32-.07h0l1.74-.1,2.27-.18,2.53-.15,2.58-.21,2.19-.13,1.82-.1a1.34,1.34,0,0,1,.69,0Z\"/><path class=\"cls-1\" d=\"M44.71,131l-.35-.11h-.08a.63.63,0,0,0-.35-.13h0l-.4-.16a2.23,2.23,0,0,1-.44-.13l-.52-.2h0a.63.63,0,0,1-.27-.1.39.39,0,0,0-.3.07,1.85,1.85,0,0,1-.33.21.93.93,0,0,0-.33.21h-.06c-.06,0-.17,0-.18.08s-.07.06-.11.09l-.14.1a.65.65,0,0,1-.43.09H40.1c-.29-.11-.64-.2-.89-.32h-.1l-.24-.07-1.08-.4-.24-.07c-.12,0-.14-.09-.1-.14a.21.21,0,0,1,.17-.07h.17l.79.28h.08l.34.13a4,4,0,0,1,.74.25h.12l.41.14h.12a1.82,1.82,0,0,0,.31-.16c.11-.08.26-.15.36-.22a4.33,4.33,0,0,1,.51-.31h0s.16-.09.27-.13a.45.45,0,0,1,.23,0l.23.07.4.16.14.05a.42.42,0,0,1,.24.07h.09c.22.06.39.13.58.2h.07a.37.37,0,0,1,.28.13,3.61,3.61,0,0,1,.84.28c.09,0,.06.07,0,.09A.55.55,0,0,1,44.71,131Z\"/><path class=\"cls-1\" d=\"M61.37,117.78a3.53,3.53,0,0,0,.65,0l.77-.07c.31,0,.62-.07.94-.09h.13a1.48,1.48,0,0,1,.42,0c.11,0,.2,0,.21.07a.81.81,0,0,1,0,.31h0v.16a1.6,1.6,0,0,1,0,.31h0c.06,0,0,.09,0,.13v.4c0,.12-.11.07-.22,0H64c0-.09-.06-.18,0-.27s0,0,0-.08a.2.2,0,0,1,0-.21v-.06a.19.19,0,0,1,0-.15.81.81,0,0,0,0-.31v-.15a.58.58,0,0,0-.32,0l-.69.08h-.2l-.4.06a2.41,2.41,0,0,1-.38,0h-.09l-.56.08a.89.89,0,0,1-.51,0v-.41h0v-.2a.67.67,0,0,1,0-.2V117a1.71,1.71,0,0,0,0-.32c0-.06,0-.1.18-.13a.49.49,0,0,1,.24,0c.08,0,.13,0,.13.06V117h0l.09.37v.09A1.75,1.75,0,0,0,61.37,117.78Z\"/><path class=\"cls-1\" d=\"M109.28,144.36a1.5,1.5,0,0,1-.42-.15h-.07a.62.62,0,0,1-.24-.08.38.38,0,0,0-.27-.08h-.11l-.29-.11c-.15-.07-.37-.11-.52-.17l-.26-.11h-.31a.32.32,0,0,0-.12-.08h-.21l-.33-.13a2.54,2.54,0,0,0-.47-.14l.17-.05h-.66l-.31-.1h-.07a1.47,1.47,0,0,0-.45-.14,2.85,2.85,0,0,1-.63.14c0,.08-.16.12-.32.16h-.11a1.07,1.07,0,0,0-.31.13h-.09a.36.36,0,0,0-.2.06.25.25,0,0,1-.17,0l-.16-.06a.75.75,0,0,1,.27-.39l.34-.13h.3c.33-.11.57-.24.92-.34a1.12,1.12,0,0,1,.48.07h.13c.38.17.92.29,1.32.46a8.36,8.36,0,0,0,1,.33l.84.31.22.06a2,2,0,0,0,.34.12l.22.09.26.08.14.06h.14a1.08,1.08,0,0,1,.3.11q.15,0,0,.09Z\"/><path class=\"cls-1\" d=\"M62.3,142.11c.23.07,4.24,1.47,4.37,1.53-.08.07-.08.07-.32.13l-.29-.07-.18-.07h-.09c-.07,0-.28-.1-.44-.14l-.24-.07c-.31-.13-.71-.23-1-.36a5.34,5.34,0,0,0-.52-.18l-.8-.27c-.08,0-.13-.06-.11-.1a.87.87,0,0,1-.32-.06,1.35,1.35,0,0,0-.34-.11c-.12,0-.13-.07,0-.12A1,1,0,0,1,62.3,142.11Z\"/><path class=\"cls-1\" d=\"M66.38,129.12l-.12.18h-.12l-1.46-.61h-.07l.19-.12h.1Z\"/><path class=\"cls-1\" d=\"M98.71,125.71l-2.23.13-.36-.1h.11l1.62-.1h.08A1.17,1.17,0,0,1,98.71,125.71Z\"/><path class=\"cls-1\" d=\"M103.61,132.52c-.17-.05-1.13-.45-1.41-.59l.09-.16h.11l1.34.56h0Z\"/><path class=\"cls-1\" d=\"M78.7,124.49a4,4,0,0,1-.49,0l.06-.07.61-.58a.4.4,0,0,1,.33-.1h.21l-.12.14c0,.05-.1.09-.15.14l-.15.14a.66.66,0,0,1-.15.14Z\"/><path class=\"cls-1\" d=\"M72,135.39l-1.39.08h-.54a.71.71,0,0,1-.29,0l-.31-.08a2.92,2.92,0,0,0,.72-.06h1.43A2.5,2.5,0,0,1,72,135.39Z\"/><path class=\"cls-1\" d=\"M90.14,136.67h0l-.6.57H89v-.06l.51-.48a.31.31,0,0,1,.23-.08A.5.5,0,0,0,90.14,136.67Z\"/><path class=\"cls-1\" d=\"M78.7,126.89a1.34,1.34,0,0,1-.4,0Z\"/><path class=\"cls-1\" d=\"M89.88,134.17h.36A2.16,2.16,0,0,1,89.88,134.17Z\"/><path class=\"cls-1\" d=\"M90.26,126.92a.29.29,0,0,1,.25.09A.54.54,0,0,1,90.26,126.92Z\"/><path class=\"cls-1\" d=\"M78.25,134.16a.5.5,0,0,1-.19-.1C78.27,134.12,78.27,134.12,78.25,134.16Z\"/><path class=\"cls-1\" d=\"M96.32,130.56l-.17.1C96.15,130.58,96.19,130.55,96.32,130.56Z\"/><path class=\"cls-1\" d=\"M83.61,130.29l-.34.13a4.72,4.72,0,0,1-.53.18l-.72.24-.64.24h-.1a.81.81,0,0,0,0-.22v-.24a1,1,0,0,1,0-.24V130a.9.9,0,0,0,0-.46.1.1,0,0,1,.07-.09C82.09,129.74,82.85,130,83.61,130.29Z\"/><path class=\"cls-1\" d=\"M87.21,131v.07h0l-.39-.15a1,1,0,0,1-.3-.1l-.17-.06a3.13,3.13,0,0,0-.52-.16,3.64,3.64,0,0,0-.72-.26l-.15-.06.19-.08.23-.08.16-.06.07-.06c.21-.08.46-.15.65-.24h.06a5.13,5.13,0,0,0,.72-.25h.1c.06,0,0,.07,0,.1a.17.17,0,0,1,0,.1h0a1.31,1.31,0,0,1,0,.28,2.8,2.8,0,0,0,0,.41.53.53,0,0,0,0,.25v.11A2.17,2.17,0,0,1,87.21,131Z\"/><path class=\"cls-1\" d=\"M89.32,128.26H84.64l-.37-.25h-.11l-.25.17H79.45a14.54,14.54,0,0,1,2.7-.47,20.8,20.8,0,0,1,2.62-.1,18.36,18.36,0,0,1,4.42.58Z\"/><path class=\"cls-1\" d=\"M84.42,128.25h-.29s0-.07.13-.09A.26.26,0,0,1,84.42,128.25Z\"/><path class=\"cls-1\" d=\"M91.92,131.2a3.63,3.63,0,0,1-1.39.93,11.61,11.61,0,0,1-2.29.69,8.17,8.17,0,0,0-.84.14c.1-.09,1.49-.93,1.91-1.15h.84c-.07-.1-.26-.17-.36-.27l.58-.35.6-.36.58-.34.62-.37h0A1.09,1.09,0,0,1,91.92,131.2Z\"/><path class=\"cls-1\" d=\"M89.9,131.74h-.45a.61.61,0,0,1,.22-.13A.76.76,0,0,1,89.9,131.74Z\"/><path class=\"cls-1\" d=\"M81,132.93h-.21a12.19,12.19,0,0,1-2.66-.73,3.12,3.12,0,0,1-1.73-1.36,1.25,1.25,0,0,1-.06-.61h0c.17.07,2.14,1.27,2.41,1.46l-.33.21h.69A10.49,10.49,0,0,1,81,132.93Z\"/><path class=\"cls-1\" d=\"M79.05,131.73a1.5,1.5,0,0,1-.3,0,.26.26,0,0,1,.16-.09C79,131.67,79,131.69,79.05,131.73Z\"/><path class=\"cls-1\" d=\"M81.61,114.22s0,.1.14.13a.62.62,0,0,1,.23.07h.12l.41.13h0c-.16.06-.29.13-.47.19a8.29,8.29,0,0,1-1.68-.56l.7-.29.67-.28h.19l1.5.51c-.12.08-.33.14-.49.22l-.58-.2-.27-.09a.28.28,0,0,0-.18,0A.46.46,0,0,0,81.61,114.22Z\"/><path class=\"cls-1\" d=\"M48.4,120a2,2,0,0,1-.57-.16l-.53-.17h1Z\"/><path class=\"cls-1\" d=\"M124.53,140.09h-1V140l-.12-.26h0A7.27,7.27,0,0,1,124.53,140.09Z\"/><path class=\"cls-1\" d=\"M126.22,139.16l-1,.09a.67.67,0,0,1-.23-.34C125.21,138.93,126,139.09,126.22,139.16Z\"/><path class=\"cls-1\" d=\"M128.08,138.3l-.53.37h-.21c-.54-.26-1.11-.51-1.62-.77h0a2.89,2.89,0,0,1,.5.08c.59.12,1.22.21,1.8.33Z\"/><path class=\"cls-1\" d=\"M91.34,147.37h-.06c-.49-.12-.93-.26-1.4-.39,0-.06.17-.1.26-.14l.64-.27a.62.62,0,0,1,.27-.09C91.15,146.79,91.24,147.08,91.34,147.37Z\"/><path class=\"cls-1\" d=\"M89,147a2.15,2.15,0,0,1-.46.22,1.87,1.87,0,0,1-.49.2h-.25l-.12-.38a1.94,1.94,0,0,0-.12-.39C88,146.74,88.51,146.86,89,147Z\"/><path class=\"cls-1\" d=\"M88,147.44l-.17.07h0S87.84,147.44,88,147.44Z\"/><path class=\"cls-1\" d=\"M83.55,147.24a3.55,3.55,0,0,1-.06.47H82.16v-.06l.55-.36.18-.13.57-.36h0A1.12,1.12,0,0,1,83.55,147.24Z\"/><path class=\"cls-1\" d=\"M94.61,147.35l-1.14.09h-.14v-.06s.23-.29.33-.44l.24-.32.12-.15h.08A3.88,3.88,0,0,1,94.61,147.35Z\"/><path class=\"cls-1\" d=\"M86.19,147.55a8.83,8.83,0,0,1-1-.3l.85-.31h0A1.31,1.31,0,0,1,86.19,147.55Z\"/><path class=\"cls-1\" d=\"M41.11,136.11h-.19l-2,.23h-.2a5.45,5.45,0,0,1,.84-.58,7.62,7.62,0,0,1,.81.14C40.65,135.94,40.85,136.06,41.11,136.11Z\"/><path class=\"cls-1\" d=\"M39.9,135.08l-.15.12a.72.72,0,0,1-.15.11,1.18,1.18,0,0,0-.19.11l-.15.11-.4-.06-.66-.12h-.3l.07-.08,2-.23C40.05,135,39.94,135,39.9,135.08Z\"/><polygon class=\"cls-1\" points=\"37.9 135.26 37.9 135.27 37.9 135.27 37.89 135.27 37.9 135.27 37.9 135.27 37.9 135.26\"/><path class=\"cls-1\" d=\"M51,141.66h0l-1.84.57h0a1.39,1.39,0,0,1,.08-.57Z\"/><path class=\"cls-1\" d=\"M48.68,140.78a1.09,1.09,0,0,1,0,.36.34.34,0,0,1-.06.24H47.15a.27.27,0,0,0-.07-.08,2.83,2.83,0,0,1,.41-.14l.41-.12.4-.13.41-.12Z\"/><path class=\"cls-1\" d=\"M47.61,140.27h-2.4a.14.14,0,0,1,.07-.11c.26-.18.47-.36.69-.54l.18-.14h.09A6.42,6.42,0,0,0,47.61,140.27Z\"/><path class=\"cls-1\" d=\"M41.92,137.14h-.13l-2.36.35h-.1l-.42-.34h3Z\"/><path class=\"cls-1\" d=\"M44.31,139.28l-1.29.26a2.8,2.8,0,0,1,.25-.35Z\"/></g></g><path class=\"cls-1\" d=\"M27.64,18.45l-2,1.66a14,14,0,0,1-3.86,2.63C23.75,21.26,25.69,19.82,27.64,18.45Z\"/><path class=\"cls-1\" d=\"M42.88,168l-.48-.27h.05Z\"/></g></g><path class=\"cls-1\" d=\"M15.23,137.1c2.29,4.18,6.77,13.73,9.6,17.51,1.06,1.42,4.16,1.3,6.33,1.88,0-2.25.94-5.36-.18-6.59-3.28-3.56-7.38-6.37-11.15-9.48C21.64,144,20.46,144.85,15.23,137.1Z\"/><path class=\"cls-1\" d=\"M165.79,132.79c-14.93,27.75-39.89,41.13-70.1,46.26l-.8.13C76.32,182.11,59.4,177,43,168.06l-.12-.06-.43-.27c-.7-.42-1.44-.86-2.23-1.31-1.48-.85-6.71-4.69-7-4.93.44.18,7.62,3.15,9,1.81s-1.71-3.13-2-3.31c.69.2,21.4,6.32,23,6.59a118.87,118.87,0,0,0,12.94.58c2.31-.07,4.62-.16,6.92-.29a111.89,111.89,0,0,0,20.69-2.93c27.29-6.86,47.84-24.62,54.71-53.21,7.21-30-3-55.59-25.83-75.49-27.4-23.89-66.2-25.19-95.84-4.46-.89.63-1.76,1.3-2.67,2-.14,1.4.52,2.71,2.67,3.84a2.39,2.39,0,0,1,1.34,3.17,3.19,3.19,0,0,1-1.36,1.37q-8.13,4.52-16.32,8.92Q13.79,53.69,7.1,57.19c-2.43,1.27-4.29.09-3.52-2.7l.07-.25C6.57,43.48,9.18,32.6,13,22.13c.54-1.46,1.25-2,1.91-2.14a2.37,2.37,0,0,1,2,.73c1.78,2.22,3.36,2.55,4.86,2a14,14,0,0,0,3.86-2.63l2-1.66c1-.68,1.92-1.34,2.9-2a90,90,0,0,1,43.33-15c1.67-.13,3.29-1,4.92-1.5h4.65c5.74,1,11.48,2,17.21,3.06C159.64,14,193.56,81.15,165.79,132.79Z\"/><path class=\"cls-1\" d=\"M1.22,113.43c.94,4,2.44,13.08,3.92,16.9.55,1.43,3.18,2.07,4.86,3.07.52-1.89,2-4.27,1.39-5.56-1.9-3.75-4.67-7.07-7.1-10.56C5,120.74,3.78,121.13,1.22,113.43Z\"/><path class=\"cls-1\" d=\"M.88,82.13C.69,85.35-.21,92.44,0,95.63.14,96.82,2,97.88,3,99c.81-1.29,2.48-2.73,2.28-3.84-.58-3.23-1.91-6.32-2.95-9.47C2.05,88.42,1.07,88.45.88,82.13Z\"/></g></g></svg>";


const DOMAIN_CARD_BACKGROUND_ASSETS = {
  oscuridad: 'assets/card-bg-darkness.jpg',
  luz: 'assets/card-bg-light-domain.webp',
  fuego: 'assets/card-bg-fire-domain.webp',
};

const ELEMENTS = [
  { id: 'oscuridad', label: 'Oscuridad', color: '#9b4dff' },
  { id: 'luz', label: 'Luz', color: '#c9a64a' },
  { id: 'fuego', label: 'Fuego', color: '#ff5a1f' },
  { id: 'agua', label: 'Agua', color: '#28d7ff' },
  { id: 'tierra', label: 'Tierra', color: '#7cb342' },
];

const DOMAIN_THEME_DB = {
  oscuridad: {
    id: 'oscuridad',
    label: 'Oscuridad',
    attributeId: 'misterio',
    attributeLabel: 'Misterio',
    primary: '#050208',
    secondary: '#9b4dff',
    accent: '#caa7ff',
    glow: 'rgba(155,77,255,.62)',
    costIcon: 'assets/cost-icons/cost-darkness.png',
    skinImage: 'assets/card-skin-darkness.png',
    bgImage: 'assets/element-card-bg.webp',
  },
  luz: {
    id: 'luz',
    label: 'Luz',
    attributeId: 'revelacion',
    attributeLabel: 'Revelación',
    primary: '#fff7df',
    secondary: '#c9a64a',
    accent: '#e0c16a',
    glow: 'rgba(201,166,74,.72)',
    costIcon: 'assets/cost-icons/cost-light.png',
    skinImage: 'assets/card-skin-light.png',
    bgImage: 'assets/domain/domain-element-light.webp',
    elementArt: 'assets/domain/domain-element-light.webp',
    attributeArt: 'assets/domain/domain-attribute-revelation.png',
  },
  fuego: {
    id: 'fuego',
    label: 'Fuego',
    attributeId: 'destruccion',
    attributeLabel: 'Destrucción',
    primary: '#2a0500',
    secondary: '#ff5a1f',
    accent: '#ff9b1f',
    glow: 'rgba(255,90,31,.62)',
    costIcon: 'assets/cost-icons/cost-fire.png',
    skinImage: 'assets/card-skin-fire.png',
    bgImage: 'assets/domain/domain-element-fire.png',
    elementArt: 'assets/domain/domain-element-fire.png',
    attributeArt: 'assets/domain/domain-attribute-destruction.svg',
  },
};

const CASTER_VISUAL_ASSET_DB = {
  hanzoDark: {
    id: 'hanzoDark',
    name: 'Hattori Hanzo',
    domainId: 'oscuridad',
    cardId: 'kasterHanzoDark',
    artImage: 'assets/caster-hanzo.png',
    tokenImage: 'assets/caster-hanzo.png',
  },
  tokugawaLight: {
    id: 'tokugawaLight',
    name: 'Ieyasu Tokugawa',
    domainId: 'luz',
    cardId: 'kasterTokugawaLight',
    artImage: 'assets/tokugawa-light-art.webp',
    tokenImage: 'assets/tokugawa-light-token.webp',
  },
};

const CASTER_LIBRARY = {
  hanzoDark: {
    id: 'hanzoDark',
    cardId: 'kasterHanzoDark',
    name: 'Hattori Hanzo',
    title: 'Kaster de Oscuridad',
    domainId: 'oscuridad',
    attributeId: 'misterio',
    attributeLabel: 'Misterio',
    artImage: 'assets/caster-hanzo.png',
    tokenImage: 'assets/caster-hanzo.png',
    stats: { atk: 4, def: 2, life: 30, maxLife: 30, mov: TEST_CASTER_MOVE_SPEED },
  },
  tokugawaLight: {
    id: 'tokugawaLight',
    cardId: 'kasterTokugawaLight',
    name: 'Ieyasu Tokugawa',
    title: 'Kaster de Luz',
    domainId: 'luz',
    attributeId: 'revelacion',
    attributeLabel: 'Revelación',
    artImage: 'assets/tokugawa-light-art.webp',
    tokenImage: 'assets/tokugawa-light-token.webp',
    stats: { atk: 4, def: 2, life: 30, maxLife: 30, mov: TEST_CASTER_MOVE_SPEED },
  },
};

function getCasterDefinition(caster) {
  if (!caster) return null;
  if (caster.casterId && CASTER_LIBRARY[caster.casterId]) return CASTER_LIBRARY[caster.casterId];
  if (caster.cardId) {
    return Object.values(CASTER_LIBRARY).find(item => item.cardId === caster.cardId) || null;
  }
  return null;
}

function getCasterDisplayName(caster, fallback = 'Kaster') {
  return getCasterDefinition(caster)?.name || caster?.name || fallback;
}

function getCasterArtImage(caster, fallback = 'assets/caster-hanzo.png') {
  return getCasterDefinition(caster)?.artImage || caster?.artImage || fallback;
}

function getCasterTokenImage(caster, fallback = 'assets/caster-hanzo.png') {
  return getCasterDefinition(caster)?.tokenImage || caster?.tokenImage || fallback;
}

function getDomainTheme(domainId, fallbackId = 'oscuridad') {
  return DOMAIN_THEME_DB[domainId] || DOMAIN_THEME_DB[fallbackId] || DOMAIN_THEME_DB.oscuridad;
}

function getCasterDomainId(caster) {
  return caster?.domainId || caster?.elementId || null;
}

function getPlayerDomainId(playerId) {
  const player = state?.players?.[playerId];
  return getCasterDomainId(player?.caster) || player?.domainId || player?.elementId || 'oscuridad';
}

function getPlayerDomainTheme(playerId) {
  return getDomainTheme(getPlayerDomainId(playerId));
}

const GUARDIAN_DOMAIN_ASSETS = {
  oscuridad: 'assets/guardian-darkness.png',
  luz: 'assets/guardian-light.webp',
};

function getGuardianAssetForPlayer(playerId) {
  const domainId = getPlayerDomainId(playerId);
  return GUARDIAN_DOMAIN_ASSETS[domainId] || GUARDIAN_DOMAIN_ASSETS.oscuridad;
}


const RANDOM_COST_ICON_ASSET = 'assets/cost-icons/cost-random.png';

const ELEMENT_COST_ICON_ASSETS = {
  oscuridad: 'assets/cost-icons/cost-darkness.png',
  luz: 'assets/cost-icons/cost-light.png',
  fuego: 'assets/cost-icons/cost-fire.png',
  agua: 'assets/cost-icons/cost-water.png',
  tierra: 'assets/cost-icons/cost-earth.png',
  random: RANDOM_COST_ICON_ASSET,
};

function getElementCostIcon(elementId) {
  return ELEMENT_COST_ICON_ASSETS[elementId] || ELEMENT_COST_ICON_ASSETS.oscuridad;
}

const EXTRACTION_CARDS_PER_PHASE = 3;
const ELEMENT_PRIMARY_RATIO_DUAL = 0.6;

const EXTRACTION_DEFS = [
  { id: 'x1', count: 1, deckCopies: 60, artImage: 'assets/element-x1.png', bgImage: 'assets/element-card-bg.webp', skinImage: 'assets/card-skin-darkness.png' },
];

const ELEMENT_EXTRACTION_ASSETS = {
  oscuridad: {
    bgImage: 'assets/element-card-bg.webp',
    skinImage: 'assets/card-skin-darkness.png',
    arts: {
      x1: 'assets/element-darkness-x1.png',
      x2: 'assets/element-darkness-x2.webp',
      x3: 'assets/element-darkness-x3.webp',
      x4: 'assets/element-darkness-x4.png',
    },
  },
  luz: {
    bgImage: 'assets/element-card-bg.webp',
    skinImage: 'assets/card-skin-light.png',
    arts: {
      x1: 'assets/element-light-x1.png',
      x2: 'assets/element-light-x2.webp',
      x3: 'assets/element-light-x3.webp',
      x4: 'assets/element-light-x4.webp',
    },
  },
  fuego: {
    bgImage: 'assets/element-card-bg-fire.png',
    skinImage: 'assets/card-skin-fire.png',
    arts: {
      x1: 'assets/element-fire-x1.png',
      x2: 'assets/element-fire-x2.png',
      x3: 'assets/element-fire-x3.webp',
      x4: 'assets/element-fire-x4.png',
    },
  },
  agua: {
    bgImage: 'assets/element-card-bg.webp',
    skinImage: 'assets/card-skin-water.png',
    arts: {
      x1: 'assets/element-water-x1.png',
      x2: 'assets/element-water-x2.png',
      x3: 'assets/element-water-x3.png',
      x4: 'assets/element-water-x4.webp',
    },
  },
  tierra: {
    bgImage: 'assets/element-card-bg.webp',
    skinImage: 'assets/card-skin-earth.png',
    arts: {
      x1: 'assets/element-earth-x1.png',
      x2: 'assets/element-earth-x2.png',
      x3: 'assets/element-earth-x3.webp',
      x4: 'assets/element-earth-x4.webp',
    },
  },
};

const ELEMENT_DECK_CONFIGS = {
  oscuridad: { primary: 'oscuridad', secondary: 'agua', primaryRatio: ELEMENT_PRIMARY_RATIO_DUAL },
  luz: { primary: 'luz', secondary: 'fuego', primaryRatio: ELEMENT_PRIMARY_RATIO_DUAL },
  fuego: { primary: 'fuego', secondary: 'tierra', primaryRatio: ELEMENT_PRIMARY_RATIO_DUAL },
  agua: { primary: 'agua', secondary: 'oscuridad', primaryRatio: ELEMENT_PRIMARY_RATIO_DUAL },
  tierra: { primary: 'tierra', secondary: 'fuego', primaryRatio: ELEMENT_PRIMARY_RATIO_DUAL },
};


const WEAPON_DB = {
  golpe: {
    id: "golpe",
    label: "Golpe",
    slug: "golpe",
    icon: "assets/weapons/ataque-golpe.svg",
    category: "ataque nativo",
    summary: "Ataque nativo cuerpo a cuerpo de alcance 1 y precisión total que garantiza Confusión 1 al impactar.",
    description: "Ataque nativo básico de cuerpo a cuerpo. Se usa como referencia general para ataques de contacto, tiene alcance 1, precisión 100% y garantiza Confusión 1 al impactar. Su función es ofrecer una ofensiva simple, estable y segura para invocaciones que no dependen de un arma especializada.",
    consumableDefault: false,
    canBeConsumable: true,
    tags: ["ataque", "nativo", "arma", "cuerpo a cuerpo", "alcance"],
  },
  mordida: {
    id: "mordida",
    label: "Mordida",
    slug: "mordida",
    icon: "assets/weapons/ataque-mordida.svg",
    category: "ataque nativo",
    summary: "Ataque nativo de alcance 1 y precisión total que garantiza Veneno 1 o Infección 1.",
    description: "Ataque nativo de cuerpo a cuerpo enfocado en agresión biológica y daño por contacto. Tiene alcance 1, precisión 100% y garantiza Veneno 1 o Infección 1 al impactar. Destaca por convertir un ataque cercano en presión progresiva sobre el objetivo.",
    consumableDefault: false,
    canBeConsumable: true,
    tags: ["ataque", "nativo", "cuerpo a cuerpo", "alcance", "daño"],
  },
  colazo: {
    id: "colazo",
    label: "Colazo",
    slug: "colazo",
    icon: "assets/weapons/ataque-colazo.svg",
    category: "ataque nativo",
    summary: "Ataque nativo de impacto fuerte enfocado en control o remate, capaz de garantizar Aturdimiento 1 o Letalidad 1.",
    description: "Ataque nativo de impacto pesado orientado al control y al castigo físico. Su identidad se centra en asegurar Aturdimiento 1 o Letalidad 1 al impactar, por lo que funciona como una forma de presión contundente para invocaciones con fuerza bruta o gran masa corporal.",
    consumableDefault: false,
    canBeConsumable: true,
    tags: ["ataque", "nativo", "control"],
  },
  magia: {
    id: "magia",
    label: "Magia",
    slug: "magia",
    icon: "assets/weapons/ataque-magia.svg",
    category: "ataque nativo",
    summary: "Ataque nativo mágico de alcance 2 a 4 y precisión total que puede aplicar daño de área o salpicadura.",
    description: "Ataque nativo mágico que hereda daño mágico del usuario y permite variantes ofensivas de área, salpicadura cónica, horizontal o en X. Maneja alcance entre 2 y 4 con precisión 100%, por lo que funciona como un ataque técnico de media distancia con alta estabilidad y versatilidad de daño.",
    consumableDefault: false,
    canBeConsumable: true,
    tags: ["ataque", "nativo", "alcance", "área", "daño"],
  },
  garras: {
    id: "garras",
    label: "Garras",
    slug: "garras",
    icon: "assets/weapons/ataque-garras.svg",
    category: "ataque nativo",
    summary: "Ataque nativo cuerpo a cuerpo que castiga objetivos sin protección con estados biológicos y gana Evadir frente a escudos o armaduras.",
    description: "Ataque nativo de cuerpo a cuerpo basado en desgarro y castigo biológico. Tiene alcance 1 y precisión 100%. Si el objetivo no tiene escudo ni armadura, puede aplicar Envenenamiento, Virus o Infección; si el objetivo sí tiene protección, no aplica daño y en su lugar la invocación obtiene Evadir hasta morir o restaurarse.",
    consumableDefault: false,
    canBeConsumable: true,
    tags: ["ataque", "nativo", "arma", "cuerpo a cuerpo", "alcance", "daño"],
  },
  elemental: {
    id: "elemental",
    label: "Elemental",
    slug: "elemental",
    icon: "assets/weapons/ataque-elemental.svg",
    category: "ataque nativo",
    summary: "Ataque nativo elemental de alcance 2 a 4 que ignora defensas comunes, aplica estado elemental garantizado y gana Crítico 2 contra debilidades.",
    description: "Ataque nativo elemental que ignora escudos y armaduras físicas o mágicas al momento de resolver el daño. Puede aplicar daño de área o salpicadura con alcance entre 2 y 4 y precisión 100%. Además, garantiza un estado elemental según el dominio de la invocación y obtiene Crítico 2 contra objetivos débiles a ese elemento.",
    consumableDefault: false,
    canBeConsumable: true,
    tags: ["ataque", "nativo", "arma", "alcance", "área", "daño"],
  },
  picadura: {
    id: "picadura",
    label: "Picadura",
    slug: "picadura",
    icon: "assets/weapons/ataque-picadura.svg",
    category: "ataque nativo",
    summary: "Ataque nativo de alcance 1 que castiga objetivos sin protección con estados y, frente a defensas, prioriza evasión y supervivencia.",
    description: "Ataque nativo de cuerpo a cuerpo orientado a perforación y castigo especializado. Tiene alcance 1 y precisión 100%. Contra objetivos sin escudo ni armadura puede aplicar Envenenamiento o Aturdimiento; si el objetivo está protegido, no aplica daño, la invocación no puede ser seleccionada como objetivo y además puede desarrollar Muerte lenta.",
    consumableDefault: false,
    canBeConsumable: true,
    tags: ["ataque", "nativo", "arma", "cuerpo a cuerpo", "alcance", "daño"],
  },
  lanza: {
    id: "lanza",
    label: "Lanza",
    slug: "lanza",
    icon: "assets/weapons/ataque-lanza.svg",
    category: "arma",
    summary: "Arma cc de alcance 1 a 3 y precisión 4, orientada a oscilación parcial o completa.",
    description: "Arma de cuerpo a cuerpo enfocada en presión frontal y barrido corto. Maneja alcance entre 1 y 3, precisión 4 y acceso a daño de oscilación parcial o completa. Su función es extender el rango del combate cercano y permitir golpes amplios sobre varios objetivos dentro del radio de ataque.",
    consumableDefault: false,
    canBeConsumable: true,
    tags: ["ataque", "arma", "cuerpo a cuerpo", "alcance", "oscilación", "precisión media", "daño"],
  },
  pirotecnia: {
    id: "pirotecnia",
    label: "Pirotecnia",
    slug: "pirotecnia",
    icon: "assets/weapons/ataque-explosivos.svg",
    category: "arma",
    summary: "Arma de alcance 2 a 7 y precisión 3, especializada en daño explosivo y salpicaduras.",
    description: "Arma de alcance enfocada en explosión y cobertura ofensiva. Maneja alcance entre 2 y 7, precisión 3 y acceso a daño de área, salpicadura cónica, horizontal o en X. Destaca por ejercer presión a distancia sobre zonas amplias en lugar de depender de un solo objetivo.",
    consumableDefault: false,
    canBeConsumable: true,
    tags: ["ataque", "arma", "alcance", "área", "precisión media", "daño"],
  },
  espada: {
    id: "espada",
    label: "Espada",
    slug: "espada",
    icon: "assets/weapons/ataque-espada.svg",
    category: "ataque nativo",
    summary: "Arma cc de alcance 1 a 2 y precisión 6, estable y sin efecto adicional nativo.",
    description: "Arma de cuerpo a cuerpo equilibrada y directa. Maneja alcance entre 1 y 2, precisión 6 y no trae un efecto de daño adicional nativo. Su función es ofrecer un perfil ofensivo estable, confiable y flexible para combate cercano sin depender de efectos secundarios.",
    consumableDefault: false,
    canBeConsumable: true,
    tags: ["ataque", "nativo", "arma", "cuerpo a cuerpo", "alcance", "precisión alta", "daño"],
  },
  dagas: {
    id: "dagas",
    label: "Dagas",
    slug: "dagas",
    icon: "assets/weapons/ataque-daga.svg",
    category: "ataque nativo",
    summary: "Arma cc de alcance 1 y precisión 6, enfocada en contacto directo sin efecto adicional nativo.",
    description: "Arma de cuerpo a cuerpo corta y precisa. Maneja alcance 1, precisión 6 y no incorpora un efecto de daño adicional nativo. Su identidad se asocia a ofensiva directa, rapidez de contacto y presión cercana sin extensión de área.",
    consumableDefault: false,
    canBeConsumable: true,
    tags: ["ataque", "nativo", "arma", "cuerpo a cuerpo", "alcance", "área", "precisión alta", "daño"],
  },
  cadena: {
    id: "cadena",
    label: "Cadena",
    slug: "cadena",
    icon: "assets/weapons/ataque-arma-con-cadena.svg",
    category: "arma",
    summary: "Arma de alcance 3 a 5 y precisión 6, con daño básico y oscilación parcial o completa.",
    description: "Arma de alcance con enfoque de daño básico. Maneja alcance entre 3 y 5, precisión 6 y acceso a oscilación parcial o completa. Su función es controlar una franja amplia del espacio desde media distancia con golpes que pueden barrer varias casillas.",
    consumableDefault: false,
    canBeConsumable: true,
    tags: ["ataque", "arma", "alcance", "oscilación", "precisión alta", "control", "daño"],
  },
  armaConCadena: {
    id: "armaConCadena",
    label: "Cadena con arma",
    slug: "cadena-con-arma",
    icon: "assets/weapons/ataque-arma-con-cadena.svg",
    category: "arma",
    summary: "Arma de alcance 3 a 5 y precisión 6, orientada a barrido con oscilación parcial o completa.",
    description: "Arma de alcance basada en una cadena rematada con un cabezal ofensivo. Maneja alcance entre 3 y 5, precisión 6 y acceso a oscilación parcial o completa. Destaca por combinar control espacial con un patrón de barrido flexible desde media distancia.",
    consumableDefault: false,
    canBeConsumable: true,
    tags: ["ataque", "arma", "alcance", "oscilación", "precisión alta", "control"],
  },
  armaDeFuego: {
    id: "armaDeFuego",
    label: "Arma de fuego",
    slug: "arma-de-fuego",
    icon: "assets/weapons/ataque-arma-de-fuego.svg",
    category: "arma",
    summary: "Arma de alcance largo y precisión 4, capaz de aplicar área, salpicaduras y penetración.",
    description: "Arma de alcance orientada a presión lejana y trayectorias ofensivas complejas. Maneja alcance desde 4 en adelante, precisión 4 y acceso a daño de área, salpicadura cónica, horizontal, en X y penetración. Su perfil prioriza castigo a distancia con múltiples formas de resolver el impacto.",
    consumableDefault: false,
    canBeConsumable: true,
    tags: ["ataque", "arma", "alcance", "área", "penetración", "precisión media", "daño"],
  },
  arco: {
    id: "arco",
    label: "Arco",
    slug: "arco",
    icon: "assets/weapons/ataque-arco.svg",
    category: "arma",
    summary: "Arma de alcance 3 a 10 y precisión 4, versátil en área, salpicaduras y penetración.",
    description: "Arma de alcance enfocada en hostigamiento técnico y cobertura de línea. Maneja alcance entre 3 y 10, precisión 4 y acceso a daño de área, salpicadura cónica, horizontal, en X y penetración. Permite castigar desde lejos con trayectorias y patrones de impacto variados.",
    consumableDefault: false,
    canBeConsumable: true,
    tags: ["ataque", "arma", "alcance", "área", "penetración", "precisión media", "daño"],
  },
  mazo: {
    id: "mazo",
    label: "Mazo",
    slug: "mazo",
    icon: "assets/weapons/ataque-mazo.svg",
    category: "arma",
    summary: "Arma cc pesada de alcance 1 a 2 y precisión 6, con área u oscilación.",
    description: "Arma de cuerpo a cuerpo pesada orientada a impacto amplio. Maneja alcance entre 1 y 2, precisión 6 y acceso a daño de área, oscilación parcial u oscilación completa. Su función es golpear con fuerza en radios cortos y castigar agrupaciones cercanas.",
    consumableDefault: false,
    canBeConsumable: true,
    tags: ["ataque", "arma", "cuerpo a cuerpo", "alcance", "área", "oscilación", "precisión alta", "daño"],
  },
  hacha: {
    id: "hacha",
    label: "Hacha",
    slug: "hacha",
    icon: "assets/weapons/ataque-hacha.svg",
    category: "arma",
    summary: "Arma cc de alcance 1 a 2 y precisión 6, enfocada en oscilación parcial o completa.",
    description: "Arma de cuerpo a cuerpo ofensiva centrada en barrido y corte contundente. Maneja alcance entre 1 y 2, precisión 6 y acceso a oscilación parcial o completa. Funciona bien para presión frontal y daño extendido sobre varios objetivos en radio corto.",
    consumableDefault: false,
    canBeConsumable: true,
    tags: ["ataque", "arma", "cuerpo a cuerpo", "alcance", "oscilación", "precisión alta", "daño"],
  },
  latigo: {
    id: "latigo",
    label: "Látigo",
    slug: "latigo",
    icon: "assets/weapons/ataque-latigo.svg",
    category: "ataque nativo",
    summary: "Arma de alcance 1 a 4 y precisión 6, flexible y sin efecto adicional nativo.",
    description: "Arma de alcance flexible orientada al control de distancia. Maneja alcance entre 1 y 4, precisión 6 y no incorpora un efecto de daño adicional nativo. Su valor está en extender el radio de contacto sin perder estabilidad de precisión.",
    consumableDefault: false,
    canBeConsumable: true,
    tags: ["ataque", "nativo", "arma", "alcance", "precisión alta", "control", "daño"],
  },
  canon: {
    id: "canon",
    label: "Cañón",
    slug: "canon",
    icon: "assets/weapons/ataque-canon.svg",
    category: "arma",
    summary: "Arma de alcance 1 a 5 y precisión 2, centrada en daño de área pesado.",
    description: "Arma de alcance pesada especializada en daño de área. Maneja alcance entre 1 y 5, precisión 2 y prioriza impacto zonal por encima de la precisión individual. Está pensada para presión masiva, castigo de agrupaciones y daño explosivo desde distancia media.",
    consumableDefault: false,
    canBeConsumable: true,
    tags: ["ataque", "arma", "alcance", "área", "precisión baja", "daño"],
  },
  armaArrojadiza: {
    id: "armaArrojadiza",
    label: "Arma arrojadiza",
    slug: "arma-arrojadiza",
    icon: "assets/weapons/ataque-arma-arrojadiza.svg",
    category: "arma",
    summary: "Arma de alcance 1 a 2 y precisión 3, pensada para impacto rápido con área básica.",
    description: "Arma de alcance corto orientada a impacto rápido con cobertura básica de área. Maneja alcance entre 1 y 2, precisión 3 y acceso a daño de área. Su función es ofrecer una opción de lanzamiento breve con presión inmediata y resolución simple.",
    consumableDefault: false,
    canBeConsumable: true,
    tags: ["ataque", "arma", "alcance", "área", "precisión media", "daño"],
  },
  aros: {
    id: "aros",
    label: "Aros",
    slug: "aros",
    icon: "assets/weapons/ataque-arma-arrojadiza.svg",
    category: "ataque nativo",
    summary: "Arma cc de alcance 1 y precisión 6, técnica y sin efecto adicional nativo.",
    description: "Arma de cuerpo a cuerpo corta y precisa. Maneja alcance 1, precisión 6 y no incorpora un efecto de daño adicional nativo. Su identidad está en el contacto directo y el uso técnico del espacio cercano sin patrones de daño extendido.",
    consumableDefault: false,
    canBeConsumable: true,
    tags: ["ataque", "nativo", "arma", "cuerpo a cuerpo", "alcance", "precisión alta", "daño"],
  },
  cusarigama: {
    id: "cusarigama",
    label: "Cusarigama",
    slug: "cusarigama",
    icon: "assets/weapons/ataque-especial-cusarigama.svg",
    category: "arma especial",
    summary: "Arma especial con cadena orientada a control, alcance flexible y presión técnica.",
    description: "La cusarigama es un arma especial de control que combina una hoja corta con una cadena. Su valor está en manipular distancia, presionar desde ángulos incómodos y abrir patrones de ataque que pueden comportarse como arma de alcance o como arma de contacto según la carta que la utilice.",
    consumableDefault: false,
    canBeConsumable: true,
    tags: ["ataque", "arma", "arma especial", "cadena", "control", "alcance", "técnico"],
  },
  explosivos: {
    id: "explosivos",
    label: "Explosivos",
    slug: "explosivos",
    icon: "assets/weapons/ataque-explosivos.svg",
    category: "arma consumible potencial",
    summary: "Herramienta ofensiva de presión explosiva que suele orientarse a área, salpicadura o destrucción puntual.",
    description: "Los explosivos representan ataques o recursos ofensivos de detonación. Pueden funcionar como armas de área, salpicadura o ruptura según la carta que los utilice. Aunque muchos explosivos serán consumibles, el consumo no pertenece al tipo de arma por defecto: cada carta o efecto define si esa versión se gasta al usarse.",
    consumableDefault: false,
    canBeConsumable: true,
    tags: ["ataque", "arma", "explosivo", "área", "salpicadura", "consumible posible"],
  },
  smokeBomb: {
    id: 'smokeBomb',
    label: 'Bomba de humo',
    slug: 'bomba-de-humo',
    icon: SMOKE_BOMB_ICON_ASSET,
    category: 'especial',
    applicationType: 'táctica',
    summary: 'Arma especial consumible de aplicación táctica: crea una cortina de humo y habilita Oculto para ninjas aliados dentro del área.',
    description: 'La bomba de humo no hace daño. Es un recurso arrojadizo táctico de alcance 3. Al impactar crea una cortina de humo de radio 3 casillas con duración de una ronda completa. Mientras una invocación Ninja aliada permanezca dentro de esa cortina puede usar el factor Oculto, quedando fuera de selección directa para kasters e invocaciones rivales hasta romper el ocultamiento con una acción dirigida hacia una invocación objetivo seleccionada.',
    consumableDefault: true,
    canBeConsumable: true,
    tags: ['arma', 'especial', 'arrojadiza', 'consumible', 'humo', 'táctica', 'sigilo', 'ninja'],
  },
  municionBalines: {
    id: "municionBalines",
    label: "Munición: balines",
    slug: "municion-balines",
    icon: "assets/weapons/municion-balines.svg",
    category: "munición",
    summary: "Munición de proyectiles pequeños pensada para disparos de dispersión, presión ligera o efectos ligados a armas de fuego.",
    description: "La munición de balines representa proyectiles pequeños que pueden usarse con armas compatibles para disparos de dispersión, presión de corto o medio alcance y efectos de impacto múltiple. Normalmente puede tratarse como consumible, pero la condición de consumo se define en la carta, equipo o efecto que la aplica, no en la base del arma.",
    consumableDefault: false,
    canBeConsumable: true,
    tags: ["ataque", "munición", "balines", "arma de fuego", "proyectil", "consumible posible"],
  },
};
WEAPON_DB.daga = { ...WEAPON_DB.dagas, id: 'daga', label: 'Daga' };
WEAPON_DB.cadenaConArma = WEAPON_DB.armaConCadena;

function getWeaponProfile(card) {
  const weaponType = card?.weaponType || card?.attackProfile?.weaponType || 'golpe';
  const base = WEAPON_DB[weaponType] || WEAPON_DB.golpe;
  const condition = card?.weaponConditions?.[weaponType] || card?.attackProfile?.weaponCondition || {};
  return { ...base, condition, isConsumable: Boolean(condition.consumable), conditionNote: condition.note || '' };
}

function getWeaponInfoProfile(weaponId) {
  const weapon = WEAPON_DB[weaponId] || WEAPON_DB.golpe;
  return weapon;
}

function buildWeaponInfoHtml(weapon, card = null) {
  const condition = card ? (card.weaponConditions?.[weapon.id] || card.attackProfile?.weaponCondition || null) : null;
  const damageNature = card ? getDamageNatureProfile(card) : null;
  const baseAttack = card ? getBaseAttackCard(card) : null;
  const baseWeapon = baseAttack ? getWeaponProfile(baseAttack) : null;
  const damageText = damageNature
    ? `<p><strong>Tipo de daño de esta carta:</strong> <button type="button" class="card-info-inline-chip" data-info-kind="damageNature" data-info-id="${damageNature.id}"><span class="card-info-letter-badge">${damageNature.letter}</span><span>${damageNature.label}</span></button></p>`
    : '';
  const extraWeapons = card ? getCardExtraWeapons(card) : [];
  const principalText = card && (card.weaponType === weapon.id || card.attackProfile?.weaponType === weapon.id)
    ? `<p><strong>Arma principal de esta carta:</strong> <button type="button" class="card-info-inline-chip" data-info-kind="weaponDetail" data-info-id="${weapon.id}"><img src="${weapon.icon}" alt="${weapon.label}"><span>${weapon.label}</span></button></p>`
    : '';
  const baseDamageText = baseAttack && baseWeapon
    ? `<p><strong>Arma base de esta carta:</strong> <button type="button" class="card-info-inline-chip" data-info-kind="baseAttack" data-info-id="base"><img src="${baseWeapon.icon}" alt="${baseWeapon.label}"><span>${baseWeapon.label}</span></button></p>`
    : '';
  const extraWeaponText = extraWeapons.length ? `<p><strong>Factor:</strong> ${extraWeapons.map(extraWeapon => {
    const extraWeaponInfo = getWeaponInfoProfile(extraWeapon.weaponType);
    const sourceFactor = getFactorProfile(extraWeapon.sourceFactor || 'extraWeapon');
    const sourceId = getExtraWeaponSourceId(extraWeapon);
    return `<button type="button" class="card-info-inline-chip" data-info-kind="factor" data-info-id="${sourceFactor?.id || 'extraWeapon'}" data-factor-level="1" data-factor-source="${sourceId}"><img src="${sourceFactor?.icon || extraWeaponInfo.icon}" alt="${sourceFactor?.label || 'Arma extra'}"><span>${sourceFactor?.label || 'Arma extra'}</span></button>`;
  }).join('')}</p>` : '';
  const conditionText = condition?.consumable
    ? `<p><strong>Condición especial:</strong> Esta carta usa ${weapon.label} como consumible. ${condition.note || ''}</p>`
    : `<p><strong>Consumo:</strong> El arma base no se consume por defecto. Si una carta lanza, gasta o transforma esta arma, esa condición se define en la carta, equipo, habilidad o efecto que la aplica.</p>`;
  return `<p><strong>Resumen:</strong> ${weapon.summary || 'Tipo de ataque disponible.'}</p>${buildTagListHtml(weapon.tags)}${principalText}${damageText}${baseDamageText}${extraWeaponText}${conditionText}`;
}

function buildWeaponDetailHtml(weapon, card = null) {
  const condition = card ? (card.weaponConditions?.[weapon.id] || card.attackProfile?.weaponCondition || null) : null;
  const conditionText = condition?.consumable
    ? `<p><strong>Condición especial:</strong> Esta carta usa ${weapon.label} como consumible. ${condition.note || ''}</p>`
    : `<p><strong>Consumo:</strong> Esta arma no se consume por defecto. Si una carta la lanza, gasta o transforma, esa condición se define en la carta, equipo, habilidad o efecto que la aplica.</p>`;
  return `<p><strong>Resumen:</strong> ${weapon.summary || 'Tipo de arma disponible.'}</p>${buildTagListHtml(weapon.tags)}<p>${weapon.description}</p>${conditionText}`;
}

function getBaseAttackCard(card) {
  if (!card) return null;
  const base = card.baseAttackProfile || {};
  const combatMode = base.combatMode || base.type || 'melee';
  const combatModeLabel = COMBAT_MODE_DB[combatMode]?.label || (combatMode === 'distance' ? 'Distancia' : combatMode === 'range' ? 'Rango' : 'Cuerpo a cuerpo');
  return {
    ...card,
    weaponType: base.weaponType || 'golpe',
    weaponConditions: {},
    attackProfile: {
      type: combatMode,
      combatMode,
      label: base.label || combatModeLabel,
      range: Number(base.range ?? 1),
      precision: Number(base.precision ?? 4),
      damage: Number(base.damage ?? 1),
      damageNature: base.damageNature || 'physical',
      applicationId: Object.prototype.hasOwnProperty.call(base, 'applicationId') ? base.applicationId : (Object.prototype.hasOwnProperty.call(base, 'damageApplication') ? base.damageApplication : null),
      modifiers: Array.isArray(base.modifiers) ? base.modifiers : [],
    },
  };
}


function getCardExtraWeapons(card) {
  return Array.isArray(card?.extraWeapons) ? card.extraWeapons : [];
}

function getExtraWeaponProfile(card, id = '') {
  const weapons = getCardExtraWeapons(card);
  if (!weapons.length) return null;
  return weapons.find(entry => String(entry.id) === String(id) || String(entry.weaponType) === String(id)) || weapons[0];
}

function getMetaSourceProfile(sourceId) {
  if (!sourceId) return null;
  const quality = getQualityProfile(sourceId);
  if (quality) return { ...quality, kind: 'quality', title: 'Cualidad' };
  const race = getRaceProfile(sourceId);
  if (race) return { ...race, kind: 'race', title: 'Raza' };
  return null;
}

function getExtraWeaponSourceId(extraWeapon = {}) {
  return extraWeapon.sourceRace || extraWeapon.sourceQuality || extraWeapon.source || 'human';
}

function buildExtraWeaponCard(card, id = '') {
  const extraWeapon = getExtraWeaponProfile(card, id);
  if (!card || !extraWeapon) return null;
  const combatMode = extraWeapon.combatMode || extraWeapon.type || 'melee';
  const combatModeLabel = COMBAT_MODE_DB[combatMode]?.label || (combatMode === 'distance' ? 'Distancia' : combatMode === 'range' ? 'Rango' : 'Cuerpo a cuerpo');
  return {
    ...card,
    weaponType: extraWeapon.weaponType || 'espada',
    weaponConditions: card.weaponConditions || {},
    attackProfile: {
      type: combatMode,
      combatMode,
      label: extraWeapon.label || combatModeLabel,
      range: Number(extraWeapon.range ?? 1),
      precision: Number(extraWeapon.precision ?? 6),
      damage: Number(extraWeapon.damage ?? 1),
      damageNature: extraWeapon.damageNature || 'physical',
      applicationId: Object.prototype.hasOwnProperty.call(extraWeapon, 'applicationId') ? extraWeapon.applicationId : null,
      modifiers: Array.isArray(extraWeapon.modifiers) ? extraWeapon.modifiers : [],
      factors: [],
    },
  };
}

function buildAttackPreviewHtml(cardLike) {
  if (!cardLike) return '';
  return `
    <div class="meta-info-attack-preview">
      <div class="card-info-stats card-info-stats-grouped card-info-stats-compact">
        <div class="stat-row stat-row-damage meta-info-stat-row-damage">
          <strong>DAÑO</strong>
          <span id="metaInfoBaseDamage">${renderWeaponDamageChip(cardLike)}</span>
          <span id="metaInfoBaseAttackType"><span class="card-info-chip-stack">${renderCombatModeChip(cardLike)}${renderDamageApplicationChip(cardLike)}</span></span>
          <span id="metaInfoBaseRange"><span class="card-info-chip-stack">${renderAttackRangeChip(cardLike)}${renderAttackPrecisionChip(cardLike)}</span></span>
        </div>
      </div>
    </div>`;
}


const DAMAGE_NATURE_DB = {
  physical: {
    id: 'physical',
    letter: 'F',
    label: 'Daño físico',
    focus: 'Daño convencional',
    tags: ['tipo de daño', 'físico', 'convencional', 'ofensivo'],
    summary: 'Enfoque de daño físico estándar o convencional.',
    description: 'Enfoque de daño físico o convencional. Representa el daño normal de un ataque y no puede ser reducido, bloqueado ni negado por cartas que solo interactúan con efectos mágicos o elementales. Funciona como la forma estándar de daño ofensivo dentro del combate.',
  },
  magic: {
    id: 'magic',
    letter: 'M',
    label: 'Daño mágico',
    focus: 'Fuente arcana o sobrenatural',
    tags: ['tipo de daño', 'mágico', 'arcano', 'especial'],
    summary: 'Enfoque de daño especial vinculado a efectos mágicos.',
    description: 'Enfoque de daño especial vinculado a efectos mágicos. Este daño no puede ser reducido, bloqueado ni negado por cartas que solo interactúan con efectos físicos o elementales. Se utiliza para representar ataques cuya fuente principal es arcana, mental o sobrenatural.',
  },
  elemental: {
    id: 'elemental',
    letter: 'E',
    label: 'Daño elemental',
    focus: 'Fuente elemental',
    tags: ['tipo de daño', 'elemental', 'afinidad', 'especial'],
    summary: 'Enfoque de daño ligado al dominio elemental de la invocación o del efecto.',
    description: 'Enfoque de daño especial asociado al dominio elemental de la invocación o del efecto que lo genera. No puede ser reducido, bloqueado ni negado por cartas que solo interactúan con daño físico o mágico. Su valor estratégico depende además de las fortalezas y debilidades elementales del objetivo.',
  },
  direct: {
    id: 'direct',
    letter: 'D',
    label: 'Daño directo',
    focus: 'Impacto garantizado',
    tags: ['tipo de daño', 'directo', 'irresistible', 'impacto'],
    summary: 'Daño que no puede reducirse una vez aplicado.',
    description: 'Enfoque de daño que, una vez determinado y aplicado el cálculo correspondiente, no puede ser reducido de ninguna forma. Su función es garantizar impacto real sobre el objetivo, saltándose mitigaciones posteriores y aumentando la fiabilidad ofensiva del ataque o efecto.',
  },
  conditional: {
    id: 'conditional',
    letter: 'C',
    label: 'Daño condicional',
    focus: 'Naturaleza adaptable',
    tags: ['tipo de daño', 'condicional', 'adaptable'],
    summary: 'Daño cuya naturaleza cambia según la condición definida por la carta.',
    description: 'Enfoque de daño adaptable cuya naturaleza puede pasar a ser física, mágica o elemental según la invocación objetivo atacada o la condición definida por la carta. Su valor estratégico radica en ajustar el tipo de daño a la situación para mejorar la eficiencia ofensiva.',
  },
};

const COMBAT_MODE_DB = {
  melee: {
    id: 'melee',
    label: 'Cuerpo a cuerpo',
    icon: 'assets/combat-modes/combat-mode-melee.png',
    focus: 'Combate cercano',
    tags: ['modo de combate', 'cuerpo a cuerpo', 'contacto', 'frontal'],
    summary: 'Modo de combate orientado al contacto cercano.',
    description: 'Forma de aplicación de daño orientada al combate cercano. La invocación ataca objetivos dentro de un alcance corto, normalmente entre 1 y 2 casillas, y se especializa en impactos directos a corta distancia. Este tipo de aplicación favorece enfrentamientos inmediatos y puede interactuar con efectos que alteran o aprovechan el combate frontal.',
  },
  distance: {
    id: 'distance',
    label: 'Distancia',
    icon: 'assets/combat-modes/combat-mode-distance.png',
    focus: 'Proyección a larga distancia',
    tags: ['modo de combate', 'distancia', 'proyección', 'seguridad'],
    summary: 'Modo de combate para atacar desde posiciones alejadas sin contacto cercano.',
    description: 'Forma de aplicación de daño que permite atacar a una invocación o kaster ubicado dentro del área de alcance del atacante sin necesidad de contacto cercano. Su enfoque se basa en proyectar daño hacia casillas alejadas, habilitando presión ofensiva desde posiciones seguras o estratégicas dentro de la arena.',
  },
  range: {
    id: 'range',
    label: 'Rango',
    icon: 'assets/combat-modes/combat-mode-range.png',
    focus: 'Media distancia táctica',
    tags: ['modo de combate', 'rango', 'media distancia', 'presión táctica'],
    summary: 'Modo de combate de media distancia entre cuerpo a cuerpo y distancia larga.',
    description: 'El modo de combate de rango representa ataques que no necesitan contacto inmediato, pero tampoco funcionan como disparos de distancia extrema. Se usa para presión de media distancia, ventanas tácticas de alcance intermedio y ataques que proyectan ofensiva con más seguridad que el cuerpo a cuerpo, sin llegar al comportamiento de alcance largo.',
  },
  spell: {
    id: 'spell',
    label: 'Hechizo',
    icon: 'assets/card-types/card-type-spell.svg',
    focus: 'Utilidad del Kaster',
    tags: ['modo de carta', 'hechizo', 'efecto', 'conjuro', 'caster'],
    summary: 'Modo de carta para conjuros de utilidad lanzados normalmente por el Kaster.',
    description: 'Los hechizos usan una estructura distinta a las invocaciones: no representan un cuerpo en arena, sino una utilidad del Kaster que produce un efecto táctico o directo y normalmente se consume al resolverse. Algunas cartas pueden permitir soporte de invocaciones al lanzamiento, pero esa excepción debe quedar registrada en la carta.',
  },
};

const DAMAGE_APPLICATION_DB = {
  area: {
    id: 'area',
    label: 'Daño de área',
    icon: 'assets/damage-applications/damage-application-area.png',
    focus: 'Cobertura de zona',
    tags: ['aplicación de daño', 'área', 'zona', 'salpicadura'],
    summary: 'Impacta una casilla del rango y extiende daño reducido alrededor del punto de impacto.',
    description: 'Cuando la carta va a infligir daño, no selecciona una invocación como objetivo, sino una casilla dentro de su área de alcance. La invocación que esté en la casilla de impacto recibe el 100% del daño. Luego, el daño puede extenderse en área por una cantidad de casillas definida en relación con la casilla de impacto, y las invocaciones o kasters dentro de esa zona reciben daño reducido a la mitad respecto al daño original del ataque.',
  },
  splashX: {
    id: 'splashX',
    label: 'Daño de salpicadura en X',
    icon: 'assets/damage-applications/damage-application-splash-x.png',
    focus: 'Expansión en X',
    tags: ['aplicación de daño', 'salpicadura', 'x', 'expansión'],
    summary: 'Golpea un objetivo dentro del rango y propaga daño reducido en patrón de X.',
    description: 'La carta puede dañar a una invocación o kaster que se encuentre en una casilla dentro de su rango. La unidad impactada recibe el 100% del daño y el efecto se extiende en una forma de X hacia las casillas adyacentes de la casilla de impacto según la dirección del ataque. Las invocaciones o kasters alcanzados por esa expansión reciben daño reducido a la mitad en relación con el daño original.',
  },
  splashHorizontal: {
    id: 'splashHorizontal',
    label: 'Daño de salpicadura en horizontal',
    icon: 'assets/damage-applications/damage-application-splash-horizontal.png',
    focus: 'Expansión horizontal',
    tags: ['aplicación de daño', 'salpicadura', 'horizontal', 'línea'],
    summary: 'Golpea un objetivo y extiende daño reducido en una línea horizontal desde la casilla impactada.',
    description: 'La carta puede dañar a una invocación o kaster dentro de su área de rango. El objetivo impactado recibe el 100% del daño y el efecto se extiende por una cantidad de casillas definida sobre la línea horizontal de la casilla de impacto, en relación con la dirección del ataque. Las invocaciones o kasters alcanzados por la expansión reciben daño reducido a la mitad respecto al daño original.',
  },
  splashCone: {
    id: 'splashCone',
    label: 'Daño de salpicadura en cono',
    icon: 'assets/damage-applications/damage-application-splash-cone.png',
    focus: 'Expansión frontal',
    tags: ['aplicación de daño', 'salpicadura', 'cono', 'frontal'],
    summary: 'Impacta un objetivo y expande daño reducido en forma de cono hacia el frente del ataque.',
    description: 'La carta puede dañar a una invocación o kaster dentro de su área de rango. La unidad impactada recibe el 100% del daño y el efecto se expande en cono hacia las casillas opuestas a la dirección de impacto y sus adyacentes. Las invocaciones o kasters alcanzados por esa propagación reciben daño reducido a la mitad respecto al daño original del ataque.',
  },
  penetration: {
    id: 'penetration',
    label: 'Daño de penetración',
    icon: 'assets/damage-applications/damage-application-penetration.png',
    focus: 'Trayectoria perforante',
    tags: ['aplicación de daño', 'penetración', 'línea', 'perforación'],
    summary: 'Atraviesa una trayectoria de objetivos en línea, aplicando daño completo al primero y reducido a los posteriores.',
    description: 'La carta puede dañar a una invocación o kaster dentro de su área de rango y, una vez seleccionado el objetivo, el ataque puede atravesar la trayectoria e impactar a varias unidades alineadas. La primera invocación recibe el 100% del daño y las siguientes reciben daño reducido progresivamente. Si se alcanza el límite de invocaciones o kasters antes de llegar al objetivo seleccionado, ni el objetivo ni las unidades posteriores en la trayectoria reciben daño.',
  },
  oscillationPartial: {
    id: 'oscillationPartial',
    label: 'Daño de oscilación parcial',
    icon: 'assets/damage-applications/damage-application-oscillation-partial.png',
    focus: 'Barrido de 180°',
    tags: ['aplicación de daño', 'oscilación', 'barrido', '180°'],
    summary: 'Barrido frontal de 180° dentro del alcance: el primer token alcanzado recibe daño completo y los demás reciben daño reducido.',
    description: 'Cuando la carta ataca, calcula la dirección hacia el objetivo seleccionado y barre el sector frontal de 180° dentro de su alcance. La animación avanza de derecha a izquierda. El primer token alcanzado por el barrido recibe el 100% del daño; los tokens posteriores, incluyendo invocaciones, guardianes/estructuras o kasters rivales dentro del sector, reciben el 50% del daño base.',
  },
  oscillationComplete: {
    id: 'oscillationComplete',
    label: 'Daño de oscilación completa',
    icon: 'assets/damage-applications/damage-application-oscillation-complete.png',
    focus: 'Barrido de 360°',
    tags: ['aplicación de daño', 'oscilación', 'barrido', '360°'],
    summary: 'Barrer 360 grados dentro del alcance, dañando por igual a todas las unidades alcanzadas alrededor del objetivo.',
    description: 'Afecta a varias invocaciones o kasters dentro del rango de ataque. El daño se aplica en un área equivalente al radio de alcance de la invocación, iniciando en el objetivo seleccionado y recorriendo 360 grados alrededor del punto de impacto. Todas las unidades alcanzadas dentro de esa oscilación reciben el mismo daño.',
  },
};

const ATTACK_MODIFIER_DB = {
  control: {
    id: 'control',
    label: 'Control',
    focus: 'Interferencia táctica',
    tags: ['modificador ofensivo', 'control', 'interrupción', 'presión táctica'],
    summary: 'El ataque incorpora presión táctica más allá del daño puro.',
    description: 'Control indica que el ataque no solo busca infligir daño, sino también alterar la posición, la respuesta o la estabilidad del objetivo. Este tipo de modificador se asocia con empuje, anclaje, interrupción, forzar combate, reducción de opciones o presión táctica que dificulta la respuesta rival.',
  },
};

function getDamageNatureProfile(card) {
  const id = card?.attackProfile?.damageNature || card?.damageNature || 'physical';
  return DAMAGE_NATURE_DB[id] || DAMAGE_NATURE_DB.physical;
}

function getCombatModeProfile(card) {
  const id = card?.attackProfile?.combatMode || card?.attackProfile?.type || 'melee';
  return COMBAT_MODE_DB[id] || COMBAT_MODE_DB.melee;
}

function getExplicitDamageApplicationId(card) {
  const profile = card?.attackProfile || {};
  const hasApplicationId = Object.prototype.hasOwnProperty.call(profile, 'applicationId');
  const hasDamageApplication = Object.prototype.hasOwnProperty.call(profile, 'damageApplication');
  if (!hasApplicationId && !hasDamageApplication) return null;
  const id = hasApplicationId ? profile.applicationId : profile.damageApplication;
  if (id === null || id === undefined || id === 'none' || id === '') return null;
  return DAMAGE_APPLICATION_DB[id] ? id : null;
}

function hasExplicitDamageApplication(card) {
  return Boolean(getExplicitDamageApplicationId(card));
}

function getDamageApplicationProfile(card) {
  const id = getExplicitDamageApplicationId(card);
  return id ? DAMAGE_APPLICATION_DB[id] : null;
}

function getAttackModifierProfiles(card) {
  const ids = Array.isArray(card?.attackProfile?.modifiers) ? card.attackProfile.modifiers : [];
  return ids.map(id => ATTACK_MODIFIER_DB[id] || { id, label: id, focus: 'Modificador ofensivo', tags: ['modificador ofensivo', id], summary: `La carta usa ${id} como modificador.`, description: `Este ataque incluye el modificador ${id}.` });
}

function getAttackRangeMeta(card) {
  const profile = getAttackProfile(card);
  const mode = getCombatModeProfile(card);
  return {
    id: 'range',
    label: `Alcance ${profile.range}`,
    icon: 'assets/attack-meta/attack-range.svg',
    focus: 'Distancia efectiva',
    tags: ['estadística ofensiva', 'alcance', 'rango efectivo', mode.label.toLowerCase()],
    summary: `Esta carta puede proyectar su ofensiva a ${profile.range} casilla${profile.range === 1 ? '' : 's'}.`,
    description: `El alcance define cuántas casillas puede cubrir este ataque desde su punto de origen. En esta carta, el alcance efectivo es de ${profile.range} casilla${profile.range === 1 ? '' : 's'}, lo que debe interpretarse junto con el modo de combate ${mode.label} y la aplicación de daño seleccionada.`
  };
}

function getAttackPrecisionMeta(card) {
  const profile = getAttackProfile(card);
  return {
    id: 'precision',
    label: `Precisión ${profile.precision}`,
    icon: 'assets/attack-meta/attack-precision.svg',
    focus: 'Fiabilidad ofensiva',
    tags: ['estadística ofensiva', 'precisión', 'consistencia', 'ataque'],
    summary: `Esta carta maneja una precisión base de ${profile.precision}.`,
    description: `La precisión representa la consistencia con la que el ataque logra su ejecución esperada. En esta carta la precisión base es ${profile.precision}, por lo que sirve como referencia para equilibrar la seguridad del golpe frente a otras armas, modos de combate o efectos ofensivos.`
  };
}

const CARD_TYPE_DB = {
  invocation: {
    id: 'invocation',
    label: 'Invocación',
    icon: 'assets/card-types/card-type-invocation.svg',
    focus: 'Unidad convocada',
    tags: ['tipo de carta', 'conjuro', 'unidad', 'reciclable', 'arena', 'combate'],
    summary: 'Carta de conjuro que materializa una unidad en la arena.',
    description: 'Las invocaciones son conjuros que entran a la arena como unidades controlables. Pueden moverse, atacar, recibir daño y participar en combate. En la lógica base de ROK, cuando una invocación es eliminada no desaparece para siempre: entra en restauración y puede volver al ciclo del Spellbook según su tiempo de restauración y kasteo.',
  },
  spell: {
    id: 'spell',
    label: 'Hechizo',
    icon: 'assets/card-types/card-type-spell.svg',
    focus: 'Utilidad del Kaster · efecto consumible',
    tags: ['tipo de carta', 'hechizo', 'conjuro', 'caster', 'consumible', 'efecto', 'kasteo'],
    summary: 'Carta de conjuro aplicada por el Kaster para producir un efecto y normalmente consumirse.',
    description: 'Los hechizos son utilidades del Kaster: de forma regular solo el Kaster puede lanzarlos para afectarse a sí mismo, afectar otros Kasters o modificar la arena mediante daño, control, alteraciones de campo, protección o cambios de recursos. Algunas cartas pueden romper esta regla y permitir que invocaciones soporten o participen en el lanzamiento, pero esa excepción debe estar escrita por la propia carta. A diferencia de las invocaciones, los hechizos normalmente se consumen después de resolverse.',
  },
  ability: {
    id: 'ability',
    label: 'Habilidad',
    icon: 'assets/card-types/card-type-ability.svg',
    focus: 'Capacidad compartible',
    tags: ['tipo de carta', 'habilidad', 'equipable', 'universal', 'sinergia'],
    summary: 'Carta o capacidad que puede ser compartida entre invocaciones.',
    description: 'Las habilidades son capacidades reutilizables o transferibles entre cartas. Una invocación puede traer habilidades nativas y también recibir habilidades externas, según sus espacios disponibles. Sirven como módulos mecánicos que diferentes cartas pueden compartir.',
  },
  artifact: {
    id: 'artifact',
    label: 'Artilugio',
    icon: 'assets/card-types/card-type-artifact.svg',
    focus: 'Equipo u objeto táctico',
    tags: ['tipo de carta', 'equipo', 'artilugio', 'soporte', 'modificador'],
    summary: 'Carta de objeto, equipo o herramienta que modifica una unidad o una situación.',
    description: 'Los artilugios representan equipos, herramientas u objetos tácticos. Pueden modificar estadísticas, habilitar interacciones, añadir efectos o cambiar la forma en que una carta ejecuta acciones. Su regla final de consumo queda preparada para definirse en el balance.',
  },
  structure: {
    id: 'structure',
    label: 'Estructura',
    icon: 'assets/card-types/card-type-structure.svg',
    focus: 'Presencia fija o defensiva',
    tags: ['tipo de carta', 'estructura', 'defensivo', 'resistencia', 'zona'],
    summary: 'Carta o entidad fija que ocupa espacio y modifica la arena.',
    description: 'Las estructuras son entidades fijas o semipermanentes que alteran la arena, protegen zonas, bloquean rutas o generan efectos. Los guardianes actuales usan esta lógica como estructura defensiva con resistencia.',
  },
  event: {
    id: 'event',
    label: 'Evento',
    icon: 'assets/card-types/card-type-event.svg',
    focus: 'Factor externo',
    tags: ['tipo de carta', 'evento', 'externo', 'azar', 'arena'],
    summary: 'Carta externa que puede alterar el rumbo de la partida.',
    description: 'Los eventos representan factores externos que pueden aparecer con baja probabilidad o bajo reglas especiales. Su función es alterar el ritmo de la partida, modificar condiciones de arena o introducir situaciones que ambos jugadores deben adaptar.',
  },
  element: {
    id: 'element',
    label: 'Elemento',
    icon: 'assets/card-types/card-type-element.svg',
    focus: 'Recurso elemental',
    tags: ['tipo de carta', 'elemento', 'recurso', 'extracción', 'kasteo'],
    summary: 'Carta de extracción que genera recursos elementales.',
    description: 'Los elementos pertenecen al sistema de extracción y no al Spellbook de conjuros. Al extraerse, generan recursos que luego se consumen para kastear cartas según su dominio y costo.',
  },
  kaster: {
    id: 'kaster',
    label: 'Kaster',
    icon: 'assets/card-types/card-type-kaster.svg',
    focus: 'Núcleo del jugador',
    tags: ['tipo de carta', 'kaster', 'líder', 'núcleo', 'derrota'],
    summary: 'Entidad principal del jugador y centro de kasteo.',
    description: 'El Kaster es el núcleo del jugador. Desde su posición se ejecuta el kasteo y su vida define la condición principal de derrota. Puede moverse en la arena, defenderse y quedar vulnerable si cruza o permanece en zonas peligrosas.',
  },
};

function getCardTypeProfile(typeId) {
  return CARD_TYPE_DB[typeId] || CARD_TYPE_DB.invocation;
}

function getCardTypeId(card) {
  return card?.cardType || card?.type || 'invocation';
}

function createTypeChipHtml(typeId, extraLabel = '') {
  const type = getCardTypeProfile(typeId);
  const label = extraLabel || type.label;
  return `
    <button type="button" class="card-info-type-chip" data-info-kind="cardType" data-info-id="${type.id}" title="Tipo de carta: ${type.label}">
      <img src="${type.icon}" alt="${type.label}">
      <span>${label}</span>
    </button>`;
}

function setCardInfoType(typeId, label = '') {
  if (!els.cardInfoType) return;
  els.cardInfoType.innerHTML = createTypeChipHtml(typeId, label);
  const chip = els.cardInfoType.querySelector('[data-info-kind="cardType"]');
  if (chip) chip.addEventListener('click', () => openCardMetaInfo('cardType', chip.dataset.infoId, null));
}

function createInfoEntityCard({ id, name, type, artImage, elementId = 'oscuridad', cost = 0 }) {
  const skinSet = ELEMENT_EXTRACTION_ASSETS[elementId] || ELEMENT_EXTRACTION_ASSETS.oscuridad;
  return {
    id,
    name,
    type,
    cardType: type,
    cost: cost ? { [elementId]: cost } : {},
    artImage,
    bgImage: 'assets/card-bg-darkness.jpg',
    skinImage: skinSet?.skinImage || 'assets/card-skin-darkness.png',
    domain: { elementId, attributeId: DOMAIN_ART_DB[elementId]?.attributeId || 'mystery' },
  };
}

const CARD_LIBRARY = {
  kasterHanzoDark: {
    id: 'kasterHanzoDark',
    name: 'Hattori Hanzo',
    shortName: 'Hanzo',
    family: 'ninja',
    familyPosition: 'prefix',
    type: 'kaster',
    cardType: 'kaster',
    bgImage: 'assets/card-bg-darkness.jpg',
    artImage: 'assets/caster-hanzo.png',
    skinImage: 'assets/card-skin-darkness.png',
    tokenImage: 'assets/caster-hanzo.png',
    domain: { elementId: 'oscuridad', attributeId: 'misterio' },
    cost: {},
    castPhases: 0,
    rarity: 'caster',
    origin: 'japon',
    gender: 'male',
    races: ['human'],
    qualities: ['assassin'],
    stats: { atk: 4, def: 2, damage: 4, life: 30, maxLife: 30, mov: TEST_CASTER_MOVE_SPEED, restore: 0 },
    weaponType: 'katana',
    attackProfile: {
      type: 'melee',
      combatMode: 'melee',
      label: 'Cuerpo a cuerpo',
      range: 1,
      precision: 6,
      damage: 4,
      damageNature: 'physical',
      applicationId: null,
      modifiers: [],
      factors: [],
    },
    weaponConditions: {
      katana: { consumable: false, note: 'Ataque base del Kaster de Oscuridad.' },
    },
    baseAttackProfile: {
      weaponType: 'golpe',
      combatMode: 'melee',
      range: 1,
      precision: 6,
      damage: 1,
      damageNature: 'physical',
      applicationId: null,
      modifiers: [],
    },
    abilitySlots: 0,
    abilities: [],
    power: null,
    movementType: 'complete',
    biotype: 'terrestre',
    summary: 'Kaster de Oscuridad asociado a la familia Ninja y la cualidad Asesino.',
  },
  kasterTokugawaLight: {
    id: 'kasterTokugawaLight',
    name: 'Ieyasu Tokugawa',
    shortName: 'Tokugawa',
    family: 'samurai',
    familyPosition: 'prefix',
    type: 'kaster',
    cardType: 'kaster',
    bgImage: 'assets/card-bg-darkness.jpg',
    artImage: 'assets/tokugawa-light-art.webp',
    skinImage: 'assets/card-skin-light.png',
    tokenImage: 'assets/tokugawa-light-token.webp',
    domain: { elementId: 'luz', attributeId: 'revelacion' },
    cost: {},
    castPhases: 0,
    rarity: 'caster',
    origin: 'japon',
    gender: 'male',
    races: ['human'],
    qualities: ['caudillo'],
    stats: { atk: 4, def: 2, damage: 4, life: 30, maxLife: 30, mov: TEST_CASTER_MOVE_SPEED, restore: 0 },
    weaponType: 'katana',
    attackProfile: {
      type: 'melee',
      combatMode: 'melee',
      label: 'Cuerpo a cuerpo',
      range: 1,
      precision: 6,
      damage: 4,
      damageNature: 'physical',
      applicationId: null,
      modifiers: [],
      factors: [],
    },
    weaponConditions: {
      katana: { consumable: false, note: 'Ataque base del Kaster de Luz.' },
    },
    baseAttackProfile: {
      weaponType: 'golpe',
      combatMode: 'melee',
      range: 1,
      precision: 6,
      damage: 1,
      damageNature: 'physical',
      applicationId: null,
      modifiers: [],
    },
    abilitySlots: 0,
    abilities: [],
    power: null,
    movementType: 'complete',
    biotype: 'terrestre',
    summary: 'Kaster de Luz preparado para el dominio Revelación. Queda registrado para activarlo en un parche posterior.',
  },
  naitoSutoka: {
    id: 'naitoSutoka',
    name: 'Kagero, Ichisoku (Ninja)',
    shortName: 'Kagero',
    family: 'ninja',
    familyPosition: 'suffix',
    type: 'invocation',
    bgImage: 'assets/card-bg-darkness.jpg',
    artImage: 'assets/kagero-art.png',
    skinImage: 'assets/card-skin-darkness.png',
    tokenImage: 'assets/kagero-token.png',
    domain: { elementId: 'oscuridad', attributeId: 'misterio' },
    cost: {},
    castPhases: 0,
    rarity: 'common',
    origin: 'japon',
    gender: 'female',
    races: ['human'],
    qualities: ['assassin'],
    stats: { atk: 2, def: 0, damage: 2, life: 1, mov: 3, restore: 0 },
    weaponType: 'espada',
    attackProfile: {
      type: 'melee',
      combatMode: 'melee',
      label: 'Cuerpo a cuerpo',
      range: 1,
      precision: 6,
      damage: 2,
      damageNature: 'physical',
      applicationId: null,
      modifiers: [],
      factors: [{ id: 'criticalHit', level: 2, source: 'assassin' }],
    },
    weaponConditions: {
      espada: { consumable: false, note: 'Uso base no consumible en esta carta.' },
    },
    baseAttackProfile: {
      weaponType: 'golpe',
      combatMode: 'melee',
      range: 6,
      precision: 6,
      damage: 1,
      damageNature: 'physical',
      applicationId: null,
      modifiers: [],
    },
    abilitySlots: 2,
    abilities: [],
    power: null,
    movementType: 'basic',
    biotype: 'terrestre',
  },
  ninjaNaitoSutoka: {
    id: 'ninjaNaitoSutoka',
    name: 'Naito sutoka',
    shortName: 'Naito sutoka',
    family: 'ninja',
    familyPosition: 'prefix',
    type: 'invocation',
    bgImage: 'assets/card-bg-darkness.jpg',
    artImage: 'assets/naito-sutoka-art.webp',
    skinImage: 'assets/card-skin-darkness.png',
    tokenImage: 'assets/naito-sutoka-token.png',
    domain: { elementId: 'oscuridad', attributeId: 'misterio' },
    cost: { oscuridad: 5 },
    castPhases: 5,
    rarity: 'common',
    origin: 'japon',
    gender: 'female',
    races: ['human'],
    qualities: ['assassin', 'stalker'],
    stats: { atk: 2, def: 0, damage: 2, life: 1, mov: 3, restore: 5 },
    weaponType: 'armaConCadena',
    attackProfile: {
      type: 'range',
      combatMode: 'range',
      label: 'Alcance medio',
      range: 2,
      precision: 6,
      damage: 2,
      damageNature: 'physical',
      applicationId: 'oscillationPartial',
      modifiers: [],
      factors: [{ id: 'extraAttack', level: 1, source: 'assassin' }],
    },
    weaponConditions: {
      armaConCadena: { consumable: false, note: 'Uso base no consumible en esta carta.' },
    },
    baseAttackProfile: {
      weaponType: 'golpe',
      combatMode: 'melee',
      range: 6,
      precision: 6,
      damage: 1,
      damageNature: 'physical',
      applicationId: null,
      modifiers: [],
    },
    abilitySlots: 3,
    abilities: [{ id: 'stalk', sourceQuality: 'stalker' }],
    cooldownPhases: 5,
    power: {
      id: 'sutokaHatsuenDan',
      name: 'Sutoka hatsuen-dan',
      activation: 'Activo / Pasivo',
      category: 'Físico defensivo',
      cooldownPhases: 5,
      smokeRadius: 3,
      throwRange: 3,
      startingBombs: 3,
      summary: 'Naito Sutoka inicia con 3 bombas de humo; cualquier Ninja aliado puede aprovecharlas gracias a la sinergia de familia.',
    },
    movementType: 'basic',
    biotype: 'terrestre',
  },
  ninjaOjoDeBuho: {
    id: 'ninjaOjoDeBuho',
    name: 'Fukurō no Me',
    shortName: 'Fukurō no Me',
    family: 'ninja',
    familyPosition: 'prefix',
    type: 'invocation',
    bgImage: 'assets/card-bg-darkness.jpg',
    artImage: 'assets/ojo-de-buho-token.png',
    skinImage: 'assets/card-skin-darkness.png',
    tokenImage: 'assets/ojo-de-buho-art.png',
    domain: { elementId: 'oscuridad', attributeId: 'misterio' },
    cost: { oscuridad: 3 },
    castPhases: 1,
    rarity: 'common',
    origin: 'japon',
    gender: 'male',
    races: ['human'],
    qualities: ['assassin'],
    stats: { atk: 1, def: 0, damage: 1, life: 2, mov: 1, restore: 5 },
    weaponType: 'arco',
    attackProfile: {
      type: 'distance',
      combatMode: 'distance',
      label: 'Distancia',
      range: 4,
      precision: 3,
      damage: 1,
      damageNature: 'physical',
      applicationId: null,
      modifiers: [],
      factors: [{ id: 'extraWeapon', level: 1, source: 'human' }, { id: 'lethality', level: 1, source: 'assassin' }, { id: 'extraAttack', level: 1, source: 'assassin' }],
    },
    weaponConditions: {
      arco: { consumable: false, note: 'Arma principal de largo alcance para presión táctica desde distancia.' },
      golpe: { consumable: false, note: 'Arma base nativa: puño, usada como referencia ofensiva sin armas.' },
      espada: { consumable: false, note: 'Arma extra concedida por Humano mediante el factor Arma extra.' },
    },
    baseAttackProfile: {
      weaponType: 'golpe',
      combatMode: 'melee',
      range: 6,
      precision: 6,
      damage: 1,
      damageNature: 'physical',
      applicationId: null,
      modifiers: [],
    },
    extraWeapons: [
      {
        id: 'sword',
        label: 'Espada',
        weaponType: 'espada',
        sourceFactor: 'extraWeapon',
        sourceRace: 'human',
        combatMode: 'melee',
        range: 1,
        precision: 6,
        damage: 2,
        damageNature: 'physical',
        applicationId: null,
        modifiers: [],
      },
    ],
    abilitySlots: 2,
    abilities: [],
    power: null,
    movementType: 'basic',
    biotype: 'terrestre',
  },
  spellKageNoMichi: {
    id: 'spellKageNoMichi',
    name: 'Kage no Michi',
    shortName: 'Kage no Michi',
    latinName: 'Kage no Michi',
    type: 'spell',
    cardType: 'spell',
    composition: 'backgroundSkin',
    usesArtLayer: false,
    thumbnailImage: 'assets/spell-kage-no-michi-bg.webp',
    spellIcon: 'assets/spell-kage-no-michi-bg.webp',
    bgImage: 'assets/spell-kage-no-michi-bg.webp',
    skinImage: 'assets/card-skin-darkness.png',
    domain: { elementId: 'oscuridad', attributeId: 'misterio' },
    cost: { oscuridad: 2 },
    castPhases: 1,
    rarity: 'common',
    origin: 'japon',
    gender: 'none',
    races: [],
    qualities: [],
    stats: { atk: 0, def: 0, damage: 0, life: 0, mov: 0, restore: 0 },
    weaponType: 'magia',
    attackProfile: {
      type: 'spell',
      combatMode: 'spell',
      label: 'Hechizo',
      range: 0,
      precision: 0,
      damage: 0,
      damageNature: 'magic',
      applicationId: null,
      modifiers: ['utility', 'stealth'],
      factors: [],
    },
    weaponConditions: {},
    baseAttackProfile: null,
    abilitySlots: 0,
    abilities: [],
    power: null,
    movementType: 'none',
    biotype: null,
    effectStatus: 'implemented',
    power: {
      id: 'kageNoMichi',
      name: 'Kage no Michi',
      activation: 'Hechizo',
      category: 'Virtual/Táctico · Ocultamiento/Soporte/Alteración de campo',
      classification: {
        applicationModes: ['active'],
        applicationTags: ['continuous'],
        natures: ['virtual', 'tactical'],
        functionalCategories: ['concealment', 'support', 'fieldAlteration'],
      },
      summary: 'Crea un camino de niebla desde la casilla frontal del Kaster hasta la zona de riesgo rival durante 9 fases.',
    },
    spellRules: {
      user: {
        mode: 'restricted',
        label: 'Oscuridad · Asesino',
        description: 'Solo puede ser usado por un Kaster de dominio Oscuridad o por un Kaster con cualidad Asesino.',
        requirementMode: 'any',
        elements: ['oscuridad'],
        casterQualities: ['assassin'],
      },
      target: {
        mode: 'restricted',
        label: 'Oscuridad · Invocación · Asesino · Bandido · Acechador',
        description: 'El camino de niebla beneficia únicamente a invocaciones de dominio Oscuridad que además sean Asesino, Bandido o Acechador.',
        cardTypes: ['invocation'],
        elements: ['oscuridad'],
        mandatory: {
          cardTypes: ['invocation'],
          elements: ['oscuridad'],
        },
        qualities: ['assassin', 'bandit', 'stalker'],
        weaponTypes: [],
        origins: [],
      },
      castRequirements: {
        traits: ['niebla', 'camino', 'ocultamiento', 'oscuridad'],
      },
      consumable: true,
      effect: {
        id: 'kageNoMichiPath',
        durationPhases: 9,
        autoCastFromCasterFront: true,
        hiddenFactor: true,
        damageBonus: 1,
        pdaOverrideForAssassinFactors: 6,
        targetElements: ['oscuridad'],
        targetQualities: ['assassin', 'bandit', 'stalker'],
      },
    },
    focusScoreModifiers: { utility: 3, stealth: 4, tempo: 2 },
  },
  samuraiAkari: {
    id: 'samuraiAkari',
    name: 'Akari',
    shortName: 'Akari',
    family: 'samurai',
    familyPosition: 'prefix',
    type: 'invocation',
    bgImage: 'assets/card-bg-darkness.jpg',
    artImage: 'assets/akari-art.png',
    skinImage: 'assets/card-skin-fire.png',
    tokenImage: 'assets/akari-token.png',
    domain: { elementId: 'fuego', attributeId: 'destruccion' },
    cost: { fuego: 2, random: 1 },
    castPhases: 2,
    rarity: 'common',
    origin: 'japon',
    gender: 'female',
    races: ['human'],
    qualities: ['shooter', 'warrior'],
    stats: { atk: 3, def: 0, damage: 3, life: 1, mov: 2, restore: 2 },
    weaponType: 'arco',
    attackProfile: {
      type: 'range',
      combatMode: 'range',
      label: 'Largo alcance',
      range: 4,
      precision: 6,
      damage: 3,
      damageNature: 'physical',
      applicationId: null,
      modifiers: [],
      factors: [],
    },
    weaponConditions: {
      arco: { consumable: false, note: 'Arma principal de largo alcance para presión desde distancia.' },
      espada: { consumable: false, note: 'Arma secundaria registrada para la lógica futura de Arma extra.' },
    },
    baseAttackProfile: {
      weaponType: 'espada',
      combatMode: 'melee',
      range: 1,
      precision: 6,
      damage: 2,
      damageNature: 'physical',
      applicationId: null,
      modifiers: [],
    },
    abilitySlots: 2,
    abilities: [],
    power: null,
    movementType: 'basic',
    biotype: 'terrestre',
  },
  samuraiToyotomiHideyoshi: {
    id: 'samuraiToyotomiHideyoshi',
    name: 'Toyotomi hideyoshi',
    shortName: 'Toyotomi',
    family: 'samurai',
    familyPosition: 'prefix',
    type: 'invocation',
    bgImage: 'assets/card-bg-darkness.jpg',
    artImage: 'assets/toyotomi-hideyoshi-token.webp',
    skinImage: 'assets/card-skin-fire.png',
    tokenImage: 'assets/toyotomi-hideyoshi-art.png',
    tokenDebugName: 'toyotomi-hideyoshi-art.png',
    domain: { elementId: 'fuego', attributeId: 'destruccion' },
    cost: { fuego: 2, random: 1 },
    castPhases: 2,
    rarity: 'common',
    origin: 'japon',
    gender: 'male',
    races: ['human'],
    qualities: ['hero', 'warrior'],
    stats: { atk: 2, def: 0, damage: 2, life: 1, mov: 2, restore: 1 },
    weaponType: 'espada',
    attackProfile: {
      type: 'melee',
      combatMode: 'melee',
      label: 'Cuerpo a cuerpo',
      range: 1,
      precision: 6,
      damage: 2,
      damageNature: 'physical',
      applicationId: null,
      modifiers: [],
      factors: [],
    },
    weaponConditions: {
      espada: { consumable: false, note: 'Arma principal de cuerpo a cuerpo para presión frontal.' },
    },
    baseAttackProfile: {
      weaponType: 'golpe',
      combatMode: 'melee',
      range: 1,
      precision: 6,
      damage: 1,
      damageNature: 'physical',
      applicationId: null,
      modifiers: [],
    },
    abilitySlots: 2,
    abilities: [],
    power: null,
    movementType: 'basic',
    biotype: 'terrestre',
  },
  samuraiBushiHonorable: {
    id: 'samuraiBushiHonorable',
    name: 'Samurai Bushi honorable',
    shortName: 'Bushi honorable',
    family: 'samurai',
    familyPosition: 'prefix',
    type: 'invocation',
    bgImage: 'assets/card-bg-darkness.jpg',
    artImage: 'assets/bushi-card.png',
    skinImage: 'assets/card-skin-fire.png',
    tokenImage: 'assets/bushi-token.png',
    domain: { elementId: 'fuego', attributeId: 'destruccion' },
    cost: { fuego: 2 },
    castPhases: 2,
    rarity: 'common',
    origin: 'japon',
    gender: 'male',
    races: ['human'],
    qualities: [],
    stats: { atk: 3, def: 0, damage: 3, life: 1, mov: 2, restore: 1 },
    weaponType: 'espada',
    attackProfile: {
      type: 'melee',
      combatMode: 'melee',
      label: 'Cuerpo a cuerpo',
      range: 1,
      precision: 6,
      damage: 3,
      damageNature: 'physical',
      applicationId: null,
      modifiers: [],
      factors: [],
    },
    weaponConditions: {
      espada: { consumable: false, note: 'Uso base no consumible en esta carta.' },
    },
    baseAttackProfile: {
      weaponType: 'golpe',
      combatMode: 'melee',
      range: 1,
      precision: 6,
      damage: 1,
      damageNature: 'physical',
      applicationId: null,
      modifiers: [],
    },
    abilitySlots: 2,
    abilities: [],
    power: null,
    movementType: 'basic',
    biotype: 'terrestre',
  },
};

const LOCAL_PLAYER_ID = 1;
const MAX_INVOCATIONS_PER_PLAYER = 5;


const GENDER_DB = {
  male: { id: 'male', label: 'Hombre' },
  female: { id: 'female', label: 'Mujer' },
  neutral: { id: 'neutral', label: 'Neutro' },
  none: { id: 'none', label: 'Sin género' },
};

const RACE_DB = {
  human: {
    id: 'human',
    label: 'Humano',
    icons: {
      male: 'assets/races/race-human-male.svg',
      female: 'assets/races/race-human-female.svg',
      neutral: 'assets/races/race-human-male.svg',
      none: 'assets/races/race-human-male.svg',
    },
    summary: 'Invocaciones de desempeño equilibrado y alta versatilidad táctica.',
    focus: 'Versatilidad',
    classification: { applicationModes: [], applicationTags: [], natures: ['tactical'], functionalCategories: ['utility', 'support'] },
    tags: ['raza', 'equilibrado', 'estratégico', 'táctico', 'soporte', 'armas', 'formación'],
    description: 'Los humanos son invocaciones de desempeño equilibrado, capaces de adaptarse a funciones ofensivas, defensivas, técnicas o de soporte sin depender de una sola mecánica base. Suelen destacar por su versatilidad para usar armas, habilidades, equipo, formación, efectos tácticos o sinergias de familia, funcionando como unidades flexibles que pueden ajustarse a distintos estilos de daño, control, presión o apoyo según su construcción.',
  },
};


const QUALITY_DB = {
  stalker: {
    id: 'stalker',
    label: 'Acechador',
    icon: 'assets/qualities/quality-stalker.svg',
    focus: 'Seguimiento, sigilo y castigo oportuno',
    classification: { applicationModes: [], applicationTags: [], natures: ['tactical'], functionalCategories: ['concealment', 'control', 'offensive'] },
    tags: ['cualidad', 'acechador', 'sigilo', 'reposicionamiento', 'persecución', 'emboscada', 'control de distancia', 'presión selectiva', 'estratégico'],
    summary: 'Orientada al seguimiento, aproximación y castigo oportuno desde posiciones ventajosas.',
    description: 'La cualidad Acechador indica que la carta está orientada al seguimiento, aproximación y castigo oportuno de objetivos desde una posición ventajosa. Esta cualidad suele favorecer sigilo, reposicionamiento, persecución, emboscada y mejora de rendimiento al atacar unidades distraídas, aisladas, debilitadas o con baja capacidad de respuesta. Las cartas con esta cualidad tienden a generar ventaja mediante presión selectiva, control de distancia y aprovechamiento del momento exacto para intervenir, en lugar de depender de confrontación frontal o resistencia prolongada.',
  },
  assassin: {
    id: 'assassin',
    label: 'Asesino',
    icon: 'assets/qualities/quality-assassin.svg',
    focus: 'Eliminación rápida y eficiencia ofensiva',
    classification: { applicationModes: [], applicationTags: [], natures: ['physical', 'tactical'], functionalCategories: ['offensive', 'execution', 'concealment'] },
    tags: ['cualidad', 'asesino', 'ofensivo', 'sigilo', 'letalidad', 'ejecución', 'daño directo', 'daño crítico', 'ataque doble', 'ataque rápido'],
    summary: 'Enfocada en eliminar objetivos con rapidez, sigilo y alta eficiencia ofensiva.',
    description: 'La cualidad Asesino indica que la carta está enfocada en eliminar objetivos con rapidez, sigilo y alta eficiencia ofensiva. Esta cualidad suele potenciar interacciones relacionadas con emboscada, daño progresivo, letalidad y ejecución, además de favorecer factores o efectos como daño directo, daño crítico, golpe mortal, ejecución, ataque doble o ataque rápido. Las cartas con esta cualidad tienden a especializarse en castigar objetivos vulnerables, rematar unidades debilitadas o atravesar defensas mediante efectos diseñados para reducir el tiempo de respuesta del oponente y aumentar la capacidad de eliminación puntual.',
  },
  bandit: {
    id: 'bandit',
    label: 'Bandido',
    icon: 'assets/qualities/quality-bandit.svg',
    focus: 'Hostigamiento estratégico, sabotaje, saqueo y ocultamiento autónomo',
    classification: { applicationModes: [], applicationTags: [], natures: ['virtual', 'tactical'], functionalCategories: ['sabotage', 'concealment', 'resupply', 'fieldAlteration'] },
    tags: ['cualidad', 'bandido', 'hostigamiento', 'sabotaje', 'saqueo', 'estructuras', 'ocultamiento', 'reabastecimiento', 'movilidad táctica'],
    summary: 'Invocaciones tácticas enfocadas en hostigar, sabotear estructuras, saquear recursos o equipo y operar con ocultamiento propio.',
    description: 'La cualidad Bandido representa invocaciones orientadas al hostigamiento estratégico más que al combate frontal. Estas unidades suelen sabotear estructuras desactivando efectos temporalmente, causar daño adicional o progresivo a edificios, evitar quedar bloqueadas por combate, infiltrarse en zonas de riesgo enemigas para obtener recompensas adicionales, robar recursos, armas secundarias u objetos, y aprovechar rutas de escape. También tienden a acceder con facilidad a factores de ocultamiento, reabastecimiento y herramientas tácticas que les permiten operar sin depender siempre de otras invocaciones externas.',
  },
  shooter: {
    id: 'shooter',
    label: 'Tirador',
    icon: 'assets/weapons/ataque-arco.svg',
    focus: 'Presión de largo alcance y control de línea',
    classification: { applicationModes: [], applicationTags: [], natures: ['physical', 'tactical'], functionalCategories: ['offensive', 'control'] },
    tags: ['cualidad', 'tirador', 'largo alcance', 'precisión', 'hostigamiento', 'cobertura', 'posicionamiento'],
    summary: 'Especializada en atacar desde distancia segura con precisión y control de líneas de amenaza.',
    description: 'La cualidad Tirador identifica invocaciones diseñadas para presionar desde largo alcance, proteger corredores del tablero y castigar objetivos antes de que entren en combate cercano. Su valor principal está en el posicionamiento, la cobertura y la capacidad de obligar al rival a moverse con cuidado dentro de sus líneas de amenaza.',
  },
  warrior: {
    id: 'warrior',
    label: 'Guerrero',
    icon: 'assets/qualities/quality-warrior.svg',
    focus: 'Combate armado, presión frontal y consistencia marcial',
    classification: { applicationModes: [], applicationTags: [], natures: ['physical', 'tactical'], functionalCategories: ['offensive', 'defensive'] },
    tags: ['cualidad', 'guerrero', 'arma', 'combate', 'ofensivo', 'defensivo', 'disciplina', 'presión frontal'],
    summary: 'Orientada al combate armado estable, resistencia táctica y presión directa.',
    description: 'La cualidad Guerrero representa invocaciones entrenadas para sostener combate armado con disciplina y presencia en el frente. Suele asociarse con dominio de armas, protección física, evasión básica, armadura, ataques adicionales o mejoras marciales que hacen a la unidad más consistente durante intercambios prolongados.',
  },
  caudillo: {
    id: 'caudillo',
    label: 'Caudillo',
    icon: 'assets/qualities/quality-caudillo.svg',
    focus: 'Dirección táctica, mando y coordinación aliada',
    classification: { applicationModes: [], applicationTags: [], natures: ['tactical', 'virtual'], functionalCategories: ['support', 'control', 'fieldAlteration'] },
    tags: ['cualidad', 'caudillo', 'liderazgo', 'mando', 'aura', 'formación', 'coordinación', 'reposicionamiento', 'soporte funcional'],
    summary: 'Liderazgo táctico que mejora, coordina y reposiciona invocaciones aliadas mediante mando, aura y soporte funcional.',
    description: 'La cualidad Caudillo indica que la carta está orientada a la dirección táctica y a la creación de jugadas mediante la manipulación de invocaciones aliadas. Esta cualidad suele favorecer habilidades, poderes o factores enfocados en modificar la posición, el movimiento, la restauración y la interacción de otras unidades del mismo bando, además de potenciar sus estadísticas de forma individual, grupal o en área mediante auras y efectos de mando. Las cartas con esta cualidad tienden a desempeñar un rol estratégico dentro de la formación, facilitando combinaciones, mejorando la coordinación del equipo y aumentando el valor funcional de las invocaciones aliadas.',
  },
};

function getQualityProfile(qualityId) {
  return QUALITY_DB[qualityId] || null;
}


const FAMILY_DB = {
  ninja: {
    id: 'ninja',
    label: 'Ninja',
    icon: '★',
    focus: 'Sigilo, precisión y ejecución táctica',
    tags: ['familia', 'ninja', 'sigilo', 'precisión', 'ejecución'],
    summary: 'Familia orientada a presión selectiva, infiltración y remate quirúrgico.',
    description: 'La familia Ninja agrupa cartas enfocadas en sigilo, movilidad táctica, presión selectiva y eliminación precisa. Sus sinergias suelen favorecer el posicionamiento, la evasión, los ataques calculados y factores que castigan objetivos vulnerables o distraídos.',
  },
  samurai: {
    id: 'samurai',
    label: 'Samurai',
    icon: '★',
    focus: 'Honor marcial, disciplina y combate frontal',
    tags: ['familia', 'samurai', 'disciplina', 'honor', 'arma', 'combate frontal'],
    summary: 'Familia orientada a disciplina marcial, presencia firme y combate directo.',
    description: 'La familia Samurai agrupa invocaciones de postura firme, dominio de armas y presión ordenada en combate. Sus sinergias futuras pueden favorecer disciplina, formación, duelos, resistencia y ataques frontales confiables.',
  },
};

function getFamilyProfile(familyId) {
  return FAMILY_DB[familyId] || null;
}

const FACTOR_DB = {
  hidden: {
    id: 'hidden',
    label: 'Oculto',
    icon: HIDDEN_FACTOR_ICON_ASSET,
    classification: { applicationModes: ['reaction'], applicationTags: [], natures: ['virtual', 'tactical'], functionalCategories: ['concealment', 'protection'] },
    tags: ['factor', 'sigilo', 'táctico', 'estratégico', 'ocultamiento'],
    summary: 'El usuario se oculta de la vista rival y no puede ser seleccionado como objetivo mientras conserve el efecto.',
    descriptions: {
      1: 'Reacción, virtual/táctico, ocultamiento/protección. El usuario se ocultará de la vista de los kasters y las invocaciones rivales, de esta forma no podrá ser seleccionado como objetivo de habilidades, poderes o factores conjuros. Perderá este factor si realiza cualquier acción hacia una invocación objetivo seleccionada, sea aliada o rival.',
    },
  },
  extraAttack: {
    id: 'extraAttack',
    label: 'Ataque extra',
    icon: EXTRA_ATTACK_FACTOR_ICON_ASSET,
    classification: { applicationModes: ['passive'], applicationTags: [], natures: ['physical'], functionalCategories: ['offensive'] },
    tags: ['factor', 'ofensivo', 'físico', 'ataque adicional', 'combate'],
    summary: 'Realiza un ataque adicional después del intercambio normal de combate si sigue en pie y el objetivo sigue válido.',
    descriptions: {
      1: 'Pasiva · Físico · Ofensiva. El usuario realiza un ataque adicional después del intercambio normal de combate. Si el usuario ataca en su turno, golpea, el rival responde y luego ejecuta el ataque extra. Si el rival ataca primero, el rival golpea, el usuario responde y luego ejecuta el ataque extra.',
    },
  },
  extraWeapon: {
    id: 'extraWeapon',
    label: 'Arma extra',
    icon: 'assets/weapons/ataque-espada.svg',
    classification: { applicationModes: ['passive'], applicationTags: [], natures: ['tactical'], functionalCategories: ['utility', 'offensive'] },
    tags: ['factor', 'arma extra', 'arma', 'táctico', 'cuerpo a cuerpo', 'versatilidad'],
    summary: 'Permite que la invocación tenga armas adicionales registradas junto a su arma principal y su arma base.',
    maxLevel: 3,
    extraWeaponsByLevel: { 1: 1, 2: 2, 3: 3 },
    descriptions: {
      1: 'Arma extra 1 · Pasiva · Táctico · Utilidad/Ofensiva. La invocación puede tener 1 arma adicional además de su arma base y su arma principal. En Fukurō no Me, Humano concede Arma extra 1 y registra Espada como arma adicional para futuras interacciones de combate cuerpo a cuerpo.',
      2: 'Arma extra 2 · Pasiva · Táctico · Utilidad/Ofensiva. La invocación puede tener hasta 2 armas adicionales además de su arma base y su arma principal.',
      3: 'Arma extra 3 · Pasiva · Táctico · Utilidad/Ofensiva. La invocación puede tener hasta 3 armas adicionales además de su arma base y su arma principal.',
    },
  },
  lethality: {
    id: 'lethality',
    label: 'Letalidad',
    icon: 'assets/factors/factor-letalidad.svg',
    classification: { applicationModes: ['passive'], applicationTags: ['pda'], natures: ['physical'], functionalCategories: ['offensive', 'execution'] },
    tags: ['factor', 'ofensivo', 'ejecución', 'letalidad', 'PDA', 'remate'],
    summary: 'Después de causar al menos 1 daño real, puede ejecutar objetivos que queden bajo su umbral de vida.',
    pdaByLevel: { 1: 2, 2: 3, 3: 2, 4: 3, 5: 4 },
    executionThresholdByLevel: { 1: 3, 2: 4, 3: 5, 4: 6, 5: 7 },
    directThresholdByLevel: { 1: 0, 2: 0, 3: 2, 4: 3, 5: 4 },
    descriptions: {
      1: 'Pasiva/PDA · Físico · Ofensiva/Ejecución. Si el usuario realiza al menos 1 punto de daño real y el objetivo queda con 3 o menos de vida, tira 2 PDA para ejecutar al objetivo.',
      2: 'Pasiva/PDA · Físico · Ofensiva/Ejecución. Si el usuario realiza al menos 1 punto de daño real y el objetivo queda con 4 o menos de vida, tira 3 PDA para ejecutar al objetivo.',
      3: 'Pasiva/PDA · Físico · Ofensiva/Ejecución. Si el usuario realiza al menos 1 punto de daño real y el objetivo queda con 5 o menos de vida, tira 2 PDA para ejecutar al objetivo. Si queda con 2 o menos de vida, se ejecuta directamente sin tirada.',
      4: 'Pasiva/PDA · Físico · Ofensiva/Ejecución. Si el usuario realiza al menos 1 punto de daño real y el objetivo queda con 6 o menos de vida, tira 3 PDA para ejecutar al objetivo. Si queda con 3 o menos de vida, se ejecuta directamente sin tirada.',
      5: 'Pasiva/PDA · Físico · Ofensiva/Ejecución. Si el usuario realiza al menos 1 punto de daño real y el objetivo queda con 7 o menos de vida, tira 4 PDA para ejecutar al objetivo. Si queda con 4 o menos de vida, se ejecuta directamente sin tirada.',
    },
  },
  criticalHit: {
    id: 'criticalHit',
    label: 'Golpe crítico',
    icon: 'assets/factors/factor-dano-critico.svg',
    classification: { applicationModes: ['passive'], applicationTags: ['pda'], natures: ['physical'], functionalCategories: ['offensive'] },
    tags: ['factor', 'ofensivo', 'crítico', 'PDA', 'daño'],
    summary: 'Factor ofensivo que puede multiplicar el daño del ataque al activarse.',
    pdaByLevel: { 1: 2, 2: 3, 3: 5, 4: 7, 5: 8 },
    multiplierByLevel: { 1: 1.5, 2: 2, 3: 2.5, 4: 3, 5: 4 },
    descriptions: {
      1: 'Pasivo/PDA · Físico · Ofensiva. Los ataques del usuario tendrán 2 PDA para multiplicar x1.5 el daño de sus ataques. El daño crítico no aplica si el ataque impacta en un escudo F o estructuras.',
      2: 'Pasivo/PDA · Físico · Ofensiva. Los ataques del usuario tendrán 3 PDA para multiplicar x2 el daño de sus ataques. El daño crítico no aplica si el ataque impacta en un escudo F o estructuras.',
      3: 'Pasivo/PDA · Físico · Ofensiva. Los ataques del usuario tendrán 5 PDA para multiplicar x2.5 el daño de sus ataques. El daño crítico no aplica si el ataque impacta en un escudo F o estructuras.',
      4: 'Pasivo/PDA · Físico · Ofensiva. Los ataques del usuario tendrán 7 PDA para multiplicar x3 el daño de sus ataques. El daño crítico no aplica si el ataque impacta en un escudo F o estructuras.',
      5: 'Pasivo/PDA · Físico · Ofensiva. Los ataques del usuario tendrán 8 PDA para multiplicar x4 el daño de sus ataques. El daño crítico no aplica si el ataque impacta en un escudo F o estructuras.',
    },
  },
};

function getFactorProfile(factorId) {
  return FACTOR_DB[factorId] || null;
}

function getCardAttackFactors(card) {
  return Array.isArray(card?.attackProfile?.factors) ? card.attackProfile.factors : [];
}

function getCardAttackFactor(card, factorId) {
  return getCardAttackFactors(card).find(factor => factor?.id === factorId) || null;
}

function getLethalityConfig(level = 1) {
  const factor = getFactorProfile('lethality');
  const safeLevel = Math.max(1, Math.min(5, Number(level) || 1));
  return {
    level: safeLevel,
    pda: Number(factor?.pdaByLevel?.[safeLevel] ?? 0),
    threshold: Number(factor?.executionThresholdByLevel?.[safeLevel] ?? 0),
    directThreshold: Number(factor?.directThresholdByLevel?.[safeLevel] ?? 0),
  };
}

function getFactorPda(factorId, level = 1) {
  const factor = getFactorProfile(factorId);
  return Number(factor?.pdaByLevel?.[level] ?? level ?? 0);
}

function getEffectiveFactorPda(factorId, level = 1, source = null, factorEntry = null) {
  const base = getFactorPda(factorId, level);
  const unit = source?.unit || null;
  const sourceCard = source?.card || CARD_LIBRARY[unit?.cardId];
  if (
    unit &&
    Number(unit.kageNoMichiPdaOverride || 0) > 0 &&
    factorEntry?.source === 'assassin' &&
    Array.isArray(sourceCard?.qualities) &&
    sourceCard.qualities.includes('assassin')
  ) {
    return Math.max(base, Number(unit.kageNoMichiPdaOverride || 0));
  }
  return base;
}


function getCardRuntimeKageDamageBonus(card = null) {
  return Math.max(0, Number(card?.__runtime?.kageNoMichiDamageBonus || 0));
}

function getEffectiveUnitDamageValue(unit = null, card = null) {
  const base = Number(unit?.damage ?? card?.attackProfile?.damage ?? card?.stats?.damage ?? 0);
  return base + Math.max(0, Number(unit?.kageNoMichiDamageBonus || 0));
}

function getRuntimeSourceForCardInfo(card = null) {
  const runtime = card?.__runtime || {};
  if (!runtime?.unitId || !runtime?.playerId) return null;
  const unit = getUnitById(runtime.playerId, runtime.unitId);
  if (!unit) return null;
  return { playerId: runtime.playerId, unit, card };
}


function getFactorMultiplier(factorId, level = 1) {
  const factor = getFactorProfile(factorId);
  return Number(factor?.multiplierByLevel?.[level] ?? 1);
}

function rollPda(pda = 0) {
  const value = Math.max(0, Math.min(8, Number(pda) || 0));
  if (value >= 8) return true;
  if (value <= 0) return false;
  return Math.floor(Math.random() * 8) + 1 <= value;
}

function rollPrecisionPda(pda = 0) {
  const value = Math.max(0, Math.min(6, Number(pda) || 0));
  if (value >= 6) return true;
  if (value <= 0) return false;
  return Math.floor(Math.random() * 6) + 1 <= value;
}

function buildTagListHtml(tags = []) {
  if (!Array.isArray(tags) || tags.length === 0) return '';
  const [rootTag, ...childTags] = tags;
  const rootHtml = rootTag ? `<span class="meta-info-tag-root">${rootTag}</span>` : '';
  const arrowHtml = rootTag && childTags.length ? '<span class="meta-info-tag-arrow" aria-hidden="true"></span>' : '';
  const childHtml = childTags.map(tag => `<span class="meta-info-tag-child">${tag}</span>`).join('');
  return `<div class="meta-info-tags">${rootHtml}${arrowHtml}${childHtml}</div>`;
}


const CARD_FOCUS_LABELS = {
  mobility: 'Movilidad',
  tempo: 'Tempo',
  damage: 'Daño',
  resistance: 'Resistencia',
  armor: 'Armadura',
  control: 'Control',
  stealth: 'Sigilo',
  versatility: 'Versatilidad',
  precision: 'Precisión',
  reach: 'Alcance',
  utility: 'Utilidad',
};

function getCardFocusTags(card) {
  if (!card) return [];
  const stats = card.stats || {};
  const attack = getAttackProfile(card) || {};
  const modifiers = Array.isArray(attack.modifiers) ? attack.modifiers : [];
  const runtime = card.__runtime || {};
  const activeEffects = Array.isArray(runtime.effects) ? runtime.effects : [];
  const score = {
    mobility: 0,
    tempo: 0,
    damage: 0,
    resistance: 0,
    armor: 0,
    control: 0,
    stealth: 0,
    versatility: 0,
    precision: 0,
    reach: 0,
    utility: 0,
  };

  const lifeNow = Number(runtime.hp ?? stats.life ?? stats.def ?? 0);
  const maxLife = Number(runtime.maxHp ?? stats.life ?? stats.def ?? lifeNow);
  const defense = Number(stats.def ?? 0);
  const speed = Number(stats.mov ?? 0);
  const castPhases = Number(card.castPhases ?? 2);
  const restore = Number(stats.restore ?? 2);
  const attackDamage = Number(attack.damage ?? stats.damage ?? 0);
  const attackRange = Number(attack.range ?? 1);
  const precision = Number(attack.precision ?? 0);

  // Importante: estos tags NO leen el potencial abstracto de raza/cualidad.
  // Solo miden lo que la copia realmente tiene ahora mismo: stats, perfil ofensivo,
  // movimiento, estado activo y futuros buffs/debuffs guardados en __runtime.
  score.resistance += lifeNow * 1.85;
  score.resistance += maxLife >= 4 ? 0.7 : 0;
  score.resistance -= lifeNow <= 1 ? 1.4 : 0;

  score.damage += attackDamage * 2.15;
  score.damage += attack.damageNature === 'direct' ? 1.1 : 0;
  score.damage += attack.applicationId === 'penetration' ? 0.8 : 0;
  score.damage += attack.applicationId === 'oscillationComplete' ? 0.95 : 0;
  score.damage += attack.applicationId === 'oscillationPartial' ? 0.45 : 0;
  score.damage += attackRange > 1 ? Math.min(1.2, (attackRange - 1) * 0.35) : 0;

  score.mobility += speed * 1.15;
  score.mobility += runtime.movesLeft > 0 ? 0.5 : 0;
  score.mobility += /completa|mejorada|adaptable|equis|x/i.test(card.movementType || '') ? 1.15 : 0;
  score.mobility += /sostenid|frontal/i.test(card.movementType || '') ? 0.25 : 0;

  score.tempo += castPhases <= 0 ? 2.2 : Math.max(0, 3 - castPhases) * 1.15;
  score.tempo += restore <= 0 ? 1.7 : Math.max(0, 3 - restore) * 1.05;
  score.tempo += runtime.status === 'active' ? 0.2 : 0;
  score.tempo -= runtime.status === 'restoring' ? 2.0 : 0;

  score.armor += defense * 1.9;
  score.armor += defense >= 3 ? 0.8 : 0;

  score.control += modifiers.includes('control') ? 2.0 : 0;
  score.control += attack.applicationId === 'penetration' ? 0.5 : 0;
  score.control += attack.applicationId === 'oscillationPartial' ? 0.35 : 0;

  score.precision += Math.max(0, precision - 3) * 0.75;
  score.precision += precision >= 6 ? 1.1 : 0;

  score.reach += Math.max(0, attackRange - 1) * 1.7;
  score.reach += attack.combatMode === 'distance' ? 1.3 : 0;
  score.reach += attack.combatMode === 'range' ? 0.95 : 0;

  score.versatility += Object.keys(card.weaponConditions || {}).length > 1 ? 1.4 : 0;
  score.versatility += Array.isArray(card.extraWeapons) ? card.extraWeapons.length * 0.9 : 0;
  score.versatility += modifiers.length > 1 ? 0.8 : 0;

  score.utility += activeEffects.filter(e => e && (e.kind === 'utility' || e.tag === 'utility')).length * 1.25;
  score.stealth += activeEffects.some(e => e && (e.id === 'sigilo' || e.tag === 'sigilo' || e.kind === 'stealth')) ? 3.0 : 0;

  if (card.focusScoreModifiers && typeof card.focusScoreModifiers === 'object') {
    Object.entries(card.focusScoreModifiers).forEach(([key, value]) => {
      if (key in score) score[key] += Number(value) || 0;
    });
  }
  if (runtime.focusScoreModifiers && typeof runtime.focusScoreModifiers === 'object') {
    Object.entries(runtime.focusScoreModifiers).forEach(([key, value]) => {
      if (key in score) score[key] += Number(value) || 0;
    });
  }

  const ranked = Object.entries(score)
    .filter(([, value]) => value > 0)
    .sort((a, b) => b[1] - a[1]);

  const selected = [];
  for (const [id, value] of ranked) {
    if (selected.length >= 3) break;
    if (value < 1.85 && selected.length > 0) continue;
    const label = CARD_FOCUS_LABELS[id];
    if (!label) continue;
    if (!selected.includes(label)) selected.push(label);
  }

  if (selected.length === 0) selected.push('Equilibrio');
  while (selected.length < 3) {
    const fallback = ['Resistencia', 'Movilidad', 'Tempo'].find(tag => !selected.includes(tag));
    if (!fallback) break;
    selected.push(fallback);
  }
  return selected.slice(0, 3);
}

function getUnitFromInfoMeta(meta = {}) {
  if (meta?.source !== 'arena' || !meta.unitId || meta.playerId == null) return null;
  return state.players?.[meta.playerId]?.units?.find(unit => unit.id === meta.unitId) || null;
}

function buildCardInfoViewModel(card, meta = {}) {
  const unit = getUnitFromInfoMeta(meta);
  if (!unit) return card;
  const stats = {
    ...(card.stats || {}),
    atk: unit.atk ?? card.stats?.atk,
    def: unit.def ?? card.stats?.def,
    damage: unit.damage ?? card.stats?.damage,
    life: unit.hp ?? unit.maxHp ?? card.stats?.life,
    mov: unit.mov ?? card.stats?.mov,
    restore: unit.restoreTime ?? card.stats?.restore,
  };
  const attackProfile = {
    ...(card.attackProfile || {}),
    damage: unit.damage ?? card.attackProfile?.damage ?? card.stats?.damage,
  };
  const effectiveMovementType = getEffectiveMovementTypeForUnit(meta.playerId, unit);
  return {
    ...card,
    stats,
    attackProfile,
    movementType: effectiveMovementType,
    __runtime: {
      unitId: unit.id,
      playerId: meta.playerId,
      source: 'arena',
      hp: unit.hp,
      maxHp: unit.maxHp,
      baseHp: unit.baseHp,
      movesLeft: unit.movesLeft,
      status: unit.status,
      restoreRemaining: unit.restoreRemaining,
      row: unit.row,
      col: unit.col,
      effects: unit.effects || unit.activeEffects || [],
      focusScoreModifiers: unit.focusScoreModifiers || {},
      smokeBombsLeft: unit.smokeBombsLeft ?? null,
      activeFactors: unit.activeFactors || [],
      kageNoMichiDamageBonus: Math.max(0, Number(unit.kageNoMichiDamageBonus || 0)),
      kageNoMichiPdaOverride: Math.max(0, Number(unit.kageNoMichiPdaOverride || 0)),
    },
  };
}

function renderCardInfoSummaryTags(card) {
  if (!els.cardInfoSummaryTags) return;
  const tags = getCardFocusTags(card);
  const runtimePos = card?.__runtime && Number.isFinite(card.__runtime.row) && Number.isFinite(card.__runtime.col)
    ? `Casilla ${coordLabel(card.__runtime.row, card.__runtime.col)}`
    : '';
  if (runtimePos) tags.push(runtimePos);
  if (!tags.length) {
    els.cardInfoSummaryTags.innerHTML = '';
    return;
  }
  const color = getElementColorById(getCardElementId(card));
  const [primary, ...secondary] = tags;
  els.cardInfoSummaryTags.style.setProperty('--summary-tag-color', color || '#9b4dff');
  els.cardInfoSummaryTags.innerHTML = `
    <div class="card-summary-tags">
      <span class="card-summary-tag card-summary-tag-primary">${primary}</span>
      ${secondary.map(tag => `<span class="card-summary-tag card-summary-tag-secondary">${tag}</span>`).join('')}
    </div>`;
}

const ELEMENT_INFO_DB = {
  oscuridad: {
    title: 'Oscuridad - Misterio',
    summary: 'Uso de conjuros que ocultan y confunden, con invocaciones que pueden desaparecer y reaparecer.',
    elementFlow: 'Hechizos caros pero con gran impacto ofensivo, equilibrado en el resto de conjuros.',
    tempo: 'Flujo de juego normal. Tiempo de kasteo normal para invocaciones y hechizos, enfriamiento alto para habilidades.',
    invocations: 'Invocaciones con mucho daño y poca vida, con habilidades de utilidad que les permiten pasar desapercibidas.',
    strongAgainst: 'Rayo',
    weakAgainst: 'Luz',
    description: 'El elemento Oscuridad se enfoca en el misterio y el engaño, utilizando hechizos que ocultan a tus invocaciones y confunden al enemigo. Las invocaciones de Oscuridad suelen aplicar daño adicional descomunal debido a su facilidad para aplicar factores por medio de ataque, además pueden tener habilidades que les permiten desaparecer y reaparecer, proporcionando una ventaja engañosa y táctica en el combate. Es un elemento enfocado en la utilización de trampas ocultas que afectan la toma de decisiones del rival.',
  },
  luz: {
    title: 'Luz - Revelación',
    summary: 'Uso de conjuros que iluminan y revelan información, con capacidades curativas y purificadoras para las invocaciones aliadas o kasters aliados. Enfoca la defensiva al uso de estructuras.',
    elementFlow: 'Estructuras menos costosas, invocaciones voladoras muy costosas y equilibrio en el resto de conjuros.',
    tempo: 'Flujo de juego normal. Tiempo de kasteo alto para invocaciones voladoras, normal para otros conjuros y enfriamiento normal para habilidades.',
    invocations: 'Invocaciones voladoras extremadamente poderosas.',
    strongAgainst: 'Oscuridad',
    weakAgainst: 'Muerte',
    description: 'El elemento Luz se enfoca en el uso de estructuras que proveen defensas difíciles de superar. Además, es especialista en la revelación y la purificación, utilizando hechizos que iluminan y revelan información sobre el enemigo. Los conjuros de Luz pueden tener capacidades curativas y purificadoras que limpian efectos negativos y aumentan de forma excesiva la vida del kaster, lo que proporciona una ventaja de durabilidad. Además, sus poderosas invocaciones voladoras proporcionan una capacidad ofensiva sin igual en una etapa tardía del juego.',
    idealFor: 'Jugadores estratégicos que valoran tanto la defensa sólida como la información táctica, mediante un estilo de juego equilibrado que asegura ventaja en las fases avanzadas del juego.',
  },
  agua: {
    title: 'Agua - Conocimiento',
    summary: 'Ralentización de movimiento, silencio, dominio de kasteo y consumo elemental, con enfoque al daño mágico o elemental.',
    elementFlow: 'Equilibrado.',
    tempo: 'Desarrollo de la partida progresivo. Bajo tiempo de kasteo en hechizos, medio en otros conjuros, enfriamiento de habilidades medio.',
    invocations: 'Equilibradas.',
    uniqueInvocation: 'Orco',
    strongAgainst: 'Fuego - Destrucción',
    weakAgainst: 'Rayo - Sanación',
    description: 'El elemento Agua se enfoca en el conocimiento y la sabiduría, utilizando hechizos defensivos y tácticos para mantener a sus invocaciones y al kaster a salvo, además de alterar el consumo de elementos del rival. Los kasters de agua suelen modificar la arena de combate, adaptándola a un entorno acuático que proporcione ventajas a las invocaciones nadadoras o anfibias. También suelen enfocarse al uso de la magia como su principal fuente de acción, fomentando la manipulación de las mentes. Las invocaciones de Agua son equilibradas en daño y vida, y están equipadas con habilidades que pueden alterar el avance normal de las invocaciones enemigas, su capacidad para atacar o usar habilidades, así como afectar el kasteo rival, proporcionando una ventaja estratégica significativa. En general, el daño aplicado por estos conjuros será de tipo mágico o elemental.',
    idealFor: 'Jugadores estratégicos y analíticos que disfrutan de un estilo defensivo y meticuloso para mantener el control de la partida.',
  },
  fuego: {
    title: 'Fuego - Destrucción',
    summary: 'Dominio del poder destructivo, con ataques potentes, devastadores y daño directo.',
    elementFlow: 'Hechizos más costosos, pero con menos tiempo de kasteo que otros elementos. Costo promedio en otros conjuros.',
    tempo: 'Desarrollo normal, pero agresivo. Tiempo de kasteo de invocaciones bajo, medio en hechizos, enfriamiento de habilidades alto.',
    invocations: 'Muy fuertes, de resistencia media.',
    strongAgainst: 'Tierra',
    weakAgainst: 'Agua',
    description: 'El elemento Fuego se especializa en la destrucción total del oponente, utilizando hechizos y habilidades que causan explosiones, quemaduras y devastación en el campo de batalla. Las invocaciones de Fuego son temibles y encarnan el caos y la furia del fuego, capaces de desintegrar las defensas y reducir a cenizas a sus enemigos. El poder de Fuego no solo reside en el daño directo, sino también en su capacidad para romper la moral del oponente y mantener una ofensiva implacable. Las habilidades de destrucción masiva hacen que Fuego sea un elemento letal en el combate.',
    idealFor: 'Jugadores que prefieren una estrategia ofensiva y devastadora que desgaste al rival y mantenga un hostigamiento continuo.',
  },
  tierra: {
    title: 'Tierra - Vida',
    summary: 'Dominio de la sustentabilidad de recursos y el fortalecimiento de invocaciones.',
    elementFlow: 'Invocaciones y hechizos más caros que los otros elementos, pero muy poderosos.',
    tempo: 'Desarrollo de la partida muy rápido y agresivo. Tiempos de kasteo alto en invocaciones y hechizos, enfriamiento de habilidades medio.',
    invocations: 'Principalmente terrestres, de daño medio pero muy resistentes.',
    strongAgainst: 'Tiempo - Equilibrio',
    weakAgainst: 'Fuego - Destrucción',
    description: 'El elemento Tierra se centra en la sustentabilidad elemental y el fortalecimiento constante de las invocaciones mediante diversos conjuros. Los kasters de Tierra tienen la habilidad de auto regenerar y sobre producir recursos y fortalecer a las invocaciones, proporcionándoles defensas mejoradas y capacidad de resistencia en el campo de batalla. Este enfoque permite a los jugadores controlar el flujo de la batalla mediante la auto regeneración continua y la protección robusta de sus fuerzas.',
    idealFor: 'Jugadores que prefieren estrategias complejas y poderosas desde una etapa temprana del juego, con resistencia prolongada para enfrentar problemáticas del rival.',
  },
};

const ELEMENT_PROFILE_DB = {
  oscuridad: {
    color: '#9b4dff',
    sections: {
      elementFlow: {
        title: 'Manejo de elementos',
        summary: 'Oscuridad paga más por hechizos de impacto, pero mantiene costos normales en invocaciones y estructuras.',
        bars: [
          { label: 'Costo de invocaciones', value: 3, note: 'Equilibrado' },
          { label: 'Costo de hechizos', value: 4, note: 'Caro, alto impacto ofensivo' },
          { label: 'Costo de estructuras', value: 3, note: 'Equilibrado' },
        ],
        notes: [
          'Sus hechizos no buscan ser baratos, sino decisivos.',
          'El resto de conjuros mantiene una curva estable para permitir juego táctico y trampas ocultas.',
        ],
      },
      tempo: {
        title: 'Tempo',
        summary: 'Flujo normal, con habilidades de enfriamiento alto para evitar abuso de desaparición, sigilo y reaparecer.',
        bars: [
          { label: 'Velocidad de desarrollo', value: 3, note: 'Normal' },
          { label: 'Tiempo de kasteo: invocaciones', value: 3, note: 'Normal' },
          { label: 'Tiempo de kasteo: hechizos', value: 3, note: 'Normal' },
          { label: 'Enfriamiento de habilidades', value: 4, note: 'Alto' },
        ],
        notes: [
          'La presión de Oscuridad viene del engaño y la oportunidad, no de acelerar la partida.',
          'Sus habilidades fuertes deben descansar más para conservar balance.',
        ],
      },
      invocations: {
        title: 'Invocaciones',
        summary: 'Unidades de alto daño y poca vida, apoyadas por sigilo, confusión, desaparición y castigo selectivo.',
        bars: [
          { label: 'Daño', value: 5, note: 'Muy alto' },
          { label: 'Vida / resistencia', value: 2, note: 'Baja' },
          { label: 'Movilidad táctica', value: 4, note: 'Alta por ocultamiento y reposición' },
          { label: 'Control / engaño', value: 5, note: 'Muy alto' },
        ],
        notes: [
          'Brilla castigando objetivos vulnerables, aislados o distraídos.',
          'Suele perder valor si se le fuerza a pelear de frente por mucho tiempo.',
        ],
      },
    },
  },
  luz: {
    color: '#ffd76a',
    sections: {
      elementFlow: {
        title: 'Manejo de elementos',
        summary: 'Estructuras menos costosas, invocaciones voladoras muy costosas y equilibrio en el resto de conjuros.',
        bars: [
          { label: 'Costo de estructuras', value: 2, note: 'Menos costosas' },
          { label: 'Costo de invocaciones voladoras', value: 5, note: 'Muy costosas' },
          { label: 'Resto de conjuros', value: 3, note: 'Equilibrado' },
        ],
        notes: [
          'Luz enfoca su defensiva en estructuras difíciles de superar.',
          'Sus invocaciones voladoras son muy poderosas, pero requieren una inversión elemental alta.',
        ],
      },
      tempo: {
        title: 'Tempo',
        summary: 'Flujo de juego normal, con kasteo alto para invocaciones voladoras y ritmo estable para otros conjuros.',
        bars: [
          { label: 'Flujo de juego', value: 3, note: 'Normal' },
          { label: 'Kasteo: invocaciones voladoras', value: 5, note: 'Alto' },
          { label: 'Kasteo: otros conjuros', value: 3, note: 'Normal' },
          { label: 'Enfriamiento de habilidades', value: 3, note: 'Normal' },
        ],
        notes: [
          'La curva de Luz se estabiliza con defensas y revelación antes de explotar su etapa tardía.',
          'Las invocaciones voladoras llegan tarde, pero aportan una ofensiva muy alta.',
        ],
      },
      invocations: {
        title: 'Invocaciones',
        summary: 'Invocaciones voladoras extremadamente poderosas, apoyadas por curación, purificación y defensa estructural.',
        bars: [
          { label: 'Poder volador tardío', value: 5, note: 'Extremo' },
          { label: 'Defensa / estructuras', value: 5, note: 'Muy alta' },
          { label: 'Curación / purificación', value: 4, note: 'Alta' },
          { label: 'Revelación / información', value: 5, note: 'Muy alta' },
        ],
        notes: [
          'Sus conjuros iluminan y revelan información sobre el enemigo.',
          'Puede limpiar efectos negativos y aumentar de forma excesiva la vida del kaster o aliados.',
        ],
      },
    },
  },
  agua: {
    color: '#28d7ff',
    sections: {
      elementFlow: {
        title: 'Manejo de elementos',
        summary: 'Agua funciona como referencia equilibrada para comparar costos de otros elementos.',
        bars: [
          { label: 'Costo de invocaciones', value: 3, note: 'Equilibrado' },
          { label: 'Costo de hechizos', value: 3, note: 'Equilibrado' },
          { label: 'Costo de estructuras', value: 3, note: 'Equilibrado' },
        ],
        notes: [
          'Sirve como línea base para cálculo de costos.',
          'Su ventaja viene de control, silencio, ralentización y manipulación del kasteo rival.',
        ],
      },
      tempo: {
        title: 'Tempo',
        summary: 'Desarrollo progresivo, con hechizos rápidos y otros conjuros de ritmo medio.',
        bars: [
          { label: 'Velocidad de desarrollo', value: 3, note: 'Progresiva' },
          { label: 'Tiempo de kasteo: invocaciones', value: 3, note: 'Medio' },
          { label: 'Tiempo de kasteo: hechizos', value: 2, note: 'Bajo / rápido' },
          { label: 'Enfriamiento de habilidades', value: 3, note: 'Medio' },
        ],
        notes: [
          'No acelera de golpe, pero estabiliza la partida.',
          'Puede controlar el ritmo enemigo mediante silencio, consumo elemental y ralentización.',
        ],
      },
      invocations: {
        title: 'Invocaciones',
        summary: 'Invocaciones equilibradas en daño y vida, con herramientas de control y soporte táctico.',
        bars: [
          { label: 'Daño', value: 3, note: 'Equilibrado' },
          { label: 'Vida / resistencia', value: 3, note: 'Equilibrada' },
          { label: 'Control táctico', value: 4, note: 'Alto' },
          { label: 'Daño mágico / elemental', value: 4, note: 'Alto' },
        ],
        notes: [
          'Ideal para jugadores que quieren responder y analizar.',
          'Sus criaturas pueden afectar movimiento, ataque, habilidades o kasteo rival.',
        ],
      },
    },
  },
  fuego: {
    color: '#ff4a1f',
    sections: {
      elementFlow: {
        title: 'Manejo de elementos',
        summary: 'Fuego paga más por hechizos destructivos, pero compensa con menor tiempo de kasteo y presión ofensiva.',
        bars: [
          { label: 'Costo de invocaciones', value: 3, note: 'Promedio' },
          { label: 'Costo de hechizos', value: 4, note: 'Caro' },
          { label: 'Costo de estructuras', value: 3, note: 'Promedio' },
        ],
        notes: [
          'Sus hechizos son más caros porque empujan daño directo, quemadura y destrucción masiva.',
          'El costo alto se compensa con velocidad y capacidad de cerrar partidas.',
        ],
      },
      tempo: {
        title: 'Tempo',
        summary: 'Ritmo normal pero agresivo, con invocaciones rápidas de kastear y habilidades de enfriamiento alto.',
        bars: [
          { label: 'Velocidad de presión', value: 4, note: 'Alta' },
          { label: 'Tiempo de kasteo: invocaciones', value: 2, note: 'Bajo / rápido' },
          { label: 'Tiempo de kasteo: hechizos', value: 3, note: 'Medio' },
          { label: 'Enfriamiento de habilidades', value: 4, note: 'Alto' },
        ],
        notes: [
          'Fuego quiere empujar el combate antes de que el rival se estabilice.',
          'Sus habilidades fuertes deben tener enfriamiento alto por su daño explosivo.',
        ],
      },
      invocations: {
        title: 'Invocaciones',
        summary: 'Unidades muy fuertes, agresivas y de resistencia media, diseñadas para romper defensas.',
        bars: [
          { label: 'Daño', value: 5, note: 'Muy alto' },
          { label: 'Vida / resistencia', value: 3, note: 'Media' },
          { label: 'Daño directo / crítico', value: 5, note: 'Muy alto' },
          { label: 'Control defensivo', value: 1, note: 'Bajo' },
        ],
        notes: [
          'Su fortaleza está en eliminar, quemar y presionar.',
          'Tiende a ser menos paciente y menos defensivo que otros elementos.',
        ],
      },
    },
  },
  tierra: {
    color: '#79d632',
    sections: {
      elementFlow: {
        title: 'Manejo de elementos',
        summary: 'Tierra paga más por invocaciones y hechizos, pero produce recursos y crea conjuros muy robustos.',
        bars: [
          { label: 'Costo de invocaciones', value: 5, note: 'Muy caro' },
          { label: 'Costo de hechizos', value: 4, note: 'Caro' },
          { label: 'Costo de estructuras', value: 4, note: 'Caro / robusto' },
          { label: 'Producción elemental', value: 5, note: 'Muy alta' },
        ],
        notes: [
          'Su curva es pesada, pero puede generar más recursos para sostenerla.',
          'Las cartas de Tierra deben sentirse poderosas y duraderas.',
        ],
      },
      tempo: {
        title: 'Tempo',
        summary: 'Desarrollo muy rápido por extracción/producción, pero con kasteos altos en invocaciones y hechizos.',
        bars: [
          { label: 'Velocidad de desarrollo', value: 5, note: 'Muy rápida' },
          { label: 'Tiempo de kasteo: invocaciones', value: 5, note: 'Alto / lento' },
          { label: 'Tiempo de kasteo: hechizos', value: 4, note: 'Alto' },
          { label: 'Enfriamiento de habilidades', value: 3, note: 'Medio' },
        ],
        notes: [
          'Tierra acelera recursos, pero sus cuerpos y hechizos tardan más en materializarse.',
          'Debe sentirse como una avalancha lenta que se vuelve difícil de detener.',
        ],
      },
      invocations: {
        title: 'Invocaciones',
        summary: 'Principalmente terrestres, de daño medio y resistencia muy alta.',
        bars: [
          { label: 'Daño', value: 3, note: 'Medio' },
          { label: 'Vida / resistencia', value: 5, note: 'Muy alta' },
          { label: 'Defensa / protección', value: 5, note: 'Muy alta' },
          { label: 'Velocidad de movimiento', value: 2, note: 'Baja / pesada' },
        ],
        notes: [
          'Su fortaleza es aguantar, proteger y sobrevivir al desgaste.',
          'Menos explosiva que Fuego, pero mucho más resistente.',
        ],
      },
    },
  },
};

const ELEMENT_SECTION_LABELS = {
  elementFlow: 'Manejo de elementos',
  tempo: 'Tempo',
  invocations: 'Invocaciones',
};

function getElementProfile(elementId) {
  return ELEMENT_PROFILE_DB[elementId] || ELEMENT_PROFILE_DB.oscuridad;
}

function buildElementMiniBarsHtml(bars = [], color = '#9b4dff') {
  return `<div class="element-mini-bars" style="--element-profile-color:${color}">
    ${bars.slice(0, 4).map(bar => `
      <span class="element-mini-bar" title="${bar.label}: ${bar.note || bar.value}">
        ${Array.from({ length: 5 }, (_, index) => `<i class="${index < bar.value ? 'filled' : ''}"></i>`).join('')}
      </span>`).join('')}
  </div>`;
}

function buildElementBarsHtml(bars = [], color = '#9b4dff') {
  return `<div class="element-bars" style="--element-profile-color:${color}">
    ${bars.map(bar => `
      <div class="element-bar-row">
        <div class="element-bar-title">
          <strong>${bar.label}</strong>
          <span>${bar.note || ''}</span>
        </div>
        <div class="element-bar-track" aria-label="${bar.label}: ${bar.value} de 5">
          ${Array.from({ length: 5 }, (_, index) => `<i class="${index < bar.value ? 'filled' : ''}"></i>`).join('')}
        </div>
      </div>`).join('')}
  </div>`;
}

function bindElementDetailButtons(elementId) {
  if (!els.cardMetaInfoBody) return;
  els.cardMetaInfoBody.querySelectorAll('[data-element-detail]').forEach(btn => {
    btn.addEventListener('click', () => openElementDetailInfo(elementId, btn.dataset.elementDetail));
  });
}

function openElementDetailInfo(elementId, sectionId) {
  if (!els.cardMetaInfoOverlay) return;
  const domain = DOMAIN_ART_DB[elementId] || DOMAIN_ART_DB.oscuridad;
  const profile = getElementProfile(elementId);
  const section = profile.sections?.[sectionId];
  if (!section) return;
  if (els.cardMetaInfoIcon) {
    els.cardMetaInfoIcon.innerHTML = `
      <span class="meta-info-domain-stack">
        <span class="meta-info-domain-bg"></span>
        <img class="meta-info-domain-element" src="${domain.elementArt}" alt="${domain.elementLabel}">
        <img class="meta-info-domain-attribute" src="${domain.attributeArt}" alt="${domain.attributeLabel}">
      </span>`;
  }
  if (els.cardMetaInfoTitle) els.cardMetaInfoTitle.textContent = `${domain.elementLabel}: ${section.title}`;
  if (els.cardMetaInfoCategory) els.cardMetaInfoCategory.textContent = `Indicadores base · ${domain.attributeLabel}`;
  if (els.cardMetaInfoBody) {
    els.cardMetaInfoBody.innerHTML = `
      <p><strong>Resumen:</strong> ${section.summary}</p>
      ${buildElementBarsHtml(section.bars || [], profile.color)}
      ${(section.notes || []).map(note => `<p class="element-profile-note">${note}</p>`).join('')}
      <button type="button" class="element-profile-back" data-back-to-element="${elementId}">Volver al elemento</button>
    `;
    const back = els.cardMetaInfoBody.querySelector('[data-back-to-element]');
    if (back) back.addEventListener('click', () => openCardMetaInfo('domain', elementId, null));
  }
  els.cardMetaInfoOverlay.classList.add('open');
  els.cardMetaInfoOverlay.setAttribute('aria-hidden', 'false');
}


function getGenderProfile(genderId) {
  return GENDER_DB[genderId] || GENDER_DB.none;
}

function getRaceProfile(raceId) {
  return RACE_DB[raceId] || RACE_DB.human;
}

function getRaceIcon(card, raceId) {
  const race = getRaceProfile(raceId);
  const gender = card?.gender || 'none';
  return race.icons?.[gender] || race.icons?.neutral || race.icons?.none || '';
}

function getElementInfoProfile(elementId) {
  const id = ELEMENT_INFO_DB[elementId] ? elementId : 'oscuridad';
  return { id, ...ELEMENT_INFO_DB[id] };
}

function buildElementInfoHtml(info) {
  const profile = getElementProfile(info.id);
  const sectionButtons = Object.entries(ELEMENT_SECTION_LABELS).map(([sectionId, label]) => {
    const section = profile.sections?.[sectionId];
    if (!section) return '';
    return `
      <button type="button" class="element-profile-card" data-element-detail="${sectionId}" style="--element-profile-color:${profile.color}">
        <span class="element-profile-card-title">${label}</span>
        <span class="element-profile-card-copy">${section.summary}</span>
        ${buildElementMiniBarsHtml(section.bars || [], profile.color)}
        <span class="element-profile-card-action">Ver indicadores</span>
      </button>`;
  }).join('');

  return `
    <p><strong>Resumen:</strong> ${info.summary}</p>
    <div class="element-profile-grid">${sectionButtons}</div>
    <p><strong>Fuerte contra:</strong> ${info.strongAgainst}</p>
    <p><strong>Débil contra:</strong> ${info.weakAgainst}</p>
    <p><strong>Descripción:</strong> ${info.description}</p>
    ${info.uniqueInvocation ? `<p><strong>Invocación única:</strong> ${info.uniqueInvocation}</p>` : ''}
    ${info.idealFor ? `<p><strong>Ideal para:</strong> ${info.idealFor}</p>` : ''}
  `;
}



const DOMAIN_ART_DB = {
  fuego: {
    elementLabel: 'Fuego',
    attributeId: 'destruction',
    attributeLabel: 'Destrucción',
    elementArt: 'assets/domain/domain-element-fire.png',
    attributeArt: 'assets/domain/domain-attribute-destruction.svg',
  },
  agua: {
    elementLabel: 'Agua',
    attributeId: 'knowledge',
    attributeLabel: 'Conocimiento',
    elementArt: 'assets/domain/domain-element-water.png',
    attributeArt: 'assets/domain/domain-attribute-knowledge.svg',
  },
  tierra: {
    elementLabel: 'Tierra',
    attributeId: 'life',
    attributeLabel: 'Vida',
    elementArt: 'assets/domain/domain-element-earth.png',
    attributeArt: 'assets/domain/domain-attribute-life.svg',
  },
  oscuridad: {
    elementLabel: 'Oscuridad',
    attributeId: 'mystery',
    attributeLabel: 'Misterio',
    elementArt: 'assets/domain/domain-element-darkness.png',
    attributeArt: 'assets/domain/domain-attribute-mystery.svg',
  },
  luz: {
    elementLabel: 'Luz',
    attributeId: 'revelation',
    attributeLabel: 'Revelación',
    elementArt: 'assets/domain/domain-element-light.webp',
    attributeArt: 'assets/domain/domain-attribute-revelation.png',
  },
};

function getCardElementId(card) {
  if (card?.domain?.elementId) return card.domain.elementId;
  const costKeys = Object.keys(card?.cost || {});
  return costKeys[0] || 'oscuridad';
}

function getDomainArtProfile(card) {
  return DOMAIN_ART_DB[getCardElementId(card)] || DOMAIN_ART_DB.oscuridad;
}


function localPlayer() { return state.players[LOCAL_PLAYER_ID]; }

function getPlayerElement(playerId) {
  const elementId = getPlayerDomainId(playerId);
  return ELEMENTS.find(el => el.id === elementId) || ELEMENTS[0];
}

function getPlayerElementColor(playerId) {
  const element = getPlayerElement(playerId);
  return element?.color || '#9b4dff';
}

function getElementById(elementId, fallbackId = 'oscuridad') {
  return ELEMENTS.find(el => el.id === elementId) || ELEMENTS.find(el => el.id === fallbackId) || ELEMENTS[0];
}

function getElementColorById(elementId, fallback = '#9b4dff') {
  return getElementById(elementId)?.color || fallback;
}

function getEffectiveCardElementId(card, playerId = null) {
  // Dominio real de la carta. El Kaster NO cambia costos, fondo, skin,
  // respawn ni elemento de la unidad; solo controla ecosistema visual del jugador.
  return getCardElementId(card);
}

function getElementSkinForCard(card, elementId = null) {
  const id = elementId || getCardElementId(card);
  const assetSet = ELEMENT_EXTRACTION_ASSETS[id];
  return assetSet?.skinImage || card?.skinImage || 'assets/card-skin-darkness.png';
}

function getElementBackgroundForCard(card, elementId = null) {
  const typeId = getCardTypeId(card);
  const eligibleTypes = new Set(['invocation', 'kaster', 'structure']);
  if (!eligibleTypes.has(typeId)) return card?.bgImage || 'assets/card-bg-darkness.jpg';
  const id = elementId || getCardElementId(card);
  return DOMAIN_CARD_BACKGROUND_ASSETS[id] || card?.bgImage || 'assets/card-bg-darkness.jpg';
}

function getUnitElementId(playerId, unit) {
  if (unit?.elementId) return unit.elementId;
  const card = CARD_LIBRARY[unit?.cardId];
  return getEffectiveCardElementId(card, playerId);
}

function getUnitElementColor(playerId, unit) {
  return getElementColorById(getUnitElementId(playerId, unit), getPlayerElementColor(playerId));
}

function markInvocationDamageFlash(playerId, unitId, duration = 780) {
  const unit = getUnitById(playerId, unitId);
  if (!unit) return;
  unit.damageFlashUntil = Date.now() + duration;
  window.setTimeout(() => renderCombatHud(), duration + 60);
}

function createElementBurstAtViewport(x, y, color = '#9b4dff', options = {}) {
  const burst = document.createElement('div');
  burst.className = `element-burst-fx ${options.kind || ''}`.trim();
  burst.style.left = `${x}px`;
  burst.style.top = `${y}px`;
  burst.style.setProperty('--burst-color', color);
  const count = options.count || 13;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    const angle = (Math.PI * 2 * i) / count;
    const distance = 18 + ((i * 7) % 20);
    p.style.setProperty('--px', `${Math.cos(angle) * distance}px`);
    p.style.setProperty('--py', `${Math.sin(angle) * distance}px`);
    p.style.animationDelay = `${(i % 5) * 22}ms`;
    burst.appendChild(p);
  }
  document.body.appendChild(burst);
  window.setTimeout(() => burst.remove(), options.duration || 1150);
}


function buildExtractionCardDef(playerId, baseId, elementIdOverride = null) {
  const ownerElement = getPlayerElement(playerId);
  const elementId = elementIdOverride || ownerElement.id;
  const element = ELEMENTS.find(item => item.id === elementId) || ownerElement;
  const baseDef = EXTRACTION_DEFS.find(item => item.id === baseId) || EXTRACTION_DEFS[0];
  const assetSet = ELEMENT_EXTRACTION_ASSETS[element.id] || ELEMENT_EXTRACTION_ASSETS[ownerElement.id] || ELEMENT_EXTRACTION_ASSETS.oscuridad;
  return {
    ...baseDef,
    artImage: assetSet.arts[baseDef.id] || baseDef.artImage,
    bgImage: assetSet.bgImage || baseDef.bgImage,
    skinImage: assetSet.skinImage || baseDef.skinImage,
    elementId: element.id,
    elementLabel: element.label,
    elementColor: element.color,
    sourceType: 'element',
  };
}

const state = {
  paused: false,
  pauseResumeResolvers: [],
  pendingPhaseStartWhilePaused: false,
  targetMenuGeneration: 0,
  combatSelectLockUntil: 0,
  activeCombatActionKey: null,
  lastCombatSelectKey: null,
  lastCombatSelectAt: 0,
  targetMenuLockUntil: 0,
  combatHudDrag: { active: false, moved: false, offsetX: 0, offsetY: 0, x: null, y: null },
  activePlayer: 1,
  phaseIndex: 0,
  activeTab: 0,
  selectedCardSlot: null,
  pendingCard: null,
  pendingPlacement: null,
  randomCostPayment: null,
  infoCard: null,
  cardMetaInfoHistory: [],
  cardMetaInfoCurrent: null,
  selectedMover: null,
  selectedTarget: null,
  pendingCasterDefense: null,
  pendingPowerAction: null,
  phaseUndo: null,
  resolutionActionTaken: false,
  smokeZones: [],
  extractedThisPhase: false,
  extractionAnimating: false,
  aiThinking: false,
  aiEnabled: true,
  devPreviewIndicators: { restore: false },
  players: {
    1: {
      life: 30,
      elementId: 'oscuridad',
      resources: [],
      elementDeck: [],
      elementDiscard: [],
      caster: { id: 'p1Caster', casterId: 'hanzoDark', cardId: 'kasterHanzoDark', name: 'Hattori Hanzo', domainId: 'oscuridad', elementId: 'oscuridad', row: 13, col: 4, atk: 4, def: 2, life: 30, maxLife: 30, movesLeft: 0, state: 'ready' },
      guardians: [
        { id: 'p1GuardianL', row: 13, col: 2, resistance: 5, active: true },
        { id: 'p1GuardianR', row: 13, col: 6, resistance: 5, active: true },
      ],
      handTabs: [
        ['naitoSutoka', 'naitoSutoka', 'naitoSutoka', 'ninjaNaitoSutoka', 'ninjaOjoDeBuho', 'spellKageNoMichi', null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null],
      ],
      castQueue: [],
      units: [],
      spawnMarkers: [],
    },
    2: {
      life: 30,
      elementId: 'luz',
      domainId: 'luz',
      resources: [],
      elementDeck: [],
      elementDiscard: [],
      caster: { id: 'p2Caster', casterId: 'tokugawaLight', cardId: 'kasterTokugawaLight', name: 'Ieyasu Tokugawa', domainId: 'luz', elementId: 'luz', row: 4, col: 4, atk: 4, def: 2, life: 30, maxLife: 30, movesLeft: 0, state: 'ready' },
      guardians: [
        { id: 'p2GuardianL', row: 4, col: 2, resistance: 5, active: true },
        { id: 'p2GuardianR', row: 4, col: 6, resistance: 5, active: true },
      ],
      handTabs: [['samuraiBushiHonorable', 'samuraiBushiHonorable', 'samuraiBushiHonorable', 'samuraiAkari', 'samuraiToyotomiHideyoshi', null, null, null, null, null, null, null], [], []],
      castQueue: [],
      units: [],
      spawnMarkers: [],
    },
  },
};

const els = {};

function init() {
  cacheEls();
  applyVisualDevSettings();
  buildPhaseBoxes();
  buildGrid();
  bindEvents();
  initializeElementDecks();
  buildFountainFx();
  enterPhase(true, true);
  renderAll();
  const introTransitions = [
    { text: 'INICIA EL COMBATE', playerId: 1, duration: 1150 },
    { text: 'EXTRACCIÓN', playerId: 1, duration: 900 },
  ];
  queueTransitions(introTransitions);
  schedulePhaseStartActions(sumTransitionDurations(introTransitions) - 120);
}

function cacheEls() {
  els.phaseBoxes = document.getElementById('phaseBoxes');
  els.turnBanner = document.getElementById('turnBanner');
  els.nextPhaseBtn = document.getElementById('nextPhaseBtn');
  els.enemyGrid = document.getElementById('enemyGrid');
  els.allyGrid = document.getElementById('allyGrid');
  els.spawnMarkersLayer = document.getElementById('spawnMarkersLayer');
  els.moveOptionsLayer = document.getElementById('moveOptionsLayer');
  els.board = document.getElementById('board');
  els.boardPanel = document.querySelector('.board-panel');
  els.boardContent = document.getElementById('boardContent');
  els.unitsLayer = document.getElementById('unitsLayer');
  els.smokeBombMarkersLayer = document.getElementById('smokeBombMarkersLayer');
  if (!els.smokeBombMarkersLayer && els.boardContent) {
    els.smokeBombMarkersLayer = document.createElement('div');
    els.smokeBombMarkersLayer.id = 'smokeBombMarkersLayer';
    els.smokeBombMarkersLayer.className = 'smoke-bomb-markers-layer';
    els.boardContent.insertBefore(els.smokeBombMarkersLayer, els.spawnMarkersLayer || els.unitsLayer);
  }
  els.smokeZonesLayer = document.getElementById('smokeZonesLayer');
  if (!els.smokeZonesLayer && els.boardContent) {
    els.smokeZonesLayer = document.createElement('div');
    els.smokeZonesLayer.id = 'smokeZonesLayer';
    els.smokeZonesLayer.className = 'smoke-zones-layer';
    els.boardContent.insertBefore(els.smokeZonesLayer, els.unitsLayer);
  }
  els.targetAccessPanel = document.getElementById('targetAccessPanel');
  if (!els.targetAccessPanel && els.boardContent) {
    els.targetAccessPanel = document.createElement('div');
    els.targetAccessPanel.id = 'targetAccessPanel';
    els.targetAccessPanel.className = 'target-access-panel';
    els.boardContent.appendChild(els.targetAccessPanel);
  }
  els.arenaEffectTrackers = document.getElementById('arenaEffectTrackers');
  if (!els.arenaEffectTrackers && els.boardContent) {
    els.arenaEffectTrackers = document.createElement('div');
    els.arenaEffectTrackers.id = 'arenaEffectTrackers';
    els.arenaEffectTrackers.className = 'arena-effect-trackers';
    els.boardContent.appendChild(els.arenaEffectTrackers);
  }
  els.extractionFxLayer = document.getElementById('extractionFxLayer');
  els.globalFxLayer = document.getElementById('globalFxLayer');
  els.cardGrid = document.getElementById('cardGrid');
  els.resourceBar = document.getElementById('resourceBar');
  els.enemyMiniHud = document.getElementById('enemyMiniHud');
  els.enemyMiniResources = document.getElementById('enemyMiniResources');
  els.enemyMiniCastQueue = document.getElementById('enemyMiniCastQueue');
  els.castQueue = document.getElementById('castQueue');
  els.systemLog = document.getElementById('systemLog');
  els.transitionOverlay = document.getElementById('transitionOverlay');
  els.transitionText = document.getElementById('transitionText');
  els.p1Life = document.getElementById('p1Life');
  els.p1ElementCount = document.getElementById('p1ElementCount');
  els.casterAtk = document.getElementById('casterAtk');
  els.casterDef = document.getElementById('casterDef');
  els.casterCast = document.getElementById('casterCast');
  els.casterState = document.getElementById('casterState');
  els.casterWideBg = document.getElementById('casterWideBg');
  els.casterWideArt = document.getElementById('casterWideArt');
  els.casterWideSkin = document.getElementById('casterWideSkin');
  els.casterWideName = document.getElementById('casterWideName');
  els.casterWideTag = document.getElementById('casterWideTag');
  els.casterWideDomain = document.getElementById('casterWideDomain');
  els.cardInfoOverlay = document.getElementById('cardInfoOverlay');
  els.cardInfoPreview = document.getElementById('cardInfoPreview');
  els.cardInfoName = document.getElementById('cardInfoName');
  els.cardInfoType = document.getElementById('cardInfoType');
  els.cardInfoMetaIcons = document.getElementById('cardInfoMetaIcons');
  els.cardInfoSummaryTags = document.getElementById('cardInfoSummaryTags');
  els.cardInfoExtraPanel = document.getElementById('cardInfoExtraPanel');
  els.cardInfoDamage = document.getElementById('cardInfoDamage');
  els.cardInfoLife = document.getElementById('cardInfoLife');
  els.cardInfoDefense = document.getElementById('cardInfoDefense');
  els.cardInfoAttackType = document.getElementById('cardInfoAttackType');
  els.cardInfoRange = document.getElementById('cardInfoRange');
  els.cardInfoFactors = document.getElementById('cardInfoFactors');
  els.cardInfoMoveType = document.getElementById('cardInfoMoveType');
  els.cardInfoBiotype = document.getElementById('cardInfoBiotype');
  els.cardInfoMove = document.getElementById('cardInfoMove');
  els.cardInfoCastTime = document.getElementById('cardInfoCastTime');
  els.cardInfoCost = document.getElementById('cardInfoCost');
  els.cardInfoRestoreTime = document.getElementById('cardInfoRestoreTime');
  els.cardInfoKastBtn = document.getElementById('cardInfoKastBtn');
  els.cardInfoCloseBtn = document.getElementById('cardInfoCloseBtn');
  els.randomCostOverlay = document.getElementById('randomCostOverlay');
  els.randomCostTitle = document.getElementById('randomCostTitle');
  els.randomCostBody = document.getElementById('randomCostBody');
  els.randomCostOptions = document.getElementById('randomCostOptions');
  els.randomCostRemaining = document.getElementById('randomCostRemaining');
  els.randomCostConfirmBtn = document.getElementById('randomCostConfirmBtn');
  els.randomCostCancelBtn = document.getElementById('randomCostCancelBtn');
  els.infoChip = document.getElementById('infoChip');
  els.cssRefreshBtn = document.getElementById('cssRefreshBtn');
  els.visualRefreshBtn = document.getElementById('visualRefreshBtn');
  els.mainStylesheet = document.getElementById('mainStylesheet');
  els.patchInfoOverlay = document.getElementById('patchInfoOverlay');
  els.patchInfoCloseBtn = document.getElementById('patchInfoCloseBtn');
  els.patchInfoTitle = document.getElementById('patchInfoTitle');
  els.patchInfoBody = document.getElementById('patchInfoBody');
  els.cardMetaInfoOverlay = document.getElementById('cardMetaInfoOverlay');
  els.cardMetaInfoCloseBtn = document.getElementById('cardMetaInfoCloseBtn');
  els.cardMetaInfoBackBtn = document.getElementById('cardMetaInfoBackBtn');
  els.cardMetaInfoIcon = document.getElementById('cardMetaInfoIcon');
  els.cardMetaInfoTitle = document.getElementById('cardMetaInfoTitle');
  els.cardMetaInfoCategory = document.getElementById('cardMetaInfoCategory');
  els.cardMetaInfoBody = document.getElementById('cardMetaInfoBody');
}

function buildPhaseBoxes() {
  els.phaseBoxes.innerHTML = '';
  PHASE_INDICATORS.forEach((phase, index) => {
    const box = document.createElement('div');
    box.className = 'phase-box';
    box.dataset.index = String(index);
    box.dataset.phaseId = phase.id;
    box.textContent = phase.label;
    if (phase.id === 'casting') {
      const undoBtn = document.createElement('button');
      undoBtn.type = 'button';
      undoBtn.className = 'phase-undo-btn';
      undoBtn.textContent = '↩';
      undoBtn.title = 'Volver a Kasteo si todavía no hiciste acciones en Resolución';
      undoBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        undoResolutionToCasting();
      });
      box.appendChild(undoBtn);
    }
    els.phaseBoxes.appendChild(box);
  });
}

function buildGrid() {
  els.enemyGrid.innerHTML = '';
  els.allyGrid.innerHTML = '';
  for (let row = 0; row < 18; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = document.createElement('button');
      cell.className = `cell ${row >= 9 ? 'ally' : 'enemy'}`;
      cell.dataset.row = String(row);
      cell.dataset.col = String(col);
      const label = coordLabel(row, col);
      cell.title = label;
      cell.dataset.label = label;
      const labelSpan = document.createElement('span');
      labelSpan.className = 'cell-label';
      labelSpan.textContent = label;
      cell.appendChild(labelSpan);
      cell.addEventListener('click', () => handleCellClick(row, col));
      if (row >= 9) els.allyGrid.appendChild(cell);
      else els.enemyGrid.appendChild(cell);
    }
  }
}

function bindEvents() {
  els.nextPhaseBtn.addEventListener('click', nextPhase);
  document.querySelectorAll('.deck-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeTab = Number(btn.dataset.tab);
      state.selectedCardSlot = null;
      state.pendingCard = null;
      state.pendingPlacement = null;
      state.selectedMover = null;
      renderAll();
    });
  });
  document.addEventListener('keydown', handleKeyDown);
  if (els.cardInfoKastBtn) els.cardInfoKastBtn.addEventListener('click', startKastFromInfo);
  if (els.cardInfoCloseBtn) els.cardInfoCloseBtn.addEventListener('click', closeCardInfo);
  if (els.randomCostConfirmBtn) els.randomCostConfirmBtn.addEventListener('click', confirmRandomCostSelection);
  if (els.randomCostCancelBtn) els.randomCostCancelBtn.addEventListener('click', cancelRandomCostSelection);
  if (els.randomCostOverlay) els.randomCostOverlay.addEventListener('click', (event) => { if (event.target === els.randomCostOverlay) cancelRandomCostSelection(); });
  if (els.infoChip) els.infoChip.addEventListener('click', openPatchInfo);
  if (els.cssRefreshBtn) els.cssRefreshBtn.addEventListener('click', refreshCssOnly);
  if (els.visualRefreshBtn) els.visualRefreshBtn.addEventListener('click', refreshVisualOnly);
  if (els.patchInfoCloseBtn) els.patchInfoCloseBtn.addEventListener('click', closePatchInfo);
  if (els.patchInfoOverlay) els.patchInfoOverlay.addEventListener('click', (event) => { if (event.target === els.patchInfoOverlay) closePatchInfo(); });
  if (els.cardMetaInfoCloseBtn) els.cardMetaInfoCloseBtn.addEventListener('click', closeCardMetaInfo);
  if (els.cardMetaInfoBackBtn) els.cardMetaInfoBackBtn.addEventListener('click', goBackCardMetaInfo);
  if (els.cardMetaInfoOverlay) els.cardMetaInfoOverlay.addEventListener('click', (event) => { if (event.target === els.cardMetaInfoOverlay) closeCardMetaInfo(); });
  bindBoardZoomAndPan();
}

function flashRefreshButton(button, label) {
  if (!button) return;
  button.classList.add('flash');
  button.textContent = 'OK';
  setTimeout(() => {
    button.classList.remove('flash');
    button.textContent = label;
  }, 650);
}

function refreshCssOnly() {
  const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .filter(link => String(link.getAttribute('href') || '').includes('style.css'));
  const link = els.mainStylesheet || links[0];
  if (!link) {
    log('No encontré style.css para refrescar.');
    return;
  }

  const freshHref = `style.css?cssRefresh=${Date.now()}`;
  const clone = link.cloneNode(true);
  clone.id = link.id || 'mainStylesheet';
  clone.setAttribute('href', freshHref);

  clone.addEventListener('load', () => {
    if (link.parentNode) link.remove();
    els.mainStylesheet = clone;
    flashRefreshButton(els.cssRefreshBtn, 'CSS');
    renderAll();
    log('CSS refrescado sin reiniciar la partida.');
  }, { once: true });

  clone.addEventListener('error', () => {
    link.setAttribute('href', freshHref);
    els.mainStylesheet = link;
    flashRefreshButton(els.cssRefreshBtn, 'CSS');
    renderAll();
    log('CSS refrescado por fallback.');
  }, { once: true });

  link.parentNode.insertBefore(clone, link.nextSibling);
}


function refreshVisualOnly() {
  // Refresco visual blando: mantiene state/progreso, reconstruye DOM visual y recarga CSS.
  refreshCssOnly();

  document.querySelectorAll(
    '.visual-dev-showcase-node, .restore-travel-token, .cast-travel-token, .invocation-death-static-token, .smoke-bomb-flyer, .element-burst-fx, .floating-combat, .floating-warning'
  ).forEach(node => node.remove());

  clearCombatMenus();
  clearDragHighlights?.();
  applyVisualDevSettings?.();

  if (els.globalFxLayer) els.globalFxLayer.innerHTML = '';
  buildGrid();
  renderAll();

  flashRefreshButton(els.visualRefreshBtn, 'ALL');
  log('Visual completo refrescado sin borrar la partida.');
}




const VISUAL_DEV_STORAGE_KEY = 'rokVisualDevOverridesV3';
const VISUAL_DEV_SHOW_ALL_CLASS = 'visual-dev-show-all';

const VISUAL_DEV_CONTROL_LIBRARY = {
  castSpell: [
    { key: '--dev-cast-spell-size', label: 'Tamaño', unit: 'px', min: 24, max: 120, step: 1, value: 54 },
    { key: '--dev-cast-spell-left', label: 'Posición X', unit: '%', min: 0, max: 100, step: 1, value: 50 },
    { key: '--dev-cast-spell-top', label: 'Posición Y', unit: '%', min: 0, max: 100, step: 1, value: 47 },
    { key: '--dev-cast-spell-opacity', label: 'Transparencia', unit: '', min: 0, max: 1, step: 0.01, value: 1 },
    { key: '--dev-cast-spell-z', label: 'Z-index', unit: '', min: 0, max: 9999, step: 10, value: 1 },
  ],
  castToken: [
    { key: '--dev-cast-token-width', label: 'Ancho', unit: 'px', min: 20, max: 150, step: 1, value: 58 },
    { key: '--dev-cast-token-height', label: 'Alto', unit: 'px', min: 20, max: 170, step: 1, value: 74 },
    { key: '--dev-cast-token-top', label: 'Posición Y', unit: '%', min: 0, max: 100, step: 1, value: 48 },
    { key: '--dev-cast-token-opacity', label: 'Transparencia', unit: '', min: 0, max: 1, step: 0.01, value: 1 },
    { key: '--dev-cast-token-z', label: 'Z-index', unit: '', min: 0, max: 9999, step: 10, value: 1 },
  ],
  castCounter: [
    { key: '--dev-cast-status-right', label: 'Contador X', unit: 'px', min: -100, max: 100, step: 1, value: -8 },
    { key: '--dev-cast-status-bottom', label: 'Contador Y', unit: 'px', min: -100, max: 100, step: 1, value: -4 },
    { key: '--dev-cast-status-scale', label: 'Escala', unit: '', min: 0.25, max: 2, step: 0.01, value: 1 },
    { key: '--dev-cast-status-opacity', label: 'Transparencia', unit: '', min: 0, max: 1, step: 0.01, value: 1 },
    { key: '--dev-cast-status-z', label: 'Z-index', unit: '', min: 0, max: 9999, step: 10, value: 40 },
  ],
  targetPanel: [
    { key: '--dev-target-panel-left', label: 'Panel X', unit: 'px', min: -100, max: 260, step: 1, value: 6 },
    { key: '--dev-target-panel-top', label: 'Panel Y', unit: 'px', min: 0, max: 420, step: 1, value: 112 },
    { key: '--dev-target-row-width', label: 'Ancho fila', unit: 'px', min: 50, max: 240, step: 1, value: 92 },
    { key: '--dev-target-gap', label: 'Separación filas', unit: 'px', min: 0, max: 40, step: 1, value: 8 },
    { key: '--dev-target-panel-opacity', label: 'Transparencia', unit: '', min: 0, max: 1, step: 0.01, value: 1 },
    { key: '--dev-target-panel-z', label: 'Z-index', unit: '', min: 0, max: 10000, step: 50, value: 9700 },
  ],
  targetMini: [
    { key: '--dev-target-mini-size', label: 'Miniatura tamaño', unit: 'px', min: 16, max: 90, step: 1, value: 34 },
    { key: '--dev-target-btn-width', label: 'Botón ancho', unit: 'px', min: 32, max: 120, step: 1, value: 50 },
    { key: '--dev-target-cell-left', label: 'Casilla X', unit: 'px', min: -80, max: 80, step: 1, value: -4 },
    { key: '--dev-target-cell-bottom', label: 'Casilla Y', unit: 'px', min: -80, max: 80, step: 1, value: -7 },
    { key: '--dev-target-cell-scale', label: 'Casilla escala', unit: '', min: 0.4, max: 2, step: 0.01, value: 1 },
  ],
  enemyHud: [
    { key: '--dev-enemy-hud-left', label: 'HUD X', unit: 'px', min: -80, max: 280, step: 1, value: 6 },
    { key: '--dev-enemy-hud-top', label: 'HUD Y', unit: 'px', min: -80, max: 280, step: 1, value: 6 },
    { key: '--dev-enemy-hud-max-width', label: 'Ancho máximo', unit: 'px', min: 100, max: 650, step: 5, value: 360 },
    { key: '--dev-enemy-resource-gap', label: 'Gap elementos', unit: 'px', min: 0, max: 40, step: 1, value: 5 },
    { key: '--dev-enemy-cast-gap', label: 'Gap kasteo', unit: 'px', min: 0, max: 40, step: 1, value: 8 },
    { key: '--dev-enemy-hud-opacity', label: 'Transparencia', unit: '', min: 0, max: 1, step: 0.01, value: 1 },
    { key: '--dev-enemy-hud-z', label: 'Z-index', unit: '', min: 0, max: 10000, step: 10, value: 118 },
  ],
  enemyCast: [
    { key: '--dev-enemy-cast-mini-size', label: 'Mini kasteo tamaño', unit: 'px', min: 12, max: 70, step: 1, value: 24 },
    { key: '--dev-enemy-cast-status-right', label: 'Contador X', unit: 'px', min: -80, max: 80, step: 1, value: -6 },
    { key: '--dev-enemy-cast-status-bottom', label: 'Contador Y', unit: 'px', min: -80, max: 80, step: 1, value: -4 },
    { key: '--dev-enemy-cast-status-scale', label: 'Contador escala', unit: '', min: 0.2, max: 2, step: 0.01, value: 0.52 },
  ],
  trackers: [
    { key: '--dev-tracker-left', label: 'Tracker X', unit: 'px', min: -80, max: 260, step: 1, value: 8 },
    { key: '--dev-tracker-bottom', label: 'Tracker Y', unit: 'px', min: -80, max: 260, step: 1, value: 8 },
    { key: '--dev-tracker-gap', label: 'Separación', unit: 'px', min: 0, max: 40, step: 1, value: 10 },
    { key: '--dev-tracker-mini-size', label: 'Miniatura', unit: 'px', min: 10, max: 80, step: 1, value: 24 },
    { key: '--dev-tracker-count-right', label: 'Burbuja X', unit: 'px', min: -80, max: 80, step: 1, value: -7 },
    { key: '--dev-tracker-count-top', label: 'Burbuja Y', unit: 'px', min: -80, max: 80, step: 1, value: -7 },
    { key: '--dev-tracker-count-scale', label: 'Burbuja escala', unit: '', min: 0.4, max: 2, step: 0.01, value: 1 },
    { key: '--dev-tracker-z', label: 'Z-index', unit: '', min: 0, max: 10000, step: 10, value: 78 },
  ],
  actionMenus: [
    { key: '--dev-action-menu-z', label: 'Z-index', unit: '', min: 0, max: 10000, step: 50, value: 9800 },
    { key: '--dev-action-menu-scale', label: 'Escala', unit: '', min: 0.4, max: 2, step: 0.01, value: 1 },
    { key: '--dev-action-menu-opacity', label: 'Transparencia', unit: '', min: 0, max: 1, step: 0.01, value: 1 },
    { key: '--dev-action-menu-gap', label: 'Separación', unit: 'px', min: 0, max: 30, step: 1, value: 6 },
  ],
  infoCombatirMenu: [
    { key: '--dev-info-combatir-x', label: 'Info/Combatir X', unit: '%', min: 0, max: 100, step: 1, value: 50 },
    { key: '--dev-info-combatir-y', label: 'Info/Combatir Y', unit: '%', min: 0, max: 100, step: 1, value: 38 },
    { key: '--dev-info-combatir-scale', label: 'Escala', unit: '', min: 0.35, max: 2, step: 0.01, value: 1 },
    { key: '--dev-info-combatir-gap', label: 'Separación', unit: 'px', min: 0, max: 40, step: 1, value: 8 },
    { key: '--dev-info-combatir-btn-width', label: 'Botón ancho', unit: 'px', min: 60, max: 180, step: 1, value: 98 },
    { key: '--dev-info-combatir-btn-height', label: 'Botón alto', unit: 'px', min: 24, max: 70, step: 1, value: 42 },
    { key: '--dev-info-combatir-opacity', label: 'Transparencia', unit: '', min: 0, max: 1, step: 0.01, value: 1 },
    { key: '--dev-info-combatir-z', label: 'Z-index', unit: '', min: 0, max: 10000, step: 50, value: 9800 },
  ],
  infoPoderMenu: [
    { key: '--ctrl-naito-action-buttons-x', label: 'Info/Poder X real', unit: 'px', min: -160, max: 160, step: 1, value: -50 },
    { key: '--ctrl-naito-action-buttons-y', label: 'Info/Poder Y real', unit: '%', min: 0, max: 120, step: 1, value: 50 },
    { key: '--ctrl-naito-action-buttons-width', label: 'Info/Poder ancho real', unit: 'px', min: 30, max: 180, step: 1, value: 50 },
    { key: '--ctrl-naito-action-buttons-gap', label: 'Info/Poder separación real', unit: 'px', min: 0, max: 40, step: 1, value: 5 },
    { key: '--ctrl-naito-action-buttons-opacity', label: 'Info/Poder opacidad real', unit: '', min: 0, max: 1, step: 0.01, value: .96 },
    { key: '--ctrl-naito-action-button-height', label: 'Botón alto real', unit: 'px', min: 8, max: 60, step: 1, value: 13 },
    { key: '--ctrl-naito-action-button-font-size', label: 'Texto tamaño real', unit: 'px', min: 4, max: 24, step: 1, value: 5 },
  ],
  casterDefense: [
    { key: '--dev-caster-defense-x', label: 'Posición X', unit: '%', min: 0, max: 100, step: 1, value: 50 },
    { key: '--dev-caster-defense-y', label: 'Posición Y', unit: '%', min: 0, max: 100, step: 1, value: 63 },
    { key: '--dev-caster-defense-scale', label: 'Escala', unit: '', min: 0.35, max: 2, step: 0.01, value: 1 },
    { key: '--dev-caster-defense-gap', label: 'Separación', unit: 'px', min: 0, max: 40, step: 1, value: 8 },
    { key: '--dev-caster-defense-btn-width', label: 'Botón ancho', unit: 'px', min: 70, max: 220, step: 1, value: 128 },
    { key: '--dev-caster-defense-btn-height', label: 'Botón alto', unit: 'px', min: 24, max: 70, step: 1, value: 42 },
    { key: '--dev-caster-defense-opacity', label: 'Transparencia', unit: '', min: 0, max: 1, step: 0.01, value: 1 },
    { key: '--dev-caster-defense-z', label: 'Z-index', unit: '', min: 0, max: 10000, step: 50, value: 9900 },
  ],
  combatHud: [
    { key: '--dev-combat-hud-left', label: 'HUD combate X', unit: '%', min: 0, max: 100, step: 1, value: 56 },
    { key: '--dev-combat-hud-top', label: 'HUD combate Y', unit: '%', min: 0, max: 100, step: 1, value: 50 },
    { key: '--dev-combat-hud-scale', label: 'Escala', unit: '', min: 0.3, max: 2, step: 0.01, value: 1 },
    { key: '--dev-combat-hud-opacity', label: 'Transparencia', unit: '', min: 0, max: 1, step: 0.01, value: 1 },
    { key: '--dev-combat-hud-z', label: 'Z-index', unit: '', min: 0, max: 10000, step: 10, value: 500 },
  ],
  arenaInvocation: [
    { key: '--invocation-offset-x', label: 'Offset global X real', unit: 'px', min: -80, max: 80, step: 1, value: 0 },
    { key: '--invocation-offset-y', label: 'Offset global Y real', unit: 'px', min: -100, max: 100, step: 1, value: 0 },
    { key: '--ctrl-invocation-badges-x', label: 'Grupo ATK/VIDA X real', unit: 'px', min: -80, max: 80, step: 1, value: 0 },
    { key: '--ctrl-invocation-badges-y', label: 'Grupo ATK/VIDA Y real', unit: 'px', min: -100, max: 100, step: 1, value: -7 },
    { key: '--ctrl-damage-badge-x', label: 'ATK badge X real', unit: 'px', min: -100, max: 100, step: 1, value: -16 },
    { key: '--ctrl-damage-badge-y', label: 'ATK badge Y real', unit: 'px', min: -120, max: 80, step: 1, value: -35 },
    { key: '--ctrl-life-badge-x', label: 'Vida badge X real', unit: 'px', min: -100, max: 100, step: 1, value: 16 },
    { key: '--ctrl-life-badge-y', label: 'Vida badge Y real', unit: 'px', min: -120, max: 80, step: 1, value: -35 },
    { key: '--ctrl-hidden-badge-x', label: 'Oculto X real', unit: 'px', min: -80, max: 80, step: 1, value: 14 },
    { key: '--ctrl-hidden-badge-y', label: 'Oculto Y real', unit: 'px', min: -80, max: 120, step: 1, value: 35 },
    { key: '--ctrl-hidden-badge-size', label: 'Oculto tamaño real', unit: 'px', min: 6, max: 50, step: 1, value: 15 },
    { key: '--ctrl-move-ready-x', label: 'Movimiento X real', unit: 'px', min: -80, max: 80, step: 1, value: 9 },
    { key: '--ctrl-move-ready-y', label: 'Movimiento Y real', unit: 'px', min: -80, max: 120, step: 1, value: 25 },
    { key: '--ctrl-move-ready-size', label: 'Movimiento tamaño real', unit: 'px', min: 4, max: 40, step: 1, value: 8 },
    { key: '--ctrl-restore-badge-x', label: 'Restauración X real', unit: 'px', min: -80, max: 80, step: 1, value: 0 },
    { key: '--ctrl-restore-badge-y', label: 'Restauración Y real', unit: 'px', min: -80, max: 120, step: 1, value: 10 },
    { key: '--ctrl-restore-badge-box-size', label: 'Restauración tamaño real', unit: 'px', min: 8, max: 60, step: 1, value: 25 },
  ],
  casterFocus: [
    { key: '--caster-w', label: 'Kaster ancho global', unit: '%', min: 2, max: 14, step: 0.1, value: 5 },
    { key: '--caster-h', label: 'Kaster alto global', unit: '%', min: 4, max: 22, step: 0.1, value: 11 },
    { key: '--caster-offset-x', label: 'Kaster offset X', unit: 'px', min: -100, max: 100, step: 1, value: 0 },
    { key: '--caster-offset-y', label: 'Kaster offset Y', unit: 'px', min: -120, max: 120, step: 1, value: 0 },
    { key: '--token-caster-hanzo-w', label: 'Hanzo ancho', unit: '%', min: 2, max: 14, step: 0.1, value: 5 },
    { key: '--token-caster-hanzo-h', label: 'Hanzo alto', unit: '%', min: 4, max: 22, step: 0.1, value: 11 },
    { key: '--token-caster-hanzo-x', label: 'Hanzo X', unit: 'px', min: -100, max: 100, step: 1, value: 0 },
    { key: '--token-caster-hanzo-y', label: 'Hanzo Y', unit: 'px', min: -120, max: 120, step: 1, value: 0 },
    { key: '--token-caster-tokugawa-w', label: 'Tokugawa ancho', unit: '%', min: 2, max: 14, step: 0.1, value: 5 },
    { key: '--token-caster-tokugawa-h', label: 'Tokugawa alto', unit: '%', min: 4, max: 22, step: 0.1, value: 11 },
    { key: '--token-caster-tokugawa-x', label: 'Tokugawa X', unit: 'px', min: -100, max: 100, step: 1, value: 0 },
    { key: '--token-caster-tokugawa-y', label: 'Tokugawa Y', unit: 'px', min: -120, max: 120, step: 1, value: 0 },
  ],
  respawn: [
    { key: '--dev-spawn-marker-scale', label: 'Respawn escala', unit: '', min: 0.3, max: 2, step: 0.01, value: 1 },
    { key: '--dev-spawn-marker-x', label: 'Respawn X', unit: 'px', min: -80, max: 80, step: 1, value: 0 },
    { key: '--dev-spawn-marker-y', label: 'Respawn Y', unit: 'px', min: -80, max: 80, step: 1, value: 0 },
    { key: '--dev-spawn-status-x', label: 'Icono entrada X', unit: 'px', min: -80, max: 80, step: 1, value: 0 },
    { key: '--dev-spawn-status-y', label: 'Icono entrada Y', unit: 'px', min: -80, max: 80, step: 1, value: 0 },
    { key: '--dev-spawn-status-scale', label: 'Icono entrada escala', unit: '', min: 0.3, max: 2, step: 0.01, value: 1 },
  ],
};

const VISUAL_DEV_GROUPS = [
  { id: 'casterFocus', label: 'Kaster inicial / foco dev', icon: 'K', sections: [
    { title: 'Ficha real del Kaster', controls: VISUAL_DEV_CONTROL_LIBRARY.casterFocus },
    { title: 'Indicadores forzados sobre Kaster', controls: VISUAL_DEV_CONTROL_LIBRARY.arenaInvocation },
    { title: 'Menú real INFO / PODER', controls: VISUAL_DEV_CONTROL_LIBRARY.infoPoderMenu },
  ]},
  { id: 'arenaInvocation', label: 'Invocaciones en arena', icon: '♟', mode: 'cardList' },
  { id: 'castZone', label: 'Zona de kasteo', icon: '⌛', sections: [
    { title: 'Miniatura de hechizo', controls: VISUAL_DEV_CONTROL_LIBRARY.castSpell },
    { title: 'Token de invocación', controls: VISUAL_DEV_CONTROL_LIBRARY.castToken },
    { title: 'Contador / cola', controls: VISUAL_DEV_CONTROL_LIBRARY.castCounter },
  ]},
  { id: 'targetPanel', label: 'Panel lateral Elegir', icon: '◎', sections: [
    { title: 'Panel completo', controls: VISUAL_DEV_CONTROL_LIBRARY.targetPanel },
    { title: 'Miniatura, botón y burbuja', controls: VISUAL_DEV_CONTROL_LIBRARY.targetMini },
  ]},
  { id: 'enemyHud', label: 'HUD rival de elementos/kasteo', icon: '☷', sections: [
    { title: 'Panel y elementos', controls: VISUAL_DEV_CONTROL_LIBRARY.enemyHud },
    { title: 'Miniatura/contador de kasteo', controls: VISUAL_DEV_CONTROL_LIBRARY.enemyCast },
  ]},
  { id: 'trackers', label: 'Trackers de efectos activos', icon: '◌', sections: [
    { title: 'Tracker completo', controls: VISUAL_DEV_CONTROL_LIBRARY.trackers },
  ]},
  { id: 'combatHud', label: 'HUD real de combate VS', icon: 'VS', sections: [
    { title: 'HUD combate real', controls: VISUAL_DEV_CONTROL_LIBRARY.combatHud },
  ]},
  { id: 'infoCombatirMenu', label: 'Menú real INFO / COMBATIR', icon: 'IC', sections: [
    { title: 'Objetivo de combate', controls: VISUAL_DEV_CONTROL_LIBRARY.infoCombatirMenu },
  ]},
  { id: 'casterDefense', label: 'Kaster: Defender / Contraatacar', icon: 'DEF', sections: [
    { title: 'Menú real del Kaster', controls: VISUAL_DEV_CONTROL_LIBRARY.casterDefense },
  ]},
  { id: 'respawn', label: 'Respawn / punto de restauración', icon: '↩', sections: [
    { title: 'Marcador de respawn y entrada', controls: VISUAL_DEV_CONTROL_LIBRARY.respawn },
  ]},
];

function getVisualDevDefaults() {
  const out = {};
  Object.values(VISUAL_DEV_CONTROL_LIBRARY).flat().forEach(control => {
    out[control.key] = `${control.value}${control.unit}`;
  });
  getVisualDevInvocationCards().forEach(card => {
    getVisualDevCardTokenControls(card).forEach(control => {
      if (!(control.key in out)) out[control.key] = `${control.value}${control.unit}`;
    });
  });
  return out;
}

function loadVisualDevSettings() {
  try {
    return { ...getVisualDevDefaults(), ...(JSON.parse(localStorage.getItem(VISUAL_DEV_STORAGE_KEY) || '{}')) };
  } catch (error) {
    return getVisualDevDefaults();
  }
}

function saveVisualDevSettings(settings) {
  localStorage.setItem(VISUAL_DEV_STORAGE_KEY, JSON.stringify(settings));
}

function applyVisualDevSettings(settings = loadVisualDevSettings()) {
  Object.entries(settings).forEach(([key, value]) => document.documentElement.style.setProperty(key, value));
}

function setVisualDevValue(key, rawValue, unit = '') {
  const settings = loadVisualDevSettings();
  settings[key] = `${rawValue}${unit}`;
  saveVisualDevSettings(settings);
  applyVisualDevSettings(settings);
}

function resetVisualDevSettings() {
  localStorage.removeItem(VISUAL_DEV_STORAGE_KEY);
  applyVisualDevSettings(getVisualDevDefaults());
  openPatchInfo();
}

function exportVisualDevCss() {
  const settings = loadVisualDevSettings();
  const cssText = `:root {\n${Object.entries(settings).map(([key, value]) => `  ${key}: ${value};`).join('\n')}\n}`;
  navigator.clipboard?.writeText(cssText).then(() => log('CSS dev copiado al portapapeles.')).catch(() => window.prompt('Copia este CSS:', cssText));
}

function visualDevShowAll() {
  document.body.classList.toggle(VISUAL_DEV_SHOW_ALL_CLASS);
  state.devPreviewIndicators = {
    ...(state.devPreviewIndicators || {}),
    restore: document.body.classList.contains(VISUAL_DEV_SHOW_ALL_CLASS),
  };
  renderAll();
  openPatchInfo();
}

function getVisualDevInvocationCards() {
  return Object.values(CARD_LIBRARY || {})
    .filter(card => getCardTypeId(card) === 'invocation')
    .filter((card, index, arr) => arr.findIndex(item => item.id === card.id) === index);
}


function getVisualDevCardTokenSlug(card) {
  const map = {
    naitoSutoka: 'kagero',
    ninjaNaitoSutoka: 'naito-sutoka',
    ninjaOjoDeBuho: 'ojo-de-buho',
    samuraiBushiHonorable: 'bushi-honorable',
    samuraiAkari: 'samurai-akari',
    samuraiToyotomiHideyoshi: 'toyotomi-hideyoshi',
  };
  return map[card?.id] || null;
}

function getVisualDevCardTokenDefaults(card) {
  const slug = getVisualDevCardTokenSlug(card);
  if (!slug) return null;
  const defaults = {
    'kagero': { w: 5, h: 10, y: 0 },
    'naito-sutoka': { w: 5, h: 10, y: 0 },
    'ojo-de-buho': { w: 6.2, h: 12.4, y: 0 },
    'bushi-honorable': { w: 5, h: 10, y: 0 },
    'samurai-akari': { w: 6.2, h: 12.4, y: 0 },
    'toyotomi-hideyoshi': { w: 7.4, h: 14.2, y: 0 },
  };
  return defaults[slug] || { w: 5, h: 10, y: 0 };
}

function getVisualDevCardTokenControls(card) {
  const slug = getVisualDevCardTokenSlug(card);
  const defaults = getVisualDevCardTokenDefaults(card);
  if (!slug || !defaults) {
    return [
      { key: '--invocation-w', label: 'Ficha ancho global', unit: '%', min: 2, max: 12, step: 0.1, value: 5 },
      { key: '--invocation-h', label: 'Ficha alto global', unit: '%', min: 4, max: 20, step: 0.1, value: 10 },
    ];
  }
  return [
    { key: `--token-${slug}-w`, label: 'Ancho real de esta carta', unit: '%', min: 2, max: 14, step: 0.1, value: defaults.w },
    { key: `--token-${slug}-h`, label: 'Alto real de esta carta', unit: '%', min: 4, max: 22, step: 0.1, value: defaults.h },
    { key: `--token-${slug}-y`, label: 'Offset Y real de esta carta', unit: 'px', min: -100, max: 100, step: 1, value: defaults.y },
  ];
}


function renderVisualDevMaster() {
  return `
    <div class="visual-dev-master">
      <div class="visual-dev-master-actions">
        <button type="button" data-visual-dev-action="showAll">${document.body.classList.contains(VISUAL_DEV_SHOW_ALL_CLASS) ? 'Ocultar todo' : 'Mostrar todo'}</button>
        <button type="button" data-visual-dev-action="export">Exportar CSS</button>
        <button type="button" data-visual-dev-action="reset">Resetear</button>
      </div>
      <p class="visual-dev-master-note">Elige un sistema visual. No se crea ficha falsa: ajusta variables reales y mira las invocaciones reales en arena.</p>
      <div class="visual-dev-list">
        ${VISUAL_DEV_GROUPS.map(item => `
          <button type="button" class="visual-dev-item" data-visual-dev-open="${item.id}">
            <span class="visual-dev-item-icon">${item.icon}</span>
            <span>${item.label}</span>
          </button>`).join('')}
      </div>
    </div>`;
}

function renderVisualDevCardList() {
  const cards = getVisualDevInvocationCards();
  const selected = getSelectedVisualDevInvocation(cards);
  return `
    <div class="visual-dev-inspector">
      <button type="button" class="visual-dev-back" data-visual-dev-action="back">← Lista</button>
      <div class="visual-dev-inspector-head">
        <span class="visual-dev-inspector-icon">♟</span>
        <strong>Invocaciones en arena</strong>
        <small>Selecciona una carta para ajustes individuales.</small>
      </div>
      <div class="visual-dev-list visual-dev-card-list">
        ${cards.map(card => `
          <button type="button" class="visual-dev-item visual-dev-card-item ${selected?.id === card.id ? 'selected' : ''}" data-visual-dev-card="${card.id}">
            <span class="visual-dev-card-mini"><img src="${card.tokenImage || card.artImage || 'assets/invocation-token.png'}" alt="${card.name}"></span>
            <span>${card.name}</span>
          </button>`).join('')}
      </div>
    </div>`;
}

function renderVisualDevControl(control, settings) {
  const current = settings[control.key] || `${control.value}${control.unit}`;
  const numeric = parseFloat(current);
  const value = Number.isFinite(numeric) ? numeric : control.value;
  return `
    <label class="visual-dev-control">
      <span>${control.label}</span>
      <input type="range" min="${control.min}" max="${control.max}" step="${control.step}" value="${value}" data-visual-dev-key="${control.key}" data-visual-dev-unit="${control.unit}">
      <input type="number" min="${control.min}" max="${control.max}" step="${control.step}" value="${value}" data-visual-dev-number="${control.key}" data-visual-dev-unit="${control.unit}">
      <output>${current}</output>
    </label>`;
}

function renderVisualDevInspector(group, card = null) {
  const settings = loadVisualDevSettings();
  const sections = group.id === 'arenaInvocation'
    ? [
        { title: `Ficha real individual · ${card?.name || 'Invocación'}`, controls: getVisualDevCardTokenControls(card) },
        { title: 'Indicadores reales generales', controls: VISUAL_DEV_CONTROL_LIBRARY.arenaInvocation },
        { title: 'Menú real INFO / PODER', controls: VISUAL_DEV_CONTROL_LIBRARY.infoPoderMenu },
      ]
    : group.sections || [];
  const iconContent = card
    ? `<img src="${card.tokenImage || card.artImage || 'assets/invocation-token.png'}" alt="${card.name}">`
    : group.icon;
  return `
    <div class="visual-dev-inspector">
      <button type="button" class="visual-dev-back" data-visual-dev-action="${card ? 'cardList' : 'back'}">← ${card ? 'Invocaciones' : 'Lista'}</button>
      <div class="visual-dev-inspector-head">
        <span class="visual-dev-inspector-icon ${card ? 'with-img' : ''}">${iconContent}</span>
        <strong>${card?.name || group.label}</strong>
        <small>${card ? 'Ajuste conectado a variables reales del CSS.' : 'Inspector del sistema visual completo.'}</small>
      </div>
      <div class="visual-dev-sample">${card?.shortName || group.label}</div>
      <div class="visual-dev-control-column">
        ${sections.map(section => `
          <div class="visual-dev-control-section">
            <h4>${section.title}</h4>
            ${section.controls.map(control => renderVisualDevControl(control, settings)).join('')}
          </div>`).join('')}
      </div>
    </div>`;
}

function bindVisualDevPanel() {
  const root = els.patchInfoBody;
  if (!root) return;
  root.querySelector('[data-visual-dev-action="showAll"]')?.addEventListener('click', visualDevShowAll);
  root.querySelector('[data-visual-dev-action="export"]')?.addEventListener('click', exportVisualDevCss);
  root.querySelector('[data-visual-dev-action="reset"]')?.addEventListener('click', resetVisualDevSettings);
  root.querySelector('[data-visual-dev-action="back"]')?.addEventListener('click', openPatchInfo);
  root.querySelector('[data-visual-dev-action="cardList"]')?.addEventListener('click', () => {
    if (!els.patchInfoBody) return;
    els.patchInfoBody.innerHTML = renderVisualDevCardList();
    bindVisualDevPanel();
  });
  root.querySelectorAll('[data-visual-dev-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = VISUAL_DEV_GROUPS.find(entry => entry.id === btn.dataset.visualDevOpen);
      if (!group || !els.patchInfoBody) return;
      els.patchInfoBody.innerHTML = group.mode === 'cardList' ? renderVisualDevCardList() : renderVisualDevInspector(group);
      bindVisualDevPanel();
    });
  });
  root.querySelectorAll('[data-visual-dev-card]').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = CARD_LIBRARY[btn.dataset.visualDevCard];
      const group = VISUAL_DEV_GROUPS.find(entry => entry.id === 'arenaInvocation');
      if (!card || !group || !els.patchInfoBody) return;
      state.visualDevSelectedInvocationId = card.id;
      renderAll();
      els.patchInfoBody.innerHTML = renderVisualDevInspector(group, card);
      bindVisualDevPanel();
    });
  });
  root.querySelectorAll('[data-visual-dev-key]').forEach(input => {
    const row = input.closest('.visual-dev-control');
    const output = row?.querySelector('output');
    const number = row?.querySelector(`[data-visual-dev-number="${input.dataset.visualDevKey}"]`);
    input.addEventListener('input', () => {
      const unit = input.dataset.visualDevUnit || '';
      const value = `${input.value}${unit}`;
      if (output) output.textContent = value;
      if (number) number.value = input.value;
      setVisualDevValue(input.dataset.visualDevKey, input.value, unit);
    });
  });
  root.querySelectorAll('[data-visual-dev-number]').forEach(input => {
    const row = input.closest('.visual-dev-control');
    const output = row?.querySelector('output');
    const range = row?.querySelector(`[data-visual-dev-key="${input.dataset.visualDevNumber}"]`);
    input.addEventListener('input', () => {
      const unit = input.dataset.visualDevUnit || '';
      const value = `${input.value}${unit}`;
      if (output) output.textContent = value;
      if (range) range.value = input.value;
      setVisualDevValue(input.dataset.visualDevNumber, input.value, unit);
    });
  });
}

function openPatchInfo() {
  if (!els.patchInfoOverlay) return;
  applyVisualDevSettings();
  if (els.patchInfoTitle) els.patchInfoTitle.textContent = `Panel Dev Visual · ${GAME_VERSION}`;
  if (els.patchInfoBody) {
    els.patchInfoBody.innerHTML = renderVisualDevMaster();
    bindVisualDevPanel();
  }
  els.patchInfoOverlay.classList.add('open', 'visual-dev-overlay');
  els.patchInfoOverlay.setAttribute('aria-hidden', 'false');
}

function closePatchInfo() {
  if (!els.patchInfoOverlay) return;
  els.patchInfoOverlay.classList.remove('open', 'visual-dev-overlay');
  els.patchInfoOverlay.setAttribute('aria-hidden', 'true');
}

function toggleDevIndicator(indicatorId) {
  if (!state.devPreviewIndicators) state.devPreviewIndicators = { restore: false };
  if (indicatorId === 'restore') {
    state.devPreviewIndicators.restore = !state.devPreviewIndicators.restore;
    renderAll();
    openPatchInfo();
  }
}

function currentPhase() { return PHASES[state.phaseIndex]; }
function currentPlayer() { return state.players[state.activePlayer]; }

function getPlayerGridRow(playerId, localRow) {
  return playerId === 1 ? 8 + localRow : localRow - 1;
}

function isCasterInOwnSide(playerId) {
  const caster = state.players[playerId].caster;
  return playerId === 1 ? caster.row >= 9 : caster.row <= 8;
}

function isCasterInEnemySide(playerId) { return !isCasterInOwnSide(playerId); }

function getEnemyRiskRow(playerId) { return playerId === 1 ? 0 : 17; }

function getOwnerColor(playerId) { return getPlayerElementColor(playerId); }

const MOVEMENT_TYPE_DB = {
  basic: { id: 'basic', label: 'Básica', icon: 'assets/movement/movement-basic.png', focus: 'Avance natural', tags: ['movilidad', 'básica', 'avance', 'estándar'], summary: 'Movimiento básico de las invocaciones dentro de la arena.', description: 'La movilidad básica representa el desplazamiento común de una invocación. Sirve como patrón estándar para unidades que avanzan de forma directa siguiendo el flujo normal de la arena, sin opciones laterales complejas ni desplazamientos especiales.' },
  lateral: { id: 'lateral', label: 'Laterales', icon: 'assets/movement/movement-lateral.png', focus: 'Control lateral', tags: ['movilidad', 'laterales', 'guardián', 'bloqueo'], summary: 'Movimiento enfocado en desplazarse por los lados de la línea de combate.', description: 'La movilidad lateral suele aplicar a invocaciones con enfoque defensivo, especialmente guardianes. Permite sostener posiciones, bloquear avances y cambiar de carril sin depender de presión frontal.' },
  retreat: { id: 'retreat', label: 'Retroceso', icon: 'assets/movement/movement-retreat.png', focus: 'Campeo y retirada', tags: ['movilidad', 'retroceso', 'franqueo', 'campeo'], summary: 'Movimiento orientado a retroceder o mantener distancia desde una posición táctica.', description: 'La movilidad de retroceso funciona para invocaciones que quieren conservar distancia, reposicionarse hacia atrás o sostener una estrategia de campeo. Es útil para unidades que no dependen del choque frontal constante.' },
  complete: { id: 'complete', label: 'Completa', icon: 'assets/movement/movement-complete.png', focus: 'Movimiento libre', tags: ['movilidad', 'completa', 'kaster', 'libre'], summary: 'Movimiento amplio, usualmente asociado a kasters o poderes especiales.', description: 'La movilidad completa permite desplazamiento amplio por la arena. Normalmente la tienen los kasters o algunas cartas mediante poderes, cualidades o efectos que rompen la movilidad normal de una invocación.' },
  frontalSostenido: { id: 'frontalSostenido', label: 'Frontal sostenida', icon: 'assets/movement/movement-forward-sustained.png', focus: 'Presión frontal', tags: ['movilidad', 'frontal', 'sostenida', 'presión'], summary: 'Avance constante hacia el frente siguiendo una línea de presión.', description: 'La movilidad frontal sostenida representa el avance base que hemos estado usando en el prototipo: la invocación empuja hacia el frente de manera estable, manteniendo una ruta ofensiva clara hacia la zona rival.' },
  frontalAdaptable: { id: 'frontalAdaptable', label: 'Frontal adaptable', icon: 'assets/movement/movement-forward-adaptable.png', focus: 'Avance flexible', tags: ['movilidad', 'frontal', 'adaptable', 'flexible'], summary: 'Avance frontal con capacidad de adaptar la ruta según la situación.', description: 'La movilidad frontal adaptable conserva el enfoque de avanzar hacia el frente, pero permite más flexibilidad para ajustar la ruta cuando la arena, los objetivos o los bloqueos cambian.' },
  improved: { id: 'improved', label: 'Mejorada', icon: 'assets/movement/movement-improved.png', focus: 'Desplazamiento ampliado', tags: ['movilidad', 'mejorada', 'ágil', 'especial'], summary: 'Movilidad superior a la básica, útil para invocaciones ágiles o potenciadas.', description: 'La movilidad mejorada representa un patrón de movimiento más amplio que el estándar. Se usa para invocaciones potenciadas, ágiles o con capacidades que les permiten cubrir mejores ángulos de desplazamiento.' },
  crossX: { id: 'crossX', label: 'En X', icon: 'assets/movement/movement-x.png', focus: 'Diagonales', tags: ['movilidad', 'equis', 'diagonal', 'especial'], summary: 'Movimiento en diagonales, útil para reposicionamiento angular.', description: 'La movilidad en X permite desplazamiento diagonal. Es un patrón especial para unidades que no quieren seguir solamente carriles rectos y necesitan flanquear, reposicionarse o entrar por ángulos menos predecibles.' },
};


const ABILITY_DB = {
  stalk: {
    id: 'stalk',
    label: 'Acechar',
    icon: 'assets/movement/movement-complete.png',
    activation: 'Pasiva',
    classification: { applicationModes: ['passive'], applicationTags: [], natures: ['tactical'], functionalCategories: ['utility', 'control'] },
    focus: 'Movilidad y presión',
    tags: ['habilidad', 'acechar', 'pasiva', 'táctica', 'movilidad', 'presión', 'área rival'],
    summary: 'Otorga movilidad completa mientras la invocación está en el área rival de la arena.',
    description: 'Mientras {unitName} esté en el área rival de la arena, su movilidad pasará a ser movilidad completa. Esto permite presionar desde territorio enemigo y reposicionarse con libertad cuando la invocación ya logró infiltrarse.'
  }
};

function getAbilityProfile(id) {
  return ABILITY_DB[id] || { id, label: id || 'Habilidad', icon: 'assets/card-types/card-type-ability.svg', activation: 'Pasiva', classification: 'Pasiva', focus: 'General', tags: ['habilidad'], summary: `Habilidad ${id || ''}.`, description: 'Esta habilidad define un comportamiento especial de la carta.' };
}

function isUnitInEnemySide(playerId, unit) {
  if (!unit) return false;
  return playerId === 1 ? Number(unit.row) <= 8 : Number(unit.row) >= 9;
}

function unitHasAbility(unit, abilityId) {
  const card = CARD_LIBRARY[unit?.cardId];
  return Boolean(card && Array.isArray(card.abilities) && card.abilities.some(ability => ability?.id === abilityId));
}

function isStalkAbilityActive(playerId, unit) {
  return Boolean(unitHasAbility(unit, 'stalk') && isUnitInEnemySide(playerId, unit));
}

function getEffectiveMovementTypeForUnit(playerId, unit) {
  if (isStalkAbilityActive(playerId, unit)) return 'complete';
  return CARD_LIBRARY[unit?.cardId]?.movementType || 'basic';
}

function getMovementDeltasForProfile(type, playerId) {
  if (type === 'complete') return [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  return playerId === 1 ? [[-1,-1],[-1,0],[-1,1]] : [[1,-1],[1,0],[1,1]];
}

function getMovementProfile(type) {
  return MOVEMENT_TYPE_DB[type] || MOVEMENT_TYPE_DB.basic;
}

function movementLabel(type) {
  return getMovementProfile(type)?.label || type || '-';
}

const BIOTYPE_DB = {
  none: {
    id: 'none',
    label: 'Sin biotipo',
    icon: 'assets/biotypes/biotype-terrestrial.svg',
    focus: 'Sin modificación de terreno',
    tags: ['biotipo', 'neutral', 'arena', 'sin ajuste'],
    summary: 'No aplica una regla especial de interacción con terreno.',
    description: 'Este estado se usa cuando la carta todavía no tiene biotipo definido o cuando no necesita una regla especial de terreno. Funciona como una lectura neutral mientras se termina la configuración de la carta.',
  },
  terrestrial: {
    id: 'terrestrial',
    label: 'Terrestre',
    icon: 'assets/biotypes/biotype-terrestrial.svg',
    focus: 'Movimiento estable en tierra',
    tags: ['biotipo', 'terrestre', 'tierra', 'arena'],
    summary: 'Se mueve normalmente sobre tierra, pero pierde eficiencia en agua.',
    description: 'Las invocaciones terrestres usan su movilidad normal sobre casillas de tierra o terreno firme. Cuando entran en zonas acuáticas, su movimiento se reduce a 1 porque no están adaptadas para nadar ni desplazarse bien en agua.',
  },
  flying: {
    id: 'flying',
    label: 'Volador',
    icon: 'assets/biotypes/biotype-flying.svg',
    focus: 'Altura Z y evasión terrestre',
    tags: ['biotipo', 'volador', 'altura z', 'evasión'],
    summary: 'Puede moverse por alturas Z y gana velocidad base, evitando combate terrestre directo.',
    description: 'Las invocaciones voladoras pueden desplazarse entre distintas alturas de la escala Z. Como regla base ganan +2 de velocidad. No pueden ser bloqueadas ni forzadas a entrar en combate por invocaciones terrestres o acuáticas mientras estén fuera de su plano de alcance.',
  },
  amphibious: {
    id: 'amphibious',
    label: 'Anfibio',
    icon: 'assets/biotypes/biotype-amphibious.svg',
    focus: 'Tierra y agua',
    tags: ['biotipo', 'anfibio', 'agua', 'tierra'],
    summary: 'Conserva su velocidad tanto en tierra como en agua.',
    description: 'Las invocaciones anfibias pueden moverse con su misma velocidad sobre tierra y agua. No sufren la reducción de movimiento que afecta a las terrestres cuando entran en zonas acuáticas.',
  },
  levitator: {
    id: 'levitator',
    label: 'Levitador',
    icon: 'assets/biotypes/biotype-levitator.svg',
    focus: 'Flotación baja',
    tags: ['biotipo', 'levitador', 'altura z', 'terreno'],
    summary: 'Se mueve ligeramente sobre el terreno y evita penalizaciones de biomas terrestres o acuáticos.',
    description: 'Las invocaciones levitadoras se desplazan en un plano Z limitado. No alcanzan alturas extremas como los voladores, pero no son afectadas por cambios normales de terreno terrestre o acuático.',
  },
  climber: {
    id: 'climber',
    label: 'Escalador',
    icon: 'assets/biotypes/biotype-climber.svg',
    focus: 'Movimiento vertical táctico',
    tags: ['biotipo', 'escalador', 'altura z', 'estructuras'],
    summary: 'Puede usar estructuras, árboles u obstáculos para subir y bajar en la escala Z.',
    description: 'Las invocaciones escaladoras pueden invertir su movilidad hacia la escala Z para subir o bajar. Si la superficie escalable se extiende por varias casillas, pueden combinar movimiento en XY y Z. Si solo ocupa una casilla, su movimiento se concentra en subir o bajar dentro de esa posición.',
  },
};

function getBiotypeProfile(type) {
  const key = type || 'none';
  return BIOTYPE_DB[key] || BIOTYPE_DB.none;
}

function getEffectiveBiotypeId(card) {
  return card?.biotype || 'none';
}

function getAttackProfile(card) {
  const profile = card?.attackProfile || {};
  const combatMode = profile.combatMode || profile.type || 'melee';
  const combatModeLabel = COMBAT_MODE_DB[combatMode]?.label || (combatMode === 'distance' || combatMode === 'longRange' ? 'Distancia' : combatMode === 'range' || combatMode === 'tacticalRange' ? 'Rango' : 'Cuerpo a cuerpo');
  const hasExplicitApplication = Object.prototype.hasOwnProperty.call(profile, 'applicationId') || Object.prototype.hasOwnProperty.call(profile, 'damageApplication');
  const explicitApplication = Object.prototype.hasOwnProperty.call(profile, 'applicationId') ? profile.applicationId : profile.damageApplication;
  return {
    type: combatMode,
    combatMode,
    label: profile.label || combatModeLabel,
    range: Number(profile.range ?? 1),
    precision: Number(profile.precision ?? 4),
    damage: Number(profile.damage ?? card?.stats?.damage ?? card?.stats?.atk ?? 1),
    damageNature: profile.damageNature || 'physical',
    applicationId: hasExplicitApplication ? explicitApplication : 'oscillationPartial',
    modifiers: Array.isArray(profile.modifiers) ? profile.modifiers : [],
  };
}

function ringDistance(aRow, aCol, bRow, bCol) {
  return Math.max(Math.abs(aRow - bRow), Math.abs(aCol - bCol));
}

function getEnemyPlayerId(playerId) { return playerId === 1 ? 2 : 1; }

function getUnitById(playerId, unitId) {
  return state.players[playerId]?.units.find(u => u.id === unitId) || null;
}


function getInvocationLimitUsage(playerId) {
  const player = state.players[playerId];
  if (!player) return 0;
  const active = (player.units || []).filter(unit => unit.status !== 'restoring').length;
  const queued = (player.castQueue || []).filter(item => CARD_LIBRARY[item.cardId]?.type === 'invocation').length;
  return active + queued;
}

function canQueueInvocationForPlayer(playerId, card) {
  if (card?.type !== 'invocation') return { ok: true };
  const usage = getInvocationLimitUsage(playerId);
  if (usage >= MAX_INVOCATIONS_PER_PLAYER) {
    return { ok: false, message: `Límite básico de ${MAX_INVOCATIONS_PER_PLAYER} invocaciones en arena/cola para J${playerId}.` };
  }
  return { ok: true };
}

function cancelResolutionPhaseUndo() {
  if (!state.phaseUndo) return;
  state.phaseUndo = null;
  state.resolutionActionTaken = true;
  renderPhaseUI();
}

function markResolutionActionTaken() {
  if (currentPhase().id === 'resolution') cancelResolutionPhaseUndo();
}

function undoResolutionToCasting() {
  if (!state.phaseUndo || currentPhase().id !== 'resolution' || state.resolutionActionTaken) return;
  if (state.phaseUndo.playerId !== state.activePlayer) return;
  clearTimeout(scheduleSustainedCombatResolution.timer);
  clearTimeout(scheduleSustainedStructureAttacks.timer);
  state.phaseIndex = state.phaseUndo.previousPhaseIndex;
  state.phaseUndo = null;
  state.selectedMover = null;
  state.pendingPowerAction = null;
  log('Regresaste a Kasteo antes de realizar acciones.');
  renderAll();
}


function isNinjaFamilyCard(card) {
  return card?.family === 'ninja';
}

function getSmokeBombSourceForUnit(playerId, unit) {
  if (!unit || unit.cardId !== 'ninjaNaitoSutoka') return null;
  if (unit.status === 'restoring') return null;
  if (hasActiveSmokeZoneForPlayer(playerId)) return null;
  return (unit.smokeBombsLeft ?? 0) > 0 ? unit : null;
}

function getAvailableNaitoSmokeUnit(playerId) {
  return (state.players[playerId]?.units || []).find(unit => getSmokeBombSourceForUnit(playerId, unit)) || null;
}

function hasActiveSmokeZoneForPlayer(playerId) {
  return (state.smokeZones || []).some(zone => zone.playerId === playerId && Number(zone.phasesRemaining ?? 0) > 0);
}

function unitCanUseSmokeBombPower(playerId, unit) {
  return Boolean(getSmokeBombSourceForUnit(playerId, unit));
}

function unitCanVoluntarilyActivateSmokePower(playerId, unit) {
  return playerId === LOCAL_PLAYER_ID
    && currentPhase().id === 'resolution'
    && state.activePlayer === playerId
    && unitCanUseSmokeBombPower(playerId, unit);
}

function getPowerDefinitionForUnit(playerId, unit) {
  const card = CARD_LIBRARY[unit?.cardId];
  return card?.power || null;
}

function unitHasExtendedActionInfo(playerId, unit) {
  const card = CARD_LIBRARY[unit?.cardId];
  if (!card) return false;
  if (card.power) return true;
  if (Array.isArray(card.abilities) && card.abilities.length > 0) return true;
  if (Array.isArray(card.extraWeapons) && card.extraWeapons.length > 0) return true;
  if (Array.isArray(card.attackProfile?.factors) && card.attackProfile.factors.length > 0) return true;
  if (Array.isArray(card.attackProfile?.modifiers) && card.attackProfile.modifiers.length > 0) return true;
  return false;
}

function unitShouldShowActionInfoButton(playerId, unit) {
  return unitHasExtendedActionInfo(playerId, unit);
}

function unitShouldOpenInfoOnDirectClick(playerId, unit) {
  if (!unit) return false;
  return !unitShouldShowActionInfoButton(playerId, unit) && !unitCanUseSmokeBombPower(playerId, unit);
}

function getCellsInRadius(row, col, radius, includeCenter = true) {
  const cells = [];
  for (let dr = -radius; dr <= radius; dr++) {
    for (let dc = -radius; dc <= radius; dc++) {
      const nextRow = row + dr;
      const nextCol = col + dc;
      if (!isInside(nextRow, nextCol)) continue;
      const dist = Math.max(Math.abs(dr), Math.abs(dc));
      if (dist > radius) continue;
      if (!includeCenter && dist === 0) continue;
      cells.push({ row: nextRow, col: nextCol, dist });
    }
  }
  return cells;
}

function getSmokeZonesAffectingUnit(playerId, unit) {
  if (!unit || unit.status === 'restoring') return [];
  const card = CARD_LIBRARY[unit.cardId];
  return (state.smokeZones || []).filter(zone => {
    if (zone.playerId !== playerId) return false;
    if (zone.type === 'kageNoMichi') {
      if (getCardTypeId(card) !== 'invocation') return false;
      const allowedElements = Array.isArray(zone.targetElements) && zone.targetElements.length ? zone.targetElements : ['oscuridad'];
      const unitElement = unit.elementId || getCardElementId(card);
      if (!allowedElements.includes(unitElement)) return false;
      const allowed = Array.isArray(zone.targetQualities) && zone.targetQualities.length ? zone.targetQualities : ['assassin', 'bandit', 'stalker'];
      const qualities = Array.isArray(card?.qualities) ? card.qualities : [];
      if (!qualities.some(q => allowed.includes(q))) return false;
      return Array.isArray(zone.hazeCells) && zone.hazeCells.some(cell => cell.row === unit.row && cell.col === unit.col);
    }
    if (!isNinjaFamilyCard(card)) return false;
    return ringDistance(unit.row, unit.col, zone.row, zone.col) <= (zone.radius ?? 3);
  });
}

function getSmokeSourceUnit(zone) {
  if (!zone || zone.playerId == null) return null;
  const units = state.players?.[zone.playerId]?.units || [];
  return units.find(unit => unit.id === zone.bombOwnerUnitId)
    || units.find(unit => unit.id === zone.sourceUnitId)
    || null;
}

function getSmokeHiddenSourceInfo(playerId, unit) {
  const affectingZones = getSmokeZonesAffectingUnit(playerId, unit);
  if (!affectingZones.length) return null;
  const zone = affectingZones.find(item => item.type === 'kageNoMichi') || affectingZones[0];
  const sourceUnit = getSmokeSourceUnit(zone);
  const sourceCard = sourceUnit ? CARD_LIBRARY[sourceUnit.cardId] : null;
  return {
    zone,
    sourceUnit,
    sourceCard,
    sourceName: zone?.type === 'kageNoMichi' ? 'Kage no Michi' : (sourceCard?.name || 'otra invocación aliada'),
  };
}

function removeActiveFactorFromUnit(unit, factorId, sourceType = null) {
  if (!unit) return;
  const active = Array.isArray(unit.activeFactors) ? unit.activeFactors : [];
  unit.activeFactors = active.filter(entry => {
    if (entry?.id !== factorId) return true;
    if (sourceType && entry?.sourceType !== sourceType) return true;
    return false;
  });
}

function addActiveFactorToUnit(unit, factorEntry) {
  if (!unit) return;
  const active = Array.isArray(unit.activeFactors) ? unit.activeFactors : [];
  const key = `${factorEntry.id}:${factorEntry.sourceType || ''}`;
  if (active.some(entry => `${entry.id}:${entry.sourceType || ''}` === key)) {
    unit.activeFactors = active.map(entry => `${entry.id}:${entry.sourceType || ''}` === key ? { ...entry, ...factorEntry } : entry);
    return;
  }
  active.push(factorEntry);
  unit.activeFactors = active;
}

function unitHasActiveFactor(unit, factorId) {
  return Array.isArray(unit?.activeFactors) && unit.activeFactors.some(entry => entry.id === factorId);
}

function refreshSmokeZoneEffects() {
  for (const playerId of [1, 2]) {
    for (const unit of state.players[playerId].units) {
      const affectingZones = getSmokeZonesAffectingUnit(playerId, unit);
      const normalSmokeZones = affectingZones.filter(zone => zone.type !== 'kageNoMichi');
      const kageZone = affectingZones.find(zone => zone.type === 'kageNoMichi');
      const smokeIds = normalSmokeZones.map(zone => zone.id);
      const suppressed = Array.isArray(unit.hiddenSuppressedZoneIds) ? unit.hiddenSuppressedZoneIds : [];

      if (!normalSmokeZones.length) {
        removeActiveFactorFromUnit(unit, 'hidden', 'smokeZone');
      } else {
        const smokeEligible = smokeIds.some(id => !suppressed.includes(id));
        if (smokeEligible) {
          addActiveFactorToUnit(unit, {
            id: 'hidden',
            level: 1,
            sourceType: 'smokeZone',
            sourceName: 'Bomba de humo',
          });
        } else {
          removeActiveFactorFromUnit(unit, 'hidden', 'smokeZone');
        }
      }

      if (kageZone) {
        addActiveFactorToUnit(unit, {
          id: 'hidden',
          level: 1,
          sourceType: 'kageNoMichi',
          sourceName: 'Kage no Michi',
        });
        unit.kageNoMichiDamageBonus = Number(kageZone.damageBonus ?? 1);
        unit.kageNoMichiPdaOverride = Number(kageZone.pdaOverrideForAssassinFactors ?? 6);
      } else {
        removeActiveFactorFromUnit(unit, 'hidden', 'kageNoMichi');
        unit.kageNoMichiDamageBonus = 0;
        unit.kageNoMichiPdaOverride = 0;
      }

      if (!normalSmokeZones.length && !kageZone) {
        unit.hiddenSuppressedZoneIds = [];
      }
    }
  }
}

function breakUnitHiddenFromSmoke(playerId, unit) {
  if (!unitHasActiveFactor(unit, 'hidden')) return;
  const affectingIds = getSmokeZonesAffectingUnit(playerId, unit)
    .filter(zone => zone.type !== 'kageNoMichi')
    .map(zone => zone.id);
  if (!affectingIds.length) return;
  unit.hiddenSuppressedZoneIds = Array.from(new Set([...(unit.hiddenSuppressedZoneIds || []), ...affectingIds]));
  removeActiveFactorFromUnit(unit, 'hidden', 'smokeZone');
}

function getSmokeZoneRadius(power = null) {
  const fallback = Number(power?.smokeRadius ?? 3);
  const configured = readRootCssNumber('--ctrl-smoke-zone-radius', fallback);
  return Math.max(1, Math.min(3, Math.round(configured)));
}

function buildSmokeZoneHazeCells(row, col, radius) {
  return getCellsInRadius(row, col, radius, true).map(cell => ({
    row: cell.row,
    col: cell.col,
    pulseSpeed: (1.35 + Math.random() * 1.35).toFixed(2),
    pulseDelay: (Math.random() * 2.8).toFixed(2),
  }));
}


function buildSmokeZoneParticles(row, col, radius) {
  const density = Math.max(0, Math.min(1, readRootCssNumber('--ctrl-smoke-cloud-density', 0.7)));
  const cells = getCellsInRadius(row, col, radius, true);
  const selected = cells.filter(() => Math.random() <= density);
  const fallback = selected.length ? selected : cells.slice(0, Math.max(1, Math.round(cells.length * density)));
  return fallback.map(cell => ({
    row: cell.row,
    col: cell.col,
    offsetXPct: ((Math.random() * 34) - 17).toFixed(2),
    offsetYPct: ((Math.random() * 34) - 17).toFixed(2),
    sizeScale: (0.78 + Math.random() * 0.72).toFixed(3),
    opacityScale: (0.72 + Math.random() * 0.42).toFixed(3),
    pulseSpeed: (2.2 + Math.random() * 1.8).toFixed(2),
    pulseDelay: (Math.random() * 1.8).toFixed(2),
  }));
}

function createSmokeZone(playerId, sourceUnitId, bombOwnerUnitId, row, col, power = null) {
  state.smokeZones = Array.isArray(state.smokeZones) ? state.smokeZones : [];
  const radius = getSmokeZoneRadius(power);
  state.smokeZones.push({
    id: `smoke_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    playerId,
    sourceUnitId,
    bombOwnerUnitId,
    row,
    col,
    radius,
    phasesRemaining: Number(power?.smokeDurationPhases ?? 6),
    createdAt: performance.now(),
    centerPulseDelay: (Math.random() * 2.2).toFixed(2),
    hazeCells: buildSmokeZoneHazeCells(row, col, radius),
    particles: buildSmokeZoneParticles(row, col, radius),
  });
  refreshSmokeZoneEffects();
}


function getKageNoMichiForwardDirection(playerId) {
  return playerId === 1 ? { dr: -1, dc: 0 } : { dr: 1, dc: 0 };
}

function getKageNoMichiRiskRow(playerId) {
  return playerId === 1 ? 0 : 8;
}

function buildKageNoMichiPathCells(playerId) {
  const caster = state.players[playerId]?.caster;
  if (!caster) return [];
  const dir = getKageNoMichiForwardDirection(playerId);
  const riskRow = getKageNoMichiRiskRow(playerId);
  const cells = [];
  let row = caster.row + dir.dr;
  const col = caster.col;
  while (isInside(row, col)) {
    cells.push({
      row,
      col,
      pulseSpeed: (1.25 + Math.random() * 1.15).toFixed(2),
      pulseDelay: (Math.random() * 2.4).toFixed(2),
    });
    if (row === riskRow) break;
    row += dir.dr;
  }
  return cells;
}

function buildKageNoMichiParticles(cells) {
  const sourceCells = Array.isArray(cells) ? cells : [];
  return sourceCells.map((cell, index) => ({
    row: cell.row,
    col: cell.col,
    offsetXPct: ((Math.random() * 30) - 15).toFixed(2),
    offsetYPct: ((Math.random() * 30) - 15).toFixed(2),
    sizeScale: (0.72 + Math.random() * 0.62).toFixed(3),
    opacityScale: (0.64 + Math.random() * 0.38).toFixed(3),
    pulseSpeed: (2.0 + Math.random() * 1.6).toFixed(2),
    pulseDelay: (Math.random() * 1.6).toFixed(2),
  }));
}

function createKageNoMichiZone(playerId, card = null) {
  state.smokeZones = Array.isArray(state.smokeZones) ? state.smokeZones : [];
  const cells = buildKageNoMichiPathCells(playerId);
  if (!cells.length) {
    log('Kage no Michi no encontró una línea válida frente al Kaster.');
    return false;
  }
  const first = cells[0];
  state.smokeZones.push({
    id: `kage_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    type: 'kageNoMichi',
    playerId,
    sourceType: 'spell',
    sourceCardId: card?.id || 'spellKageNoMichi',
    sourceName: card?.name || 'Kage no Michi',
    row: first.row,
    col: first.col,
    radius: 0,
    phasesRemaining: Number(card?.spellRules?.effect?.durationPhases ?? 9),
    createdAt: performance.now(),
    centerPulseDelay: (Math.random() * 2.2).toFixed(2),
    hazeCells: cells,
    particles: buildKageNoMichiParticles(cells),
    targetElements: card?.spellRules?.effect?.targetElements || ['oscuridad'],
    targetQualities: card?.spellRules?.effect?.targetQualities || ['assassin', 'bandit', 'stalker'],
    damageBonus: Number(card?.spellRules?.effect?.damageBonus ?? 1),
    pdaOverrideForAssassinFactors: Number(card?.spellRules?.effect?.pdaOverrideForAssassinFactors ?? 6),
  });
  refreshSmokeZoneEffects();
  showFloatingTextAt(first.row, first.col, 'KAGE NO MICHI', 'floating-combat buff');
  log(`Kage no Michi crea un camino de niebla desde ${coordLabel(first.row, first.col)} durante ${Number(card?.spellRules?.effect?.durationPhases ?? 9)} fases.`);
  return true;
}


function advanceSmokeZonesOnePhaseStep() {
  state.smokeZones = (state.smokeZones || [])
    .map(zone => ({ ...zone, phasesRemaining: Math.max(0, Number(zone.phasesRemaining ?? 6) - 1) }))
    .filter(zone => Number(zone.phasesRemaining ?? 0) > 0);
  refreshSmokeZoneEffects();
}

function animateSmokeBombLaunch(fromRow, fromCol, toRow, toCol) {
  return new Promise(resolve => {
    const from = cellCenter(fromRow, fromCol);
    const to = cellCenter(toRow, toCol);
    const boardRect = els.boardContent.getBoundingClientRect();
    const flyer = document.createElement('div');
    flyer.className = 'smoke-bomb-flyer';
    flyer.style.left = `${boardRect.left + (from.x / 100) * boardRect.width}px`;
    flyer.style.top = `${boardRect.top + (from.y / 100) * boardRect.height}px`;
    flyer.innerHTML = `<img src="${SMOKE_BOMB_ICON_ASSET}" alt="Bomba de humo">`;
    document.body.appendChild(flyer);
    const dx = ((to.x - from.x) / 100) * boardRect.width;
    const dy = ((to.y - from.y) / 100) * boardRect.height;
    flyer.animate([
      { transform: 'translate(-50%, -50%) scale(.72)' },
      { transform: `translate(calc(-50% + ${dx * 0.55}px), calc(-50% + ${dy * 0.45}px - 34px)) scale(1.18)` },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1)` },
    ], { duration: 560, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' }).finished.finally(() => {
      flyer.remove();
      resolve();
    });
  });
}

function beginSmokeBombTargeting(playerId, unitId) {
  const unit = getUnitById(playerId, unitId);
  const power = getPowerDefinitionForUnit(playerId, unit);
  const bombSource = getSmokeBombSourceForUnit(playerId, unit);
  if (!unit || unit.cardId !== 'ninjaNaitoSutoka' || !power || !bombSource) {
    log('No hay una bomba de humo disponible para activar.');
    return;
  }
  state.pendingPowerAction = { kind: 'smokeBomb', playerId, unitId };
  state.selectedMover = null;
  clearCombatMenus();
  renderAll();
  log(`${CARD_LIBRARY[unit.cardId]?.name || 'Invocación'} activa Sutoka hatsuen-dan. Elige una casilla dentro de radio ${power.throwRange ?? 3}.`);
}

async function resolveSmokeBombAt(row, col) {
  const pending = state.pendingPowerAction;
  if (!pending || pending.kind !== 'smokeBomb') return false;
  const unit = getUnitById(pending.playerId, pending.unitId);
  const power = getPowerDefinitionForUnit(pending.playerId, unit);
  const bombSource = getSmokeBombSourceForUnit(pending.playerId, unit);
  if (!unit || !power || !bombSource) {
    pending.reactionResolve?.('cancelled');
    state.pendingPowerAction = null;
    renderAll();
    return false;
  }
  const range = Number(power.throwRange ?? 3);
  if (ringDistance(unit.row, unit.col, row, col) > range) {
    log(`La bomba de humo solo puede lanzarse en un radio de ${range} casillas.`);
    return true;
  }
  if ((bombSource.smokeBombsLeft ?? 0) <= 0) {
    log('Naito Sutoka ya no tiene bombas de humo disponibles.');
    pending.reactionResolve?.('cancelled');
    state.pendingPowerAction = null;
    renderAll();
    return true;
  }
  markResolutionActionTaken();
  bombSource.smokeBombsLeft = Math.max(0, (bombSource.smokeBombsLeft ?? 0) - 1);
  state.pendingPowerAction = null;
  renderAll();
  await animateSmokeBombLaunch(unit.row, unit.col, row, col);
  createSmokeZone(pending.playerId, unit.id, bombSource.id, row, col, power);
  showFloatingTextAt(row, col, 'HUMO');
  log(`${CARD_LIBRARY[unit.cardId]?.name || 'Invocación'} lanza una bomba de humo en ${coordLabel(row, col)}. Quedan ${bombSource.smokeBombsLeft} bombas.`);
  pending.reactionResolve?.('activated');
  renderAll();
  return true;
}

function getSourceUnitFromSelection() {
  const sel = state.selectedMover;
  if (!sel || sel.type !== 'invocation') return null;
  const unit = getUnitById(sel.playerId, sel.unitId);
  if (!unit || unit.status === 'restoring') return null;
  return { playerId: sel.playerId, unit, card: CARD_LIBRARY[unit.cardId] };
}

function buildTarget(type, playerId, data = {}) {
  let row = data.row;
  let col = data.col;
  if (type === 'caster') { row = state.players[playerId].caster.row; col = state.players[playerId].caster.col; }
  if (type === 'guardian') { const g = state.players[playerId].guardians.find(item => item.id === data.guardianId); row = g?.row; col = g?.col; }
  if (type === 'invocation') { const u = getUnitById(playerId, data.unitId); row = u?.row; col = u?.col; }
  return { type, playerId, row, col, ...data };
}


function isSmokeReactionTarget(target) {
  if (!target || target.type !== 'invocation') return false;
  const unit = getUnitById(target.playerId, target.unitId);
  if (!unit || unit.status === 'restoring') return false;
  return true;
}

function isCasterOrSpellSource(source) {
  if (!source) return false;
  const type = source.type || source.sourceType || source.kind;
  if (type === 'caster' || type === 'kaster' || type === 'spell' || type === 'conjuro') return true;
  const cardType = source.card?.type || source.card?.cardType || source.cardType;
  return cardType === 'spell' || cardType === 'conjuro';
}

function getSmokeReactionSourceLabel(source, fallback = 'acción rival') {
  if (source?.type === 'caster' || source?.sourceType === 'caster' || source?.kind === 'caster') return 'el Kaster rival';
  if (isCasterOrSpellSource(source)) return 'un conjuro/poder rival';
  if (source?.type === 'invocation' || source?.unit) return 'una invocación rival';
  return fallback;
}

function canNaitoReactToRivalSource(source, target) {
  if (!source || !target || !isSmokeReactionTarget(target)) return false;
  if (source.playerId === target.playerId) return false;
  if (target.playerId !== LOCAL_PLAYER_ID) return false;
  const targetUnit = getUnitById(target.playerId, target.unitId);
  if (!targetUnit || unitHasActiveFactor(targetUnit, 'hidden')) return false;
  return Boolean(getAvailableNaitoSmokeUnit(target.playerId));
}

function showNaitoReactionMenu(targetPlayerId, targetUnitId, sourceLabel = 'acción rival') {
  return new Promise(resolve => {
    const targetUnit = getUnitById(targetPlayerId, targetUnitId);
    const naitoUnit = getAvailableNaitoSmokeUnit(targetPlayerId);
    if (!targetUnit || !naitoUnit || targetPlayerId !== LOCAL_PLAYER_ID) {
      resolve('skipped');
      return;
    }
    clearCombatMenus();
    const pos = cellCenter(targetUnit.row, targetUnit.col);
    const menu = document.createElement('div');
    menu.id = 'combatActionMenu';
    menu.className = 'combat-action-menu invocation-action-menu naito-reaction-menu';
    menu.style.left = `${pos.x}%`;
    menu.style.top = `${pos.y}%`;
    menu.innerHTML = `<button type="button" data-action="power">Poder</button>`;
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      if (document.body.contains(menu)) menu.remove();
      resolve(value);
    };
    const timer = window.setTimeout(() => finish('timeout'), 1400);
    menu.addEventListener('pointerdown', stopTargetMenuEvent);
    menu.addEventListener('click', event => event.stopPropagation());
    menu.querySelector('[data-action="power"]')?.addEventListener('click', event => {
      stopTargetMenuEvent(event);
      if (document.body.contains(menu)) menu.remove();
      window.clearTimeout(timer);
      state.pendingPowerAction = {
        kind: 'smokeBomb',
        playerId: targetPlayerId,
        unitId: naitoUnit.id,
        reactionTarget: { playerId: targetPlayerId, unitId: targetUnitId },
        reactionResolve: finish,
      };
      state.selectedMover = null;
      clearCombatMenus();
      renderAll();
      log(`Naito sutoka reacciona ante ${sourceLabel}: elige dónde lanzar la bomba de humo para cubrir al objetivo.`);
    }, { once: true });
    els.boardContent.appendChild(menu);
    log(`${CARD_LIBRARY[targetUnit.cardId]?.name || 'Invocación aliada'} fue seleccionada por ${sourceLabel}. Puedes activar Sutoka hatsuen-dan.`);
  });
}

async function offerNaitoSmokeReaction(source, target, sourceLabel = 'acción rival') {
  if (!canNaitoReactToRivalSource(source, target)) return false;
  const label = getSmokeReactionSourceLabel(source, sourceLabel);
  const result = await showNaitoReactionMenu(target.playerId, target.unitId, label);
  refreshSmokeZoneEffects();
  const updated = getUnitById(target.playerId, target.unitId);
  if (result === 'activated' && updated && unitHasActiveFactor(updated, 'hidden')) {
    log(`${CARD_LIBRARY[updated.cardId]?.name || 'Invocación aliada'} queda Oculta; la selección rival deja de ser válida.`);
    return true;
  }
  return false;
}

function isDistanceAttackProfile(profile) {
  const mode = String(profile?.combatMode || profile?.type || '').toLowerCase();
  return mode === 'distance' || mode === 'longrange' || mode === 'long-range';
}

function targetActionLabel(target, source = null) {
  const profile = source?.card ? getAttackProfile(source.card) : null;
  if (profile && isDistanceAttackProfile(profile)) return 'Atacar';
  return target?.type === 'invocation' ? 'Combatir' : 'Atacar';
}

function canSelectTarget(source, target) {
  if (!source || !target) return false;
  if (source.playerId === target.playerId) return false;
  if (source.unit?.status === 'restoring' || isUnitEngaged(source.unit)) return false;
  if (target.type === 'invocation') {
    const targetUnit = getUnitById(target.playerId, target.unitId);
    if (!targetUnit || targetUnit.status === 'restoring') return false;
    if (unitHasActiveFactor(targetUnit, 'hidden')) return false;
    // Regla base: una invocación ya trabada en batalla no puede ser seleccionada como nuevo objetivo.
    if (isUnitEngaged(targetUnit)) return false;
  }
  const profile = getAttackProfile(source.card);
  const dist = ringDistance(source.unit.row, source.unit.col, target.row, target.col);
  return dist >= 1 && dist <= profile.range;
}

function unitKey(playerId, unitId) { return `${playerId}:${unitId}`; }

function isUnitEngaged(unit) {
  return Boolean(unit?.engagedWith);
}

function areUnitsMutuallyEngaged(aPlayerId, aUnit, bPlayerId, bUnit) {
  return aUnit?.engagedWith?.playerId === bPlayerId &&
    aUnit?.engagedWith?.unitId === bUnit?.id &&
    bUnit?.engagedWith?.playerId === aPlayerId &&
    bUnit?.engagedWith?.unitId === aUnit?.id;
}

function clearUnitEngagement(playerId, unitId) {
  const unit = getUnitById(playerId, unitId);
  if (!unit) return;
  const other = unit.engagedWith;
  unit.engagedWith = null;
  if (other) {
    const otherUnit = getUnitById(other.playerId, other.unitId);
    if (otherUnit?.engagedWith?.playerId === playerId && otherUnit?.engagedWith?.unitId === unitId) {
      otherUnit.engagedWith = null;
    }
  }
}

function hasStructureAttackAnchor(unit) {
  return Boolean(unit?.structureAttackTarget);
}

function setStructureAttackAnchor(unit, target) {
  if (!unit || target?.type !== 'guardian') return;
  unit.structureAttackTarget = {
    type: 'guardian',
    playerId: target.playerId,
    guardianId: target.guardianId,
    row: target.row,
    col: target.col,
  };
  unit.movesLeft = 0;
}

function clearStructureAttackAnchor(unit) {
  if (unit) unit.structureAttackTarget = null;
}

function clearStructureAnchorsForTarget(target) {
  if (!target || target.type !== 'guardian') return;
  for (const playerId of [1, 2]) {
    for (const unit of state.players[playerId].units) {
      const anchored = unit.structureAttackTarget;
      if (anchored?.type === 'guardian' && anchored.playerId === target.playerId && anchored.guardianId === target.guardianId) {
        unit.structureAttackTarget = null;
      }
    }
  }
}

function getEngagedOpponentSnapshot(playerId, unit) {
  if (!unit?.engagedWith) return null;
  const other = unit.engagedWith;
  const otherUnit = getUnitById(other.playerId, other.unitId);
  if (!otherUnit) return null;
  if (otherUnit.engagedWith?.playerId !== playerId || otherUnit.engagedWith?.unitId !== unit.id) return null;
  return { playerId: other.playerId, unit: otherUnit };
}

function restoreCombatSurvivorIfNeeded(defeatedPlayerId, defeatedUnit, reason = 'fin de combate') {
  const opponent = getEngagedOpponentSnapshot(defeatedPlayerId, defeatedUnit);
  if (!opponent?.unit) return;
  if (opponent.unit.status === 'restoring') return;
  if ((opponent.unit.hp ?? 0) <= 0) return;

  // Primero se rompe el vínculo de combate; luego el sobreviviente vuelve a su punto de restauración.
  clearUnitEngagement(defeatedPlayerId, defeatedUnit.id);
  restoreInvocation(opponent.playerId, opponent.unit, `salida de combate: ${reason}`);
}

function showFloatingTextAt(row, col, text, className = 'floating-combat') {
  const pos = cellCenter(row, col);
  const div = document.createElement('div');
  div.className = className;
  div.textContent = String(text);
  div.style.left = `${pos.x}%`;
  div.style.top = `${pos.y}%`;
  els.boardContent.appendChild(div);
  setTimeout(() => div.remove(), 1900);
}

function canUnitDamageUnit(sourcePlayerId, sourceUnit, targetPlayerId, targetUnit) {
  if (!sourceUnit || !targetUnit || sourceUnit.status === 'restoring' || targetUnit.status === 'restoring') return false;
  const sourceCard = CARD_LIBRARY[sourceUnit.cardId];
  const profile = getAttackProfile(sourceCard);
  if (unitHasActiveFactor(targetUnit, 'hidden')) return false;
  const dist = ringDistance(sourceUnit.row, sourceUnit.col, targetUnit.row, targetUnit.col);
  return dist >= 1 && dist <= profile.range;
}

function openInfoForTarget(target) {
  if (!target) return;
  if (target.type === 'caster') openKasterInfo(target.playerId);
  else if (target.type === 'guardian') openGuardianInfo(target.playerId, target.guardianId);
  else if (target.type === 'invocation') {
    const unit = getUnitById(target.playerId, target.unitId);
    if (!unit) return;
    openCardInfo(unit.cardId, unit.originSlot ?? 0, unit.originTab ?? 0, { source: 'arena', playerId: target.playerId, unitId: unit.id });
  }
}


function clearCombatMenus() {
  state.selectedTarget = null;
  state.targetMenuGeneration = (state.targetMenuGeneration || 0) + 1;
  document.querySelectorAll(
    '#combatTargetMenu, #combatActionMenu, #combatChoiceMenu, .combat-target-menu, .combat-action-menu, .caster-defense-menu'
  ).forEach(node => node.remove());
}

function removeAllTargetMenusOnly() {
  document.querySelectorAll(
    '#combatTargetMenu, #combatActionMenu, #combatChoiceMenu, .combat-target-menu, .combat-action-menu'
  ).forEach(node => node.remove());
}

function stopTargetMenuEvent(event) {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation?.();
}


function createInvocationActionMenuElement(playerId, unit, options = {}) {
  const pos = options.pos || cellCenter(unit.row, unit.col);
  const menu = document.createElement('div');
  menu.id = options.id || 'combatActionMenu';
  menu.className = `combat-action-menu invocation-action-menu${options.extraClass ? ` ${options.extraClass}` : ''}`;
  menu.style.left = `${pos.x}%`;
  menu.style.top = `${pos.y}%`;

  const canPower = options.forcePower ? true : unitCanVoluntarilyActivateSmokePower(playerId, unit);
  const canInfo = options.forceInfo ? true : unitShouldShowActionInfoButton(playerId, unit);
  menu.innerHTML = [
    canInfo ? `<button type="button" data-action="info">Info</button>` : '',
    canPower ? `<button type="button" data-action="power">Poder</button>` : '',
  ].filter(Boolean).join('');

  return menu;
}

function createTargetChoiceMenuElement(target, source, options = {}) {
  const pos = options.pos || cellCenter(target.row, target.col);
  const menu = document.createElement('div');
  menu.id = options.id || 'combatChoiceMenu';
  menu.className = `combat-target-menu combat-choice-menu${options.extraClass ? ` ${options.extraClass}` : ''}`;
  if (options.generation !== undefined) menu.dataset.generation = String(options.generation);
  menu.style.left = `${pos.x}%`;
  menu.style.top = `${pos.y}%`;

  const actionLabel = options.actionLabel || targetActionLabel(target, source);
  menu.innerHTML = `
    <button type="button" data-action="info">Info</button>
    <button type="button" data-action="confirm">${actionLabel}</button>
  `;
  return menu;
}

function createCasterDefenseMenuElement(defenderId, source, amount, options = {}) {
  const caster = state.players[defenderId].caster;
  const pos = options.pos || cellCenter(caster.row, caster.col);
  const menu = document.createElement('div');
  menu.className = `caster-defense-menu${options.extraClass ? ` ${options.extraClass}` : ''}`;
  menu.style.left = `${pos.x}%`;
  menu.style.top = `${pos.y}%`;
  menu.innerHTML = `
    <button type="button" data-action="defend">Defender</button>
    <button type="button" data-action="counter">Contraatacar</button>
  `;
  return menu;
}


function showInvocationActionMenu(playerId, unitId) {
  const unit = getUnitById(playerId, unitId);
  if (!unit) return;
  if (!unitShouldShowActionInfoButton(playerId, unit) && !unitCanVoluntarilyActivateSmokePower(playerId, unit)) return;
  clearCombatMenus();
  const menu = createInvocationActionMenuElement(playerId, unit);

  if (!menu.innerHTML.trim()) return;
  menu.addEventListener('pointerdown', stopTargetMenuEvent);
  menu.addEventListener('click', event => event.stopPropagation());
  menu.querySelector('[data-action="info"]')?.addEventListener('click', event => {
    stopTargetMenuEvent(event);
    clearCombatMenus();
    openCardInfo(unit.cardId, null, null, { source: 'arena', playerId, unitId });
  });
  menu.querySelector('[data-action="power"]')?.addEventListener('click', event => {
    stopTargetMenuEvent(event);
    beginSmokeBombTargeting(playerId, unitId);
  });
  els.boardContent.appendChild(menu);
}

function showTargetMenu(target) {
  const source = getSourceUnitFromSelection();

  if (!source || !canSelectTarget(source, target)) {
    clearCombatMenus();
    openInfoForTarget(target);
    return;
  }

  removeAllTargetMenusOnly();

  const generation = state.targetMenuGeneration || 0;
  const menu = createTargetChoiceMenuElement(target, source, { generation });

  menu.addEventListener('pointerdown', stopTargetMenuEvent);
  menu.addEventListener('click', event => event.stopPropagation());

  const infoBtn = menu.querySelector('[data-action="info"]');
  const actionBtn = menu.querySelector('[data-action="confirm"]');

  infoBtn.addEventListener('click', event => {
    stopTargetMenuEvent(event);
    clearCombatMenus();
    openInfoForTarget(target);
  }, { once: true });

  actionBtn.addEventListener('click', event => {
    stopTargetMenuEvent(event);
    actionBtn.disabled = true;
    infoBtn.disabled = true;

    if (!document.body.contains(menu)) return;
    if (menu.dataset.generation !== String(generation)) return;

    selectCombatTarget(target);
  }, { once: true });

  els.boardContent.appendChild(menu);
}

function selectCombatTarget(target) {
  const source = getSourceUnitFromSelection();
  if (!source || !canSelectTarget(source, target)) {
    log('Ese objetivo no puede ser seleccionado por esta invocación.');
    clearCombatMenus();
    return;
  }

  state.selectedTarget = target;
  removeAllTargetMenusOnly();

  const actionLabel = targetActionLabel(target, source).toLowerCase();
  log(`${CARD_LIBRARY[source.unit.cardId]?.name || 'Invocación'} declara ${actionLabel} contra objetivo en ${coordLabel(target.row, target.col)}.`);

  executeSelectedDamage();
}

function shouldRestoreAfterDirectTarget(target) {
  return Boolean(target && target.type === 'caster');
}

async function executeSelectedDamage() {
  const source = getSourceUnitFromSelection();
  const target = state.selectedTarget;
  if (!source || !target || !canSelectTarget(source, target)) {
    log('No hay un objetivo válido para dañar.');
    clearCombatMenus();
    return false;
  }

  const sourcePlayerId = source.playerId;
  const sourceUnitId = source.unit.id;
  const profile = getAttackProfile(source.card);

  await executeAttackDamage(source, target, profile.damage);

  const liveSource = getUnitById(sourcePlayerId, sourceUnitId);
  if (liveSource && liveSource.status !== 'restoring') {
    liveSource.movesLeft = 0;
    if (shouldRestoreAfterDirectTarget(target)) {
      restoreInvocation(sourcePlayerId, liveSource, 'ataque al Kaster');
    }
  }

  clearCombatMenus();
  renderAll();
  return true;
}


function getTargetPositionForFx(target) {
  return getTargetBoardPosition(target);
}

function showMissAtTarget(target, label = 'FALLÓ') {
  const pos = getTargetPositionForFx(target);
  if (!pos) return;
  showFloatingTextAt(pos.row, pos.col, label, 'floating-miss');
}

function showFactorMissAtTarget(target, factorId, label = 'FALLÓ') {
  const pos = getTargetPositionForFx(target);
  if (!pos) return;
  const factor = getFactorProfile(factorId);
  const center = cellCenter(pos.row, pos.col);
  const div = document.createElement('div');
  div.className = 'floating-factor-miss';
  div.style.left = `${center.x}%`;
  div.style.top = `${Math.max(3, center.y - 5)}%`;
  div.innerHTML = `${factor?.icon ? `<img src="${factor.icon}" alt="${factor.label}">` : ''}<span>${label}</span>`;
  els.boardContent.appendChild(div);
  setTimeout(() => div.remove(), 1300);
}

function showStructureDestroyFx(target) {
  const pos = getTargetBoardPosition(target);
  if (!pos || !els.boardContent) return;
  const center = cellCenter(pos.row, pos.col);
  const color = getOwnerColor(target.playerId) || '#9b4dff';
  const fx = document.createElement('div');
  fx.className = 'structure-destroy-fx';
  fx.style.left = `${center.x}%`;
  fx.style.top = `${center.y}%`;
  fx.style.setProperty('--destroy-color', color);
  fx.innerHTML = '<span></span><span></span><span></span><span></span><span></span><span></span><i></i><i></i><i></i>';
  els.boardContent.appendChild(fx);
  setTimeout(() => fx.remove(), 1250);
}

function triggerStructureDestroySequence(target, guardian) {
  if (!target || !guardian || guardian.destroyingDone) return;
  guardian.destroying = true;
  guardian.destroyingDone = true;
  guardian.resistance = 0;
  clearStructureAnchorsForTarget(target);
  renderUnits();
  const color = getOwnerColor(target.playerId) || '#9b4dff';
  const node = document.querySelector(`.unit.guardian[data-player-id="${target.playerId}"][data-guardian-id="${target.guardianId}"]`);
  if (node) {
    node.classList.add('structure-destroying');
    node.style.setProperty('--destroy-color', color);
  }
  setTimeout(() => showStructureDestroyFx({ ...target, row: guardian.row, col: guardian.col }), 920);
  setTimeout(() => {
    guardian.active = false;
    guardian.destroying = false;
    guardian.destroyingDone = false;
    renderUnits();
  }, 1420);
}

function showCriticalSlashAtTarget(target) {
  const pos = getTargetPositionForFx(target);
  if (pos) {
    const center = cellCenter(pos.row, pos.col);
    const slash = document.createElement('div');
    slash.className = 'critical-slash-fx';
    slash.style.left = `${center.x}%`;
    slash.style.top = `${center.y}%`;
    els.boardContent.appendChild(slash);
    setTimeout(() => slash.remove(), 820);
  }
  if (target?.type === 'invocation') {
    const row = document.querySelector(`.combat-side.player-${target.playerId}`);
    if (row) {
      row.classList.remove('critical-slash-flash');
      void row.offsetWidth;
      row.classList.add('critical-slash-flash');
      setTimeout(() => row.classList.remove('critical-slash-flash'), 820);
    }
  }
}

function resolveAttackRoll(source, target, baseAmount) {
  const card = source?.card || CARD_LIBRARY[source?.unit?.cardId];
  const profile = getAttackProfile(card);
  const precisionPda = Number(profile.precision ?? 0);
  if (!rollPrecisionPda(precisionPda)) {
    showMissAtTarget(target, 'FALLÓ');
    log(`${card?.name || 'Invocación'} falla el ataque normal (${precisionPda} PDA).`);
    return { hit: false, amount: 0, critical: false, criticalMiss: false };
  }

  let amount = Number(baseAmount ?? profile.damage ?? 0);
  if (source?.unit && Number(source.unit.kageNoMichiDamageBonus || 0) > 0) amount += Number(source.unit.kageNoMichiDamageBonus || 0);
  let critical = false;
  let criticalMiss = false;
  const criticalFactor = target?.type === 'guardian' ? null : getCardAttackFactors(card).find(f => f.id === 'criticalHit');
  if (criticalFactor) {
    const level = Number(criticalFactor.level || 1);
    const pda = getEffectiveFactorPda('criticalHit', level, source, criticalFactor);
    if (rollPda(pda)) {
      amount = Math.ceil(amount * getFactorMultiplier('criticalHit', level));
      critical = true;
      showCriticalSlashAtTarget(target);
      log(`${card?.name || 'Invocación'} activa Golpe crítico ${level} (${pda} PDA).`);
    } else {
      criticalMiss = true;
      showFactorMissAtTarget(target, 'criticalHit', 'FALLÓ');
      log(`${card?.name || 'Invocación'} falla Golpe crítico ${level} (${pda} PDA).`);
    }
  }
  return { hit: true, amount, critical, criticalMiss };
}


async function resolveTargetedCasterOrSpellEffect(source, target, effectCallback, sourceLabel = 'efecto rival') {
  const cancelledByNaito = await offerNaitoSmokeReaction(source, target, sourceLabel);
  if (cancelledByNaito) {
    clearCombatMenus();
    renderAll();
    return false;
  }
  if (typeof effectCallback === 'function') await effectCallback();
  return true;
}


function getTargetIdentityKey(target) {
  if (!target) return '';
  if (target.type === 'invocation') return `invocation:${target.playerId}:${target.unitId}`;
  if (target.type === 'guardian') return `guardian:${target.playerId}:${target.guardianId}`;
  if (target.type === 'caster') return `caster:${target.playerId}`;
  return `${target.type || 'target'}:${target.playerId || ''}:${target.row || 0}:${target.col || 0}`;
}

function getOscillationDirection(sourceUnit, target) {
  const pos = getTargetBoardPosition(target);
  if (!sourceUnit || !pos) return null;
  const dx = Number(pos.col) - Number(sourceUnit.col);
  const dy = Number(pos.row) - Number(sourceUnit.row);
  if (!dx && !dy) return null;
  const length = Math.hypot(dx, dy) || 1;
  return { x: dx / length, y: dy / length, dx, dy };
}

function isCellInOscillationSector(sourceUnit, row, col, direction, range) {
  if (!sourceUnit || !direction) return false;
  const dist = ringDistance(sourceUnit.row, sourceUnit.col, row, col);
  if (dist < 1 || dist > range) return false;
  const vx = col - sourceUnit.col;
  const vy = row - sourceUnit.row;
  const len = Math.hypot(vx, vy) || 1;
  const dot = (vx / len) * direction.x + (vy / len) * direction.y;
  return dot >= -0.0001;
}

function getOscillationSweepMetrics(sourceUnit, row, col, direction) {
  const vx = col - sourceUnit.col;
  const vy = row - sourceUnit.row;
  const rightX = -direction.y;
  const rightY = direction.x;
  return {
    right: vx * rightX + vy * rightY,
    front: vx * direction.x + vy * direction.y,
    distance: ringDistance(sourceUnit.row, sourceUnit.col, row, col),
  };
}

function compareOscillationSweepEntries(a, b) {
  if (Math.abs(b.metrics.right - a.metrics.right) > 0.0001) return b.metrics.right - a.metrics.right;
  if (Math.abs(a.metrics.front - b.metrics.front) > 0.0001) return a.metrics.front - b.metrics.front;
  if (a.metrics.distance !== b.metrics.distance) return a.metrics.distance - b.metrics.distance;
  if (a.row !== b.row) return a.row - b.row;
  return a.col - b.col;
}

function collectOscillationSweepCells(sourceUnit, direction, range) {
  const cells = [];
  for (let row = sourceUnit.row - range; row <= sourceUnit.row + range; row += 1) {
    for (let col = sourceUnit.col - range; col <= sourceUnit.col + range; col += 1) {
      if (!isInside(row, col)) continue;
      if (!isCellInOscillationSector(sourceUnit, row, col, direction, range)) continue;
      cells.push({ row, col, metrics: getOscillationSweepMetrics(sourceUnit, row, col, direction) });
    }
  }
  return cells.sort(compareOscillationSweepEntries);
}

function collectOscillationTargets(source, target, direction, range) {
  const attackerPlayerId = source.playerId;
  const targets = [];
  for (const playerId of [1, 2]) {
    if (playerId === attackerPlayerId) continue;
    const player = state.players[playerId];
    for (const unit of [...(player.units || [])]) {
      if (!unit || unit.status === 'restoring') continue;
      if (!isCellInOscillationSector(source.unit, unit.row, unit.col, direction, range)) continue;
      targets.push({ type: 'invocation', playerId, unitId: unit.id, row: unit.row, col: unit.col, metrics: getOscillationSweepMetrics(source.unit, unit.row, unit.col, direction) });
    }
    for (const guardian of [...(player.guardians || [])]) {
      if (!guardian || guardian.active === false || guardian.destroying) continue;
      if (!isCellInOscillationSector(source.unit, guardian.row, guardian.col, direction, range)) continue;
      targets.push({ type: 'guardian', playerId, guardianId: guardian.id, row: guardian.row, col: guardian.col, metrics: getOscillationSweepMetrics(source.unit, guardian.row, guardian.col, direction) });
    }
    const caster = player.caster;
    if (caster && isCellInOscillationSector(source.unit, caster.row, caster.col, direction, range)) {
      targets.push({ type: 'caster', playerId, row: caster.row, col: caster.col, metrics: getOscillationSweepMetrics(source.unit, caster.row, caster.col, direction) });
    }
  }
  const selectedKey = getTargetIdentityKey(target);
  return targets
    .filter((entry, index, array) => array.findIndex(other => getTargetIdentityKey(other) === getTargetIdentityKey(entry)) === index)
    .sort((a, b) => {
      const base = compareOscillationSweepEntries(a, b);
      if (base !== 0) return base;
      // Mantiene estable el objetivo seleccionado si comparte casilla/orden con otro objetivo.
      if (getTargetIdentityKey(a) === selectedKey) return -1;
      if (getTargetIdentityKey(b) === selectedKey) return 1;
      return 0;
    });
}

async function showOscillationPartialSweepFx(source, target, direction, range) {
  if (!els.boardContent || !source?.unit || !direction) return;
  const cells = collectOscillationSweepCells(source.unit, direction, range);
  const layer = document.createElement('div');
  layer.className = 'oscillation-sweep-layer';
  layer.setAttribute('aria-hidden', 'true');
  const boardRect = els.boardContent.getBoundingClientRect();
  const activeGridRect = (source.unit.row >= 9 ? els.allyGrid : els.enemyGrid).getBoundingClientRect();
  const cellWPct = boardRect.width ? ((activeGridRect.width / 9) / boardRect.width) * 100 : 5.5;
  const cellHPct = boardRect.height ? ((activeGridRect.height / 9) / boardRect.height) * 100 : 3.5;

  const grouped = [];
  const groupByKey = new Map();
  cells.forEach(cell => {
    const key = Number(cell.metrics?.right ?? 0).toFixed(4);
    let group = groupByKey.get(key);
    if (!group) {
      group = { key, cells: [] };
      groupByKey.set(key, group);
      grouped.push(group);
    }
    group.cells.push(cell);
  });

  grouped.forEach((group, lineIndex) => {
    group.cells.sort((a, b) => {
      if ((b.metrics?.front ?? 0) !== (a.metrics?.front ?? 0)) return (b.metrics?.front ?? 0) - (a.metrics?.front ?? 0);
      if ((b.metrics?.distance ?? 0) !== (a.metrics?.distance ?? 0)) return (b.metrics?.distance ?? 0) - (a.metrics?.distance ?? 0);
      return a.row - b.row || a.col - b.col;
    });
    const impactCell = [...group.cells]
      .filter(cell => Number(cell.metrics?.distance ?? 0) >= range)
      .sort((a, b) => {
        if ((b.metrics?.front ?? 0) !== (a.metrics?.front ?? 0)) return (b.metrics?.front ?? 0) - (a.metrics?.front ?? 0);
        if ((b.metrics?.distance ?? 0) !== (a.metrics?.distance ?? 0)) return (b.metrics?.distance ?? 0) - (a.metrics?.distance ?? 0);
        return a.row - b.row || a.col - b.col;
      })[0] || group.cells[0];

    group.cells.forEach((cell, cellIndex) => {
      const pos = cellCenter(cell.row, cell.col);
      const node = document.createElement('span');
      const isImpactLead = impactCell && impactCell.row === cell.row && impactCell.col === cell.col;
      node.className = `oscillation-sweep-cell ${isImpactLead ? 'oscillation-impact-cell' : 'oscillation-inner-cell'}`;
      node.style.left = `${pos.x}%`;
      node.style.top = `${pos.y}%`;
      node.style.width = `${cellWPct * 0.86}%`;
      node.style.height = `${cellHPct * 0.86}%`;
      node.style.setProperty('--oscillation-line-index', lineIndex);
      node.style.setProperty('--oscillation-cell-index', cellIndex);
      node.style.setProperty('--oscillation-delay', `calc(var(--ctrl-oscillation-cell-delay, 34ms) * ${lineIndex})`);
      if (isImpactLead) {
        const impact = document.createElement('span');
        impact.className = 'oscillation-impact-icon';
        node.appendChild(impact);
      }
      layer.appendChild(node);
    });
  });

  els.boardContent.appendChild(layer);
  const duration = readRootCssNumber('--ctrl-oscillation-sweep-duration-ms', 620);
  const delay = readRootCssNumber('--ctrl-oscillation-cell-delay-ms', 34);
  const total = Math.max(520, duration + (grouped.length * delay) + 220);
  await sleep(Math.min(2200, total));
  layer.remove();
}


function isTargetStillValid(target) {
  if (!target) return false;
  if (target.type === 'invocation') {
    const unit = getUnitById(target.playerId, target.unitId);
    return Boolean(unit && unit.status !== 'restoring');
  }
  if (target.type === 'guardian') {
    const guardian = state.players[target.playerId]?.guardians?.find(g => g.id === target.guardianId);
    return Boolean(guardian && guardian.active !== false && !guardian.destroying);
  }
  if (target.type === 'caster') {
    const caster = state.players[target.playerId]?.caster;
    return Boolean(caster && Number(caster.life ?? 1) > 0);
  }
  return Boolean(getTargetBoardPosition(target));
}

async function performOscillationPartialSweep(source, target, amount, profile, reasonLabel = 'Oscilación parcial') {
  const direction = getOscillationDirection(source.unit, target);
  if (!direction) return false;
  const range = Number(profile.range ?? 1);
  triggerUnitAttackLunge(source.playerId, source.unit, target);
  await sleep(420);
  await showOscillationPartialSweepFx(source, target, direction, range);
  const outcome = resolveAttackRoll(source, target, amount);
  if (!outcome.hit) return true;
  if (outcome.criticalMiss) await sleep(420);

  const sweptTargets = collectOscillationTargets(source, target, direction, range);
  if (!sweptTargets.length) return true;
  sweptTargets.forEach((sweptTarget, index) => {
    const damageAmount = index === 0 ? outcome.amount : Math.max(1, Math.ceil(outcome.amount * 0.5));
    showFloatingTextAt(sweptTarget.row, sweptTarget.col, index === 0 ? '100%' : '50%', 'floating-combat oscillation-hit-label');
    applyDamageToTarget(source, sweptTarget, damageAmount);
  });
  log(`${CARD_LIBRARY[source.unit.cardId]?.name || 'Invocación'} aplica ${reasonLabel}: ${sweptTargets.length} objetivo${sweptTargets.length === 1 ? '' : 's'} alcanzado${sweptTargets.length === 1 ? '' : 's'}.`);
  return true;
}

async function executeOscillationPartialAttack(source, target, amount, profile) {
  const sourceUnit = getUnitById(source.playerId, source.unit.id);
  if (!sourceUnit || sourceUnit.status === 'restoring') return true;
  const liveSource = { ...source, unit: sourceUnit };

  const firstSweep = await performOscillationPartialSweep(liveSource, target, amount, profile, 'Oscilación parcial');
  if (!firstSweep) return false;

  let currentSource = getUnitById(source.playerId, source.unit.id);
  if (!currentSource || currentSource.status === 'restoring') return true;

  if (target.type === 'invocation') {
    const responseUnit = getUnitById(target.playerId, target.unitId);
    if (responseUnit && responseUnit.status !== 'restoring' && canUnitDamageUnit(target.playerId, responseUnit, source.playerId, currentSource)) {
      await performInvocationCombatStrike(target.playerId, responseUnit, source.playerId, currentSource, 'respuesta contra Oscilación parcial');
    }
  }

  currentSource = getUnitById(source.playerId, source.unit.id);
  if (currentSource && currentSource.status !== 'restoring' && unitHasCardAttackFactor(currentSource, 'extraAttack') && isTargetStillValid(target)) {
    const factor = getFactorProfile('extraAttack');
    showFloatingTextAt(currentSource.row, currentSource.col, factor?.label || 'ATAQUE EXTRA');
    log(`${CARD_LIBRARY[currentSource.cardId]?.name || 'Invocación'} activa Ataque extra.`);
    await sleep(360);
    await performOscillationPartialSweep({ ...source, unit: currentSource, card: CARD_LIBRARY[currentSource.cardId] }, target, amount, profile, 'Ataque extra con Oscilación parcial');
  }

  currentSource = getUnitById(source.playerId, source.unit.id);
  if (currentSource && currentSource.status !== 'restoring') restoreInvocation(source.playerId, currentSource, 'ataque con Oscilación parcial');
  return true;
}


function getBoardPercentPointFromClient(clientX, clientY) {
  if (!els.boardContent) return null;
  const rect = els.boardContent.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  return {
    x: ((clientX - rect.left) / rect.width) * 100,
    y: ((clientY - rect.top) / rect.height) * 100,
    px: clientX - rect.left,
    py: clientY - rect.top,
  };
}

function getUnitFxPoint(playerId, unitId, fallbackPosition = null) {
  const node = getUnitDomNode(playerId, unitId);
  if (node) {
    const rect = node.getBoundingClientRect();
    const point = getBoardPercentPointFromClient(rect.left + rect.width / 2, rect.top + rect.height / 2);
    if (point) return point;
  }
  if (fallbackPosition) {
    const fallback = cellCenter(fallbackPosition.row, fallbackPosition.col);
    const boardRect = els.boardContent?.getBoundingClientRect?.();
    return { x: fallback.x, y: fallback.y, px: (fallback.x / 100) * (boardRect?.width || 0), py: (fallback.y / 100) * (boardRect?.height || 0) };
  }
  return null;
}

function getTargetFxPoint(target) {
  if (!target) return null;
  if (target.type === 'invocation') {
    const unit = getUnitById(target.playerId, target.unitId);
    return getUnitFxPoint(target.playerId, target.unitId, unit || target);
  }
  const pos = getTargetBoardPosition(target);
  if (!pos) return null;
  const fallback = cellCenter(pos.row, pos.col);
  const boardRect = els.boardContent?.getBoundingClientRect?.();
  return { x: fallback.x, y: fallback.y, px: (fallback.x / 100) * (boardRect?.width || 0), py: (fallback.y / 100) * (boardRect?.height || 0) };
}

async function showDistanceAttackFx(source, target) {
  if (!els.boardContent || !source?.unit || !target) return;
  const from = getUnitFxPoint(source.playerId, source.unit.id, source.unit);
  const to = getTargetFxPoint(target);
  if (!from || !to) return;
  const dxPx = to.px - from.px;
  const dyPx = to.py - from.py;
  const angle = Math.atan2(dyPx, dxPx) * 180 / Math.PI;

  const charge = document.createElement('span');
  charge.className = 'distance-attack-charge-fx';
  charge.style.left = `${from.x}%`;
  charge.style.top = `${from.y}%`;
  els.boardContent.appendChild(charge);

  await sleep(240);

  const sourceCard = CARD_LIBRARY[source.unit?.cardId];
  const sourceElementId = getEffectiveCardElementId(sourceCard, source.playerId);
  const projectileColor = getElementColorById(sourceElementId, getPlayerElementColor(source.playerId));

  const projectile = document.createElement('span');
  projectile.className = 'distance-attack-projectile-fx distance-projectile-type-arrow';
  projectile.style.left = `${from.x}%`;
  projectile.style.top = `${from.y}%`;
  projectile.style.setProperty('--projectile-x', `${dxPx}px`);
  projectile.style.setProperty('--projectile-y', `${dyPx}px`);
  projectile.style.setProperty('--projectile-angle', `${angle}deg`);
  projectile.style.setProperty('--projectile-color', projectileColor);
  els.boardContent.appendChild(projectile);

  await sleep(430);
  safeRemove(charge);

  const impact = document.createElement('span');
  impact.className = 'distance-attack-impact-fx arrow-impact-fx';
  impact.style.left = `${to.x}%`;
  impact.style.top = `${to.y}%`;
  els.boardContent.appendChild(impact);

  await sleep(260);
  safeRemove(projectile);
  safeRemove(impact);
}

function getWeaponTypeForAttackUnit(unit) {
  const card = CARD_LIBRARY[unit?.cardId];
  return card?.weaponType || card?.attackProfile?.weaponType || getAttackProfile(card).weaponType || 'golpe';
}

async function showWeaponAttackFx(source, target, weaponType = 'golpe') {
  if (!els.boardContent || !source?.unit || !target) return;
  const targetPoint = getTargetFxPoint(target);
  if (!targetPoint) return;
  const normalizedWeapon = String(weaponType || '').toLowerCase();
  if (normalizedWeapon === 'espada' || normalizedWeapon === 'katana') {
    const slash = document.createElement('span');
    slash.className = 'weapon-slash-fx sword-slash-fx';
    slash.style.left = `${targetPoint.x}%`;
    slash.style.top = `${targetPoint.y}%`;
    els.boardContent.appendChild(slash);

    await sleep(150);

    const impact = document.createElement('span');
    impact.className = 'weapon-impact-fx sword-impact-fx';
    impact.style.left = `${targetPoint.x}%`;
    impact.style.top = `${targetPoint.y}%`;
    els.boardContent.appendChild(impact);

    await sleep(260);
    safeRemove(slash);
    safeRemove(impact);
    return;
  }

  const impact = document.createElement('span');
  impact.className = 'weapon-impact-fx basic-impact-fx';
  impact.style.left = `${targetPoint.x}%`;
  impact.style.top = `${targetPoint.y}%`;
  els.boardContent.appendChild(impact);
  await sleep(210);
  safeRemove(impact);
}

async function executeDistanceAttackDamage(source, target, amount, profile, options = {}) {
  clearStructureAttackAnchor(source.unit);
  showFloatingTextAt(source.unit.row, source.unit.col, 'DISTANCIA');
  await showDistanceAttackFx(source, target);
  const outcome = resolveAttackRoll(source, target, amount);
  if (!outcome.hit) {
    const liveSource = getUnitById(source.playerId, source.unit.id);
    if (!options.skipRestore && liveSource && liveSource.status !== 'restoring') restoreInvocation(source.playerId, liveSource, 'ataque a distancia fallido');
    return true;
  }
  if (outcome.criticalMiss) await sleep(360);

  if (target.type === 'caster' && target.playerId === LOCAL_PLAYER_ID && source.playerId !== LOCAL_PLAYER_ID) {
    await handleIncomingCasterAttack(source, target, outcome.amount);
  } else {
    applyDamageToTarget(source, target, outcome.amount);
  }

  let liveSource = getUnitById(source.playerId, source.unit.id);
  if (!options.isExtraAttack && liveSource && liveSource.status !== 'restoring' && unitHasCardAttackFactor(liveSource, 'extraAttack') && isTargetStillValid(target)) {
    const factor = getFactorProfile('extraAttack');
    showFloatingTextAt(liveSource.row, liveSource.col, factor?.label || 'ATAQUE EXTRA');
    log(`${CARD_LIBRARY[liveSource.cardId]?.name || 'Invocación'} activa Ataque extra.`);
    await sleep(360);
    await executeDistanceAttackDamage(
      { ...source, unit: liveSource, card: CARD_LIBRARY[liveSource.cardId] },
      target,
      amount,
      profile,
      { skipRestore: true, isExtraAttack: true }
    );
  }

  liveSource = getUnitById(source.playerId, source.unit.id);
  if (!options.skipRestore && liveSource && liveSource.status !== 'restoring') restoreInvocation(source.playerId, liveSource, 'ataque a distancia');
  return true;
}


async function performDirectExtraAttackIfAvailable(source, target, amount) {
  const liveSource = source?.unit ? getUnitById(source.playerId, source.unit.id) : null;
  if (!liveSource || liveSource.status === 'restoring') return false;
  if (!unitHasCardAttackFactor(liveSource, 'extraAttack')) return false;
  if (!isTargetStillValid(target)) return false;

  const card = CARD_LIBRARY[liveSource.cardId];
  const sourceLike = { ...source, unit: liveSource, card };
  const factor = getFactorProfile('extraAttack');
  showFloatingTextAt(liveSource.row, liveSource.col, factor?.label || 'ATAQUE EXTRA');
  log(`${card?.name || 'Invocación'} activa Ataque extra.`);
  await sleep(360);

  triggerUnitAttackLunge(source.playerId, liveSource, target);
  await sleep(300);
  await showWeaponAttackFx(sourceLike, target, getWeaponTypeForAttackUnit(liveSource));
  await sleep(240);

  const outcome = resolveAttackRoll(sourceLike, target, amount);
  if (!outcome.hit) return true;
  if (outcome.criticalMiss) await sleep(680);

  if (target.type === 'caster' && target.playerId === LOCAL_PLAYER_ID && source.playerId !== LOCAL_PLAYER_ID) {
    await handleIncomingCasterAttack(sourceLike, target, outcome.amount);
  } else {
    applyDamageToTarget(sourceLike, target, outcome.amount);
  }
  return true;
}

async function executeAttackDamage(source, target, amount) {
  const sourceLabel = getSmokeReactionSourceLabel(source, 'un ataque rival');
  const cancelledByNaito = await offerNaitoSmokeReaction(source, target, sourceLabel);
  if (cancelledByNaito) {
    clearCombatMenus();
    renderAll();
    return;
  }
  markResolutionActionTaken();
  const actingUnit = source?.unit ? getUnitById(source.playerId, source.unit.id) : null;
  if (actingUnit) breakUnitHiddenFromSmoke(source.playerId, actingUnit);
  const profile = getAttackProfile(source.card || CARD_LIBRARY[source?.unit?.cardId]);
  if (profile.applicationId === 'oscillationPartial') {
    clearStructureAttackAnchor(source.unit);
    await executeOscillationPartialAttack(source, target, amount, profile);
    return;
  }
  if (isDistanceAttackProfile(profile)) {
    await executeDistanceAttackDamage(source, target, amount, profile);
    return;
  }
  if (target.type === 'invocation') {
    clearStructureAttackAnchor(source.unit);
    await enterInvocationCombat(source, target);
    return;
  }

  // Guardianes y Kaster se atacan, no se combaten:
  // consume acción/movilidad, pero NO crea engagedWith.
  triggerUnitAttackLunge(source.playerId, source.unit, target);
  await sleep(300);
  await showWeaponAttackFx(source, target, getWeaponTypeForAttackUnit(source.unit));
  await sleep(240);
  const outcome = resolveAttackRoll(source, target, amount);
  if (!outcome.hit) {
    const liveSource = getUnitById(source.playerId, source.unit.id);
    if (target.type === 'caster' && liveSource && liveSource.status !== 'restoring') {
      restoreInvocation(source.playerId, liveSource, 'ataque al Kaster fallido');
    }
    return;
  }
  if (outcome.criticalMiss) await sleep(680);

  if (target.type === 'caster' && target.playerId === LOCAL_PLAYER_ID && source.playerId !== LOCAL_PLAYER_ID) {
    await handleIncomingCasterAttack(source, target, outcome.amount);
    const liveSource = getUnitById(source.playerId, source.unit.id);
    if (liveSource && liveSource.status !== 'restoring') restoreInvocation(source.playerId, liveSource, 'ataque al Kaster');
    return;
  }
  applyDamageToTarget(source, target, outcome.amount);

  if (target.type === 'guardian' && isTargetStillValid(target)) {
    await performDirectExtraAttackIfAvailable(source, target, amount);
  }

  if (target.type === 'caster') {
    const liveSource = getUnitById(source.playerId, source.unit.id);
    if (liveSource && liveSource.status !== 'restoring') {
      restoreInvocation(source.playerId, liveSource, 'ataque al Kaster');
    }
    return;
  }

  // Solo estructura/Guardián ancla al atacante. El Kaster restaura al atacante por otra regla.
  if (target.type === 'guardian') {
    const guardian = state.players[target.playerId].guardians.find(g => g.id === target.guardianId);
    if (guardian && guardian.active !== false && getUnitById(source.playerId, source.unit.id)) {
      setStructureAttackAnchor(source.unit, target);
    }
  }
}

async function enterInvocationCombat(source, target) {
  const attacker = getUnitById(source.playerId, source.unit.id);
  const defender = getUnitById(target.playerId, target.unitId);
  if (!attacker || !defender || attacker.status === 'restoring' || defender.status === 'restoring') return;

  clearStructureAttackAnchor(attacker);
  clearStructureAttackAnchor(defender);
  attacker.engagedWith = { playerId: target.playerId, unitId: defender.id };
  defender.engagedWith = { playerId: source.playerId, unitId: attacker.id };
  attacker.movesLeft = 0;
  defender.movesLeft = 0;

  renderUnits();
  renderCombatHud();
  showFloatingTextAt(attacker.row, attacker.col, 'COMBATIENDO');
  showFloatingTextAt(defender.row, defender.col, 'COMBATIENDO');
  log(`${CARD_LIBRARY[attacker.cardId]?.name || 'Invocación'} entra en combate con ${CARD_LIBRARY[defender.cardId]?.name || 'invocación enemiga'}.`);
  await sleep(820);
  await resolveCombatPair(source.playerId, attacker.id, target.playerId, defender.id, state.activePlayer);
}


function getUnitDomNode(playerId, unitId) {
  return document.querySelector(`.unit.invocation[data-player-id="${playerId}"][data-unit-id="${unitId}"]`);
}

function getTargetBoardPosition(target) {
  if (!target) return null;
  if (target.row != null && target.col != null) return { row: target.row, col: target.col };
  if (target.type === 'caster') {
    const caster = state.players[target.playerId]?.caster;
    return caster ? { row: caster.row, col: caster.col } : null;
  }
  if (target.type === 'guardian') {
    const guardian = state.players[target.playerId]?.guardians.find(g => g.id === target.guardianId);
    return guardian ? { row: guardian.row, col: guardian.col } : null;
  }
  if (target.type === 'invocation') {
    const unit = getUnitById(target.playerId, target.unitId);
    return unit ? { row: unit.row, col: unit.col } : null;
  }
  return null;
}

function setAttackVector(node, fromUnit, targetPosition, distancePx = 24) {
  if (!node || !fromUnit || !targetPosition) return;
  const dx = Math.sign((targetPosition.col ?? 0) - (fromUnit.col ?? 0));
  const dy = Math.sign((targetPosition.row ?? 0) - (fromUnit.row ?? 0));
  node.style.setProperty('--attack-x', `${dx * distancePx}px`);
  node.style.setProperty('--attack-y', `${dy * Math.round(distancePx * 0.62)}px`);
}

function triggerUnitAttackLunge(playerId, unit, targetLike) {
  const node = getUnitDomNode(playerId, unit?.id);
  const targetPosition = getTargetBoardPosition(targetLike);
  if (!node || !unit || !targetPosition) return;

  node.classList.remove('attack-lunge');
  void node.offsetWidth;
  setAttackVector(node, unit, targetPosition, 28);
  node.classList.add('attack-lunge');

  window.setTimeout(() => {
    node.classList.remove('attack-lunge');
  }, 1120);
}


function cardHasAttackFactor(card, factorId) {
  return getCardAttackFactors(card).some(factor => factor.id === factorId);
}

function unitHasCardAttackFactor(unit, factorId) {
  return cardHasAttackFactor(CARD_LIBRARY[unit?.cardId], factorId);
}

async function performInvocationCombatStrike(attackerPlayerId, attackerUnit, defenderPlayerId, defenderUnit, reason = 'combate sostenido') {
  const card = CARD_LIBRARY[attackerUnit.cardId];
  const dmg = getAttackProfile(card).damage;
  const targetLike = { type: 'invocation', playerId: defenderPlayerId, unitId: defenderUnit.id, row: defenderUnit.row, col: defenderUnit.col };
  const sourceLike = { playerId: attackerPlayerId, unit: attackerUnit, card };
  triggerUnitAttackLunge(attackerPlayerId, attackerUnit, targetLike);
  await sleep(300);
  await showWeaponAttackFx(sourceLike, targetLike, getWeaponTypeForAttackUnit(attackerUnit));
  await sleep(240);
  const outcome = resolveAttackRoll(sourceLike, targetLike, dmg);
  if (outcome.criticalMiss) await sleep(680);
  if (outcome.hit) damageInvocationUnit(defenderPlayerId, defenderUnit, outcome.amount, outcome.critical ? 'golpe crítico' : reason, sourceLike);
  await sleep(820);
}

async function resolveCombatPair(playerA, unitAId, playerB, unitBId, firstPlayerId = state.activePlayer) {
  let firstId = firstPlayerId;
  let secondId = firstId === playerA ? playerB : playerA;
  let firstUnitId = firstId === playerA ? unitAId : unitBId;
  let secondUnitId = firstId === playerA ? unitBId : unitAId;

  const first = getUnitById(firstId, firstUnitId);
  const second = getUnitById(secondId, secondUnitId);
  if (!first || !second || first.status === 'restoring' || second.status === 'restoring') return;
  if (!areUnitsMutuallyEngaged(firstId, first, secondId, second)) return;

  if (canUnitDamageUnit(firstId, first, secondId, second)) {
    await performInvocationCombatStrike(firstId, first, secondId, second, 'combate sostenido');
  }

  const stillFirst = getUnitById(firstId, firstUnitId);
  const stillSecond = getUnitById(secondId, secondUnitId);
  if (stillFirst && stillSecond && areUnitsMutuallyEngaged(firstId, stillFirst, secondId, stillSecond) && canUnitDamageUnit(secondId, stillSecond, firstId, stillFirst)) {
    await performInvocationCombatStrike(secondId, stillSecond, firstId, stillFirst, 'respuesta de combate sostenido');
  }

  const afterFirst = getUnitById(firstId, firstUnitId);
  const afterSecond = getUnitById(secondId, secondUnitId);
  if (!afterFirst || !afterSecond || !areUnitsMutuallyEngaged(firstId, afterFirst, secondId, afterSecond)) return;

  let extraPlayerId = null;
  let extraUnit = null;
  let extraTargetPlayerId = null;
  let extraTargetUnit = null;

  if (unitHasCardAttackFactor(afterFirst, 'extraAttack')) {
    extraPlayerId = firstId;
    extraUnit = afterFirst;
    extraTargetPlayerId = secondId;
    extraTargetUnit = afterSecond;
  } else if (unitHasCardAttackFactor(afterSecond, 'extraAttack')) {
    extraPlayerId = secondId;
    extraUnit = afterSecond;
    extraTargetPlayerId = firstId;
    extraTargetUnit = afterFirst;
  }

  if (extraUnit && extraTargetUnit && canUnitDamageUnit(extraPlayerId, extraUnit, extraTargetPlayerId, extraTargetUnit)) {
    const factor = getFactorProfile('extraAttack');
    showFloatingTextAt(extraUnit.row, extraUnit.col, factor?.label || 'ATAQUE EXTRA');
    log(`${CARD_LIBRARY[extraUnit.cardId]?.name || 'Invocación'} activa Ataque extra.`);
    await sleep(420);
    await performInvocationCombatStrike(extraPlayerId, extraUnit, extraTargetPlayerId, extraTargetUnit, 'ataque extra');
  }
}

function canCasterReact(playerId) {
  return (state.players[playerId].castQueue?.length ?? 0) === 0;
}

function showCasterDefenseMenu(defenderId, source, amount) {
  clearCombatMenus();
  return new Promise(resolve => {
    const menu = createCasterDefenseMenuElement(defenderId, source, amount);
    const finish = (choice) => {
      state.pendingCasterDefense = null;
      menu.remove();
      resolve(choice);
    };
    state.pendingCasterDefense = { defenderId, attackerPlayerId: source.playerId, attackerUnitId: source.unit.id, amount, resolve: finish };
    menu.querySelector('[data-action="defend"]').addEventListener('click', event => { event.stopPropagation(); finish('defend'); });
    menu.querySelector('[data-action="counter"]').addEventListener('click', event => { event.stopPropagation(); finish('counter'); });
    els.boardContent.appendChild(menu);
    log('Tu Kaster está siendo atacado: elige Defender o Contraatacar.');
  });
}

async function handleIncomingCasterAttack(source, target, amount) {
  const defenderId = target.playerId;
  const caster = state.players[defenderId].caster;
  if (!canCasterReact(defenderId)) {
    applyDamageToCaster(defenderId, amount, 'Kaster kasteando: no puede defender ni contraatacar');
    return;
  }
  const choice = await showCasterDefenseMenu(defenderId, source, amount);
  if (choice === 'defend') {
    const reduced = Math.max(0, amount - (caster.def ?? 0));
    if (reduced > 0) applyDamageToCaster(defenderId, reduced, 'Kaster se defiende');
    else {
      showFloatingDamageAt(caster.row, caster.col, 'BLOQ');
      log(`Kaster J${defenderId} bloquea el daño con DEF ${caster.def ?? 0}.`);
    }
    return;
  }
  if (choice === 'counter') {
    applyDamageToCaster(defenderId, amount, 'Kaster contraataca y recibe el golpe');
    const attacker = getUnitById(source.playerId, source.unit.id);
    if (attacker) damageInvocationUnit(source.playerId, attacker, caster.atk ?? 0, 'contraataque del Kaster');
    return;
  }
  applyDamageToCaster(defenderId, amount, 'Kaster no reaccionó');
}

function resolveLethalityAfterDamage(source, targetPlayerId, targetUnit, damageDealt) {
  if (!source || !targetUnit || targetUnit.status === 'restoring') return false;
  if (Number(damageDealt || 0) < 1) return false;
  if ((targetUnit.hp ?? 0) <= 0) return false;

  const sourceCard = source.card || CARD_LIBRARY[source.unit?.cardId];
  const lethalityEntry = getCardAttackFactor(sourceCard, 'lethality');
  if (!lethalityEntry) return false;

  const config = getLethalityConfig(lethalityEntry.level || 1);
  config.pda = getEffectiveFactorPda('lethality', config.level, source, lethalityEntry);
  const currentHp = Number(targetUnit.hp ?? 0);
  if (!config.threshold || currentHp > config.threshold) return false;

  const sourceName = sourceCard?.name || 'Invocación';
  const targetName = CARD_LIBRARY[targetUnit.cardId]?.name || 'Invocación';
  const execute = () => {
    targetUnit.hp = 0;
    markInvocationDamageFlash(targetPlayerId, targetUnit.id);
    showFloatingTextAt(targetUnit.row, targetUnit.col, `LETALIDAD ${config.level}`, 'floating-combat critical');
    renderUnits();
    renderCombatHud();
    log(`${sourceName} activa Letalidad ${config.level} y ejecuta a ${targetName} J${targetPlayerId}.`);
    restoreCombatSurvivorIfNeeded(targetPlayerId, targetUnit, `Letalidad ${config.level}`);
    returnInvocationToSpellbook(targetPlayerId, targetUnit, `Letalidad ${config.level}`);
    return true;
  };

  if (config.directThreshold && currentHp <= config.directThreshold) {
    return execute();
  }

  if (rollPda(config.pda)) {
    return execute();
  }

  showFactorMissAtTarget(
    { type: 'invocation', playerId: targetPlayerId, unitId: targetUnit.id, row: targetUnit.row, col: targetUnit.col },
    'lethality',
    'LETALIDAD FALLÓ'
  );
  log(`${sourceName} falla Letalidad ${config.level} contra ${targetName} J${targetPlayerId} (${config.pda} PDA).`);
  return false;
}

function damageInvocationUnit(playerId, unit, amount, reason = 'daño', source = null) {
  if (!unit || unit.status === 'restoring') return;
  const card = CARD_LIBRARY[unit.cardId];
  const previousHp = Number(unit.hp ?? card?.stats?.life ?? 1);
  const damageAmount = Math.max(0, Number(amount) || 0);
  unit.hp = Math.max(0, previousHp - damageAmount);
  const damageDealt = Math.max(0, previousHp - unit.hp);
  markInvocationDamageFlash(playerId, unit.id);
  showFloatingDamageAt(unit.row, unit.col, damageAmount);
  renderUnits();
  renderCombatHud();
  log(`${card?.name || 'Invocación'} J${playerId} recibe ${damageAmount} daño por ${reason}. VIDA ${unit.hp}.`);
  if (unit.hp <= 0) {
    restoreCombatSurvivorIfNeeded(playerId, unit, reason);
    returnInvocationToSpellbook(playerId, unit, reason);
    return;
  }
  resolveLethalityAfterDamage(source, playerId, unit, damageDealt);
}

function applyDamageToTarget(source, target, amount) {
  if (target.type === 'caster') {
    applyDamageToCaster(target.playerId, amount, `${CARD_LIBRARY[source.unit.cardId]?.name || 'Invocación'} ataca`);
    return;
  }
  if (target.type === 'guardian') {
    const guardian = state.players[target.playerId].guardians.find(g => g.id === target.guardianId);
    if (!guardian || guardian.active === false) return;
    guardian.resistance = Math.max(0, (guardian.resistance ?? 5) - amount);
    showFloatingDamageAt(guardian.row, guardian.col, amount);
    renderUnits();
    log(`Guardián J${target.playerId} recibe ${amount} daño. RES ${guardian.resistance}.`);
    if (guardian.resistance <= 0) {
      triggerStructureDestroySequence({ ...target, row: guardian.row, col: guardian.col }, guardian);
      log(`Guardián J${target.playerId} entra en destrucción.`);
    }
    return;
  }
  if (target.type === 'invocation') {
    const unit = getUnitById(target.playerId, target.unitId);
    if (!unit || unit.status === 'restoring') return;
    damageInvocationUnit(target.playerId, unit, amount, 'ataque', source);
  }
}


async function resolveStructureAnchorsForPlayer(playerId) {
  if (currentPhase().id !== 'resolution' || state.activePlayer !== playerId) return;
  const player = state.players[playerId];
  for (const unit of [...player.units]) {
    if (!unit || unit.status === 'restoring' || isUnitEngaged(unit) || !hasStructureAttackAnchor(unit)) continue;
    const target = unit.structureAttackTarget;
    if (!target || target.type !== 'guardian') { clearStructureAttackAnchor(unit); continue; }

    const guardian = state.players[target.playerId]?.guardians.find(g => g.id === target.guardianId);
    if (!guardian || guardian.active === false || guardian.resistance <= 0) {
      clearStructureAttackAnchor(unit);
      continue;
    }

    const card = CARD_LIBRARY[unit.cardId];
    const dmg = getAttackProfile(card).damage;
    showFloatingTextAt(unit.row, unit.col, 'ATACANDO');
    triggerUnitAttackLunge(playerId, unit, { ...target, row: guardian.row, col: guardian.col });
    await sleep(720);
    const outcome = resolveAttackRoll({ playerId, unit, card }, { ...target, row: guardian.row, col: guardian.col }, dmg);
    if (outcome.criticalMiss) await sleep(680);
    if (outcome.hit) applyDamageToTarget({ playerId, unit, card }, { ...target, row: guardian.row, col: guardian.col }, outcome.amount);
    unit.movesLeft = 0;
    await sleep(680);
  }
  renderAll();
}

function scheduleSustainedStructureAttacks(playerId) {
  clearTimeout(scheduleSustainedStructureAttacks.timer);
  scheduleSustainedStructureAttacks.timer = setTimeout(() => resolveStructureAnchorsForPlayer(playerId), 980);
}


function getCellViewportCenter(row, col) {
  const boardRect = els.boardContent.getBoundingClientRect();
  const pos = cellCenter(row, col);
  return {
    x: boardRect.left + (pos.x / 100) * boardRect.width,
    y: boardRect.top + (pos.y / 100) * boardRect.height,
  };
}

function getSpellbookSlotCenter(tab, slot) {
  const fallback = els.cardGrid?.getBoundingClientRect?.() || { left: 80, top: 80, width: 120, height: 120 };
  if (tab === state.activeTab) {
    const slotEl = els.cardGrid?.querySelectorAll('.card-slot')?.[slot];
    if (slotEl) {
      const r = slotEl.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
  }
  return { x: fallback.left + fallback.width / 2, y: fallback.top + fallback.height / 2 };
}

function getInvocationReturnDestination(playerId, tab, slot) {
  if (playerId === LOCAL_PLAYER_ID) return getSpellbookSlotCenter(tab, slot);
  const boardRect = els.boardContent?.getBoundingClientRect?.() || els.board?.getBoundingClientRect?.() || { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
  const enemyGridRect = els.enemyGrid?.getBoundingClientRect?.();
  const x = enemyGridRect ? enemyGridRect.left + enemyGridRect.width * 0.08 : boardRect.left + boardRect.width * 0.12;
  const y = enemyGridRect ? enemyGridRect.top + enemyGridRect.height * 0.10 : boardRect.top + boardRect.height * 0.08;
  return { x, y };
}


function showInvocationDestroyFxAtViewport(x, y, color = '#9b4dff') {
  if (!els.boardContent) return;
  const boardRect = els.boardContent.getBoundingClientRect();
  const fx = document.createElement('div');
  fx.className = 'structure-destroy-fx invocation-destroy-fx';
  fx.style.left = `${((x - boardRect.left) / boardRect.width) * 100}%`;
  fx.style.top = `${((y - boardRect.top) / boardRect.height) * 100}%`;
  fx.style.setProperty('--destroy-color', color);
  fx.innerHTML = '<span></span><span></span><span></span><span></span><span></span><span></span><i></i><i></i><i></i>';
  els.boardContent.appendChild(fx);
  window.setTimeout(() => fx.remove(), 1250);
}

function animateReturnInvocationToSpellbook(playerId, unit, tab, slot, onRevealCard = null) {
  const card = CARD_LIBRARY[unit.cardId];
  if (!card) return;
  const from = getCellViewportCenter(unit.row, unit.col);
  const color = getUnitElementColor(playerId, unit);
  const isLocalReturn = playerId === LOCAL_PLAYER_ID;
  const elementId = unit.elementId || getCardElementId(card);
  const to = isLocalReturn
    ? getSpellbookSlotCenter(tab, slot)
    : getResourceTargetPoint(playerId, elementId, 0);

  const ghost = document.createElement('div');
  ghost.className = 'invocation-death-static-token';
  ghost.style.left = `${from.x}px`;
  ghost.style.top = `${from.y}px`;
  ghost.style.setProperty('--death-color', color);
  ghost.innerHTML = `<img src="${card.tokenImage}" alt="${card.name}"><span class="invocation-death-inner-light"></span>`;
  document.body.appendChild(ghost);

  (async () => {
    await sleep(160);
    showInvocationDestroyFxAtViewport(from.x, from.y, color);
    await sleep(210);
    safeRemove(ghost);

    const flyer = document.createElement('div');
    flyer.className = `return-to-spellbook-token invocation-death-return-token elemental-orb-flow ${isLocalReturn ? 'local-return' : 'rival-return'}`;
    flyer.style.left = `${from.x}px`;
    flyer.style.top = `${from.y}px`;
    flyer.style.width = '58px';
    flyer.style.height = '74px';
    flyer.style.setProperty('--return-color', color);
    flyer.innerHTML = `<img src="${card.tokenImage}" alt="${card.name}">`;
    getGlobalFxLayer().appendChild(flyer);

    await animateCss(flyer, [
      { left: `${from.x}px`, top: `${from.y}px`, transform: 'translate(-50%, -50%) scale(.50)', opacity: 0 },
      { left: `${from.x}px`, top: `${from.y - 18}px`, transform: 'translate(-50%, -50%) scale(1.12)', opacity: 1, offset: .18 },
      { left: `${(from.x + to.x) / 2}px`, top: `${Math.min(from.y, to.y) - 34}px`, transform: 'translate(-50%, -50%) scale(1.02)', opacity: 1, offset: .58 },
      { left: `${to.x}px`, top: `${to.y}px`, transform: `translate(-50%, -50%) scale(${isLocalReturn ? '.82' : '.62'})`, opacity: 1 },
    ], 1040, 'cubic-bezier(.18,.72,.19,1)');

    createElementBurstAtViewport(to.x, to.y, color, { kind: isLocalReturn ? 'spellbook-return-land' : 'rival-return-vanish', count: isLocalReturn ? 14 : 11, duration: 620 });
    await animateCss(flyer, [
      { transform: `translate(-50%, -50%) scale(${isLocalReturn ? '.82' : '.62'})`, opacity: 1, filter: `drop-shadow(0 0 18px ${color})` },
      { transform: 'translate(-50%, -50%) scale(.34)', opacity: 0, filter: `drop-shadow(0 0 30px ${color})` },
    ], 180, 'ease-out');
    safeRemove(flyer);

    if (isLocalReturn && typeof onRevealCard === 'function') {
      await sleep(70);
      onRevealCard();
      if (tab === state.activeTab) {
        const slotEl = els.cardGrid?.querySelectorAll('.card-slot')?.[slot];
        slotEl?.classList?.add('return-reveal-pulse');
        window.setTimeout(() => slotEl?.classList?.remove('return-reveal-pulse'), 420);
      }
    }
  })();
}

function animateRestoreInvocationToSpawn(playerId, unit, marker, onArrive = null) {
  const card = CARD_LIBRARY[unit.cardId];
  if (!card || !marker) {
    if (typeof onArrive === 'function') onArrive();
    return;
  }
  const from = getCellViewportCenter(unit.row, unit.col);
  const to = getCellViewportCenter(marker.row, marker.col);
  const color = getUnitElementColor(playerId, unit);
  createElementBurstAtViewport(from.x, from.y, color, { kind: 'restore-start', count: 11, duration: 1050 });
  const flyer = document.createElement('div');
  flyer.className = 'restore-travel-token traveling';
  flyer.style.left = `${from.x}px`;
  flyer.style.top = `${from.y}px`;
  flyer.style.width = '54px';
  flyer.style.height = '70px';
  flyer.style.setProperty('--restore-x', `${to.x - from.x}px`);
  flyer.style.setProperty('--restore-y', `${to.y - from.y}px`);
  flyer.style.setProperty('--restore-fly-color', color);
  flyer.innerHTML = `<img src="${card.tokenImage}" alt="${card.name}">`;
  document.body.appendChild(flyer);
  window.setTimeout(() => {
    createElementBurstAtViewport(to.x, to.y, color, { kind: 'restore-end', count: 10, duration: 900 });
    if (typeof onArrive === 'function') onArrive();
  }, 980);
  window.setTimeout(() => flyer.remove(), 1380);
}

function returnInvocationToSpellbook(playerId, unit, reason = 'derrota') {
  clearStructureAttackAnchor(unit);
  clearUnitEngagement(playerId, unit.id);
  const player = state.players[playerId];
  const card = CARD_LIBRARY[unit.cardId];
  const marker = player.spawnMarkers.find(m => m.id === unit.spawnId);
  const tab = marker?.originTab ?? unit.originTab ?? 0;
  const slot = marker?.originSlot ?? unit.originSlot ?? player.handTabs[tab]?.findIndex(v => !v) ?? 0;
  const revealReturnedCard = () => {
    if (!player.handTabs[tab]) player.handTabs[tab] = [];
    if (player.handTabs[tab][slot]) {
      const freeSlot = player.handTabs[tab].findIndex(v => !v);
      player.handTabs[tab][freeSlot >= 0 ? freeSlot : slot] = unit.cardId;
    } else {
      player.handTabs[tab][slot] = unit.cardId;
    }
    if (playerId === LOCAL_PLAYER_ID) renderCards();
  };
  animateReturnInvocationToSpellbook(playerId, unit, tab, slot, revealReturnedCard);
  player.units = player.units.filter(u => u.id !== unit.id);
  player.spawnMarkers = player.spawnMarkers.filter(m => m.id !== unit.spawnId);
  showFloatingDamageAt(unit.row, unit.col, 'KO');
  log(`${card?.name || 'Invocación'} vuelve al Spellbook por ${reason}.`);
}

function getTargetsInRangeForUnit(playerId, unit) {
  const card = CARD_LIBRARY[unit.cardId];
  const source = { playerId, unit, card };
  const enemyId = getEnemyPlayerId(playerId);
  const enemy = state.players[enemyId];
  const targets = [];
  targets.push(buildTarget('caster', enemyId));
  enemy.guardians.filter(g => g.active !== false).forEach(g => targets.push(buildTarget('guardian', enemyId, { guardianId: g.id })));
  enemy.units.filter(u => u.status !== 'restoring').forEach(u => targets.push(buildTarget('invocation', enemyId, { unitId: u.id })));
  return targets.filter(t => canSelectTarget(source, t));
}

async function aiTryAttackWithUnit(playerId, unit) {
  if (!unit || unit.status === 'restoring') return false;
  const card = CARD_LIBRARY[unit.cardId];
  const source = { playerId, unit, card };
  const targets = getTargetsInRangeForUnit(playerId, unit);
  if (!targets.length) return false;
  const priority = { caster: 0, invocation: 1, guardian: 2 };
  const target = targets.sort((a, b) => (priority[a.type] ?? 9) - (priority[b.type] ?? 9))[0];
  const profile = getAttackProfile(card);

  state.selectedMover = { type: 'invocation', playerId, unitId: unit.id };
  renderAll();
  log(`IA J${playerId}: ${card?.name || 'Invocación'} selecciona objetivo ${target.type}.`);
  await sleep(680);

  await executeAttackDamage(source, target, profile.damage);
  unit.movesLeft = 0;
  if (target.type === 'caster' && getUnitById(playerId, unit.id)) restoreInvocation(playerId, unit, 'ataque al Kaster');
  log(`IA J${playerId}: ${card?.name || 'Invocación'} daña objetivo ${target.type}.`);
  renderAll();
  await sleep(920);
  return true;
}



function unitHasMandatoryMovement(playerId, unit) {
  if (currentPhase().id !== 'resolution') return false;
  if (!unit || unit.status === 'restoring' || isUnitEngaged(unit) || hasStructureAttackAnchor(unit) || (unit.movesLeft ?? 0) <= 0) return false;
  return getInvocationMoveOptions(playerId, unit).length > 0;
}

function pingMandatoryMovementBlocker(blocker) {
  if (!blocker || blocker.type !== 'invocation') return;
  showFloatingTextAt(blocker.row, blocker.col, 'DEBES MOVER ESTA UNIDAD', 'floating-warning');
  const selector = `.unit.invocation[data-player-id="${blocker.playerId}"][data-unit-id="${blocker.unitId}"]`;
  const el = document.querySelector(selector);
  if (!el) return;
  el.classList.remove('must-move-shake');
  void el.offsetWidth;
  el.classList.add('must-move-shake');
  window.setTimeout(() => el.classList.remove('must-move-shake'), 760);
}

function getMandatoryMovementBlocker(playerId) {
  if (currentPhase().id !== 'resolution') return null;
  const player = state.players[playerId];
  if (!player) return null;

  // Regla v4.7: el movimiento obligatorio solo aplica a invocaciones.
  // El Kaster puede moverse, pero no bloquea el cierre de Resolución.
  for (const unit of player.units) {
    if (!unit || unit.status === 'restoring' || isUnitEngaged(unit) || (unit.movesLeft ?? 0) <= 0) continue;
    if (getInvocationMoveOptions(playerId, unit).length) {
      return { type: 'invocation', label: CARD_LIBRARY[unit.cardId]?.name || 'Invocación', playerId, unitId: unit.id, row: unit.row, col: unit.col };
    }
  }
  return null;
}

function nextPhase(force = false) {
  if (state.paused) { log('Juego pausado. Presiona ESPACIO para continuar.'); return; }
  if (typeof force !== 'boolean') force = false;
  if (state.extractionAnimating || state.aiThinking) return;
  if (!force && currentPhase().id === 'extraction') {
    log('Espera a que termine la extracción antes de avanzar de fase.');
    return;
  }
  if (!force && state.aiEnabled && state.activePlayer !== LOCAL_PLAYER_ID) {
    log('El rival está controlando su turno.');
    return;
  }

  const blocker = !force ? getMandatoryMovementBlocker(state.activePlayer) : null;
  if (blocker) {
    pingMandatoryMovementBlocker(blocker);
    log(`${blocker.label} todavía puede moverse. El movimiento es obligatorio antes de terminar Resolución.`);
    return;
  }

  const oldPhase = currentPhase().id;
  const oldPlayer = state.activePlayer;

  if (oldPhase === 'casting') {
    clearPendingCast();
    closeCardInfo();
    state.phaseUndo = { playerId: state.activePlayer, previousPhaseIndex: state.phaseIndex };
    state.resolutionActionTaken = false;
  } else {
    state.phaseUndo = null;
    state.resolutionActionTaken = false;
  }
  state.pendingPowerAction = null;

  advanceSmokeZonesOnePhaseStep();
  state.phaseIndex++;
  let changedPlayer = false;
  if (state.phaseIndex >= PHASES.length) {
    state.phaseIndex = 0;
    state.activePlayer = state.activePlayer === 1 ? 2 : 1;
    changedPlayer = true;
    state.phaseUndo = null;
    resetBoardViewToPanoramic();
  }

  enterPhase(false, true);
  renderAll();

  if (changedPlayer) {
    const items = [
      { text: 'TERMINA EL TURNO', playerId: oldPlayer, duration: 950 },
      { text: `JUGADOR ${state.activePlayer}`, playerId: state.activePlayer, duration: 900 },
      { text: 'EXTRACCIÓN', playerId: state.activePlayer, duration: 900 },
    ];
    queueTransitions(items);
    schedulePhaseStartActions(sumTransitionDurations(items) - 120);
  } else {
    const phase = currentPhase();
    const items = [{ text: phase.label.toUpperCase(), playerId: state.activePlayer, duration: 860 }];
    queueTransitions(items);
    schedulePhaseStartActions(sumTransitionDurations(items) - 120);
  }
}

function enterPhase(initial, suppressTransition = false) {
  const phase = currentPhase();
  state.extractedThisPhase = false;
  clearPendingCast();
  state.selectedMover = null;
  tickCastQueues();
  tickRestorationCounters();
  applyCasterEnemySideDamage();

  if (phase.id === 'resolution') {
    prepareResolutionMoves(state.activePlayer);
    scheduleSustainedCombatResolution(state.activePlayer);
    scheduleSustainedStructureAttacks(state.activePlayer);
  }

  const label = phase.label.toUpperCase();
  log(`Jugador ${state.activePlayer}: ${label}`);
  if (!initial && !suppressTransition) showTransition(label, 860, state.activePlayer);
}


function scheduleSustainedCombatResolution(playerId) {
  clearTimeout(scheduleSustainedCombatResolution.timer);
  scheduleSustainedCombatResolution.timer = setTimeout(() => resolveSustainedCombatsForPlayer(playerId), 620);
}

async function resolveSustainedCombatsForPlayer(playerId) {
  if (currentPhase().id !== 'resolution' || state.activePlayer !== playerId) return;
  const player = state.players[playerId];
  const handled = new Set();
  for (const unit of [...player.units]) {
    if (!unit?.engagedWith || unit.status === 'restoring') continue;
    const other = getUnitById(unit.engagedWith.playerId, unit.engagedWith.unitId);
    if (!other || other.status === 'restoring') { unit.engagedWith = null; continue; }
    const key = [unitKey(playerId, unit.id), unitKey(unit.engagedWith.playerId, other.id)].sort().join('|');
    if (handled.has(key)) continue;
    handled.add(key);
    cancelResolutionPhaseUndo();
    renderUnits();
    renderCombatHud();
    showFloatingTextAt(unit.row, unit.col, 'COMBATIENDO');
    showFloatingTextAt(other.row, other.col, 'COMBATIENDO');
    await sleep(760);
    await resolveCombatPair(playerId, unit.id, unit.engagedWith.playerId, other.id, playerId);
  }
  renderAll();
}

function tickRestorationCounters() {
  for (const playerId of [1, 2]) {
    const player = state.players[playerId];
    player.units.forEach(unit => {
      if (unit.status !== 'restoring') return;
      unit.restoreRemaining = Math.max(0, (unit.restoreRemaining ?? 0) - 1);
      if (unit.restoreRemaining <= 0) {
        unit.status = 'active';
        unit.movesLeft = 0;
        log(`${CARD_LIBRARY[unit.cardId]?.name || 'Invocación'} terminó su restauración.`);
      }
    });
  }
}

function applyCasterEnemySideDamage() {
  for (const playerId of [1, 2]) {
    if (!isCasterInEnemySide(playerId)) continue;
    applyDamageToCaster(playerId, 1, 'Kaster en zona enemiga');
  }
}

function tickCastQueues() {
  for (const playerId of [1, 2]) {
    const player = state.players[playerId];
    const queue = player.castQueue || [];
    if (!queue.length) continue;

    // El Kaster solo puede mantener un kasteo activo a la vez.
    // Las cartas posteriores quedan en cola y no reducen su contador
    // hasta que la primera entra a la arena.
    const activeItem = queue[0];
    activeItem.remaining -= 1;

    if (activeItem.remaining <= 0) {
      player.castQueue = queue.slice(1);
      launchCastTravel(playerId, activeItem);
    } else {
      player.castQueue = queue;
    }
  }
}

function resolveCast(playerId, item) {
  const card = CARD_LIBRARY[item.cardId];
  if (!card) return;
  if (card.type === 'spell') {
    if (card.id === 'spellKageNoMichi') {
      createKageNoMichiZone(playerId, card);
      return;
    }
    log(`${card.name} se resuelve como hechizo base. Efecto funcional pendiente de implementar.`);
    return;
  }
  if (card.type === 'invocation') {
    if ((state.players[playerId].units || []).filter(unit => unit.status !== 'restoring').length >= MAX_INVOCATIONS_PER_PLAYER) {
      log(`No entra ${card.name}: J${playerId} ya tiene el límite básico de ${MAX_INVOCATIONS_PER_PLAYER} invocaciones.`);
      return;
    }
    displaceHiddenOpponentIfNeeded(item.row, item.col, playerId);
    state.players[playerId].units.push({
      id: `unit_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      cardId: card.id,
      elementId: item.elementId || getEffectiveCardElementId(card, playerId),
      row: item.row,
      col: item.col,
      restoreRow: item.row,
      restoreCol: item.col,
      owner: playerId,
      hp: card.stats.life ?? 3,
      baseHp: card.stats.life ?? 3,
      maxHp: card.stats.life ?? 3,
      maxHpBonus: 0,
      atk: card.stats.atk,
      def: card.stats.def,
      damage: card.attackProfile?.damage ?? card.stats.damage ?? 0,
      mov: card.stats.mov ?? TEST_INVOCATION_MOVE_SPEED,
      restoreTime: card.stats.restore ?? TEST_RESTORE_PHASES,
      restoreRemaining: 0,
      status: 'active',
      spawnId: item.spawnId,
      originTab: item.originTab ?? 0,
      originSlot: item.originSlot ?? 0,
      movesLeft: currentPhase().id === 'resolution' && state.activePlayer === playerId ? (card.stats.mov ?? TEST_INVOCATION_MOVE_SPEED) : 0,
      smokeBombsLeft: card.id === 'ninjaNaitoSutoka' ? Number(card.power?.startingBombs ?? 3) : 0,
      activeFactors: [],
      hiddenSuppressedZoneIds: [],
    });
    log(`${card.name} entra a la arena en ${coordLabel(item.row, item.col)}.`);
  }
}

function showImmediateCastLandingFx(playerId, item) {
  if (!item || !els.boardContent) return;
  const card = CARD_LIBRARY[item.cardId];
  const elementId = item.elementId || getEffectiveCardElementId(card, playerId);
  const color = getElementColorById(elementId, getPlayerElementColor(playerId));
  const pos = cellCenter(item.row, item.col);
  const boardRect = els.boardContent.getBoundingClientRect();
  const x = boardRect.left + (pos.x / 100) * boardRect.width;
  const y = boardRect.top + (pos.y / 100) * boardRect.height;
  createElementBurstAtViewport(x, y, color, { kind: 'cast-landing immediate-cast-landing', count: 16, duration: 980 });
  showFloatingTextAt(item.row, item.col, card?.shortName || card?.name || 'INVOCA', 'floating-combat buff');
}

function animateImmediateInvocationFromSpellbook(playerId, item, fromPoint = null) {
  const card = CARD_LIBRARY[item.cardId];
  if (!card || !els.boardContent) {
    resolveCast(playerId, item);
    renderAll();
    showImmediateCastLandingFx(playerId, item);
    return;
  }
  const elementId = item.elementId || getEffectiveCardElementId(card, playerId);
  const elementColor = getElementColorById(elementId, getPlayerElementColor(playerId));
  const boardRect = els.boardContent.getBoundingClientRect();
  const pos = cellCenter(item.row, item.col);
  const destX = boardRect.left + (pos.x / 100) * boardRect.width;
  const destY = boardRect.top + (pos.y / 100) * boardRect.height;
  const start = fromPoint || getSpellbookSlotCenter(item.originTab ?? 0, item.originSlot ?? 0);

  const flyer = document.createElement('div');
  flyer.className = 'cast-travel-token immediate-spellbook-cast';
  flyer.style.setProperty('--cast-fly-color', elementColor);
  flyer.style.left = `${start.x}px`;
  flyer.style.top = `${start.y}px`;
  flyer.style.width = '100px';
  flyer.style.height = '138px';
  flyer.style.opacity = '0.98';
  flyer.style.transition = 'left .65s cubic-bezier(.2,.9,.2,1), top .65s cubic-bezier(.2,.9,.2,1), transform .65s cubic-bezier(.2,.9,.2,1), opacity .65s ease';
  flyer.appendChild(createCastTravelVisual(card, { elementIdOverride: elementId }));
  document.body.appendChild(flyer);

  requestAnimationFrame(() => {
    flyer.style.left = `${destX}px`;
    flyer.style.top = `${destY}px`;
    flyer.style.transform = 'translate(-50%, -50%) scale(.92)';
  });

  window.setTimeout(() => {
    flyer.remove();
    resolveCast(playerId, item);
    renderAll();
    showImmediateCastLandingFx(playerId, item);
  }, 680);
}

function launchCastTravel(playerId, item) {
  const card = CARD_LIBRARY[item.cardId];
  if (!card) return;
  const elementId = item.elementId || getEffectiveCardElementId(card, playerId);
  const elementColor = getElementColorById(elementId, getPlayerElementColor(playerId));

  const queueEl = document.querySelector(`.cast-item[data-spawn-id="${item.spawnId}"][data-player-id="${playerId}"]`);
  const visualEl = queueEl ? (queueEl.querySelector('.cast-spell-composite-mini, .cast-card-mini, .cast-token-image, img')) : null;
  const boardRect = els.boardContent.getBoundingClientRect();
  const pos = cellCenter(item.row, item.col);
  const destX = boardRect.left + (pos.x / 100) * boardRect.width;
  const destY = boardRect.top + (pos.y / 100) * boardRect.height;

  if (!visualEl) {
    resolveCast(playerId, item);
    renderAll();
    return;
  }

  const fromRect = visualEl.getBoundingClientRect();
  const flyer = document.createElement('div');
  flyer.className = `cast-travel-token ${getCardTypeId(card) === 'spell' ? 'cast-travel-spell-card' : ''}`;
  flyer.style.setProperty('--cast-fly-color', elementColor);
  flyer.appendChild(createCastTravelVisual(card, { elementIdOverride: elementId }));
  document.body.appendChild(flyer);

  const startW = fromRect.width;
  const startH = fromRect.height;
  const finalW = Math.max(34, Math.min(startW * 0.68, boardRect.width * 0.10));
  const finalH = Math.max(40, Math.min(startH * 0.68, boardRect.height * 0.14));

  flyer.style.left = `${fromRect.left + fromRect.width / 2}px`;
  flyer.style.top = `${fromRect.top + fromRect.height / 2}px`;
  flyer.style.width = `${startW}px`;
  flyer.style.height = `${startH}px`;
  flyer.style.setProperty('--travel-x', `${destX - (fromRect.left + fromRect.width / 2)}px`);
  flyer.style.setProperty('--travel-y', `${destY - (fromRect.top + fromRect.height / 2)}px`);
  flyer.style.setProperty('--travel-scale-x', String(finalW / startW));
  flyer.style.setProperty('--travel-scale-y', String(finalH / startH));

  requestAnimationFrame(() => flyer.classList.add('traveling'));

  setTimeout(() => {
    createElementBurstAtViewport(destX, destY, elementColor, { kind: 'cast-landing', count: 14, duration: 980 });
    flyer.remove();
    resolveCast(playerId, item);
    renderAll();
  }, 720);
}

function extractElements(playerId, amount, elementIdOverride = null) {
  const player = state.players[playerId];
  const ownerElement = getPlayerElement(playerId);
  const element = ELEMENTS.find(item => item.id === (elementIdOverride || ownerElement.id)) || ownerElement;
  for (let i = 0; i < amount; i++) {
    player.resources.push({ ...element, icon: getElementCostIcon(element.id), uid: `orb_${Date.now()}_${i}_${Math.random()}`, createdAt: Date.now() + i });
  }
  log(`Jugador ${playerId} extrae ${amount} elemento${amount > 1 ? 's' : ''} de ${element.label.toLowerCase()}.`);
}

function initializeElementDecks() {
  for (const playerId of [1, 2]) reshuffleElementDeck(playerId);
}


function getElementDeckConfig(playerId) {
  const player = state.players[playerId];
  const ownerElementId = getPlayerDomainId(playerId) || player?.elementId || 'oscuridad';
  return ELEMENT_DECK_CONFIGS[ownerElementId] || { primary: ownerElementId, secondary: ownerElementId, primaryRatio: 1 };
}

function getPlayerResourceOrder(playerId) {
  const config = getElementDeckConfig(playerId);
  const order = [];
  [config.primary, config.secondary].forEach(elementId => {
    if (elementId && !order.includes(elementId)) order.push(elementId);
  });
  ELEMENTS.forEach(element => {
    if (!order.includes(element.id)) order.push(element.id);
  });
  return order;
}

function sortResourcesForPlayer(resources, playerId) {
  const order = getPlayerResourceOrder(playerId);
  return [...(resources || [])].sort((a, b) => {
    const ai = order.indexOf(a.id);
    const bi = order.indexOf(b.id);
    const aRank = ai === -1 ? 999 : ai;
    const bRank = bi === -1 ? 999 : bi;
    if (aRank !== bRank) return aRank - bRank;
    const aCreated = Number(a.createdAt || 0);
    const bCreated = Number(b.createdAt || 0);
    if (aCreated !== bCreated) return aCreated - bCreated;
    return String(a.uid || '').localeCompare(String(b.uid || ''));
  });
}

function getResourceDisplayIndexAfterAdding(playerId, elementId) {
  const player = state.players[playerId];
  const element = ELEMENTS.find(item => item.id === elementId) || getPlayerElement(playerId);
  const candidate = { ...element, uid: `preview_${Date.now()}_${Math.random()}`, createdAt: Date.now() + 999999 };
  const ordered = sortResourcesForPlayer([...(player?.resources || []), candidate], playerId);
  return Math.max(0, ordered.findIndex(item => item.uid === candidate.uid));
}

function viewportPointFromBoardLocal(localPoint) {
  const boardRect = els.boardContent.getBoundingClientRect();
  return { x: boardRect.left + localPoint.x, y: boardRect.top + localPoint.y };
}

function getGlobalFxLayer() {
  return els.globalFxLayer || els.extractionFxLayer || document.body;
}

function buildElementDeckList(playerId = LOCAL_PLAYER_ID) {
  const player = state.players[playerId];
  const ownerElementId = player?.elementId || 'oscuridad';
  const config = getElementDeckConfig(playerId);
  const primary = config.primary || ownerElementId;
  const secondary = config.secondary || primary;
  const primaryRatio = Math.max(0, Math.min(1, typeof config.primaryRatio === 'number' ? config.primaryRatio : 1));
  const deck = [];

  EXTRACTION_DEFS.forEach(def => {
    const total = Math.max(0, Number(def.deckCopies) || 0);
    for (let i = 0; i < total; i++) {
      const elementId = secondary === primary ? primary : (Math.random() < primaryRatio ? primary : secondary);
      deck.push({ baseId: def.id, elementId });
    }
  });

  return deck;
}

function shuffleArray(items) {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function reshuffleElementDeck(playerId) {
  const player = state.players[playerId];
  player.elementDeck = shuffleArray(buildElementDeckList(playerId));
  player.elementDiscard = [];
}

function drawElementCard(playerId) {
  const player = state.players[playerId];
  if (!player.elementDeck || player.elementDeck.length === 0) reshuffleElementDeck(playerId);
  const entry = player.elementDeck.shift();
  const normalized = typeof entry === 'string' ? { baseId: entry, elementId: getPlayerElement(playerId).id } : entry;
  player.elementDiscard.push(normalized);
  return buildExtractionCardDef(playerId, normalized.baseId, normalized.elementId);
}

function buildFountainFx() {
  if (!els.boardContent || els.boardContent.querySelector('.fountain-fx')) return;
  [
    { cls: 'fountain-p1', left: 'var(--fountain-p1-left)', top: 'var(--fountain-p1-top)', playerId: 1 },
    { cls: 'fountain-p2', left: 'var(--fountain-p2-left)', top: 'var(--fountain-p2-top)', playerId: 2 },
  ].forEach(item => {
    const div = document.createElement('div');
    div.className = `fountain-fx ${item.cls}`;
    div.dataset.playerId = String(item.playerId);
    div.style.left = item.left;
    div.style.top = item.top;
    div.style.setProperty('--fountain-color', getPlayerElementColor(item.playerId));
    div.innerHTML = `<div class="fountain-gen-glow"></div><div class="fountain-particles">${Array.from({ length: 8 }, (_, i) => `<span class="fountain-particle p${i + 1}"></span>`).join('')}</div>`;
    els.boardContent.appendChild(div);
  });
}

function applyPlayerDomainVisuals() {
  const root = document.documentElement;
  for (const playerId of [1, 2]) {
    const element = getPlayerElement(playerId);
    const color = element?.color || (playerId === 1 ? '#9b4dff' : '#c9a64a');
    const rgb = hexToRgbParts(color);
    root.style.setProperty(`--p${playerId}`, color);
    root.style.setProperty(`--p${playerId}-rgb`, rgb);
    root.style.setProperty(`--p${playerId}-soft`, `rgba(${rgb}, .28)`);
  }

  // Desde la perspectiva actual: grid aliado = J1, grid enemigo = J2.
  // Estos colores pertenecen al ecosistema visual del Kaster, no al costo de las cartas.
  const allyColor = getPlayerElementColor(LOCAL_PLAYER_ID);
  const enemyColor = getPlayerElementColor(getEnemyPlayerId(LOCAL_PLAYER_ID));
  root.style.setProperty('--ally-cell-fill-color-a', hexToRgbParts(allyColor));
  root.style.setProperty('--ally-cell-fill-color-b', hexToRgbParts(allyColor));
  root.style.setProperty('--enemy-cell-fill-color-a', hexToRgbParts(enemyColor));
  root.style.setProperty('--enemy-cell-fill-color-b', hexToRgbParts(enemyColor));
  root.style.setProperty('--ally-cell-line-color', hexToRgbParts(allyColor));
  root.style.setProperty('--enemy-cell-line-color', hexToRgbParts(enemyColor));
  root.style.setProperty('--ally-calibration-color', hexToRgbParts(allyColor));
  root.style.setProperty('--enemy-calibration-color', hexToRgbParts(enemyColor));
}

function applyFountainColors() {
  if (!els.boardContent) return;
  applyPlayerDomainVisuals();
  els.boardContent.querySelectorAll('.fountain-fx').forEach(node => {
    const playerId = Number(node.dataset.playerId || 1);
    node.style.setProperty('--fountain-color', getPlayerElementColor(playerId));
  });
}

function setFountainExtracting(playerId, active) {
  if (!els.boardContent) return;
  const node = els.boardContent.querySelector(`.fountain-fx[data-player-id="${playerId}"]`);
  if (!node) return;
  node.classList.toggle('is-extracting', !!active);
}

function sumTransitionDurations(items) {
  return (items || []).reduce((sum, item) => sum + (item.duration ?? 860), 0);
}

function schedulePhaseStartActions(delay = 0) {
  clearTimeout(schedulePhaseStartActions.timer);
  schedulePhaseStartActions.timer = setTimeout(() => {
    if (state.paused) {
      state.pendingPhaseStartWhilePaused = true;
      return;
    }
    startPhaseActions();
  }, Math.max(0, delay));
}

async function startPhaseActions() {
  if (state.paused) { state.pendingPhaseStartWhilePaused = true; return; }
  await waitUntilUnpaused();
  if (state.extractionAnimating) return;
  const phase = currentPhase();
  if (phase.id === 'extraction' && !state.extractedThisPhase) {
    const playerId = state.activePlayer;
    state.extractedThisPhase = true;
    const shouldAutoAdvance = await animateExtractionPhase(playerId);
    renderAll();
    if (shouldAutoAdvance && state.activePlayer === playerId && currentPhase().id === 'extraction') {
      autoAdvanceExtractionToCasting(playerId);
    }
    return;
  }
  if (phase.id === 'casting') {
    const playerId = state.activePlayer;
    if (!state.pendingCard && !canPlayerCastAnyCard(playerId)) {
      autoAdvanceCastingToResolution(playerId);
      return;
    }
    if (state.aiEnabled && playerId !== LOCAL_PLAYER_ID) {
      await runEnemyCastingPhase(playerId);
      return;
    }
  }
  if (phase.id === 'resolution') {
    prepareResolutionMoves(state.activePlayer);
    renderAll();
    if (state.aiEnabled && state.activePlayer !== LOCAL_PLAYER_ID) {
      await runEnemyResolutionPhase(state.activePlayer);
    }
  }
}


function autoAdvanceExtractionToCasting(playerId) {
  if (currentPhase().id !== 'extraction') return;
  state.phaseIndex = PHASES.findIndex(phase => phase.id === 'casting');
  if (state.phaseIndex < 0) state.phaseIndex = 1;
  enterPhase(false, true);
  renderAll();

  const items = [{ text: 'KASTEO', playerId, duration: 860 }];
  queueTransitions(items);
  schedulePhaseStartActions(sumTransitionDurations(items) - 120);
}


function autoAdvanceCastingToResolution(playerId) {
  if (currentPhase().id !== 'casting') return;
  if (state.activePlayer !== playerId) return;
  clearPendingCast();
  closeCardInfo();
  state.phaseIndex = PHASES.findIndex(phase => phase.id === 'resolution');
  if (state.phaseIndex < 0) state.phaseIndex = 2;
  enterPhase(false, true);
  renderAll();

  const items = [
    { text: 'SIN KASTEOS', playerId, duration: 760 },
    { text: 'RESOLUCIÓN', playerId, duration: 860 },
  ];
  queueTransitions(items);
  log(`Jugador ${playerId}: sin kasteos disponibles. Avanza automáticamente a Resolución.`);
  schedulePhaseStartActions(sumTransitionDurations(items) - 120);
}

async function animateExtractionPhase(playerId) {
  state.extractionAnimating = true;
  renderPhaseUI();
  let shouldAutoAdvance = true;
  try {
    const picks = Array.from({ length: EXTRACTION_CARDS_PER_PHASE }, () => drawElementCard(playerId));
    shouldAutoAdvance = picks.every(card => (card.sourceType || 'element') === 'element');
    await Promise.all(picks.map((card, index) => animateExtractionCard(playerId, card, index * 420)));
    return shouldAutoAdvance;
  } finally {
    state.extractionAnimating = false;
    renderAll();
  }
}

async function animateExtractionCard(playerId, cardDef, startDelay = 0) {
  if (startDelay > 0) await sleep(startDelay);
  const source = getExtractionSourcePoint(playerId);
  const center = getExtractionCenterPoint();
  if (!source || !center || !els.extractionFxLayer) {
    extractElements(playerId, cardDef.count, cardDef.elementId);
    return;
  }

  const elementColor = cardDef.elementColor || getPlayerElementColor(playerId);
  const elementLabel = (cardDef.elementLabel || getPlayerElement(playerId).label).toLowerCase();
  setFountainExtracting(playerId, true);

  try {
    const glow = document.createElement('div');
    glow.className = 'extract-source-glow';
    glow.style.left = `${source.x}px`;
    glow.style.top = `${source.y}px`;
    glow.style.setProperty('--fx-color', elementColor);
    els.extractionFxLayer.appendChild(glow);
    animateCss(glow, [
      { transform: 'translate(-50%, -50%) scale(.45)', opacity: 0 },
      { transform: 'translate(-50%, -50%) scale(1.15)', opacity: 1 },
      { transform: 'translate(-50%, -50%) scale(.9)', opacity: .65 },
    ], 420, 'ease-out').then(() => safeRemove(glow));

    const cardEl = createExtractionCardFx(cardDef);
    cardEl.style.left = `${source.x}px`;
    cardEl.style.top = `${source.y}px`;
    cardEl.style.transform = 'translate(-50%, -50%) scale(.52)';
    cardEl.style.opacity = '0';
    els.extractionFxLayer.appendChild(cardEl);

    await animateCss(cardEl, [
      { transform: 'translate(-50%, -50%) scale(.48)', opacity: 0 },
      { transform: 'translate(-50%, -50%) scale(.54)', opacity: 1 },
    ], 320, 'ease-out');

    await animateCss(cardEl, [
      { left: `${source.x}px`, top: `${source.y}px`, transform: 'translate(-50%, -50%) scale(.54)', opacity: 1 },
      { left: `${center.x}px`, top: `${center.y}px`, transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
    ], 560, 'cubic-bezier(.2,.75,.18,1)');

    const impact = document.createElement('div');
    impact.className = 'extract-impact-fx';
    impact.style.left = `${center.x}px`;
    impact.style.top = `${center.y}px`;
    els.extractionFxLayer.appendChild(impact);
    animateCss(impact, [
      { transform: 'translate(-50%, -50%) scale(.2)', opacity: 0 },
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
      { transform: 'translate(-50%, -50%) scale(1.35)', opacity: 0 },
    ], 420, 'ease-out').then(() => safeRemove(impact));

    await animateCss(cardEl, [
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 1, filter: 'drop-shadow(0 18px 18px rgba(0,0,0,.45))' },
      { transform: 'translate(-50%, -50%) scale(.66)', opacity: 0, filter: `drop-shadow(0 0 25px ${elementColor})` },
    ], 300, 'ease-in');
    safeRemove(cardEl);

    for (let i = 0; i < cardDef.count; i++) {
      if (i > 0) await sleep(EXTRACTION_ORB_SEQUENCE_GAP_MS);
      await animateExtractionOrb(playerId, center, i, cardDef.elementId);
    }
    log(`Jugador ${playerId} extrae ${cardDef.count} elemento${cardDef.count > 1 ? 's' : ''} de ${elementLabel}.`);
  } finally {
    setFountainExtracting(playerId, false);
  }
}

async function animateExtractionOrb(playerId, startPoint, index, elementIdOverride = null) {
  const ownerElement = getPlayerElement(playerId);
  const element = ELEMENTS.find(item => item.id === (elementIdOverride || ownerElement.id)) || ownerElement;
  const token = document.createElement('div');
  token.className = 'extract-resource-fx';
  const startViewport = viewportPointFromBoardLocal(startPoint);
  token.style.left = `${startViewport.x}px`;
  token.style.top = `${startViewport.y}px`;
  token.style.opacity = '0';
  token.style.setProperty('--resource-color', element.color || '#ffffff');
  token.innerHTML = `<img src="${getElementCostIcon(element.id)}" alt="${element.label}">`;
  getGlobalFxLayer().appendChild(token);

  const end = getResourceTargetPoint(playerId, element.id, index);
  await animateCss(token, [
    { left: `${startViewport.x}px`, top: `${startViewport.y}px`, transform: 'translate(-50%, -50%) scale(.45)', opacity: 0 },
    { left: `${startViewport.x}px`, top: `${startViewport.y - 18}px`, transform: 'translate(-50%, -50%) scale(1.18)', opacity: 1, offset: .18 },
    { left: `${(startViewport.x + end.x) / 2}px`, top: `${Math.min(startViewport.y, end.y) - 34}px`, transform: 'translate(-50%, -50%) scale(1.04)', opacity: 1, offset: .58 },
    { left: `${end.x}px`, top: `${end.y}px`, transform: 'translate(-50%, -50%) scale(.84)', opacity: 1 },
  ], EXTRACTION_ORB_TRAVEL_MS, 'cubic-bezier(.18,.72,.19,1)');
  createElementBurstAtViewport(end.x, end.y, element.color || '#ffffff', { kind: 'resource-land', count: 8, duration: 480 });
  await sleep(45);
  safeRemove(token);
  state.players[playerId].resources.push({ ...element, icon: getElementCostIcon(element.id), uid: `orb_${Date.now()}_${index}_${Math.random()}`, createdAt: Date.now() });
  renderResources();
  renderEnemyMiniHud();
}

function createExtractionCardFx(cardDef) {
  const div = document.createElement('div');
  div.className = 'extract-card-fx';
  div.style.setProperty('--extract-element-color', cardDef.elementColor || '#9b4dff');
  div.innerHTML = `
    <img class="card-layer card-bg" src="${cardDef.bgImage}" alt="fondo elemento">
    <img class="card-layer card-art" src="${cardDef.artImage}" alt="elemento ${cardDef.id}">
    <img class="card-layer card-skin" src="${cardDef.skinImage}" alt="skin carta">
    <span class="extract-card-count">x${cardDef.count}</span>
  `;
  return div;
}

function getExtractionCenterPoint() {
  const boardRect = els.boardContent.getBoundingClientRect();
  const line = document.querySelector('.battle-center-line');
  if (line) {
    const rect = line.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 - boardRect.left,
      y: rect.top + rect.height / 2 - boardRect.top,
    };
  }
  return { x: boardRect.width * 0.5, y: boardRect.height * 0.5 };
}

function getExtractionSourcePoint(playerId) {
  const rect = els.boardContent.getBoundingClientRect();

  // Calibrado con la textura que enviaste:
  // J1 nace encima de la fuente inferior izquierda.
  // J2 nace encima de la fuente superior derecha.
  if (playerId === 1) {
    return { x: rect.width * 0.145, y: rect.height * 0.862 };
  }
  return { x: rect.width * 0.858, y: rect.height * 0.138 };
}

function getResourceTargetPoint(playerId, elementId = null, orbOffset = 0) {
  const isLocal = playerId === LOCAL_PLAYER_ID;
  const container = isLocal ? els.resourceBar : els.enemyMiniResources;
  if (!container) {
    const fallback = els.boardContent.getBoundingClientRect();
    return { x: fallback.left + fallback.width / 2, y: fallback.top + fallback.height / 2 };
  }

  const rect = container.getBoundingClientRect();
  const displayIndex = getResourceDisplayIndexAfterAdding(playerId, elementId || getPlayerElement(playerId).id);

  if (isLocal) {
    const iconStep = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ctrl-resource-icon-size')) || 46;
    const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ctrl-resource-icon-gap')) || 12;
    const x = rect.left + rect.width / 2;
    const y = rect.top + 26 + Math.min(displayIndex, 9) * (iconStep + gap);
    return { x, y };
  }

  const childStep = 24;
  const x = rect.left + 12 + Math.min(displayIndex, 8) * childStep;
  const y = rect.top + Math.max(10, rect.height / 2);
  return { x, y };
}


function setGamePaused(paused) {
  state.paused = Boolean(paused);
  document.body?.classList?.toggle('game-paused', state.paused);
  if (els.nextPhaseBtn) els.nextPhaseBtn.textContent = state.paused ? 'PAUSA' : 'SIGUIENTE';
  if (!state.paused) {
    const resolvers = Array.isArray(state.pauseResumeResolvers) ? state.pauseResumeResolvers.splice(0) : [];
    resolvers.forEach(resolve => resolve());
    if (state.pendingPhaseStartWhilePaused) {
      state.pendingPhaseStartWhilePaused = false;
      schedulePhaseStartActions(0);
    }
  }
  renderPhaseUI?.();
  log(state.paused ? 'Juego pausado con ESPACIO.' : 'Juego reanudado con ESPACIO.');
}

function toggleGamePause() {
  setGamePaused(!state.paused);
}

function waitUntilUnpaused() {
  if (!state.paused) return Promise.resolve();
  return new Promise(resolve => {
    state.pauseResumeResolvers = state.pauseResumeResolvers || [];
    state.pauseResumeResolvers.push(resolve);
  });
}

function safeRemove(node) {
  if (node && node.parentNode) node.parentNode.removeChild(node);
}

function sleep(ms) {
  return new Promise(resolve => {
    const startedAt = Date.now();
    let remaining = Math.max(0, Number(ms) || 0);
    let timer = null;
    const run = () => {
      if (state.paused) {
        clearTimeout(timer);
        remaining = Math.max(0, remaining - (Date.now() - startedAt));
        waitUntilUnpaused().then(run);
        return;
      }
      timer = setTimeout(async () => {
        if (state.paused) {
          await waitUntilUnpaused();
        }
        resolve();
      }, remaining);
    };
    run();
  });
}

function animateCss(el, keyframes, duration, easing = 'ease') {
  const animation = el.animate(keyframes, { duration, easing, fill: 'forwards' });
  return animation.finished.catch(() => {});
}

function getCardPrimaryElement(card) {
  const first = Object.keys(card.cost || {})[0];
  return ELEMENTS.find(e => e.id === first) || ELEMENTS[0];
}

function findQueuedItemBySpawn(playerId, spawnId) {
  return state.players[playerId].castQueue.find(item => item.spawnId === spawnId) || null;
}

function isCastIntroReady(playerId, spawnId) {
  const item = findQueuedItemBySpawn(playerId, spawnId);
  if (!item) return true;
  if (item.introDone) return true;
  if (item.introEndsAt && Date.now() >= item.introEndsAt) {
    item.justAdded = false;
    item.introDone = true;
    item.introStarted = false;
    item.introEndsAt = 0;
    return true;
  }
  return false;
}

function findUnitBySpawn(playerId, spawnId) {
  return state.players[playerId].units.find(unit => unit.spawnId === spawnId) || null;
}

function clearLinkedHoverStates() {
  document.querySelectorAll('.pulse-linked, .hover-linked, .queue-linked').forEach(el => el.classList.remove('pulse-linked', 'hover-linked', 'queue-linked'));
}

function attachLinkHoverHandlers(el, spawnId, playerId, mode) {
  if (!el || !spawnId) return;
  if (el.dataset.linkHoverReady === '1') return;
  el.dataset.linkHoverReady = '1';
  el.addEventListener('mouseenter', () => {
    clearLinkedHoverStates();

    // Mientras la ficha acaba de ser kasteada y está cayendo en la zona de Kasteo,
    // NO se permite palpitación ni hover cruzado. Primero cae, luego interactúa.
    if (!isCastIntroReady(playerId, spawnId)) return;

    if (mode === 'queue') {
      const marker = document.querySelector(`.spawn-marker[data-spawn-id="${spawnId}"][data-player-id="${playerId}"]`);
      if (marker) marker.classList.add('pulse-linked');
    } else if (mode === 'marker') {
      const queueItem = document.querySelector(`.cast-item[data-spawn-id="${spawnId}"][data-player-id="${playerId}"]`);
      if (queueItem) {
        queueItem.classList.add('queue-linked');
      } else {
        const unit = document.querySelector(`.unit.invocation[data-spawn-id="${spawnId}"][data-player-id="${playerId}"]`);
        if (unit) unit.classList.add('hover-linked');
      }
    } else if (mode === 'unit') {
      const marker = document.querySelector(`.spawn-marker[data-spawn-id="${spawnId}"][data-player-id="${playerId}"]`);
      if (marker) marker.classList.add('hover-linked');
    }
  });
  el.addEventListener('mouseleave', clearLinkedHoverStates);
}


const MOVE_ARROW_BY_DELTA = {
  '-1,-1': 'assets/move_ul.jpg',
  '-1,0': 'assets/move_u.jpg',
  '-1,1': 'assets/move_ur.jpg',
  '0,-1': 'assets/move_l.jpg',
  '0,1': 'assets/move_r.jpg',
  '1,-1': 'assets/move_dl.jpg',
  '1,0': 'assets/move_d.jpg',
  '1,1': 'assets/move_dr.jpg',
};

function prepareResolutionMoves(playerId) {
  const player = state.players[playerId];
  if (!player) return;
  player.caster.movesLeft = TEST_CASTER_MOVE_SPEED;
  player.units.forEach(unit => {
    unit.movesLeft = (unit.status === 'restoring' || isUnitEngaged(unit) || hasStructureAttackAnchor(unit)) ? 0 : (unit.mov ?? TEST_INVOCATION_MOVE_SPEED);
  });
}

function selectMover(type, playerId, unitId = null) {
  clearCombatMenus();
  if (currentPhase().id !== 'resolution') {
    log('El movimiento solo está disponible en la fase de Resolución.');
    return;
  }
  if (playerId !== state.activePlayer) {
    log('Solo puedes mover tus propias fichas en tu fase de Resolución.');
    return;
  }
  if (type === 'caster') {
    const caster = state.players[playerId].caster;
    if ((caster.movesLeft ?? 0) <= 0) {
      log('El Kaster ya no tiene velocidad disponible en esta fase.');
      return;
    }
    state.selectedMover = { type, playerId };
    log('Kaster seleccionado para mover.');
  } else if (type === 'invocation') {
    const unit = state.players[playerId].units.find(u => u.id === unitId);
    if (!unit) return;
    if (unit.status === 'restoring') {
      log(`${CARD_LIBRARY[unit.cardId]?.name || 'Invocación'} está en restauración.`);
      return;
    }
    if (isUnitEngaged(unit)) {
      log(`${CARD_LIBRARY[unit.cardId]?.name || 'Invocación'} está combatiendo y no puede moverse.`);
      return;
    }
    state.selectedMover = { type, playerId, unitId };
    if (hasStructureAttackAnchor(unit)) {
      log(`${CARD_LIBRARY[unit.cardId]?.name || 'Invocación'} está anclada atacando una estructura. Puede atacar, pero no moverse.`);
    } else if ((unit.movesLeft ?? 0) <= 0) {
      log(`${CARD_LIBRARY[unit.cardId]?.name || 'Invocación'} seleccionada para atacar. Ya no tiene movimiento disponible.`);
    } else {
      log(`${CARD_LIBRARY[unit.cardId]?.name || 'Invocación'} seleccionada para mover o atacar.`);
    }
  }
}

function getSelectedMoverOptions() {
  const sel = state.selectedMover;
  if (!sel || currentPhase().id !== 'resolution') return [];
  if (sel.type === 'caster') {
    const c = state.players[sel.playerId].caster;
    if ((c.movesLeft ?? 0) <= 0) return [];
    const deltas = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    return deltas.map(([dr, dc]) => ({ row: c.row + dr, col: c.col + dc, dr, dc }))
      .filter(opt => isInside(opt.row, opt.col) && !isOccupiedForPlayer(opt.row, opt.col, sel.playerId));
  }
  if (sel.type === 'invocation') {
    const unit = state.players[sel.playerId].units.find(u => u.id === sel.unitId);
    if (!unit || unit.status === 'restoring' || isUnitEngaged(unit) || hasStructureAttackAnchor(unit) || (unit.movesLeft ?? 0) <= 0) return [];
    const deltas = getMovementDeltasForProfile(getEffectiveMovementTypeForUnit(sel.playerId, unit), sel.playerId);
    return deltas.map(([dr, dc]) => ({ row: unit.row + dr, col: unit.col + dc, dr, dc }))
      .filter(opt => isInside(opt.row, opt.col) && !isOccupiedForPlayer(opt.row, opt.col, sel.playerId));
  }
  return [];
}

function tryMoveSelectedTo(row, col) {
  const option = getSelectedMoverOptions().find(opt => opt.row === row && opt.col === col);
  if (!option || !state.selectedMover) return false;
  const sel = state.selectedMover;
  if (sel.type === 'caster') {
    const caster = state.players[sel.playerId].caster;
    displaceHiddenOpponentIfNeeded(row, col, sel.playerId);
    markResolutionActionTaken();
    caster.row = row;
    caster.col = col;
    caster.movesLeft = Math.max(0, (caster.movesLeft ?? 0) - 1);
    log(`Kaster se mueve a ${coordLabel(row, col)}.`);
    if ((caster.movesLeft ?? 0) <= 0) state.selectedMover = null;
  } else if (sel.type === 'invocation') {
    const unit = state.players[sel.playerId].units.find(u => u.id === sel.unitId);
    if (!unit) return false;
    displaceHiddenOpponentIfNeeded(row, col, sel.playerId);
    markResolutionActionTaken();
    unit.row = row;
    unit.col = col;
    unit.movesLeft = Math.max(0, (unit.movesLeft ?? 0) - 1);
    log(`${CARD_LIBRARY[unit.cardId]?.name || 'Invocación'} se mueve a ${coordLabel(row, col)}.`);
    if (checkRiskZoneAttack(sel.playerId, unit)) return true;
    // La invocación queda seleccionada aunque ya no tenga movimiento,
    // porque todavía puede seleccionar objetivo para atacar/combatir.
  }
  renderAll();
  return true;
}

function updateCardInfoAction() {
  if (!els.cardInfoKastBtn || !state.infoCard) return;
  const card = CARD_LIBRARY[state.infoCard.cardId];
  if (!card || state.infoCard.source) {
    els.cardInfoKastBtn.disabled = true;
    els.cardInfoKastBtn.textContent = 'Kastear';
    els.cardInfoKastBtn.title = 'Solo disponible desde el Spellbook';
    return;
  }
  const isLocalTurn = state.activePlayer === LOCAL_PLAYER_ID;
  const canPhase = currentPhase().id === 'casting';
  const canKasterZone = isCasterInOwnSide(LOCAL_PLAYER_ID);
  const canPay = canPayCardCostForPlayer(LOCAL_PLAYER_ID, card);
  const enabled = isLocalTurn && canPhase && canPay && canKasterZone;
  els.cardInfoKastBtn.disabled = !enabled;
  els.cardInfoKastBtn.textContent = 'Kastear';
  if (enabled) {
    els.cardInfoKastBtn.title = '';
  } else if (!isLocalTurn) {
    els.cardInfoKastBtn.title = 'No es tu turno';
  } else if (!canPhase) {
    els.cardInfoKastBtn.title = 'Solo disponible en la fase de Kasteo';
  } else if (!canKasterZone) {
    els.cardInfoKastBtn.title = 'El Kaster no puede kastear en la zona enemiga';
  } else {
    els.cardInfoKastBtn.title = 'No tienes elementos suficientes';
  }
}



function renderCardInfoMeta(card) {
  if (!els.cardInfoMetaIcons) return;
  const races = Array.isArray(card.races) ? card.races : [];
  const qualities = Array.isArray(card.qualities) ? card.qualities : [];
  const gender = getGenderProfile(card.gender || 'none');
  const chips = [];
  races.slice(0, 2).forEach(raceId => {
    const race = getRaceProfile(raceId);
    const icon = getRaceIcon(card, raceId);
    chips.push(`
      <button type="button" class="card-meta-chip card-meta-chip-race" data-info-kind="race" data-info-id="${race.id}" title="Raza: ${race.label} · Género: ${gender.label}">
        <img src="${icon}" alt="${race.label}">
        <span>${race.label}</span>
      </button>`);
  });

  qualities.slice(0, 2).forEach(qualityId => {
    const quality = getQualityProfile(qualityId);
    if (!quality) return;
    chips.push(`
      <button type="button" class="card-meta-chip card-meta-chip-quality" data-info-kind="quality" data-info-id="${quality.id}" title="Cualidad: ${quality.label}">
        <img src="${quality.icon}" alt="${quality.label}">
        <span>${quality.label}</span>
      </button>`);
  });

  els.cardInfoMetaIcons.innerHTML = chips.join('');
  els.cardInfoMetaIcons.querySelectorAll('[data-info-kind]').forEach(btn => {
    btn.addEventListener('click', () => openCardMetaInfo(btn.dataset.infoKind, btn.dataset.infoId, card));
  });
}


function bindInlineInfoButtons(root, card) {
  root?.querySelectorAll('[data-info-kind]').forEach(btn => {
    btn.addEventListener('click', () => openCardMetaInfo(btn.dataset.infoKind, btn.dataset.infoId, card, btn.dataset));
  });
}

function renderDamageNatureChip(card) {
  const nature = getDamageNatureProfile(card);
  return `<button type="button" class="card-info-weapon-letter" data-info-kind="damageNature" data-info-id="${nature.id}" title="Tipo de daño: ${nature.label}">${nature.letter}</button>`;
}

function renderWeaponDamageChip(card) {
  const profile = getAttackProfile(card);
  const weapon = getWeaponProfile(card);
  const nature = getDamageNatureProfile(card);
  const kageBonus = getCardRuntimeKageDamageBonus(card);
  const kageBonusHtml = kageBonus > 0
    ? `<span class="card-info-kage-damage-bonus" title="Bono separado por Kage no Michi">+${kageBonus}</span>`
    : '';
  return `<span class="card-info-damage-wrap"><button type="button" class="card-info-weapon-letter" data-info-kind="damageNature" data-info-id="${nature.id}" title="Tipo de daño: ${nature.label}">${nature.letter}</button><button type="button" class="card-info-damage-chip" data-info-kind="weapon" data-info-id="${weapon.id}" title="Ver arma / ataque: ${weapon.label}"><img src="${weapon.icon}" alt="${weapon.label}"><span>${profile.damage}</span></button>${kageBonusHtml}</span>`;
}

function renderCombatModeChip(card) {
  const mode = getCombatModeProfile(card);
  return `<button type="button" class="card-info-icon-chip" data-info-kind="combatMode" data-info-id="${mode.id}" title="Modo de combate: ${mode.label}"><img src="${mode.icon}" alt="${mode.label}"></button>`;
}

function renderDamageApplicationChip(card) {
  const id = getExplicitDamageApplicationId(card);
  if (!id) return '';
  const application = DAMAGE_APPLICATION_DB[id];
  return `<button type="button" class="card-info-icon-chip" data-info-kind="damageApplication" data-info-id="${application.id}" title="Aplicación de daño: ${application.label}"><img src="${application.icon}" alt="${application.label}"></button>`;
}

function renderAttackRangeChip(card) {
  const profile = getAttackProfile(card);
  const info = getAttackRangeMeta(card);
  return `<button type="button" class="card-info-value-chip" data-info-kind="attackRange" data-info-id="range" title="Alcance: ${profile.range} casilla${profile.range === 1 ? '' : 's'}"><img src="${info.icon}" alt="Alcance"><span>${profile.range}</span></button>`;
}

function renderAttackPrecisionChip(card) {
  const profile = getAttackProfile(card);
  const info = getAttackPrecisionMeta(card);
  return `<button type="button" class="card-info-value-chip card-info-pda-chip" data-info-kind="attackPrecision" data-info-id="precision" title="Precisión: ${profile.precision} PDA"><img src="${info.icon}" alt="Precisión"><span class="card-info-value-bubble">${profile.precision}</span><small>PDA</small></button>`;
}

function renderFactorChip(factorEntry, card = null) {
  const factor = getFactorProfile(factorEntry?.id);
  if (!factor) return '';
  const level = Number(factorEntry.level || 1);
  const runtimeSource = getRuntimeSourceForCardInfo(card);
  const pda = getEffectiveFactorPda(factor.id, level, runtimeSource, factorEntry);
  if (factor?.pdaByLevel) {
    return `<button type="button" class="card-info-value-chip card-info-factor-chip card-info-pda-chip" data-info-kind="factor" data-info-id="${factor.id}" data-factor-level="${level}" data-factor-source="${factorEntry.source || factorEntry.sourceType || ''}" title="${factor.label} ${level} · ${pda} PDA"><img src="${factor.icon}" alt="${factor.label}"><span class="factor-level-badge">${level}</span><span class="card-info-value-bubble">${pda}</span><small>PDA</small></button>`;
  }
  const showLevelBadge = factor.id === 'extraWeapon';
  return `<button type="button" class="card-info-value-chip card-info-factor-chip" data-info-kind="factor" data-info-id="${factor.id}" data-factor-level="${level}" data-factor-source="${factorEntry.source || factorEntry.sourceType || ''}" title="${factor.label}${showLevelBadge ? ` ${level}` : ''}"><img src="${factor.icon}" alt="${factor.label}"><span class="sr-only">${factor.label}</span>${showLevelBadge ? `<span class="factor-level-badge">${level}</span>` : ''}</button>`;
}


function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renderCardNameWithFamily(card) {
  if (!card?.family) return card?.name || 'Carta';
  const family = getFamilyProfile(card.family);
  if (!family) return card.name || 'Carta';
  const rawName = card.name || '';
  const familyLabel = escapeRegExp(family.label);
  const familyPatternStart = new RegExp('^\\s*' + familyLabel + '[\\s,]*', 'i');
  const familyPatternEnd = new RegExp('\\s*\\(?' + familyLabel + '\\)?\\s*$', 'i');
  const baseName = rawName.replace(familyPatternStart, '').replace(familyPatternEnd, '').replace(/[\s,]+$/, '') || rawName;
  if (card.familyPosition === 'prefix') {
    return `<button type="button" class="family-name-chip" data-info-kind="family" data-info-id="${family.id}">${family.label}<span class="family-star">★</span></button> ${baseName}`;
  }
  return `${baseName} <button type="button" class="family-name-chip" data-info-kind="family" data-info-id="${family.id}">(${family.label}<span class="family-star">★</span>)</button>`;
}



function bindCardInfoName(card) {
  if (!els.cardInfoName) return;
  els.cardInfoName.innerHTML = renderCardNameWithFamily(card);
  bindInlineInfoButtons(els.cardInfoName, card);
}


function renderCardAbilityPowerPanel(card) {
  if (!els.cardInfoExtraPanel) return;
  const slotCount = Math.max(0, Number(card?.abilitySlots ?? 0));
  const abilities = Array.isArray(card?.abilities) ? card.abilities : [];
  const slots = Array.from({ length: slotCount }, (_, index) => {
    const ability = abilities[index];
    if (ability) {
      const info = getAbilityProfile(ability.id);
      return `<button type="button" class="ability-slot filled" data-info-kind="ability" data-info-id="${info.id}"><img src="${info.icon}" alt="${info.label}"><span>${info.label}</span></button>`;
    }
    return `<span class="ability-slot empty">Habilidad libre</span>`;
  }).join('');
  const power = card?.power;
  const powerSummary = power ? String(power.shortSummary || power.summary || '').trim() : '';
  const powerHtml = power
    ? `<button type="button" class="power-slot filled" data-info-kind="power" data-info-id="${power.id}"><strong>Poder</strong><span>${power.name}</span><small>${power.activation || 'Pasivo'} · ${power.category || 'General'}</small>${powerSummary ? `<em class="power-slot-summary">${powerSummary}</em>` : ''}</button>`
    : `<span class="power-slot empty"><strong>Poder</strong><span>Sin poder</span><small>Sin efecto único</small></span>`;
  const smokeCount = card?.id === 'ninjaNaitoSutoka' ? card?.__runtime?.smokeBombsLeft : null;
  const smokeResourceHtml = smokeCount != null ? `<div class="power-resource-strip"><button type="button" class="power-resource-chip" data-info-kind="weapon" data-info-id="smokeBomb" title="Bombas de humo disponibles: ${smokeCount}"><img src="${SMOKE_BOMB_ICON_ASSET}" alt="Bomba de humo"><span>Bomba de humo</span><strong>${smokeCount}</strong></button></div>` : '';
  const sideHtml = `<div class="ability-power-side">${powerHtml}${smokeResourceHtml}</div>`;
  els.cardInfoExtraPanel.innerHTML = `<div class="ability-power-grid"><div class="ability-slots">${slots}</div>${sideHtml}</div>`;
  bindInlineInfoButtons(els.cardInfoExtraPanel, card);
}

function renderLifeBaseChip(card) {
  const maxLife = Number(card?.stats?.life ?? card?.stats?.def ?? 0);
  return `<button type="button" class="card-info-value-chip card-info-heart-value-chip" data-info-kind="lifeStat" data-info-id="life" title="Vida base máxima: ${maxLife}"><span class="card-info-symbol-icon"><span class="unit-heart-icon" aria-hidden="true"></span></span><span class="card-info-value-bubble">${maxLife}</span></button>`;
}

function renderCardCostChip(card) {
  const entries = getCardCostEntries(card);
  const iconHtml = entries.flatMap(([elementId, amount]) => {
    const icon = getElementCostIcon(elementId);
    const label = elementId === 'random' ? 'Costo aleatorio' : `Costo ${elementId}`;
    return Array.from({ length: amount }, (_, idx) => `<span class="card-cost-entry" title="${label}"><img src="${icon}" alt="${label}"></span>`);
  }).join('');
  const total = getCardTotalCost(card);
  return `<button type="button" class="card-info-value-chip card-info-cost-chip" data-info-kind="castCost" data-info-id="cost" title="Costo total: ${total}. Distribución: ${getCardCostSummary(card)}"><span class="card-info-cost-icons">${iconHtml}</span></button>`;
}

function renderCastTimeChip(card) {
  const castTime = Number(card?.castPhases ?? 0);
  return `<button type="button" class="card-info-value-chip card-info-svg-value-chip" data-info-kind="castTime" data-info-id="cast" title="Tiempo de kasteo: ${castTime} fase${castTime === 1 ? '' : 's'}"><span class="card-info-svg-icon" aria-hidden="true">${CAST_ENTRY_ICON_INLINE_SVG}</span><span>${castTime}</span></button>`;
}

function renderRestoreTimeChip(card) {
  const restoreTime = Math.max(0, Number(card?.stats?.restore ?? 0));
  return `<button type="button" class="card-info-value-chip card-info-svg-value-chip" data-info-kind="restoreTime" data-info-id="restore" title="Tiempo de restauración: ${restoreTime} fase${restoreTime === 1 ? '' : 's'}"><span class="card-info-svg-icon" aria-hidden="true">${RESTORE_ICON_INLINE_SVG}</span><span>${restoreTime}</span></button>`;
}

function renderMovementTypeChip(card) {
  const movement = getMovementProfile(card?.movementType || 'basic');
  return `<button type="button" class="card-info-icon-chip card-info-movement-chip" data-info-kind="movementType" data-info-id="${movement.id}" title="Movilidad: ${movement.label}"><img src="${movement.icon}" alt="${movement.label}"></button>`;
}

function renderSpeedChip(card) {
  const speed = Number(card?.stats?.mov ?? 0);
  return `<button type="button" class="card-info-value-chip card-info-speed-chip" data-info-kind="speedStat" data-info-id="speed" title="Velocidad: ${speed}"><img src="assets/icons/factor-velocidad.svg" alt="Velocidad"><span>${speed}</span></button>`;
}

function renderBiotypeChip(card) {
  const biotype = getBiotypeProfile(getEffectiveBiotypeId(card));
  return `<button type="button" class="card-info-icon-chip card-info-biotype-chip" data-info-kind="biotype" data-info-id="${biotype.id}" title="Biotipo: ${biotype.label}"><img src="${biotype.icon}" alt="${biotype.label}"></button>`;
}


function renderAttackModifierChip(modifier) {
  return `<button type="button" class="card-info-text-chip" data-info-kind="attackModifier" data-info-id="${modifier.id}" title="Modificador ofensivo: ${modifier.label}">${modifier.label}</button>`;
}


function updateCardMetaInfoBackButton() {
  if (!els.cardMetaInfoBackBtn) return;
  const hasHistory = Array.isArray(state.cardMetaInfoHistory) && state.cardMetaInfoHistory.length > 0;
  els.cardMetaInfoBackBtn.disabled = !hasHistory;
  els.cardMetaInfoBackBtn.classList.toggle('disabled', !hasHistory);
  els.cardMetaInfoBackBtn.hidden = !hasHistory;
  els.cardMetaInfoBackBtn.setAttribute('aria-hidden', hasHistory ? 'false' : 'true');
}

function goBackCardMetaInfo() {
  if (!Array.isArray(state.cardMetaInfoHistory) || !state.cardMetaInfoHistory.length) return;
  const previous = state.cardMetaInfoHistory.pop();
  state.cardMetaInfoCurrent = null;
  openCardMetaInfo(previous.kind, previous.id, previous.card, { ...(previous.extra || {}), skipHistory: true });
}

const EFFECT_CLASSIFICATION_DB = {
  applicationModes: {
    active: { id: 'active', label: 'Activo' },
    passive: { id: 'passive', label: 'Pasivo' },
    reaction: { id: 'reaction', label: 'Reacción' },
  },
  applicationTags: {
    pda: { id: 'pda', label: 'PDA' },
    continuous: { id: 'continuous', label: 'Continuo' },
    instant: { id: 'instant', label: 'Instantáneo' },
    cost: { id: 'cost', label: 'Costo' },
  },
  natures: {
    physical: { id: 'physical', label: 'Físico' },
    magic: { id: 'magic', label: 'Mágico' },
    elemental: { id: 'elemental', label: 'Elemental' },
    psychic: { id: 'psychic', label: 'Psíquico' },
    virtual: { id: 'virtual', label: 'Virtual' },
    tactical: { id: 'tactical', label: 'Táctico' },
  },
  functionalCategories: {
    offensive: { id: 'offensive', label: 'Ofensiva' },
    defensive: { id: 'defensive', label: 'Defensiva' },
    control: { id: 'control', label: 'Control' },
    execution: { id: 'execution', label: 'Ejecución' },
    utility: { id: 'utility', label: 'Utilidad' },
    support: { id: 'support', label: 'Soporte' },
    concealment: { id: 'concealment', label: 'Ocultamiento' },
    sabotage: { id: 'sabotage', label: 'Sabotaje' },
    protection: { id: 'protection', label: 'Protección' },
    resupply: { id: 'resupply', label: 'Reabastecimiento' },
    fieldAlteration: { id: 'fieldAlteration', label: 'Alteración de campo' },
    standard: { id: 'standard', label: 'Estándar' },
  },
};

function getEffectClassificationLabels(classification = {}, includeModes = true) {
  const parts = [];
  const modes = includeModes ? (Array.isArray(classification.applicationModes) ? classification.applicationModes : []) : [];
  const tags = Array.isArray(classification.applicationTags) ? classification.applicationTags : [];
  const natures = Array.isArray(classification.natures) ? classification.natures : [];
  const categories = Array.isArray(classification.functionalCategories) ? classification.functionalCategories : [];

  const modeLabels = modes.map(id => EFFECT_CLASSIFICATION_DB.applicationModes[id]?.label || id);
  const tagLabels = tags.map(id => EFFECT_CLASSIFICATION_DB.applicationTags[id]?.label || id);
  const natureLabels = natures.map(id => EFFECT_CLASSIFICATION_DB.natures[id]?.label || id);
  const categoryLabels = categories.map(id => EFFECT_CLASSIFICATION_DB.functionalCategories[id]?.label || id);

  if (modeLabels.length || tagLabels.length) parts.push([...modeLabels, ...tagLabels].join('/'));
  if (natureLabels.length) parts.push(natureLabels.join('/'));
  if (categoryLabels.length) parts.push(categoryLabels.join('/'));
  return parts.join(' · ');
}

function getPowerClassificationText(power = null, card = null) {
  const includeModes = getCardTypeId(card) !== 'spell';
  return getEffectClassificationLabels(power?.classification || {}, includeModes) || power?.category || 'General';
}

function normalizeLegacyClassificationText(value = '') {
  return String(value || '')
    .replaceAll('/', ' · ')
    .replaceAll('-', ' ')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function inferEffectClassificationFromText(profile = {}, kind = '') {
  if (profile?.classification && typeof profile.classification === 'object') return profile.classification;
  const raw = [
    profile?.classification,
    profile?.activation,
    profile?.category,
    profile?.focus,
    profile?.summary,
    Array.isArray(profile?.tags) ? profile.tags.join(' ') : '',
  ].filter(Boolean).join(' · ');
  const text = normalizeLegacyClassificationText(raw);
  const applicationModes = [];
  const applicationTags = [];
  const natures = [];
  const functionalCategories = [];

  if (text.includes('activo')) applicationModes.push('active');
  if (text.includes('pasiv')) applicationModes.push('passive');
  if (text.includes('reaccion')) applicationModes.push('reaction');
  if (text.includes('pda') || text.includes('probabilidad')) applicationTags.push('pda');
  if (text.includes('continuo') || text.includes('durante') || text.includes('sostenid')) applicationTags.push('continuous');
  if (text.includes('instant')) applicationTags.push('instant');
  if (text.includes('costo') || text.includes('coste') || text.includes('consume')) applicationTags.push('cost');

  if (text.includes('fisic') || text.includes('arma') || text.includes('cuerpo') || text.includes('proyectil')) natures.push('physical');
  if (text.includes('magic') || text.includes('magia') || text.includes('hechicer')) natures.push('magic');
  if (text.includes('element')) natures.push('elemental');
  if (text.includes('psiqu') || text.includes('mente') || text.includes('confusion') || text.includes('miedo')) natures.push('psychic');
  if (text.includes('regla') || text.includes('recurso') || text.includes('estructura') || text.includes('condicion') || text.includes('campo') || text.includes('sabot') || text.includes('robo') || text.includes('saqueo') || text.includes('oculto')) natures.push('virtual');
  if (text.includes('tactic') || text.includes('movilidad') || text.includes('movimiento') || text.includes('reposicion') || text.includes('sigilo') || text.includes('presion') || text.includes('emboscada') || text.includes('ocultamiento')) natures.push('tactical');

  if (text.includes('ofensiv') || text.includes('daño') || text.includes('ataque')) functionalCategories.push('offensive');
  if (text.includes('defensiv') || text.includes('defensa')) functionalCategories.push('defensive');
  if (text.includes('control')) functionalCategories.push('control');
  if (text.includes('ejecucion') || text.includes('letalidad') || text.includes('remate')) functionalCategories.push('execution');
  if (text.includes('utilidad') || text.includes('versatilidad') || text.includes('general')) functionalCategories.push('utility');
  if (text.includes('soporte') || text.includes('apoyo')) functionalCategories.push('support');
  if (text.includes('oculto') || text.includes('ocultamiento') || text.includes('sigilo')) functionalCategories.push('concealment');
  if (text.includes('sabot')) functionalCategories.push('sabotage');
  if (text.includes('proteccion') || text.includes('proteger')) functionalCategories.push('protection');
  if (text.includes('reabaste')) functionalCategories.push('resupply');
  if (text.includes('campo') || text.includes('arena') || text.includes('zona') || text.includes('estructura')) functionalCategories.push('fieldAlteration');

  if (kind === 'race' && !functionalCategories.length) functionalCategories.push('utility');
  if (kind === 'quality' && !natures.length) natures.push('tactical');
  if (kind === 'weapon' && !natures.length) natures.push('physical');
  if (kind === 'weapon' && !functionalCategories.length) functionalCategories.push('offensive');
  if (kind === 'factor' && profile?.pdaByLevel && !applicationTags.includes('pda')) applicationTags.push('pda');

  const unique = arr => Array.from(new Set(arr));
  return {
    applicationModes: unique(applicationModes),
    applicationTags: unique(applicationTags),
    natures: unique(natures),
    functionalCategories: unique(functionalCategories.length ? functionalCategories : ['standard']),
  };
}

function getMetaClassificationText(profile = {}, kind = '', options = {}) {
  const classification = inferEffectClassificationFromText(profile, kind);
  const includeModes = options.includeModes !== false;
  return getEffectClassificationLabels(classification, includeModes) || profile?.classification || profile?.category || profile?.focus || 'Estándar';
}

function buildMetaClassificationHtml(profile = {}, kind = '', options = {}) {
  const text = getMetaClassificationText(profile, kind, options);
  return text ? `<p class="meta-classification-line"><strong>Clasificación:</strong> ${text}</p>` : '';
}

function openCardMetaInfo(kind, id, card = null, extra = {}) {
  if (!els.cardMetaInfoOverlay) return;
  const skipHistory = extra?.skipHistory === true || extra?.skipHistory === 'true';
  if (!skipHistory && state.cardMetaInfoCurrent && els.cardMetaInfoOverlay.classList.contains('open')) {
    state.cardMetaInfoHistory = Array.isArray(state.cardMetaInfoHistory) ? state.cardMetaInfoHistory : [];
    state.cardMetaInfoHistory.push(state.cardMetaInfoCurrent);
  }
  state.cardMetaInfoCurrent = { kind, id, card, extra: { ...extra, skipHistory: true } };
  updateCardMetaInfoBackButton();
  if (kind === 'cardType') {
    const type = getCardTypeProfile(id);
    if (els.cardMetaInfoIcon) els.cardMetaInfoIcon.innerHTML = `<img src="${type.icon}" alt="${type.label}">`;
    if (els.cardMetaInfoTitle) els.cardMetaInfoTitle.textContent = `Tipo de carta: ${type.label}`;
    if (els.cardMetaInfoCategory) els.cardMetaInfoCategory.textContent = `Enfoque: ${type.focus || 'General'}`;
    if (els.cardMetaInfoBody) els.cardMetaInfoBody.innerHTML = `<p><strong>Resumen:</strong> ${type.summary}</p>${buildTagListHtml(type.tags)}<p>${type.description}</p>`;
  } else if (kind === 'race') {
    const race = getRaceProfile(id);
    const gender = getGenderProfile(card?.gender || 'none');
    const icon = getRaceIcon(card, id);
    if (els.cardMetaInfoIcon) els.cardMetaInfoIcon.innerHTML = `<img src="${icon}" alt="${race.label}">`;
    if (els.cardMetaInfoTitle) els.cardMetaInfoTitle.textContent = `Raza: ${race.label}`;
    if (els.cardMetaInfoCategory) els.cardMetaInfoCategory.textContent = getMetaClassificationText(race, 'race', { includeModes: false });
    if (els.cardMetaInfoBody) {
      const humanExtraWeaponHtml = race.id === 'human' && getCardExtraWeapons(card).length
        ? `<p><strong>Esta raza habilita en esta carta:</strong></p><div class="meta-source-factor-list">${getCardExtraWeapons(card).map(extraWeapon => {
          const weaponInfo = getWeaponInfoProfile(extraWeapon.weaponType);
          return `<button type="button" class="card-info-inline-chip" data-info-kind="factor" data-info-id="extraWeapon" data-factor-source="human"><img src="${FACTOR_DB.extraWeapon.icon}" alt="Arma extra"><span>Arma extra</span></button><button type="button" class="card-info-inline-chip" data-info-kind="extraWeapon" data-info-id="${extraWeapon.id || extraWeapon.weaponType}"><img src="${weaponInfo.icon}" alt="${weaponInfo.label}"><span>${weaponInfo.label}</span></button>`;
        }).join('')}</div><p><strong>Origen:</strong> Humano es la raza que concede Arma extra en esta carta por su versatilidad para usar armas y equipo.</p>`
        : '';
      els.cardMetaInfoBody.innerHTML = `<p><strong>Resumen:</strong> ${race.summary}</p>${buildMetaClassificationHtml(race, 'race', { includeModes: false })}${buildTagListHtml(race.tags)}<p>${race.description}</p>${humanExtraWeaponHtml}`;
      bindInlineInfoButtons(els.cardMetaInfoBody, card);
    }
  } else if (kind === 'quality') {
    const quality = getQualityProfile(id);
    if (!quality) return;
    if (els.cardMetaInfoIcon) els.cardMetaInfoIcon.innerHTML = `<img src="${quality.icon}" alt="${quality.label}">`;
    if (els.cardMetaInfoTitle) els.cardMetaInfoTitle.textContent = `Cualidad: ${quality.label}`;
    if (els.cardMetaInfoCategory) els.cardMetaInfoCategory.textContent = getMetaClassificationText(quality, 'quality', { includeModes: false });
    if (els.cardMetaInfoBody) {
      const granted = card ? getCardAttackFactors(card).filter(f => f.source === quality.id) : [];
      const grantedAbilities = card ? (Array.isArray(card.abilities) ? card.abilities.filter(ability => ability.sourceQuality === quality.id) : []) : [];
      const grantsHtml = granted.length ? `<p><strong>Esta cualidad habilita en esta carta:</strong></p><div class="meta-source-factor-list">${granted.map(f => {
        const factor = getFactorProfile(f.id);
        return `<button type="button" class="card-info-inline-chip" data-info-kind="factor" data-info-id="${f.id}" data-factor-level="${f.level || 1}"><img src="${factor?.icon || ''}" alt="${factor?.label || f.id}"><span>${factor?.label || f.id} ${f.level || 1}</span></button>`;
      }).join('')}</div>` : '';
      const abilityGrantsHtml = grantedAbilities.length ? `<p><strong>Esta cualidad concede habilidad:</strong></p><div class="meta-source-factor-list">${grantedAbilities.map(ability => {
        const info = getAbilityProfile(ability.id);
        return `<button type="button" class="card-info-inline-chip" data-info-kind="ability" data-info-id="${info.id}" data-source-quality="${quality.id}"><img src="${info.icon}" alt="${info.label}"><span>${info.label}</span></button>`;
      }).join('')}</div>${quality.id === 'stalker' ? '<p><strong>Origen:</strong> Acechador es la cualidad que concede Acechar.</p>' : ''}` : '';
      const assassinExtraWeaponHtml = '';
      els.cardMetaInfoBody.innerHTML = `<p><strong>Resumen:</strong> ${quality.summary}</p>${buildMetaClassificationHtml(quality, 'quality', { includeModes: false })}${buildTagListHtml(quality.tags)}<p>${quality.description}</p>${grantsHtml}${abilityGrantsHtml}${assassinExtraWeaponHtml}`;
      bindInlineInfoButtons(els.cardMetaInfoBody, card);
    }
  } else if (kind === 'family') {
    const family = getFamilyProfile(id);
    if (!family) return;
    if (els.cardMetaInfoIcon) els.cardMetaInfoIcon.innerHTML = `<div class="meta-info-family-star">★</div>`;
    if (els.cardMetaInfoTitle) els.cardMetaInfoTitle.textContent = `Familia: ${family.label}`;
    if (els.cardMetaInfoCategory) els.cardMetaInfoCategory.textContent = `Enfoque: ${family.focus}`;
    if (els.cardMetaInfoBody) els.cardMetaInfoBody.innerHTML = `<p><strong>Resumen:</strong> ${family.summary}</p>${buildTagListHtml(family.tags)}<p>${family.description}</p>`;
  } else if (kind === 'factor') {
    const factor = getFactorProfile(id);
    if (!factor) return;
    const level = Number(extra?.factorLevel || getCardAttackFactors(card).find(f => f.id === id)?.level || 1);
    const sourceId = extra?.factorSource || getCardAttackFactors(card).find(f => f.id === id)?.source || '';
    const sourceProfile = sourceId ? getMetaSourceProfile(sourceId) : null;
    const runtimeSource = getRuntimeSourceForCardInfo(card);
    const factorEntryForPda = getCardAttackFactors(card).find(f => f.id === id) || { id, level, source: sourceId };
    const pda = getEffectiveFactorPda(id, level, runtimeSource, factorEntryForPda);
    const multiplier = getFactorMultiplier(id, level);
    const hiddenSourceName = extra?.hiddenSourceName || '';
    if (els.cardMetaInfoIcon) els.cardMetaInfoIcon.innerHTML = `<img src="${factor.icon}" alt="${factor.label}">`;
    if (els.cardMetaInfoTitle) els.cardMetaInfoTitle.textContent = `${factor.label}${factor?.pdaByLevel ? ` ${level}` : ''}`;
    if (els.cardMetaInfoCategory) {
      const normalizedCategory = getMetaClassificationText(factor, 'factor');
      const baseCategory = (id === 'lethality')
        ? `${normalizedCategory} · ${pda} PDA · umbral ${getLethalityConfig(level).threshold} vida`
        : (factor?.pdaByLevel ? `${normalizedCategory} · ${pda} PDA · x${multiplier} daño` : `${normalizedCategory}`);
      els.cardMetaInfoCategory.textContent = (id === 'hidden' && hiddenSourceName)
        ? `${baseCategory} · Cortina activa de ${hiddenSourceName}`
        : baseCategory;
    }
    const sourceHtml = sourceProfile ? `<p><strong>Habilitado por:</strong> <button type="button" class="card-info-inline-chip" data-info-kind="${sourceProfile.kind}" data-info-id="${sourceProfile.id}"><img src="${sourceProfile.icon || getRaceIcon(card, sourceProfile.id)}" alt="${sourceProfile.label}"><span>${sourceProfile.label}</span></button></p>` : '';
    if (els.cardMetaInfoBody) {
      const pdaHtml = (id === 'lethality')
        ? `<p><strong>Condición:</strong> debe causar al menos 1 de daño real antes de comparar Letalidad.</p><p><strong>Probabilidad de ejecución:</strong> ${pda} PDA.</p>${getLethalityConfig(level).directThreshold ? `<p><strong>Ejecución directa:</strong> ${getLethalityConfig(level).directThreshold} o menos de vida, sin tirada.</p>` : ''}`
        : (factor?.pdaByLevel ? `<p><strong>Probabilidad de acierto:</strong> ${pda} PDA.</p>` : '');
      const hiddenSourceHtml = (id === 'hidden')
        ? `<p><strong>Otorgado por:</strong> <button type="button" class="card-info-inline-chip" data-info-kind="weapon" data-info-id="smokeBomb"><img src="${SMOKE_BOMB_ICON_ASSET}" alt="Bomba de humo"><span>Bomba de humo</span></button>${hiddenSourceName ? ` de <strong>${hiddenSourceName}</strong>` : ''}. La bomba de humo es la que permite usar Oculto mientras la invocación permanezca dentro de la cortina.</p>`
        : '';
      const extraWeaponDetailsHtml = id === 'extraWeapon' && getCardExtraWeapons(card).length
        ? `<p><strong>Arma concedida:</strong> ${getCardExtraWeapons(card).map(extraWeapon => {
          const weaponInfo = getWeaponInfoProfile(extraWeapon.weaponType);
          return `<button type="button" class="card-info-inline-chip" data-info-kind="extraWeapon" data-info-id="${extraWeapon.id || extraWeapon.weaponType}"><img src="${weaponInfo.icon}" alt="${weaponInfo.label}"><span>${weaponInfo.label}</span></button>`;
        }).join('')}</p>`
        : '';
      els.cardMetaInfoBody.innerHTML = `<p><strong>Resumen:</strong> ${factor.summary}</p>${buildMetaClassificationHtml(factor, 'factor')}${buildTagListHtml(factor.tags)}<p>${factor.descriptions?.[level] || factor.summary}</p>${pdaHtml}${hiddenSourceHtml}${sourceHtml}${extraWeaponDetailsHtml}`;
      bindInlineInfoButtons(els.cardMetaInfoBody, card);
    }
  } else if (kind === 'spellRule') {
    const rules = getSpellRules(card);
    const rule = id === 'target' ? rules.target : rules.user;
    const isTarget = id === 'target';
    const label = getSpellRuleStandardLabel(isTarget ? 'target' : 'user', rule);
    const title = isTarget ? 'Objetivos del hechizo' : 'Usuarios del hechizo';
    const letter = isTarget ? 'O' : 'U';
    if (els.cardMetaInfoIcon) els.cardMetaInfoIcon.innerHTML = `<div class="meta-info-letter-icon meta-info-letter-icon-small">${letter}</div>`;
    if (els.cardMetaInfoTitle) els.cardMetaInfoTitle.textContent = title;
    if (els.cardMetaInfoCategory) els.cardMetaInfoCategory.textContent = rule?.mode === 'standard' ? `${label} · sin restricción especial registrada` : `${label} · restricción registrada`;
    if (els.cardMetaInfoBody) {
      const domainNames = (rule?.mandatory?.elements || rule?.elements || []).map(elementId => (DOMAIN_ART_DB[elementId] || DOMAIN_ART_DB.oscuridad).elementLabel);
      const cardTypeNames = (rule?.mandatory?.cardTypes || rule?.cardTypes || []).map(typeId => (CARD_TYPE_DB[typeId] || {}).label || typeId);
      const qualityIds = isTarget ? (rule?.qualities || []) : (rule?.casterQualities || []);
      const qualityNames = qualityIds.map(q => getQualityProfile(q)?.label || q);
      const customDescription = rule?.description || label;

      if (isTarget) {
        const mandatoryText = rule?.mode === 'standard'
          ? 'No hay requisitos obligatorios registrados para este objetivo.'
          : `Es obligatorio que el conjuro objetivo sea ${cardTypeNames.join(' o ') || 'una carta válida'} de dominio ${domainNames.join(' o ') || 'válido'}.`;
        const possibleText = qualityNames.length
          ? `Los objetivos que tendrán la posibilidad de aprovechar este hechizo serán: ${qualityNames.join(', ')}.`
          : 'No hay cualidades posibles adicionales registradas.';
        els.cardMetaInfoBody.innerHTML = `<p><strong>Resumen:</strong> ${customDescription}</p><p><strong>Requisito obligatorio:</strong> ${mandatoryText}</p><p><strong>Objetivos posibles:</strong> ${possibleText}</p>${buildTagListHtml(['hechizo', 'objetivo', 'restricción'])}`;
      } else {
        const userModeText = rule?.requirementMode === 'any'
          ? 'Cumple si el Kaster tiene al menos una de estas condiciones.'
          : 'Debe cumplir todas las condiciones registradas.';
        const userReq = [
          domainNames.length ? `dominio ${domainNames.join(' o ')}` : '',
          qualityNames.length ? `cualidad ${qualityNames.join(' o ')}` : '',
        ].filter(Boolean).join(' y/o ');
        els.cardMetaInfoBody.innerHTML = `<p><strong>Resumen:</strong> ${customDescription}</p><p><strong>Requisito de usuario:</strong> ${userReq || 'Usuario estándar'}.</p><p><strong>Modo:</strong> ${userModeText}</p>${buildTagListHtml(['hechizo', 'usuario', 'caster', 'restricción'])}`;
      }
    }
  } else if (kind === 'ability') {
    const ability = getAbilityProfile(id);
    const runtimeName = card?.name || 'esta invocación';
    const description = String(ability.description || '').replaceAll('{unitName}', runtimeName);
    if (els.cardMetaInfoIcon) els.cardMetaInfoIcon.innerHTML = `<img src="${ability.icon}" alt="${ability.label}">`;
    if (els.cardMetaInfoTitle) els.cardMetaInfoTitle.textContent = `Habilidad: ${ability.label}`;
    if (els.cardMetaInfoCategory) els.cardMetaInfoCategory.textContent = getMetaClassificationText(ability, 'ability');
    if (els.cardMetaInfoBody) {
      const sourceQuality = id === 'stalk' ? getQualityProfile(extra?.sourceQuality || extra?.infoSourceId || 'stalker') : null;
      const sourceHtml = sourceQuality ? `<p><strong>Otorgada por:</strong> <button type="button" class="card-info-inline-chip" data-info-kind="quality" data-info-id="${sourceQuality.id}"><img src="${sourceQuality.icon}" alt="${sourceQuality.label}"><span>${sourceQuality.label}</span></button></p>` : '';
      const completeMovementChip = id === 'stalk'
        ? `<p><strong>Movilidad concedida:</strong> <button type="button" class="card-info-inline-chip" data-info-kind="movementType" data-info-id="complete" data-info-source-kind="ability" data-info-source-id="stalk"><img src="${MOVEMENT_TYPE_DB.complete.icon}" alt="Movilidad completa"><span>Movilidad completa</span></button></p>`
        : '';
      els.cardMetaInfoBody.innerHTML = `<p><strong>Resumen:</strong> ${ability.summary}</p>${buildMetaClassificationHtml(ability, 'ability')}${buildTagListHtml(ability.tags)}<p>${description}</p>${sourceHtml}${completeMovementChip}`;
      bindInlineInfoButtons(els.cardMetaInfoBody, card);
    }
  } else if (kind === 'power') {
    const power = card?.power;
    if (!power) return;
    const runtimeBombs = card?.__runtime?.smokeBombsLeft;
    if (els.cardMetaInfoIcon) els.cardMetaInfoIcon.innerHTML = `<img src="${SMOKE_BOMB_ICON_ASSET}" alt="${power.name}">`;
    if (els.cardMetaInfoTitle) els.cardMetaInfoTitle.textContent = `Poder: ${power.name}`;
    if (els.cardMetaInfoCategory) els.cardMetaInfoCategory.textContent = getPowerClassificationText(power, card);
    if (els.cardMetaInfoBody) {
      const bombsHtml = runtimeBombs != null ? `<p><strong>Bombas disponibles en arena:</strong> <button type="button" class="card-info-inline-chip" data-info-kind="weapon" data-info-id="smokeBomb"><img src="${SMOKE_BOMB_ICON_ASSET}" alt="Bomba de humo"><span>${runtimeBombs}</span></button></p>` : '';
      if (power.id === 'kageNoMichi') {
        els.cardMetaInfoBody.innerHTML = `
          <p><strong>Resumen:</strong> ${power.summary}</p>
          ${buildMetaClassificationHtml(power, 'power', { includeModes: false })}
          ${buildTagListHtml(['hechizo', 'oscuridad', 'niebla', 'ocultamiento', 'campo'])}
          <p><strong>Efecto:</strong> crea una línea de niebla desde la casilla frontal del Kaster hasta la zona de riesgo rival. Las invocaciones válidas dentro del camino obtienen ocultamiento, +1 daño y mejoran a 6 PDA los factores otorgados por Asesino que usen PDA.</p>
          <p><strong>Duración:</strong> 9 fases.</p>`;
      } else {
        els.cardMetaInfoBody.innerHTML = `
          <p><strong>Resumen:</strong> ${power.summary || 'Poder activo y pasivo de humo y sigilo.'}</p>
          ${buildMetaClassificationHtml(power, 'power', { includeModes: getCardTypeId(card) !== 'spell' })}
          ${buildTagListHtml(['poder', 'ninja', 'humo', 'oculto', 'familia'])}
          <p><strong>I. Activo.</strong> Naito sutoka inicia con 3 <button type="button" class="card-info-inline-chip" data-info-kind="weapon" data-info-id="smokeBomb"><img src="${SMOKE_BOMB_ICON_ASSET}" alt="Bomba de humo"><span>Bombas de humo</span></button> que podrá lanzar. Lanzar una bomba de humo crea una cortina de humo con radio 3 casillas a partir de su casilla de impacto. Estar dentro de esa cortina hará que Naito sutoka y cualquier <button type="button" class="card-info-inline-chip" data-info-kind="family" data-info-id="ninja"><span>Ninja ★</span></button> aliado utilicen <button type="button" class="card-info-inline-chip" data-info-kind="factor" data-info-id="hidden"><img src="${HIDDEN_FACTOR_ICON_ASSET}" alt="Oculto"><span>Oculto</span></button>. La distancia de lanzamiento de una bomba es de radio 3 casillas y la cortina dura 6 fases completas.</p>
          <p><strong>II. Pasivo · Familia.</strong> Cualquier <button type="button" class="card-info-inline-chip" data-info-kind="family" data-info-id="ninja"><span>Ninja ★</span></button> aliado dentro de la cortina de una <button type="button" class="card-info-inline-chip" data-info-kind="weapon" data-info-id="smokeBomb"><img src="${SMOKE_BOMB_ICON_ASSET}" alt="Bomba de humo"><span>Bomba de humo</span></button> de Naito sutoka puede beneficiarse de <button type="button" class="card-info-inline-chip" data-info-kind="factor" data-info-id="hidden"><img src="${HIDDEN_FACTOR_ICON_ASSET}" alt="Oculto"><span>Oculto</span></button>. Solo Naito puede lanzar bombas y consumir sus cargas.</p>
          ${bombsHtml}`;
      }
      bindInlineInfoButtons(els.cardMetaInfoBody, card);
    }
  } else if (kind === 'family') {
    const familyId = id || 'general';
    const label = familyId === 'ninja' ? 'Familia Ninja' : `Familia ${familyId}`;
    if (els.cardMetaInfoIcon) els.cardMetaInfoIcon.innerHTML = `<div class="meta-info-letter-icon meta-info-letter-icon-small">★</div>`;
    if (els.cardMetaInfoTitle) els.cardMetaInfoTitle.textContent = label;
    if (els.cardMetaInfoCategory) els.cardMetaInfoCategory.textContent = 'Sinergia de familia';
    if (els.cardMetaInfoBody) {
      els.cardMetaInfoBody.innerHTML = familyId === 'ninja'
        ? `<p><strong>Resumen:</strong> La familia Ninja agrupa invocaciones de sigilo, movilidad y táctica oportunista.</p>${buildTagListHtml(['familia', 'ninja', 'sinergia', 'movilidad', 'sigilo'])}<p>Cuando Naito Sutoka está en la arena, cualquier Ninja aliado puede beneficiarse de sus bombas de humo. Los Ninjas aliados que permanezcan dentro de la cortina de humo obtienen <button type="button" class="card-info-inline-chip" data-info-kind="factor" data-info-id="hidden"><img src="${HIDDEN_FACTOR_ICON_ASSET}" alt="Oculto"><span>Oculto</span></button> mientras no revelen su posición con una acción dirigida.</p>`
        : `<p><strong>Resumen:</strong> Esta familia define una sinergia compartida entre cartas relacionadas.</p>`;
      bindInlineInfoButtons(els.cardMetaInfoBody, card);
    }
  } else if (kind === 'weaponDetail') {
    const weapon = getWeaponInfoProfile(id);
    const damageNature = card ? getDamageNatureProfile(card) : null;
    const profile = card ? getAttackProfile(card) : null;
    const modeId = profile?.combatMode || profile?.type || 'melee';
    const mode = COMBAT_MODE_DB[modeId] || COMBAT_MODE_DB.melee;
    if (els.cardMetaInfoIcon) els.cardMetaInfoIcon.innerHTML = `<img src="${weapon.icon}" alt="${weapon.label}">`;
    if (els.cardMetaInfoTitle) els.cardMetaInfoTitle.textContent = `Arma: ${weapon.label}`;
    if (els.cardMetaInfoCategory) els.cardMetaInfoCategory.textContent = getMetaClassificationText({ ...weapon, classification: { applicationModes: [], applicationTags: [], natures: [damageNature?.id || 'physical'], functionalCategories: ['offensive'] } }, 'weapon', { includeModes: false });
    if (els.cardMetaInfoBody) {
      els.cardMetaInfoBody.innerHTML = buildWeaponDetailHtml(weapon, card);
      bindInlineInfoButtons(els.cardMetaInfoBody, card);
    }
  } else if (kind === 'weapon') {
    const weapon = getWeaponInfoProfile(id);
    if (id === 'smokeBomb') {
      if (els.cardMetaInfoIcon) els.cardMetaInfoIcon.innerHTML = `<img src="${weapon.icon}" alt="${weapon.label}">`;
      if (els.cardMetaInfoTitle) els.cardMetaInfoTitle.textContent = `Arma / especial: ${weapon.label}`;
      if (els.cardMetaInfoCategory) els.cardMetaInfoCategory.textContent = getMetaClassificationText({ ...weapon, classification: { applicationModes: [], applicationTags: ['cost'], natures: ['tactical', 'virtual'], functionalCategories: ['concealment', 'support', 'fieldAlteration'] } }, 'weapon', { includeModes: false });
      if (els.cardMetaInfoBody) {
        els.cardMetaInfoBody.innerHTML = `<p><strong>Resumen:</strong> ${weapon.summary}</p>${buildTagListHtml(weapon.tags)}<p>${weapon.description}</p><p><strong>Aplicación táctica:</strong> No causa daño. Se lanza hasta 3 casillas, deja una cortina de humo de radio 3 y permite que Naito sutoka o un Ninja aliado dentro del área use <button type="button" class="card-info-inline-chip" data-info-kind="factor" data-info-id="hidden"><img src="${HIDDEN_FACTOR_ICON_ASSET}" alt="Oculto"><span>Oculto</span></button>.</p><p><strong>Consumo:</strong> consume 1 carga del contador de bombas de humo de Naito sutoka.</p>`;
        bindInlineInfoButtons(els.cardMetaInfoBody, card);
      }
      return;
    }
    const damageNature = card ? getDamageNatureProfile(card) : null;
    if (els.cardMetaInfoIcon) els.cardMetaInfoIcon.innerHTML = `<img src="${weapon.icon}" alt="${weapon.label}">`;
    if (els.cardMetaInfoTitle) els.cardMetaInfoTitle.textContent = `Arma / ataque: ${weapon.label}`;
    if (els.cardMetaInfoCategory) els.cardMetaInfoCategory.textContent = getMetaClassificationText({ ...weapon, classification: { applicationModes: [], applicationTags: [], natures: [damageNature?.id || 'physical'], functionalCategories: ['offensive'] } }, 'weapon', { includeModes: false });
    if (els.cardMetaInfoBody) {
      els.cardMetaInfoBody.innerHTML = buildWeaponInfoHtml(weapon, card);
      bindInlineInfoButtons(els.cardMetaInfoBody, card);
    }
  } else if (kind === 'extraWeapon') {
    const extraWeapon = getExtraWeaponProfile(card, id);
    const extraCard = buildExtraWeaponCard(card, id);
    const extraWeaponInfo = extraWeapon ? getWeaponInfoProfile(extraWeapon.weaponType) : null;
    const sourceFactor = extraWeapon ? getFactorProfile(extraWeapon.sourceFactor || 'extraWeapon') : null;
    const sourceId = extraWeapon ? getExtraWeaponSourceId(extraWeapon) : '';
    const sourceProfile = sourceId ? getMetaSourceProfile(sourceId) : null;
    if (!extraWeapon || !extraCard || !extraWeaponInfo) return;
    if (els.cardMetaInfoIcon) els.cardMetaInfoIcon.innerHTML = `<img src="${extraWeaponInfo.icon}" alt="${extraWeaponInfo.label}">`;
    if (els.cardMetaInfoTitle) els.cardMetaInfoTitle.textContent = `Arma extra: ${extraWeaponInfo.label}`;
    if (els.cardMetaInfoCategory) els.cardMetaInfoCategory.textContent = getMetaClassificationText({ ...extraWeaponInfo, classification: { applicationModes: [], applicationTags: [], natures: ['physical'], functionalCategories: ['offensive'] } }, 'weapon', { includeModes: false });
    if (els.cardMetaInfoBody) {
      const sourceFactorHtml = sourceFactor ? `<p><strong>Proviene del factor:</strong> <button type="button" class="card-info-inline-chip" data-info-kind="factor" data-info-id="${sourceFactor.id}" data-factor-source="${sourceId}"><img src="${sourceFactor.icon}" alt="${sourceFactor.label}"><span>${sourceFactor.label}</span></button></p>` : '';
      const sourceProfileHtml = sourceProfile ? `<p><strong>Factor habilitado por:</strong> <button type="button" class="card-info-inline-chip" data-info-kind="${sourceProfile.kind}" data-info-id="${sourceProfile.id}"><img src="${sourceProfile.icon || getRaceIcon(card, sourceProfile.id)}" alt="${sourceProfile.label}"><span>${sourceProfile.label}</span></button></p>` : '';
      els.cardMetaInfoBody.innerHTML = `<p><strong>Resumen:</strong> ${extraWeaponInfo.summary}</p>${buildTagListHtml(['arma extra', 'espada', 'cuerpo a cuerpo', 'precisión alta'])}<p>${extraWeaponInfo.description}</p>${sourceFactorHtml}${sourceProfileHtml}${buildAttackPreviewHtml(extraCard)}`;
      bindInlineInfoButtons(els.cardMetaInfoBody, extraCard);
    }
  } else if (kind === 'baseAttack') {
    const baseCard = getBaseAttackCard(card);
    const baseWeapon = getWeaponProfile(baseCard);
    const baseNature = getDamageNatureProfile(baseCard);
    if (els.cardMetaInfoIcon) els.cardMetaInfoIcon.innerHTML = `<img src="${baseWeapon.icon}" alt="${baseWeapon.label}">`;
    if (els.cardMetaInfoTitle) els.cardMetaInfoTitle.textContent = `Daño base: ${baseWeapon.label}`;
    if (els.cardMetaInfoCategory) els.cardMetaInfoCategory.textContent = getMetaClassificationText({ classification: { applicationModes: [], applicationTags: [], natures: [baseNature.id || 'physical'], functionalCategories: ['offensive'] } }, 'weapon', { includeModes: false });
    if (els.cardMetaInfoBody) {
      els.cardMetaInfoBody.innerHTML = `<p><strong>Resumen:</strong> ${card?.name || 'Esta carta'} conserva ${baseWeapon.label} como daño base si pierde su arma principal.</p>${buildTagListHtml(['daño base', 'respaldo ofensivo', 'sin arma', baseWeapon.label.toLowerCase(), baseNature.label.toLowerCase()])}<p>El daño base define cómo sigue atacando la carta cuando ya no dispone de su arma principal. Esta capa ofensiva conserva su propia estructura de daño, modo de combate, aplicación, alcance y precisión.</p>${buildAttackPreviewHtml(baseCard)}<p><strong>Referencia:</strong> Esta configuración base entra a funcionar cuando la carta pierde el arma equipada o cuando un efecto obliga a usar su ofensiva nativa.</p>`;
      bindInlineInfoButtons(els.cardMetaInfoBody, baseCard);
    }
  } else if (kind === 'combatMode') {
    const mode = COMBAT_MODE_DB[id] || COMBAT_MODE_DB.melee;
    if (els.cardMetaInfoIcon) els.cardMetaInfoIcon.innerHTML = `<img src="${mode.icon}" alt="${mode.label}">`;
    if (els.cardMetaInfoTitle) els.cardMetaInfoTitle.textContent = `Modo de combate: ${mode.label}`;
    if (els.cardMetaInfoCategory) els.cardMetaInfoCategory.textContent = `Enfoque: ${mode.focus}`;
    if (els.cardMetaInfoBody) els.cardMetaInfoBody.innerHTML = `<p><strong>Resumen:</strong> ${mode.summary}</p>${buildTagListHtml(mode.tags)}<p>${mode.description}</p>`;
  } else if (kind === 'damageApplication') {
    const app = DAMAGE_APPLICATION_DB[id] || DAMAGE_APPLICATION_DB.oscillationPartial;
    if (els.cardMetaInfoIcon) els.cardMetaInfoIcon.innerHTML = `<img src="${app.icon}" alt="${app.label}">`;
    if (els.cardMetaInfoTitle) els.cardMetaInfoTitle.textContent = `Aplicación de daño: ${app.label}`;
    if (els.cardMetaInfoCategory) els.cardMetaInfoCategory.textContent = `Enfoque: ${app.focus}`;
    if (els.cardMetaInfoBody) els.cardMetaInfoBody.innerHTML = `<p><strong>Resumen:</strong> ${app.summary}</p>${buildTagListHtml(app.tags)}<p>${app.description}</p>`;
  } else if (kind === 'damageNature') {
    const nature = DAMAGE_NATURE_DB[id] || DAMAGE_NATURE_DB.physical;
    if (els.cardMetaInfoIcon) els.cardMetaInfoIcon.innerHTML = `<div class="meta-info-letter-icon">${nature.letter}</div>`;
    if (els.cardMetaInfoTitle) els.cardMetaInfoTitle.textContent = `Tipo de daño: ${nature.label}`;
    if (els.cardMetaInfoCategory) els.cardMetaInfoCategory.textContent = `Enfoque: ${nature.focus}`;
    if (els.cardMetaInfoBody) els.cardMetaInfoBody.innerHTML = `<p><strong>Resumen:</strong> ${nature.summary}</p>${buildTagListHtml(nature.tags)}<p>${nature.description}</p>`;
  } else if (kind === 'attackRange') {
    const info = getAttackRangeMeta(card);
    if (els.cardMetaInfoIcon) els.cardMetaInfoIcon.innerHTML = `<img src="${info.icon}" alt="Alcance">`;
    if (els.cardMetaInfoTitle) els.cardMetaInfoTitle.textContent = info.label;
    if (els.cardMetaInfoCategory) els.cardMetaInfoCategory.textContent = `Enfoque: ${info.focus}`;
    if (els.cardMetaInfoBody) els.cardMetaInfoBody.innerHTML = `<p><strong>Resumen:</strong> ${info.summary}</p>${buildTagListHtml(info.tags)}<p>${info.description}</p>`;
  } else if (kind === 'attackPrecision') {
    const info = getAttackPrecisionMeta(card);
    if (els.cardMetaInfoIcon) els.cardMetaInfoIcon.innerHTML = `<img src="${info.icon}" alt="Precisión">`;
    if (els.cardMetaInfoTitle) els.cardMetaInfoTitle.textContent = info.label;
    if (els.cardMetaInfoCategory) els.cardMetaInfoCategory.textContent = `Enfoque: ${info.focus}`;
    if (els.cardMetaInfoBody) els.cardMetaInfoBody.innerHTML = `<p><strong>Resumen:</strong> ${info.summary}</p>${buildTagListHtml(info.tags)}<p>${info.description}</p>`;
  } else if (kind === 'attackModifier') {
    const modifier = ATTACK_MODIFIER_DB[id] || { label: id, focus: 'Modificador ofensivo', tags: ['modificador ofensivo', id], summary: `La carta usa ${id} como modificador.`, description: `Este ataque incluye el modificador ${id}.` };
    if (els.cardMetaInfoIcon) els.cardMetaInfoIcon.innerHTML = `<div class="meta-info-letter-icon meta-info-letter-icon-small">${modifier.label.slice(0,2).toUpperCase()}</div>`;
    if (els.cardMetaInfoTitle) els.cardMetaInfoTitle.textContent = `Modificador ofensivo: ${modifier.label}`;
    if (els.cardMetaInfoCategory) els.cardMetaInfoCategory.textContent = `Enfoque: ${modifier.focus}`;
    if (els.cardMetaInfoBody) els.cardMetaInfoBody.innerHTML = `<p><strong>Resumen:</strong> ${modifier.summary}</p>${buildTagListHtml(modifier.tags)}<p>${modifier.description}</p>`;
  } else if (kind === 'lifeStat') {
    const maxLife = Number(card?.stats?.life ?? card?.stats?.def ?? 0);
    if (els.cardMetaInfoIcon) els.cardMetaInfoIcon.innerHTML = `<div class="meta-info-heart-icon-wrap"><span class="unit-heart-icon meta-info-heart-icon" aria-hidden="true"></span></div>`;
    if (els.cardMetaInfoTitle) els.cardMetaInfoTitle.textContent = 'Vida base máxima';
    if (els.cardMetaInfoCategory) els.cardMetaInfoCategory.textContent = `Valor base: ${maxLife}`;
    if (els.cardMetaInfoBody) els.cardMetaInfoBody.innerHTML = `<p><strong>Resumen:</strong> Esta carta tiene ${maxLife} de vida base máxima.</p>${buildTagListHtml(['vida', 'máximo base', 'supervivencia', 'límite natural', 'estadística primaria'])}<p>La vida mostrada en esta línea representa el máximo nativo de la invocación. Ese valor define hasta dónde puede recuperarse de forma normal. Si la carta recibe aumentos temporales o permanentes de vida máxima, esos bonos deben mostrarse aparte como sumas adicionales y no fusionarse con el máximo base.</p><p><strong>Referencia actual:</strong> Kagero parte de ${maxLife} como vida base máxima.</p>`;
  } else if (kind === 'castCost') {
    const summary = getCardCostSummary(card);
    const total = getCardTotalCost(card);
    const elementId = getCardElementId(card);
    const elementLabel = (ELEMENTS.find(el => el.id === elementId)?.label) || elementId;
    if (els.cardMetaInfoIcon) els.cardMetaInfoIcon.innerHTML = `<img src="${getElementCostIcon('random')}" alt="Costo">`;
    if (els.cardMetaInfoTitle) els.cardMetaInfoTitle.textContent = 'Costo de la carta';
    if (els.cardMetaInfoCategory) els.cardMetaInfoCategory.textContent = `Costo total: ${total} · Distribución: ${summary}`;
    if (els.cardMetaInfoBody) els.cardMetaInfoBody.innerHTML = `<p><strong>Resumen:</strong> Esta carta cuesta ${total} recurso${total === 1 ? '' : 's'} para ser kasteada.</p>${buildTagListHtml(['costo', 'kasteo', 'dominio base', 'aleatorio', 'recursos'])}<p><strong>Distribución actual:</strong> ${getCardCostSummary(card)}</p><p>Primero se cubre el costo fijo del dominio base. Después, si la carta tiene costo aleatorio, esa parte se paga con cualquier elemento disponible restante, incluyendo recursos sobrantes del mismo dominio base.</p>`;
  } else if (kind === 'castTime') {
    const castTime = Number(card?.castPhases ?? 0);
    if (els.cardMetaInfoIcon) els.cardMetaInfoIcon.innerHTML = `<div class="meta-info-svg-wrap">${CAST_ENTRY_ICON_INLINE_SVG}</div>`;
    if (els.cardMetaInfoTitle) els.cardMetaInfoTitle.textContent = 'Tiempo de kasteo';
    if (els.cardMetaInfoCategory) els.cardMetaInfoCategory.textContent = `Valor base: ${castTime} fase${castTime === 1 ? '' : 's'}`;
    if (els.cardMetaInfoBody) els.cardMetaInfoBody.innerHTML = `<p><strong>Resumen:</strong> Esta carta requiere ${castTime} fase${castTime === 1 ? '' : 's'} para completar su kasteo.</p>${buildTagListHtml(['kasteo', 'tempo', 'cola', 'fases', 'entrada a la arena'])}<p>El tiempo de kasteo define cuántas fases deben pasar antes de que la invocación materialice su ficha en la arena. En la lógica actual del juego, el kaster procesa su cola de forma secuencial: solo una carta puede estar en kasteo activo al mismo tiempo y las demás esperan su turno.</p>`;
  } else if (kind === 'restoreTime') {
    const restoreTime = Number(card?.stats?.restore ?? 0);
    if (els.cardMetaInfoIcon) els.cardMetaInfoIcon.innerHTML = `<div class="meta-info-svg-wrap">${RESTORE_ICON_INLINE_SVG}</div>`;
    if (els.cardMetaInfoTitle) els.cardMetaInfoTitle.textContent = 'Tiempo de restauración';
    if (els.cardMetaInfoCategory) els.cardMetaInfoCategory.textContent = `Valor base: ${restoreTime} fase${restoreTime === 1 ? '' : 's'}`;
    if (els.cardMetaInfoBody) els.cardMetaInfoBody.innerHTML = `<p><strong>Resumen:</strong> Esta carta necesita ${restoreTime} fase${restoreTime === 1 ? '' : 's'} para salir de restauración.</p>${buildTagListHtml(['restauración', 'reciclaje', 'reingreso', 'tempo', 'respawn'])}<p>Cuando una invocación es destruida, vuelve a su punto de restauración y entra en espera antes de poder reincorporarse al ciclo del Spellbook. Este valor mide el tiempo base de recuperación de la carta antes de quedar otra vez disponible para ser usada.</p>`;
  } else if (kind === 'movementType') {
    const movement = getMovementProfile(id || card?.movementType || 'basic');
    if (els.cardMetaInfoIcon) els.cardMetaInfoIcon.innerHTML = `<img src="${movement.icon}" alt="${movement.label}">`;
    if (els.cardMetaInfoTitle) els.cardMetaInfoTitle.textContent = `Movilidad: ${movement.label}`;
    if (els.cardMetaInfoCategory) els.cardMetaInfoCategory.textContent = `Enfoque: ${movement.focus}`;
    if (els.cardMetaInfoBody) {
      const sourceAbilityId = extra?.sourceKind === 'ability' ? extra?.sourceId : extra?.infoSourceKind === 'ability' ? extra?.infoSourceId : '';
      const sourceAbility = sourceAbilityId ? getAbilityProfile(sourceAbilityId) : null;
      const sourceHtml = sourceAbility ? `<p><strong>Otorgada por:</strong> <button type="button" class="card-info-inline-chip" data-info-kind="ability" data-info-id="${sourceAbility.id}"><img src="${sourceAbility.icon}" alt="${sourceAbility.label}"><span>${sourceAbility.label}</span></button></p>` : '';
      const completeExtra = movement.id === 'complete' ? `<p><strong>Regla:</strong> La invocación puede moverse libremente en todas las direcciones posibles de la arena mientras tenga velocidad disponible.</p>` : '';
      els.cardMetaInfoBody.innerHTML = `<p><strong>Resumen:</strong> ${movement.summary}</p>${buildTagListHtml(movement.tags)}<p>${movement.description}</p>${sourceHtml}${completeExtra}`;
    }
  } else if (kind === 'speedStat') {
    const speed = Number(card?.stats?.mov ?? 0);
    if (els.cardMetaInfoIcon) els.cardMetaInfoIcon.innerHTML = `<img src="assets/icons/factor-velocidad.svg" alt="Velocidad">`;
    if (els.cardMetaInfoTitle) els.cardMetaInfoTitle.textContent = `Velocidad ${speed}`;
    if (els.cardMetaInfoCategory) els.cardMetaInfoCategory.textContent = 'Estadística de desplazamiento';
    if (els.cardMetaInfoBody) els.cardMetaInfoBody.innerHTML = `<p><strong>Resumen:</strong> Esta carta puede recorrer ${speed} casilla${speed === 1 ? '' : 's'} cuando tiene movimiento disponible.</p>${buildTagListHtml(['velocidad', 'desplazamiento', 'movilidad', 'arena'])}<p>La velocidad define cuántas casillas puede recorrer una invocación durante su movimiento. Se interpreta junto con el tipo de movilidad, porque no solo importa cuánto se mueve, sino hacia dónde puede hacerlo.</p>`;
  } else if (kind === 'biotype') {
    const biotype = getBiotypeProfile(id || getEffectiveBiotypeId(card));
    if (els.cardMetaInfoIcon) els.cardMetaInfoIcon.innerHTML = `<img src="${biotype.icon}" alt="${biotype.label}">`;
    if (els.cardMetaInfoTitle) els.cardMetaInfoTitle.textContent = `Biotipo: ${biotype.label}`;
    if (els.cardMetaInfoCategory) els.cardMetaInfoCategory.textContent = `Enfoque: ${biotype.focus}`;
    if (els.cardMetaInfoBody) els.cardMetaInfoBody.innerHTML = `<p><strong>Resumen:</strong> ${biotype.summary}</p>${buildTagListHtml(biotype.tags)}<p>${biotype.description}</p>`;
  } else if (kind === 'domain') {
    const domain = DOMAIN_ART_DB[id] || getDomainArtProfile(card);
    const info = getElementInfoProfile(id);
    if (els.cardMetaInfoIcon) {
      els.cardMetaInfoIcon.innerHTML = `
        <span class="meta-info-domain-stack">
          <span class="meta-info-domain-bg"></span>
          <img class="meta-info-domain-element" src="${domain.elementArt}" alt="${domain.elementLabel}">
          <img class="meta-info-domain-attribute" src="${domain.attributeArt}" alt="${domain.attributeLabel}">
        </span>`;
    }
    if (els.cardMetaInfoTitle) els.cardMetaInfoTitle.textContent = info.title;
    if (els.cardMetaInfoCategory) els.cardMetaInfoCategory.textContent = `Elemento: ${domain.elementLabel} · Atributo: ${domain.attributeLabel}`;
    if (els.cardMetaInfoBody) els.cardMetaInfoBody.innerHTML = buildElementInfoHtml(info);
    bindElementDetailButtons(info.id);
  }
  updateCardMetaInfoBackButton();
  els.cardMetaInfoOverlay.classList.add('open');
  els.cardMetaInfoOverlay.setAttribute('aria-hidden', 'false');
}

function closeCardMetaInfo() {
  if (!els.cardMetaInfoOverlay) return;
  state.cardMetaInfoHistory = [];
  state.cardMetaInfoCurrent = null;
  updateCardMetaInfoBackButton();
  els.cardMetaInfoOverlay.classList.remove('open');
  els.cardMetaInfoOverlay.setAttribute('aria-hidden', 'true');
}


function isSpellCard(card) {
  return getCardTypeId(card) === 'spell';
}

function getSpellRules(card) {
  const rules = card?.spellRules || {};
  return {
    user: rules.user || { mode: 'standard', label: 'Usuarios estándar', description: 'Cualquier Kaster válido puede lanzar este hechizo.' },
    target: rules.target || { mode: 'standard', label: 'Objetivos estándar', description: 'Este hechizo no tiene restricciones especiales de objetivo.' },
    castRequirements: rules.castRequirements || { traits: [] },
    consumable: rules.consumable !== false,
  };
}


function getCasterCardForPlayer(playerId) {
  const casterCardId = state.players[playerId]?.caster?.cardId;
  return CARD_LIBRARY[casterCardId] || null;
}

function canCasterUseSpell(playerId, card) {
  const rules = getSpellRules(card);
  const userRule = rules.user || {};
  if (userRule.mode !== 'restricted') return { ok: true };
  const casterCard = getCasterCardForPlayer(playerId);
  if (!casterCard) return { ok: false, message: 'No se encontró el Kaster usuario del hechizo.' };
  const requiredElements = Array.isArray(userRule.elements) ? userRule.elements : [];
  const requiredQualities = Array.isArray(userRule.casterQualities) ? userRule.casterQualities : [];
  const casterElement = getCardElementId(casterCard);
  const casterQualities = Array.isArray(casterCard.qualities) ? casterCard.qualities : [];
  const hasElement = requiredElements.length && requiredElements.includes(casterElement);
  const hasQuality = requiredQualities.length && casterQualities.some(q => requiredQualities.includes(q));
  const mode = userRule.requirementMode || 'all';
  const ok = mode === 'any'
    ? Boolean(hasElement || hasQuality || (!requiredElements.length && !requiredQualities.length))
    : ((!requiredElements.length || hasElement) && (!requiredQualities.length || hasQuality));
  if (ok) return { ok: true };
  const names = [
    ...requiredElements.map(elementId => (DOMAIN_ART_DB[elementId] || DOMAIN_ART_DB.oscuridad).elementLabel),
    ...requiredQualities.map(q => getQualityProfile(q)?.label || q),
  ];
  return { ok: false, message: `${card.name} requiere usuario ${names.join(' o ')}.` };
}


function getSpellRuleStandardLabel(kind, rule) {
  if (rule?.mode === 'standard') return 'Estándar';
  return rule?.label || (kind === 'user' ? 'Usuario' : 'Objetivo');
}

function renderSpellRuleRestrictionIcons(kind, rule) {
  if (!rule || rule.mode === 'standard') {
    return `<span class="card-info-value-chip card-info-spell-channel-value" title="${rule?.description || 'Sin restricción especial'}">Estándar</span>`;
  }

  const chips = [];
  const mandatory = rule.mandatory || {};
  const mandatoryElements = Array.isArray(mandatory.elements) ? mandatory.elements : [];
  const mandatoryCardTypes = Array.isArray(mandatory.cardTypes) ? mandatory.cardTypes : [];

  const addDomainChip = (elementId, isMandatory = false) => {
    const domain = DOMAIN_ART_DB[elementId] || DOMAIN_ART_DB.oscuridad;
    chips.push(`<button type="button" class="card-info-spell-restriction-chip card-info-spell-domain-restriction ${isMandatory ? 'mandatory' : 'optional'}" data-info-kind="domain" data-info-id="${elementId}" title="${isMandatory ? 'Requisito obligatorio' : 'Dominio'}: ${domain.elementLabel}">
      <span class="card-info-spell-domain-stack">
        <span class="card-info-spell-domain-bg"></span>
        <img class="card-info-spell-domain-element" src="${domain.elementArt}" alt="${domain.elementLabel}">
        <img class="card-info-spell-domain-attribute" src="${domain.attributeArt}" alt="${domain.attributeLabel}">
      </span>
    </button>`);
  };

  const addTypeChip = (typeId, isMandatory = false) => {
    const type = CARD_TYPE_DB[typeId] || CARD_TYPE_DB.invocation;
    chips.push(`<button type="button" class="card-info-spell-restriction-chip card-info-icon-chip ${isMandatory ? 'mandatory' : 'optional'}" data-info-kind="cardType" data-info-id="${type.id}" title="${isMandatory ? 'Requisito obligatorio' : 'Tipo'}: ${type.label}"><img src="${type.icon}" alt="${type.label}"></button>`);
  };

  mandatoryElements.forEach(elementId => addDomainChip(elementId, true));
  mandatoryCardTypes.forEach(typeId => addTypeChip(typeId, true));

  if (Array.isArray(rule.elements)) {
    rule.elements.filter(elementId => !mandatoryElements.includes(elementId)).forEach(elementId => addDomainChip(elementId, false));
  }
  if (Array.isArray(rule.cardTypes)) {
    rule.cardTypes.filter(typeId => !mandatoryCardTypes.includes(typeId)).forEach(typeId => addTypeChip(typeId, false));
  }
  if (Array.isArray(rule.casterQualities)) {
    rule.casterQualities.forEach(qualityId => {
      const quality = getQualityProfile(qualityId);
      if (quality) chips.push(`<button type="button" class="card-info-spell-restriction-chip card-info-icon-chip optional" data-info-kind="quality" data-info-id="${quality.id}" title="Cualidad requerida: ${quality.label}"><img src="${quality.icon}" alt="${quality.label}"></button>`);
    });
  }
  if (Array.isArray(rule.qualities)) {
    rule.qualities.forEach(qualityId => {
      const quality = getQualityProfile(qualityId);
      if (quality) chips.push(`<button type="button" class="card-info-spell-restriction-chip card-info-icon-chip optional" data-info-kind="quality" data-info-id="${quality.id}" title="Objetivo posible: ${quality.label}"><img src="${quality.icon}" alt="${quality.label}"></button>`);
    });
  }
  return `<span class="card-info-spell-channel-value card-info-spell-channel-icons" title="${rule.description || getSpellRuleStandardLabel(kind, rule)}">${chips.join('') || getSpellRuleStandardLabel(kind, rule)}</span>`;
}

function renderSpellRuleChip(kind, rule) {
  const label = getSpellRuleStandardLabel(kind, rule);
  const description = rule?.description || label;
  const iconText = kind === 'user' ? 'U' : 'O';
  const title = kind === 'user' ? 'Usuarios del hechizo' : 'Objetivos del hechizo';
  return `
    <div class="card-info-spell-channel card-info-spell-channel-${kind}">
      <button type="button" class="card-info-spell-channel-letter card-info-spell-rule-${kind}" data-info-kind="spellRule" data-info-id="${kind}" title="${title}: ${description}">${iconText}</button>
      <span class="card-info-spell-channel-arrow" aria-hidden="true">→</span>
      ${renderSpellRuleRestrictionIcons(kind, rule)}
    </div>`;
}

function renderSpellUserChip(card) {
  const rules = getSpellRules(card);
  return renderSpellRuleChip('user', rules.user);
}

function renderSpellTargetChip(card) {
  const rules = getSpellRules(card);
  return renderSpellRuleChip('target', rules.target);
}

function renderSpellTraitChips(card) {
  const traits = Array.isArray(getSpellRules(card).castRequirements?.traits) ? getSpellRules(card).castRequirements.traits : [];
  if (!traits.length) return '';
  return traits.map(trait => `<span class="card-info-value-chip card-info-spell-trait-chip" title="Rasgo de kasteo: ${trait}"><span>${trait}</span></span>`).join('');
}

function renderSpellInfoRows(card) {
  if (els.cardInfoDamage) {
    els.cardInfoDamage.innerHTML = `<div class="card-info-chip-stack card-info-chip-stack-spell-users">${renderSpellUserChip(card)}</div>`;
    bindInlineInfoButtons(els.cardInfoDamage, card);
  }
  if (els.cardInfoAttackType) els.cardInfoAttackType.innerHTML = '';
  if (els.cardInfoRange) els.cardInfoRange.innerHTML = '';
  if (els.cardInfoFactors) els.cardInfoFactors.innerHTML = '';

  if (els.cardInfoLife) {
    els.cardInfoLife.innerHTML = `<div class="card-info-chip-stack card-info-chip-stack-spell-targets">${renderSpellTargetChip(card)}</div>`;
    bindInlineInfoButtons(els.cardInfoLife, card);
  }
  if (els.cardInfoDefense) els.cardInfoDefense.innerHTML = '';

  if (els.cardInfoCost) {
    els.cardInfoCost.innerHTML = `<div class="card-info-chip-stack">${renderCardCostChip(card)}</div>`;
    bindInlineInfoButtons(els.cardInfoCost, card);
  }
  if (els.cardInfoCastTime) {
    const traits = renderSpellTraitChips(card);
    els.cardInfoCastTime.innerHTML = `<div class="card-info-chip-stack card-info-chip-stack-spell-cast">${renderCastTimeChip(card)}${traits}</div>`;
    bindInlineInfoButtons(els.cardInfoCastTime, card);
  }
  if (els.cardInfoRestoreTime) els.cardInfoRestoreTime.innerHTML = '';
  if (els.cardInfoMoveType) els.cardInfoMoveType.innerHTML = '';
  if (els.cardInfoMove) els.cardInfoMove.innerHTML = '';
  if (els.cardInfoBiotype) els.cardInfoBiotype.innerHTML = '';
}

function enforceDamageApplicationVisibility(card, root = els.cardInfoOverlay) {
  if (!root) return;
  const visible = hasExplicitDamageApplication(card);
  root.classList.toggle('has-damage-application', visible);
  root.classList.toggle('no-damage-application', !visible);
  if (!visible) {
    root.querySelectorAll('[data-info-kind="damageApplication"]').forEach(node => node.remove());
  }
}

function openCardInfo(cardId, slotIndex, tab, meta = {}) {
  const baseCard = CARD_LIBRARY[cardId];
  if (!baseCard || !els.cardInfoOverlay) return;
  const card = buildCardInfoViewModel(baseCard, meta);
  const isSpell = isSpellCard(card);

  state.infoCard = { cardId, slotIndex, tab, ...meta };
  els.cardInfoPreview.innerHTML = '';
  els.cardInfoPreview.appendChild(createCardElement(card));
  els.cardInfoPreview.appendChild(createCardDomainElement(card));
  bindCardInfoName(card);
  setCardInfoType(getCardTypeId(card));
  renderCardInfoMeta(card);
  renderCardInfoSummaryTags(card);
  renderCardAbilityPowerPanel(card);
  els.cardInfoOverlay.classList.toggle('spell-card-info', isSpell);
  if (isSpell) {
    renderSpellInfoRows(card);
    enforceDamageApplicationVisibility(card);
    els.cardInfoOverlay.classList.add('open');
    els.cardInfoOverlay.setAttribute('aria-hidden', 'false');
    updateCardInfoAction();
    log(`${card.name}: vista de hechizo abierta.`);
    return;
  }
  const profile = getAttackProfile(card);
  const weapon = getWeaponProfile(card);
  if (els.cardInfoDamage) {
    els.cardInfoDamage.innerHTML = `<div class="card-info-chip-stack card-info-chip-stack-damage">${renderWeaponDamageChip(card)}</div>`;
    bindInlineInfoButtons(els.cardInfoDamage, card);
  }
  if (els.cardInfoLife) {
    els.cardInfoLife.innerHTML = `<div class="card-info-chip-stack">${renderLifeBaseChip(card)}</div>`;
    bindInlineInfoButtons(els.cardInfoLife, card);
  }
  if (els.cardInfoDefense) els.cardInfoDefense.innerHTML = Number(card.stats?.def ?? 0) > 0 ? `<div class="card-info-chip-stack"><button type="button" class="card-info-value-chip" data-info-kind="defenseStat" data-info-id="defense" title="Defensa: ${card.stats.def}"><span class="card-info-value-chip-key">DEF</span><span>${card.stats.def}</span></button></div>` : '';
  if (els.cardInfoAttackType) {
    els.cardInfoAttackType.innerHTML = `<div class="card-info-chip-stack">${renderCombatModeChip(card)}${renderDamageApplicationChip(card)}</div>`;
    bindInlineInfoButtons(els.cardInfoAttackType, card);
  }
  if (els.cardInfoRange) {
    els.cardInfoRange.innerHTML = `<div class="card-info-chip-stack card-info-chip-stack-range">${renderAttackRangeChip(card)}${renderAttackPrecisionChip(card)}</div>`;
    bindInlineInfoButtons(els.cardInfoRange, card);
  }
  if (els.cardInfoFactors) {
    const attackFactors = getCardAttackFactors(card);
    const runtimeFactors = Array.isArray(card?.__runtime?.activeFactors) ? card.__runtime.activeFactors : [];
    const factorChips = [...attackFactors, ...runtimeFactors].map(factorEntry => renderFactorChip(factorEntry, card)).join('');
    els.cardInfoFactors.innerHTML = factorChips ? `<div class="card-info-chip-stack card-info-chip-stack-factors">${factorChips}</div>` : '';
    bindInlineInfoButtons(els.cardInfoFactors, card);
  }
  if (els.cardInfoMoveType) {
    els.cardInfoMoveType.innerHTML = `<div class="card-info-chip-stack">${renderMovementTypeChip(card)}</div>`;
    bindInlineInfoButtons(els.cardInfoMoveType, card);
  }
  if (els.cardInfoMove) {
    els.cardInfoMove.innerHTML = `<div class="card-info-chip-stack">${renderSpeedChip(card)}</div>`;
    bindInlineInfoButtons(els.cardInfoMove, card);
  }
  if (els.cardInfoBiotype) {
    els.cardInfoBiotype.innerHTML = `<div class="card-info-chip-stack">${renderBiotypeChip(card)}</div>`;
    bindInlineInfoButtons(els.cardInfoBiotype, card);
  }
  if (els.cardInfoCost) {
    els.cardInfoCost.innerHTML = `<div class="card-info-chip-stack">${renderCardCostChip(card)}</div>`;
    bindInlineInfoButtons(els.cardInfoCost, card);
  }
  if (els.cardInfoCastTime) {
    els.cardInfoCastTime.innerHTML = `<div class="card-info-chip-stack">${renderCastTimeChip(card)}</div>`;
    bindInlineInfoButtons(els.cardInfoCastTime, card);
  }
  if (els.cardInfoRestoreTime) {
    const restoreTimeChip = renderRestoreTimeChip(card);
    els.cardInfoRestoreTime.innerHTML = restoreTimeChip ? `<div class="card-info-chip-stack">${restoreTimeChip}</div>` : '';
    bindInlineInfoButtons(els.cardInfoRestoreTime, card);
  }
  enforceDamageApplicationVisibility(card);
  els.cardInfoOverlay.classList.add('open');
  els.cardInfoOverlay.setAttribute('aria-hidden', 'false');
  updateCardInfoAction();
  log(`${card.name}: vista de carta abierta.`);
}

function openKasterInfo(playerId) {
  if (!els.cardInfoOverlay) return;
  const caster = state.players[playerId].caster;
  const casterDef = getCasterDefinition(caster);
  const elementId = getCasterDomainId(caster) || state.players[playerId]?.elementId || 'oscuridad';
  const casterName = getCasterDisplayName(caster, `Kaster J${playerId}`);
  const entityCard = casterDef?.cardId && CARD_LIBRARY[casterDef.cardId]
    ? CARD_LIBRARY[casterDef.cardId]
    : createInfoEntityCard({
      id: `kasterJ${playerId}`,
      name: casterName,
      type: 'kaster',
      artImage: getCasterArtImage(caster),
      elementId,
    });
  state.infoCard = { source: 'kaster', playerId };
  els.cardInfoPreview.innerHTML = '';
  els.cardInfoPreview.appendChild(createCardElement(entityCard, { elementIdOverride: elementId, hideCost: true }));
  els.cardInfoPreview.appendChild(createCardDomainElement(entityCard));
  bindCardInfoName(entityCard);
  const statusLabel = isCasterInOwnSide(playerId) ? 'Kaster · zona aliada' : 'Kaster · zona enemiga: recibe 1 daño por fase';
  setCardInfoType('kaster', statusLabel);
  renderCardInfoMeta(entityCard);
  if (els.cardInfoSummaryTags) els.cardInfoSummaryTags.innerHTML = '';
  if (els.cardInfoExtraPanel) els.cardInfoExtraPanel.innerHTML = '';
  if (els.cardInfoSummaryTags) els.cardInfoSummaryTags.innerHTML = '';
  if (els.cardInfoExtraPanel) els.cardInfoExtraPanel.innerHTML = '';
  els.cardInfoDamage.textContent = caster.atk ?? 0;
  els.cardInfoLife.textContent = `${caster.life ?? 30}/${caster.maxLife ?? 30}`;
  if (els.cardInfoDefense) els.cardInfoDefense.textContent = caster.def ?? 0;
  if (els.cardInfoAttackType) els.cardInfoAttackType.textContent = 'Kaster';
  if (els.cardInfoRange) els.cardInfoRange.textContent = '1 casilla';
  if (els.cardInfoFactors) els.cardInfoFactors.textContent = '-';
  if (els.cardInfoMove) els.cardInfoMove.textContent = TEST_INVOCATION_MOVE_SPEED;
  if (els.cardInfoMoveType) els.cardInfoMoveType.textContent = 'Completa';
  if (els.cardInfoBiotype) els.cardInfoBiotype.textContent = '-';
  if (els.cardInfoCost) els.cardInfoCost.textContent = '-';
  if (els.cardInfoCastTime) els.cardInfoCastTime.textContent = isCasterInOwnSide(playerId) ? 'Sí' : 'No';
  if (els.cardInfoRestoreTime) els.cardInfoRestoreTime.textContent = '-';
  els.cardInfoOverlay.classList.add('open');
  els.cardInfoOverlay.setAttribute('aria-hidden', 'false');
  updateCardInfoAction();
}

function openGuardianInfo(playerId, guardianId) {
  const guardian = state.players[playerId].guardians.find(g => g.id === guardianId);
  if (!guardian || !els.cardInfoOverlay) return;
  const elementId = getPlayerDomainId(playerId);
  const entityCard = createInfoEntityCard({
    id: `guardian-${guardianId}`,
    name: 'Guardián',
    type: 'structure',
    artImage: getGuardianAssetForPlayer(playerId),
    elementId,
  });
  state.infoCard = { source: 'guardian', playerId, guardianId };
  els.cardInfoPreview.innerHTML = '';
  els.cardInfoPreview.appendChild(createCardElement(entityCard, { elementIdOverride: elementId, hideCost: true }));
  els.cardInfoName.textContent = 'Guardián';
  setCardInfoType('structure', 'Estructura defensiva · Resistencia');
  if (els.cardInfoMetaIcons) els.cardInfoMetaIcons.innerHTML = '';
  els.cardInfoDamage.textContent = '-';
  els.cardInfoLife.textContent = guardian.resistance ?? 5;
  if (els.cardInfoDefense) els.cardInfoDefense.textContent = '-';
  if (els.cardInfoAttackType) els.cardInfoAttackType.textContent = 'Estructura';
  if (els.cardInfoRange) els.cardInfoRange.textContent = '-';
  if (els.cardInfoFactors) els.cardInfoFactors.textContent = '-';
  if (els.cardInfoMove) els.cardInfoMove.textContent = '-';
  if (els.cardInfoMoveType) els.cardInfoMoveType.textContent = 'Fija';
  if (els.cardInfoBiotype) els.cardInfoBiotype.textContent = '-';
  if (els.cardInfoCost) els.cardInfoCost.textContent = '-';
  if (els.cardInfoCastTime) els.cardInfoCastTime.textContent = '-';
  if (els.cardInfoRestoreTime) els.cardInfoRestoreTime.textContent = '-';
  els.cardInfoOverlay.classList.add('open');
  els.cardInfoOverlay.setAttribute('aria-hidden', 'false');
  updateCardInfoAction();
}

function closeCardInfo() {
  if (!els.cardInfoOverlay) return;
  els.cardInfoOverlay.classList.remove('open');
  els.cardInfoOverlay.classList.remove('spell-card-info');
  els.cardInfoOverlay.setAttribute('aria-hidden', 'true');
  if (els.cardInfoSummaryTags) els.cardInfoSummaryTags.innerHTML = '';
  if (els.cardInfoExtraPanel) els.cardInfoExtraPanel.innerHTML = '';
}

function startKastFromInfo() {
  if (!state.infoCard) return;
  const card = CARD_LIBRARY[state.infoCard.cardId];
  if (state.activePlayer !== LOCAL_PLAYER_ID) {
    log('No puedes kastear durante el turno del rival.');
    updateCardInfoAction();
    return;
  }
  if (currentPhase().id !== 'casting') {
    log('Solo puedes kastear en la fase de Kasteo.');
    updateCardInfoAction();
    return;
  }
  if (!isCasterInOwnSide(LOCAL_PLAYER_ID)) {
    log('El Kaster no puede kastear en la zona enemiga.');
    updateCardInfoAction();
    return;
  }
  const spellUserStatus = card?.type === 'spell' ? canCasterUseSpell(LOCAL_PLAYER_ID, card) : { ok: true };
  if (!spellUserStatus.ok) {
    log(spellUserStatus.message);
    updateCardInfoAction();
    return;
  }
  const limitStatus = canQueueInvocationForPlayer(LOCAL_PLAYER_ID, card);
  if (!limitStatus.ok) {
    log(limitStatus.message);
    return;
  }
  const paymentStatus = getCostPaymentStatus(LOCAL_PLAYER_ID, card);
  if (!paymentStatus.ok) {
    log(paymentStatus.message || `No tienes elementos suficientes para kastear ${card.name}.`);
    updateCardInfoAction();
    return;
  }
  const { cardId, slotIndex, tab } = state.infoCard;
  state.selectedCardSlot = slotIndex;
  state.pendingCard = { cardId, slotIndex, tab };
  state.pendingPlacement = null;
  closeCardInfo();
  const selectedCard = CARD_LIBRARY[cardId];
  if (selectedCard?.type === 'spell') {
    const caster = localPlayer().caster;
    const dir = selectedCard?.id === 'spellKageNoMichi' ? getKageNoMichiForwardDirection(LOCAL_PLAYER_ID) : { dr: -1, dc: 0 };
    const row = caster.row + dir.dr;
    const col = caster.col + dir.dc;
    if (!isInside(row, col)) {
      log(`No hay casilla frontal válida para preparar ${selectedCard.name}.`);
      clearPendingCast();
      renderAll();
      return;
    }
    state.pendingPlacement = { row, col, key: 'auto' };
    log(`${selectedCard.name} se prepara automáticamente en la primera casilla frontal del Kaster: ${coordLabel(row, col)}.`);
    confirmCast();
    return;
  }
  log(`Elige una casilla alrededor del Kaster para kastear ${selectedCard.name}.`);
  renderAll();
}

function handleKeyDown(event) {
  const key = event.key;

  if (key === ' ' || key === 'Spacebar') {
    const tag = String(event.target?.tagName || '').toLowerCase();
    if (tag !== 'input' && tag !== 'textarea' && !event.target?.isContentEditable) {
      event.preventDefault();
      toggleGamePause();
      return;
    }
  }

  if (key === 'Escape') {
    closeCardInfo();
    state.selectedMover = null;
    renderAll();
    return;
  }

  if (key === 'Enter') {
    if (state.pendingCard && state.pendingPlacement) confirmCast();
    else nextPhase(false);
    return;
  }

  if (key === '0') {
    state.activeTab = (state.activeTab + 1) % 3;
    clearPendingCast();
    renderAll();
    return;
  }

  if (key === '.') {
    state.activeTab = (state.activeTab + 2) % 3;
    clearPendingCast();
    renderAll();
    return;
  }

  if (state.pendingCard && CASTER_DIRS[key]) {
    selectCasterPlacement(key);
    return;
  }

  const slotIndex = CARD_KEYS.indexOf(key);
  if (slotIndex !== -1) {
    selectCardSlot(slotIndex);
  }
}

function selectCardSlot(slotIndex) {
  const cardId = localPlayer().handTabs[state.activeTab][slotIndex];
  if (!cardId) {
    log('Ese espacio está vacío.');
    return;
  }
  state.selectedCardSlot = slotIndex;
  state.infoCard = { cardId, slotIndex, tab: state.activeTab };
  state.pendingCard = null;
  state.pendingPlacement = null;
  openCardInfo(cardId, slotIndex, state.activeTab);
  renderAll();
}

function isNonCollidingSpellCast(card) {
  return getCardTypeId(card) === 'spell' || card?.type === 'spell';
}

function canUseCastReferenceCell(card, row, col, playerId = LOCAL_PLAYER_ID) {
  if (!isInside(row, col)) return false;
  if (isNonCollidingSpellCast(card)) return true;
  return !isCastPlacementBlockedForPlayer(row, col, playerId);
}

function selectCasterPlacement(key) {
  const caster = localPlayer().caster;
  const dir = CASTER_DIRS[key];
  const row = caster.row + dir.dr;
  const col = caster.col + dir.dc;
  if (!isInside(row, col)) {
    log('Esa casilla está fuera de la arena.');
    return;
  }
  const pendingCard = state.pendingCard ? CARD_LIBRARY[state.pendingCard.cardId] : null;
  if (!canUseCastReferenceCell(pendingCard, row, col, LOCAL_PLAYER_ID)) {
    log('Esa casilla ya está ocupada o ya tiene una carta de respawn.');
    return;
  }
  state.pendingPlacement = { row, col, key };
  log(`Casilla elegida: ${coordLabel(row, col)}. Presiona Enter para confirmar.`);
  renderAll();
}

function handleCellClick(row, col) {
  if (state.pendingPowerAction) {
    resolveSmokeBombAt(row, col);
    return;
  }
  if (!state.pendingCard && state.selectedMover) {
    if (tryMoveSelectedTo(row, col)) return;
    state.selectedMover = null;
    clearCombatMenus();
    renderAll();
    log(`Casilla ${coordLabel(row, col)}.`);
    return;
  }
  if (!state.pendingCard) {
    state.selectedMover = null;
    clearCombatMenus();
    renderAll();
    log(`Casilla ${coordLabel(row, col)}.`);
    return;
  }
  if (!isCasterInOwnSide(LOCAL_PLAYER_ID)) {
    log('El Kaster no puede kastear desde la zona enemiga.');
    return;
  }
  const caster = localPlayer().caster;
  const isAround = Math.abs(row - caster.row) <= 1 && Math.abs(col - caster.col) <= 1 && !(row === caster.row && col === caster.col);
  if (!isAround) {
    log('La carta debe colocarse en una de las 8 casillas alrededor del Kaster.');
    return;
  }
  const pendingCard = CARD_LIBRARY[state.pendingCard.cardId];
  if (!canUseCastReferenceCell(pendingCard, row, col, LOCAL_PLAYER_ID)) {
    log('Esa casilla ya está ocupada o ya tiene una carta de respawn.');
    return;
  }
  state.pendingPlacement = { row, col, key: '?' };
  confirmCast();
}

function confirmCast() {
  const player = localPlayer();
  const pending = state.pendingCard;
  if (!pending) return;
  const card = CARD_LIBRARY[pending.cardId];

  const paymentStatus = getCostPaymentStatus(LOCAL_PLAYER_ID, card);
  if (!paymentStatus.ok) {
    log(paymentStatus.message || `No tienes elementos suficientes para kastear ${card.name}.`);
    return;
  }
  if (!state.pendingPlacement || !canUseCastReferenceCell(card, state.pendingPlacement.row, state.pendingPlacement.col, LOCAL_PLAYER_ID)) {
    log(isNonCollidingSpellCast(card)
      ? 'No puedes kastear ahí: la casilla de referencia está fuera de la arena.'
      : 'No puedes kastear ahí: esa casilla ya está ocupada o ya tiene una carta de respawn.');
    return;
  }

  const randomNeeded = getRandomCostNeeded(card);
  if (randomNeeded > 0) {
    if (shouldAskRandomCostSelection(LOCAL_PLAYER_ID, card)) {
      openRandomCostSelector(LOCAL_PLAYER_ID, card);
      return;
    }
    const automaticSelection = buildAutomaticRandomCostSelection(LOCAL_PLAYER_ID, card);
    completeCastPaymentAndQueue(automaticSelection);
    return;
  }

  completeCastPaymentAndQueue(null);
}

function completeCastPaymentAndQueue(randomSelection = null) {
  const player = localPlayer();
  const pending = state.pendingCard;
  if (!pending) return;
  const card = CARD_LIBRARY[pending.cardId];

  if (!payCardCostForPlayer(LOCAL_PLAYER_ID, card, randomSelection)) {
    log(`No se pudo pagar el costo de ${card.name}.`);
    return;
  }

  const elementId = getEffectiveCardElementId(card, LOCAL_PLAYER_ID);
  const spawnId = `spawn_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const castItem = {
    cardId: card.id,
    elementId,
    remaining: Math.max(0, Number(card.castPhases || 0)),
    row: state.pendingPlacement.row,
    col: state.pendingPlacement.col,
    justAdded: true,
    introStarted: false,
    introDone: false,
    introEndsAt: 0,
    spawnId,
    originTab: pending.tab,
    originSlot: pending.slotIndex,
  };

  player.handTabs[pending.tab][pending.slotIndex] = null;
  state.infoCard = null;

  if (card.type === 'invocation' && Number(card.castPhases || 0) <= 0) {
    player.spawnMarkers = player.spawnMarkers || [];
    player.spawnMarkers.push({
      id: spawnId,
      cardId: card.id,
      elementId,
      row: state.pendingPlacement.row,
      col: state.pendingPlacement.col,
      owner: state.activePlayer,
      originTab: pending.tab,
      originSlot: pending.slotIndex,
      immediateCast: true,
    });
    const spellbookStart = getSpellbookSlotCenter(pending.tab, pending.slotIndex);
    clearPendingCast();
    closeRandomCostSelector();
    renderAll();
    animateImmediateInvocationFromSpellbook(LOCAL_PLAYER_ID, castItem, spellbookStart);
    log(`${card.name} entra de inmediato a la arena. Kasteo 0: presión directa.`);
    return;
  }

  player.castQueue.push(castItem);
  if (card.type === 'invocation') {
    player.spawnMarkers = player.spawnMarkers || [];
    player.spawnMarkers.push({
      id: spawnId,
      cardId: card.id,
      elementId,
      row: state.pendingPlacement.row,
      col: state.pendingPlacement.col,
      owner: state.activePlayer,
      originTab: pending.tab,
      originSlot: pending.slotIndex,
    });
  }
  player.caster.state = 'casting';
  const queuePosition = player.castQueue.length;
  log(queuePosition === 1
    ? `${card.name} entra a zona de kasteo. Kasteo activo: ${card.castPhases} fases.`
    : `${card.name} entra a cola de kasteo. Espera ${queuePosition - 1} carta${queuePosition === 2 ? '' : 's'} antes de comenzar.`);
  clearPendingCast();
  closeRandomCostSelector();
  renderAll();
}

function getRandomCostNeeded(card) {
  return Number(getNormalizedCardCost(card).random || 0);
}

function removeSpecificCostFromPool(resources, card, playerId = null) {
  const pool = Array.isArray(resources) ? resources.map((res, index) => ({ ...res, __poolIndex: index })) : [];
  const cost = getEffectiveCardCost(card, playerId);
  Object.entries(cost).forEach(([elementId, amount]) => {
    if (elementId === 'random') return;
    let removed = 0;
    for (let i = pool.length - 1; i >= 0 && removed < amount; i--) {
      if (pool[i].id === elementId) {
        pool.splice(i, 1);
        removed++;
      }
    }
  });
  return pool;
}

function getRandomCostOptions(playerId, card) {
  const player = state.players[playerId];
  if (!player || !card) return [];
  const pool = removeSpecificCostFromPool(player.resources, card, playerId);
  const counts = pool.reduce((acc, res) => {
    acc[res.id] = (acc[res.id] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts)
    .filter(([, count]) => count > 0)
    .map(([id, count]) => ({ id, count, label: getElementById(id)?.label || id, icon: getElementCostIcon(id) }));
}

function getCostPaymentStatus(playerId, card) {
  const player = state.players[playerId];
  if (!player || !card) return { ok: false, reason: 'missingCard', message: 'No se encontró la carta o el jugador.' };
  const cost = getEffectiveCardCost(card, playerId);
  const remainingPool = Array.isArray(player.resources) ? [...player.resources] : [];
  for (const [elementId, amount] of Object.entries(cost)) {
    if (elementId === 'random') continue;
    const owned = remainingPool.filter(r => r.id === elementId).length;
    if (owned < amount) {
      const label = getElementById(elementId)?.label || elementId;
      return { ok: false, reason: 'base', elementId, needed: amount, owned, message: `Faltan ${amount - owned} recurso${amount - owned === 1 ? '' : 's'} de ${label} para cubrir el costo base.` };
    }
    let removed = 0;
    for (let i = remainingPool.length - 1; i >= 0 && removed < amount; i--) {
      if (remainingPool[i].id === elementId) {
        remainingPool.splice(i, 1);
        removed++;
      }
    }
  }
  const randomNeeded = Number(cost.random || 0);
  if (remainingPool.length < randomNeeded) {
    return { ok: false, reason: 'random', needed: randomNeeded, owned: remainingPool.length, message: `Faltan ${randomNeeded - remainingPool.length} recurso${randomNeeded - remainingPool.length === 1 ? '' : 's'} disponible${randomNeeded - remainingPool.length === 1 ? '' : 's'} para cubrir el costo aleatorio.` };
  }
  return { ok: true, reason: 'ok', randomNeeded, randomOptions: getRandomCostOptions(playerId, card), effectiveCost: cost };
}

function buildAutomaticRandomCostSelection(playerId, card) {
  const needed = getRandomCostNeeded(card);
  if (needed <= 0) return null;
  const options = getRandomCostOptions(playerId, card);
  let remaining = needed;
  const selection = {};
  for (const option of options) {
    if (remaining <= 0) break;
    const take = Math.min(option.count, remaining);
    if (take > 0) {
      selection[option.id] = take;
      remaining -= take;
    }
  }
  return remaining === 0 ? selection : null;
}

function shouldAskRandomCostSelection(playerId, card) {
  const needed = getRandomCostNeeded(card);
  if (needed <= 0) return false;
  const status = getCostPaymentStatus(playerId, card);
  if (!status.ok) return false;
  const options = getRandomCostOptions(playerId, card);
  return options.length >= 2;
}

function getFixedCostEntries(card, playerId = null) {
  const cost = getEffectiveCardCost(card, playerId);
  return Object.entries(cost)
    .filter(([elementId, amount]) => elementId !== 'random' && Number(amount) > 0)
    .map(([id, count]) => ({ id, count: Number(count), label: getElementById(id)?.label || id, icon: getElementCostIcon(id) }));
}

function openRandomCostSelector(playerId, card) {
  const needed = getRandomCostNeeded(card);
  const options = getRandomCostOptions(playerId, card);
  state.randomCostPayment = {
    playerId,
    cardId: card.id,
    needed,
    selected: {},
    options,
    fixedEntries: getFixedCostEntries(card, playerId),
  };
  renderRandomCostSelector();
  els.randomCostOverlay?.classList.add('open');
  els.randomCostOverlay?.setAttribute('aria-hidden', 'false');
  log(`Selecciona ${needed} elemento${needed === 1 ? '' : 's'} a consumir para pagar el costo aleatorio.`);
}

function closeRandomCostSelector() {
  state.randomCostPayment = null;
  els.randomCostOverlay?.classList.remove('open');
  els.randomCostOverlay?.setAttribute('aria-hidden', 'true');
}

function getSelectedRandomCostTotal(payment = state.randomCostPayment) {
  if (!payment) return 0;
  return Object.values(payment.selected || {}).reduce((sum, value) => sum + (Number(value) || 0), 0);
}

function renderRandomCostSelector() {
  const payment = state.randomCostPayment;
  if (!payment || !els.randomCostOptions) return;
  const card = CARD_LIBRARY[payment.cardId];
  const selectedTotal = getSelectedRandomCostTotal(payment);
  const remaining = Math.max(0, payment.needed - selectedTotal);
  if (els.randomCostTitle) els.randomCostTitle.textContent = `Costo aleatorio · ${card?.name || 'Carta'}`;
  if (els.randomCostBody) {
    const fixedHtml = (payment.fixedEntries || []).map(entry => `
      <div class="random-cost-locked-entry">
        <img src="${entry.icon}" alt="${entry.label}">
        <span>${entry.count} ${entry.label}</span>
      </div>`).join('');
    els.randomCostBody.innerHTML = `
      <p>Selecciona el elemento a consumir para cubrir la parte aleatoria del costo.</p>
      <p><strong>Costo base obligatorio:</strong> estos recursos ya quedan reservados primero.</p>
      <div class="random-cost-locked-list">${fixedHtml}</div>
      <p>Los recursos sobrantes del dominio base también pueden usarse como aleatorios.</p>`;
  }
  if (els.randomCostRemaining) els.randomCostRemaining.textContent = `Faltan ${remaining} de ${payment.needed}`;
  els.randomCostOptions.innerHTML = payment.options.map(option => {
    const selected = Number(payment.selected[option.id] || 0);
    const canAdd = remaining > 0 && selected < option.count;
    const canRemove = selected > 0;
    return `
      <div class="random-cost-option" data-element-id="${option.id}">
        <img src="${option.icon}" alt="${option.label}">
        <div class="random-cost-option-text">
          <strong>${option.label}</strong>
          <span>Disponibles ${option.count} · Seleccionados ${selected}</span>
        </div>
        <button type="button" class="random-cost-step" data-random-cost-delta="-1" ${canRemove ? '' : 'disabled'}>-</button>
        <button type="button" class="random-cost-step" data-random-cost-delta="1" ${canAdd ? '' : 'disabled'}>+</button>
      </div>`;
  }).join('');
  els.randomCostOptions.querySelectorAll('[data-random-cost-delta]').forEach(btn => {
    btn.addEventListener('click', event => {
      const row = event.currentTarget.closest('[data-element-id]');
      const elementId = row?.dataset.elementId;
      const delta = Number(event.currentTarget.dataset.randomCostDelta || 0);
      updateRandomCostSelection(elementId, delta);
    });
  });
  if (els.randomCostConfirmBtn) els.randomCostConfirmBtn.disabled = remaining !== 0;
}

function updateRandomCostSelection(elementId, delta) {
  const payment = state.randomCostPayment;
  if (!payment || !elementId || !delta) return;
  const option = payment.options.find(entry => entry.id === elementId);
  if (!option) return;
  const selected = Number(payment.selected[elementId] || 0);
  const selectedTotal = getSelectedRandomCostTotal(payment);
  if (delta > 0) {
    if (selected >= option.count || selectedTotal >= payment.needed) return;
    payment.selected[elementId] = selected + 1;
  } else {
    if (selected <= 0) return;
    payment.selected[elementId] = selected - 1;
    if (payment.selected[elementId] <= 0) delete payment.selected[elementId];
  }
  renderRandomCostSelector();
}

function confirmRandomCostSelection() {
  const payment = state.randomCostPayment;
  if (!payment) return;
  if (getSelectedRandomCostTotal(payment) !== payment.needed) {
    log('Todavía falta completar el costo aleatorio.');
    return;
  }
  const selection = { ...payment.selected };
  completeCastPaymentAndQueue(selection);
}

function cancelRandomCostSelection() {
  closeRandomCostSelector();
  log('Selección de costo aleatorio cancelada.');
}

function clearPendingCast() {
  state.selectedCardSlot = null;
  state.pendingCard = null;
  state.pendingPlacement = null;
}

function canPayCost(resources, cost, baseElementId = 'oscuridad') {
  const normalized = getNormalizedCardCost({ cost });
  const remainingPool = Array.isArray(resources) ? [...resources] : [];
  for (const [elementId, amount] of Object.entries(normalized)) {
    if (elementId === 'random') continue;
    const owned = remainingPool.filter(r => r.id === elementId).length;
    if (owned < amount) return false;
    let removed = 0;
    for (let i = remainingPool.length - 1; i >= 0 && removed < amount; i--) {
      if (remainingPool[i].id === elementId) {
        remainingPool.splice(i, 1);
        removed++;
      }
    }
  }
  const randomNeeded = Number(normalized.random || 0);
  const randomPool = remainingPool;
  return randomPool.length >= randomNeeded;
}

function payCost(resources, cost, baseElementId = 'oscuridad', randomSelection = null) {
  const working = Array.isArray(resources) ? resources.map(res => ({ ...res })) : [];
  const normalized = getNormalizedCardCost({ cost });

  for (const [elementId, amount] of Object.entries(normalized)) {
    if (elementId === 'random') continue;
    let removed = 0;
    for (let i = working.length - 1; i >= 0 && removed < amount; i--) {
      if (working[i].id === elementId) {
        working.splice(i, 1);
        removed++;
      }
    }
    if (removed !== amount) return false;
  }

  const randomNeeded = Number(normalized.random || 0);
  if (randomNeeded > 0) {
    const selection = randomSelection && Object.keys(randomSelection).length
      ? randomSelection
      : (() => {
          let left = randomNeeded;
          const auto = {};
          for (const res of working) {
            if (left <= 0) break;
            auto[res.id] = (auto[res.id] || 0) + 1;
            left--;
          }
          return left === 0 ? auto : null;
        })();

    if (!selection) return false;
    const selectedTotal = Object.values(selection).reduce((sum, value) => sum + (Number(value) || 0), 0);
    if (selectedTotal !== randomNeeded) return false;

    for (const [elementId, amount] of Object.entries(selection)) {
      let removed = 0;
      for (let i = working.length - 1; i >= 0 && removed < amount; i--) {
        if (working[i].id === elementId) {
          working.splice(i, 1);
          removed++;
        }
      }
      if (removed !== amount) return false;
    }
  }

  resources.splice(0, resources.length, ...working);
  return true;
}

function canPayCardCostForPlayer(playerId, card) {
  const status = getCostPaymentStatus(playerId, card);
  return !!status.ok;
}

function payCardCostForPlayer(playerId, card, randomSelection = null) {
  const player = state.players[playerId];
  if (!player || !card) return false;
  if (!canPayCardCostForPlayer(playerId, card)) return false;
  return payCost(player.resources, getEffectiveCardCost(card, playerId), getCardElementId(card), randomSelection);
}

function getPlayerHandCardIds(playerId) {
  const player = state.players[playerId];
  if (!player || !Array.isArray(player.handTabs)) return [];
  return player.handTabs.flat().filter(Boolean);
}

function canPlayerCastAnyCard(playerId) {
  const player = state.players[playerId];
  if (!player) return false;
  if (currentPhase().id !== 'casting') return false;
  if (!isCasterInOwnSide(playerId)) return false;
  return getPlayerHandCardIds(playerId).some(cardId => {
    const card = CARD_LIBRARY[cardId];
    return card && canPayCardCostForPlayer(playerId, card);
  });
}


function checkRiskZoneAttack(playerId, unit) {
  if (!unit || unit.status === 'restoring') return false;
  const riskRow = getEnemyRiskRow(playerId);
  if (unit.row !== riskRow) return false;
  const card = CARD_LIBRARY[unit.cardId];
  log(`${card?.name || 'Invocación'} ataca la zona de riesgo y extrae 1 carta extra.`);
  animateExtractionCard(playerId, drawElementCard(playerId), 0).then(() => renderAll());
  restoreInvocation(playerId, unit, 'zona de riesgo');
  state.selectedMover = null;
  renderAll();
  return true;
}

function restoreInvocation(playerId, unit, reason = 'restauración') {
  clearStructureAttackAnchor(unit);
  const marker = state.players[playerId].spawnMarkers.find(m => m.id === unit.spawnId);
  const restorePoint = marker || (
    Number.isFinite(unit.restoreRow) && Number.isFinite(unit.restoreCol)
      ? { row: unit.restoreRow, col: unit.restoreCol }
      : null
  );
  const card = CARD_LIBRARY[unit.cardId];
  const restoreTime = Math.max(0, Number(card?.stats?.restore ?? TEST_RESTORE_PHASES));
  unit.restoreRemaining = restoreTime;
  unit.movesLeft = 0;
  unit.hp = unit.maxHp ?? card?.stats?.life ?? unit.hp ?? 1;
  state.selectedMover = null;

  const finishRestoreTravel = () => {
    if (restorePoint) {
      unit.row = restorePoint.row;
      unit.col = restorePoint.col;
    }
    unit.restoreAnimating = false;
    if (restoreTime <= 0) {
      unit.status = 'active';
      unit.restoreRemaining = 0;
      showFloatingTextAt(unit.row, unit.col, 'RESTAURA 0', 'floating-combat buff');
    }
    renderAll();
  };

  if (restorePoint) {
    unit.restoreAnimating = true;
    animateRestoreInvocationToSpawn(playerId, unit, restorePoint, finishRestoreTravel);
  }

  if (restoreTime <= 0) {
    if (!restorePoint) finishRestoreTravel();
    log(`${card?.name || 'Invocación'} vuelve a su punto de restauración por ${reason} sin tiempo de espera.`);
    return;
  }
  unit.status = 'restoring';
  if (!restorePoint) finishRestoreTravel();
  log(`${card?.name || 'Invocación'} vuelve a su punto de restauración por ${reason}.`);
}

function applyDamageToCaster(playerId, amount, reason = '') {
  const caster = state.players[playerId].caster;
  caster.life = Math.max(0, (caster.life ?? 30) - amount);
  showFloatingDamageAt(caster.row, caster.col, amount);
  if (reason) log(`${reason}: Kaster J${playerId} recibe ${amount} daño.`);
}

function showFloatingDamageAt(row, col, amount) {
  const pos = cellCenter(row, col);
  const div = document.createElement('div');
  div.className = 'floating-damage';
  div.textContent = typeof amount === 'number' ? `-${amount}` : String(amount);
  div.style.left = `${pos.x}%`;
  div.style.top = `${pos.y}%`;
  els.boardContent.appendChild(div);
  setTimeout(() => div.remove(), 1900);
}

function findAiCastCandidate(playerId) {
  const player = state.players[playerId];
  for (let tab = 0; tab < player.handTabs.length; tab++) {
    const cards = player.handTabs[tab] || [];
    for (let slot = 0; slot < cards.length; slot++) {
      const cardId = cards[slot];
      const card = CARD_LIBRARY[cardId];
      if (card && card.type === 'invocation' && canPayCardCostForPlayer(playerId, card)) {
        return { cardId, tab, slot, card };
      }
    }
  }
  return null;
}

function getCasterAdjacentFreeCells(playerId) {
  const caster = state.players[playerId].caster;
  const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  return dirs
    .map(([dr, dc]) => ({ row: caster.row + dr, col: caster.col + dc, dr, dc }))
    .filter(cell => isInside(cell.row, cell.col) && !isCastPlacementBlockedForPlayer(cell.row, cell.col, playerId));
}

function chooseAiCastCell(playerId) {
  const options = getCasterAdjacentFreeCells(playerId);
  if (!options.length) return null;
  const pressureRow = getEnemyRiskRow(playerId);
  return options.sort((a, b) => {
    const da = Math.abs(a.row - pressureRow) + Math.abs(a.col - 4);
    const db = Math.abs(b.row - pressureRow) + Math.abs(b.col - 4);
    return da - db;
  })[0];
}

function aiConfirmCast(playerId, candidate, cell) {
  const player = state.players[playerId];
  const card = candidate.card;
  const limitStatus = canQueueInvocationForPlayer(playerId, card);
  if (!limitStatus.ok) return false;
  if (!cell || isCastPlacementBlockedForPlayer(cell.row, cell.col, playerId)) return false;
  const autoRandomSelection = buildAutomaticRandomCostSelection(playerId, card);
  if (!payCardCostForPlayer(playerId, card, autoRandomSelection)) {
    const status = getCostPaymentStatus(playerId, card);
    log(`IA J${playerId}: no puede pagar ${card.name}. ${status.message || ''}`.trim());
    return false;
  }
  const elementId = getEffectiveCardElementId(card, playerId);
  const spawnId = `spawn_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  player.castQueue.push({
    cardId: card.id,
    elementId,
    remaining: card.castPhases,
    row: cell.row,
    col: cell.col,
    justAdded: true,
    introStarted: false,
    introDone: false,
    introEndsAt: 0,
    spawnId,
    originTab: candidate.tab,
    originSlot: candidate.slot,
  });
  player.spawnMarkers = player.spawnMarkers || [];
  player.spawnMarkers.push({ id: spawnId, cardId: card.id, elementId, row: cell.row, col: cell.col, owner: playerId, originTab: candidate.tab, originSlot: candidate.slot });
  player.handTabs[candidate.tab][candidate.slot] = null;
  player.caster.state = 'casting';
  const queuePosition = player.castQueue.length;
  log(queuePosition === 1
    ? `IA J${playerId}: kastea ${card.name} en ${coordLabel(cell.row, cell.col)}.`
    : `IA J${playerId}: agrega ${card.name} a cola de kasteo en ${coordLabel(cell.row, cell.col)}.`);
  return true;
}

async function runEnemyCastingPhase(playerId) {
  if (state.aiThinking) return;
  state.aiThinking = true;
  renderPhaseUI();
  await sleep(780);
  try {
    const candidate = findAiCastCandidate(playerId);
    const cell = candidate ? chooseAiCastCell(playerId) : null;
    if (candidate && cell && isCasterInOwnSide(playerId)) {
      aiConfirmCast(playerId, candidate, cell);
      renderAll();
      await sleep(1150);
    } else {
      log(`IA J${playerId}: no tiene kasteo útil ahora.`);
      await sleep(780);
    }
    await sleep(650);
  } finally {
    state.aiThinking = false;
    renderPhaseUI();
    nextPhase(true);
  }
}

function getInvocationMoveOptions(playerId, unit) {
  if (!unit || unit.status === 'restoring' || isUnitEngaged(unit) || hasStructureAttackAnchor(unit) || (unit.movesLeft ?? 0) <= 0) return [];
  const deltas = getMovementDeltasForProfile(getEffectiveMovementTypeForUnit(playerId, unit), playerId);
  return deltas
    .map(([dr, dc]) => ({ row: unit.row + dr, col: unit.col + dc, dr, dc }))
    .filter(opt => isInside(opt.row, opt.col) && !isOccupiedForPlayer(opt.row, opt.col, playerId));
}

function distance(aRow, aCol, bRow, bCol) {
  return Math.abs(aRow - bRow) + Math.abs(aCol - bCol);
}

function getAiUnitTarget(playerId, unit) {
  const enemyId = playerId === 1 ? 2 : 1;
  const enemy = state.players[enemyId];
  const own = state.players[playerId];
  const activeEnemyUnits = enemy.units.filter(u => u.status !== 'restoring');
  if (activeEnemyUnits.length) {
    return activeEnemyUnits
      .map(u => ({ row: u.row, col: u.col, label: 'amenaza enemiga', score: distance(unit.row, unit.col, u.row, u.col) }))
      .sort((a, b) => a.score - b.score)[0];
  }
  const threatenedGuardian = own.guardians
    .filter(g => g.active)
    .map(g => ({ row: g.row, col: g.col, label: 'guardián', score: distance(unit.row, unit.col, g.row, g.col) }))
    .sort((a, b) => a.score - b.score)[0];
  if (threatenedGuardian && threatenedGuardian.score <= 3) return threatenedGuardian;
  if (enemy.caster) return { row: enemy.caster.row, col: enemy.caster.col, label: 'Kaster rival', score: 0 };
  return { row: getEnemyRiskRow(playerId), col: 4, label: 'zona de riesgo', score: 0 };
}

async function aiMoveUnitToward(playerId, unit) {
  let safety = TEST_INVOCATION_MOVE_SPEED + 2;
  while (unit && unit.status !== 'restoring' && (unit.movesLeft ?? 0) > 0 && safety-- > 0) {
    if (await aiTryAttackWithUnit(playerId, unit)) { await sleep(760); break; }
    const options = getInvocationMoveOptions(playerId, unit);
    if (!options.length) break;
    const target = getAiUnitTarget(playerId, unit);
    const chosen = options.sort((a, b) => {
      const da = distance(a.row, a.col, target.row, target.col);
      const db = distance(b.row, b.col, target.row, target.col);
      if (da !== db) return da - db;
      return Math.abs(a.col - 4) - Math.abs(b.col - 4);
    })[0];
    state.selectedMover = { type: 'invocation', playerId, unitId: unit.id };
    renderAll();
    await sleep(560);

    displaceHiddenOpponentIfNeeded(chosen.row, chosen.col, playerId);
    unit.row = chosen.row;
    unit.col = chosen.col;
    unit.movesLeft = Math.max(0, (unit.movesLeft ?? 0) - 1);
    log(`IA J${playerId}: ${CARD_LIBRARY[unit.cardId]?.name || 'Invocación'} avanza hacia ${target.label}.`);
    renderAll();
    await sleep(640);

    if (await aiTryAttackWithUnit(playerId, unit)) { await sleep(760); break; }
    if (checkRiskZoneAttack(playerId, unit)) {
      await sleep(850);
      break;
    }
    const enemyId = playerId === 1 ? 2 : 1;
    if (distance(unit.row, unit.col, state.players[enemyId].caster.row, state.players[enemyId].caster.col) <= 1) break;
  }
}

function getCasterMoveOptionsForAi(playerId) {
  const caster = state.players[playerId].caster;
  const deltas = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  return deltas
    .map(([dr, dc]) => ({ row: caster.row + dr, col: caster.col + dc }))
    .filter(opt => isInside(opt.row, opt.col) && !isOccupiedForPlayer(opt.row, opt.col, playerId) && (playerId === 1 ? opt.row >= 9 : opt.row <= 8));
}

async function aiDefensiveCasterStep(playerId) {
  const enemyId = playerId === 1 ? 2 : 1;
  const caster = state.players[playerId].caster;
  const threats = state.players[enemyId].units.filter(u => u.status !== 'restoring');
  if (!threats.length || (caster.movesLeft ?? 0) <= 0) return;
  const nearestThreatDistance = Math.min(...threats.map(u => distance(caster.row, caster.col, u.row, u.col)));
  if (nearestThreatDistance > 3) return;
  const options = getCasterMoveOptionsForAi(playerId);
  if (!options.length) return;
  const chosen = options.sort((a, b) => {
    const da = Math.min(...threats.map(u => distance(a.row, a.col, u.row, u.col)));
    const db = Math.min(...threats.map(u => distance(b.row, b.col, u.row, u.col)));
    return db - da;
  })[0];
  displaceHiddenOpponentIfNeeded(chosen.row, chosen.col, playerId);
  caster.row = chosen.row;
  caster.col = chosen.col;
  caster.movesLeft = Math.max(0, (caster.movesLeft ?? 0) - 1);
  log(`IA J${playerId}: el Kaster se reposiciona para defenderse.`);
  renderAll();
  await sleep(720);
}

async function runEnemyResolutionPhase(playerId) {
  if (state.aiThinking) return;
  state.aiThinking = true;
  renderPhaseUI();
  await sleep(860);
  try {
    prepareResolutionMoves(playerId);
    renderAll();
    await aiDefensiveCasterStep(playerId);
    await sleep(620);
    const units = [...state.players[playerId].units].filter(unit => unit.status !== 'restoring');
    for (const unit of units) {
      await aiMoveUnitToward(playerId, unit);
      await sleep(620);
    }
    await sleep(900);
  } finally {
    state.selectedMover = null;
    state.aiThinking = false;
    renderPhaseUI();
    nextPhase(true);
  }
}


function getActiveCombatPairs() {
  const pairs = [];
  const seen = new Set();
  for (const playerId of [1, 2]) {
    for (const unit of state.players[playerId].units) {
      if (!unit?.engagedWith || unit.status === 'restoring') continue;
      const other = getUnitById(unit.engagedWith.playerId, unit.engagedWith.unitId);
      if (!other || other.status === 'restoring') continue;
      const key = [unitKey(playerId, unit.id), unitKey(unit.engagedWith.playerId, other.id)].sort().join('|');
      if (seen.has(key)) continue;
      seen.add(key);
      pairs.push({
        a: { playerId, unit },
        b: { playerId: unit.engagedWith.playerId, unit: other },
      });
    }
  }
  return pairs;
}

function lifeToneClass(unit) {
  const base = Number(unit.baseHp ?? CARD_LIBRARY[unit.cardId]?.stats?.life ?? unit.maxHp ?? unit.hp ?? 0);
  const max = Number(unit.maxHp ?? base);
  const hp = Number(unit.hp ?? max);
  if (hp < max) return 'life-low';
  if (hp > base) return 'life-bonus';
  return 'life-normal';
}

function renderCombatHud() {
  let hud = els.combatHud;
  if (!hud) {
    hud = document.createElement('div');
    hud.id = 'combatHud';
    hud.className = 'combat-hud combat-hud-field';
    els.combatHud = hud;
    els.boardContent.appendChild(hud);
  } else if (hud.parentElement !== els.boardContent) {
    els.boardContent.appendChild(hud);
    hud.className = 'combat-hud combat-hud-field';
    hud.removeAttribute('style');
  }

  const pairs = getActiveCombatPairs();
  hud.innerHTML = '';
  hud.classList.toggle('visible', pairs.length > 0);
  pairs.forEach(pair => hud.appendChild(createCombatPairNode(pair)));
}

function setupCombatHudDragging(hud) {
  if (!hud || hud.dataset.dragReady === '1') return;
  hud.dataset.dragReady = '1';

  hud.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    const target = event.target;
    if (target.closest('button')) return;

    const rect = hud.getBoundingClientRect();
    state.combatHudDrag.active = true;
    state.combatHudDrag.moved = false;
    state.combatHudDrag.offsetX = event.clientX - rect.left;
    state.combatHudDrag.offsetY = event.clientY - rect.top;

    hud.classList.add('dragging');
    hud.setPointerCapture?.(event.pointerId);
    event.preventDefault();
    event.stopPropagation();
  });

  hud.addEventListener('pointermove', (event) => {
    if (!state.combatHudDrag.active || !els.combatHud) return;
    const hudRect = els.combatHud.getBoundingClientRect();
    const x = event.clientX - state.combatHudDrag.offsetX;
    const y = event.clientY - state.combatHudDrag.offsetY;
    const maxX = Math.max(0, window.innerWidth - hudRect.width);
    const maxY = Math.max(0, window.innerHeight - 40);

    state.combatHudDrag.x = Math.min(Math.max(0, x), maxX);
    state.combatHudDrag.y = Math.min(Math.max(0, y), maxY);
    state.combatHudDrag.moved = true;
    applyCombatHudDraggedPosition();

    event.preventDefault();
    event.stopPropagation();
  });

  const finishDrag = (event) => {
    if (!state.combatHudDrag.active || !els.combatHud) return;
    state.combatHudDrag.active = false;
    els.combatHud.classList.remove('dragging');
    try { els.combatHud.releasePointerCapture?.(event.pointerId); } catch (error) {}
    event.preventDefault();
    event.stopPropagation();
  };

  hud.addEventListener('pointerup', finishDrag);
  hud.addEventListener('pointercancel', finishDrag);
}

function applyCombatHudDraggedPosition() {
  const hud = els.combatHud;
  if (!hud) return;
  if (state.combatHudDrag.x == null || state.combatHudDrag.y == null) return;
  hud.style.left = `${state.combatHudDrag.x}px`;
  hud.style.top = `${state.combatHudDrag.y}px`;
}

function readRootCssNumber(name, fallback = 0) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!raw) return fallback;
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? value : fallback;
}

function updateCombatHudFixedPosition() {
  // v5.3.4: el HUD de combate vuelve al campo/boardContent.
  // Ya no usa posición fixed global.
}

function createCombatPairNode(pair) {
  const wrap = document.createElement('div');
  wrap.className = 'combat-pair-card';
  wrap.appendChild(createCombatSideNode(pair.a));
  const vs = document.createElement('div');
  vs.className = 'combat-vs-chip';
  vs.textContent = 'VS';
  wrap.appendChild(vs);
  wrap.appendChild(createCombatSideNode(pair.b));
  return wrap;
}

function createCombatSideNode(side) {
  const card = CARD_LIBRARY[side.unit.cardId];
  const damage = side.unit.damage ?? card?.attackProfile?.damage ?? card?.stats?.damage ?? 0;
  const life = side.unit.hp ?? card?.stats?.life ?? 0;

  const row = document.createElement('div');
  row.className = `combat-side player-${side.playerId}`;
  const elementId = getUnitElementId(side.playerId, side.unit);
  const element = getElementById(elementId);
  row.dataset.elementId = elementId;
  row.style.setProperty('--combat-element-color', element?.color || '#9b4dff');
  if ((side.unit.damageFlashUntil || 0) > Date.now()) row.classList.add('damage-flash');

  const mini = document.createElement('div');
  mini.className = 'combat-mini-card';
  mini.title = card?.name || 'Invocación';

  const cardNode = createCardElement(card, { elementIdOverride: elementId });
  cardNode.classList.add('combat-card-real');
  mini.appendChild(cardNode);

  const damageBadge = document.createElement('span');
  damageBadge.className = 'combat-card-corner combat-card-damage';
  damageBadge.textContent = damage;

  const lifeBadge = document.createElement('span');
  lifeBadge.className = `combat-card-corner combat-card-life ${lifeToneClass(side.unit)}`;
  lifeBadge.textContent = life;

  mini.appendChild(damageBadge);
  mini.appendChild(lifeBadge);
  row.appendChild(mini);
  return row;
}

function getTargetAccessLabel(target) {
  if (!target) return 'Objetivo';
  if (target.type === 'caster') return getCasterDisplayName(state.players[target.playerId]?.caster, `Kaster J${target.playerId}`);
  if (target.type === 'guardian') return 'Guardián';
  if (target.type === 'invocation') {
    const unit = getUnitById(target.playerId, target.unitId);
    const card = CARD_LIBRARY[unit?.cardId];
    return card?.shortName || card?.name || 'Invocación';
  }
  return 'Objetivo';
}

function createTargetAccessMini(target) {
  const mini = document.createElement('div');
  mini.className = `target-access-mini target-access-${target.type}`;
  if (target.type === 'invocation') {
    const unit = getUnitById(target.playerId, target.unitId);
    const card = CARD_LIBRARY[unit?.cardId];
    mini.innerHTML = card ? `<img src="${card.tokenImage || card.artImage}" alt="${card.name}">` : '<span>?</span>';
    return mini;
  }
  if (target.type === 'guardian') {
    mini.innerHTML = `<img src="${getGuardianAssetForPlayer(target.playerId)}" alt="Guardián">`;
    return mini;
  }
  const caster = state.players[target.playerId]?.caster;
  mini.innerHTML = `<img src="${getCasterTokenImage(caster)}" alt="${getTargetAccessLabel(target)}">`;
  return mini;
}

function renderTargetAccessPanel() {
  if (!els.targetAccessPanel) return;
  els.targetAccessPanel.innerHTML = '';
  const source = getSourceUnitFromSelection();
  if (!source || source.playerId !== LOCAL_PLAYER_ID || currentPhase().id !== 'resolution') {
    els.targetAccessPanel.classList.remove('visible');
    return;
  }
  const targets = getTargetsInRangeForUnit(source.playerId, source.unit)
    .filter(target => target.playerId !== source.playerId);
  if (!targets.length) {
    els.targetAccessPanel.classList.remove('visible');
    return;
  }
  els.targetAccessPanel.classList.add('visible');
  targets.forEach(target => {
    const row = document.createElement('div');
    row.className = 'target-access-row';

    const miniBtn = document.createElement('button');
    miniBtn.type = 'button';
    miniBtn.className = 'target-access-mini-btn';
    miniBtn.title = `${getTargetAccessLabel(target)} · ${coordLabel(target.row, target.col)}`;
    miniBtn.appendChild(createTargetAccessMini(target));
    miniBtn.addEventListener('click', event => {
      stopTargetMenuEvent(event);
      openInfoForTarget(target);
    });
    row.appendChild(miniBtn);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'target-access-btn';
    btn.textContent = 'Elegir';
    btn.title = `Elegir objetivo en ${coordLabel(target.row, target.col)}`;
    btn.addEventListener('click', event => {
      stopTargetMenuEvent(event);
      showTargetMenu(target);
    });
    row.appendChild(btn);

    const cellBubble = document.createElement('span');
    cellBubble.className = 'target-access-cell-bubble';
    cellBubble.textContent = coordLabel(target.row, target.col);
    cellBubble.title = `Casilla ${coordLabel(target.row, target.col)}`;
    row.appendChild(cellBubble);

    els.targetAccessPanel.appendChild(row);
  });
}

function renderAll() {
  refreshSmokeZoneEffects();
  applyFountainColors();
  renderPhaseUI();
  renderCards();
  renderResources();
  renderCastQueue();
  renderEnemyMiniHud();
  renderGridHighlights();
  renderSpawnMarkers();
  renderMoveOptions();
  renderSmokeZones();
  renderArenaEffectTrackers();
  renderUnits();
  renderCombatHud();
  renderTargetAccessPanel();
  renderCasterStats();
  renderCasterWidePanel();
  renderVisualDevShowcase();
  updateCardInfoAction();
}

function renderPhaseUI() {
  const waitingPlayer = state.activePlayer === 1 ? 2 : 1;
  document.querySelectorAll('.phase-box').forEach((box) => {
    const phaseId = box.dataset.phaseId;
    box.className = 'phase-box';
    if (phaseId === currentPhase().id) box.classList.add('active', state.activePlayer === 1 ? 'p1' : 'p2');
    if (phaseId === 'wait') box.classList.add('active', waitingPlayer === 1 ? 'p1' : 'p2', 'waiting');
    const undoBtn = box.querySelector('.phase-undo-btn');
    if (undoBtn) {
      const showUndo = Boolean(state.phaseUndo && currentPhase().id === 'resolution' && !state.resolutionActionTaken && state.phaseUndo.playerId === state.activePlayer);
      undoBtn.classList.toggle('visible', showUndo);
      undoBtn.disabled = !showUndo;
    }
  });
  if (els.turnBanner) {
    els.turnBanner.textContent = `J${state.activePlayer} · ${currentPhase().label} / J${waitingPlayer} espera`;
  }
  els.boardContent.classList.toggle('player-p1', state.activePlayer === 1);
  els.boardContent.classList.toggle('player-p2', state.activePlayer === 2);
  if (els.p1Life) els.p1Life.textContent = state.players[1].life;
  if (els.p1ElementCount) els.p1ElementCount.textContent = state.players[1].resources.length;
  document.querySelectorAll('.deck-tab').forEach(btn => {
    btn.classList.toggle('active', Number(btn.dataset.tab) === state.activeTab);
  });
  if (els.nextPhaseBtn) {
    const extractionLocked = currentPhase().id === 'extraction';
    els.nextPhaseBtn.textContent = state.paused ? 'PAUSA' : 'SIGUIENTE';
    els.nextPhaseBtn.disabled = state.paused || extractionLocked || state.extractionAnimating || state.aiThinking || (state.aiEnabled && state.activePlayer !== LOCAL_PLAYER_ID);
  }
}

function renderCards() {
  const tab = localPlayer().handTabs[state.activeTab] || [];
  els.cardGrid.innerHTML = '';
  for (let i = 0; i < 12; i++) {
    const slot = document.createElement('div');
    slot.className = 'card-slot';
    if (i === state.selectedCardSlot) slot.classList.add('selected');
    const key = document.createElement('span');
    key.className = 'key-label';
    key.textContent = CARD_KEYS[i];
    slot.appendChild(key);
    const cardId = tab[i];
    if (cardId) {
      const cardNode = createCardElement(CARD_LIBRARY[cardId]);
      cardNode.dataset.cardId = cardId;
      cardNode.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        selectCardSlot(i);
      });
      slot.appendChild(cardNode);
      slot.addEventListener('click', (event) => {
        event.preventDefault();
        selectCardSlot(i);
      });
    } else {
      slot.classList.add('empty');
    }
    els.cardGrid.appendChild(slot);
  }
}


function createCardDomainElement(card) {
  const domain = getDomainArtProfile(card);
  const node = document.createElement('button');
  node.type = 'button';
  node.className = 'card-domain-zone card-domain-zone-clickable';
  node.dataset.infoKind = 'domain';
  node.dataset.infoId = getCardElementId(card);
  node.title = `Dominio: ${domain.elementLabel} · Atributo: ${domain.attributeLabel}`;
  node.innerHTML = `
    <div class="card-domain-layer card-domain-bg" aria-hidden="true"></div>
    <img class="card-domain-layer card-domain-element" src="${domain.elementArt}" alt="Elemento ${domain.elementLabel}">
    <img class="card-domain-layer card-domain-attribute" src="${domain.attributeArt}" alt="Atributo ${domain.attributeLabel}">
  `;
  node.addEventListener('click', event => {
    event.stopPropagation();
    openCardMetaInfo('domain', getCardElementId(card), card);
  });
  return node;
}

function createCardElement(card, options = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'card';
  const elementId = options.elementIdOverride || options.elementId || getCardElementId(card);
  const element = getElementById(elementId);
  const skinImage = getElementSkinForCard(card, elementId);
  const bgImage = getElementBackgroundForCard(card, elementId);
  const artImage = card?.artImage || 'assets/kagero-art.png';
  const cardTypeId = getCardTypeId(card);
  const usesArtLayer = card?.composition !== 'backgroundSkin' && card?.usesArtLayer !== false && cardTypeId !== 'spell';
  wrap.dataset.elementId = elementId;
  wrap.dataset.cardType = cardTypeId;
  wrap.classList.toggle('card-no-art-layer', !usesArtLayer);
  wrap.style.setProperty('--card-element-color', element?.color || '#9b4dff');
  wrap.innerHTML = `
    <img class="card-layer card-bg" src="${bgImage}" alt="fondo" onerror="this.onerror=null;this.src='assets/card-bg-darkness.jpg';">
    ${usesArtLayer ? `<img class="card-layer card-art" src="${artImage}" alt="arte" onerror="this.onerror=null;this.src='assets/invocation-art.png';">` : ''}
    <img class="card-layer card-skin" src="${skinImage}" alt="skin ${element?.label || ''}" onerror="this.onerror=null;this.src='assets/card-skin-darkness.png';">
  `;
  return wrap;
}

function getSpellMiniImage(card) {
  return card?.thumbnailImage
    || card?.spellIcon
    || card?.bgImage
    || card?.artImage
    || card?.tokenImage
    || 'assets/card-types/card-type-spell.svg';
}

function createSpellArtMini(card, className = 'cast-spell-art-mini') {
  const img = document.createElement('img');
  img.className = className;
  img.src = getSpellMiniImage(card);
  img.alt = card?.name || 'Hechizo';
  img.onerror = () => {
    img.onerror = null;
    img.src = 'assets/card-types/card-type-spell.svg';
  };
  return img;
}

function createSpellCompositeMini(card, className = 'cast-spell-composite-mini') {
  const wrap = document.createElement('div');
  wrap.className = className;
  wrap.setAttribute('aria-label', card?.name || 'Hechizo');

  const bg = document.createElement('img');
  bg.className = 'spell-mini-bg';
  bg.src = card?.bgImage || card?.thumbnailImage || getSpellMiniImage(card);
  bg.alt = card?.name || 'Hechizo';
  bg.onerror = () => {
    bg.onerror = null;
    bg.src = getSpellMiniImage(card);
  };
  wrap.appendChild(bg);

  if (card?.skinImage) {
    const skin = document.createElement('img');
    skin.className = 'spell-mini-skin';
    skin.src = card.skinImage;
    skin.alt = '';
    skin.setAttribute('aria-hidden', 'true');
    wrap.appendChild(skin);
  }

  return wrap;
}

function createCastQueueVisual(card, options = {}) {
  const isSpell = getCardTypeId(card) === 'spell';
  if (isSpell) {
    return createSpellCompositeMini(card, 'cast-spell-composite-mini');
  }
  const img = document.createElement('img');
  img.className = 'cast-token-image';
  img.src = card?.tokenImage || card?.artImage || 'assets/invocation-token.png';
  img.alt = card?.name || 'Carta en kasteo';
  return img;
}

function createCastTravelVisual(card, options = {}) {
  const isSpell = getCardTypeId(card) === 'spell';
  if (isSpell) {
    return createSpellCompositeMini(card, 'cast-travel-spell-composite-mini');
  }
  const img = document.createElement('img');
  img.src = card?.tokenImage || card?.artImage || 'assets/invocation-token.png';
  img.alt = card?.name || 'Carta en viaje';
  return img;
}

function createArenaEffectTrackerVisual(zone) {
  if (zone?.type === 'kageNoMichi') {
    const card = CARD_LIBRARY[zone.sourceCardId || 'spellKageNoMichi'];
    if (card) {
      const mini = createSpellArtMini(card, 'arena-effect-spell-art-mini');
      mini.setAttribute('aria-label', card.name || 'Kage no Michi');
      return mini;
    }
  }
  const token = document.createElement('div');
  token.className = 'arena-effect-icon-token';
  token.innerHTML = `<img src="${SMOKE_BOMB_ICON_ASSET}" alt="Bomba de humo">`;
  return token;
}

function renderArenaEffectTrackers() {
  if (!els.arenaEffectTrackers) return;
  const zones = (Array.isArray(state.smokeZones) ? state.smokeZones : []).slice().sort((a, b) => {
    const at = Number(a.createdAt || 0);
    const bt = Number(b.createdAt || 0);
    return at - bt;
  });
  els.arenaEffectTrackers.innerHTML = '';
  zones.forEach(zone => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = `arena-effect-tracker arena-effect-${zone.type || 'smoke'}`;
    item.title = `${zone.sourceName || (zone.type === 'kageNoMichi' ? 'Kage no Michi' : 'Bomba de humo')} · ${zone.phasesRemaining} fases restantes`;
    item.appendChild(createArenaEffectTrackerVisual(zone));
    const count = document.createElement('span');
    count.className = 'arena-effect-tracker-count';
    count.textContent = String(zone.phasesRemaining ?? 0);
    item.appendChild(count);
    item.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (zone.type === 'kageNoMichi' && CARD_LIBRARY[zone.sourceCardId || 'spellKageNoMichi']) {
        openCardMetaInfo('power', 'kageNoMichi', CARD_LIBRARY[zone.sourceCardId || 'spellKageNoMichi']);
      } else {
        openCardMetaInfo('weapon', 'smokeBomb');
      }
    });
    els.arenaEffectTrackers.appendChild(item);
  });
}

function renderResources() {
  const resources = sortResourcesForPlayer(localPlayer().resources, LOCAL_PLAYER_ID);
  els.resourceBar.innerHTML = '';
  resources.forEach(res => {
    const token = document.createElement('div');
    token.className = 'orb resource-token';
    token.style.setProperty('--orb-color', res.color);
    token.dataset.type = res.label;
    token.dataset.elementId = res.id;
    token.title = res.label || res.id || 'Elemento';
    token.innerHTML = `<img src="${res.icon || getElementCostIcon(res.id)}" alt="${res.label || res.id || 'Elemento'}">`;
    els.resourceBar.appendChild(token);
  });
}


function renderEnemyMiniHud() {
  if (!els.enemyMiniHud || !els.enemyMiniResources || !els.enemyMiniCastQueue) return;
  const enemyId = getEnemyPlayerId(LOCAL_PLAYER_ID);
  const enemy = state.players[enemyId];
  if (!enemy) return;

  els.enemyMiniResources.innerHTML = '';
  sortResourcesForPlayer(enemy.resources || [], enemyId).forEach(res => {
    const token = document.createElement('div');
    token.className = 'enemy-mini-orb enemy-mini-resource-token';
    token.style.setProperty('--orb-color', res.color);
    token.dataset.elementId = res.id || '';
    token.title = res.label || res.id || 'Elemento rival';
    token.innerHTML = `<img src="${res.icon || getElementCostIcon(res.id)}" alt="${res.label || res.id || 'Elemento rival'}">`;
    els.enemyMiniResources.appendChild(token);
  });

  els.enemyMiniCastQueue.innerHTML = '';
  (enemy.castQueue || []).forEach((item, index) => {
    const card = CARD_LIBRARY[item.cardId];
    if (!card) return;
    const isActiveCast = index === 0;
    const div = document.createElement('div');
    div.className = `enemy-mini-cast-item ${isActiveCast ? 'cast-active' : 'cast-waiting'}`;
    div.dataset.spawnId = item.spawnId || '';
    div.dataset.cardId = card.id || item.cardId || '';
    div.title = isActiveCast
      ? `${card.name}: kasteo activo · ${item.remaining} fases`
      : `${card.name}: en cola · espera a que termine el kasteo activo`;
    div.appendChild(createCastQueueVisual(card, { elementIdOverride: item.elementId || getEffectiveCardElementId(card, enemyId) }));
    const status = document.createElement('div');
    status.className = 'enemy-mini-cast-status';
    status.innerHTML = `<span class="cast-icon-badge enemy-mini-hourglass cooldown-time-badge">${CAST_ENTRY_ICON_INLINE_SVG}<span class="cast-corner-number enemy-mini-corner-number">${isActiveCast ? item.remaining : 'Q'}</span></span>`;
    div.appendChild(status);
    els.enemyMiniCastQueue.appendChild(div);
  });

  els.enemyMiniHud.classList.toggle('empty', !(enemy.resources?.length) && !(enemy.castQueue?.length));
}



function finalizeCastIntro(playerId, spawnId) {
  const item = findQueuedItemBySpawn(playerId, spawnId);
  if (!item || item.introDone) return;
  item.justAdded = false;
  item.introDone = true;
  item.introStarted = false;
  item.introEndsAt = 0;
  renderAll();
}

function scheduleCastIntroFinish(playerId, spawnId, duration = 940) {
  const item = findQueuedItemBySpawn(playerId, spawnId);
  if (!item || item.introTimerSet) return;
  item.introTimerSet = true;
  item.introEndsAt = Date.now() + duration;
  window.setTimeout(() => {
    const queued = findQueuedItemBySpawn(playerId, spawnId);
    if (queued) queued.introTimerSet = false;
    finalizeCastIntro(playerId, spawnId);
  }, duration);
}

function renderCastQueue() {
  const queue = localPlayer().castQueue;
  els.castQueue.innerHTML = '';
  queue.forEach((item, index) => {
    const card = CARD_LIBRARY[item.cardId];
    const isActiveCast = index === 0;
    const div = document.createElement('div');
    div.className = `cast-item ${isActiveCast ? 'cast-active' : 'cast-waiting'}`;
    div.dataset.spawnId = item.spawnId || '';
    div.dataset.playerId = String(LOCAL_PLAYER_ID);
    div.title = isActiveCast
      ? `${card.name}: kasteo activo · ${item.remaining} fases`
      : `${card.name}: en cola · espera a que termine el kasteo activo`;
    div.appendChild(createCastQueueVisual(card, { elementIdOverride: item.elementId || getEffectiveCardElementId(card, LOCAL_PLAYER_ID) }));
    const status = document.createElement('div');
    status.className = 'cast-status';
    status.innerHTML = `<span class="cast-icon-badge big cooldown-time-badge">${CAST_ENTRY_ICON_INLINE_SVG}<span class="cast-corner-number">${isActiveCast ? item.remaining : 'Q'}</span></span>`;
    div.appendChild(status);

    const introExpired = Boolean(item.introEndsAt && Date.now() >= item.introEndsAt);
    if (introExpired) {
      item.justAdded = false;
      item.introDone = true;
      item.introStarted = false;
      item.introEndsAt = 0;
    }

    if (item.justAdded && !item.introDone && !item.introStarted) {
      item.introStarted = true;
      div.classList.add('entering', 'intro-locked');
      scheduleCastIntroFinish(LOCAL_PLAYER_ID, item.spawnId, 940);
      div.addEventListener('animationend', (event) => {
        if (event.animationName !== 'kastDropLanding') return;
        finalizeCastIntro(LOCAL_PLAYER_ID, item.spawnId);
      }, { once: true });
    } else if (!item.introDone) {
      // Si otro render ocurre mientras la animación aún está viva, NO se reinicia.
      // La ficha queda bloqueada hasta que el timer original finalice la intro.
      div.classList.add('intro-locked');
    } else {
      item.justAdded = false;
      item.introDone = true;
      item.introStarted = false;
      attachLinkHoverHandlers(div, item.spawnId, state.activePlayer, 'queue');
    }

    els.castQueue.appendChild(div);
  });
}

function renderGridHighlights() {
  const castingActive = Boolean(state.pendingCard);
  els.enemyGrid.classList.toggle('casting-active', castingActive);
  els.allyGrid.classList.toggle('casting-active', castingActive);
  document.querySelectorAll('.cell').forEach(cell => {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    cell.classList.remove('caster-zone', 'selected-place', 'occupied');
    const pendingCard = state.pendingCard ? CARD_LIBRARY[state.pendingCard.cardId] : null;
    const blockedForCast = isCastPlacementBlockedForPlayer(row, col, state.pendingCard ? LOCAL_PLAYER_ID : null);
    if (blockedForCast && !isNonCollidingSpellCast(pendingCard)) cell.classList.add('occupied');
    if (state.pendingCard) {
      const caster = currentPlayer().caster;
      const isAround = Math.abs(row - caster.row) <= 1 && Math.abs(col - caster.col) <= 1 && !(row === caster.row && col === caster.col);
      if (isAround && canUseCastReferenceCell(pendingCard, row, col, LOCAL_PLAYER_ID)) cell.classList.add('caster-zone');
    }
    if (state.pendingPlacement && state.pendingPlacement.row === row && state.pendingPlacement.col === col) {
      cell.classList.add('selected-place');
    }
  });
}

function renderSpawnMarkers() {
  if (!els.spawnMarkersLayer) return;
  els.spawnMarkersLayer.innerHTML = '';
  for (const playerId of [1, 2]) {
    const player = state.players[playerId];
    (player.spawnMarkers || []).forEach(marker => {
      const card = CARD_LIBRARY[marker.cardId];
      if (!card) return;
      const pos = cellCenter(marker.row, marker.col);
      const holder = document.createElement('div');
      holder.className = 'spawn-marker';
      holder.dataset.spawnId = marker.id;
      holder.dataset.playerId = String(playerId);
      holder.style.left = `${pos.x}%`;
      holder.style.top = `${pos.y}%`;
      holder.style.zIndex = String(100 + marker.row);
      const element = getElementById(marker.elementId || getEffectiveCardElementId(card, playerId));
      holder.dataset.elementId = element?.id || '';
      holder.style.setProperty('--marker-glow', element?.color || '#ffffff');
      holder.title = `${card.name} · Punto de respawn en ${coordLabel(marker.row, marker.col)}`;
      const mini = createCardElement(card, { elementIdOverride: element?.id });
      mini.classList.add('mini');
      holder.appendChild(mini);
      const queued = findQueuedItemBySpawn(playerId, marker.id);
      if (queued) {
        holder.classList.add('waiting');
        if (!isCastIntroReady(playerId, marker.id)) holder.classList.add('intro-locked');
        const status = document.createElement('div');
        status.className = 'spawn-status';
        status.innerHTML = `<span class="cast-icon-badge big cooldown-time-badge">${CAST_ENTRY_ICON_INLINE_SVG}<span class="cast-corner-number">${queued.remaining}</span></span>`;
        holder.appendChild(status);
      }
      attachLinkHoverHandlers(holder, marker.id, playerId, 'marker');
      els.spawnMarkersLayer.appendChild(holder);
    });
  }
}

function renderMoveOptions() {
  if (!els.moveOptionsLayer) return;
  els.moveOptionsLayer.innerHTML = '';

  if (state.pendingPowerAction?.kind === 'smokeBomb') {
    const unit = getUnitById(state.pendingPowerAction.playerId, state.pendingPowerAction.unitId);
    const power = getPowerDefinitionForUnit(state.pendingPowerAction.playerId, unit);
    const options = unit && power ? getCellsInRadius(unit.row, unit.col, Number(power.throwRange ?? 3), true) : [];
    options.forEach(opt => {
      const pos = cellCenter(opt.row, opt.col);
      const size = getBoardCellSizePercent(opt.row);
      const div = document.createElement('button');
      div.type = 'button';
      div.className = 'move-option move-option-power';
      div.style.left = `${pos.x}%`;
      div.style.top = `${pos.y}%`;
      div.style.width = `${size.width}%`;
      div.style.height = `${size.height}%`;
      div.title = `Lanzar bomba de humo en ${coordLabel(opt.row, opt.col)}`;
      div.dataset.smokeBombTarget = 'true';
      div.addEventListener('click', (event) => {
        event.stopPropagation();
        resolveSmokeBombAt(opt.row, opt.col);
      });
      els.moveOptionsLayer.appendChild(div);
    });
    return;
  }

  const options = getSelectedMoverOptions();
  options.forEach(opt => {
    const pos = cellCenter(opt.row, opt.col);
    const arrow = MOVE_ARROW_BY_DELTA[`${opt.dr},${opt.dc}`];
    const size = getBoardCellSizePercent(opt.row);
    const div = document.createElement('button');
    div.type = 'button';
    div.className = 'move-option';
    div.style.left = `${pos.x}%`;
    div.style.top = `${pos.y}%`;
    div.style.width = `${size.width}%`;
    div.style.height = `${size.height}%`;
    div.title = `Mover a ${coordLabel(opt.row, opt.col)}`;
    div.innerHTML = `<img src="${arrow}" alt="Mover a ${coordLabel(opt.row, opt.col)}">`;
    div.addEventListener('click', (event) => {
      event.stopPropagation();
      tryMoveSelectedTo(opt.row, opt.col);
    });
    els.moveOptionsLayer.appendChild(div);
  });
}

function renderSmokeZones() {
  if (!els.smokeZonesLayer) return;

  const zones = Array.isArray(state.smokeZones) ? state.smokeZones : [];
  const existing = new Map();
  Array.from(els.smokeZonesLayer.children).forEach(node => {
    if (node?.dataset?.smokeKey) existing.set(node.dataset.smokeKey, node);
  });
  const markerLayer = els.smokeBombMarkersLayer || els.smokeZonesLayer;
  const existingMarkers = new Map();
  Array.from(markerLayer.children).forEach(node => {
    if (node?.dataset?.smokeMarkerKey) existingMarkers.set(node.dataset.smokeMarkerKey, node);
  });
  const liveKeys = new Set();
  const liveMarkerKeys = new Set();

  const ensureSmokeNode = (key, className, init = null) => {
    let node = existing.get(key);
    if (!node) {
      node = document.createElement('div');
      node.className = className;
      node.dataset.smokeKey = key;
      if (init) init(node);
      els.smokeZonesLayer.appendChild(node);
    }
    liveKeys.add(key);
    return node;
  };

  const ensureSmokeMarkerNode = (key, className, init = null) => {
    let node = existingMarkers.get(key);
    if (!node) {
      node = document.createElement('div');
      node.className = className;
      node.dataset.smokeMarkerKey = key;
      if (init) init(node);
      markerLayer.appendChild(node);
    }
    liveMarkerKeys.add(key);
    return node;
  };

  for (const zone of zones) {
    const radius = zone.radius ?? 3;
    if (!Array.isArray(zone.hazeCells) || !zone.hazeCells.length) {
      zone.hazeCells = zone.type === 'kageNoMichi'
        ? buildKageNoMichiPathCells(zone.playerId)
        : buildSmokeZoneHazeCells(zone.row, zone.col, radius);
    }

    for (const cell of zone.hazeCells) {
      const pos = cellCenter(cell.row, cell.col);
      const size = getBoardCellSizePercent(cell.row);
      const key = `${zone.id}_haze_${cell.row}_${cell.col}`;
      const haze = ensureSmokeNode(key, zone.type === 'kageNoMichi' ? 'smoke-cell-overlay kage-path-cell-overlay' : 'smoke-cell-overlay', node => {
        node.style.setProperty('--smoke-cell-pulse-speed', `${cell.pulseSpeed || '1.80'}s`);
        node.style.setProperty('--smoke-cell-pulse-delay', `-${cell.pulseDelay || '0'}s`);
      });
      haze.style.left = `${pos.x}%`;
      haze.style.top = `${pos.y}%`;
      haze.style.width = `${size.width}%`;
      haze.style.height = `${size.height}%`;
    }

    const particles = Array.isArray(zone.particles) ? zone.particles : (zone.type === 'kageNoMichi' ? buildKageNoMichiParticles(zone.hazeCells || []) : buildSmokeZoneParticles(zone.row, zone.col, radius));
    zone.particles = particles;
    particles.forEach((particle, index) => {
      const pos = cellCenter(particle.row, particle.col);
      const key = `${zone.id}_cloud_${index}_${particle.row}_${particle.col}`;
      const cloud = ensureSmokeNode(key, zone.type === 'kageNoMichi' ? 'smoke-cloud-particle kage-path-cloud-particle' : 'smoke-cloud-particle', node => {
        node.style.setProperty('--smoke-cloud-offset-x', `${particle.offsetXPct}%`);
        node.style.setProperty('--smoke-cloud-offset-y', `${particle.offsetYPct}%`);
        node.style.setProperty('--smoke-cloud-scale', particle.sizeScale);
        node.style.setProperty('--smoke-cloud-opacity-scale', particle.opacityScale);
        node.style.setProperty('--smoke-cloud-pulse-speed', `${particle.pulseSpeed}s`);
        node.style.setProperty('--smoke-cloud-pulse-delay', `-${particle.pulseDelay}s`);
        node.style.zIndex = `${40 + (index % 6)}`;
      });
      cloud.style.left = `${pos.x}%`;
      cloud.style.top = `${pos.y}%`;
    });

  }

  Array.from(els.smokeZonesLayer.children).forEach(node => {
    if (node?.dataset?.smokeKey && !liveKeys.has(node.dataset.smokeKey)) safeRemove(node);
  });
  Array.from((els.smokeBombMarkersLayer || els.smokeZonesLayer).children).forEach(node => {
    if (node?.dataset?.smokeMarkerKey && !liveMarkerKeys.has(node.dataset.smokeMarkerKey)) safeRemove(node);
  });
}

function renderUnits() {
  els.unitsLayer.innerHTML = '';
  for (const playerId of [1, 2]) {
    const player = state.players[playerId];
    renderUnit(player.caster.row, player.caster.col, 'caster', getCasterTokenImage(player.caster), getCasterDisplayName(player.caster, `Kaster J${playerId}`), playerId, null, getPlayerElementColor(playerId));
    player.guardians.filter(g => g.active !== false || g.destroying).forEach((g, index) => renderUnit(g.row, g.col, 'guardian', getGuardianAssetForPlayer(playerId), `Guardián ${index + 1} · RES ${g.resistance ?? 5}`, playerId, null, getOwnerColor(playerId), null, g.id));
    player.units.forEach(unit => {
      if (unit.restoreAnimating) return;
      const card = CARD_LIBRARY[unit.cardId];
      const element = getElementById(getUnitElementId(playerId, unit));
      renderUnit(unit.row, unit.col, 'invocation', card.tokenImage, card.name, playerId, unit.spawnId, element?.color || '#ffffff', unit.id);
    });
  }
}


function isVisualDevShowAllActive() {
  return document.body?.classList?.contains(VISUAL_DEV_SHOW_ALL_CLASS);
}

function isVisualDevCasterAnchor(type, playerId) {
  return type === 'caster' && playerId === LOCAL_PLAYER_ID && isVisualDevShowAllActive();
}

function appendVisualDevInvocationIndicatorsToCaster(div, playerId) {
  const caster = state.players[playerId]?.caster;
  if (!caster) return;

  div.classList.add('visual-dev-caster-anchor', 'local-resolution-unit');

  const statBadge = document.createElement('div');
  statBadge.className = 'invocation-stat-status visual-dev-caster-invocation-stats';
  statBadge.innerHTML = `
    <span class="unit-stat-icon-badge unit-damage-badge" title="Daño">
      <span class="unit-sword-icon" aria-hidden="true"></span>
      <span class="unit-stat-corner-number">${caster.atk ?? 0}</span>
    </span>
    <span class="unit-stat-icon-badge unit-life-badge" title="Vida">
      <span class="unit-heart-icon" aria-hidden="true"></span>
      <span class="unit-stat-corner-number life-normal">${caster.hp ?? caster.life ?? 10}</span>
    </span>`;
  div.appendChild(statBadge);

  const protectedLayer = div.querySelector('.unit-protected-icons-layer') || div;

  const hiddenBadge = document.createElement('button');
  hiddenBadge.type = 'button';
  hiddenBadge.className = 'unit-hidden-badge visual-dev-caster-hidden';
  hiddenBadge.setAttribute('aria-label', 'Oculto preview dev');
  hiddenBadge.title = 'Oculto preview dev';
  hiddenBadge.innerHTML = `<img class="unit-protected-icon" src="${HIDDEN_FACTOR_ICON_ASSET}" alt="Oculto">`;
  protectedLayer.appendChild(hiddenBadge);

  const moveBadge = document.createElement('div');
  moveBadge.className = 'move-ready-badge visual-dev-caster-move';
  moveBadge.innerHTML = `<img class="move-ready-icon unit-protected-icon" src="assets/indicators/indicador-movimientos-faltantes.svg" alt="" aria-hidden="true" />`;
  protectedLayer.appendChild(moveBadge);

  const restoreBadge = document.createElement('div');
  restoreBadge.className = 'restore-stat-status dev-preview-badge visual-dev-caster-restore';
  restoreBadge.innerHTML = `
    <span class="unit-stat-icon-badge unit-restore-badge" title="Restauración">
      <span class="unit-restore-icon" aria-hidden="true">${RESTORE_ICON_INLINE_SVG}</span>
      <span class="unit-stat-corner-number restore-cooldown-number">2</span>
    </span>`;
  div.appendChild(restoreBadge);
}


function renderUnit(row, col, type, src, label, playerId = null, spawnId = null, glowColor = '#ffffff', unitId = null, guardianId = null) {
  const div = document.createElement('div');
  div.className = `unit ${type}`;
  div.dataset.row = String(row);
  div.dataset.col = String(col);
  div.dataset.type = type;
  if (playerId !== null) div.dataset.playerId = String(playerId);
  if (spawnId) div.dataset.spawnId = spawnId;
  if (unitId) div.dataset.unitId = unitId;
  if (guardianId) div.dataset.guardianId = guardianId;
  if (type === 'caster' && playerId != null) {
    const casterState = state.players[playerId]?.caster;
    if (casterState?.casterId) {
      div.dataset.casterId = casterState.casterId;
      div.classList.add(`unit-caster-${casterState.casterId}`);
    }
    if (casterState?.cardId) div.dataset.cardId = casterState.cardId;
  }
  div.style.setProperty('--unit-glow', glowColor || '#ffffff');
  const unitState = unitId && playerId ? state.players[playerId].units.find(u => u.id === unitId) : null;
  if (unitState?.cardId) {
    div.dataset.cardId = unitState.cardId;
    div.classList.add(`unit-card-${unitState.cardId}`);
  }
  if (unitState?.status === 'restoring') {
    div.classList.add('restoring');
    div.style.setProperty('--restore-color', getUnitElementColor(playerId, unitState));
  }
  if (unitState?.engagedWith) div.classList.add('engaged');
  if (hasStructureAttackAnchor(unitState)) div.classList.add('structure-anchored');
  if (type === 'guardian' && guardianId) {
    const guardianState = state.players[playerId]?.guardians.find(item => item.id === guardianId);
    if (guardianState?.destroying) {
      div.classList.add('structure-destroying');
      div.style.setProperty('--destroy-color', getOwnerColor(playerId) || '#9b4dff');
    }
  }
  if (state.selectedMover && state.selectedMover.playerId === playerId) {
    if ((type === 'caster' && state.selectedMover.type === 'caster') || (type === 'invocation' && state.selectedMover.type === 'invocation' && state.selectedMover.unitId === unitId)) {
      div.classList.add('selected-mover');
    }
  }
  const isLocalResolutionUnit = type === 'invocation'
    && playerId === LOCAL_PLAYER_ID
    && playerId === state.activePlayer
    && currentPhase().id === 'resolution';
  if (isLocalResolutionUnit) div.classList.add('local-resolution-unit');
  const selectedSourceForLayering = currentPhase().id === 'resolution' ? getSourceUnitFromSelection() : null;
  if (selectedSourceForLayering && type === 'invocation') {
    if (playerId === selectedSourceForLayering.playerId) div.classList.add('friendly-targeting-blocker');
    else div.classList.add('targetable-rival-hitbox');
  }
  div.title = `${label} · ${coordLabel(row, col)}`;
  const pos = cellCenter(row, col);
  div.style.left = `${pos.x}%`;
  div.style.top = `${pos.y}%`;
  div.style.zIndex = String(200 + row);
  div.innerHTML = `<img class="unit-token-img" src="${src}" alt="${label}"><div class="unit-protected-icons-layer" aria-hidden="true"></div><button type="button" class="unit-hitbox" aria-label="${label} en ${coordLabel(row, col)}"></button>`;
  if (isVisualDevCasterAnchor(type, playerId)) {
    appendVisualDevInvocationIndicatorsToCaster(div, playerId);
  }
  if (type === 'guardian' && guardianId) {
    const g = state.players[playerId].guardians.find(item => item.id === guardianId);
    const badge = document.createElement('div');
    badge.className = 'resistance-status';
    badge.innerHTML = `<span class="cast-icon-badge big resistance-icon-badge"><span class="brick-shield" aria-hidden="true"></span><span class="cast-corner-number resistance-corner-number">${g?.resistance ?? 5}</span></span>`;
    div.appendChild(badge);
  }
  if (type === 'invocation' && unitState) {
    const card = CARD_LIBRARY[unitState.cardId];
    const damage = getEffectiveUnitDamageValue(unitState, card);
    const life = unitState.hp ?? card?.stats?.life ?? 0;
    const lifeClass = lifeToneClass(unitState);
    const weapon = getWeaponProfile(card);
    const badge = document.createElement('div');
    badge.className = 'invocation-stat-status';
    badge.innerHTML = `
      <span class="unit-stat-icon-badge unit-damage-badge" title="Daño · ${weapon.label}">
        <img class="unit-weapon-icon unit-protected-icon" src="${weapon.icon}" alt="${weapon.label}" draggable="false">
        <span class="unit-stat-corner-number">${damage}</span>
      </span>
      <span class="unit-stat-icon-badge unit-life-badge" title="Vida">
        <span class="unit-heart-icon" aria-hidden="true"></span>
        <span class="unit-stat-corner-number ${lifeClass}">${life}</span>
      </span>`;
    div.appendChild(badge);
  }
  if (type === 'invocation' && unitState && (unitHasActiveFactor(unitState, 'hidden') || unitState.devForceHidden)) {
    const hiddenInfo = getSmokeHiddenSourceInfo(playerId, unitState);
    const hiddenBadge = document.createElement('button');
    hiddenBadge.type = 'button';
    hiddenBadge.className = 'unit-hidden-badge';
    hiddenBadge.setAttribute('aria-label', hiddenInfo?.sourceName ? `Oculto por ${hiddenInfo.sourceName}` : 'Oculto');
    hiddenBadge.title = hiddenInfo?.sourceName ? `Oculto por ${hiddenInfo.sourceName}` : 'Oculto';
    hiddenBadge.innerHTML = `<img class="unit-protected-icon" src="${HIDDEN_FACTOR_ICON_ASSET}" alt="Oculto">`;
    hiddenBadge.addEventListener('click', event => {
      stopTargetMenuEvent(event);
      const cardModel = buildCardInfoViewModel(CARD_LIBRARY[unitState.cardId], { source: 'arena', playerId, unitId });
      openCardMetaInfo('factor', 'hidden', cardModel, {
        factorLevel: 1,
        factorSource: unitState.devForceHidden ? 'devPreview' : (hiddenInfo?.zone?.type === 'kageNoMichi' ? 'kageNoMichi' : 'smokeZone'),
        hiddenSourceName: hiddenInfo?.sourceName || (unitState.devForceHidden ? 'Preview dev' : ''),
      });
    });
    (div.querySelector('.unit-protected-icons-layer') || div).appendChild(hiddenBadge);
  }
  if (type === 'invocation' && unitState && (unitHasMandatoryMovement(playerId, unitState) || unitState.devForceMoveReady)) {
    const moveBadge = document.createElement('div');
    moveBadge.className = 'move-ready-badge';
    moveBadge.innerHTML = `<img class="move-ready-icon unit-protected-icon" src="assets/indicators/indicador-movimientos-faltantes.svg" alt="" aria-hidden="true" />`;
    (div.querySelector('.unit-protected-icons-layer') || div).appendChild(moveBadge);
  }
  const isSelectedInvocation = state.selectedMover
    && state.selectedMover.type === 'invocation'
    && state.selectedMover.playerId === playerId
    && state.selectedMover.unitId === unitId;
  const hasDirectInfoAction = unitState?.devForcePowerButtons ? true : unitShouldShowActionInfoButton(playerId, unitState);
  const hasDirectPowerAction = unitState?.devForcePowerButtons ? true : unitCanUseSmokeBombPower(playerId, unitState);
  const canShowDirectPowerActions = isLocalResolutionUnit
    && (isSelectedInvocation || unitState?.devForcePowerButtons)
    && (hasDirectInfoAction || hasDirectPowerAction);
  if (canShowDirectPowerActions) {
    div.classList.add('has-power-actions');
    const actionBox = document.createElement('div');
    actionBox.className = 'unit-direct-action-buttons';
    actionBox.innerHTML = `
      ${hasDirectInfoAction ? '<button type="button" class="unit-direct-action-btn" data-unit-direct-action="info">Info</button>' : ''}
      ${hasDirectPowerAction ? '<button type="button" class="unit-direct-action-btn unit-direct-power-btn" data-unit-direct-action="power">Poder</button>' : ''}
    `;
    actionBox.querySelector('[data-unit-direct-action="info"]')?.addEventListener('click', event => {
      stopTargetMenuEvent(event);
      clearCombatMenus();
      openCardInfo(unitState.cardId, null, null, { source: 'arena', playerId, unitId });
    });
    actionBox.querySelector('[data-unit-direct-action="power"]')?.addEventListener('click', event => {
      stopTargetMenuEvent(event);
      beginSmokeBombTargeting(playerId, unitId);
    });
    div.appendChild(actionBox);
  }
  if (type === 'invocation' && unitState) {
    const card = CARD_LIBRARY[unitState.cardId];
    const restoreTime = Math.max(0, Number(card?.stats?.restore ?? 0));
    const restoreRemaining = Math.max(0, Number(unitState.restoreRemaining ?? restoreTime));
    const showRestoreBadge = (unitState.status === 'restoring' && restoreTime > 0 && restoreRemaining > 0)
      || unitState.devForceRestoreBadge
      || (state.devPreviewIndicators?.restore && restoreTime > 0);
    if (showRestoreBadge) {
      const badge = document.createElement('div');
      badge.className = `restore-stat-status${unitState.status === 'restoring' ? '' : ' dev-preview-badge'}`;
      badge.innerHTML = `
        <span class="unit-stat-icon-badge unit-restore-badge" title="Restauración">
          <span class="unit-restore-icon" aria-hidden="true">${RESTORE_ICON_INLINE_SVG}</span>
          <span class="unit-stat-corner-number restore-cooldown-number">${unitState.status === 'restoring' ? restoreRemaining : restoreTime}</span>
        </span>
      `;
      div.appendChild(badge);
    }
  }

  const hitbox = div.querySelector('.unit-hitbox');
  hitbox.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();

    // Si el modo de bomba quedó abierto y el jugador clickea una ficha,
    // se cancela para que no bloquee el flujo normal de movimiento/ataque.
    if (state.pendingPowerAction) {
      state.pendingPowerAction.reactionResolve?.('cancelled');
      state.pendingPowerAction = null;
    }

    const selectedSource = getSourceUnitFromSelection();

    // Si ya hay una fuente seleccionada y se clickea un objetivo rival,
    // se abre el menú de objetivo.
    if (currentPhase().id === 'resolution' && selectedSource && playerId !== selectedSource.playerId) {
      if (type === 'caster') { showTargetMenu(buildTarget('caster', playerId)); return; }
      if (type === 'guardian' && guardianId) { showTargetMenu(buildTarget('guardian', playerId, { guardianId })); return; }
      if (type === 'invocation' && unitId) { showTargetMenu(buildTarget('invocation', playerId, { unitId })); return; }
    }

    // Click sobre ficha propia en Resolución: seleccionar SIEMPRE para mover/atacar.
    // Si la ficha puede usar poder, el menú aparece encima sin cancelar la selección.
    if (currentPhase().id === 'resolution' && playerId === state.activePlayer && playerId === LOCAL_PLAYER_ID) {
      if (type === 'caster') {
        selectMover('caster', playerId);
        renderAll();
        return;
      }
      if (type === 'invocation' && unitId) {
        const ownUnit = state.players[playerId].units.find(u => u.id === unitId);
        if (unitShouldOpenInfoOnDirectClick(playerId, ownUnit)) {
          clearCombatMenus();
          openCardInfo(ownUnit.cardId, null, null, { source: 'arena', playerId, unitId });
          return;
        }
        selectMover('invocation', playerId, unitId);
        renderAll();
        return;
      }
    }

    // Fuera de Resolución, o si no es tu turno, el click abre información.
    clearCombatMenus();
    if (type === 'invocation' && unitId) {
      const unit = state.players[playerId].units.find(u => u.id === unitId);
      if (unit) openCardInfo(unit.cardId, null, null, { source: 'arena', playerId, unitId });
      return;
    }
    if (type === 'caster') { openKasterInfo(playerId); return; }
    if (type === 'guardian' && guardianId) { openGuardianInfo(playerId, guardianId); return; }
    log(`${label} en ${coordLabel(row, col)}.`);
  });

  hitbox.addEventListener('mouseenter', () => div.classList.add('unit-hovered'));
  hitbox.addEventListener('mouseleave', () => div.classList.remove('unit-hovered'));

  if (type === 'invocation' && spawnId && playerId !== null) {
    attachLinkHoverHandlers(hitbox, spawnId, playerId, 'unit');
  }
  els.unitsLayer.appendChild(div);
}


function buildSimpleCastStatus(value = '2', className = 'cast-status') {
  const status = document.createElement('div');
  status.className = className;
  const badge = document.createElement('span');
  badge.className = className === 'enemy-mini-cast-status' ? 'cast-icon-badge enemy-mini-hourglass' : 'cast-icon-badge big cast';
  badge.textContent = '⌛';
  const corner = document.createElement('span');
  corner.className = className === 'enemy-mini-cast-status' ? 'cast-corner-number enemy-mini-corner-number' : 'cast-corner-number';
  corner.textContent = value;
  badge.appendChild(corner);
  status.appendChild(badge);
  return status;
}

function getSelectedVisualDevInvocation(invocations = []) {
  const selectedId = state.visualDevSelectedInvocationId;
  const selected = invocations.find(card => card.id === selectedId);
  return selected || invocations[0] || null;
}

function getVisualDevSampleCards() {
  const cards = Object.values(CARD_LIBRARY || {});
  const spells = cards.filter(card => getCardTypeId(card) === 'spell');
  const invocations = cards.filter(card => getCardTypeId(card) === 'invocation');
  const invokeA = getSelectedVisualDevInvocation(invocations) || cards[0];
  const invokeB = invocations.find(card => card.id !== invokeA?.id) || invokeA || cards[0];
  if (invokeA?.id && state.visualDevSelectedInvocationId !== invokeA.id) {
    state.visualDevSelectedInvocationId = invokeA.id;
  }
  return {
    spellA: spells[0] || cards[0],
    spellB: spells[1] || spells[0] || cards[0],
    invokeA,
    invokeB,
  };
}

function clearVisualDevShowcaseNodes() {
  document.querySelectorAll('.visual-dev-showcase-node').forEach(node => node.remove());
  if (els.targetAccessPanel) els.targetAccessPanel.classList.remove('visual-dev-showcase-live');
  if (els.enemyMiniHud) els.enemyMiniHud.classList.remove('visual-dev-showcase-live');
  if (els.castQueue) els.castQueue.classList.remove('visual-dev-showcase-live');
  if (els.arenaEffectTrackers) els.arenaEffectTrackers.classList.remove('visual-dev-showcase-live');
}

function renderVisualDevShowcase() {
  clearVisualDevShowcaseNodes();
  if (!document.body.classList.contains(VISUAL_DEV_SHOW_ALL_CLASS)) return;
  const { spellA, spellB, invokeA, invokeB } = getVisualDevSampleCards();

  if (els.castQueue) {
    els.castQueue.classList.add('visual-dev-showcase-live');
    const samples = [
      { card: spellA, remaining: 2, active: true },
      { card: invokeA, remaining: 'Q', active: false },
      { card: spellB, remaining: 'Q', active: false },
    ];
    samples.forEach(sample => {
      const item = document.createElement('div');
      item.className = `cast-item visual-dev-showcase-node ${sample.active ? 'cast-active' : 'cast-waiting'}`;
      item.title = 'Muestra dev';
      item.appendChild(createCastQueueVisual(sample.card, { elementIdOverride: getCardElementId(sample.card) }));
      item.appendChild(buildSimpleCastStatus(String(sample.remaining), 'cast-status'));
      els.castQueue.appendChild(item);
    });
  }

  if (els.enemyMiniResources && els.enemyMiniCastQueue && els.enemyMiniHud) {
    els.enemyMiniHud.classList.add('visual-dev-showcase-live');
    els.enemyMiniHud.classList.remove('empty');
    ['darkness', 'fire', 'water', 'light'].forEach(id => {
      const token = document.createElement('div');
      token.className = 'enemy-mini-orb enemy-mini-resource-token visual-dev-showcase-node';
      token.style.setProperty('--orb-color', '#7d4cff');
      token.innerHTML = `<img src="${getElementCostIcon(id)}" alt="${id}">`;
      els.enemyMiniResources.appendChild(token);
    });
    [
      { card: invokeB, active: true, remaining: '2' },
      { card: spellA, active: false, remaining: 'Q' },
    ].forEach(sample => {
      const div = document.createElement('div');
      div.className = `enemy-mini-cast-item visual-dev-showcase-node ${sample.active ? 'cast-active' : 'cast-waiting'}`;
      div.appendChild(createCastQueueVisual(sample.card, { elementIdOverride: getCardElementId(sample.card) }));
      div.appendChild(buildSimpleCastStatus(sample.remaining, 'enemy-mini-cast-status'));
      els.enemyMiniCastQueue.appendChild(div);
    });
  }

  if (els.arenaEffectTrackers) {
    els.arenaEffectTrackers.classList.add('visual-dev-showcase-live');
    [
      { type: 'smoke', phasesRemaining: 3, sourceName: 'Bomba de humo' },
      { type: 'kageNoMichi', phasesRemaining: 9, sourceName: 'Kage no Michi', sourceCardId: spellA?.id || 'spellKageNoMichi' },
    ].forEach(zone => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = `arena-effect-tracker arena-effect-${zone.type} visual-dev-showcase-node`;
      item.appendChild(createArenaEffectTrackerVisual(zone));
      const count = document.createElement('span');
      count.className = 'arena-effect-tracker-count';
      count.textContent = String(zone.phasesRemaining);
      item.appendChild(count);
      els.arenaEffectTrackers.appendChild(item);
    });
  }

  if (els.targetAccessPanel) {
    els.targetAccessPanel.classList.add('visible', 'visual-dev-showcase-live');
    [
      { label: 'D4', card: invokeA },
      { label: 'E5', card: invokeB || invokeA },
    ].forEach(sample => {
      const row = document.createElement('div');
      row.className = 'target-access-row visual-dev-showcase-node';
      const miniBtn = document.createElement('button');
      miniBtn.type = 'button';
      miniBtn.className = 'target-access-mini-btn';
      const mini = document.createElement('div');
      mini.className = 'target-access-mini target-access-invocation';
      mini.innerHTML = `<img src="${sample.card?.tokenImage || sample.card?.artImage || 'assets/invocation-token.png'}" alt="${sample.card?.name || 'Invocación'}">`;
      miniBtn.appendChild(mini);
      row.appendChild(miniBtn);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'target-access-btn';
      btn.textContent = 'Elegir';
      row.appendChild(btn);
      const bubble = document.createElement('span');
      bubble.className = 'target-access-cell-bubble';
      bubble.textContent = sample.label;
      row.appendChild(bubble);
      els.targetAccessPanel.appendChild(row);
    });
  }

  if (els.boardContent) {
    const sampleCard = invokeA || Object.values(CARD_LIBRARY || {}).find(card => getCardTypeId(card) === 'invocation');
    const casterAnchor = state.players[LOCAL_PLAYER_ID]?.caster || { row: 8, col: 5 };
    const sampleUnit = {
      id: 'visual_dev_menu_source_only',
      cardId: sampleCard?.id || 'naitoSutoka',
      row: casterAnchor.row,
      col: casterAnchor.col,
      status: 'active',
    };
    const sampleSource = { playerId: LOCAL_PLAYER_ID, unit: sampleUnit, card: sampleCard };
    const sampleTarget = buildTarget('invocation', getEnemyPlayerId(LOCAL_PLAYER_ID), {
      unitId: state.players[getEnemyPlayerId(LOCAL_PLAYER_ID)]?.units?.[0]?.id || 'dev_target',
    });
    sampleTarget.row = 6;
    sampleTarget.col = 5;

    const infoCombatirMenu = createTargetChoiceMenuElement(sampleTarget, sampleSource, {
      actionLabel: 'Combatir',
      extraClass: 'visual-dev-showcase-node visual-dev-info-combatir-menu',
      id: 'visualDevCombatChoiceMenu',
      pos: { x: 50, y: 38 },
    });
    els.boardContent.appendChild(infoCombatirMenu);

    const infoPoderMenu = createInvocationActionMenuElement(LOCAL_PLAYER_ID, sampleUnit, {
      forcePower: true,
      extraClass: 'visual-dev-showcase-node visual-dev-info-poder-menu',
      id: 'visualDevCombatActionMenu',
      pos: { x: 52, y: 62 },
    });
    els.boardContent.appendChild(infoPoderMenu);

    const casterDefenseMenu = createCasterDefenseMenuElement(LOCAL_PLAYER_ID, sampleSource, 1, {
      extraClass: 'visual-dev-showcase-node visual-dev-caster-defense-menu',
      pos: { x: 50, y: 63 },
    });
    els.boardContent.appendChild(casterDefenseMenu);

    const versus = document.createElement('div');
    versus.className = 'visual-dev-vs-showcase visual-dev-showcase-node';
    versus.innerHTML = `
      <div class="vs-card left"><img src="${invokeA?.tokenImage || invokeA?.artImage || 'assets/invocation-token.png'}" alt=""><span>${invokeA?.name || 'Aliado'}</span></div>
      <div class="vs-badge">VS</div>
      <div class="vs-card right"><img src="${invokeB?.tokenImage || invokeB?.artImage || 'assets/invocation-token.png'}" alt=""><span>${invokeB?.name || 'Enemigo'}</span></div>`;
    els.boardContent.appendChild(versus);
  }
}


function renderCasterStats() {
  const caster = currentPlayer().caster;
  els.casterAtk.textContent = caster.atk;
  els.casterDef.textContent = caster.def;
  els.casterCast.textContent = currentPlayer().castQueue.length ? 'Kasteando' : 'Libre';
  els.casterState.textContent = currentPlayer().castQueue.length ? 'No ataca / No defiende' : 'Listo';
}

function renderCasterWidePanel() {
  const player = currentPlayer();
  const caster = player?.caster;
  if (!player || !caster) return;

  const casterDef = getCasterDefinition(caster);
  const elementId = getCasterDomainId(caster) || player?.domainId || player?.elementId || 'oscuridad';
  const card = casterDef?.cardId && CARD_LIBRARY[casterDef.cardId]
    ? CARD_LIBRARY[casterDef.cardId]
    : createInfoEntityCard({
        id: caster?.cardId || caster?.id || `kasterJ${state.activePlayer}`,
        name: getCasterDisplayName(caster, `Kaster J${state.activePlayer}`),
        type: 'kaster',
        artImage: getCasterArtImage(caster),
        elementId,
      });
  const domain = DOMAIN_ART_DB[elementId] || DOMAIN_ART_DB.oscuridad;
  const casterName = getCasterDisplayName(caster, `Kaster J${state.activePlayer}`);

  if (els.casterWideBg) {
    els.casterWideBg.src = getElementBackgroundForCard(card, elementId);
    els.casterWideBg.alt = `Fondo de ${casterName}`;
  }
  if (els.casterWideArt) {
    els.casterWideArt.src = getCasterArtImage(caster);
    els.casterWideArt.alt = casterName;
  }
  if (els.casterWideSkin) {
    els.casterWideSkin.src = getElementSkinForCard(card, elementId);
    els.casterWideSkin.alt = `Skin ${domain.elementLabel}`;
  }
  if (els.casterWideName) els.casterWideName.textContent = casterName;
  if (els.casterWideTag) els.casterWideTag.textContent = 'KASTER';
  if (els.casterWideDomain) {
    els.casterWideDomain.innerHTML = '';
    els.casterWideDomain.setAttribute('aria-hidden', 'true');
  }
}

function cellCenter(row, col) {
  const boardRect = els.boardContent.getBoundingClientRect();
  const gridEl = row >= 9 ? els.allyGrid : els.enemyGrid;
  const gridRect = gridEl.getBoundingClientRect();
  const localRow = row >= 9 ? row - 9 : row;
  return {
    x: ((gridRect.left - boardRect.left) + ((col + 0.5) / 9) * gridRect.width) / boardRect.width * 100,
    y: ((gridRect.top - boardRect.top) + ((localRow + 0.5) / 9) * gridRect.height) / boardRect.height * 100,
  };
}

function isInside(row, col) { return row >= 0 && row < 18 && col >= 0 && col < 9; }

function hasSpawnMarkerAt(row, col) {
  for (const id of [1, 2]) {
    const markers = state.players[id].spawnMarkers || [];
    if (markers.some(marker => marker.row === row && marker.col === col)) return true;
  }
  return false;
}

function isCastPlacementBlocked(row, col) {
  return isCastPlacementBlockedForPlayer(row, col, null);
}

function isOccupied(row, col) {
  for (const id of [1, 2]) {
    const p = state.players[id];
    if (p.caster && p.caster.row === row && p.caster.col === col) return true;
    if (p.guardians.some(g => g.row === row && g.col === col && g.active)) return true;
    if (p.units.some(u => u.row === row && u.col === col)) return true;
  }
  return false;
}


function isHiddenOpponentUnitForPlayer(viewerPlayerId, ownerPlayerId, unit) {
  return viewerPlayerId && ownerPlayerId !== viewerPlayerId && unitHasActiveFactor(unit, 'hidden');
}

function getHiddenOpponentUnitAtForPlayer(row, col, playerId) {
  if (!playerId) return null;
  const enemyId = getEnemyPlayerId(playerId);
  return (state.players[enemyId]?.units || []).find(unit =>
    unit.status !== 'restoring'
    && unit.row === row
    && unit.col === col
    && unitHasActiveFactor(unit, 'hidden')
  ) || null;
}

function isOccupiedForPlayer(row, col, playerId = null) {
  for (const id of [1, 2]) {
    const p = state.players[id];
    if (p.caster && p.caster.row === row && p.caster.col === col) return true;
    if (p.guardians.some(g => g.row === row && g.col === col && g.active)) return true;
    if (p.units.some(u => {
      if (u.status === 'restoring') return false;
      if (u.row !== row || u.col !== col) return false;
      return !isHiddenOpponentUnitForPlayer(playerId, id, u);
    })) return true;
  }
  return false;
}

function hasSpawnMarkerAtForPlayer(row, col, playerId = null) {
  for (const id of [1, 2]) {
    const markers = state.players[id].spawnMarkers || [];
    for (const marker of markers) {
      if (marker.row !== row || marker.col !== col) continue;
      if (playerId && id !== playerId) {
        const linkedUnit = (state.players[id].units || []).find(unit => unit.spawnId === marker.id && unit.row === row && unit.col === col);
        if (linkedUnit && unitHasActiveFactor(linkedUnit, 'hidden')) continue;
      }
      return true;
    }
  }
  return false;
}

function isCastPlacementBlockedForPlayer(row, col, playerId = null) {
  return isOccupiedForPlayer(row, col, playerId) || hasSpawnMarkerAtForPlayer(row, col, playerId);
}

function chooseHiddenDisplacementCell(incomingPlayerId, hiddenUnit, impactRow, impactCol) {
  const rivalCaster = state.players[incomingPlayerId]?.caster;
  const cells = getCellsInRadius(impactRow, impactCol, 1, false)
    .filter(cell => isInside(cell.row, cell.col))
    .filter(cell => !isOccupied(cell.row, cell.col) && !hasSpawnMarkerAtForPlayer(cell.row, cell.col, null));
  if (!cells.length) return null;
  return cells.sort((a, b) => {
    const da = rivalCaster ? distance(a.row, a.col, rivalCaster.row, rivalCaster.col) : 0;
    const db = rivalCaster ? distance(b.row, b.col, rivalCaster.row, rivalCaster.col) : 0;
    if (da !== db) return da - db;
    return Math.abs(a.col - impactCol) - Math.abs(b.col - impactCol);
  })[0];
}

function displaceHiddenOpponentIfNeeded(row, col, incomingPlayerId) {
  const hiddenUnit = getHiddenOpponentUnitAtForPlayer(row, col, incomingPlayerId);
  if (!hiddenUnit) return false;
  const enemyId = getEnemyPlayerId(incomingPlayerId);
  const destination = chooseHiddenDisplacementCell(incomingPlayerId, hiddenUnit, row, col);
  if (!destination) {
    log(`${CARD_LIBRARY[hiddenUnit.cardId]?.name || 'Invocación oculta'} no encontró casilla libre para desplazarse.`);
    return false;
  }
  const oldLabel = coordLabel(hiddenUnit.row, hiddenUnit.col);
  hiddenUnit.row = destination.row;
  hiddenUnit.col = destination.col;
  log(`${CARD_LIBRARY[hiddenUnit.cardId]?.name || 'Invocación oculta'} se reposiciona desde ${oldLabel} a ${coordLabel(destination.row, destination.col)} dentro del humo.`);
  refreshSmokeZoneEffects();
  return true;
}

function coordLabel(row, col) {
  // Numeración simple por grid: A1 inicia arriba-izquierda en CADA grid.
  const localRow = row >= 9 ? row - 8 : row + 1;
  const localCol = String.fromCharCode(65 + col);
  return `${localCol}${localRow}`;
}

function totalCost(cost) { return Object.values(cost || {}).reduce((a, b) => a + (Number(b) || 0), 0); }

const INVOCATION_COST_CSS_VARS = {
  naitoSutoka: '--cost-invocation-kagero',
  ninjaNaitoSutoka: '--cost-invocation-naito-sutoka',
  ninjaOjoDeBuho: '--cost-invocation-ojo-de-buho',
  samuraiAkari: '--cost-invocation-samurai-akari',
  samuraiToyotomiHideyoshi: '--cost-invocation-toyotomi-hideyoshi',
  samuraiBushiHonorable: '--cost-invocation-bushi-honorable',
};

function getInvocationTotalCostControl(card) {
  if (!card || getCardTypeId(card) !== 'invocation') return null;
  const cssVar = INVOCATION_COST_CSS_VARS[card.id];
  if (!cssVar) return null;
  const fallback = totalCost(card.cost || {});
  return Math.max(0, Math.round(readRootCssNumber(cssVar, fallback)));
}

function distributeInvocationCostByTotal(card, total) {
  const amount = Math.max(0, Math.round(Number(total) || 0));
  if (!amount) return {};
  const elementId = getCardElementId(card);
  // Regla de costo por total:
  // 1 => 1 base, 2 => 2 base, 3 => 2 base + 1 aleatorio,
  // 4 => 3 base + 1 aleatorio, 5 => 3 base + 2 aleatorios,
  // 6 => 4 base + 2 aleatorios, 7 => 4 base + 3 aleatorios,
  // 8 => 5 base + 3 aleatorios, 9 => 5 base + 4 aleatorios, y continúa alternando.
  const fixedBase = Math.max(0, Math.min(amount, Math.floor(amount / 2) + 1));
  const random = Math.max(0, amount - fixedBase);
  const cost = { [elementId]: fixedBase };
  if (random) cost.random = random;
  return cost;
}

function getNormalizedCardCost(card) {
  const controlledInvocationTotal = getInvocationTotalCostControl(card);
  if (controlledInvocationTotal != null) return distributeInvocationCostByTotal(card, controlledInvocationTotal);
  const rawCost = card?.cost || {};
  const normalized = {};
  Object.entries(rawCost).forEach(([key, value]) => {
    const amount = Math.max(0, Number(value) || 0);
    if (!amount) return;
    normalized[key] = (normalized[key] || 0) + amount;
  });
  return normalized;
}

function getCardTotalCost(card) {
  return totalCost(getNormalizedCardCost(card));
}

function getCardCostEntries(card) {
  const cost = getNormalizedCardCost(card);
  const elementId = getCardElementId(card);
  const ordered = [];
  if (cost[elementId]) ordered.push([elementId, cost[elementId]]);
  Object.entries(cost).forEach(([key, value]) => {
    if (key === elementId || !value) return;
    ordered.push([key, value]);
  });
  return ordered;
}

function getCardCostSummary(card) {
  const elementId = getCardElementId(card);
  const elementLabel = (ELEMENTS.find(el => el.id === elementId)?.label) || elementId;
  return getCardCostEntries(card).map(([id, amount]) => {
    if (id === 'random') return `${amount} aleatorio${amount === 1 ? '' : 's'}`;
    if (id === elementId) return `${amount} ${elementLabel}`;
    const label = (ELEMENTS.find(el => el.id === id)?.label) || id;
    return `${amount} ${label}`;
  }).join(' + ') || '0';
}


function getEffectiveCardCost(card, playerId = null) {
  // Costos reales de la carta. El dominio del Kaster no convierte Fuego en Luz ni viceversa.
  return getNormalizedCardCost(card);
}

function getEffectiveCardCostSummary(card, playerId = null) {
  const cost = getEffectiveCardCost(card, playerId);
  return Object.entries(cost).map(([id, amount]) => {
    if (id === 'random') return `${amount} aleatorio${amount === 1 ? '' : 's'}`;
    const label = (ELEMENTS.find(el => el.id === id)?.label) || id;
    return `${amount} ${label}`;
  }).join(' + ') || '0';
}


function log(message) { els.systemLog.textContent = message; }

function hexToRgbParts(hex) {
  const clean = String(hex || '#9b4dff').replace('#', '').trim();
  const full = clean.length === 3 ? clean.split('').map(ch => ch + ch).join('') : clean;
  const value = parseInt(full, 16);
  if (!Number.isFinite(value)) return '155, 77, 255';
  return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`;
}

function getTransitionColorForPlayer(playerId) {
  return getPlayerElementColor(playerId);
}

function showTransition(text, ms = 1050, playerId = state.activePlayer) {
  const line = document.querySelector('.battle-center-line');
  let centerX = window.innerWidth / 2;
  let centerY = window.innerHeight / 2;
  if (line) {
    const rect = line.getBoundingClientRect();
    centerX = rect.left + rect.width / 2;
    centerY = rect.top + rect.height / 2;
  }

  const phaseColor = getTransitionColorForPlayer(playerId);
  els.transitionText.textContent = text;
  els.transitionText.classList.toggle('p2', playerId === 2);
  els.transitionText.classList.remove('fly-phase', 'pinned-top');
  els.transitionText.style.left = `${centerX}px`;
  els.transitionText.style.top = `${centerY}px`;
  els.transitionText.style.setProperty('--phase-rgb', hexToRgbParts(phaseColor));
  els.transitionText.style.setProperty('--phase-color', phaseColor);

  els.transitionOverlay.classList.add('show');
  requestAnimationFrame(() => {
    const rect = els.transitionText.getBoundingClientRect();
    const margin = 18;
    const isOut = rect.top < margin || rect.left < margin || rect.right > window.innerWidth - margin || rect.bottom > window.innerHeight - margin;
    if (isOut) {
      els.transitionText.classList.add('pinned-top');
      els.transitionText.style.left = '50%';
      els.transitionText.style.top = '72px';
    }

    void els.transitionText.offsetWidth;
    els.transitionText.classList.add('fly-phase');
  });

  clearTimeout(showTransition.timer);
  showTransition.timer = setTimeout(() => {
    els.transitionText.classList.remove('fly-phase', 'pinned-top');
    els.transitionOverlay.classList.remove('show');
  }, ms);
}

function queueTransitions(items) {
  if (!Array.isArray(items) || !items.length) return;
  clearTimeout(queueTransitions.timer);
  let delay = 0;
  items.forEach((item, index) => {
    const duration = item.duration ?? 860;
    setTimeout(() => showTransition(item.text, duration, item.playerId ?? state.activePlayer), delay);
    delay += duration;
  });
}

function readRootNumber(name, fallback) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}


function getBoardCellSizePercent(row) {
  const enemyWidth = readRootNumber('--enemy-grid-width', 53.7);
  const enemyHeight = readRootNumber('--enemy-grid-height', 34.5);
  const allyWidth = readRootNumber('--ally-grid-width', 53.7);
  const allyHeight = readRootNumber('--ally-grid-height', 39.5);
  if (row < 9) {
    return { width: enemyWidth / 9, height: enemyHeight / 9 };
  }
  return { width: allyWidth / 9, height: allyHeight / 9 };
}

function adjustCssNumber(name, delta, min, max) {
  const current = readRootNumber(name, 1);
  const next = Math.min(max, Math.max(min, current + delta));
  document.documentElement.style.setProperty(name, String(Number(next.toFixed(2))));
  renderUnits();
}

function adjustGridOpacity(delta) {
  const line = readRootNumber('--cell-line-opacity', 0.28);
  const outline = readRootNumber('--calibration-opacity', 0.22);
  const nextLine = Math.min(0.85, Math.max(0.02, line + delta));
  const nextOutline = Math.min(0.85, Math.max(0.02, outline + delta));
  document.documentElement.style.setProperty('--cell-line-opacity', String(Number(nextLine.toFixed(2))));
  document.documentElement.style.setProperty('--calibration-opacity', String(Number(nextOutline.toFixed(2))));
}

function adjustLineOpacity(delta) {
  const risk = readRootNumber('--risk-line-opacity', 0.55);
  const center = readRootNumber('--battle-center-opacity', 0.72);
  const nextRisk = Math.min(1, Math.max(0, risk + delta));
  const nextCenter = Math.min(1, Math.max(0, center + delta));
  document.documentElement.style.setProperty('--risk-line-opacity', String(Number(nextRisk.toFixed(2))));
  document.documentElement.style.setProperty('--battle-center-opacity', String(Number(nextCenter.toFixed(2))));
}

function writeRootValue(name, value) {
  document.documentElement.style.setProperty(name, value);
}

const boardView = {
  zoom: 1,
  panX: 0,
  panY: 0,
  dragging: false,
  startX: 0,
  startY: 0,
  startPanX: 0,
  startPanY: 0,
};

function resetBoardViewToPanoramic() {
  boardView.zoom = 1;
  boardView.panX = 0;
  boardView.panY = 0;
  boardView.dragging = false;
  writeRootValue('--board-zoom', '1');
  writeRootValue('--board-pan-x', '0px');
  writeRootValue('--board-pan-y', '0px');
  if (els.board) els.board.classList.remove('is-panning');
  renderUnits();
}

function bindBoardZoomAndPan() {
  els.board.addEventListener('wheel', (event) => {
    event.preventDefault();
    const direction = event.deltaY > 0 ? -1 : 1;
    boardView.zoom = Math.min(2.2, Math.max(0.75, boardView.zoom + direction * 0.08));
    writeRootValue('--board-zoom', String(Number(boardView.zoom.toFixed(2))));
    renderUnits();
  }, { passive: false });

  // Evita que el botón central active auto-scroll del navegador.
  els.board.addEventListener('auxclick', (event) => {
    if (event.button === 1) event.preventDefault();
  });

  els.board.addEventListener('pointerdown', (event) => {
    // IMPORTANTE:
    // Click izquierdo NO arrastra la arena. Queda reservado para casillas/fichas.
    // Solo el botón central del mouse permite desplazar/pan.
    if (event.button !== 1) return;

    event.preventDefault();
    boardView.dragging = true;
    boardView.startX = event.clientX;
    boardView.startY = event.clientY;
    boardView.startPanX = boardView.panX;
    boardView.startPanY = boardView.panY;
    els.board.setPointerCapture(event.pointerId);
    els.board.classList.add('is-panning');
  });

  els.board.addEventListener('pointermove', (event) => {
    if (!boardView.dragging) return;
    event.preventDefault();
    boardView.panX = boardView.startPanX + (event.clientX - boardView.startX);
    boardView.panY = boardView.startPanY + (event.clientY - boardView.startY);
    writeRootValue('--board-pan-x', `${Math.round(boardView.panX)}px`);
    writeRootValue('--board-pan-y', `${Math.round(boardView.panY)}px`);
    renderUnits();
  });

  function endDrag(event) {
    if (!boardView.dragging) return;
    boardView.dragging = false;
    els.board.classList.remove('is-panning');
    try { els.board.releasePointerCapture(event.pointerId); } catch (_) {}
  }

  els.board.addEventListener('pointerup', endDrag);
  els.board.addEventListener('pointercancel', endDrag);

  // Doble click: acerca al máximo tomando como centro la coordenada clickeada.
  // Si ya está al máximo, vuelve a tamaño normal.
  els.board.addEventListener('dblclick', (event) => {
    const maxZoom = 2.2;
    const rect = els.board.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;

    if (boardView.zoom < maxZoom - 0.05) {
      boardView.zoom = maxZoom;
      boardView.panX = (rect.width / 2 - localX) * maxZoom;
      boardView.panY = (rect.height / 2 - localY) * maxZoom;
    } else {
      boardView.zoom = 1;
      boardView.panX = 0;
      boardView.panY = 0;
    }

    writeRootValue('--board-zoom', String(Number(boardView.zoom.toFixed(2))));
    writeRootValue('--board-pan-x', `${Math.round(boardView.panX)}px`);
    writeRootValue('--board-pan-y', `${Math.round(boardView.panY)}px`);
    renderAll();
  });
}

window.addEventListener('resize', renderUnits);
window.addEventListener('DOMContentLoaded', init);

window.addEventListener('resize', updateCombatHudFixedPosition);
window.addEventListener('scroll', updateCombatHudFixedPosition, true);
