# Pantera Web

Pagina sencilla para consultar partidos en vivo desde API-FOOTBALL en Vercel.

## Variables de entorno

Configura la misma variable en local y en Vercel:

```env
FOOTBALL_API_KEY=tu_api_key_de_api_football
```

En Vercel: Project Settings > Environment Variables > `FOOTBALL_API_KEY`.

La pagina llama a `/api/partidos`; esa funcion serverless consulta API-FOOTBALL y mantiene la llave fuera del navegador.

La funcion usa `/fixtures?live=all` con `timezone`, guarda cache en memoria para evitar gastar peticiones en cada refresh y devuelve metadatos de cuota cuando API-FOOTBALL los manda en headers.

## Desarrollo local

1. Llena `.env` con tu llave real.
2. Ejecuta `npm run dev` desde la raiz del proyecto.
3. Abre `http://localhost:3000`.
