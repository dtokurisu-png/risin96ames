ROCK / HALLVALLA HTML BASE

Abre index.html con doble clic.
Cuando cambies style.css, guarda y presiona F5 en el navegador.
Si cambias imágenes y no se actualizan, usa Ctrl+F5.

CONTROLES IMPORTANTES EN style.css

1) Grid y transparencia
Busca: CONTROLES VISUALES DEL GRID
- --cell-line-opacity: transparencia de líneas blancas del grid.
- --cell-fill-opacity-a: transparencia de casillas alternas A.
- --cell-fill-opacity-b: transparencia de casillas alternas B.
- --cell-label-opacity: transparencia de etiquetas A1, B1, etc.
- --calibration-opacity: borde/brillo extra para calibrar.

2) Línea central
Busca: LÍNEA CENTRAL
- --battle-center-top-offset: sube/baja la línea central sin mover los grids.
- --battle-center-opacity: transparencia de la línea central.
- --battle-center-glow-opacity: brillo de la línea central.

3) Fichas
Busca: TAMAÑO Y AJUSTE VISUAL DE FICHAS
- --caster-w / --caster-h / --caster-offset-x / --caster-offset-y
- --guardian-w / --guardian-h / --guardian-offset-x / --guardian-offset-y
- --invocation-w / --invocation-h / --invocation-offset-x / --invocation-offset-y

4) Zoom y arrastre
- Rueda del mouse sobre la arena: zoom.
- Click sostenido + arrastrar: desplazar arena.
- Doble click: reinicia zoom y posición.


ACTUALIZACIÓN GRID SEPARADO:
Los controles de opacidad/relleno ya están separados por lado en style.css:
- --enemy-cell-line-opacity
- --enemy-cell-fill-opacity-a
- --enemy-cell-fill-opacity-b
- --enemy-cell-label-opacity
- --enemy-calibration-opacity
- --ally-cell-line-opacity
- --ally-cell-fill-opacity-a
- --ally-cell-fill-opacity-b
- --ally-cell-label-opacity
- --ally-calibration-opacity


ACTUALIZACIÓN LAYOUT ROK
- Se quitó la barra superior.
- Se quitó la barra inferior de elementos.
- Las fases ahora están en columna vertical entre arena y zona de casteo.
- El botón Siguiente fase está debajo de Espera.
- Los elementos consumibles ahora están en el panel izquierdo.
- Por ahora solo se genera elemento Oscuridad.
- Los orbes ya no muestran texto.


VERSION BETA v0.12
- El click izquierdo ya no arrastra la arena.
- El click izquierdo queda libre para casillas y fichas.
- El desplazamiento/pan de la arena ahora usa botón central del mouse.
- La rueda del mouse sigue controlando el zoom.
- Las casillas ocupadas ya no quedan bloqueadas por el cursor de arrastre.


VERSION BETA v0.13 CORREGIDA
- Revertida desde Rok Beta v0.12 como base estable.
- Se eliminó el intento anterior de panel raro del Kaster.
- El panel de info del Kaster ahora es un panel ancho separado.
- El panel del Kaster se extiende desde la izquierda del contador de turno hasta el borde derecho de la ventana.
- La imagen del Kaster dentro del panel está compuesta como carta: background + arte + skin.
- La carta del Kaster mantiene proporción 2:3 y no se estira.
- Los textos/stats se distribuyen dentro del panel ancho.


VERSION BETA v0.14
- Aplica la regla visual nueva: el skin define la proporción de todas las cartas.
- Proporción detectada del skin actual: 1595x1595.
- La carta del Kaster, las cartas del Spellbook y la ventana de info usan esa proporción.
- El panel ancho del Kaster conserva su ubicación pero reduce su altura.
- Textos visibles actualizados a Kaster/Kasteo/Kastear/Kasteando.
- Al hacer click en una carta se abre ventana grande de información.
- La ventana muestra miniatura, nombre, DAÑO y VIDA.
- Botones: Kastear y Salir.
- Kastear activa las casillas alrededor del Kaster.
- Click en casilla válida manda la invocación a la zona de kasteo.
- La zona de kasteo muestra la ficha/token + reloj de arena + fases restantes.


