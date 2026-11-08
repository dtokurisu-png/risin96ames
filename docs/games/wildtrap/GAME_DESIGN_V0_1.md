# WILDTRAP — Diseño de expediciones y criaturas v0.1
Fecha: 2026-11-08
Estado: concepto y alcance propuesto; código NO iniciado. Nombre provisional.
Objetivo: videojuego cooperativo 3D/2.5D de cámara elevada, 1–4 jugadores, una jungla fija por sectores, expediciones diferentes por combinaciones de objetivos, criaturas, nidos y decoración. Meta ambiciosa: beta de 6 semanas (~96 horas), primera versión comercial hacia 10 semanas (~160 horas) si la validación y la plataforma lo permiten. No son garantías.

## Premisa irrenunciable
Entrar en una jungla, localizar y sustraer **huevos de criaturas**, decidir cuánto riesgo asumir, completar objetivos de cooperación y **extraer con el botín**. Los compañeros pueden ayudar, equivocarse, despertar guardianes, perder equipo y desencadenar rescates. El juego debe ser divertido por decisiones sociales, riesgo vs recompensa y aleatoriedad, no por recorrer muchos mapas.

## Mecánica principal
- No hay trampas como sistema principal de huevos: **mochila con capacidad limitada** (por ejemplo 3 espacios base, sujeto a balance). Huevos grandes pueden ocupar más capacidad.
- Nidos escondidos en ubicaciones variables de sectores del **mismo** mapa. Criaturas comunes y raras, más guarida opcional de criatura guardiana.
- Robar huevos requiere elegir sigilo, velocidad o preparación. Despertar cuidadores provoca persecución/alerta, refuerzos y posible criatura élite (variante más grande/fuerte de especie existente).
- Caer incapacitado no expulsa automáticamente de partida: la mochila queda en el suelo; otros pueden recogerla si tienen espacio, defender al compañero, reanimarlo o regresar más tarde. Evitar espectadores inactivos largos; reaparición segura sin botín como opción.
- Cada jugador elige si incursiona en la guarida opcional o espera en zona segura y se retira con su botín. Definir reglas de extracción parcial y cómo se acreditan recompensas individualmente.
- La guarida especial puede presentar dragón, bestia cristalina u otra criatura cautivadora. Primera versión: conseguir huevo por sigilo. FUTURO: capturar criatura adulta debilitándola mediante mascotas en vez de matar con armas.
- Huevos → incubación/eclosión en lobby/refugio → mascota del jugador. Adultos encontrados/capturados en fase posterior tienen estadísticas predefinidas, huevos permiten más personalización en crecimiento.
- Tienda NPC: vender huevos que no se desean, incubar huevos propios, obtener comida/materiales para crecimiento, intercambio con amigos posteriormente (servidor valida propiedad y transacciones).

## Mascotas
- Son **funcionales**, no solo cosméticas. Roles iniciales: protector (escudo/repele), rastreador (señala huevos/recursos), sanador (cura/reanima); reutilizar componentes para otras especies.
- Progreso con cuidado, comida elaborada mediante recursos y habilidades de lista predefinida; 2 habilidades equipables propuesta. Sin árboles enormes.
- Si una mascota aparece enferma, tratamiento disponible sin pagar. En ausencia no pierde irreversiblemente su progreso ni muere; que el jugador sienta cariño, no coerción.
- Recursos: comunes para alimento ordinario en cantidad suficiente; ingredientes especiales/raros para mejoras, recetas y variantes. Botín cooperativo no debe ser diseñado para provocar peleas reales y acoso por la propiedad.
- Intercambiar mascotas, huevos, ingredientes y otros bienes entre amigos: meta posterior con autorizaciones y transacciones anti-duplicación. Seguridad adicional si juega público infantil.

## Aleatoriedad
- Una arena estable con sectores, caminos, puntos de interés, cueva y extracción. Geometría principal, colisiones y navegación mantienen invariantes.
- Semilla de partida reproducible para eventos. Elegir **tres objetivos principales** aleatoriamente de un catálogo con restricciones; p. ej. robar huevo, encontrar código/cerrar compuerta, transportar suministros, rescatar criatura, activar mecanismo, investigar guarida.
- Población procedural dentro de presupuesto de unidades: 3–4 arquetipos enemigos iniciales, variantes élite, rutas/patrullas y nidos aleatorios; no necesariamente las mismas especies en toda partida.
- Decoración procedimental por slots validados: aprox. 10 modelos de árbol/vegetación y 3–4 tonos/texturas de suelo como objetivo inicial. Mantener legibilidad, rutas despejadas y evitar estructuras imposibles. Se combinan por tema/semilla sin reconstruir navmesh.
- Estado meteorológico/elemental futuro: lluvia → apariciones acuáticas, sol → fuego/arena, nieve → hielo, tormenta → rayo; drops elementales para habilidad adicional de mascota. **No está en primer MVP**.

