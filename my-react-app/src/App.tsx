import { useState } from 'react'
import './App.css'
import BasicScreen from './components/BasicScreen'
import IntermediateScreen from './components/IntermediateScreen'
import AdvancedScreen from './components/AdvancedScreen'

function App() {
  const [screen, setScreen] = useState<'basic' | 'intermediate' | 'advanced'>('basic')

  return (
    <div className="page">
      <div className="atmosphere">
        <span className="glow one" />
        <span className="glow two" />
        <span className="glow three" />
        <div className="gridlines" />
      </div>

      <div className="app-shell">
        <header className="topline">
          <div>
            <p className="eyebrow">Guided path</p>
            <h1>useActionState: beginner → intermediate → advanced</h1>
            <p className="lede">
              Three screens, one hook—see how the API scales from a simple greeting to a rich 3D lab.
            </p>
          </div>
          <div className="tab-bar">
            <button
              className={`tab ${screen === 'basic' ? 'active' : ''}`}
              onClick={() => setScreen('basic')}
            >
              Level 1 • Basics
            </button>
            <button
              className={`tab ${screen === 'intermediate' ? 'active' : ''}`}
              onClick={() => setScreen('intermediate')}
            >
              Level 2 • Intermediate
            </button>
            <button
              className={`tab ${screen === 'advanced' ? 'active' : ''}`}
              onClick={() => setScreen('advanced')}
            >
              Level 3 • Advanced Lab
            </button>
          </div>
        </header>

        {screen === 'basic' && <BasicScreen />}
        {screen === 'intermediate' && <IntermediateScreen />}
        {screen === 'advanced' && <AdvancedScreen />}
      </div>
    </div>
  )
}

export default App
