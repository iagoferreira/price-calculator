import { getCurrent, LogicalSize } from '@tauri-apps/api/window'

function isTauriRuntime() {
  return typeof window !== 'undefined' && Boolean(window.__TAURI__)
}

/** Janela compacta: formulário principal. */
export const WINDOW_CALC = { width: 448, height: 448 }

/** Janela maior: edição das tabelas com uma única área de rolagem. */
export const WINDOW_ADMIN = { width: 580, height: 820 }

/**
 * Ajusta tamanho e limites mínimos da janela conforme a tela (somente no app Tauri).
 */
export async function applyWindowMode(mode) {
  if (!isTauriRuntime()) return
  try {
    const win = getCurrent()
    const size =
      mode === 'admin'
        ? WINDOW_ADMIN
        : WINDOW_CALC
    await win.setSize(new LogicalSize(size.width, size.height))
    if (mode === 'admin') {
      await win.setMinSize(new LogicalSize(480, 520))
    } else {
      await win.setMinSize(new LogicalSize(380, 340))
    }
  } catch (e) {
    console.warn('[tauriWindow]', e)
  }
}
