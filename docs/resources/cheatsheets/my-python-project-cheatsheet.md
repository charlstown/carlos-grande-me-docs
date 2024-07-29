# Python project cheatsheet

![My Python 3 project structure](../../assets/images/resources/cheatsheet-python-project-portrait.jpeg){ .image-width-24 }

There is no one "right" way to structure a Python project, as the appropriate structure can depend on the specific needs and goals of the project. However, here are some general guidelines that you might find helpful when organizing your Python project files.

### DOWNLOAD THE CHEATSHEET:

[Download the cheatsheet](../../assets/docs/Cheatsheet-python-project.pdf){:download="Python Project Cheatsheet" .md-button }

Visit my post [PyTemplate](https://github.com/charlstown/py-template) to use my template for general python developers. Recommended for DevOps & Data Science projects. PyTemplate follows a customizable project structure using cookiecutter as the template generator.

---


When it comes to organizing a Python project, "structure" refers to the decisions you make about how to best achieve the goals of your project. Proper project structure is important because it helps to ensure that your code is clean, well-organized, and easy to understand. In order to create an effective project structure, it is important to consider how to leverage Python's features to create clean, efficient code, as well as how to organize your files and folders in the filesystem. By taking the time to carefully plan and structure your project, you can save time and effort in the long run and make it easier for you and others to work on and maintain your code.


## 1. The directory layout

The appropriate structure for a particular project will depend on the specific needs and goals of that project. However, here are some common tree file structures that you might find useful when organizing your Python project:

1. **Single module structure.** This is a simple structure that is suitable for small projects that only have one module (i.e. a single .py file). The structure might look something like this:

```bash
my_project/
├── code_of_conduct.md
├── LICENSE
├── my_module.py
├── README.md
└── requirements.txt
└── ...
```

2. **Package structure.** This structure is suitable for larger projects that consist of multiple modules and packages. It might look something like this:

```bash
my_project/
├── my_package/
│      ├── config/
│      │       ├── settings.yaml
│      │       └── additional_settings.yaml
│      ├── __init__.py
│      ├── main.py
│      ├── module_1.py
│      ├── module_2.py
│      ├── ...
├── tests/
│      ├── test_module_1.py
│      ├── test_module_2.py
│      └── ...
├── data/
│      ├── input.csv
│      └── ...
├── docs/
│      ├── index.md
│      └── ...
├── README.md
├── requirements.txt
├── LICENSE
└── ...
```

3. **Monolithic structure.** This is a more complex structure that is suitable for large projects that have multiple packages and modules, as well as a variety of supporting files and resources. It might look something like this:

```bash
my_project/
├── src/
│      ├── package_1/
│      │      ├── config/
│      │      │        └── settings.yaml
│      │      ├── __init__.py
│      │      ├── module_1.py
│      │      ├── module_2.py
│      │      └── ...
│      ├── package_2/
│      │      ├── config/
│      │      │        └── settings.yaml
│      │      ├── __init__.py
│      │      ├── module_3.py
│      │      ├── module_4.py
│      │      └── ...
│      └── ...
├── tests/
│      ├── tests_package_1/
│      │      ├── test_module_1.py
│      │      ├── test_module_2.py
│      │      └── ...
│      ├── tests_package_2/
│      │      ├── test_module_3.py
│      │      ├── test_module_4.py
│      │      └── ...
├── data/
│      ├── input.csv
│      └── ...
├── docs/
│      ├── index.md
│      └── ...
├── README.md
├── requirements.txt
├── LICENSE
└── ...
```

Remember, the key is to choose a structure that makes sense for your project and is easy for you and other users to understand. You can always refactor your project's structure as it evolves to better suit its needs.


## 2. Naming the project and the package

There are no strict rules for naming a Python project or package, but there are some best practices that you can follow to choose meaningful and descriptive names.

### 2.1 The project name

There are no strict rules for naming a coding project, but there are some best practices that you can follow to choose a descriptive and meaningful name:

- Choose a name that is descriptive and reflects the purpose of your project. Avoid using vague or generic names, as they may not be meaningful to other users.
- Use lowercase letters and separate words with hyphens. For example, a project called "my-project" would be easier to read and understand than "MyProject" or "my_project".
- Avoid using reserved words or names that are already used by GitHub or other projects. You can check the list of reserved words on GitHub to see which names are not allowed.
- Consider using a name that is unique within the GitHub ecosystem. This can help prevent conflicts with other projects that might have the same name.

Remember, the key is to choose a name that is descriptive, meaningful, and easy to understand. This will make it easier for other users to find and understand your project on GitHub.

### 2.2 The package name

In Python, the term "package" refers to a directory of Python modules, while the term "project" refers to a collection of related packages and modules. The package name is the name of the directory that contains the Python modules, while the project name is the overall name of the collection of packages and modules.

It is not required for the package name and the project name to be the same, although it is common for them to be similar. For example, you might have a project called "my-project" that consists of several packages, one of which is called "my_package". In this case, the project name is "my-project" and the package name is "my_package".

One thing to keep in mind is that the package name should be unique within the Python ecosystem, since it will be used to import the package's modules. For this reason, it is a good idea to choose a package name that is descriptive and specific to your project, rather than a generic name that might be used by other packages.


## 3. The configuration files

Configuration files can be useful for storing data that is specific to your application or environment, such as database credentials or API keys, and can help you avoid hardcoding this information in your code. This can make it easier to deploy your application in different environments or to share your code with others.

### 3.1 The structure layout

It is generally a good practice to save configuration files in a separate folder within your Python package. One common convention is to create a "config" folder at the root of your package and store all configuration files there. For example, if your package is structured like this:

```bash
my_project/
├── my_package/
│      ├── ...
│      └── config/
│              ├── settings.yaml
│              └── additional_settings.yaml
└── ...
```
Then you can access the configuration files from within your code using the following path: my_package/config/settings.yaml. This way, you can keep your configuration files separate from your code and easily import them when needed.

Alternatively, you could also consider using a configuration management library such as PyYAML or configparser to manage your configuration files and easily access their contents from within your code.


### 3.2 The file format

The file format for storing configuration settings in a Python project, as the appropriate choice will depend on the specific requirements and goals of your project. Some common file formats that can be used for storing configuration data in Python include:

- **.cfg:** This is a simple and easy-to-understand format that is commonly used for storing configuration data. It consists of key-value pairs, with each line in the file representing a single setting.
- **.yaml:** This is a more flexible format that can represent a wider range of data types, such as lists and dictionaries. It is generally more human-readable than .cfg files, but requires an additional library (e.g. PyYAML) to parse and read the data.
- **.json:** This is a widely used format that is well-suited for storing structured data. It can represent a variety of data types, including lists and dictionaries, and is easy to parse using the built-in json library in Python.

Ultimately, the choice of which format to use will depend on the specific needs of your project. If you need to store simple configuration data (e.g. strings, integers, and floating point values) and don't need any advanced features, then .cfg files may be sufficient. On the other hand, if you need to store more complex data structures or want more flexibility in your configuration format, then .yaml or .json files may be a better choice.


## 4. The project documentation

There are several ways to write documentation for a Python project, and the specific approach you choose will depend on the needs and goals of your project. Here are some general guidelines for writing and saving documentation in a Python project:

- Write documentation that is clear, concise, and easy to understand. This can include an overview of the project, instructions for installation and usage, and details about the project's architecture and design.
- Use a documentation generator tool to automatically create documentation based on the code and comments in your project. Popular documentation generators for Python include Sphinx, MkDocs, and Doxygen.
- Save your documentation in a dedicated folder within your project. A common convention is to use a folder called "docs" for this purpose.
- Consider including a README file at the root level of your project folder. This file should provide a high-level overview of your project and include any information that users might need to get started with your project, such as installation instructions and dependencies.

Remember, the key is to provide clear and concise documentation that helps users understand and use your project. By taking the time to write and maintain good documentation, you can make it easier for others to understand and use your code.

### 4.1 Where to add your documentation

It is common to save documentation for a Python project in a dedicated folder within the project directory tree. A common convention is to use a folder called "docs" for this purpose. For example, your project directory tree might look something like this:

```bash
my_project/
├── my_package/
│      └──...
├── docs/
│      ├── index.md
│      └── ...
└── ...
```

In this example, the "docs" folder contains the documentation for the project, which might include files such as a user manual, API reference, or installation instructions.

It is also a good idea to include a README file at the root level of your project folder. This file should provide a high-level overview of your project and include any information that users might need to get started with your project, such as installation instructions and dependencies.

Remember, the key is to keep your documentation organized and easy to find. By saving your documentation in a dedicated folder, you can make it easier for users to access and understand your project.


## 5. Additional files

In addition to the code files, there are a number of other files and resources that you might want to include in a Python project. The specific files and resources that you include in your project will depend on the needs and goals of your project. The key is to include any necessary files and resources that will help users understand and use your project.


## 5.1 The readme file

A *README* file is a text file that provides a high-level overview of a project and includes any information that users might need to get started with the project. It is typically located at the root level of a project directory and is used to introduce the project to users and provide them with the information they need to understand and use the project.

The contents of a *README* file will vary depending on the specific needs and goals of the project, but it might include information such as:

- A description of the project and its purpose
- Installation instructions
- Dependencies and requirements
- Usage instructions
- Troubleshooting
- A disclaimer section
- Possible help wanted
- Links to documentation and other resources

The *README* file is often the first thing that users will see when they encounter your project, so it is important to make it clear, concise, and easy to understand. By including all of the necessary information in the *README* file, you can make it easier for users to get started with your project and understand how to use it.


### 5.2 The license file

A *LICENSE* file is a text file that includes information about the terms and conditions under which a project is licensed. It specifies how users are allowed to use, modify, and distribute the code and resources of the project.

Having a *LICENSE* file is important because it allows users to understand the legal terms that apply to the use of your project, and helps to protect your rights as the creator of the project. Without a *LICENSE* file, users may not be clear on what they are allowed to do with your code, and you may not have legal recourse if your code is used in ways that you did not intend.

There are many different types of open source licenses available, each with its own specific terms and conditions. Some of the most common open source licenses include:

- **MIT License:** This is a permissive license that allows users to use, modify, and distribute the code and resources of the project as long as they include a copy of the license and attribute the original authors.
- **Apache License:** This is a permissive license that allows users to use, modify, and distribute the code and resources of the project as long as they include a copy of the license and attribute the original authors. It also includes a patent grant to protect users from patent lawsuits.
- **GNU General Public License (GPL):** This is a copyleft license that requires users to distribute any modifications they make to the code and resources of the project under the same license. This helps to ensure that the code remains freely available and open source.

Ultimately, the choice of which license to use will depend on the specific needs and goals of your project. I recommend the [Choose an open source license](https://choosealicense.com/) site to decide witch license fits best to your project. You can also learn more about open licenses at [the open source initiative](https://opensource.org/licenses).


### 5.3 The code of conduct file

A code of conduct is a set of guidelines that outline the behavior that is expected of users and contributors to a project. It is often included in a CODE_OF_CONDUCT file within a project's repository.

Having a code of conduct is important because it helps to create a positive and inclusive community around a project. It can help to establish clear expectations for behavior and ensure that all users and contributors feel welcome and respected.

There are many different codes of conduct available, and the specific code that is right for your project will depend on the needs and goals of your community. Some common codes of conduct include:

- **[Contributor Covenant](https://www.contributor-covenant.org/)**: This is a widely-used code of conduct that outlines expected behaviors and provides guidance on how to report and address violations.
- **[Open Code of Conduct](https://github.com/todogroup/opencodeofconduct):** This is a simple and straightforward code of conduct that outlines basic expectations for behavior and provides guidance on how to report and address violations.
- **[Geek Feminism code fo conduct](https://geekfeminismdotorg.wordpress.com/about/code-of-conduct/):** This code of conduct from the Geek Feminism community prioritizes marginalized people’s safety over privileged people’s comfort. It is dedicated to providing a harassment-free experience for everyone, regardless of gender, gender identity and expression, sexual orientation, disability, physical appearance, body size, race, or religion. We do not tolerate harassment of participants in any form.
- **[Citizen Code of Conduct](https://web.archive.org/web/20200330154000/http://citizencodeofconduct.org/):** This is a code of conduct that is specifically designed for use in open source projects and communities. It includes guidelines on appropriate behavior and provides a framework for addressing violations.

 It is a good idea to carefully consider the different codes of conduct available and choose one that aligns with the values and goals of your community.


## Other references and links

- [Template with the Python structure on github](https://github.com/charlstown/Python-Project-Structure)
- [Open Sourcing a Pthon Project the Right way](https://www.jeffknupp.com/blog/2013/08/16/open-sourcing-a-python-project-the-right-way/)
- [Filesystem structure of a Python project](http://as.ynchrono.us/2007/12/filesystem-structure-of-python-project_21.html)
- Github repository: [cheatsheets](https://github.com/charlstown/CodeCheatsheets)