VERSION BETA v0.15
- Se puede abrir la ventana/view de carta desde cualquier fase.
- El botón Kastear queda bloqueado si no estás en fase de Kasteo o no tienes elementos suficientes.
- Las casillas alrededor del Kaster ahora resaltan más fuerte en blanco y usan un ícono visual de punto de kasteo.
- La zona de kasteo ahora muestra dos badges separados: reloj de arena y número de fases.
- Las fichas en zona de kasteo tienen brillo blanco.
- Al kastear una invocación se crea un marcador de respawn en la casilla elegida con miniatura de la carta y glow del elemento.
- Las fichas que entran en zona de kasteo hacen una animación de caída/aparición.


VERSION BETA v0.16
- El ícono visual de las casillas de kasteo ahora cubre toda la extensión de la casilla.
- Se reemplazó por la referencia nueva entregada por el usuario.
- Se aumentó su presencia visual para que se aprecie completa en cada casilla válida.


VERSION BETA v0.17
- El reloj de arena en zona de kasteo ahora es más grande.
- El número de fases queda superpuesto como esquinita sobre el reloj.
- El marcador de respawn en arena también muestra reloj de arena + número mientras la ficha espera entrar.
- La animación de entrada ahora cae desde arriba y hace un pequeño pulso al aterrizar.
- Hover cruzado: ficha en kasteo ↔ carta de respawn (pulso).
- Hover cruzado: ficha en arena ↔ carta de respawn (iluminación blanca).


VERSION BETA v0.17A
- Base estable: v0.17.
- Se redujo aprox. 40% la intensidad visual de las casillas de Kasteo.
- El badge de reloj/número sobre la carta de respawn en arena se hizo más pequeño.
- Se corrigió el hover cruzado: al pasar sobre la carta de arena ahora sí palpita la ficha en zona de Kasteo.


VERSION BETA v0.18A
- Base: v0.17A estable.
- Se agregó outline blanco a Kaster, Guardianes e Invocaciones.
- Se agregó glow del color del elemento, más sutil, a las fichas en arena.
- Hover sobre fichas ajustado: blanco más suave, menos parpadeante.
- Se agregó lógica base de movimiento en Resolución.
- Kaster: movilidad completa, velocidad 1.
- Invocación: movilidad sostenida vertical, velocidad 3.
- Se agregaron flechas visuales en las casillas válidas de movimiento.


VERSION BETA v0.19
- La ficha que termina Kasteo ahora viaja visualmente desde la zona de Kasteo hasta su casilla de arena.
- La ficha temporal se desplaza en línea recta y reduce su tamaño durante el recorrido.
- Al llegar hace un pequeño pulso antes de aparecer como ficha real en arena.
- Se redujo el outline/glow de las fichas aproximadamente un 80% para que no se vea tan pintado.
- Doble click en una coordenada de la arena ahora hace zoom máximo centrado en esa coordenada; doble click otra vez resetea.


VERSION BETA v0.20
- Flechas de movimiento cuadradas, sin esquinas suavizadas.
- Flechas escaladas al tamaño completo de la casilla de arena.
- Flechas renderizadas por encima de las fichas para poder clicarlas siempre.
- Opacidad de flechas reducida aproximadamente 40%.
- Transición de cambio de fase/jugador animada de izquierda a derecha.
- La transición ahora se centra sobre la línea central iluminada de la arena.


VERSION BETA v0.21
- Fix: el hover cruzado del punto de respawn ya no reinicia la animación de entrada del item en zona de Kasteo.
- El reloj de arena del punto de respawn ahora queda centrado sobre la carta.
- Las casillas/sprites de Kasteo suben por encima de todo mientras eliges la ubicación de Kasteo.
- Se agregó orden visual por profundidad: una ficha ubicada más abajo en la arena siempre queda por encima de una ubicada más arriba.
- Se suavizó el hover del punto de respawn para que no se vea tan grande.
- Se refinó la transición de fase/jugador para que salga limpia, sin borde y con degradado lateral.


