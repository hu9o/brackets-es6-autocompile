# ES6 AutoCompile

ES6 AutoCompile is an extension for the [Brackets editor](https://github.com/adobe/brackets) that adds automatic compilation of ES6 files to ES5 upon saving.

### What it does:

- Tell brackets that ``*.es6`` are javascript code
- Compile ``*.es6`` files into ``*.js`` (ES5) files upon saving
- Report any compile error in the bottom panel, with the line number

**Warning:** Due to ``*.es6`` files being recognized as javascript, JSLint will likely fire warnings/errors when editing those.
I chose not to define a separate language for ES6, which I think would lead to issues and misunderstandings.


## Usage

ES6 AutoCompile will automatically process any ``*.es6`` file upon saving.

### Installation

ES6 AutoCompile is installed from the *Brackets Extension Manager*. Please restart Brackets after installing the extension.

### Compile options

*Not supported yet*


## Todo

- Provide working examples
- Allow for more file extensions for ES6 sources
- Allow specifying destination paths for generated files
- Have JSLint run with the ``es6`` option on ES6 code
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