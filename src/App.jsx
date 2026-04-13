import './App.css'
import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { Form } from './components/Form'
import { ThemeToggle } from './components/ThemeToggle'
import { AdminTables } from './components/AdminTables'
import { TablesProvider, useTables, isTauri } from './context/TablesContext'
import { Button } from './components/ui/button'
import { Settings } from 'lucide-react'
import { applyWindowMode } from './lib/tauriWindow'

function AppMain() {
  const [screen, setScreen] = useState('calc')
  const { isLoading, error, tables, setTables, setError, reload } = useTables()

  useEffect(() => {
    applyWindowMode(screen === 'admin' ? 'admin' : 'calc')
  }, [screen])

  async function restoreDefaultsToDisk() {
    if (!isTauri()) return
    try {
      const d = await invoke('reset_tables')
      setTables(d)
      setError(null)
    } catch (e) {
      setError(
        typeof e === 'string' ? e : e?.message ?? 'Falha ao restaurar tabelas.'
      )
    }
  }

  if (screen === 'admin') {
    return <AdminTables onBack={() => setScreen('calc')} />
  }

  if (isLoading) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-background px-4 py-8 text-foreground">
        <p className="text-sm text-muted-foreground">Carregando tabelas…</p>
      </div>
    )
  }

  if (error && !tables) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-background px-4 py-8 text-foreground">
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => reload()}>
            Tentar novamente
          </Button>
          {isTauri() ? (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={restoreDefaultsToDisk}
            >
              Restaurar tabelas padrão
            </Button>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 py-4">
        <div className="flex shrink-0 items-start justify-between gap-3">
          <p className="min-w-0 flex-1 text-sm leading-snug text-muted-foreground">
            Após preencher os campos, clique em Calcular.
          </p>
          <div className="flex shrink-0 items-center gap-0.5 pt-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Configurações"
              onClick={() => setScreen('admin')}
            >
              <Settings className="h-5 w-5" strokeWidth={2} aria-hidden />
            </Button>
            <ThemeToggle />
          </div>
        </div>

        <div className="mt-3 shrink-0 rounded-xl border border-border/80 bg-card/80 p-4 shadow-sm sm:mt-4 sm:p-5">
          <Form />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <TablesProvider>
      <div className="h-full min-h-0">
        <AppMain />
      </div>
    </TablesProvider>
  )
}