VERSION BETA v0.22
- La transición de fase ahora cambia de color según el jugador/energía activa.
- Se refinó la transición para evitar el parpadeo previo y mantener el degradado lateral sin borde.
- Las fichas ahora usan un hitbox pequeño en la base: el sprite completo ya no bloquea clicks sobre cartas/casillas detrás.
- Se mantiene el depth sorting visual por fila, pero la interacción ya no queda atrapada por sprites largos superpuestos.


VERSION BETA v0.23
- Se rediseñó la transición de turno/fase con estilo de overlay cinematográfico.
- Fondo negro translúcido centrado, sin borde.
- Laterales con degradado a transparente.
- Texto blanco grande con glow del color del elemento/jugador activo.
- Mantiene la referencia de posición en el centro de la arena.


VERSION BETA v0.24
- Se redujo el tamaño del texto de la transición.
- La transición ahora usa solo textos cortos: INICIA EL COMBATE, EXTRACCIÓN, KASTEO, RESOLUCIÓN, TERMINA EL TURNO y JUGADOR X.
- Se agregó secuencia de transiciones encadenadas al inicio y al cambio de jugador.
- Se eliminó el formato cargado tipo “Jugador X · Fase de ...” en la transición grande.


VERSION BETA v0.25
- Se quitó la pausa entre avisos encadenados del sistema de transición.
- La transición ya no se queda detenida en el centro: ahora cruza de izquierda a derecha de forma continua.
- Se mantuvo el estilo cinematográfico con degradado lateral y glow del color activo.


VERSION BETA v0.26
- La ficha en zona de Kasteo ahora ejecuta primero Drop-in y luego Landing Impact.
- El hover cruzado/palpitación queda bloqueado durante la caída inicial.
- La palpitación solo se activa después de terminar la animación de caída.
- Se separó la animación de nacimiento de la animación de interacción para evitar reinicios visuales raros.


VERSION BETA v0.27
- El Spellbook del jugador local/J1 permanece visible en todo momento, incluso durante el turno del enemigo.
- La vista de carta sigue funcionando desde cualquier fase.
- El botón Kastear queda bloqueado cuando no es turno del jugador local, aunque el Spellbook siga visible.
- Los elementos visibles se mantienen como los recursos del jugador local.
- Se prepara el flujo para futuras pruebas host/invitado sin esconder el Spellbook.


VERSION BETA v0.29
- Calibrada la extracción con la textura enviada por el usuario.
- La carta de extracción ahora nace encima de la fuente inferior izquierda para J1.
- Para J2 queda calibrada encima de la fuente superior derecha.
- Corregidas coordenadas locales del layer de extracción: ya no usa viewport directo dentro del board.
- Los orbes ahora viajan correctamente hacia la barra vertical izquierda.
- La carta de elemento conserva la proporción de la skin usando --card-skin-aspect.


VERSION BETA v0.30
- La extracción ya no usa porcentajes independientes.
- Ahora cada jugador tiene una baraja de elementos simulada de 34 cartas:
  - 25 cartas x1
  - 5 cartas x2
  - 3 cartas x3
  - 1 carta x4
- La baraja se baraja aleatoriamente al iniciar.
- En cada fase de Extracción se roban 2 cartas de esa baraja.
- Si se agota la baraja de elementos, se reconstruye y se vuelve a barajar.
- Esto hace que los x3/x4 aparezcan con rareza real de composición de mazo, no por tirada suelta.


VERSION BETA v0.30A
- Base restaurada desde v0.30.
- Se agregó únicamente el sistema visual de fuente mágica.
- Controles CSS disponibles en :root para tamaño, posición, frecuencia, velocidad, distancia y escala de partículas.
- Cada fuente toma el color del elemento activo mediante --fountain-color.


VERSION BETA v0.30C
- Se usó el CSS entregado por el usuario como style.css.
- Fuente rival usa siempre el color de su propio elemento.
- Durante extracción: partículas aceleradas + brillo temporal de generación, luego vuelve a la normalidad.
- Mantiene la baraja de elementos simulada (25 x1, 5 x2, 3 x3, 1 x4).


