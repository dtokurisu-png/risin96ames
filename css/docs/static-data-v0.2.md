# RISIN96AMES StaticData v0.2

Esta versión elimina Firebase/Firestore por ahora.

## Usa

- GitHub Pages como hosting gratuito.
- GitHub repo como control de desarrollo.
- `data/games.json` como lista de juegos.
- `data/reviews.json` como reseñas visibles.
- GitHub Issues como canal real para recibir reseñas/feedback.

## Archivos que reemplaza o agrega

```txt
index.html
js/app.js
js/games.js
js/reviews.js
data/games.json
data/reviews.json
docs/static-data-v0.2.md
```

## Cómo agregar un juego nuevo

1. Crear carpeta del juego:

```txt
games/nombre-del-juego/index.html
```

2. Agregar entrada en:

```txt
data/games.json
```

3. Commit.
4. Push origin.
5. GitHub Pages publicará el cambio.

## Cómo agregar una reseña visible

1. Revisar el Issue recibido en GitHub.
2. Copiar la reseña aprobada.
3. Agregarla manualmente a:

```txt
data/reviews.json
```

4. Aumentar el contador `reviews` del juego en `data/games.json`.
5. Commit y push.

## Nota

El formulario de la web solo previsualiza la reseña. Para guardarla de verdad sin base de datos, se usa GitHub Issues.
