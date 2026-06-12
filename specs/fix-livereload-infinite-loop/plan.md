# Plan: Fix bucle infinito de live-reload (publications.json)

## Batch 1 — Guard de hash en write_dict_to_json

- [x] Añadir `import hashlib` al bloque de imports de `hooks/generate_pages.py` (junto a `import json` y `import os`, que ya están presentes).
- [x] Reescribir `write_dict_to_json` (líneas 103-123) para serializar el contenido a string con `json.dumps`, calcular el MD5 del nuevo contenido con `hashlib.md5`, compararlo con el MD5 del fichero existente si existe, y solo escribir si los hashes difieren; si el fichero no existe, escribir siempre.
- [ ] Verificar en `on_files` (línea 210) que `version: date.today().isoformat()` permanece sin cambios — el valor es estable dentro del día y no invalida el guard de hash entre builds consecutivos.
- [ ] Arrancar `mkdocs serve --livereload`, esperar el primer build completo y confirmar en consola que no se lanza un segundo build automático sin editar ningún fichero fuente.
