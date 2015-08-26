define(function (require, exports, module) {
  'use strict';

  var ProjectManager = brackets.getModule('project/ProjectManager'),
    ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
    NodeConnection = brackets.getModule('utils/NodeConnection'),
    FileSystem = brackets.getModule('filesystem/FileSystem'),
    FileUtils = brackets.getModule('file/FileUtils'),
    CodeInspection = brackets.getModule('language/CodeInspection'),
    DocumentManager = brackets.getModule('document/DocumentManager'),
    EditorManager = brackets.getModule('editor/EditorManager'),
    Dialogs = brackets.getModule("widgets/Dialogs"),
    LanguageManager = brackets.getModule("language/LanguageManager");

  // load a named node module
  function connectToNodeModule(moduleName) {
    var connection = new NodeConnection();
    return connection.connect(true).pipe(function () {
      var path = ExtensionUtils.getModulePath(module, 'node/' + moduleName);
      return connection.loadDomains([path], true);
    }).pipe(function () {
      return connection.domains[moduleName];
    });
  }

  /*function loadProjectConfig(callback) {
    var projectPath = ProjectManager.getProjectRoot().fullPath,
      file = FileSystem.getFileForPath(projectPath + '.brackets.json');
    FileUtils.readAsText(file).then(callback, function () {
      var file = FileSystem.getFileForPath(projectPath + 'compile.json');
      FileUtils.readAsText(file).then(callback, function () {
        callback();
      });
    });
  }

  // Compile the files listed in the compile config file.
  // Defaults to 'compile.json' in the root of project.
  // If no compilation config found, defaults to normal behavior.
  function loadFilesToCompile(documentPath) {
    var projectPath = ProjectManager.getProjectRoot().fullPath,
      deferred = $.Deferred();

    // read the config file
    loadProjectConfig(function (text) {
      if (!text) {
        deferred.resolve([documentPath]);
      }
      var files, err;
      try {
        // try to parse it
        files = JSON.parse(text).es6;
      } catch (e) {
        err = e;
      }
      if (err || !(files instanceof Array)) {
        deferred.resolve([documentPath]);
      } else {
        // or: read file entries
        files.forEach(function (file, i) {
          files[i] = projectPath + file;
        });
        deferred.resolve(files);
      }
    });
    return deferred;
  }*/

  function convertError(error) {
    if(typeof error === 'string') return { pos: {}, message: error };
    switch (error.code) {
    case 'EACCES':
    case 'ENOENT':
      return { pos: {}, message: 'Cannot open file \'' + error.filepath + '\'' };
    default:
      if (error.filepath !== EditorManager.getCurrentFullEditor().document.file.fullPath)
        return { pos: {}, message: 'Error in file \'' + error.filepath + '\' on line ' + error.loc.line, type: "?" };
      else
        return { pos: { line: error.loc.line - 1, ch: error.loc.column }, message: "Error at: " + error.codeFrame, type: "?" };
    }
  }

  // use the given compiler to compile the given files
  function compileAll(compiler, files) {
    // compiler.compile(file) each file and combine into a single deferred
    return $.when.apply($, files.map(function (file) {
      return compiler.compile(file);
    }));
  }

  function compileES6(contents, documentPath) {
    var deferred = new $.Deferred();
    
    // process only if extension is es6
    if (DocumentManager.getCurrentDocument().file.name.split('.').pop() === 'es6') {
      var connection = connectToNodeModule('ES6Compiler'),
        files = [documentPath];//loadFilesToCompile(documentPath);
        
      // connect to the node server & read the file
      $.when(connection, files).then(function (compiler, files) {
        compileAll(compiler, files).then(function () {
          deferred.resolve();
        }, function (error) {
          deferred.resolve({ errors: [convertError(error)] });
        });
      }, function (error) {
        deferred.resolve({ errors: [error] });
      });
      
    } else {
      deferred.resolve();
    }

    return deferred.promise();
  }
  
  
  // define a new language
//  LanguageManager.defineLanguage("es6", {
//      name: "EcmaScript 6",
//      mode: "javascript",
//      fileExtensions: ["es6"],
//      blockComment: ["/*", "*/"],
//      lineComment: ["//"]
//  });

  LanguageManager.getLanguage("javascript").addFileExtension("es6");

  // Register for es6 files
  CodeInspection.register('javascript', {
    name: 'es6-autocompile',
    scanFileAsync: compileES6
  });

  // Register for documentSaved events to support inline-editors
  $(DocumentManager).on('documentSaved', function (event, document) {
    if (DocumentManager.getCurrentDocument().file.name.split('.').pop() === 'es6') {
      compileES6(document.getText(), document.file.fullPath);
    }
  });
});
