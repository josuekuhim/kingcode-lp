"use client";

import { useState } from "react";
import { ArrowDown, ArrowRight, Check, ChevronRight, Code2, FileCode2, FileText, Folder, GitBranch, Layers3, Network, ScanSearch, ShieldCheck, Terminal, Workflow } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { contextFiles, routingTasks, sddStages } from "./data";
import { ModelBadge, PanelBar, SectionHeading } from "./primitives";

export function RoutingMatrix() {
  const [selected, setSelected] = useState<string>("code");
  const task = routingTasks.find(t => t.id === selected)!;
  return <section className="section routing-section" id="routing">
    <div className="container">
      <SectionHeading index="04" label="INTELLIGENT ROUTING" title={<>The right model.<br /><span>The right moment.</span></>} description="Architecture needs depth. Implementation needs focus. KingCode routes each task by capacity, cost, latency, quota and the context that actually matters." />
      <div className="panel routing-panel">
        <PanelBar title="router / decision engine" icon={<Network size={15} />} meta={<><span className="live-dot" /> Balanced · cost / quota</>} />
        <div className="routing-split">
          <Table className="routing-table">
            <TableHeader><TableRow><TableHead>Task type</TableHead><TableHead>Best fit</TableHead><TableHead className="fit-column">Optimized for</TableHead></TableRow></TableHeader>
            <TableBody>{routingTasks.map(t => <TableRow key={t.id} data-state={selected === t.id ? "selected" : undefined} onClick={() => setSelected(t.id)}>
              <TableCell><button type="button" className="task-select" onClick={() => setSelected(t.id)} aria-pressed={selected === t.id} aria-controls="routing-inspector"><ChevronRight size={13} />{t.task}</button></TableCell>
              <TableCell><ModelBadge model={t.model} tone={t.tone} /></TableCell>
              <TableCell className="fit-column">{t.fit}</TableCell>
            </TableRow>)}</TableBody>
          </Table>
          <aside className="routing-inspector" id="routing-inspector" aria-live="polite">
            <span className="inspector-label">ROUTE INSPECTOR</span>
            <div className="inspector-heading"><span className="route-symbol"><Network size={21} /></span><ModelBadge model={task.model} tone={task.tone} /></div>
            <h3>{task.short}</h3><p>{task.reason}</p>
            <dl><div><dt>Strategy</dt><dd>{task.strategy}</dd></div><div><dt>Escalation</dt><dd>{task.fallback}<ArrowRight size={12} /></dd></div></dl>
            <div className="inspector-context"><FileCode2 size={14} /><span>{task.context}<code>{task.files}</code></span></div>
          </aside>
        </div>
        <div className="panel-foot"><span><ShieldCheck size={13} /> Fallback + escalation stay policy-aware.</span><span>Illustrative model assignments · privacy-aware</span></div>
      </div>
    </div>
  </section>;
}

export function SddWorkflow() {
  return <section className="section container" id="sdd">
    <div className="sdd-layout">
      <div className="sdd-copy">
        <div className="eyebrow"><span className="section-index">05</span> SPEC-DRIVEN EXECUTION</div>
        <h2>Less improvisation.<br /><span>More intention.</span></h2>
        <p>Specification discipline meets execution discipline. KingCode brings Spec Kit and GSD principles into one connected workflow, from the first decision to the final check.</p>
        <div className="spec-principles"><span><Check size={15} /> Decisions stay attached to code</span><span><Check size={15} /> Every task has acceptance criteria</span><span><Check size={15} /> Every wave ends with verification</span></div>
        <a href="#early-access" className="text-link">Build with a plan <ArrowRight size={15} /></a>
      </div>
      <div className="panel sdd-console">
        <PanelBar title="work-order / WO-0042" icon={<Workflow size={15} />} meta="subscription billing" />
        <div className="sdd-console-body">
          <ol className="sdd-timeline">{sddStages.map((stage, index) => <li className={index === 4 ? "stage-active" : index < 4 ? "stage-done" : ""} key={stage.label}>
            <span className="stage-node">{index < 4 ? <Check size={12} /> : String(index + 1).padStart(2, "0")}</span>
            <span><strong>{stage.label}</strong><code>{stage.file}</code></span>
          </li>)}</ol>
          <div className="wave-detail">
            <div className="wave-heading"><span>EXECUTION WAVES</span><Layers3 size={14} /></div>
            <div className="wave-card wave-complete"><div><Check size={13} /><strong>Wave 00</strong><span>complete</span></div><p>Spec & architecture</p><ModelBadge model="Opus" tone="mauve" /></div>
            <div className="wave-card wave-current"><div><span className="live-dot" /><strong>Wave 01</strong><span>executing</span></div><p>Implementation</p><div className="wave-subtask"><FileCode2 size={12} /> billing API <span>+12 −3</span></div><div className="wave-subtask"><FileCode2 size={12} /> webhook handler <span>queued</span></div><ModelBadge model="Gemma" tone="cherry" /></div>
            <div className="wave-card"><div><ShieldCheck size={13} /><strong>Wave 02</strong><span>queued</span></div><p>Review & verification</p></div>
          </div>
        </div>
        <div className="panel-foot"><span><GitBranch size={13} /> Dependencies resolved before execution</span></div>
      </div>
    </div>
  </section>;
}

