## R96 Version Lock

- Versión actual: v0.6.6
- Último parche: Integrate Duel of Conquerors and R.O.K Lite
- Fecha: 2026-06-13
- Nombre visible correcto: RISIN96AMES

## Juegos integrados

- Duel of Conquerors: `games/duel-of-conquerors/index.html`
- R.O.K Lite: `games/rok-lite/index.html`


## Cómo subir un juego ahora

1. Abre el menú de tres rayas.
2. Toca "Subir un juego".
3. Llena la ficha.
4. Copia el JSON generado.
5. Agrega ese objeto dentro de data/games.json.
6. Coloca el juego en games/id-del-juego/index.html.

Forma más rápida:
- Pásame el ZIP del juego y yo te devuelvo el proyecto ya integrado.


## Stack inicial

- HTML
- CSS
- JavaScript
- GitHub como control de desarrollo y publicación inicial
- Firebase como base de datos futura

## Versión actual

`WebStarter v0.1`

Incluye:

- Home inicial
- Tarjeta genérica de juego
- Juego demo en `games/demo-game`
- Formulario visual de reseñas
- Archivos JS separados
- Placeholder para Firebase

## Estructura

```txt
risin96ames
├── index.html
├── css/styles.css
├── js/app.js
├── js/firebase.js
├── js/games.js
├── js/reviews.js
├── assets/
├── games/demo-game/index.html
└── docs/
```

## Próximo paso

Subir este starter al repo público `risin96ames`, publicar con GitHub Pages y luego conectar Firebase.
