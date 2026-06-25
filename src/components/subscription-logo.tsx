"use client";

import { useState, useEffect, useRef } from "react";

// Known service name → clearbit domain
const DOMAIN_MAP: Record<string, string> = {
  // Streaming video
  "netflix": "netflix.com",
  "hulu": "hulu.com",
  "disney+": "disneyplus.com",
  "disney plus": "disneyplus.com",
  "amazon prime": "amazon.com",
  "amazon prime video": "amazon.com",
  "prime video": "amazon.com",
  "hbo": "hbomax.com",
  "hbo max": "hbomax.com",
  "max": "max.com",
  "apple tv+": "apple.com",
  "apple tv plus": "apple.com",
  "peacock": "peacocktv.com",
  "paramount+": "paramountplus.com",
  "paramount plus": "paramountplus.com",
  "youtube premium": "youtube.com",
  "youtube tv": "youtube.com",
  "crunchyroll": "crunchyroll.com",
  "funimation": "funimation.com",
  "twitch": "twitch.tv",
  "discovery+": "discoveryplus.com",
  "discovery plus": "discoveryplus.com",
  "espn+": "espnplus.com",
  "espn plus": "espnplus.com",
  "dazn": "dazn.com",
  "mubi": "mubi.com",
  "shudder": "shudder.com",
  "curiosity stream": "curiositystream.com",
  "nebula": "nebula.tv",
  "plex": "plex.tv",

  // Music
  "spotify": "spotify.com",
  "apple music": "apple.com",
  "tidal": "tidal.com",
  "soundcloud": "soundcloud.com",
  "pandora": "pandora.com",
  "deezer": "deezer.com",
  "amazon music": "amazon.com",
  "youtube music": "youtube.com",
  "audible": "audible.com",
  "kindle unlimited": "amazon.com",

  // Productivity & SaaS
  "microsoft 365": "microsoft.com",
  "office 365": "microsoft.com",
  "microsoft office": "microsoft.com",
  "google workspace": "workspace.google.com",
  "google one": "one.google.com",
  "dropbox": "dropbox.com",
  "notion": "notion.so",
  "slack": "slack.com",
  "zoom": "zoom.us",
  "github": "github.com",
  "github copilot": "github.com",
  "gitlab": "gitlab.com",
  "adobe": "adobe.com",
  "adobe creative cloud": "adobe.com",
  "adobe acrobat": "adobe.com",
  "adobe acrobat pro": "adobe.com",
  "adobe acrobat reader": "adobe.com",
  "adobe photoshop": "adobe.com",
  "adobe illustrator": "adobe.com",
  "adobe premiere": "adobe.com",
  "figma": "figma.com",
  "linear": "linear.app",
  "jira": "atlassian.com",
  "confluence": "atlassian.com",
  "atlassian": "atlassian.com",
  "trello": "trello.com",
  "asana": "asana.com",
  "monday": "monday.com",
  "monday.com": "monday.com",
  "clickup": "clickup.com",
  "basecamp": "basecamp.com",
  "airtable": "airtable.com",
  "webflow": "webflow.com",
  "squarespace": "squarespace.com",
  "wix": "wix.com",
  "shopify": "shopify.com",
  "mailchimp": "mailchimp.com",
  "intercom": "intercom.com",
  "zendesk": "zendesk.com",
  "hubspot": "hubspot.com",
  "salesforce": "salesforce.com",
  "canva": "canva.com",

  // Security & Privacy
  "1password": "1password.com",
  "lastpass": "lastpass.com",
  "dashlane": "dashlane.com",
  "bitwarden": "bitwarden.com",
  "nordvpn": "nordvpn.com",
  "expressvpn": "expressvpn.com",
  "surfshark": "surfshark.com",
  "proton": "proton.me",
  "protonmail": "proton.me",
  "proton vpn": "protonvpn.com",
  "protonvpn": "protonvpn.com",
  "mullvad": "mullvad.net",

  // AI & Dev tools
  "chatgpt": "openai.com",
  "openai": "openai.com",
  "claude": "anthropic.com",
  "anthropic": "anthropic.com",
  "cursor": "cursor.sh",
  "github actions": "github.com",
  "vercel": "vercel.com",
  "netlify": "netlify.com",
  "heroku": "heroku.com",
  "digitalocean": "digitalocean.com",
  "aws": "aws.amazon.com",
  "azure": "azure.microsoft.com",
  "google cloud": "cloud.google.com",
  "cloudflare": "cloudflare.com",
  "mongodb": "mongodb.com",
  "datadog": "datadoghq.com",
  "sentry": "sentry.io",
  "twilio": "twilio.com",
  "sendgrid": "sendgrid.com",
  "postmark": "postmarkapp.com",

  // Food & delivery
  "hellofresh": "hellofresh.com",
  "hello fresh": "hellofresh.com",
  "doordash": "doordash.com",
  "uber eats": "uber.com",
  "grubhub": "grubhub.com",
  "instacart": "instacart.com",
  "factor": "factor75.com",
  "factor 75": "factor75.com",
  "marley spoon": "marleyspoon.com",
  "green chef": "greenchef.com",
  "every plate": "everyplate.com",
  "everyplate": "everyplate.com",
  "home chef": "homechef.com",
  "freshly": "freshly.com",
  "sun basket": "sunbasket.com",

  // Fitness & wellness
  "peloton": "onepeloton.com",
  "noom": "noom.com",
  "myfitnesspal": "myfitnesspal.com",
  "calm": "calm.com",
  "headspace": "headspace.com",
  "strava": "strava.com",
  "whoop": "whoop.com",
  "fitbit premium": "fitbit.com",
  "beachbody": "beachbody.com",

  // Gaming
  "xbox game pass": "xbox.com",
  "xbox game pass ultimate": "xbox.com",
  "xbox": "xbox.com",
  "playstation": "playstation.com",
  "playstation plus": "playstation.com",
  "playstation now": "playstation.com",
  "playstation network": "playstation.com",
  "sony playstation": "playstation.com",
  "ps plus": "playstation.com",
  "ps now": "playstation.com",
  "psn": "playstation.com",
  "nintendo switch online": "nintendo.com",
  "nintendo": "nintendo.com",
  "ea play": "ea.com",
  "ubisoft+": "ubisoft.com",
  "uplay": "ubisoft.com",
  "steam": "steampowered.com",
  "epic games": "epicgames.com",

  // Big tech
  "amazon": "amazon.com",
  "apple": "apple.com",
  "apple one": "apple.com",
  "icloud": "apple.com",
  "icloud+": "apple.com",
  "google": "google.com",
  "microsoft": "microsoft.com",
  "youtube": "youtube.com",
  "linkedin": "linkedin.com",
  "linkedin premium": "linkedin.com",
  "twitter": "twitter.com",
  "x": "x.com",
  "reddit": "reddit.com",
  "reddit premium": "reddit.com",
  "medium": "medium.com",
  "substack": "substack.com",

  // Education
  "duolingo": "duolingo.com",
  "duolingo plus": "duolingo.com",
  "masterclass": "masterclass.com",
  "skillshare": "skillshare.com",
  "udemy": "udemy.com",
  "coursera": "coursera.com",
  "pluralsight": "pluralsight.com",
  "linkedin learning": "linkedin.com",
  "grammarly": "grammarly.com",

  // Storage & backup
  "icloud storage": "apple.com",
  "google drive": "google.com",
  "onedrive": "microsoft.com",
  "backblaze": "backblaze.com",
  "box": "box.com",
};

