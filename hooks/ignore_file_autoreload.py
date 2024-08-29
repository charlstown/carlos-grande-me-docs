def on_serve(server, config, builder):
    """
    This hook is triggered when serving the site.
    """
    # Exclude the generated JSON file from the watch list
    watch_paths = server._watched_paths

    # Add a check to exclude the generated file from the watch list
    server.watch_paths = [
        path for path in watch_paths
        if not path.endswith('assets/publications.json')
    ]

    return server