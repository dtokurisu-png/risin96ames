# MiniMundos — Arquitectura de jardín, granja, hogar y defensa v0.3
Fecha: 2026-11-08
Estado: especificación de diseño, no implementación.
Documento principal: GAME_DESIGN_V0_1.md (v0.2 ampliada).

## Decisión del usuario — prioridad alta
MiniMundos es un universo persistente de islas y actividades, familiar, **no competitivo**. El jardín/granja y la casa no son un menú ni un minijuego limitado: son espacios jugables autónomos. Las personas pueden estar en **distintas actividades simultáneamente** (una en el hogar, otra cuidando plantas, dos explorando o combatiendo), y compartir progreso. Debe poder jugarse indefinidamente sin barras de energía que corten la sesión o ventanas arbitrarias que obliguen a salir.

## Separación de entidades
1. **Mascota de compañía**: criatura personal tipo Tamagotchi; hambre, descanso, juego, salud, crecimiento, talentos de apoyo, eventual crianza/intercambio; puede seguir al jugador y ayudar en diferentes modos. No confundir con animales productivos/defensores.
2. **Animales de granja**: obtenidos en misiones, crianza o desbloqueos. Habitan corrales/hábitats; producen recursos o desempeñan una función defensiva definida cuando se amenaza el jardín. Pueden tener salud/energía y progresión sencilla. Están disponibles para colocación estratégica por zonas (no sustituir mascotas personales).
3. **Plantas**: sembradas a partir de semillas halladas en islas o cultivadas en el jardín. Proporcionan **auras, curación, protección, desorientación mediante esporas, regeneración, detección, lentitud, atracción, repelencia, etc.** La regla central es que **no disparan ataques directos como torretas**. Se colocan para apoyar animales y otras plantas; algunas interacciones son ambientales.
4. **Invasores**: insectos y criaturas diversas con resistencias, rutas, comportamientos y vulnerabilidades. La amenaza puede dirigirse a cosechas/estructuras y ser interceptada por animales. No todas las abejas u otros insectos deben ser invasores, pues pueden ser polinizadores aliados.

## Sistema de defensa del jardín
- El jardín es **grande, expandible, decorable y persistente**. Tiene áreas de cultivo, corrales, caminos, puntos de entrada y edificaciones.
- **Preparación permanente:** las plantas y los animales ya existen en el mapa y mantienen sus posiciones entre ataques. El jugador puede moverlos/reorganizarlos (con límites de espacio/colisión) antes de una invasión; durante la invasión puede dar órdenes simples, activar soportes y reaccionar a amenazas.
- **Plantas = soporte y control. Animales = combate/defensa.** El jugador puede participar como cuidador/estratega y, si se habilita, como apoyo directo. Evitar copiar las filas/unidades o la presentación de juegos terceros.
- **Sinergias** explícitas en reglas por proximidad, tipo, alcance, clima y enemigo: planta de sanación junto a corral de gallinas defensoras; planta de esporas que confunde insectos permitiendo flanqueo de animal rápido; planta resistente que protege planta frágil; animal que favorece crecimiento/polinización fuera de combate.
- **Oleadas y avisos:** primero alerta clara, tiempo de preparación opcional; distintos puntos de ataque, invasores y efectos; el jugador decide combatir, pedir ayuda o usar una defensa automática asistida. Fuera de combate, el jardín sigue disponible.
- **No castigo infantil:** dificultad por perfil y preferencia; en modo asistido los ataques no destruyen irreversible las colecciones. Adultos pueden optar a oleadas tácticas difíciles; todas ofrecen recursos base y satisfacen progreso.
- **Sin pago forzoso:** nutrientes/semillas comunes se obtienen jugando; los packs premium, si los hay, deben evitar compra de victoria o plagas artificiales para provocar gasto.

## Ejemplo de sinergias iniciales (propuestas sujetas a balance)
| Planta | Función | Animal | Sinergia | Amenaza |
|---|---|---|---|---|
| Flor de Rocío | aura de curación lenta | Gallina centinela | puede mantener frente contra plagas pequeñas | escarabajos |
| Helecho de Niebla | esporas que confunden/ralentizan | Conejo corredor | intercepta enemigos desviados | orugas veloces |
| Musgo Escudo | protección de área | Cabra guardiana | aguanta golpes y bloquea accesos | invasor robusto |
| Lirio del Eco | revela amenazas ocultas | Búho vigía | marca blancos escondidos | polillas nocturnas |
| Trébol Vital | recuperación de energía/velocidad | Perro pastor | patrulla zonas grandes | criaturas móviles |

Nombres, estadísticas y estética son prototipos de diseño, no assets finales.

## Edificios y casa (inspiración en libertad creativa de simuladores de hogar, sin copiarlos)
- **Casa interior editable**: entrar/salir, mover muebles en grilla/snap opcional, rotar, guardar distribución, cambiar paredes/suelos/iluminación y comprar o fabricar objetos decorativos; incluir uso interactivo (dormir/descansar, almacenar, cocinar o cuidar mascota).
- **Edificios externos mejorables**: invernadero (nuevas semillas/recetas), granero/corral (más animales), taller (fabricación), clínica sencilla (tratamiento de mascotas/animales), observatorio/portal (exploración), almacén.
- **Mejoras con progresión visible**: cambio de modelo/etapas y nuevas interacciones; no solo números que suben. Terreno ampliable mediante proyectos desbloqueados con misiones.
- **Distinción entre moneda ganada jugando y monetización**: cosméticos, muebles, decoraciones, hábitats visuales y estilos arquitectónicos son candidatos de pago; funcionalidades y progresión central deben poder obtenerse jugando.