VERSION BETA v0.30D
- J1 usa extracción genérica de Oscuridad.
- J2/rival usa extracción genérica de Fuego.
- Se agregaron assets: element-fire-x1/x2/x3/x4 y element-card-bg-fire.
- La fuente rival ahora sí puede leerse visualmente como Fuego.


VERSION BETA v0.30E
- La fase de Extracción avanza automáticamente a Kasteo cuando las cartas extraídas son elementos normales.
- La lógica queda preparada para detenerse si más adelante una carta de fuente no-elemento aparece en la extracción.
- Mantiene J1 Oscuridad y J2 Fuego genérico.


VERSION BETA v0.30F
- Se corrigió la animación de entrada en zona de Kasteo para que no se reinicie al hacer render/click en Kaster.
- La intro ahora usa introStarted/introEndsAt y un finalizador estable.
- Al terminar la intro se hace renderAll para activar hover cruzado entre ficha de Kasteo y carta de respawn.
- Se corrigió el bloqueo visual de .intro-locked en marcador de respawn después de terminar la intro.


VERSION BETA v0.30G
- Cuando termina el turno y cambia de jugador, la vista de la arena vuelve automáticamente a zoom 1 y pan 0.
- Esto permite que la extracción del nuevo jugador se vea completa en vista panorámica.
- El aviso de fase intenta salir sobre la línea central; si queda fuera del viewport por zoom/pan, se ancla arriba de la pantalla.


VERSION BETA v0.30H
- Kasters en E5 relativo por lado.
- MOV 10 temporal para Kaster e invocación.
- 3 Naito Sutoka para ambos jugadores.
- Guardianes de ambos lados con Resistencia 5.
- View al clicar Kaster, invocación o Guardián fuera de selección de movimiento.
- Nuevos stats en view: MOV, Kasteo y Restauración.
- Daño flotante rojo.
- Kaster recibe 1 daño por fase si está en zona enemiga.
- Kaster no puede kastear desde zona enemiga.
- Prototipo de ataque a zona de riesgo: si una invocación llega a la fila de riesgo enemiga, extrae 1 carta extra y entra en restauración.


VERSION BETA v0.30I
- Ajustado badge de resistencia de Guardianes para usar la misma coherencia visual del reloj de arena: icono separado + número de esquina.
- Escudo de ladrillos blanco plano, vectorizado por CSS.


VERSION v1.01
- Resistencia de Guardianes reducida visualmente a la mitad.
- Las invocaciones que entran durante Resolución reciben movesLeft inmediatamente para poder moverse.
- Hitbox de invocaciones ampliado para seleccionar movimiento con más facilidad.
- Botón i del HUD de elementos ahora abre panel de versión/parche.


VERSION BETA v4.0
- IA básica para J2.
- J2 avanza solo Kasteo y Resolución.
- J2 intenta kastear Naito si tiene recursos y espacio.
- J2 mueve unidades hacia amenazas, Kaster rival o zona de riesgo.
- Botón Siguiente Fase bloqueado durante turno IA.


VERSION BETA v4.1
- Target & Attack Core.
- Las invocaciones tienen alcance y perfil de ataque.
- Click en objetivo enemigo en rango muestra Info / Seleccionar.
- Seleccionar objetivo despliega acciones junto a la invocación: Dañar / Cancelar.
- Daño a Kaster, Guardián e invocaciones.
- Zona de riesgo se puede seleccionar como objetivo y extrae 1 carta extra.
- Al morir, la invocación sale de arena y vuelve al slot original del Spellbook.
- IA rival intenta atacar antes y después de moverse.


VERSION BETA v4.2
- Corrección de selección de objetivo y daño manual.
- Se agrega alcance/tipo de ataque al view grande clasificado por Daño, Vida, Kasteo/Restauración y Movilidad.
- Naito tiene ataque cuerpo a cuerpo, alcance 1, daño 3.
- IA intenta atacar antes/después de moverse.


