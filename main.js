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
      return compiler.compile(file.src, file.dst);
    }));
  }

  function compileES6(contents, srcFilePath) {
    var deferred = new $.Deferred();
    var dstFilePath = getDstFilenameIfShouldCompile(contents, srcFilePath);
    
    // should compile if dstFilePath not null
    if (dstFilePath !== null) {
      var connection = connectToNodeModule('ES6Compiler');
      var files = [{src:srcFilePath, dst:dstFilePath}];//loadFilesToCompile(srcFilePath);
        
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
    
  
  // This function tests whether the file should be compiled
  // if so, it returns a path to be used for the destination file
  // if not, it returns null
  function getDstFilenameIfShouldCompile(content, filepath) {
    // Test for matching extensions in filepath
  
    var inputExts = [".es6", ".ec6", ".es6.js", ".ec6.js"];
    
    var matchingExts = inputExts.filter(function(ext) {
        return filepath.substr(-ext.length) === ext;
      });
    
    if (matchingExts.length > 0) // if does match, replace extension with ".js"
      return filepath.slice(0, -matchingExts[0].length) + ".js";
      
    // Test for magic tag in contents
    
    var firstLine = content.substr(0, content.indexOf('\n')).trim();
    
    if (/^\s*\/\/\s*\!ES6\s*$/.test(firstLine)) {
      var exploded = filepath.split(".");
      
      if (exploded.length > 1) { // if the file has an extension, add ".es5" before
        exploded.splice(-1, 0, "es5");
        return exploded.join(".");
      } else { // if not, just append ".es5.js" to the path
        return filepath + ".es5.js";
      }
    }
    
    // All is lost
    
    return null;
  }
  
  
  LanguageManager.getLanguage("javascript").addFileExtension("es6");
  LanguageManager.getLanguage("javascript").addFileExtension("ec6");

  // Register for es6 files
  CodeInspection.register('javascript', {
    name: 'es6-autocompile',
    scanFileAsync: compileES6
  });

  // Register for documentSaved events to support inline-editors
  $(DocumentManager).on('documentSaved', function (event, document) {
    if (EditorManager.getCurrentFullEditor().document !== document && document.getLanguage().getId() === 'javascript') {
      compileES6(document.getText(), document.file.fullPath);
    }
  });
});
