import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Button, Card } from './components/ui'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 font-sans">
      <div className="flex gap-8 mb-8">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="h-24 hover:drop-shadow-[0_0_2em_#646cffaa] transition" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="h-24 hover:drop-shadow-[0_0_2em_#61dafbaa] transition animate-[spin_20s_linear_infinite]" alt="React logo" />
        </a>
      </div>
      <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-6">
        Vite + React
      </h1>
      <Card className="mb-6">
        <div className="flex gap-3 items-center">
          <Button onClick={() => setCount((c) => c + 1)}>
            count is {count}
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          Edit <code className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded">src/App.jsx</code> and save to test HMR
        </p>
      </Card>
      <p className="text-slate-500 dark:text-slate-400 mt-4">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
