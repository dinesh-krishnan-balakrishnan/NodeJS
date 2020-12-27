/* Jest is a test framework developed by Facebook that aims
    to making testing as simple as possible. 

    Jest can be run with the 'jest' command. The '--watch' flag
    can be specified so that Jest reruns related tests when a file
    changes. The '--runInBand' flag makes sure that tests in different
    files are run as processes and not pooled together.

    To have a file recognized by Jest, it needs to have the following extension:
    <File Name>.test.js

    Additionally, Jest defaults to treating the testing environment as ECMAScript JS.
    This can be changed in package.json by adding:
    "jest": { "testEnvironment": "node" }

    When testing with Jest, the developer may not want some methods to have their standard 
    functionality. For example, the developer might have a send method that is connected
    to an API that takes away from total possible requests in a month. As a result, Jest
    allows them to create Mockup Functions.
    
    Steps To Create Mockup Functions:
    1. Create a '__mocks__' sub-directory in the same directory as the test cases.
    2. Create a file for the package wanted by specifying: '<Package Name>.js'
    3. Create the mockup functions, making sure to specify the same method name as the 
        one that needs to be placed.
    4. Export the mockup functions.
*/

//Download: 'npm i jest'
const test = require('jest');

// "jest": { "testEnvironment": "node" }
// __mocks__ mocking libraries

// The beforeEach()/afterEach() function runs before/after each test case.
beforeEach(() => console.log('I run before the test cases!'));
afterEach(() => console.log('I run after the test cases!'));

//A test will default to returning a success case.
test('Hello World!', () => {});

test('This should fail!', () => {
    //A test will fail if an error is thrown:   
    //throw new Error('Failure!');

    /*The expect() function with its various comparator methods 
        will return an error in the background if the values don't
        meet the specified requirements. */
    expect(1).toBe(2);
})

test('Few Comparator Methods', () => {
    //Not Operator:
    expect(1).not.toBe(2);

    /*.toBe() uses the '===' operator, so objects need to 
        be compared with .toMatchObject() */
    expect({ name: 'Dinesh' }).toMatchObject({ name: 'Zebra' });

    // .toEqual() performs a deep comparison and additionally matches the property values.
    expect({ name: 'Dinesh' }).toMatchObject({ name: 'Dinesh' });

    //.any() matches any object created with the specified constructor:
    expect({ name: 'Dinesh' }).toEqual(expect.any(constructor));
    //'constructor()' is the default constructor for JS objects.
})

/*Asynchronous code can tested normally by using async/await, or through a
    Jest callback parameter. NOTE: A parameter is specified*/
test('Asynchronous', complete => {
    let sum = await add(2, 3);
    expect(add).toBe(5);
});

//Download: 'npm i supertest'
const request = require('supertest');
const App = require('./exampleRoutingFile.js');

/* 'supertest' is a framework created by the developers of Express. It is used
    to test Express applications. */
test('Express', async () => {
    //Requests can be made to the Express application.
    await request(App)
        //The HTML method and pathway are specified.
        .post('/users')
        //.set() configures the request header(s).
        .set('Time', 'central')
        .attach('avatar', './example_image.jpg')
        //.send() configures the request body.
        .send({
            name: 'Dinesh',
            password: 'password'
        })
        /* The expect() method can be used to verify many parts of HTTP response.
            In this specific instance, expect() verifies the response code. */
        .expect(201)
});

test('Express2', async () => {
    const response = await request(App)
        .post('/avatar')
        //.attach() is used to send files.
        .attach('avatar', './example_image.jpg')
        .expect(200);

    //Expects the response body to have two items.
    expect(response.body.length).toEqual(2);
})