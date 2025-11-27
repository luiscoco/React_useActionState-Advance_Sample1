import { useActionState, useMemo } from 'react'
import TiltCard from './TiltCard'
import { createId, delay, nowLabel } from '../utils'

type ActionEntry = {
  id: string
  label: string
  status: 'success' | 'error'
  note: string
  when: string
}

type ActionResult = {
  status: 'idle' | 'success' | 'error'
  prompt: string
  summary: string
  tone: string
  complexity: number
  history: ActionEntry[]
  message: string
}

const initialState: ActionResult = {
  status: 'idle',
  prompt: '',
  tone: 'Playful',
  complexity: 2,
  summary: 'Submit an idea to watch pending to success/error transitions in real time.',
  history: [],
  message: 'useActionState binds your async action directly to this form.',
}

const toneCopy: Record<string, string> = {
  Playful: 'Breezy, colorful, with a hint of whimsy.',
  Analytical: 'Precise, data-forward, trimmed of fluff.',
  Inspiring: 'Upbeat momentum that invites action.',
}

function AdvancedScreen() {
  const [result, formAction, isPending] = useActionState<ActionResult, FormData>(
    async (previousState, formData) => {
      const idea = (formData.get('idea') as string | null)?.trim() ?? ''
      const tone = ((formData.get('tone') as string | null) ?? 'Playful').slice(0, 35)
      const complexity = Math.min(Math.max(Number(formData.get('complexity') ?? 2), 1), 4)

      await delay(650 + Math.random() * 500)

      if (!idea) {
        const history: ActionEntry = {
          id: createId(),
          label: 'Missing input',
          status: 'error',
          note: 'Add an idea to run the action',
          when: nowLabel(),
        }
        return {
          ...previousState,
          status: 'error',
          message: 'Tell me what to act on first.',
          history: [history, ...previousState.history].slice(0, 4),
        }
      }

      if (Math.random() < 0.12) {
        const history: ActionEntry = {
          id: createId(),
          label: idea,
          status: 'error',
          note: 'Simulated network wobble',
          when: nowLabel(),
        }
        return {
          ...previousState,
          status: 'error',
          prompt: idea,
          tone,
          complexity,
          message: 'Simulated hiccup. Submit again to watch the states roll.',
          history: [history, ...previousState.history].slice(0, 4),
        }
      }

      const flavor = ['quietly confident', 'balanced', 'bold', 'sweeping'][complexity - 1]
      const summary = `A ${flavor} + ${tone.toLowerCase()} take on "${idea}" with ${complexity + 1} micro-beats.`

      const history: ActionEntry = {
        id: createId(),
        label: idea,
        status: 'success',
        note: `${tone} - depth ${complexity}`,
        when: nowLabel(),
      }

      return {
        status: 'success',
        prompt: idea,
        tone,
        complexity,
        summary,
        message: 'Action resolved just now. Notice how the UI stayed responsive.',
        history: [history, ...previousState.history].slice(0, 4),
      }
    },
    initialState,
  )

  const quickIdeas = useMemo(
    () => ['3D onboarding guide', 'Motion-led dashboard', 'Micro-copy coach', 'Data story beat'],
    [],
  )

  const explainers = useMemo(
    () => [
      {
        title: 'Action function',
        copy: 'Async handler receives previous state + FormData, perfect for optimistic UIs.',
      },
      {
        title: 'State + setter',
        copy: 'useActionState returns [state, action, isPending] so you can tie UI to action life-cycle.',
      },
      {
        title: 'Form wiring',
        copy: 'Set <form action={action}>; React injects FormData and toggles isPending for you.',
      },
      {
        title: 'Learning tip',
        copy: 'Try failing states; watch history fill in and the 3D cards reflect current status.',
      },
    ],
    [],
  )

  const statusTone =
    isPending || result.status === 'idle'
      ? 'status-pending'
      : result.status === 'success'
        ? 'status-happy'
        : 'status-warn'

  return (
    <>
      <TiltCard className="hero">
        <div className="hero-text">
          <p className="eyebrow">React 19 - useActionState lab</p>
          <h1>
            3D interactive explainer for <span className="highlight">action-aware</span> UIs
          </h1>
          <p className="lede">
            Drive a form with <code>useActionState</code>, keep the UI snappy, and observe how
            pending to success/error plays out without extra state plumbing.
          </p>
          <div className="hero-badges">
            <span className="pill">{isPending ? 'Action running' : 'Ready to submit'}</span>
            <span className="pill ghost">FormData-first</span>
            <span className="pill ghost">Optimistic by design</span>
          </div>
          <div className="teaching-steps">
            <p className="eyebrow">Teaching steps</p>
            <ol className="steps">
              <li>Walk through the action signature: (prevState, formData) =&gt; newState.</li>
              <li>Submit with and without an idea to surface success and error paths.</li>
              <li>Point out isPending animating status dots and disabling the button.</li>
              <li>Show the history list filling from the returned history array.</li>
              <li>Trigger a quick idea button to demo programmatic formAction calls.</li>
            </ol>
            <pre
              className="code-hl"
              dangerouslySetInnerHTML={{
                __html: `const [<span class="tok-var">state</span>, <span class="tok-var">action</span>, <span class="tok-var">isPending</span>] = useActionState(
  async (<span class="tok-var">prev</span>, <span class="tok-var">formData</span>) => {
    const <span class="tok-var">idea</span> = formData.get(<span class="tok-lit">'idea'</span>)?.trim()
    await delay(<span class="tok-lit">700</span>)
    if (!idea) return { ...prev, status: <span class="tok-lit">'error'</span> }
    return {
      status: <span class="tok-lit">'success'</span>,
      prompt: idea,
      history: [{ id: crypto.randomUUID(), label: idea, status: <span class="tok-lit">'success'</span>, note: <span class="tok-lit">'ok'</span>, when: nowLabel() }, ...prev.history].slice(0,4),
      message: <span class="tok-lit">'Resolved'</span>,
    }
  },
  initialState,
)

&lt;form action={<span class="tok-var">action</span>}&gt;...&lt;/form&gt;`,
              }}
            />
            <pre className="code-hl">
              <code>{`<form action={action}>
  <input name="idea" />
  <select name="tone">...</select>
  <input name="complexity" type="range" min="1" max="4" />
  <button disabled={isPending}>Run action</button>
</form>`}</code>
            </pre>
          </div>
        </div>
        <div className="hero-visual">
          {/* visual removed per request */}
        </div>
      </TiltCard>

      <section className="layout">
        <div className="column">
          <TiltCard className="action-lab">
            <header className="card-head">
              <div>
                <p className="eyebrow">Live playground</p>
                <h2>Send an action &amp; watch the state respond</h2>
              </div>
              <span className={`status-dot ${statusTone}`}>
                {isPending ? 'Pending...' : result.status === 'success' ? 'Success' : 'Idle / Retry'}
              </span>
            </header>

            <form className="action-form" action={formAction}>
              <label className="field">
                <span>Idea to transform</span>
                <input
                  name="idea"
                  placeholder="e.g. Interactive launch checklist"
                  autoComplete="off"
                  aria-label="idea to transform"
                />
              </label>

              <div className="field pair">
                <label>
                  <span>Tone</span>
                  <select name="tone" defaultValue={initialState.tone}>
                    {Object.keys(toneCopy).map((tone) => (
                      <option value={tone} key={tone}>
                        {tone}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Complexity</span>
                  <div className="slider">
                    <input name="complexity" type="range" min={1} max={4} defaultValue={2} />
                    <div className="ticks">
                      <span>1</span>
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                    </div>
                  </div>
                </label>
              </div>

              <div className="quick-buttons" aria-label="quick idea presets">
                {quickIdeas.map((idea) => (
                  <button
                    key={idea}
                    type="button"
                    className="ghost-btn"
                    onClick={() => {
                      const data = new FormData()
                      data.set('idea', idea)
                      data.set('tone', result.tone)
                      data.set('complexity', String(result.complexity))
                      formAction(data)
                    }}
                  >
                    {idea}
                  </button>
                ))}
              </div>

              <div className="form-actions">
                <button type="submit" disabled={isPending}>
                  {isPending ? 'Running action...' : 'Run action'}
                </button>
                <p className="caption">
                  React pipes FormData into your action and keeps <code>isPending</code> in sync.
                </p>
              </div>
            </form>

            <div className="state-readout">
              <div>
                <p className="eyebrow">Latest state</p>
                <h3>{result.summary}</h3>
                <p className="caption">{result.message}</p>
              </div>
              <div className="chips">
                <span className="pill">{result.tone}</span>
                <span className="pill ghost">Depth {result.complexity}</span>
                <span className={`pill ghost ${statusTone}`}>{isPending ? 'pending' : result.status}</span>
              </div>
            </div>
          </TiltCard>

          <TiltCard className="history">
            <header className="card-head">
              <p className="eyebrow">Action history</p>
              <h2>See the last runs</h2>
            </header>
            <ul className="history-list">
              {result.history.length === 0 && <li className="history-empty">No runs yet - kick one off.</li>}
              {result.history.map((item) => (
                <li key={item.id} className={item.status}>
                  <div>
                    <p className="title">{item.label}</p>
                    <p className="caption">{item.note}</p>
                  </div>
                  <span className="time">{item.when}</span>
                </li>
              ))}
            </ul>
          </TiltCard>
        </div>

        <div className="column">
          <TiltCard className="explain">
            <header className="card-head">
              <p className="eyebrow">Concept map</p>
              <h2>How useActionState flows</h2>
            </header>
            <div className="explainer-grid">
              {explainers.map((item) => (
                <div key={item.title} className="explainer">
                  <h4>{item.title}</h4>
                  <p>{item.copy}</p>
                </div>
              ))}
            </div>
          </TiltCard>

          <TiltCard className="code">
            <header className="card-head">
              <p className="eyebrow">Pattern</p>
              <h2>Minimal usage snippet</h2>
            </header>
            <pre>
              <code>{`const [state, action, isPending] = useActionState(
  async (prev, formData) => {
    const value = formData.get('value')
    await save(value)
    return { ...prev, value }
  },
  { value: '' },
)

<form action={action}>
  <input name="value" />
  <button disabled={isPending}>Save</button>
</form>`}</code>
            </pre>
            <p className="caption">
              Submit the form: React sends FormData to the action, updates <code>state</code>, and flips
              <code> isPending</code> during work.
            </p>
          </TiltCard>
        </div>
      </section>
    </>
  )
}

export default AdvancedScreen
