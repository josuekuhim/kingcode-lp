"use client";

import { useEffect, useState } from "react";
import { Check, Circle, FileCode2, FileText, GitBranch, Play, RotateCcw, Terminal, Workflow } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { AsciiMascot, CopyButton, ModelBadge } from "./primitives";

const command = '/dev feature "Add subscription billing"';
const logs = [
  ["Intent resolved", "feature / billing", "42ms"],
  ["Codebase context retrieved", "16 symbols · 4 files", "118ms"],
  ["Specification approved", "4 acceptance criteria", "263ms"],
  ["Work order assembled", "3 execution waves", "391ms"],
];
const assignments = [
  { task: "Specification", model: "Opus", tone: "mauve" },
  { task: "Implementation", model: "Gemma", tone: "cherry" },
  { task: "Debugging", model: "Inkling", tone: "steel" },
  { task: "Infrastructure", model: "Sonnet", tone: "amber" },
];

export function TerminalDemo() {
  const [tab, setTab] = useState("execution");
  const [phase, setPhase] = useState(4);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => {
      if (phase >= 6) setRunning(false);
      else setPhase(phase + 1);
    }, 700);
    return () => window.clearTimeout(id);
  }, [running, phase]);

  const complete = phase >= 6;
  return <div className="console-wrap">
    <div className="console-overline"><span><span className="live-dot" />KINGCODE WORKSPACE</span><span>INTERACTIVE PREVIEW</span></div>
    <div className="main-console panel">
      <div className="console-titlebar">
        <div className="window-controls" aria-hidden="true"><i /><i /><i /></div>
        <span>kingcode / billing-service</span>
        <span className="console-branch"><GitBranch size={12} /> main</span>
      </div>
      <Tabs value={tab} onValueChange={setTab} className="console-tabs">
        <div className="console-tabbar">
          <TabsList className="kc-tabs" aria-label="Terminal views">
            <TabsTrigger value="execution"><Terminal size={14} />Terminal</TabsTrigger>
            <TabsTrigger value="spec"><FileText size={14} />Spec</TabsTrigger>
            <TabsTrigger value="diff"><FileCode2 size={14} />Diff<span className="tab-count">3</span></TabsTrigger>
          </TabsList>
          <span className="demo-label">DEMO</span>
        </div>
        <TabsContent value="execution" className="console-tab-content">
          <div className="terminal-welcome"><AsciiMascot /><div><strong>KingCode<span> v0.1</span></strong><p>Good software starts<br />with a clear intent.</p><span className="welcome-state">/ ready for your next idea</span></div></div>
          <div className="command-box"><span className="command-prompt">❯</span><code>/dev feature <span>&quot;Add subscription billing&quot;</span></code><CopyButton text={command} /></div>
          <div className="console-log">
            {logs.map(([title, detail, time], index) => <div className={`log-row ${index < phase ? "is-resolved" : ""}`} key={title}>
              {index < phase ? <Check size={13} /> : <Circle size={11} />}
              <span>{title}<small>{detail}</small></span><time>{index < phase ? time : "—"}</time>
            </div>)}
          </div>
          <div className="assignment-header"><Workflow size={13} /><span>TASK ROUTING</span><span>policy: balanced</span></div>
          <div className="assignment-grid">{assignments.map((item) => <div key={item.task}><span>{item.task}</span><ModelBadge {...item} /></div>)}</div>
        </TabsContent>
        <TabsContent value="spec" className="console-tab-content">
          <div className="document-preview">
            <div className="document-path"><FileText size={14} /> .kingcode/specs/billing.md <span>APPROVED</span></div>
            <p className="code-comment"># SPEC-0042 / subscription billing</p>
            <h3>A plan. Before a single line.</h3>
            <p>Add recurring billing with a hosted checkout and an idempotent webhook handler.</p>
            <span className="document-label">ACCEPTANCE CRITERIA</span>
            {["Create checkout sessions for eligible plans", "Sync subscription state from signed webhooks", "Handle retries without duplicate updates", "Verify cancellation and failed-payment paths"].map(t => <div className="criteria-row" key={t}><Check size={14} />{t}</div>)}
            <div className="document-note"><ModelBadge model="Opus" tone="mauve" /><span>reviewed · ready for execution</span></div>
          </div>
        </TabsContent>
        <TabsContent value="diff" className="console-tab-content">
          <div className="diff-preview">
            <div className="document-path"><FileCode2 size={14} /> src/billing/stripe.ts <span>+12 −3</span></div>
            <div className="diff-file"><span>01</span><code>export async function createCheckout(plan) &#123;</code></div>
            <div className="diff-file diff-removed"><span>02</span><code>− return createPayment(plan);</code></div>
            {['+ const session = await stripe.checkout', '+   .sessions.create({', '+     mode: "subscription",', '+     line_items: [{', '+       price: plan.priceId,', '+       quantity: 1,', '+     }],', '+   });', '+ return session;'].map((line, i) => <div className="diff-file diff-added" key={line}><span>{String(i + 3).padStart(2, "0")}</span><code>{line}</code></div>)}
            <div className="diff-file"><span>12</span><code>&#125;</code></div>
            <div className="document-note"><ModelBadge model="Gemma" tone="cherry" /><span>scoped to SPEC-0042</span></div>
          </div>
        </TabsContent>
      </Tabs>
      <div className="console-bottom">
        <div className="execution-progress"><div><span className={complete ? "" : "live-dot"} />{complete ? <Check size={13} /> : null}<span>{complete ? "Verification complete" : running && phase < 4 ? "Preparing work order…" : phase >= 5 ? "Running verification…" : "Executing wave 1 of 3"}</span><span>{Math.min(100, phase * 16 + (complete ? 4 : 0))}%</span></div><Progress value={complete ? 100 : phase * 16} aria-label="Demo execution progress" /></div>
        <button className="replay-button" disabled={running} onClick={() => { setTab("execution"); setPhase(0); setRunning(true); }}>{running ? <Play size={13} /> : <RotateCcw size={13} />}{running ? "Running" : "Replay"}</button>
      </div>
      <div className="console-statusbar"><span><GitBranch size={11} /> feature/billing</span><span>16 symbols in context</span><span>SDD enabled</span></div>
    </div>
    <div className="console-caption"><span>01 / INTENT → EXECUTION</span><span>One interface. The right intelligence.</span></div>
  </div>;
}
