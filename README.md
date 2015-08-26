# ES6 AutoCompile for Brackets

ES6 AutoCompile is an extension for the [Brackets editor](https://github.com/adobe/brackets)
that adds automatic compilation of ES6 files to ES5 upon saving.

**Note:** ES6 Autocompile also tells Brackets to treat ``*.es6`` and``*.ec6`` files as javascript source.
This enables syntax highlighting for those files, but also triggers built-in JSLint-ing, which is rather inadequate
for ES6 source (that is, without the proper options).


## Usage

Upon saving, ES6 AutoCompile will automatically process any javascript file:

- whose name ends with ``.es6``, ``.ec6``, ``.es6.js`` or ``.ec6.js``
- whose exact first line is: ``// !ES6``

and produce an ES5 file ending with ``.js`` (or ``.es5.js``) with the same basename and path.

### Installation

ES6 AutoCompile is installed from the *Brackets Extension Manager*.

Alternatively, you can download it from the [Brackets Extension Registry](https://brackets-registry.aboutweb.com/)
and unzip it in your extensions folder.

Please restart Brackets after installation.

### Options

#### Custom paths

*Not supported yet*

## Todo

- Provide working examples
- Allow specifying destination paths for generated files (perhaps with regex-based rewrite rules)
- Have JSLint run with the ``es6`` option on ES6 code (or not at all)
- Provide source maps
- Display more helpful error messages


## About

### Acknowledgements

ES6 AutoCompile is largely based off [LESS AutoCompile](https://github.com/jdiehl/brackets-less-autocompile).
Consequently, most credit for this project goes to the latter's contributors.

This project relies on [babeljs](https://babeljs.io/) to compile ES6 to ES5.


### License

The MIT License (MIT)

Copyright (c) 2013 Jonathan Diehl

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.