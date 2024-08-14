---
title: Markdown Test
hidden: true
---

# h1 Heading 8-)
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading



Dolore officiis sint exercitationem quas omnis. Ullam placeat aut et aut repellat similique. Repellat aspernatur et quibusdam aut vero. Minus doloremque sequi optio. Molestiae minus tempore sed ipsum ut et et enim.

Aut quam enim tempora. Sed quam perferendis nobis quam placeat. Qui voluptatem sit numquam exercitationem.

Eligendi suscipit et repudiandae. Soluta voluptate ex debitis harum necessitatibus quia ut laudantium. Ut maiores voluptatem dolor deleniti facere dignissimos non. Similique ad commodi explicabo voluptatibus sequi sed expedita sed. Harum non animi et iure recusandae.

Sit voluptatem fuga blanditiis recusandae velit. Harum adipisci quasi at sed eos vero qui. Et in excepturi enim quo. Occaecati quam omnis corporis nisi ipsam. Ut facilis nostrum veniam vero nihil excepturi reprehenderit qui.

Possimus quidem iure provident voluptas fuga et ratione sequi. In facilis non error autem impedit aut delectus rerum. Harum et facilis voluptas. Id rerum non reprehenderit sed sed fugiat et. Dolores eum quia eum mollitia. Ut nesciunt consequatur nisi nemo voluptatibus.


## Horizontal Rules

___

---

***


## Typographic replacements

Enable typographer option to see result.

(c) (C) (r) (R) (tm) (TM) (p) (P) +-

test.. test... test..... test?..... test!....

!!!!!! ???? ,,  -- ---

"Smartypants, double quotes" and 'single quotes'


## Emphasis

**This is bold text**

__This is bold text__

*This is italic text*

_This is italic text_

~~Strikethrough~~


## Blockquotes


> Blockquotes can also be nested...
>> ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.


## Lists

Unordered

+ Create a list by starting a line with `+`, `-`, or `*`
+ Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    * Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
+ Very easy!

Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa


1. You can use sequential numbers...
1. ...or keep all the numbers as `1.`

Start numbering with offset:

57. foo
1. bar


## Code

Inline `code`

Indented code

    // Some comments
    line 1 of code
    line 2 of code
    line 3 of code


Block code "fences"

```
Sample text here...
```

Syntax highlighting

``` js
// Variables and Constants
let myVariable = 10;
const PI = 3.14159;

// Functions
function greet(name) {
  return `Hello, ${name}!`;
}

// Arrow Functions
const add = (a, b) => a + b;

// Template Literals
const message = `The result is: ${add(5, 3)}`;

// Classes
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `Hello, my name is ${this.name} and I am ${this.age} years old.`;
  }
}

// Promises
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Data fetched successfully!');
    }, 2000);
  });
};

// Async/Await
const fetchDataAsync = async () => {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

fetchDataAsync();

// Modules (ES6 Modules)
import { myFunction } from './myModule.js';

// Spread Operator
const numbers = [1, 2, 3];
const newNumbers = [...numbers, 4, 5];

// Destructuring
const { name, age } = { name: 'Alice', age: 30 };

// Rest Parameter
function sum(...numbers) {
  return numbers.reduce((acc, curr) => acc + curr, 0);
}

console.log(sum(1, 2, 3, 4, 5));

// Generators
function* generatorFunction() {
  yield 1;
  yield 2;
  yield 3;
}

const generator = generatorFunction();
console.log(generator.next().value); // 1
console.log(generator.next().value); // 2
console.log(generator.next().value); // 3

// Symbols
const mySymbol = Symbol('mySymbol');

// Proxies
const handler = {
  get: function(target, prop) {
    return prop in target ? target[prop] : `Property ${prop} not found`;
  }
};

const proxy = new Proxy({ name: 'Alice' }, handler);
console.log(proxy.name); // Alice
console.log(proxy.age); // Property age not found
```

## Tables

| Option | Description | Description2 | Description3 |
| ------ | ----------- | ----------- | ----------- |
| data   | path to data files to supply the data that will be passed into templates. | path to data files to supply the data that will be passed into templates. | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. | path to data files to supply the data that will be passed into templates. | path to data files to supply the data that will be passed into templates. |
| ext    | extension to be used for dest files. | path to data files to supply the data that will be passed into templates. | path to data files to supply the data that will be passed into templates. |

Right aligned columns

| Option | Description |
| ------:| -----------:|
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |


## Links

[link text](http://dev.nodeca.com)

[link with title](http://nodeca.github.io/pica/demo/ "title text!")

Autoconverted link https://github.com/nodeca/pica (enable linkify to see)


## Images

![Minion](https://octodex.github.com/images/minion.png)
![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")

Like links, Images also have a footnote style syntax

![Alt text][id]

With a reference later in the document defining the URL location:

[id]: https://octodex.github.com/images/dojocat.jpg  "The Dojocat"


## Plugins

The killer feature of `markdown-it` is very effective support of
[syntax plugins](https://www.npmjs.org/browse/keyword/markdown-it-plugin).


### [Emojies](https://github.com/markdown-it/markdown-it-emoji)

> Classic markup: :wink: :cry: :laughing: :yum:
>
> Shortcuts (emoticons): :-) :-( 8-) ;)

see [how to change output](https://github.com/markdown-it/markdown-it-emoji#change-output) with twemoji.


### [Subscript](https://github.com/markdown-it/markdown-it-sub) / [Superscript](https://github.com/markdown-it/markdown-it-sup)

- 19^th^
- H~2~O


### [\<ins>](https://github.com/markdown-it/markdown-it-ins)

++Inserted text++

<del>Deleted text</del>


### [\<mark>](https://github.com/markdown-it/markdown-it-mark)

==Marked text==


### [Footnotes](https://github.com/markdown-it/markdown-it-footnote)

Footnote 1 link[^first].

Footnote 2 link[^second].

Inline footnote^[Text of inline footnote] definition.

Duplicated footnote reference[^second].

[^first]: Footnote **can have markup**

    and multiple paragraphs.

[^second]: Footnote text.


### [Definition lists](https://github.com/markdown-it/markdown-it-deflist)


### [Abbreviations](https://github.com/markdown-it/markdown-it-abbr)

This is HTML abbreviation example.

It converts "HTML", but keep intact partial entries like "xxxHTMLyyy" and so on.

*[HTML]: Hyper Text Markup Language

<span class="message success">Something happened!</span>
<span class="message warning">Something happened!</span>
<span class="message error">Something happened!</span>