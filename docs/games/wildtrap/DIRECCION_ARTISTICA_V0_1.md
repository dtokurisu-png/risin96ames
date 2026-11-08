# WILDTRAP — Dirección artística v0.1
Fecha: 2026-11-08. Estado: dirección acordada para la primera versión; presupuestos técnicos orientativos.

## Estilo definitivo para el inicio
**Fantasía estilizada 3D low-poly optimizada**, cámara 2.5D elevada. Referencias generales: legibilidad de escenarios y personajes de Albion Online; formas, magia, color y pulido de Wild Rift. No copiar personajes, diseños ni escenarios. Evitar fotorrealismo y exceso de polígonos; tampoco usar low-poly facetado crudo: debe sentirse ilustrado y acabado mediante texturas y luz.

## Principios
- Modelos sencillos y coherentes entre sí para exploradores, mascotas, enemigos, guardianes y environment; preservar siluetas claras, expresividad y contraste.
- Priorizar texturas de fantasía pintadas a mano, materiales PBR simples y paleta viva. Jungla de colores ricos; cuevas algo más misteriosas sin perjudicar visibilidad.
- La primera versión prioriza rendimiento y diversión. **Mejoras gráficas periódicas posteriores** en modelos, texturas, animaciones, efectos y entorno, sin necesidad de rehacer la lógica de las entidades.
- El entorno usa sectorización fija, suelo con 3–4 variaciones y modelos modulares de vegetación combinados por semilla; árboles y obstáculos no deben tapar las acciones.
- Personajes con proporciones estilizadas, manos/equipamiento legibles; criaturas adorables o impresionantes reconocibles a distancia; huevos coherentes con la especie.
- Tripo (modelado y bases de animación) → Blender (limpieza, reducción de triángulos, rigs, UV, clips) → GLB optimizado → Three.js.

## Presupuestos provisionales por modelo (triángulos, no polígonos cuadrangulares)
| Clase | Objetivo preliminar |
|---|---:|
| Explorador | 2,000–5,000 |
| Mascota pequeña | 800–2,500 |
| Enemigo común | 700–2,500 |
| Guardián | 5,000–10,000 |
| Árbol o prop grande | 200–1,500 |
| Vegetación pequeña | 20–300 |

Texturas generalmente 512–1024 px, según tamaño en pantalla y dispositivo destino. **Estos números no son límites universales**: medir en el dispositivo con 4 jugadores, mascotas, enemigos y vegetación. También vigilar draw calls, animación esquelética, transparencia, sombras, CPU y memoria. Reutilizar materiales/geometrías, instancing, atlas, compresión, LOD/culling cuando sea necesario.

## Preparar upgrades gráficos sin romper el juego
- Separar datos de gameplay (especie, estadísticas, colisión, tamaño, habilidades, posiciones) de apariencia (modelo, skin, textura, animaciones).
- IDs de entidades, escala, pivotes, nombres de huesos relevantes, anclajes y clips compatibles a través de versiones.
- Permitir reemplazar un GLB de detalle inicial por una versión gráfica superior y mantener los mismos hitboxes y reglas.
- Incorporar calidades bajo/alto si las pruebas de rendimiento lo justifican.

## Identidad visual
**Stylized Fantasy Adventure**, accesible, legible, con criaturas que merezca coleccionar. Low-poly limpio y texturizado, no visual tosco. La decoración y el detalle geométrico son secundarios frente a gameplay y legibilidad.

## Relación con otros documentos
Ver GAME_DESIGN_V0_1.md para mecánicas. Este documento define la apariencia inicial y el camino de mejora, sin añadir tareas jugables a MVP.
