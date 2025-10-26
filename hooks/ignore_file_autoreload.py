def on_serve(server, config, builder):
    """Attach minimal, non-invasive watchers.

    Important: do NOT mutate server internals; that can disable reloads.
    """
    try:
        # Only add an explicit watch for overrides; rely on MkDocs defaults
        # to watch docs/ and theme.
        server.watch("overrides/**/*", builder)
    except Exception:
        pass
    return server
