import React, { useEffect, useMemo, useRef, useState } from "react";

// 👉 MODIFIEZ UNIQUEMENT CETTE LIGNE POUR PASSER DU FICHIER LOCAL AU FLUX EN DIRECT :
const RADIO_STREAM_URL = "/azura-stream";
type Tab = "home" | "live" | "sessions" | "more";

type IconName =
  | "home"
  | "radio"
  | "grid"
  | "menu"
  | "search"
  | "play"
  | "pause"
  | "next"
  | "prev"
  | "volume"
  | "arrow"
  | "headphones"
  | "share"
  | "bell"
  | "info"
  | "chevron";

const sessions = [
  {
    id: 1,
    title: "Nipve ZeRadhi",
    guest: "K'poral Chris",
    duration: "2 min 39 sec",
    mark: "KP",
    pattern: "rings",
    audioUrl: "/assets/episode1.mp3",
  },
  {
    id: 2,
    title: "Episode 11 - Saison 2",
    guest: "Dadiposlim",
    duration: "4 min 5 sec",
    mark: "DP",
    pattern: "lines",
    audioUrl: "/assets/episode2.mp3",
  },
  {
    id: 3,
    title: "Episode 03 - Saison 2",
    guest: "Zoubs Mars",
    duration: "3 min 46 sec",
    mark: "ZB",
    pattern: "diamonds",
    audioUrl: "/assets/episode3.mp3",
  },
  {
    id: 4,
    title: "Fomboni (WS Radio, Vol.2)",
    guest: "Bahata",
    duration: "2 min 58 sec",
    mark: "BA",
    pattern: "wave",
    audioUrl: "/assets/episode4.mp3",
  },
];

const catalog = [
  { title: "HAZI", meta: "Entrepreneuriat Social", mark: "HZ" },
  { title: "ROHO", meta: "Société", mark: "RH" },
  { title: "LUHA", meta: "Culture & récits", mark: "LU" },
];

