pathnameFormatting();
httpsAPICalls();
requestAPICalls();

function pathnameFormatting() {
    /*encodeURIComponent() takes UTF-8 characters and modifies
      certain ones to adhere to URI syntax.*/
    console.log(encodeURIComponent('No Spaces Allowed in URIs'));

    //Two important file location variables:
    console.log(__dirname); //Absolute pathname of current file's directory.
    console.log(__filename); //Absolute pathname of current file.

    //The 'path' core module helps make use of these variables.
    //Think Java StringBuilder, but with path names.
    const path = require('path');

    console.log(path.join(__dirname, '..'));
    //Would print the absolute pathname of the current directory's parent.
}

function httpsAPICalls() {
    //The 'https' package is a core package in NodeJS, meaning it comes pre-installed.
    //This means it doesn't have to be installed and can just be passed into require.
    const https = require('https');

    //The url to make API calls from is required.
    const url = 'url';

    //The request to the url then is created and sent:
    const request = https.request(url, response => {
        let data = '';
        
        //For every data chunk received, it is added to the data string.
        //This is important because the data isn't received as one chunk.
        response.on('data', chunk => data += chunk.toString());

        //Once the data is finished receiving, the parsed JSON data is printed to the console.
        response.on('end', () => console.log(JSON.parse(data)));
    })
    
    //If any errors happen to the request, it can be caught outside of the request declaration.
    request.on('error', error => console.log('Error: ' + error));

    //The .end() function finishes sending the request.
    request.end();
}

//Download: 'npm i request'
function requestAPICalls() {
    //The 'request' package is a neat package that makes API calls easier to handle.
    const request = require('request');

    //URL for API calls.
    const url = 'url';

    /*The request function takes in an object specifying the details of the API call and
      a callback that executes with the results of the call. */
    request({url, json: true}, (error, {body}) => {    
        /*'json: true' means that the data will automatically be parsed into JSON. The 
          callback will be passed two parameters indicating error and response. If an error
          occurred, the response will be undefined. If the request was successful, the response
          will be returned. The main content of a response is in its body property, which 
          can be deconstructed in the parameter section of the callback function.*/
        
        //A callback could be used into the request to deal with the data.
        if (error) {
            console.log('Unable to connect to the API service!');
        } else if (body.error) {
            console.log('Possible request mistake');
        } else {
            console.log(body);
        }
    });
}