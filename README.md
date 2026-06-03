# Pantera Web

Pagina sencilla para consultar partidos en vivo desde API-FOOTBALL en Vercel.

El proyecto listo para Vercel esta dentro de `vercel-app/`.

## Variables de entorno

Configura la misma variable en local y en Vercel:

```env
FOOTBALL_API_KEY=tu_api_key_de_api_football
```

En Vercel: Project Settings > Environment Variables > `FOOTBALL_API_KEY`.

La pagina llama a `/api/partidos`; esa funcion serverless consulta API-FOOTBALL y mantiene la llave fuera del navegador.

La funcion usa `/fixtures?live=all` con `timezone`, guarda cache en memoria para evitar gastar peticiones en cada refresh y devuelve metadatos de cuota cuando API-FOOTBALL los manda en headers.

## Desarrollo local

1. Entra a `vercel-app/`.
2. Llena `.env` con tu llave real.
3. Ejecuta `npm run dev`.
4. Abre `http://localhost:3000`.

## Deploy en Vercel

En Vercel configura Root Directory como `vercel-app`.

Vercel ejecuta `npm run build`, sirve `public/` como salida estatica y despliega `api/` como Vercel Functions.

No subas `.env` al repositorio. En Vercel configura `FOOTBALL_API_KEY` en Project Settings > Environment Variables y haz redeploy.
