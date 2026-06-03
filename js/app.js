"use strict";

const API_KEY = "";
const API_HOST = "v3.football.api-sports.io";
const API_URL = "https://v3.football.api-sports.io/fixtures?live=all";

const dom = {
  content: document.getElementById("content"),
  refreshButton: document.getElementById("refreshBtn"),
  sidebarRefreshButton: document.querySelector(".sidebar__premium"),
  tickerTrack: document.getElementById("tickerTrack"),
  matchCount: document.getElementById("matchCount"),
  summaryStats: document.getElementById("summaryStats"),
  leagueTable: document.getElementById("leagueTable"),
  navigationLinks: document.querySelectorAll(
    ".sidebar__nav a, .topbar__brand, .topbar__nav a, .mobile-nav a, .footer a"
  )
};

const labels = {
  fallbackHome: "Equipo local",
  fallbackAway: "Equipo visitante",
  fallbackLeague: "Liga",
  loadingTitle: "Loading...",
  loadingText: "Buscando partidos en vivo.",
  emptyTitle: "No hay partidos en vivo en este momento.",
  emptyText: "Vuelve a tocar actualizar para revisar otra vez.",
  errorTitle: "No se pudieron cargar los partidos.",
  missingKey: "Pega tu API key de RapidAPI en la constante API_KEY.",
  invalidKey: "La API respondio con un error. Revisa que tu API key sea correcta.",
  networkError: "Hubo un problema de red. Revisa tu conexion e intenta otra vez."
};

const statusLabels = {
  "Not Started": "Por iniciar",
  "First Half": "Primer tiempo",
  Halftime: "Medio tiempo",
  "Second Half": "Segundo tiempo",
  "Extra Time": "Tiempo extra",
  "Penalty Shootout": "Penales",
  "Match Finished": "Finalizado",
  "Match Finished After Extra Time": "Finalizado TE",
  "Match Finished After Penalties": "Finalizado penales",
  "Break Time": "Descanso",
  "Match Suspended": "Suspendido",
  "Match Interrupted": "Interrumpido",
  "Match Postponed": "Pospuesto",
  "Match Cancelled": "Cancelado",
  "Match Abandoned": "Abandonado",
  "Technical Loss": "Derrota tecnica",
  "WalkOver": "Walkover",
  "In Progress": "En vivo"
};

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setRefreshState(isDisabled) {
  dom.refreshButton.disabled = isDisabled;

  if (dom.sidebarRefreshButton) {
    dom.sidebarRefreshButton.disabled = isDisabled;
  }
}

function renderStatus({ title, text, icon, isLoading = false, isError = false }) {
  const statusClass = isError ? "status-card status-card--error" : "status-card";
  const media = isLoading
    ? '<div class="loader" aria-hidden="true"></div>'
    : `<div class="status-icon" aria-hidden="true">${escapeHTML(icon)}</div>`;

  dom.content.innerHTML = `
    <div class="${statusClass}">
      ${media}
      <div>
        <p class="status-card__title">${escapeHTML(title)}</p>
        <p class="status-card__text">${escapeHTML(text)}</p>
      </div>
    </div>
  `;
}

function renderLoading() {
  setRefreshState(true);
  dom.matchCount.textContent = "Loading...";

  renderStatus({
    title: labels.loadingTitle,
    text: labels.loadingText,
    isLoading: true
  });
}

function renderEmpty() {
  dom.matchCount.textContent = "0 partidos";
  renderTicker([]);
  renderSummary([]);
  renderLeagues([]);

  renderStatus({
    title: labels.emptyTitle,
    text: labels.emptyText,
    icon: "0"
  });
}

function renderError(message) {
  dom.matchCount.textContent = "Error";
  renderTicker([]);
  renderSummary([]);
  renderLeagues([]);

  renderStatus({
    title: labels.errorTitle,
    text: message,
    icon: "!",
    isError: true
  });
}

function getMinute(match) {
  const elapsed = match?.fixture?.status?.elapsed;
  const extra = match?.fixture?.status?.extra;

  if (typeof elapsed !== "number") {
    return "En vivo";
  }

  return extra ? `${elapsed}+${extra}'` : `${elapsed}'`;
}

function getGoals(value) {
  return typeof value === "number" ? value : 0;
}

function getStatusLabel(status) {
  return statusLabels[status] || status || "En vivo";
}

function getInitial(name) {
  return String(name || "?").trim().charAt(0).toUpperCase() || "?";
}