## Simultaneidad familiar y persistencia
- Un mundo/jardín compartido con permisos **ver, usar, mover, construir, cosechar, vender/intercambiar** separados para cada miembro, más jardines personales a futuro.
- Un jugador puede seguir recortando maleza y alimentando animales mientras otros salen a explorar en misiones. Sus ganancias actualizan almacén/proyectos compartidos. Actividades opcionales sin bloqueo por energía.
- Los bots cubren estaciones cooperativas no ocupadas, pero **no deben gestionar o vender propiedad sin permiso**.
- Guardado autoritativo/sincronización y resolución de conflictos necesarios antes del multijugador real (versión inicial local permite probar simulación sin servidor).
- Si ocurren invasiones cuando nadie está conectado, se suspende daño irreversible, o el mundo queda en pausa/protección. No penalizar ausencias.
- Perfil de edad → dificultad inicial adaptable por rendimiento y selección manual. Los controles de privacidad/compra no dependen de una edad que el menor pueda manipular fácilmente.

## Actividades siempre disponibles (sin energía ni espera obligatoria)
Decorar casa, remodelar jardín, cuidar mascota, cultivar, preparar alimentos, producir/recolectar recursos de tareas activas, explorar sectores, repetir misiones con variaciones, resolver puzzles, entrenar animales, defender de incursiones elegidas o programadas de manera no punitiva, coleccionar especies, fabricar, descubrir secretos, ayudar a familiares.
**Regla de diseño**: un temporizador de crecimiento puede existir, pero no debe impedir realizar otras acciones significativas.

## Modelo de datos modular sugerido
```
World { id, unlockedSectors[], sharedGardenId, buildings[], expeditionStates[] }
Player { id, ageBand, assistLevel, ownedItems[], companionPetIds[], personalSpaceId }
Garden { id, size, plots[], plants[], farmAnimals[], placedObjects[], accessPolicy, eventState }
Plant { id, speciesId, growthStage, condition, pos, supportAura, traits }
FarmAnimal { id, speciesId, habitatId, pos, combatRole, stamina, health, traits }
CompanionPet { id, speciesId, ownerId, bond, hunger, rest, health, growthStage, abilities }
Building { id, type, tier, footprint, pos, upgradeRequirements, interactions }
Invader { id, speciesId, route, targetPriority, strengths, weaknesses }
Activity { id, engineType, variantId, difficultyRules, rewards, unlocks }
Event { id, type, seed, threatProfile, entryPoints, phase }
```
Cada entidad tiene ID único, versionado de guardado y parámetros definidos por datos, no lógica duplicada por especie/isla.

## Bucle de juego ilustrativo
- Niño: elimina maleza, alimenta animales y cuida su mascota; mejora el jardín sin entrar a una expedición.
- Adulto: construye y decora la casa; compra/fabrica muebles.
- Dos familiares: salen a misión de plataformas/exploración; consiguen nuevas semillas/animales.
- Regresan, siembran, reorganizan defensas y prueban una incursión; las sinergias producen nuevas opciones y desbloquean terreno.
- Todas estas acciones son válidas y divertidas por sí mismas; ninguna requiere completar toda la rutina diaria.

## Primer prototipo de combate defensivo (recomendación)
- Un área de jardín, 3 plantas de apoyo, 2 animales defensores, 2 tipos de invasor y un controlador de incursión.
- Colocación con validación, aura de rango y feedback legible, defensa semiautomática, aviso previo, victoria/derrota recuperable y guardado.
- Probar con dificultades asistida y experta **sobre el mismo motor**; métricas: claridad de sinergias, control táctico, diversión repetida, ausencia de frustración en menores.
- Separar casa/jardín de la simulación de defensa para que se pueda iterar sin romper construcción.
- Integrar este prototipo con la vertical slice principal antes de ampliar catálogo.

## Alcance / límites
Objetivo creativo: un primer mundo robusto con 10–15 actividades y expansiones mensuales, pero **no comprometer** esa cifra para enero 2027 con ~16 horas semanales. Primero validar mecánicas y guardado; online cooperativo, hogar completo, genética/intercambio y catálogo de minijuegos completo incrementan calendario significativamente.

## Pendientes para implementación
- Plataforma inicial y controles; librería/engine 3D.
- Tamaño y sistema de coordenadas jardín/casa/corrales.
- Motor de auras, navegación e IA de animales e invasores; reglas de prioridad.
- Construcción y persistencia local, luego servidor.
- Diseño de cuatro o cinco especies iniciales con animaciones sencillas.
- Editor de actividades por JSON/data assets, para expansiones.
- Guardado seguro/privacidad infantil y futura monetización no invasiva.