function formatTime(seconds: number) {
  if (!seconds || isNaN(seconds) || !isFinite(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

function Icon({
  name,
  size = 22,
  filled = false,
}: {
  name: IconName;
  size?: number;
  filled?: boolean;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: filled ? "currentColor" : "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  const paths: Record<IconName, React.ReactNode> = {
    home: <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" />,
    radio: (
      <>
        <rect x="3" y="7" width="18" height="14" rx="3" />
        <path d="m8 3 8 4M7 12h.01" />
        <circle cx="15.5" cy="14" r="3.5" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h10" />,
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    play: <path d="m8 5 11 7-11 7Z" />,
    pause: <path d="M9 5v14M15 5v14" />,
    next: <path d="m7 6 8 6-8 6ZM17 6v12" />,
    prev: <path d="m17 6-8 6 8 6ZM7 6v12" />,
    volume: <path d="M11 5 6 9H3v6h3l5 4ZM15 9a5 5 0 0 1 0 6M18 6a9 9 0 0 1 0 12" />,
    arrow: <path d="M5 12h14M14 7l5 5-5 5" />,
    headphones: (
      <path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v6H5a1 1 0 0 1-1-1ZM20 14h-3v6h2a1 1 0 0 0 1-1Z" />
    ),
    share: (
      <>
        <circle cx="18" cy="5" r="2.5" />
        <circle cx="6" cy="12" r="2.5" />
        <circle cx="18" cy="19" r="2.5" />
        <path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" />
      </>
    ),
    bell: <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" />,
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function Equalizer({ compact = false, active = true }: { compact?: boolean; active?: boolean }) {
  return (
    <div
      className={`equalizer ${compact ? "equalizer--compact" : ""}`}
      aria-label="Visualiseur audio"
      style={{ opacity: active ? 1 : 0.35, transition: "opacity 0.3s ease" }}
    >
      {Array.from({ length: compact ? 18 : 32 }, (_, index) => (
        <span
          key={index}
          style={{
            animationPlayState: active ? "running" : "paused",
            animationDelay: `${(index % 7) * -0.13}s`,
            height: `${18 + ((index * 13) % 68)}%`,
          }}
        />
      ))}
    </div>
  );
}

function Brand({ small = false }: { small?: boolean }) {
  return (
    <div className="brand">
      <div className={`brand-mark ${small ? "brand-mark--small" : ""}`}>
        <img src="/assets/watwaniya-symbol.png" alt="" />
      </div>
      <div>
        <div className="brand-name">W. RADIO</div>
        {!small && <div className="brand-by">PAR WATWANIYA</div>}
      </div>
    </div>
  );
}

function Artwork({
  mark,
  pattern = "diamonds",
  className = "",
}: {
  mark: string;
  pattern?: string;
  className?: string;
}) {
  return (
    <div className={`artwork artwork--${pattern} ${className}`}>
      <div className="artwork-axis" />
      <div className="artwork-diamond artwork-diamond--top" />
      <span>{mark}</span>
      <div className="artwork-diamond artwork-diamond--bottom" />
    </div>
  );
}

function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      {action && (
        <button onClick={onAction}>
          {action}
          <Icon name="arrow" size={15} />
        </button>
      )}
    </div>
  );
}

function HomeScreen({
  isPlaying,
  isLiveActive,
  onPlayLive,
  onTogglePlayPause,
  onSelectSession,
  onOpenSessions,
  onSearch,
}: {
  isPlaying: boolean;
  isLiveActive: boolean;
  onPlayLive: () => void;
  onTogglePlayPause: () => void;
  onSelectSession: (sessionId: number) => void;
  onOpenSessions: () => void;
  onSearch: () => void;
}) {
  const isLiveCurrentlyPlaying = isPlaying && isLiveActive;

  return (
    <main className="screen home-screen">
      <header className="topbar">
        <Brand />
        <button className="icon-button" onClick={onSearch} aria-label="Rechercher">
          <Icon name="search" />
        </button>
      </header>
      <section className="hero-live">
        <div className="hero-geometry" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="live-label">
          <span /> EN DIRECT
        </div>
        <p className="eyebrow">W. RADIO LIVE</p>
        <h1>
          MORNING
          <br />
          WATWANIYA
        </h1>
        <p className="host">
          AVEC <strong>DJ QUICK</strong> · 06:00—10:00
        </p>
        <Equalizer compact active={isLiveCurrentlyPlaying} />
        <button className="primary-button" onClick={onPlayLive}>
          <Icon
            name={isLiveCurrentlyPlaying ? "pause" : "play"}
            size={18}
            filled={!isLiveCurrentlyPlaying}
          />
          <span>{isLiveCurrentlyPlaying ? "EN LECTURE" : "ÉCOUTER EN DIRECT"}</span>
        </button>
      </section>

      <section className="content-section">
        <SectionHeader title="PODCAST & SESSIONS" action="TOUT VOIR" onAction={onOpenSessions} />
        <div className="horizontal-list">
          {catalog.map((item, index) => (
            <button
              key={item.title}
              className="catalog-card"
              onClick={onOpenSessions}
            >
              <Artwork
                mark={item.mark}
                pattern={index === 0 ? "rings" : index === 1 ? "lines" : "diamonds"}
              />
              <strong>{item.title}</strong>
              <span>{item.meta}</span>
            </button>
          ))}
        </div>
      </section>
      <section className="content-section last-section">
        <SectionHeader title="DERNIÈRES SESSIONS" action="VOIR PLUS" onAction={onOpenSessions} />
        <div className="session-list">
          {sessions.slice(0, 3).map((session) => (
            <button
              key={session.id}
              className="session-row"
              onClick={() => onSelectSession(session.id)}
            >
              <Artwork mark={session.mark} pattern={session.pattern} />
              <div className="session-copy">
                <strong>{session.title}</strong>
                <span>{session.guest}</span>
              </div>
              <small>{session.duration}</small>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
function LiveScreen({
  isPlaying,
  isLiveActive,
  currentTitle,
  currentGuest,
  coverUrl,
  currentTime,
  duration,
  onToggle,
  onPrev,
  onNext,
  onSeek,
}: {
  isPlaying: boolean;
  isLiveActive: boolean;
  currentTitle: string;
  currentGuest: string;
  coverUrl?: string | null;
  currentTime: number;
  duration: number;
  onToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (time: number) => void;
}) {
  const messages = [
    { flag: "🇫🇷", name: "Nadia · Marseille", text: "La diaspora est branchée." },
    { flag: "🇰🇲", name: "Salim · Moroni", text: "Le son est lourd ce matin !" },
    { flag: "🇾🇹", name: "Ali · Mamoudzou", text: "W. Radio jusqu’au bout." },
  ];

  const progressPercent =
    !isLiveActive && duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 100;

  return (
    <main className="screen live-screen">
      <div className="live-topline">
        <span className="live-label">
          <span style={{ backgroundColor: isLiveActive ? "#00ff66" : "#ffffff" }} />{" "}
          {isLiveActive ? "LIVE" : "PODCAST"}
        </span>
        <button className="icon-button" aria-label="Partager">
          <Icon name="share" size={20} />
        </button>
      </div>
      <section className="live-player">
        <div className="cover-glow" />
                  
                          {coverUrl ? (
          <img
            src={coverUrl}
            alt={currentGuest}
            referrerPolicy="no-referrer"
            className="live-artwork"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <Artwork mark="W" pattern="wave" className="live-artwork" />
        )}


        <div className="live-meta">
          <p>{isLiveActive ? "W. RADIO LIVE" : "SESSION WATWANIYA"}</p>
          <h1>{currentTitle.toUpperCase()}</h1>
          <span>{currentGuest}</span>
        </div>
        <Equalizer active={isPlaying} />
        {/* Barre de progression interactive (manipulable pour les épisodes) */}
        <div className="progress-row">
          <span>{isLiveActive ? "DIRECT" : formatTime(currentTime)}</span>
          <div
            onClick={(e) => {
              if (isLiveActive || !duration) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              onSeek(ratio * duration);
            }}
            style={{ cursor: isLiveActive ? "default" : "pointer", height: "8px", display: "flex", alignItems: "center" }}
          >
            <i style={{ width: `${progressPercent}%`, transition: "width 0.15s linear" }} />
          </div>
          <span>{isLiveActive ? "∞" : formatTime(duration)}</span>
        </div>

        <div className="player-controls">
          <button onClick={onPrev} aria-label="Précédent">
            <Icon name="prev" size={24} />
          </button>
          <button
            className="main-play"
            onClick={onToggle}
            aria-label={isPlaying ? "Pause" : "Lecture"}
          >
            <Icon name={isPlaying ? "pause" : "play"} size={30} filled={!isPlaying} />
          </button>
          <button onClick={onNext} aria-label="Suivant">
            <Icon name="next" size={24} />
          </button>
        </div>
      </section>

      <section className="chat-panel">
        <div className="chat-heading">
          <div>
            <span className="live-dot" />
            <strong>CHAT LIVE</strong>
          </div>
          <span>
            <Icon name="headphones" size={15} /> 1 284 à l’écoute
          </span>
        </div>
        <div className="messages">
          {messages.map((message) => (
            <div className="message" key={message.name}>
              <span className="flag">{message.flag}</span>
              <div>
                <strong>{message.name}</strong>
                <p>{message.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input placeholder="Rejoindre la conversation..." />
          <button>
            <Icon name="arrow" size={18} />
          </button>
        </div>
      </section>
    </main>
  );
}

function SessionsScreen({
  currentSessionId,
  isPlaying,
  onSelectSession,
}: {
  currentSessionId: number | null;
  isPlaying: boolean;
  onSelectSession: (sessionId: number) => void;
}) {
  return (
    <main className="screen sessions-screen">
      <header className="page-header">
        <p>PODCASTS & SESSIONS</p>
        <h1>
          PODCASTS
          <br />
          <span>& SESSIONS</span>
        </h1>
      </header>
      <button className="featured-session" onClick={() => onSelectSession(1)}>
        <Artwork mark="269" pattern="rings" />
        <div className="featured-overlay">
          <span>SESSION À LA UNE · ÉP. 08</span>
          <h2>
            NIPVE
            <br />
            ZERADHI
          </h2>
          <p>Avec K'poral Chris</p>
          <i>
            <Icon
              name={isPlaying && currentSessionId === 1 ? "pause" : "play"}
              filled
              size={17}
            />{" "}
            {isPlaying && currentSessionId === 1 ? "EN LECTURE" : "LIRE · MAINTENANT"}
          </i>
        </div>
      </button>
      <div className="filter-row">
        <button className="active">TOUT</button>
        <button>MUSIQUE</button>
        <button>CULTURE</button>
        <button>SOCIÉTÉ</button>
      </div>
      <div className="sessions-grid">
        {sessions.map((session) => {
          const isThisPlaying = isPlaying && currentSessionId === session.id;
          return (
            <button
              key={session.id}
              className="session-card"
              onClick={() => onSelectSession(session.id)}
            >
              <div className="session-art-wrap">
                <Artwork mark={session.mark} pattern={session.pattern} />
                <span>
                  <Icon name={isThisPlaying ? "pause" : "play"} size={15} filled />
                </span>
                <small>{session.duration}</small>
              </div>
              <strong>{session.title}</strong>
              <p>{session.guest}</p>
            </button>
          );
        })}
      </div>
    </main>
  );
}
function MoreScreen() {
  const items: { icon: IconName; title: string; subtitle: string }[] = [
    { icon: "bell", title: "Notifications", subtitle: "Alertes live et nouveaux épisodes" },
    { icon: "headphones", title: "Mes écoutes", subtitle: "Historique et contenus sauvegardés" },
    { icon: "share", title: "Partager W. Radio", subtitle: "Faire rayonner les voix des Comores" },
    { icon: "info", title: "À propos", subtitle: "Watwaniya Production · Moroni" },
  ];

  return (
    <main className="screen more-screen">
      <header className="page-header">
        <p>W. RADIO</p>
        <h1>PLUS</h1>
      </header>
      <section className="brand-manifesto">
        <img src="/assets/watwaniya-logo.png" alt="Watwaniya" />
        <p>
          DÉSORMAIS, LE MONDE
          <br />
          <span>ÉCOUTE LE BLED.</span>
        </p>
      </section>
      <div className="more-list">
        {items.map((item) => (
          <button key={item.title}>
            <span className="more-icon">
              <Icon name={item.icon} />
            </span>
            <div>
              <strong>{item.title}</strong>
              <small>{item.subtitle}</small>
            </div>
          </button>
        ))}
      </div>

      {/* SECTION DÉDICACES & PARTENAIRES */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "20px 0 90px 0" }}>
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: "16px",
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <span style={{ fontSize: "20px" }}>🎙️</span>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#ffffff" }}>
              Dédicaces & Direct
            </h3>
          </div>
          <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.7)", marginBottom: "16px", lineHeight: "1.4" }}>
            Passez à l'antenne ! Envoyez votre dédicace, demandez un titre ou laissez un message vocal au studio.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const nom = (form.elements.namedItem("auditeurNom") as HTMLInputElement).value;
              const message = (form.elements.namedItem("auditeurMsg") as HTMLTextAreaElement).value;
              const numeroWhatsApp = "2690000000";
              const texteFormatte = encodeURIComponent(`Bonjour W. Radio ! Ici ${nom} : ${message}`);
              window.open(`https://wa.me{numeroWhatsApp}?text=${texteFormatte}`, "_blank");
            }}
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <input
              name="auditeurNom"
              type="text"
              placeholder="Votre prénom ou pseudo"
              required
              style={{
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                color: "#ffffff",
                fontSize: "14px",
              }}
            />
            <textarea
              name="auditeurMsg"
              rows={3}
              placeholder="Votre dédicace ou le titre que vous souhaitez écouter..."
              required
              style={{
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                color: "#ffffff",
                fontSize: "14px",
                resize: "none",
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: "#25D366",
                color: "#000000",
                fontWeight: "700",
                padding: "14px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <span>Envoyer sur WhatsApp</span>
            </button>
          </form>
        </div>

        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: "16px",
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <span style={{ fontSize: "20px" }}>🤝</span>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#ffffff" }}>
              Espace Pro & Artistes
            </h3>
          </div>
          <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.7)", marginBottom: "16px", lineHeight: "1.4" }}>
            Vous êtes artiste et souhaitez diffuser vos morceaux, ou une entreprise souhaitant communiquer sur W. Radio ?
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <a
              href="mailto:contact@://watwaniya-radio.com"
              style={{
                backgroundColor: "#00ff66",
                color: "#000000",
                fontWeight: "700",
                padding: "14px",
                borderRadius: "12px",
                textDecoration: "none",
                textAlign: "center",
                fontSize: "14px",
                display: "block",
              }}
            >
              🎵 Envoyer un morceau (Artistes)
            </a>
            <a
              href="mailto:pub@://watwaniya-radio.com"
              style={{
                backgroundColor: "transparent",
                color: "#ffffff",
                fontWeight: "600",
                padding: "14px",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                textDecoration: "none",
                textAlign: "center",
                fontSize: "14px",
                display: "block",
              }}
            >
              📢 Devenir partenaire / Annonceur
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

function MiniPlayer({
  isPlaying,
  isLiveActive,
  title,
  subtitle,
  coverUrl,
  currentTime,
  duration,
  onToggle,
  onOpen,
  onSeek,
}: {
  isPlaying: boolean;
  isLiveActive: boolean;
  title: string;
  subtitle: string;
  coverUrl?: string | null;
  currentTime: number;
  duration: number;
  onToggle: () => void;
  onOpen: () => void;
  onSeek?: (time: number) => void;
}) {
  const progressPercent =
    !isLiveActive && duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div
      className="mini-player"
      style={{
        position: "fixed",
        bottom: "74px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 24px)",
        maxWidth: "460px",
        zIndex: 999,
        overflow: "hidden",
        boxShadow: "0 -6px 24px rgba(0, 0, 0, 0.65)",
      }}
    >
      {!isLiveActive && duration > 0 && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (!onSeek) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            onSeek(ratio * duration);
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "6px",
            backgroundColor: "rgba(255, 255, 255, 0.12)",
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          <div
            style={{
              height: "3px",
              width: `${progressPercent}%`,
              backgroundColor: "#00ff66",
              transition: "width 0.15s linear",
            }}
          />
        </div>
      )}

      <button className="mini-player-main" onClick={onOpen}>
        {coverUrl ? (
          <img
  src={coverUrl}
  alt={title}
  referrerPolicy="no-referrer"
  style={{
    width: "42px",
    height: "42px",
    minWidth: "42px",
    borderRadius: "10px",
    objectFit: "cover",
  }}
/>

        ) : (
          <Artwork mark="W" pattern="wave" />
        )}
        <div>
          <span style={{ color: isLiveActive ? "#00ff66" : "#ffffff" }}>
            {isLiveActive ? "● EN DIRECT" : "▶ EN LECTURE"}
          </span>
          <strong>{title}</strong>
        </div>
        <Equalizer compact active={isPlaying} />
      </button>
      <button
        className="mini-toggle"
        onClick={onToggle}
        aria-label={isPlaying ? "Pause" : "Lecture"}
      >
        <Icon name={isPlaying ? "pause" : "play"} filled={!isPlaying} size={19} />
      </button>
    </div>
  );
}

function BottomNav({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  const tabs: { id: Tab; label: string; icon: IconName }[] = [
    { id: "home", label: "Accueil", icon: "home" },
    { id: "live", label: "Live", icon: "radio" },
    { id: "sessions", label: "Sessions", icon: "grid" },
    { id: "more", label: "Plus", icon: "menu" },
  ];
  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={active === tab.id ? "active" : ""}
          onClick={() => onChange(tab.id)}
        >
          <span>
            {tab.id === "live" && <i />}
            <Icon name={tab.icon} size={21} filled={active === tab.id && tab.id === "home"} />
          </span>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [currentTitle, setCurrentTitle] = useState("Morning Watwaniya");
  const [currentGuest, setCurrentGuest] = useState("DJ Quick · En direct de Moroni");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
    const [searchOpen, setSearchOpen] = useState(false);
    const [search, setSearch] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isLiveActive = currentSessionId === null;


  const [liveTrackTitle, setLiveTrackTitle] = useState("DJ Quick · En direct de Moroni");
    type SearchItem = { id: number | null; title: string };
  const [searchHistory, setSearchHistory] = useState<SearchItem[]>([]);
  const addToHistory = (item: SearchItem) =>
    setSearchHistory((prev) => [item, ...prev.filter((h) => h.title !== item.title)].slice(0, 5));
  const clearHistory = () => setSearchHistory([]);


  const [liveCoverUrl, setLiveCoverUrl] = useState<string | null>(null);
  const lastFetchedTrackRef = useRef<string>("");

  // Récupération automatique du titre joué dans Mixxx via Icecast toutes les 5 secondes
        // Récupération automatique du titre joué dans Mixxx via Icecast toutes les 5 secondes
        useEffect(() => {
    const fetchAzuraMetadata = async () => {
      try {
        const res = await fetch("/azura-api", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();

        const song = data?.now_playing?.song;
        if (song?.text) {
          setLiveTrackTitle(song.text);
        }

        const azuraArt: string = song?.art || "";
        if (azuraArt && !azuraArt.includes("generic_song")) {
          // Si l'image est hébergée sur localhost, on garde le chemin relatif (/api/...) pour l'iPhone
          const cleanArt = azuraArt.startsWith("http://localhost")
            ? azuraArt.replace(/^http:\/\/localhost(:\d+)?/, "")
            : azuraArt;
          setLiveCoverUrl(cleanArt);
        } else {
          setLiveCoverUrl(null);
        }
      } catch {
        // Ignore les micro-coupures
      }
    };

    fetchAzuraMetadata();
    const interval = setInterval(fetchAzuraMetadata, 4000);
    return () => clearInterval(interval);
  }, []);


  const results = useMemo(() => {
    const query = search.toLowerCase().trim();
    const liveItem = { id: null as number | null, title: "Morning Watwaniya (Direct)" };
    const sessionItems = sessions.map((s) => ({ id: s.id as number | null, title: `${s.title} — ${s.guest}` }));
    const allItems = [liveItem, ...sessionItems];

    if (!query) return allItems;
    return allItems.filter((item) => item.title.toLowerCase().includes(query));
  }, [search]);

  const startLive = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      const targetUrl = new URL(RADIO_STREAM_URL, window.location.origin).href;
      if (audio.src !== targetUrl) {
        audio.src = RADIO_STREAM_URL;
        audio.load();
      }
      audio.volume = 1.0;
      setCurrentSessionId(null);
      setCurrentTitle("Morning Watwaniya");
      setCurrentGuest("DJ Quick · En direct de Moroni");
      setCurrentTime(0);
      setDuration(0);
      await audio.play();
      setIsPlaying(true);
      setHasPlayed(true);
    } catch (error) {
      console.error("Erreur lecture direct :", error);
      setIsPlaying(false);
    }
  };

  const playSession = async (sessionId: number) => {
    const audio = audioRef.current;
    const found = sessions.find((s) => s.id === sessionId);
    if (!audio || !found) return;

    // Si on clique sur l'épisode déjà en cours, on bascule Play/Pause
    if (currentSessionId === sessionId) {
      if (audio.paused) {
        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
      return;
    }

    try {
      const targetUrl = new URL(found.audioUrl, window.location.origin).href;
      if (audio.src !== targetUrl) {
        audio.src = found.audioUrl;
        audio.load();
      }
      audio.volume = 1.0;
      setCurrentSessionId(found.id);
      setCurrentTitle(found.title);
      setCurrentGuest(`Avec ${found.guest}`);
      setCurrentTime(0);
      await audio.play();
      setIsPlaying(true);
      setHasPlayed(true);
    } catch (error) {
      console.error("Erreur lecture épisode :", error);
      setIsPlaying(false);
    }
  };

  // Clic sur le gros bouton vert de l'accueil : pilote uniquement le direct
  const handleHomeLiveButton = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isLiveActive && !audio.paused) {
      audio.pause();
      setIsPlaying(false);
    } else {
      await startLive();
    }
  };

  // Clic sur Play/Pause global (Mini-lecteur, page Live, Maintenant à l'antenne)
  const toggleCurrentAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.src) {
      await startLive();
      return;
    }

    if (audio.paused) {
      await audio.play();
      setIsPlaying(true);
      setHasPlayed(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  // Navigation Précédent / Suivant entre le Direct et les 4 épisodes
  const handlePrev = () => {
    if (currentSessionId === null) {
      playSession(sessions[sessions.length - 1].id);
    } else {
      const idx = sessions.findIndex((s) => s.id === currentSessionId);
      if (idx <= 0) {
        startLive();
      } else {
        playSession(sessions[idx - 1].id);
      }
    }
  };

  const handleNext = () => {
    if (currentSessionId === null) {
      playSession(sessions[0].id);
    } else {
      const idx = sessions.findIndex((s) => s.id === currentSessionId);
      if (idx === -1 || idx >= sessions.length - 1) {
        startLive();
      } else {
        playSession(sessions[idx + 1].id);
      }
    }
  };

  const handleSeek = (newTime: number) => {
    if (audioRef.current && !isLiveActive) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <div className="app-shell">
      <audio
        ref={audioRef}
        preload="none"
        playsInline
        aria-label="Lecteur audio W. Radio"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
        onError={() => setIsPlaying(false)}
      />

      {activeTab === "home" && (
        <HomeScreen
          isPlaying={isPlaying}
          isLiveActive={isLiveActive}
          onPlayLive={handleHomeLiveButton}
          onTogglePlayPause={toggleCurrentAudio}
          onSelectSession={playSession}
          onOpenSessions={() => setActiveTab("sessions")}
          onSearch={() => setSearchOpen(true)}
        />
      )}

      {activeTab === "live" && (
        <LiveScreen
  isPlaying={isPlaying}
  isLiveActive={isLiveActive}
  currentTitle={currentTitle}
  currentGuest={isLiveActive ? liveTrackTitle : currentGuest}
  coverUrl={isLiveActive || !hasPlayed ? liveCoverUrl : null}
        currentTime={currentTime}
        duration={duration}
        onToggle={toggleCurrentAudio}
        onPrev={handlePrev}
        onNext={handleNext}
        onSeek={handleSeek}
      />
      )}

      {activeTab === "sessions" && (
        <SessionsScreen
          currentSessionId={currentSessionId}
          isPlaying={isPlaying}
          onSelectSession={playSession}
        />
      )}

      {activeTab === "more" && <MoreScreen />}

      {hasPlayed && activeTab !== "live" && (
        <MiniPlayer
        isPlaying={isPlaying}
        isLiveActive={isLiveActive}
        title={isLiveActive ? liveTrackTitle : currentTitle}
        subtitle={isLiveActive ? "En direct · Moroni" : currentGuest}
        coverUrl={isLiveActive ? liveCoverUrl : null}
        currentTime={currentTime}
        duration={duration}
        onToggle={toggleCurrentAudio}
        onOpen={() => setActiveTab("live")}
      />
      )}

      <BottomNav active={activeTab} onChange={setActiveTab} />

      {searchOpen && (
        <div className="search-modal">
          <div className="search-top">
            <Icon name="search" />
            <input
              autoFocus
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Artistes, émissions, sessions..."
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Effacer le texte"
                style={{ opacity: 0.7, padding: "0 8px", fontSize: "14px" }}
              >
                ✕
              </button>
            )}
            <button
              onClick={() => {
                setSearchOpen(false);
                setSearch("");
              }}
            >
              FERMER
            </button>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "rgba(255, 255, 255, 0.55)",
              }}
            >
              {!search && searchHistory.length > 0 ? "RECHERCHES RÉCENTES" : "SUGGESTIONS W. RADIO"}
            </p>
              
            {!search && searchHistory.length > 0 && (
              <button
                type="button"
                onClick={clearHistory}
                style={{
                  background: "none",
                  border: "none",
                  color: "#00ff66",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Effacer l’historique
              </button>
            )}
          </div>

          <div className="search-results">
            {(!search && searchHistory.length > 0 ? searchHistory : results).map((item) => (
              <button
                key={item.title}
                onClick={() => {
                  addToHistory(item);
                  if (item.id === null) {
                    startLive();
                  } else {
                    playSession(item.id);
                  }
                  setSearchOpen(false);
                  setSearch("");
                }}
              >
                <span>
                  <Icon name="play" size={16} filled />
                </span>
                <strong>{item.title}</strong>
                <Icon name="chevron" size={17} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