## Personaje y combate
- Personajes con movimiento y sin niveles de stats complejos. Armas con mejoras moderadas posteriores: pistola equilibrada, escopeta potente/corta, rifle largo/lento, ametralladora rápida/débil. Primera versión con dos armas para limitar trabajo.
- Combate contra enemigos y oleadas controladas por amenaza, no un campo de exterminio constante. Sigilo/ruido, telegráficos, IA simple basada en estados.
- Evitar diseños/objetos visuales que reproduzcan IP conocida.

## Monetización — decidir tras pruebas
- Usuario propone **bolso premium con más espacio**: conveniencia personal, pero en cooperativo repercute en rescates, botín y presión a compañeros. Opciones de diseño: 1 ampliación pequeña adquirible tanto con juego como por pago; adicional premium solo cosmético o habilitada por contenido normal. Probar impacto antes de vender capacidad exclusiva.
- Venta barata con paquetes de moneda, por ejemplo $4.99 = 1,000 créditos (ilustrativo), y múltiples artículos de 50–450 créditos: accesorios y skins de mascota, incubadoras visuales, herramientas/armas cosméticas, gestos, decoraciones para habitación y alimentos elaborados de acceso gratuito.
- **No vender cura necesaria por enfermedad, huevos de poder exclusivo ni ventajas tan grandes que hagan inútil a compañeros gratuitos**. No colocar monetización como obstáculo a diversión gratis.
- Alternativas a evaluar: premium económico de entrada vs free-to-play con micropagos. No asumir que F2P se monetiza sin base activa; fijar un modelo antes de integrar pagos. Si vende moneda virtual, informar precio real claramente y gestionar saldos/reembolsos según plataforma.

## Primera versión vendible — propuesta estricta
- 1 mapa 3D compacto de jungla, 4–5 sectores; 10 modelos de vegetación reutilizables y 3 variaciones visuales de suelo si no complican QA.
- Movimiento 3D/2.5D y cámara, 1 avatar base con skins muy simples; 2 armas básicas.
- 3 clases de enemigos reutilizando sistema IA + una variante élite; 1 gran guardián de guarida opcional con 2–3 estados.
- 3 objetivos seleccionados de un catálogo de 4–5, reglas de compatibilidad y ubicaciones aleatorias.
- Nidos y huevos con tamaños/rareza, mochila limitada, pérdida recuperable, extracción voluntaria.
- Lobby/habitación pequeña con inventario, huevos, incubación inmediata o temporizador acotado, 2–3 mascotas con 3 roles mecánicos, alimentación simple.
- Solo + compañeros controlados por bots para labores esenciales, sesiones cooperativas de 2–4 humanos en salas privadas como meta primordial.
- Guardado persistente de huevos/mascotas/progreso; autoridad del servidor para inventarios y hallazgos si online.
- Una tienda comercial mínima **solo si el juego ya funciona y la seguridad está validada**. Intercambio entre jugadores, captura de adultos, clima y elementos, decoración detallada, muchos bosses y breeding quedan para después.
- Sin UI o estética que sugiera animales maltratados; jugar debe ser diversión, no presión a gastar.

## Riesgos y criterios
- El arte Tripo/Blender acelera assets pero aún exige rig/animación comprobados, optimización GLB, colisiones, memoria, iluminación y pruebas en dispositivos de gama media. Puede ser 3D desde inicio.
- Riesgo principal: servidor online y sincronización, persistencia de recursos/mascotas, generación justa, IA/escenas; no prometer comercio seguro para 6 semanas.
- Si solo hay 96 horas, meta es vertical slice reproducible y cooperativa básica; 160 horas siguen siendo agresivas para entrega comercial. Definir primer endpoint de prueba real a las 2 semanas.
- Métrica de diversión: grupos que repiten 3+ expediciones voluntariamente, relatos de decisiones inesperadas, percepciones de injusticia vs riesgo, claridad de extracción, interés real en comprar algo sin presión.

## Siguiente implementación
1. Especificar máquinas de estados de expedición: lobby → exploración → objetivos/alerta → extracción → liquidación de botín → hogar.
2. Estructurar configuraciones versionadas de biomas/slots, nidos, especies, rareza, reglas de objetivos, fauna e inventario.
3. Crear escenario único y prototipo de sigilo/robo de un huevo/extracción; probar diversión.
4. Construir red cooperativa con servidor autoritativo y sincronización desde temprano; no permitir que el cliente otorgue huevos.
5. Añadir compañero funcional y progresión y solo después comercio/monetización.
