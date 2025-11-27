import { useActionState } from 'react'
import TiltCard from './TiltCard'
import { createId, delay, nowLabel } from '../utils'

type LogEntry = { id: string; label: string; when: string }
type IntermediateState = {
  status: 'idle' | 'success' | 'error'
  idea: string
  tone: string
  steps: number
  summary: string
  log: LogEntry[]
}

const intermediateInitial: IntermediateState = {
  status: 'idle',
  idea: '',
  tone: 'Calm',
  steps: 3,
  summary: 'Submit an idea to generate a lightweight plan.',
  log: [],
}

function IntermediateScreen() {
  const [mid, midAction, midPending] = useActionState<IntermediateState, FormData>(
    async (prev, formData) => {
      await delay(520)
      const idea = (formData.get('idea') as string | null)?.trim() ?? ''
      const tone = ((formData.get('tone') as string | null) ?? 'Calm').slice(0, 35)
      const steps = Math.min(Math.max(Number(formData.get('steps') ?? 3), 2), 6)

      if (!idea) {
        return { ...prev, status: 'error', summary: 'Add an idea first.' }
      }

      const entry: LogEntry = {
        id: createId(),
        label: idea,
        when: nowLabel(),
      }

      return {
        status: 'success',
        idea,
        tone,
        steps,
        summary: `${tone} plan for "${idea}" in ${steps} beats.`,
        log: [entry, ...prev.log].slice(0, 5),
      }
    },
    intermediateInitial,
  )

  return (
    <div className="view">
      <TiltCard className="mini-card">
        <p className="eyebrow">Level 2 - Intermediate</p>
        <h2>Handle form fields + mini history</h2>
        <p className="lede">Multiple fields, selective validation, and a rolling log.</p>

        <form className="simple-form" action={midAction}>
          <label className="field">
            <span>Idea</span>
            <input name="idea" placeholder="e.g. Community launch plan" autoComplete="off" />
          </label>
          <label className="field">
            <span>Tone</span>
            <select name="tone" defaultValue={mid.tone}>
              {['Calm', 'Upbeat', 'Bold', 'Analytical'].map((tone) => (
                <option key={tone}>{tone}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Steps</span>
            <input name="steps" type="number" min={2} max={6} defaultValue={mid.steps} />
          </label>
          <button type="submit" disabled={midPending}>
            {midPending ? 'Composing...' : 'Draft plan'}
          </button>
        </form>

        <div className={`basic-state ${mid.status}`}>
          <p className="caption">{midPending ? 'Pending...' : mid.summary}</p>
          <div className="chips">
            <span className="pill ghost">{mid.tone}</span>
            <span className="pill ghost">Steps {mid.steps}</span>
            <span className={`pill ghost ${midPending ? 'status-pending' : 'status-happy'}`}>
              {midPending ? 'pending' : mid.status}
            </span>
          </div>
        </div>
      </TiltCard>

      <TiltCard className="note-card">
        <h3>Mini log</h3>
        <ul className="history-list compact">
          {mid.log.length === 0 && <li className="history-empty">Run it once to start the log.</li>}
          {mid.log.map((item) => (
            <li key={item.id}>
              <div>
                <p className="title">{item.label}</p>
                <p className="caption">{item.when}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="caption">
          Each submission returns a new state object including a trimmed `log`.
        </p>
        <h4 className="steps-title">Teaching steps</h4>
        <ol className="steps">
          <li>Scan the state shape: idea, tone, steps, summary, log.</li>
          <li>Submit once to see `isPending` flip and the summary update.</li>
          <li>Emphasize validation: empty idea returns an error state.</li>
          <li>Show how the action returns a new state with the latest log entry.</li>
          <li>Point out trimming the log with `.slice(0, 5)` as state shaping.</li>
        </ol>
        <pre
          className="code-hl"
          dangerouslySetInnerHTML={{
            __html: `const [<span class="tok-var">state</span>, <span class="tok-var">action</span>, <span class="tok-var">isPending</span>] = useActionState(
  async (<span class="tok-var">prev</span>, <span class="tok-var">formData</span>) => {
    const <span class="tok-var">idea</span> = formData.get(<span class="tok-lit">'idea'</span>)?.trim()
    if (!idea) return { ...prev, status: <span class="tok-lit">'error'</span>, summary: <span class="tok-lit">'Add an idea'</span> }
    const <span class="tok-var">entry</span> = { id: crypto.randomUUID(), label: idea, when: new Date().toISOString() }
    return {
      status: <span class="tok-lit">'success'</span>,
      idea,
      tone: formData.get(<span class="tok-lit">'tone'</span>) || <span class="tok-lit">'Calm'</span>,
      steps: Number(formData.get(<span class="tok-lit">'steps'</span>) || <span class="tok-lit">3</span>),
      summary: <span class="tok-lit">'Plan ready'</span>,
      log: [entry, ...prev.log].slice(0, 5),
    }
  },
  { status: <span class="tok-lit">'idle'</span>, idea: <span class="tok-lit">''</span>, tone: <span class="tok-lit">'Calm'</span>, steps: <span class="tok-lit">3</span>, summary: <span class="tok-lit">''</span>, log: [] },
)

&lt;form action={<span class="tok-var">action</span>}&gt;...&lt;/form&gt;`,
          }}
        />
        <pre className="code-hl">
          <code>{`<form action={action}>
  <input name="idea" />
  <select name="tone">...</select>
  <input name="steps" type="number" />
  <button disabled={isPending}>Draft plan</button>
</form>`}</code>
        </pre>
      </TiltCard>
    </div>
  )
}

export default IntermediateScreen
