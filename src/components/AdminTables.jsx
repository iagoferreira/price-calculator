import { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { useTables, isTauri } from '@/context/TablesContext'
import { getBundledDefaultTables } from '@/lib/bundledTables'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

function cloneTables(t) {
  return JSON.parse(JSON.stringify(t))
}

function EditableTable({ title, rows, onChange, kind }) {
  function updateRow(index, field, raw) {
    const next = rows.map((r, i) =>
      i === index ? { ...r, [field]: raw } : r
    )
    onChange(next)
  }

  function parseCell(index, field, raw) {
    if (field === 'passo') {
      updateRow(index, field, raw)
      return
    }
    const n = Number.parseFloat(String(raw).replace(',', '.'))
    updateRow(index, field, Number.isFinite(n) ? n : 0)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={() => {
            if (kind === 'passos') {
              onChange([...rows, { passo: '', valor: 0 }])
            } else {
              onChange([...rows, { diametro: 0, valor: 0 }])
            }
          }}
        >
          Adicionar linha
        </Button>
      </div>
      <div className="thin-scrollbar max-h-[min(22rem,50vh)] overflow-y-auto overflow-x-hidden rounded-md border border-border">
        <table className="w-full border-separate border-spacing-0 text-left text-xs">
          <thead className="sticky top-0 z-10 border-b border-border bg-card shadow-[0_1px_0_0_hsl(var(--border))]">
            <tr>
              {kind === 'passos' ? (
                <>
                  <th className="bg-card px-2 py-1.5 font-medium">Passo</th>
                  <th className="bg-card px-2 py-1.5 font-medium">Valor</th>
                </>
              ) : (
                <>
                  <th className="bg-card px-2 py-1.5 font-medium">Diâmetro</th>
                  <th className="bg-card px-2 py-1.5 font-medium">Peso (kg/m)</th>
                </>
              )}
              <th className="w-10 bg-card px-1 py-1.5" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-t border-border/60">
                {kind === 'passos' ? (
                  <>
                    <td className="p-1">
                      <Input
                        className="h-8 text-xs"
                        value={row.passo}
                        onChange={(e) =>
                          parseCell(index, 'passo', e.target.value)
                        }
                      />
                    </td>
                    <td className="p-1">
                      <Input
                        className="h-8 text-xs tabular-nums"
                        value={String(row.valor)}
                        onChange={(e) => parseCell(index, 'valor', e.target.value)}
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-1">
                      <Input
                        className="h-8 text-xs tabular-nums"
                        value={String(row.diametro)}
                        onChange={(e) =>
                          parseCell(index, 'diametro', e.target.value)
                        }
                      />
                    </td>
                    <td className="p-1">
                      <Input
                        className="h-8 text-xs tabular-nums"
                        value={String(row.valor)}
                        onChange={(e) => parseCell(index, 'valor', e.target.value)}
                      />
                    </td>
                  </>
                )}
                <td className="p-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-destructive hover:text-destructive"
                    aria-label="Remover linha"
                    onClick={() =>
                      onChange(rows.filter((_, i) => i !== index))
                    }
                  >
                    ×
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function AdminTables({ onBack }) {
  const { tables, setTables, reload } = useTables()
  const [draft, setDraft] = useState(null)
  const [saveError, setSaveError] = useState(null)
  const [saveOk, setSaveOk] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)

  useEffect(() => {
    if (tables) setDraft(cloneTables(tables))
  }, [tables])

  if (!draft) {
    return (
      <div className="px-4 py-6 text-sm text-muted-foreground">
        Carregando…
      </div>
    )
  }

  async function handleSave() {
    setSaveError(null)
    setSaveOk(false)
    try {
      if (isTauri()) {
        await invoke('save_tables', { doc: draft })
      }
      setTables(cloneTables(draft))
      setSaveOk(true)
      setTimeout(() => setSaveOk(false), 2500)
    } catch (e) {
      setSaveError(
        typeof e === 'string' ? e : e?.message ?? 'Não foi possível salvar.'
      )
    }
  }

  async function handleReset() {
    setSaveError(null)
    try {
      if (isTauri()) {
        const data = await invoke('reset_tables')
        setTables(data)
        setDraft(cloneTables(data))
      } else {
        const d = getBundledDefaultTables()
        setTables(cloneTables(d))
        setDraft(cloneTables(d))
      }
      setResetOpen(false)
    } catch (e) {
      setSaveError(
        typeof e === 'string' ? e : e?.message ?? 'Não foi possível restaurar.'
      )
      setResetOpen(false)
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background text-foreground">
      <div className="mx-auto flex h-full min-h-0 w-full max-w-xl flex-col gap-3 px-4 py-4">
        <div className="flex shrink-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base font-semibold">Configurações</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Tabelas usadas no cálculo. Alterações são gravadas neste
              computador.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0"
            onClick={onBack}
          >
            Voltar
          </Button>
        </div>

        <div className="thin-scrollbar min-h-0 flex-1 space-y-5 overflow-y-auto rounded-xl border border-border/80 bg-card/80 p-4 shadow-sm">
          <EditableTable
            title="Passos"
            kind="passos"
            rows={draft.passos}
            onChange={(passos) => setDraft((d) => ({ ...d, passos }))}
          />
          <EditableTable
            title="Pesos (aço)"
            kind="pesos"
            rows={draft.pesosAco}
            onChange={(pesosAco) => setDraft((d) => ({ ...d, pesosAco }))}
          />
          <EditableTable
            title="Pesos (alumínio)"
            kind="pesos"
            rows={draft.pesosAluminio}
            onChange={(pesosAluminio) =>
              setDraft((d) => ({ ...d, pesosAluminio }))
            }
          />
        </div>

        {saveError ? (
          <p className="shrink-0 text-sm text-destructive" role="alert">
            {saveError}
          </p>
        ) : null}
        {saveOk ? (
          <p className="shrink-0 text-sm text-green-600 dark:text-green-500">
            Alterações salvas.
          </p>
        ) : null}

        <div className="flex shrink-0 flex-wrap gap-2 pb-1">
          <Button type="button" size="sm" onClick={handleSave}>
            Salvar
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              if (tables) setDraft(cloneTables(tables))
              setSaveError(null)
            }}
          >
            Descartar alterações
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => setResetOpen(true)}
          >
            Restaurar padrão
          </Button>
          {isTauri() ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => reload()}
            >
              Recarregar do disco
            </Button>
          ) : null}
        </div>
      </div>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restaurar tabelas padrão?</DialogTitle>
            <DialogDescription>
              As tabelas originais do aplicativo substituem as atuais neste
              computador. Esta ação não pode ser desfeita (salve um backup
              exportando os dados antes, se precisar).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setResetOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={handleReset}>
              Restaurar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