const AVATAR_COLORS = [
  "#4F46E5", "#0EA5E9", "#10B981", "#F59E0B",
  "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6",
  "#F97316", "#6366F1", "#84CC16", "#06B6D4",
];

function getDomain(name: string): string {
  const key = name.toLowerCase().trim();
  if (DOMAIN_MAP[key]) return DOMAIN_MAP[key];
  // Auto-guess: strip non-alphanumeric and append .com
  const slug = key.replace(/[^a-z0-9]/g, "");
  return slug + ".com";
}

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

type Props = {
  name: string;
  size?: number;
  className?: string;
};

export function SubscriptionLogo({ name, size = 32, className = "" }: Props) {
  const [failed, setFailed] = useState(false);
  const prevNameRef = useRef(name);

  useEffect(() => {
    if (prevNameRef.current !== name) {
      prevNameRef.current = name;
      setFailed(false);
    }
  }, [name]);

  const trimmed = name.trim();
  const letter = trimmed ? trimmed[0].toUpperCase() : "";
  const color = getAvatarColor(trimmed || "?");
  const fontSize = Math.round(size * 0.42);
  const radius = Math.round(size * 0.25);

  // Only fetch a logo for names we explicitly recognise — avoids generic globe icons
  const knownDomain = trimmed ? DOMAIN_MAP[trimmed.toLowerCase()] : undefined;

  if (!trimmed) {
    return <div style={{ width: size, height: size, minWidth: size }} className={`shrink-0 ${className}`} />;
  }

  const showAvatar = !knownDomain || failed;

  if (showAvatar) {
    return (
      <div
        className={`shrink-0 flex items-center justify-center text-white font-semibold select-none ${className}`}
        style={{ width: size, height: size, minWidth: size, backgroundColor: color, fontSize, borderRadius: radius }}
        aria-hidden="true"
      >
        {letter}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={knownDomain}
      src={`https://www.google.com/s2/favicons?domain=${knownDomain}&sz=64`}
      alt=""
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className={`shrink-0 object-contain bg-white border border-gray-100 ${className}`}
      style={{ width: size, height: size, minWidth: size, borderRadius: radius }}
    />
  );
}
