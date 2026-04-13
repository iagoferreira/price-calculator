import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { getBundledDefaultTables } from '@/lib/bundledTables'

const TablesContext = createContext(null)

export function isTauri() {
  return typeof window !== 'undefined' && Boolean(window.__TAURI__)
}

export function TablesProvider({ children }) {
  const [tables, setTables] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const reload = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      if (isTauri()) {
        const data = await invoke('get_tables')
        setTables(data)
      } else {
        setTables(getBundledDefaultTables())
      }
    } catch (e) {
      setError(
        typeof e === 'string' ? e : e?.message ?? 'Erro ao carregar tabelas.'
      )
      setTables(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const value = useMemo(
    () => ({
      tables,
      setTables,
      reload,
      isLoading,
      error,
      setError,
    }),
    [tables, reload, isLoading, error]
  )

  return (
    <TablesContext.Provider value={value}>{children}</TablesContext.Provider>
  )
}

export function useTables() {
  const ctx = useContext(TablesContext)
  if (!ctx) {
    throw new Error('useTables deve ser usado dentro de TablesProvider.')
  }
  return ctx
}
