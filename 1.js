//importingCode();
//exportingCode();
json();
asynchronityProblems();

function importingCode() {
    /*require() is a fundamental NodeJS method that is key to importing
    packages from the NPM to a project and using JS modules. */

    //Receiving exports from another JS file:
    const obj = require('./example.js');
    /*A pathname must be used, or else the node runtime will treat the
    filename as a package name. The other file will also execute when
    receiving its exports. For example, console.log() in the exporting 
    file will log its contents to the console. */

    //Receiving specific, named imports:
    let {ExampleClass, exampleVar} = require('./example.js');

    /*JS destructuring allows for renaming imports using object syntax, and 
      setting default values using variable syntax.*/
    //let {ExampleClass: eClass, exampleVar = 4} = require('./example.js');

    //Importing a node package:
    let express = require('express');
    /*For this to work, the package must have already been installed 
    using NPM for the current project. */

    /*Simply requiring a file will execute the code in that file and will
      ignore the 'module.exports' variable. */
    require('./example.js');
}

function exportingCode() {
    /*The 'module.exports' object is a convenient way to specify which clusters
      of code need to be exported from a file. */

    let variable = 'Dinesh';
    let func = () => 'Balakrishnan';

    /*Exporting a single element doesn't require object formatting. The value 
      will not be automatically wrapped in an object either. */
    module.exports = variable;
    module.exports = {variable, func};
}

function json() {
    /*JSON, known as 'Javascript Object Notation', is a lightweight data 
      inter-change format. It converts objects, arrays, strings, numbers, 
      booleans, and null into a string format. File type: .json*/

    const exampleObj = {
        exampleVar: 4,
        exampleArr: [4, 4, 4] 
    }

    //To turn code into JSON:
    const json = JSON.stringify(exampleObj);

    //To turn JSON into usable code:
    const parsedData = JSON.parse(json);
}

function asynchronityProblems() {
    /*The print statement below will run before the actual operation. Before a 
      function is executed, it is added to the call stack of a program.
      If the function is asynchronous and is waiting for some requirement
      other than the CPU to be executed, it is registered within the Node
      API. Once complete, the function is added to a callback queue. Functions
      in this queue are only executed after functions in the call stack are done
      executing. */
    setTimeout(() => console.log(2 + 2), 0);
    console.log('...is the sum.');

    /*To fix asynchronity problems, a callback function can be used: */
    const callback = () => console.log('...is the sum.');
    setTimeout(() => {
        console.log(2 + 2)
        callback();
    }, 0);
}