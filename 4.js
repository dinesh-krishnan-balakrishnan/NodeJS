/*Express is a very popular and minimalist web framework designed for building
  web applications and APIs through routing. Routing is the process of using
  the URL specified to direct users to the different content provided by a 
  server. */

//Download 'npm i express'
const Express = require('express');
const app = Express();

express();
expressRouters();
expressMiddleware();
handlebarsForExpress();

function express() {
    const path = require('path');
    const absolutePathname = path.join(__dirname, '../exampleDirectory');

    /*Static files are files that don't need to be altered before being sent to a user.
      It is possible to directly access these files by typing their relative pathname in a URL.

      EX: domain.com/index.html
      
      Files rendered through Express, such as HTML files, will use the static directory as the 
      default pathway. For example, if an HTML file has an image, the image will be searched
      for in the static directory rather than through relative pathways.
      */
    app.use(Express.static(absolutePathname));

    //Return values:
    app.get('', (req, res) => {
        //A string can be returned....
        res.send('Hello Express!');

        //So can HTML....
        res.send('<b>Hello Express!</b>');

        //HTML through a file...
        res.sendFile(path.join(__dirname, './index.html'));
        /*If a static directory is specified, Express will automatically search for the index.html
          file when loading the webpage without additional pathways. */

        //And so can JSON.
        res.send({name: Dinesh, age: 18});
    })

    // The below app.get request targets the 'help' pathway.
    app.get('/help', (req, res) => {
        res.send('EX: domain.com/help');
    })

    /*The '*' can target any pathname. It is helpful in order 
      to target URL pathnames that don't exist. */
    app.get('/help/*', (req, res) => res.send('404 Help Not Found'));
    app.get('*', (req, res) => res.send('404 Page Not Found'));

    //Once all specifications are set, app.listen is used to start the server.
    //The port can be specified. Default: 80 (HTTP), 443 (HTTPS)
    //An optional callback function can be run once the server is setup.
    app.listen(3000, () => console.log('Server is up on port 3000.'));
}

function expressRouters() {
  /*Another router can be created to target URL pathnames. This is
    especially helpful if the user wants to have route handlers
    (EX: router.get, router.post) in different files. */
  const router = new Express.Router();
  router.get('/about', (req, res) => res.send('This is the about page!'));
  module.exports = router;

  //To use the router in another file:
  const router = require('fileWithRouter.js');
  app.use(router);
}

function expressMiddleware() {
  /*To provide middleware for every Express route, a callback function can
    be passed into app.use(). */
  app.use((req, res, next) => {
    console.log('A request has been made!');

    //next() informs Express to continue execution after the middleware is completed.
    next();
  });

  /*To provide middleware for specific Express routes, a callback can be passed
    into the relevant Express HTTP routing methods. */
  app.get('/help', (req, res, next) => next(), (req, res) => console.log('Complete!'));
}

function handlebarsForExpress() {
    /*The Handlebars package is a very useful package, allowing for the 
      creation of dynamic pages based on the conditions of a page request.*/
    const hbs = require('hbs'); //Handlebars extension for 'express'.

    // To tell 'express' that Handlebars files exist:
    app.set('view engine', 'hbs');

    //By default, 'express' looks at the './views' folder for hbs files. To change this:
    const path = require('path');
    const viewsPath = path.join(__dirname, '../newViewsName');
    app.set('views', viewsPath); 

    app.get('', (req, res) => {
        /*Queries are key value pairs passed after a URL. A '?' indicates the 
          start of the query, while '&' separates each query. Query Syntax: 'key=value'. */
        if (!req.query.name) return res.send('You must pass in a name.');
        //'return' is used to stop the code in this case.

        /*When no pathname is specified, 'index.hbs' is rendered in this example.
          The object passed in is used to replace the key variables in the .hbs 
          file with their respective values. */
        res.render('index', {
            title: 'Example', // {{title}} -> Example
            name: req.query.name
        });
    })

    //Partials are Handlebars code snippets that can be used in other Handlebars files.
    const hbs = require('hbs'); //'hbs' is required to register partials.
    const partialsPath = path.join(__dirname, '../partials');
    hbs.registerPartials(partialsPath);

    /*After the partials directory has been configured, it can be used in any .hbs file. 
      SYNTAX: {{>partialFilename}} (No extension is required) */
}