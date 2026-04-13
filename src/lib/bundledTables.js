import passosJson from '../tables/tabela-passos.json'
import pesosAcoJson from '../tables/tabela-pesos-aco.json'
import pesosAluminioJson from '../tables/tabela-peso-aluminio.json'

/** Mesmo formato que `get_tables` / `save_tables` no Tauri (chaves camelCase). */
export function getBundledDefaultTables() {
  return {
    passos: passosJson.passos,
    pesosAco: pesosAcoJson.pesosAco,
    pesosAluminio: pesosAluminioJson.pesosAluminio,
  }
}
