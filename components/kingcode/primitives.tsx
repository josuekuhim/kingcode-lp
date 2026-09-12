"use client";

import { useState, type ReactNode } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import Image from "next/image";
import { mascotPalette, mascotRows } from "@/lib/kingcode-mascot";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function Brand() {
  return <a className="brand" href="#top" aria-label="KingCode home">
    <Image
      className="brand-logo"
      src={`${publicBasePath}/kingcode-logo.png`}
      alt=""
      width={32}
      height={32}
      aria-hidden="true"
      priority
      unoptimized
    />
    <span className="brand-word">king<span>code</span></span>
  </a>;
}

export function SectionHeading({ index, label, title, description }: {
  index: string; label: string; title: ReactNode; description?: string;
}) {
  return <div className="section-heading">
    <div>
      <div className="eyebrow"><span className="section-index">{index}</span>{label}</div>
      <h2>{title}</h2>
    </div>
    {description && <p className="section-description">{description}</p>}
  </div>;
}

export function PanelBar({ title, meta, icon }: { title: string; meta?: ReactNode; icon?: ReactNode }) {
  return <div className="panel-bar">
    <span className="panel-title">{icon ?? <Terminal size={14} />}{title}</span>
    {meta && <span className="panel-meta">{meta}</span>}
  </div>;
}

export function ModelBadge({ model, tone }: { model: string; tone: string }) {
  return <span className={`model-badge tone-${tone}`}><span className="model-dot" />{model}</span>;
}

export function CopyButton({ text, label = "Copy command" }: { text: string; label?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch { setState("error"); }
  }
  return <button type="button" className="copy-button" onClick={copy} aria-label={state === "copied" ? "Copied" : label} title={label}>
    {state === "copied" ? <Check size={15} /> : <Copy size={15} />}
    <span className={state === "idle" ? "sr-only" : "copy-feedback"} aria-live="polite">{state === "copied" ? "Copied" : state === "error" ? "Select text to copy" : label}</span>
  </button>;
}

export function AsciiMascot() {
  return (
    <pre
      className="ascii-mascot"
      role="img"
      aria-label="KingCode mascot: a dark cat with yellow eyes, a white chest and a raised tail"
    >
      {mascotRows.map((row, y) => (
        <span key={y}>
          {row.map((cell, x) => (
            <span
              key={x}
              style={{
                color: cell.foreground ? mascotPalette[cell.foreground] : undefined,
                backgroundColor: cell.background ? mascotPalette[cell.background] : undefined,
              }}
            >
              {cell.glyph}
            </span>
          ))}
          {y < mascotRows.length - 1 ? "\n" : null}
        </span>
      ))}
    </pre>
  );
}
