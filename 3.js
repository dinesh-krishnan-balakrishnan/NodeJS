fsPackage();
validatorPackage();
chalkPackage();
yargsPackage();

function fsPackage() {
    /*The fs package makes it easier to write to and read from a file, making it
      a convenient method for dynamic data storage. */
    const fs = require('fs');

    //To write to a file: (Will create or replace file at location)
    fs.writeFileSync('example.txt', 'Dinesh ');

    //To add to a currently existing file:
    fs.appendFileSync('example.txt', 'Balakrishnan');

    //To read from a file and interpret it in string format: 
    console.log(fs.readFileSync('example.txt'));
}

//Download: 'npm i validator'
function validatorPackage() {
    /*The validator package checks whether strings are formatted
      to match a certain specification such as a boolean or URL. */
    const validator = require('validator'); 

    //To check whether a string is a valid email ID:
    console.log(validator.isEmail('@gmail.com'));

    //To check whether a string is a valid URL:
    console.log(validator.isURL('http://www.dinesh.com'));
}

//Download 'npm i chalk'
function chalkPackage() {
    //The Chalk2 package is for terminal string styling.
    const chalk = require('chalk');

    //To output red text:
    console.log(chalk.red('Red Text'));

    //To make text bold:
    console.log(chalk.bold('Bolded Text'));

    //To combine different styles:
    console.log(chalk.red.bold.inverse('Success!'));
}

//Download: 'npm i yargs'   
function yargsPackage() {
    /*When running a process, the arguments passed into it are located in
      process.argv. This is an array containing:

        - argv[0]: The executable that started the NodeJS process.
        - argv[1]: The pathname of the file that was executed.
        - argv[2+]: All extra arguments passed into a command.

      The general format of command is:
        node <filename> <command> --<optional_argument>=<value> ...
    */
    console.log(process.argv);

    /*The yargs package makes argument management easier and allows options
      to be specified for these arguments. */
    const yargs = require('yargs');

    //To display a formatted version of arguments specified to the terminal:
    console.log(yargs.argv);

    yargs.command({
        //'list' is an argument that can be specified.
        command: 'list',

        /* 'node filename --help' can be used to find out what
          all the arguments and their descriptions are. 'describe' puts an 
          argument's description on this page.*/ 
        describe: 'List all notes.',

        //The handler executes if the specified command is executed with the file.
        handler: () => {
            console.log('Listing note names.');
        }
    });

    yargs.command({
        command: 'add',
        describe: 'Adds a note.',

        //A parameter can be added to the handler to use option input.
        handler: options => {
            console.log('Adding a new note!');
            console.log('Title: ' + options.title);
        },

        //The builder property is used to specify the possible options for an argument.
        builder: {
            //In this case, title is the option. Syntax: '--title="Title"'
            title: {
                //Used for the --help command.
                describe: 'Title a note',
                //Makes sure the user includes the specified option.
                demandOption: true,
                //Specifies the input type.
                type: 'string'
            }
        }
    });

    //All 'yargs.command()' statements need to be parsed before they can work.
    yargs.parse();
}