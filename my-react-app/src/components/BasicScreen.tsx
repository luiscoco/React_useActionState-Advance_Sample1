import { useActionState } from 'react'
import TiltCard from './TiltCard'
import { delay } from '../utils'

type BasicState = { status: 'idle' | 'success' | 'error'; name: string; message: string; count: number }

const basicInitial: BasicState = {
  status: 'idle',
  name: '',
  message: 'Enter a name and submit to see the pending -> success flow.',
  count: 0,
}

function BasicScreen() {
  const [basic, basicAction, basicPending] = useActionState<BasicState, FormData>(
    async (prev, formData) => {
      await delay(420)
      const name = (formData.get('name') as string | null)?.trim() ?? ''
      if (!name) {
        return { ...prev, status: 'error', message: 'Who are we greeting? Add a name.' }
      }
      return {
        status: 'success',
        name,
        message: `Hello ${name}! useActionState returned this message.`,
        count: prev.count + 1,
      }
    },
    basicInitial,
  )

  return (
    <div className="view">
      <TiltCard className="mini-card">
        <p className="eyebrow">Level 1 - Beginner</p>
        <h2>useActionState in its simplest shape</h2>
        <p className="lede">One input, one action, instant pending feedback.</p>

        <form className="simple-form" action={basicAction}>
          <label className="field">
            <span>Your name</span>
            <input name="name" placeholder="e.g. Taylor" autoComplete="off" />
          </label>
          <button type="submit" disabled={basicPending}>
            {basicPending ? 'Working...' : 'Greet me'}
          </button>
        </form>

        <div className={`basic-state ${basic.status}`}>
          <p className="caption">{basicPending ? 'Pending via isPending...' : basic.message}</p>
          <div className="chips">
            <span className="pill ghost">Runs: {basic.count}</span>
            <span className={`pill ghost ${basicPending ? 'status-pending' : 'status-happy'}`}>
              {basicPending ? 'pending' : basic.status}
            </span>
          </div>
        </div>
      </TiltCard>

      <TiltCard className="note-card">
        <h3>What to notice</h3>
        <ul className="notes">
          <li>`useActionState` gives you `[state, action, isPending]`.</li>
          <li>Attach `action` to the form's `action` prop so React passes `FormData` in.</li>
          <li>`isPending` toggles automatically; no extra loading state needed.</li>
          <li>Return a new state object to update the UI after the async work.</li>
        </ul>
        <h4 className="steps-title">Teaching steps</h4>
        <ol className="steps">
          <li>Show the hook signature: `const [state, action, isPending] = useActionState(...)`.</li>
          <li>Point at the form: &lt;form action=formAction&gt; wires the submit to the hook.</li>
          <li>Submit once; call out `isPending` driving the button disabled state.</li>
          <li>Highlight the returned state updating the message and run count.</li>
        </ol>
        <pre
          className="code-hl"
          dangerouslySetInnerHTML={{
            __html: `const [<span class="tok-var">state</span>, <span class="tok-var">action</span>, <span class="tok-var">isPending</span>] = <span class="tok-func">useActionState</span>(
  <span class="tok-key">async</span> (<span class="tok-var">prev</span>, <span class="tok-var">formData</span>) => {
    <span class="tok-key">const</span> <span class="tok-var">name</span> = formData.get(<span class="tok-lit">'name'</span>)
    <span class="tok-key">if</span> (!name) <span class="tok-key">return</span> { ...prev, status: <span class="tok-lit">'error'</span> }
    <span class="tok-key">return</span> { status: <span class="tok-lit">'success'</span>, name, message: <span class="tok-lit">'Hi '</span> + name, count: prev.count + 1 }
  },
  { status: <span class="tok-lit">'idle'</span>, name: <span class="tok-lit">''</span>, message: <span class="tok-lit">''</span>, count: <span class="tok-lit">0</span> },
)

&lt;form action={<span class="tok-var">action</span>}&gt;
  &lt;input name=<span class="tok-lit">"name"</span> /&gt;
  &lt;button disabled={<span class="tok-var">isPending</span>}&gt;Submit&lt;/button&gt;
&lt;/form&gt;`,
          }}
        />
      </TiltCard>
    </div>
  )
}

export default BasicScreen
