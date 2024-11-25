import os
from mkdocs.structure.files import Files, File
from datetime import date
import re
import yaml
import json

# Global Vars
output_path = "docs/assets/publications.json"

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
    link = f"./{uri}"
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

def get_header(doc):
    # Initial variables
    doc_string = doc.content_string
    pattern = r'^\s*#\s*(.+)$'

    # Use re.search to find the first match
    match = re.search(pattern, doc_string, re.MULTILINE)

    if match:
        return match.group(1)
    else:
        return None


def get_yaml_front_matter(doc: File) -> dict:
    """Extracts the yaml front matter from the markdown documentation.

    :param doc: documentation markdown files
    :return: yaml data extracted
    """
    doc_string = doc.content_string

    # Regex to match YAML front matter at the start of the string
    front_matter_regex = r'^---\s*([\s\S]+?)\s*---'

    match = re.match(front_matter_regex, doc_string)
    if match:
        yaml_content = match.group(1)
        yaml_data = yaml.safe_load(yaml_content)
    else:
        yaml_data = None
    return yaml_data

def serialize_entry(entry):
    """Serializes a dictionary entry, converting date fields to strings.

    :param entry: _description_
    :return: _description_
    """
    # Convert datetime.date to ISO format string
    if 'date' in entry and isinstance(entry['date'], date):
        entry['date'] = entry['date'].isoformat()
    return entry

def write_dict_to_json(data, filename):
    """Writes a list of dictionaries to a JSON file.

    :param data: _description_
    :param filename: _description_
    """
    # Serialize the data
    serialized_data = [serialize_entry(entry) for entry in data]
    
    # Write to JSON file
    with open(filename, 'w') as file:
        json.dump(serialized_data, file, indent=4)

def extract_fields_from_doc(doc, site):
    """Extract fields from the doc file

    :param doc: _description_
    :param site: _description_
    """
    dct = dict()

    # Add elements
    dct["id"] = doc.name
    dct["src"] = doc.src_uri

    # Create category
    dct["category"] = get_category(doc)

    # Create link
    dct["link"] = get_link(doc, site)
    return dct

def extract_fields_from_yaml(doc):
    """_summary_

    :param doc: _description_
    """
    dct = dict()
    # Get yaml front matter
    yaml_data = get_yaml_front_matter(doc)

    # Get parameters from the yaml front matter
    if yaml_data:
        yaml_date = yaml_data.get("date")
        yaml_title = yaml_data.get("short_title")
        yaml_thumbnail = yaml_data.get("thumbnail")

    # Rule title if title is None
    if yaml_title:
        dct["title"] = yaml_title
    else:
        dct["title"] = get_header(doc)

    # Save parameters
    dct["date"] = yaml_date
    dct["thumbnail"] = yaml_thumbnail
    return dct

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
    for doc in md_docs:

        # filter folders
        if not is_folder(doc) or is_index(doc):
            continue

        # Create element
        doc_dct = dict()

        # Extract elements
        doc_fields = extract_fields_from_doc(doc=doc, site=site_name)
        yaml_fields = extract_fields_from_yaml(doc=doc)

        # Add elements
        doc_dct.update(doc_fields)
        doc_dct.update(yaml_fields)

        # Add dict to publications
        publications.append(doc_dct)

    # Sort results by date
    sorted_publications = sorted(publications, key=lambda x: (x['date'] is None, x['date']), reverse=True)

    # Write to a JSON file named 'data.json'
    if not os.path.exists(output_path):
        write_dict_to_json(sorted_publications, output_path)
