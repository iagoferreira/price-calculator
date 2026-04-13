// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};

const MAX_ROWS: usize = 2000;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PassoRow {
    pub passo: String,
    pub valor: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PesoRow {
    pub diametro: f64,
    pub valor: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TablesDoc {
    pub passos: Vec<PassoRow>,
    pub pesos_aco: Vec<PesoRow>,
    pub pesos_aluminio: Vec<PesoRow>,
}

#[derive(Deserialize)]
struct PassosFile {
    passos: Vec<PassoRow>,
}

#[derive(Deserialize)]
struct PesosAcoFile {
    #[serde(rename = "pesosAco")]
    pesos_aco: Vec<PesoRow>,
}

#[derive(Deserialize)]
struct PesosAluminioFile {
    #[serde(rename = "pesosAluminio")]
    pesos_aluminio: Vec<PesoRow>,
}

fn bundled_defaults() -> Result<TablesDoc, String> {
    let passos: PassosFile =
        serde_json::from_str(include_str!("../../src/tables/tabela-passos.json"))
            .map_err(|e| format!("defaults passos: {e}"))?;
    let aco: PesosAcoFile =
        serde_json::from_str(include_str!("../../src/tables/tabela-pesos-aco.json"))
            .map_err(|e| format!("defaults pesos aço: {e}"))?;
    let al: PesosAluminioFile =
        serde_json::from_str(include_str!("../../src/tables/tabela-peso-aluminio.json"))
            .map_err(|e| format!("defaults pesos alumínio: {e}"))?;
    Ok(TablesDoc {
        passos: passos.passos,
        pesos_aco: aco.pesos_aco,
        pesos_aluminio: al.pesos_aluminio,
    })
}

fn validate(doc: &TablesDoc) -> Result<(), String> {
    if doc.passos.is_empty() {
        return Err("Adicione pelo menos um passo.".to_string());
    }
    if doc.pesos_aco.is_empty() {
        return Err("A tabela de pesos (aço) não pode ficar vazia.".to_string());
    }
    if doc.pesos_aluminio.is_empty() {
        return Err("A tabela de pesos (alumínio) não pode ficar vazia.".to_string());
    }
    if doc.passos.len() > MAX_ROWS || doc.pesos_aco.len() > MAX_ROWS || doc.pesos_aluminio.len() > MAX_ROWS
    {
        return Err(format!("Muitas linhas (máximo {MAX_ROWS} por tabela)."));
    }
    for (i, p) in doc.passos.iter().enumerate() {
        if p.passo.trim().is_empty() {
            return Err(format!("Passo na linha {}: nome não pode ficar vazio.", i + 1));
        }
        if !p.valor.is_finite() {
            return Err(format!("Passo \"{}\": valor numérico inválido.", p.passo));
        }
    }
    for (i, r) in doc.pesos_aco.iter().enumerate() {
        if !r.diametro.is_finite() || !r.valor.is_finite() {
            return Err(format!(
                "Pesos (aço), linha {}: diâmetro e valor devem ser números válidos.",
                i + 1
            ));
        }
    }
    for (i, r) in doc.pesos_aluminio.iter().enumerate() {
        if !r.diametro.is_finite() || !r.valor.is_finite() {
            return Err(format!(
                "Pesos (alumínio), linha {}: diâmetro e valor devem ser números válidos.",
                i + 1
            ));
        }
    }
    Ok(())
}

fn tables_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let dir = app
        .path_resolver()
        .app_data_dir()
        .ok_or_else(|| "Não foi possível localizar a pasta de dados do aplicativo.".to_string())?;
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir.join("tables.json"))
}

fn atomic_write_json(path: &Path, doc: &TablesDoc) -> Result<(), String> {
    let json = serde_json::to_string_pretty(doc).map_err(|e| e.to_string())?;
    let dir = path
        .parent()
        .ok_or_else(|| "Caminho de arquivo inválido.".to_string())?;
    let tmp = dir.join(format!("tables.json.{}.tmp", std::process::id()));
    fs::write(&tmp, json.as_bytes()).map_err(|e| e.to_string())?;
    let _ = fs::remove_file(path);
    fs::rename(&tmp, path).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn get_tables(app: tauri::AppHandle) -> Result<TablesDoc, String> {
    let path = tables_path(&app)?;
    if path.exists() {
        let raw = fs::read_to_string(&path).map_err(|e| e.to_string())?;
        let doc: TablesDoc = serde_json::from_str(&raw).map_err(|e| {
            format!("Arquivo de tabelas inválido ou corrompido: {e}. Use Restaurar padrão.")
        })?;
        validate(&doc)?;
        Ok(doc)
    } else {
        bundled_defaults()
    }
}

#[tauri::command]
fn save_tables(app: tauri::AppHandle, doc: TablesDoc) -> Result<(), String> {
    validate(&doc)?;
    let path = tables_path(&app)?;
    atomic_write_json(&path, &doc)
}

#[tauri::command]
fn reset_tables(app: tauri::AppHandle) -> Result<TablesDoc, String> {
    let defaults = bundled_defaults()?;
    let path = tables_path(&app)?;
    atomic_write_json(&path, &defaults)?;
    Ok(defaults)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_tables, save_tables, reset_tables])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