export function CodebaseIntelligence() {
  const [selected, setSelected] = useState(0);
  const file = contextFiles[selected];
  return <section className="section context-section" id="context">
    <div className="container">
      <SectionHeading index="06" label="CODEBASE INTELLIGENCE" title={<>The context you need.<br /><span>Nothing you don’t.</span></>} description="Follow symbols, AST and references across your project. Retrieve the relevant code, preserve its relationships and keep the rest out of the prompt." />
      <div className="panel context-panel">
        <PanelBar title="context / symbol explorer" icon={<ScanSearch size={15} />} meta="query: subscription billing" />
        <div className="context-toolbar"><span><Folder size={14} /> billing-service</span><span>4 files selected <i /> 16 symbols retrieved</span></div>
        <div className="context-workspace">
          <div className="file-explorer" role="group" aria-label="Relevant source files">
            <span className="inspector-label">RETRIEVED CONTEXT</span>
            {contextFiles.map((f, index) => <button type="button" className={index === selected ? "is-active" : ""} key={f.path} onClick={() => setSelected(index)} aria-pressed={index === selected} aria-controls="code-preview"><FileCode2 size={14} /><span>{f.name}<small>{f.symbols} symbols</small></span><span className="file-relevance">{f.relevance}%</span></button>)}
            <div className="context-mini-map"><span>CONTEXT BOUNDARY</span><div className="context-pixels" aria-hidden="true">{Array.from({ length: 60 }, (_, i) => <i className={[14, 15, 16, 24, 25, 26, 35, 36].includes(i) ? "pixel-selected" : ""} key={i} />)}</div><p>A focused slice of your codebase.</p></div>
          </div>
          <div className="code-preview" id="code-preview">
            <div className="code-path"><span><FileCode2 size={13} />{file.path}</span><span>TypeScript</span></div>
            <div className="code-lines" tabIndex={0} aria-label={file.path} key={file.path}>{file.code.map((line, index) => <div key={index} className={line.startsWith("//") ? "code-comment" : ""}><span aria-hidden="true">{index + 1}</span><code>{line}</code></div>)}</div>
            <div className="symbol-detail"><span><Code2 size={14} />{file.symbols} relevant symbols</span><span>{file.relevance}% relevance</span></div>
          </div>
        </div>
        <div className="panel-foot"><span><Check size={13} /> Relevant files. Resolved references. Focused context.</span><span>Example codebase</span></div>
      </div>
    </div>
  </section>;
}

export function ArchitectureDiagram() {
  const nodes = [
    { title: "Developer", subtitle: "Intent & constraints", icon: Code2 },
    { title: "CLI Tool", subtitle: "A single interface", icon: Terminal },
    { title: "SDD Engine", subtitle: "Specs & task graph", icon: FileText },
    { title: "Model Router", subtitle: "Intelligent decisions", icon: Workflow },
    { title: "Router Layer", subtitle: "Provider connections", icon: Network },
  ];
  return <section className="section container" id="architecture">
      <SectionHeading index="07" label="UNDER THE HOOD" title={<>One control plane.<br /><span>Every provider.</span></>} description="A CLI-first interface, a structured execution engine and a flexible router layer. Each part has a clear responsibility." />
    <div className="architecture-panel panel">
      <PanelBar title="system / orchestration topology" icon={<Network size={15} />} meta="provider-agnostic by design" />
      <div className="architecture-flow">{nodes.map(({ title, subtitle, icon: Icon }, index) => <div className={`architecture-node ${index === 3 ? "architecture-active" : ""}`} key={title}><span className="architecture-number">0{index + 1}</span><Icon size={23} /><h3>{title}</h3><p>{subtitle}</p>{index < nodes.length - 1 && <ArrowRight className="architecture-connector" size={17} />}</div>)}</div>
      <div className="provider-rail"><span><ArrowDown size={14} /> MODELS / PROVIDERS</span><div><ModelBadge model="Opus" tone="mauve" /><ModelBadge model="Gemma" tone="cherry" /><ModelBadge model="Inkling" tone="steel" /><ModelBadge model="Sonnet" tone="amber" /><span className="provider-more">+ your preferred models</span></div></div>
    </div>
  </section>;
}
