# Firebase Firestore - RISIN96AMES v0.1

## Colecciones iniciales

### games
Campos:
- title
- slug
- shortDescription
- longDescription
- genre
- status
- version
- testFocus
- thumbnailUrl
- bannerUrl
- playUrl
- isActive
- createdAt
- updatedAt

Ejemplo:
```json
{
  "title": "HallValla",
  "slug": "hallvalla",
  "shortDescription": "Juego táctico de combate por turnos con unidades, líderes y control del campo.",
  "longDescription": "Beta jugable enfocada en probar combate, movimiento, IA y claridad de interfaz.",
  "genre": "Estrategia táctica",
  "status": "Beta",
  "version": "0.3.0",
  "testFocus": "Combate, movimiento e IA",
  "thumbnailUrl": "assets/images/placeholder-game.webp",
  "bannerUrl": "assets/images/banners/hallvalla.webp",
  "playUrl": "games/hallvalla/index.html",
  "isActive": true
}
```

### reviews
Campos:
- gameId
- userName
- rating
- comment
- device
- createdAt

Ejemplo:
```json
{
  "gameId": "hallvalla",
  "userName": "Tester",
  "rating": 5,
  "comment": "Me gustó el combate, pero falta explicar mejor los turnos.",
  "device": "PC"
}
```