VERSION BETA v4.3
- Naito Sutoka baja a daño 1 para pruebas de combate sostenido.
- El Kaster tiene defensa 2 y el view muestra DEFENSA en la fila de VIDA.
- Cuando J2 ataca el Kaster de J1, se abre menú Defender / Contraatacar.
- Si el Kaster tiene cartas en Kasteo, no puede reaccionar y recibe el daño completo.
- Se agregan animaciones visuales de restauración y retorno al Spellbook.


VERSION BETA v4.4
- Movimiento obligatorio en Resolución: no se puede terminar fase si una ficha activa aún puede moverse.
- Los ataques contra invocaciones ahora entran en combate sostenido.
- El menú usa Combatir en vez de Dañar/Seleccionar para iniciar combate.
- Al entrar o resolver combate aparece COMBATIENDO antes del daño.
- En combate sostenido, golpea primero la invocación del jugador activo y luego responde la rival si sigue viva.


VERSION BETA v4.5
- Se normalizó la velocidad de invocaciones a MOV 3.
- El Kaster queda con MOV 2 para que no se sienta tan lento, pero tampoco atraviese media arena en una acción.
- Mantiene combate sostenido y movimiento obligatorio de v4.4.


VERSION BETA v4.6
- Corrección real de velocidad: invocaciones MOV 3.
- Corrección real de velocidad: Kaster MOV 2.
- Se reemplazó el TEST_MOVE_SPEED viejo que seguía en 10.


VERSION BETA v4.7
- Movimiento obligatorio solo para invocaciones. El Kaster ya no bloquea el cierre de Resolución.
- Invocaciones muestran indicadores de daño y vida en arena con iconos blancos vectoriales.
- Números/círculos de resistencia, daño y vida agrandados para mejor lectura.


VERSION BETA v4.8
- Los badges de invocación ahora quedan abajo de la ficha, uno al lado del otro.
- Se mantiene la misma coherencia visual que el badge de resistencia de Guardianes: icono principal + número superpuesto.
- No se tocó lógica de combate ni movimiento en este parche.


VERSION BETA v4.9
- Iconos de guardianes/invocaciones quedan sin contenedor visual.
- El contenedor circular queda solo en los números.
- Agregados controles CSS para tamaño y posición de iconos/números de resistencia, daño y vida.


VERSION BETA v5.0
- Agregado botón CSS en el HUD de elementos.
- Permite refrescar style.css sin F5 y sin reiniciar estado/partida.
- Implementado con cache-buster sobre el link #mainStylesheet.


PARCHE v5.0.1
- Controles separados para badges de daño y vida.
- El movimiento de un badge ya no arrastra al otro.
- Espada de daño rehecha para verse como espada.


PARCHE v5.1 - PAQUETE LOCAL DE ESCRITORIO
- Se vuelve al flujo de trabajo por ZIP/local para avanzar más rápido.
- Mantiene controles individuales de badges de daño y vida.
- Mantiene botón CSS para refrescar style.css sin reiniciar el juego.
- GitHub queda como respaldo/versionado especial, no como flujo principal por ahora.


PARCHE v5.1.1
- Se agregó assets/weapons con SVGs de armas.
- Se agregó WEAPON_DB en game.js.
- Naito Sutoka usa arma con cadena en su badge de daño.
- Armas consumibles marcadas: arma arrojadiza, daga, hacha, explosivos y munición balines.


PARCHE v5.1.3
- Limpieza de CSS para que los controles de badges funcionen.
- Daño y vida tienen controles independientes.
- Armas y corazón quedan planos, sin brillo ni outline.


v5.1.6.1
- Reempaquetado para corregir problema de descarga del v5.1.6.
- Contenedor negro solo detrás de iconos de daño/vida.
- Iconos encima del contenedor y números fuera.
- Valores de Guardianes conservados.


v5.1.6.2
- Corrige la posición del contenedor negro para que quede realmente detrás de los iconos superiores.
- El eje Y del panel ahora representa el centro del panel, no la esquina superior.
- Iconos por encima, números fuera y Guardianes intactos.


