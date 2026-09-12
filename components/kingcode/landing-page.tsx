"use client";

import { useState, type FormEvent } from "react";
import { ArrowDown, ArrowRight, Check, ChevronRight, Code2, Command, Cpu, FileCheck2, Fingerprint, GitBranch, Layers3, Menu, Network, ScanSearch, ShieldCheck, Terminal, Workflow, X } from "lucide-react";
import { subscribeToNewsletter } from "@/lib/newsletter";
import { Brand, ModelBadge, PanelBar, SectionHeading } from "./primitives";
import { TerminalDemo } from "./terminal-demo";
import { ArchitectureDiagram, CodebaseIntelligence, RoutingMatrix, SddWorkflow } from "./product-panels";

function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [["Workflow", "#workflow"], ["Open core", "#community"], ["Routing", "#routing"], ["Architecture", "#architecture"]];
  return <header className="site-header"><nav className="container navbar" aria-label="Main navigation"><Brand />
    <div className="desktop-nav">{links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</div>
    <a className="button button-small button-outline nav-access" href="#early-access">Get early access<ArrowRight size={14} /></a>
    <button className="menu-toggle" type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
  </nav>{open && <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">{links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}<ChevronRight size={15} /></a>)}</nav>}</header>;
}

function HeroSection() {
  return <section className="hero container" id="top">
    <div className="hero-copy">
      <a href="#community" className="hero-badge"><span className="live-dot" /> OPEN-SOURCE ENGINE <span className="badge-divider" /> Meet KingCode<ChevronRight size={12} /></a>
      <h1>Own the engine.<br /><em>Skip the ops.</em></h1>
      <p className="hero-description">KingCode is an orchestration layer for engineering: spec-driven, context-aware and multi-model. Run the complete engine locally, or let KingCode Cloud operate the infrastructure around it.</p>
      <div className="hero-actions"><a className="button button-primary" href="#early-access">Get early access<ArrowRight size={17} /></a><a className="button button-outline" href="#workflow">Explore the workflow<ArrowDown size={15} /></a></div>
      <div className="hero-proof"><span><Terminal size={14} /> Open-source core</span><span><Network size={14} /> BYOK</span><span><FileCheck2 size={14} /> Local runs</span></div>
    </div>
    <TerminalDemo />
  </section>;
}

function ProblemSection() {
  const problems = [
    { title: "One model. Every task.", desc: "Deep reasoning for a one-line change. A fast model for a complex investigation. The fit matters.", before: "Same model, different problems", after: "Intelligence matched to the work", icon: Cpu },
    { title: "Context without direction.", desc: "Pasting more files into a prompt does not connect the spec, the plan and the implementation.", before: "Disconnected prompts & files", after: "A continuous, spec-driven workflow", icon: GitBranch },
    { title: "Your focus is the bottleneck.", desc: "Switching tools, choosing models and stitching outputs together should not be your full-time job.", before: "Manual handoffs at every step", after: "One interface, coordinated execution", icon: Command },
  ];
  return <section className="section container" id="why">
    <SectionHeading index="01" label="BUILT FOR THE WAY YOU WORK" title={<>Great software takes<br /><span>more than a great prompt.</span></>} description="Different work demands different thinking. Your development tools should know the difference." />
    <div className="problem-grid">{problems.map(({ title, desc, before, after, icon: Icon }) => <article className="problem-card" key={title}><Icon className="card-icon" size={21} /><h3>{title}</h3><p>{desc}</p><div className="problem-comparison"><span><X size={12} />{before}</span><span><Check size={13} />{after}</span></div></article>)}</div>
  </section>;
}

function WorkflowSteps() {
  const steps = [
    { label: "Understand", detail: "Intent & constraints", icon: Command },
    { label: "Discover", detail: "Codebase & context", icon: ScanSearch },
    { label: "Specify", detail: "Plan & task graph", icon: FileCheck2 },
    { label: "Route", detail: "The best-fit model", icon: Network },
    { label: "Execute", detail: "Build, review, verify", icon: ShieldCheck },
  ];
  return <section className="workflow-ribbon container" id="workflow" aria-labelledby="workflow-heading">
    <div className="ribbon-title"><span className="eyebrow">THE DEVELOPMENT LOOP</span><h2 id="workflow-heading">From intent to shipped.</h2></div>
    <ol className="workflow-track">{steps.map(({ label, detail, icon: Icon }, i) => <li key={label}><span className="workflow-icon"><Icon size={19} /></span><div><span className="step-index">0{i + 1}</span><strong>{label}</strong><p>{detail}</p></div>{i < 4 && <ChevronRight className="step-arrow" size={16} />}</li>)}</ol>
  </section>;
}

function FeatureGrid() {
  return <section className="section container" id="features">
    <SectionHeading index="02" label="A SYSTEM, NOT JUST A CHAT" title={<>Built for the work<br /><span>behind the prompt.</span></>} description="A focused set of capabilities that keeps intent, context and execution moving together." />
    <div className="feature-bento">
      <article className="bento-card bento-wide">
        <div className="bento-copy"><Network className="card-icon" size={22} /><h3>Intelligent by assignment.</h3><p>Task-based routing meets automatic escalation. Use a focused model for scoped work; bring deeper reasoning in when the problem changes.</p></div>
        <div className="mini-router" aria-label="An example implementation route"><div className="mini-route-source"><Code2 size={15} /><span>implementation.task</span><code>complexity: low</code></div><div className="mini-route-line" /><div className="mini-route-targets"><div className="chosen"><span className="model-dot" />Gemma<span>selected</span></div><div><span className="model-dot" />Sonnet<span>escalation</span></div></div><div className="mini-route-footer"><Check size={12} /> Matched to scope, context and cost</div></div>
      </article>
      <article className="bento-card bento-context"><ScanSearch className="card-icon" size={22} /><h3>Context with precision.</h3><p>Symbols, references and project structure. Only the code that moves the task forward.</p><div className="symbol-stack"><code><span>ƒ</span> createCheckout()<small>function</small></code><code><span>&#123;&#125;</span> Subscription<small>type</small></code><code><GitBranch size={13} /> webhookHandler<small>reference</small></code></div></article>
      <article className="bento-card"><Layers3 className="card-icon" size={22} /><h3>Work in waves.</h3><p>Artifact Graph dependencies, bounded tasks and review checkpoints built into the plan.</p><div className="mini-waves"><span><Check size={12} />Plan</span><i /><span className="current">Build</span><i /><span>Verify</span></div></article>
      <article className="bento-card"><Terminal className="card-icon" size={22} /><h3>Stay in your terminal.</h3><p>A keyboard-native CLI / TUI experience with one place to direct every model.</p><div className="mini-command"><span>❯</span><code>/dev next</code><span className="cursor" /></div></article>
      <article className="bento-card"><Fingerprint className="card-icon" size={22} /><h3>Your stack. Your models.</h3><p>BYOK, local execution and provider-agnostic connections, without rewriting your workflow.</p><div className="provider-chips"><span>OpenCode Go</span><span>OpenRouter</span><span>Ollama</span><span>Custom</span></div></article>
    </div>
  </section>;
}

type Edition = "community" | "cloud";

const editionContent = {
  community: {
    name: "Community",
    eyebrow: "OPEN-SOURCE CORE",
    title: "The complete engine.",
    description: "Run KingCode yourself, with no account and no artificial limit on local runs.",
    tags: ["Free", "Self-hosted", "BYOK"],
    points: ["Full CLI + SDD workflow", "Context Engine + Artifact Graph", "Smart Model Router + local execution", "Unlimited local runs", "Project config in .kingcode/config.yaml"],
    command: "king dev --mode local --profile standard",
    output: ["core engine loaded", "local providers available", "run 0042 · executing"],
  },
  cloud: {
    name: "KingCode Cloud",
    eyebrow: "MANAGED INFRASTRUCTURE",
    title: "The same engine. Less maintenance.",
    description: "Keep the intelligence open while Cloud handles sync, operations and the infrastructure around it.",
    tags: ["Sync", "Zero-touch", "Teams"],
    points: ["king login · automatic bootstrap", "Profiles + routing policies across machines", "Managed Model Registry, quotas and run history", "Model updates + zero-touch provider config", "Optional Vault + secret references", "Remote Runs and team controls as they arrive"],
    command: "king login && king sync",
    output: ["profile / standard synced", "providers / 4 references ready", "workspace / billing-service linked"],
  },
} as const;

const comparisonRows: Array<{ label: string; community: boolean | string; cloud: boolean | string }> = [
  { label: "Core", community: true, cloud: true },
  { label: "SDD", community: true, cloud: true },
  { label: "Smart Router", community: true, cloud: true },
  { label: "BYOK", community: true, cloud: true },
  { label: "Local Models", community: true, cloud: true },
  { label: "Local Execution", community: true, cloud: true },
  { label: "Cloud Sync", community: false, cloud: true },
  { label: "Profiles", community: "local", cloud: "managed" },
  { label: "Vault", community: "local", cloud: "managed" },
  { label: "Model Registry", community: "bundled", cloud: "live" },
  { label: "Quota Dashboard", community: false, cloud: true },
  { label: "Run History", community: "local", cloud: "cloud" },
  { label: "Remote Runs", community: false, cloud: true },
  { label: "Teams", community: false, cloud: true },
];

function MatrixValue({ value }: { value: boolean | string }) {
  if (value === true) return <span className="matrix-check" aria-label="Included"><Check size={14} /></span>;
  if (value === false) return <span className="matrix-dash" aria-label="Not included">—</span>;
  return <span className="matrix-text">{value}</span>;
}

function CommunityCloudSection() {
  const [activeEdition, setActiveEdition] = useState<Edition>("community");
  const edition = editionContent[activeEdition];
  return <section className="section container community-section" id="community">
    <SectionHeading index="03" label="OPEN SOURCE / MANAGED INFRA" title={<>The intelligence is open.<br /><span>The infrastructure is managed.</span></>} description="Community gives you the engine. Cloud removes the maintenance. Choose how much of the operating work you want to own." />
    <div className="positioning-callout panel"><div className="positioning-label"><span className="section-index">01</span><span>THE PRODUCT SPLIT</span></div><div><h3>KingCode Cloud does not unlock KingCode.</h3><p>It simply takes the work of operating KingCode off your plate.</p></div><ArrowRight className="positioning-arrow" size={20} /></div>
    <div className="edition-layout">
      <div className="edition-cards">
        {(Object.keys(editionContent) as Edition[]).map(key => { const item = editionContent[key]; return <button type="button" className={`edition-card ${activeEdition === key ? "is-active" : ""}`} key={key} onClick={() => setActiveEdition(key)} aria-pressed={activeEdition === key}>
          <span className="edition-card-top"><span className="eyebrow"><span className={key === "cloud" ? "live-dot" : "edition-square"} /> {item.eyebrow}</span><ChevronRight size={15} /></span>
          <strong>{item.name}</strong><span>{key === "community" ? "Complete engine. On your machine." : "Same engine. Less maintenance."}</span>
          <div className="edition-tags">{item.tags.map(tag => <small key={tag}>{tag}</small>)}</div>
        </button>; })}
      </div>
      <div className="panel edition-console">
        <PanelBar title={activeEdition === "community" ? "community / local-runtime" : "cloud / control-plane"} meta={activeEdition === "community" ? "no account required" : "managed workspace"} />
        <div className="edition-console-body">
          <div className="edition-copy"><span className="inspector-label">{edition.eyebrow}</span><h3>{edition.title}</h3><p>{edition.description}</p><ul className="capability-list">{edition.points.map(point => <li key={point}><Check size={14} />{point}</li>)}</ul></div>
          <div className="edition-terminal" aria-live="polite"><div className="ops-command"><span>❯</span><code>{edition.command}</code></div><div className="ops-output">{edition.output.map((line, index) => <div key={line}><Check size={13} /><span>{line}</span><small>{String(index + 1).padStart(2, "0")}</small></div>)}</div><div className="edition-terminal-foot"><span>mode / {activeEdition === "community" ? "local" : "cloud"}</span><span>ready</span></div></div>
        </div>
      </div>
    </div>
    <div className="panel comparison-panel"><PanelBar title="community / cloud matrix" icon={<GitBranch size={15} />} meta="same engine · different operations" /><div className="matrix-scroll"><table className="edition-matrix"><caption className="sr-only">Community and Cloud feature comparison</caption><thead><tr><th scope="col">Capability</th><th scope="col">Community</th><th scope="col">Cloud</th></tr></thead><tbody>{comparisonRows.map(row => <tr key={row.label}><th scope="row">{row.label}</th><td><MatrixValue value={row.community} /></td><td><MatrixValue value={row.cloud} /></td></tr>)}</tbody></table></div><div className="comparison-note"><span><Check size={14} /> Intelligence is never placed behind a paywall.</span><span>Own the runtime. Or let us operate it for you.</span></div></div>
  </section>;
}

function ControlPlaneSection() {
  const [mode, setMode] = useState<"local" | "hybrid" | "cloud">("hybrid");
  const modes = {
    local: { command: "king run --mode local --profile mechanical", note: "API keys stay on this machine. Local models and connected providers remain yours.", lines: ["privacy / local only", "providers / Ollama · custom", "routing / mechanical"] },
    hybrid: { command: "king run --mode hybrid --profile standard", note: "Keep secrets local while using synced policies and the providers you choose.", lines: ["privacy / keys local", "providers / OpenRouter · Ollama", "routing / standard"] },
    cloud: { command: "king run --mode cloud --profile architect", note: "Let Cloud manage references, registry updates and the operating surface.", lines: ["privacy / policy aware", "providers / managed references", "routing / architect"] },
  } as const;
  const current = modes[mode];
  const registry = [
    { model: "Opus", tone: "mauve", capability: "architecture · review", context: "200k", cost: "$$$" },
    { model: "Gemma", tone: "cherry", capability: "implementation · speed", context: "128k", cost: "$" },
    { model: "Inkling", tone: "steel", capability: "debugging · evidence", context: "64k", cost: "$$" },
    { model: "Sonnet", tone: "amber", capability: "infra · systems", context: "200k", cost: "$$" },
  ] as const;
  const future = ["Remote Runs", "Persistent runs", "Cloud workers", "Sandboxed exec", "GitHub PRs", "Shared context", "Team policies", "RBAC", "Audit logs", "Budgets", "Approval flows", "SSO / SAML", "Private deployment"];
  return <section className="section container control-plane-section" id="control-plane">
    <SectionHeading index="08" label="OPERATING SURFACE" title={<>Your runtime.<br /><span>Your rules.</span></>} description="Bring your own keys, define the policy and choose where execution happens. The control plane follows the hierarchy you set." />
    <div className="ops-grid">
      <div className="panel environment-console"><PanelBar title="king / environment" meta="config resolution" /><div className="mode-tabs" role="tablist" aria-label="Execution mode"><span>EXECUTION MODE</span>{(Object.keys(modes) as Array<keyof typeof modes>).map(key => <button type="button" role="tab" aria-selected={mode === key} className={mode === key ? "is-active" : ""} key={key} onClick={() => setMode(key)}>{key}</button>)}</div><div className="ops-command"><span>❯</span><code>{current.command}</code></div><div className="ops-output">{current.lines.map((line, index) => <div key={line}><Check size={13} /><span>{line}</span><small>{String(index + 1).padStart(2, "0")}</small></div>)}</div><p className="mode-note">{current.note}</p><div className="secret-strip"><Fingerprint size={15} /><span><strong>BYOK / secret references</strong><small>Keep API keys local or use the optional managed Vault. Config stores references, never exposed keys.</small></span></div></div>
      <div className="panel registry-console"><PanelBar title="model-registry / live" meta="capabilities + policy" /><div className="registry-summary"><span className="live-dot" /> Catalog synced to your routing policy <code>updated 2m ago</code></div><div className="registry-list">{registry.map(entry => <div className="registry-row" key={entry.model}><ModelBadge model={entry.model} tone={entry.tone} /><span>{entry.capability}</span><code>{entry.context}</code><small>{entry.cost}</small></div>)}</div><div className="registry-policy"><span>PRIVACY</span><strong>retention-aware</strong><span>PROVIDERS</span><strong>4 connected</strong><span>FALLBACK</span><strong>automatic</strong></div><div className="supported-providers"><span>CONNECTED PROVIDERS</span><div><small>OpenCode Go</small><small>OpenRouter</small><small>Ollama</small><small>Custom</small></div></div></div>
    </div>
    <div className="ops-bottom-grid"><div className="panel config-panel"><PanelBar title=".kingcode / config.yaml" meta="project scope" /><pre className="config-code"><code><span className="config-comment"># project-specific policy</span>{"\n"}<span className="config-key">privacy_mode:</span> hybrid{"\n"}<span className="config-key">providers:</span> [ollama, openrouter]{"\n"}<span className="config-key">validation:</span> pnpm test{ "\n"}<span className="config-key">routing_profile:</span> standard{"\n"}<span className="config-key">sdd:</span> strict{"\n"}<span className="config-key">minimum_workflow:</span> review</code></pre><div className="config-foot"><Check size={13} /> Flags override project config</div></div><div className="panel hierarchy-panel"><PanelBar title="config / resolution" meta="highest priority wins" /><ol className="config-hierarchy"><li><span>01</span><strong>KingCode defaults</strong><code>safe baseline</code></li><li><span>02</span><strong>Cloud profile</strong><code>team / synced</code></li><li><span>03</span><strong>User config</strong><code>~/.kingcode</code></li><li><span>04</span><strong>Project config</strong><code>.kingcode/config.yaml</code></li><li className="hierarchy-top"><span>05</span><strong>CLI flags</strong><code>--profile hard</code></li></ol><div className="future-cloud"><span>ON THE CLOUD HORIZON</span><div>{future.map(item => <small key={item}>{item}</small>)}</div></div></div></div>
  </section>;
}

function FinalCTA() {
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();
    const website = String(formData.get("website") ?? "");

    setFormState("submitting");
    setErrorMessage("");

    try {
      await subscribeToNewsletter(email, website);
      form.reset();
      setFormState("success");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not save your email. Please try again.");
      setFormState("error");
    }
  }

  return <section className="section container" id="early-access">
    <div className="final-cta">
      <div className="cta-grid" aria-hidden="true" />
      <div className="cta-copy"><span className="eyebrow"><span className="live-dot" /> EARLY ACCESS</span><h2>Your next idea.<br /><span>Already in motion.</span></h2><p>A single interface for the full development loop.<br />Get an early look at KingCode.</p></div>
      <div className="cta-form-panel panel"><PanelBar title="kingcode / early-access" meta="v0.1" />
        {formState === "success" ? <div className="form-success" role="status"><Check size={25} /><h3>You’re on the list.</h3><p>Your email is saved. Check your inbox — we just sent a confirmation.</p><button className="text-link" type="button" onClick={() => setFormState("idle")}>Add another email<ArrowRight size={14} /></button></div> : <form onSubmit={submit} aria-busy={formState === "submitting"}>
          <label htmlFor="waitlist-email">Your work email</label><input type="email" id="waitlist-email" name="email" autoComplete="email" placeholder="you@company.com" required />
          <div className="newsletter-honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
          {formState === "error" && <p className="newsletter-error" role="alert">{errorMessage}</p>}
          <button type="submit" className="button button-primary" disabled={formState === "submitting"}>{formState === "submitting" ? "Saving…" : "Join the waitlist"}<ArrowRight size={17} /></button><p className="form-note">Confirmation email follows · no spam.</p>
        </form>}
      </div>
    </div>
  </section>;
}

function Footer() {
  return <footer className="footer container"><div><Brand /><p>The intelligence is open. The infrastructure is managed.</p></div><nav aria-label="Footer navigation"><a href="#context">Docs</a><a href="#architecture">GitHub</a><a href="#workflow">Roadmap</a><a href="#early-access">Contact</a></nav><span>© 2026 KingCode</span></footer>;
}

export default function LandingPage() {
  return <><a className="skip-link" href="#main-content">Skip to content</a><Navbar /><main id="main-content"><HeroSection /><div className="signal-strip"><div className="container"><span><Terminal size={15} /> OPEN-SOURCE CORE</span><span><Network size={15} /> INTELLIGENT MODEL ROUTING</span><span><Workflow size={15} /> SPEC-DRIVEN EXECUTION</span></div></div><ProblemSection /><WorkflowSteps /><FeatureGrid /><CommunityCloudSection /><RoutingMatrix /><SddWorkflow /><CodebaseIntelligence /><ArchitectureDiagram /><ControlPlaneSection /><FinalCTA /></main><Footer /></>;
}
