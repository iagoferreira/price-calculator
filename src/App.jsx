import './App.css'
import { Form } from './components/Form'
import { ThemeToggle } from './components/ThemeToggle'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-md flex-col px-4 py-5">
        <div className="relative shrink-0 pr-12">
          <div className="absolute right-0 top-0">
            <ThemeToggle />
          </div>
          <p className="text-sm leading-snug text-muted-foreground">
            Após preencher os campos, clique em Calcular.
          </p>
        </div>

        <div className="mt-4 shrink-0 rounded-xl border border-border/80 bg-card/80 p-4 shadow-sm sm:p-5">
          <Form />
        </div>
      </div>
    </div>
  )
}

export default App