v5.2.0
- Arena japonesa nueva como assets/arena.webp. Se conserva backup como assets/arena-egipto-backup.webp.
- Controles CSS de ajuste de arena: --arena-adjust-x/y/scale/origin.
- Regla: no se puede seleccionar como objetivo una invocación que ya esté en batalla.
- HUD lateral de combates activos con mini-cartas de relación de aspecto tipo skin.
- Vida dinámica: rojo si está herida, verde si está por encima de vida base.
- Pendiente: vida base vs vida máxima modificada y origen de bonus de vida.


v5.2.2
- HUD de combate dentro de una franja lateral derecha del tablero.
- Scroll vertical si hay muchos combates activos.
- HUD reducido para caber sin deformarse.
- Mini-cartas mantienen proporción de carta/skin.
- Fix visual: vida normal visible y fallback duplicado de daño oculto.


v5.2.3
- HUD de combate flotante con controles CSS left/top.
- Mini-cartas con ancho/alto fijos para respetar proporción.
- Scroll interno si hay muchos combates.
- HUD puede sobresalir del tablero sin cortarse.


v5.2.4
- Las cartas de respawn bloquean nuevas ubicaciones de kasteo.
- No se pueden crear dos puntos de respawn en la misma casilla.
- La IA también evita casillas con respawn al kastear.
- Las casillas con respawn ya no se iluminan como válidas durante kasteo.


v5.2.5
- Restaurado overflow hidden en .board para que el zoom/pan de la arena no invada el GUI.
- El HUD de combate se monta fuera de boardContent, sobre boardPanel.
- El HUD ya no participa del zoom de la arena.


v5.2.6
- HUD de combate movido a document.body con position: fixed.
- El HUD ya no es hijo del tablero ni de boardContent.
- .board mantiene overflow hidden para recortar arena y zoom correctamente.
- El HUD usa coordenadas calculadas desde el rectángulo real del tablero.


v5.2.7
- Selección de objetivo corregida.
- Una invocación puede quedar seleccionada para atacar aunque no tenga movimiento restante.
- Menú contextual: Combatir contra invocaciones; Atacar contra Guardianes/Kaster.
- Las invocaciones trabadas en combate no pueden seleccionar nuevos objetivos.


v5.2.8
- HUD de combate con ancla inicial y arrastre manual con clic sostenido.
- El HUD puede recolocarse libremente en pantalla durante la partida.
- Mini-cartas del HUD forzadas a proporción real de carta (34x48) sin deformación.


v5.2.9
- Arrastre del HUD corregido con pointer events.
- HUD anclado inicialmente al borde derecho real de la cuadrícula.
- Offset CSS para mover el ancla sin romper overflow.


v5.3.0
- Ritmo de combate ralentizado.
- Textos flotantes duran más tiempo.
- Nueva animación de choque entre invocaciones antes del daño.
- Pausas más largas para que se entienda la secuencia: declarar combate -> choque -> daño -> respuesta.


v5.3.1
- Atacar estructura/Kaster no crea combate ni engagedWith.
- Atacar estructura consume acción, pero la invocación sigue seleccionable por otros enemigos.
- Nueva animación unilateral de ataque: crece, avanza hacia el objetivo, vuelve a tamaño normal y regresa.


v5.3.2
- Si una invocación muere en combate, la invocación sobreviviente entra en restauración.
- La invocación derrotada vuelve al Spellbook.
- Atacar Guardián/Kaster no activa esta restauración de combate porque no crea combate.


v5.3.3
- Atacar una estructura ancla la invocación a esa estructura y elimina su movilidad obligatoria.
- Una invocación anclada a estructura puede ser seleccionada por enemigos; si entra en combate, pierde el ancla de estructura.
- Atacar estructura ejecuta con un solo botón, sin segunda ventana de Atacar.
- Los contadores de vida/resistencia se refrescan justo después de cada golpe.


v5.3.4
- HUD de combate colocado dentro del campo/boardContent.
- Las invocaciones ancladas a una estructura hacen daño sostenido cada Resolución propia.
- Optimización del lunge para reducir lag: menos filtros pesados y transform con translate3d.


v5.3.5
- HUD de combate ahora usa mini-cartas con badges de daño/vida en la propia carta.
- Removidos iconos externos de daño/vida en HUD de combate.
- Menú de objetivo reforzado para evitar ventanas duplicadas.
- IA ralentizada por etapas: selección, kasteo, movimiento, ataque y cambio de fase.