function getTeamCode(name) {
  const cleanName = String(name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .trim();
  const words = cleanName.split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return words.map((word) => word[0]).join("").slice(0, 3).toUpperCase();
  }

  return cleanName.slice(0, 3).toUpperCase() || "---";
}

function renderLogo(url, name, className) {
  if (!url) {
    return `<div class="${className} team__placeholder" aria-hidden="true">${escapeHTML(getInitial(name))}</div>`;
  }

  return `
    <img
      class="${className}"
      src="${escapeHTML(url)}"
      alt="${escapeHTML(name)}"
      loading="lazy"
    >
  `;
}

function renderLeague(league) {
  const name = league.name || labels.fallbackLeague;
  const logo = league.logo
    ? `<img class="match-card__league-logo" src="${escapeHTML(league.logo)}" alt="" loading="lazy">`
    : "";

  return `
    <div class="match-card__league">
      ${logo}
      <span class="match-card__league-name">${escapeHTML(name)}</span>
    </div>
  `;
}

function renderTeam(team, fallbackName) {
  const name = team.name || fallbackName;

  return `
    <div class="team">
      ${renderLogo(team.logo, name, "team__logo")}
      <p class="team__name">${escapeHTML(name)}</p>
    </div>
  `;
}

function renderMatchCard(match) {
  const home = match.teams?.home ?? {};
  const away = match.teams?.away ?? {};
  const league = match.league ?? {};
  const status = getStatusLabel(match.fixture?.status?.long);
  const homeGoals = getGoals(match.goals?.home);
  const awayGoals = getGoals(match.goals?.away);

  return `
    <article class="match-card">
      <div class="match-card__meta">
        <span class="match-card__minute">${escapeHTML(getMinute(match))}</span>
        ${renderLeague(league)}
      </div>

      <div class="match-card__scoreboard">
        ${renderTeam(home, labels.fallbackHome)}

        <div class="score" aria-label="Marcador ${homeGoals} a ${awayGoals}">
          ${homeGoals} - ${awayGoals}
        </div>

        ${renderTeam(away, labels.fallbackAway)}
      </div>

      <div class="match-card__details">
        <div class="detail-line">
          <span>Estado</span>
          <span>${escapeHTML(status)}</span>
        </div>
        <div class="detail-line">
          <span>Partido</span>
          <span>${escapeHTML(match.fixture?.id || "En vivo")}</span>
        </div>
      </div>
    </article>
  `;
}

function renderMatches(matches) {
  const cards = matches.map(renderMatchCard).join("");
  dom.content.innerHTML = `<div class="matches-list">${cards}</div>`;
  dom.matchCount.textContent = `${matches.length} partido${matches.length === 1 ? "" : "s"}`;
}

function renderTicker(matches) {
  const tickerMatches = matches.slice(0, 8);

  if (tickerMatches.length === 0) {
    dom.tickerTrack.innerHTML = `
      <div class="score-ticker__item">
        <span class="score-ticker__live">EN VIVO</span>
        <span>No hay partidos en vivo</span>
        <span class="score-ticker__dot" aria-hidden="true"></span>
        <span class="score-ticker__league">API-FOOTBALL</span>
      </div>
      <div class="score-ticker__item">
        <span class="score-ticker__live">EN VIVO</span>
        <span>No hay partidos en vivo</span>
        <span class="score-ticker__dot" aria-hidden="true"></span>
        <span class="score-ticker__league">RAPIDAPI</span>
      </div>
    `;
    return;
  }

  const items = tickerMatches.map((match) => {
    const homeName = match.teams?.home?.name || labels.fallbackHome;
    const awayName = match.teams?.away?.name || labels.fallbackAway;
    const homeGoals = getGoals(match.goals?.home);
    const awayGoals = getGoals(match.goals?.away);
    const leagueName = match.league?.name || labels.fallbackLeague;

    return `
      <div class="score-ticker__item">
        <span class="score-ticker__live">EN VIVO</span>
        <span>${escapeHTML(getTeamCode(homeName))} ${homeGoals} - ${awayGoals} ${escapeHTML(getTeamCode(awayName))}</span>
        <span class="score-ticker__dot" aria-hidden="true"></span>
        <span class="score-ticker__league">${escapeHTML(leagueName)}</span>
      </div>
    `;
  }).join("");

  dom.tickerTrack.innerHTML = items + items;
}

