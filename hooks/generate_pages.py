from mkdocs.structure.files import Files, File

# Code
def get_link(doc_file: File, site_name: str) -> str:
    """Generates the final link of each page.

    :param site_name: String with the name of the site
    :param doc_file: documentation markdown files
    :return: string with the link of the doc file
    """
    # delete .index from uri path
    uri = '/'.join(doc_file.dest_uri.split('/')[:-1])
    
    # add site name to the uri
    link = f"{site_name}/{uri}"
    return link

def is_folder(doc: File) -> bool:
    """Check if the folder of the doc file is one of the filtered names.

    :param doc_file: documentation markdown files
    :return: true if the folder is in the list folder_names.
    """
    folder_names = ['notebooks', 'projects', 'references', 'resources']

    if not any(folder in doc.dest_uri for folder in folder_names):
        return False
    else:
        return True
    
def is_index(doc: File) -> bool:
    """Check if the doc file is an index page or a content page.

    :param doc_file: documentation markdown files
    :return: true if the doc file is an index
    """
    if 'index' in doc.name:
        return True
    else:
        return False

def get_category(doc: File) -> str:
    """Extracts the main category of each page.

    :param doc_file: documentation markdown files
    :return: string with the category of the doc file
    """
    category = doc.dest_uri.split('/')[0]
    return category

def get_image_portrait(doc: File):
    print(doc.content_string)
    quit()

def on_files(files: Files, config):
    """The files event is called after the files collection is populated from the docs_dir.

    :param files: global files collection
    :param config: global configuration object
    :return: none
    """
    md_docs = files.documentation_pages()

    site_name = config.site_name

    # Create publications
    publications = list()

    # Get parameters
    for doc in md_docs[:10]:

        # filter folders
        if not is_folder(doc) or is_index(doc):
            continue

        # Create element
        doc_dct = dict()

        # Add elements
        doc_dct["id"] = doc.name
        doc_dct["src"] = doc.src_uri

        # Create category
        doc_dct["category"] = get_category(doc)

        # Create link
        doc_dct["link"] = get_link(doc, site_name)

        # Get image portrait
        get_image_portrait(doc)

        # Add dict to publications
        publications.append(doc_dct)
        # quit()

    print(publications)