v5.3.6
- Zona de kasteo local solo muestra kasteos del jugador local.
- Agregado HUD enemigo mini en esquina superior izquierda del campo.
- HUD enemigo muestra orbes de recursos rivales en horizontal y mini fichas casteándose.


v5.3.6.1
- Reubicado el HUD enemigo mini a la esquina superior izquierda del campo.
- El HUD ahora se extiende en horizontal sobre la franja superior, fuera de la cuadrícula jugable.


v5.3.6.2
- Fix fuerte para evitar triple ventana de Info/Combatir.
- Los menús de objetivo ahora usan ID único y remoción agresiva antes de crear otro.
- Los botones se disparan una sola vez para evitar clicks dobles.


v5.3.6.3
- Reemplazado el reloj de arena por assets/icons/factor-enfriamiento-restauracion.svg.
- Marcador de restauración movido arriba de la ficha con controles CSS.
- Iconos de tiempo/casteo/respawn planos, sin fondo.


v5.3.6.4
- Reemplazo real del reloj de arena por SVG inline en casteo, respawn y restauración.


v5.3.7.1
- Menús de objetivo/acción blindados contra triple aparición.
- Añadidas llaves de acción por atacante+objetivo y candado temporal.
- stopImmediatePropagation en hitbox y botones del menú.


v5.3.8
- Eliminado el sistema viejo de dos pasos para atacar/combate.
- Eliminado el segundo menú Combatir/Cancelar.
- Rehecho desde cero el menú de objetivo: un único menú Info + Combatir/Atacar.
- Combatir/Atacar ejecuta directamente la acción.

v5.3.9
- Reemplazado el indicador CSS de movimiento pendiente por el nuevo SVG `assets/indicators/indicador-movimientos-faltantes.svg`.
- Aplicado color verde musgo al indicador mediante máscara CSS (`#556B2F`).
- Conservada la lógica existente: el badge sigue apareciendo solo en invocaciones con movimiento obligatorio pendiente.



v5.3.10
- Corrección urgente del indicador de movimiento obligatorio.
- Se reemplazó el render por máscara CSS por un <img> SVG directo para evitar que algunos navegadores oculten el icono.
- Se mantiene el color verde musgo del asset y la lógica original de aparición.


v5.3.11
- Se agregan skins de carta para Fuego, Agua y Tierra.
- Fuego ya usa su skin propia en las cartas de extracción.
- Agua y Tierra quedan preparadas en assets/configuración base para futuras cartas.


v5.3.12
- Se agrega la zona de dominio en la carta con composición visual de Elemento + Atributo.
- Se integran artes de dominio para Fuego, Agua, Tierra y Oscuridad.
- Se expone window.ROK_DOMAIN_CONTROLLER para ajustar la posición Y y el orden Z de las capas del dominio.
- Ejemplo: ROK_DOMAIN_CONTROLLER.set('base', { elementOffsetY: '-2px', attributeOffsetY: '4px', elementZ: 2, attributeZ: 3 });


v5.3.14
- Corrige el parche de controles que rompía el juego.
- El dominio solo aparece en el view/modal, no en miniaturas del Spellbook.
- Agrega círculo/fondo con controles de tamaño, X, Y, Z y opacidad.
- Controles rápidos arriba del style.css para dominio, movimiento pendiente, ataque y vida.


v5.3.16
- Se integran los ajustes CSS manuales del usuario en los controles rápidos.
- Base tomada de v5.3.15 con mezcla de barajas elementales.


v5.3.17
- Se reemplazan los orbes temporales/permanentes por iconos de costo elemental: oscuridad, agua, tierra y fuego.
- La animación de extracción ahora mueve el icono elemental real hacia el HUD.
- El HUD local y mini HUD enemigo muestran esos iconos según el elemento extraído.
- La zona de dominio del view de carta se renderiza como capa sobre la miniatura para que pueda sobresalir sin recortarse.