function getLeagueCounts(matches) {
  const counts = new Map();

  matches.forEach((match) => {
    const name = match.league?.name || labels.fallbackLeague;
    counts.set(name, (counts.get(name) || 0) + 1);
  });

  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

function renderSummary(matches) {
  const leagueCount = getLeagueCounts(matches).length;
  const firstMinute = matches[0] ? getMinute(matches[0]) : "--";

  dom.summaryStats.innerHTML = `
    <article class="stat-card">
      <strong>${matches.length}</strong>
      <span>Partidos</span>
    </article>
    <article class="stat-card">
      <strong>${leagueCount}</strong>
      <span>Ligas</span>
    </article>
    <article class="stat-card">
      <strong>${escapeHTML(firstMinute)}</strong>
      <span>Minuto top</span>
    </article>
    <article class="stat-card">
      <strong>VIVO</strong>
      <span>Estado</span>
    </article>
  `;
}

function renderLeagues(matches) {
  const rows = getLeagueCounts(matches).slice(0, 5).map(([name, count], index) => `
    <div class="league-table__row">
      <span>${index + 1}</span>
      <span>${escapeHTML(name)}</span>
      <span>${count}</span>
    </div>
  `).join("");

  dom.leagueTable.innerHTML = `
    <div class="league-table__row league-table__row--head">
      <span>#</span>
      <span>Liga</span>
      <span>J</span>
    </div>
    ${rows || `
      <div class="league-table__row">
        <span>1</span>
        <span>Sin datos</span>
        <span>0</span>
      </div>
    `}
  `;
}

function hasApiErrors(errors) {
  if (!errors) return false;
  if (Array.isArray(errors)) return errors.length > 0;
  return Object.keys(errors).length > 0;
}

function getNavigationTarget(link) {
  const hash = link.getAttribute("href");

  if (!hash || !hash.startsWith("#")) {
    return null;
  }

  const target = document.querySelector(hash);

  if (!target) {
    return null;
  }

  return { hash, target };
}

function setActiveNavigation(activeHash) {
  dom.navigationLinks.forEach((link) => {
    const linkHash = link.getAttribute("href");
    const isActive = linkHash === activeHash;

    link.classList.toggle("sidebar__link--active", isActive && link.classList.contains("sidebar__link"));

    if (isActive && !link.classList.contains("topbar__brand") && !link.closest(".footer")) {
      link.setAttribute("aria-current", "page");
      return;
    }

    link.removeAttribute("aria-current");
  });
}

function handleNavigationClick(event) {
  const link = event.target.closest("a");

  if (!link) {
    return;
  }

  const navigationTarget = getNavigationTarget(link);

  if (!navigationTarget) {
    return;
  }

  event.preventDefault();
  navigationTarget.target.scrollIntoView({ behavior: "smooth", block: "start" });
  history.pushState(null, "", navigationTarget.hash);
  setActiveNavigation(navigationTarget.hash);
}

function setupNavigation() {
  dom.navigationLinks.forEach((link) => {
    link.addEventListener("click", handleNavigationClick);
  });

  window.addEventListener("popstate", () => {
    setActiveNavigation(window.location.hash || "#inicio");
  });

  setActiveNavigation(window.location.hash || "#inicio");
}

async function fetchLiveMatches() {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      "x-rapidapi-host": API_HOST,
      "x-rapidapi-key": API_KEY
    }
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: intenta de nuevo en unos minutos.`);
  }

  const data = await response.json();

  if (hasApiErrors(data.errors)) {
    throw new Error(labels.invalidKey);
  }

  return Array.isArray(data.response) ? data.response : [];
}

async function loadLiveMatches() {
  renderLoading();

  if (!API_KEY.trim()) {
    renderError(labels.missingKey);
    setRefreshState(false);
    return;
  }

  try {
    const matches = await fetchLiveMatches();

    if (matches.length === 0) {
      renderEmpty();
      return;
    }

    renderMatches(matches);
    renderTicker(matches);
    renderSummary(matches);
    renderLeagues(matches);
  } catch (error) {
    renderError(error.message || labels.networkError);
  } finally {
    setRefreshState(false);
  }
}

function init() {
  setupNavigation();
  dom.refreshButton.addEventListener("click", loadLiveMatches);

  if (dom.sidebarRefreshButton) {
    dom.sidebarRefreshButton.addEventListener("click", loadLiveMatches);
  }

  loadLiveMatches();
}

document.addEventListener("DOMContentLoaded", init);
