const API_BASE_URL = "https://v3.football.api-sports.io";
const DEFAULT_TIMEZONE = process.env.FOOTBALL_API_TIMEZONE || "America/Mexico_City";
const LIVE_CACHE_TTL_MS = 60 * 1000;
const EMPTY_LIVE_CACHE_TTL_MS = 5 * 60 * 1000;

let cachedLiveResponse = null;

function getRequestUrl(request) {
    return new URL(request.url || "/api/partidos", "http://localhost");
}

function getTimezone(requestUrl) {
    const timezone = requestUrl.searchParams.get("timezone") || DEFAULT_TIMEZONE;

    if (!/^[A-Za-z0-9_+\-/]+$/.test(timezone)) {
        return DEFAULT_TIMEZONE;
    }

    return timezone;
}

function getApiUrl(timezone) {
    const apiUrl = new URL("/fixtures", API_BASE_URL);
    apiUrl.searchParams.set("live", "all");
    apiUrl.searchParams.set("timezone", timezone);
    return apiUrl;
}

function getRateLimitMeta(apiResponse) {
    return {
        dailyLimit: apiResponse.headers.get("x-ratelimit-requests-limit"),
        dailyRemaining: apiResponse.headers.get("x-ratelimit-requests-remaining"),
        minuteLimit: apiResponse.headers.get("x-ratelimit-limit"),
        minuteRemaining: apiResponse.headers.get("x-ratelimit-remaining")
    };
}

function addMeta(data, meta) {
    return {
        ...(data ?? {}),
        meta: {
            ...(data?.meta ?? {}),
            ...meta
        }
    };
}

function getCachedResponse(cacheKey) {
    if (!cachedLiveResponse || cachedLiveResponse.cacheKey !== cacheKey) {
        return null;
    }

    if (Date.now() > cachedLiveResponse.expiresAt) {
        return null;
    }

    return addMeta(cachedLiveResponse.data, {
        cached: true,
        cacheTtlSeconds: Math.max(0, Math.ceil((cachedLiveResponse.expiresAt - Date.now()) / 1000))
    });
}

function setCachedResponse(cacheKey, data) {
    const hasMatches = Array.isArray(data?.response) && data.response.length > 0;
    const ttl = hasMatches ? LIVE_CACHE_TTL_MS : EMPTY_LIVE_CACHE_TTL_MS;

    cachedLiveResponse = {
        cacheKey,
        data,
        expiresAt: Date.now() + ttl
    };
}

function setCorsHeaders(response) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(request, response) {
    setCorsHeaders(response);

    if (request.method === "OPTIONS") {
        return response.status(204).end();
    }

    if (request.method !== "GET") {
        return response.status(405).json({ error: "Metodo no permitido" });
    }

    const apiKey = process.env.FOOTBALL_API_KEY?.trim();

    if (!apiKey) {
        return response.status(500).json({
            errors: { configuration: "Falta configurar FOOTBALL_API_KEY en Vercel o en .env" },
            response: []
        });
    }

    const requestUrl = getRequestUrl(request);
    const timezone = getTimezone(requestUrl);
    const apiUrl = getApiUrl(timezone);
    const cacheKey = apiUrl.toString();
    const cachedResponse = getCachedResponse(cacheKey);

    if (cachedResponse) {
        response.setHeader("X-Pantera-Cache", "HIT");
        return response.status(200).json(cachedResponse);
    }

    try {
        const apiResponse = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "x-apisports-key": apiKey
            }
        });

        const data = await apiResponse.json().catch(() => null);
        const responseData = addMeta(data, {
            cached: false,
            endpoint: "/fixtures?live=all",
            timezone,
            rateLimit: getRateLimitMeta(apiResponse)
        });

        if (!apiResponse.ok) {
            return response.status(apiResponse.status).json(responseData ?? {
                error: "API-FOOTBALL respondio con un error"
            });
        }

        setCachedResponse(cacheKey, responseData);
        response.setHeader("X-Pantera-Cache", "MISS");
        return response.status(200).json(responseData);
    } catch (error) {
        return response.status(500).json({
            error: "Error al consultar API-FOOTBALL",
            detail: error.message
        });
    }
}