v5.3.18
- Controles rápidos para el badge/icono de restauración sobre fichas.
- Spawn markers y panel VS usan skin, borde y brillo según el elemento efectivo de la carta/jugador.
- El panel VS parpadea cuando una invocación recibe daño.
- Animaciones de muerte/retorno y restauración más lentas, con arco visual, brillo y partículas elementales.
- El aterrizaje desde zona de kasteo a arena genera pulso elemental en la casilla de destino.


v5.3.20
- Kasteo se salta automáticamente si el jugador activo no tiene cartas casteables.
- Se muestra transición SIN KASTEOS y luego RESOLUCIÓN.
- La comprobación respeta recursos, zona del Kaster y cartas en mano.

v5.3.21
- Se agrega modo de edición visual en el panel de versión/parche para mostrar u ocultar indicadores temporales como restauración.
- La extracción de recursos ahora coloca los iconos uno por uno hacia su casilla final con burst de aparición.
- Recursos ordenados por elemento principal/secundario y orden de llegada dentro de cada grupo.
- Limpieza de labels/cajas fantasma en recursos y hitboxes de invocaciones durante combate.


v5.3.22
- HUD enemigo: recursos y cola visual crecen en horizontal, no hacia abajo.
- Modal/view de carta: el dominio puede sobresalir, pero el arte de la miniatura queda recortado dentro del skin.


v5.3.25
- Agrega cualidades Asesino y Acechador con iconos clicables en el view de carta.
- Naito Sutoka recibe gender female, raza Humano y cualidades Asesino/Acechador.
- El modal de info muestra descripción y tags para raza/cualidades.


v5.3.28
- Se integra base de datos de armas/tipos de ataque usando nombre y descripción larga desde armas_wix_import.xlsx.
- Se agrega Munición: balines.
- Las armas aparecen como chips clicables en el view/modal de carta y en la línea de ataque.
- El consumo queda como condición especial aplicable por carta/efecto, no como propiedad fija del arma base.


v5.3.29
- Se separa la categoría raíz de los tags con flecha visual tipo triángulo.
- Se elimina el chip inferior duplicado del tipo de carta.
- El tipo de carta queda solo arriba junto al nombre/tipo principal.


v5.3.32
- El nombre del view/modal de carta se desplaza 15% a la derecha para despejar la composición del dominio.
- Las pestañas del Spellbook cambian a Página 1, Página 2 y Página 3.
- Se agrega --ctrl-card-info-name-shift-x para ajustar ese desplazamiento desde CSS.


Patch v5.3.47
- Se agrega costo visual en la línea de kasteo.
- Nightos Sioka usa costo 5 (2 base + 3 aleatorio).
- Pago de costo reconoce el componente aleatorio.


Patch v5.3.48
- Selector manual para costo aleatorio cuando existen varios elementos no-base disponibles.
- El costo aleatorio no consume el elemento base.


Patch v5.3.52
- El costo aleatorio ahora puede consumir cualquier recurso restante, incluyendo sobrantes del dominio base.
- El selector muestra el costo base obligatorio como bloqueado y luego deja escoger la parte aleatoria.


Patch v5.3.53
- Se oculta/elimina el círculo de costo de las miniaturas de carta.
- El contador de extracción x1/x2/x3/x4 usa el color del elemento extraído.


Patch v5.3.56
- Naito Sutoka pasa a ser Kagero, Ichisoku (Ninja).
- Se agrega familia Ninja clickeable con estrella.
- Se agrega Golpe crítico 2 con 4 PDA otorgado por Asesino.
- Precisión y factor crítico usan PDA en UI.
- Se agrega zona de habilidades/poder compacta.


Patch v5.3.57
- Corrige rutas de arte/token de Kagero.
- Agrega fondos transparentes para el arte del personaje.


Patch v5.3.58
- Corrige regex rota del nombre/familia que impedía abrir el modal de Kagero.
- Restaura fondo de carta con asset existente y fallback visual.


Patch v5.3.59
- Factor Golpe crítico validado contra el Excel de factores.
- El número de nivel del factor se acerca al ícono.
- Habilidades y poder se mueven a la columna derecha libre del modal, alineadas con las filas de estadísticas.
