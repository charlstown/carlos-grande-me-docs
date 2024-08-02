def create_link(site_name, doc_file):
    # delete .index from uri path
    uri = '/'.join(doc_file.dest_uri.split('/')[:-1])
    
    # add site name to the uri
    link = f"https://{site_name}/{uri}"
    return link

def is_folder(doc):
    folder_names = ['notebooks', 'projects', 'references', 'resources']

    if not any(folder in doc.dest_uri for folder in folder_names):
        return False
    else:
        return True
    
def is_index(doc):
    if 'index' in doc.name:
        return True
    else:
        return False

def get_image_portrait(doc):
    print(doc.content_string)
    quit()

def on_files(files, config):
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

        # Create link
        doc_dct["link"] = create_link(site_name, doc)

        # Get image portrait
        get_image_portrait(doc)

        # Add dict to publications
        publications.append(doc_dct)
        # quit()

    print(publications)