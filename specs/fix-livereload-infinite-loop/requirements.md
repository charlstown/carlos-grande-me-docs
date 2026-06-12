# Fix: Bucle infinito de live-reload al escribir publications.json

## Resumen del bug

El servidor de desarrollo `mkdocs serve --livereload` entra en un bucle infinito de reconstrucciones en cuanto se modifica cualquier archivo de `docs/`. El hook `generate_pages.py` escribe `docs/assets/publications.json` durante cada build; ese cambio de fichero es detectado por watchdog, lo que dispara un nuevo build, que vuelve a escribir el JSON, y así indefinidamente.

---

## Información del entorno

| Campo | Valor |
|---|---|
| Fecha de reproducción | 2026-06-12 |
| Sistema | Windows 11 Home 10.0.26200 |
| Comando afectado | `mkdocs serve --livereload` |
| Hook causante | `hooks/generate_pages.py` |
| Archivo escrito por el hook | `docs/assets/publications.json` |
| Directorio vigilado por watchdog | `docs/` (MkDocs por defecto) |

---

## Descripción detallada

### Comportamiento esperado

Al arrancar `mkdocs serve --livereload`, el servidor debe construir la documentación una vez y luego reconstruirla únicamente cuando el usuario edita un fichero fuente. La actualización del JSON de publicaciones es un efecto secundario interno del build, no un cambio de fuente que deba provocar otra reconstrucción.

### Comportamiento real

El servidor entra inmediatamente en un bucle de reconstrucciones continuas. Cada build completo dispara el siguiente sin intervención del usuario, saturando la CPU y haciendo inusable el live-reload.

---

## Análisis de causa raíz

### Código responsable

**`hooks/generate_pages.py` — evento `on_files`**

```python
# Línea 216: se escribe dentro de docs/ en cada ciclo de build
write_dict_to_json(dct_output, output_path)   # output_path = "docs/assets/publications.json"
```

### Mecanismo del fallo

```
1. Usuario edita un .md en docs/
      ↓
2. Watchdog detecta cambio → MkDocs lanza rebuild
      ↓
3. on_files() se ejecuta → genera publications.json
      ↓
4. write_dict_to_json() escribe docs/assets/publications.json
      ↓
5. Watchdog detecta el cambio en docs/ → lanza OTRO rebuild
      ↓
6. Volver al paso 3 → bucle infinito
```

### Por qué no basta con no escribir si el contenido es idéntico

En la situación actual la función `write_dict_to_json` siempre sobreescribe el fichero incondicionalmente, actualizando incluso la marca de tiempo del sistema de archivos aunque el contenido sea el mismo. Watchdog reacciona al cambio de `mtime`, no al cambio de contenido, por lo que el bucle se produce incluso si no se añadió ninguna publicación nueva.

---

## Evidencia técnica

### Traza del bucle (extracto de consola)

```
INFO    -  Building documentation...
INFO    -  Documentation built in 1.28 seconds
INFO    -  Building documentation...
INFO    -  Documentation built in 1.31 seconds
INFO    -  Building documentation...
INFO    -  Documentation built in 1.29 seconds
...  (continúa indefinidamente)
```

### Ruta del fichero conflictivo

| Propiedad | Valor |
|---|---|
| Ruta escrita | `docs/assets/publications.json` |
| Directorio vigilado | `docs/` |
| ¿Dentro del directorio vigilado? | **Sí** |
| Trigger de watchdog | cambio de `mtime` en `publications.json` |

---

## Pasos para reproducir

1. Arrancar `mkdocs serve --livereload`.
2. Esperar a que el primer build complete.
3. Observar en consola que se lanzan builds continuos sin ninguna acción del usuario.
4. **Workaround actual:** usar `mkdocs serve` sin `--livereload`.

---

## Alcance del impacto

- **Quién se ve afectado:** cualquier desarrollador que arranque el servidor con `--livereload`.
- **Funcionalidad bloqueada:** live-reload completo; el servidor es inutilizable en modo desarrollo.
- **Archivos involucrados:** `hooks/generate_pages.py`, `docs/assets/publications.json`.

---

## Solución propuesta

### Opción A — Guard de hash de contenido *(recomendada)*

Antes de escribir `publications.json`, comparar el hash del nuevo contenido con el del fichero existente. Solo escribir si el contenido ha cambiado realmente. Esto rompe el bucle porque en el segundo build el JSON resultante es idéntico al ya escrito → no se modifica el fichero → watchdog no detecta cambio → no hay rebuild adicional.

```python
import hashlib, json, os

def write_dict_to_json(data, filename):
    serialized = json.dumps(serialize_obj(data), indent=4, ensure_ascii=False)
    new_hash = hashlib.md5(serialized.encode()).hexdigest()

    if os.path.exists(filename):
        with open(filename, "r", encoding="utf-8") as f:
            old_hash = hashlib.md5(f.read().encode()).hexdigest()
        if old_hash == new_hash:
            return  # contenido idéntico → no escribir → no trigger watchdog

    with open(filename, "w", encoding="utf-8") as f:
        f.write(serialized)
```

**Ventaja:** mínimo cambio, sin tocar la configuración de MkDocs ni de watchdog.  
**Limitación:** si el campo `version` incluye `date.today()`, el hash siempre diferirá aunque las publicaciones no hayan cambiado. Hay que eliminar o estabilizar ese campo para que la comparación sea efectiva.

### Opción B — Excluir `publications.json` del watcher

Modificar `hooks/ignore_file_autoreload.py` para registrar `docs/assets/publications.json` en la lista de exclusiones del servidor, de forma que watchdog ignore los cambios en ese fichero específico.

```python
def on_serve(server, config, builder):
    try:
        server.watch("overrides", builder)
        # Excluir el JSON generado automáticamente para evitar el bucle
        server.unwatch("docs/assets/publications.json")
    except Exception:
        pass
    return server
```

**Ventaja:** no requiere cambios en la lógica de generación.  
**Limitación:** la API `server.unwatch()` puede no estar disponible en todas las versiones de MkDocs; requiere verificación.

### Opción C — Escribir fuera de `docs/`

Mover `output_path` a una ruta fuera del directorio vigilado (p.ej. `assets/publications.json` en la raíz) y ajustar la referencia en el JavaScript de la home para leerlo desde otra URL.

**Ventaja:** elimina el problema de raíz.  
**Limitación:** requiere cambios en la URL de la petición fetch del frontend y posiblemente en la configuración de MkDocs para incluir el fichero en el site generado.

---

## Archivos a modificar

| Archivo | Cambio requerido |
|---|---|
| `hooks/generate_pages.py` | Añadir guard de hash antes de `write_dict_to_json` y estabilizar el campo `version` |
| `hooks/ignore_file_autoreload.py` | *(opcional según opción elegida)* Añadir exclusión de `publications.json` |

---

## Referencias

- `hooks/generate_pages.py:103-123` — función `write_dict_to_json` y `output_path`
- `hooks/generate_pages.py:209-216` — llamada final dentro de `on_files`
- `hooks/ignore_file_autoreload.py:1-12` — hook de control del watcher
- `docs/assets/publications.json` — fichero JSON generado automáticamente
