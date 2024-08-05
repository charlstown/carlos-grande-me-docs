---
description: none
toc_depth: 3
---

# Python 3 cheatsheet

I wanted to post my Python3 cheat sheet and some useful functions I use almost every day. These functions are no libraries needed making them easier to implement. As far as I learn more programming languages I'll create more cheat sheets, hope they'll be helpful.

![My Python 3 Cheat sheet](../../assets/images/resources/cheatsheet-python-portrait.png){ .image-width-24 }


### DOWNLOAD THE CHEAT SHEET:

[Download the cheatsheet](../../assets/docs/cheatsheet-python.pdf){:download="Docker Cheatsheet" .md-button }

---

## Usefull scripts:

### Method: sort by key list

This function sort two list of the same lenght taking the first one as the key-list and making the second one dependent.
This codes works only with two same size lists.

#### Method

```py
def sorter(lst, elements):
    xy = zip(lst, elements)
    lst_sorted = [x for x, y in sorted(xy)]
    xy = zip(lst, elements)
    elements_sorted = [y for x, y in sorted(xy)]
    return lst_sorted, elements_sorted
```

#### Example

```py
keys = [1, 3, 2, 6, 4, 8, 5, 10]
elements = ['dog', 'cat', 'monkey', 'lizard', 'eagle', 'spyder', 'snake', 'wolf']

# Calling the function
sorter(keys, elements)
```

```py title="output"

([1, 2, 3, 4, 5, 6, 8, 10],
['dog', 'monkey', 'cat', 'eagle', 'snake', 'lizard', 'spyder', 'wolf'])
```

### Method: entwine elements of two lists

This function takes two lists and interspersing all elements, starting by the first list element. For this function the same size lists are no needed.

#### Method:

```py
def entwine(lst1, lst2):
    zipped = []
    a = max([len(lst1), len(lst2)])
    for i in range(a):
        try:
            zipped.append(lst1[i])
        except:
            pass
        try:
            zipped.append(lst2[i])
        except:
            pass
    return zipped
```

#### Example


```py
lst_1 = ['alpha', 'bravo', 'charlie', 'delta', 'echo']
lst_2 = [1, 2, 5, 12, 18, 0]

entwine(lst_1, lst_2)
```

```py title="output"

    ['alpha', 1, 'bravo', 2, 'charlie', 5, 'delta', 12, 'echo', 18, 0]
```

### Method: counter items

This function counts each item of a list and outputs providing the frequency by item.

#### Method


```py
def counter(lst):
    output = {}
    for value in lst:
        count = len([i for i in lst if i == value])
        output[value] = count
    return output
```

#### Example

```py
lst = ['A', 'C', 'D', 'A', 'B', 'C', 'D', 'A']

grooping(lst)
```

```py title="Output"
    {'A': 3, 'C': 2, 'D': 2, 'B': 1}
```

### Method: permutate elements of a list

This function resolve all the possible permutations from a list with no elements repeated.

#### Method

```py
def permute(lst):
    combi = []
    for i in range(len(lst)):
        for x in range(i, len(lst)):
            if lst[i] != lst[x]:
                combi.append([lst[i],lst[x]])
    return combi
```

#### Example

```py
words = ['alpha', 'bravo', 'charlie']

permute(words)
```

```py title="Output"
    [['alpha', 'bravo'], ['alpha', 'charlie'], ['bravo', 'charlie']]
```

### Method: invert dictionary

This function invert a dictionary switching keys with values.

#### Method

```py
def invert_dictionary(dictionary):
    all_dcts = []
    for k, v in dictionary.items():
        temp_dct = {}
        for token in v:
            temp_dct[token] = [k]
        all_dcts.append(temp_dct)
    inverted_dictionary = all_dcts[0]
    for dct in all_dcts[1:]:
        for k, v in dct.items():
            if k in inverted_dictionary.keys():
                inverted_dictionary[k] = inverted_dictionary[k] + v
            else:
                inverted_dictionary[k] = v
    return inverted_dictionary
```

#### Example

```py
dictionary = {'a' : [1, 5, 9, 8], 'b' : [2, 3, 8, 0], 'c' : [8, 9, 0, 8]}

invert_dictionary(dictionary)
```

```py title="output"
{1: ['a'],
 5: ['a'],
 9: ['a', 'c'],
 8: ['a', 'b', 'c'],
 2: ['b'],
 3: ['b'],
 0: ['b', 'c']}
```

---

## OTHER LINKS

- Github repository: [cheatsheets](https://github.com/charlstown/CodeCheatsheets)
- More resources like this here: [https://carlosgrande.me/category/resources](https://carlosgrande.me/category/resources)
