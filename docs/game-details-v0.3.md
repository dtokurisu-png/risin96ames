# RISIN96AMES GameDetails v0.3

Esta versión agrega página individual para cada juego.

## Archivos nuevos o actualizados

```txt
index.html
game.html
js/games.js
js/game-detail.js
data/games.json
data/reviews.json
docs/game-details-v0.3.md
```

## Cómo funciona

Cada tarjeta usa:

```txt
game.html?id=demo-game
```

La página `game.html` lee:

```txt
data/games.json
data/reviews.json
```

y muestra:

- Nombre del juego
- Descripción larga
- Estado
- Versión
- Género
- Enfoque de prueba
- Controles
- Changelog
- Botón jugar
- Botón enviar feedback
- Reseñas filtradas por juego

## Campos nuevos en data/games.json

```txt
longDescription
controls
changelog
```

## Próximo paso recomendado

Cargar el primer juego real en:

```txt
games/nombre-del-juego/index.html
```

y agregar su entrada en:

```txt
data/games.json
```
