/*RESTful API (RESTful API) allows clients such as a web server 
    to access and manipulate resources using a set of predefined 
    options, these options usually being HTTP requests. */

/* Structure of HTTP Requests & Responses:

    a.) Request Line: Contains the HTTP method being used, the path, and the HTTP protocol.
        - EX: POST /tasks HTTP/1.1
        - 'POST' is the HTTP method, '/tasks' is the path, and 'HTTP/1.1' is the HTTP protocol.
        - Query parameters would also be specified through the request line.

    b.) Request Header(s): Key-Value pairs that attach metadata to a request.
        - EX: 
              Accept: application/json
              Connection: Keep-Alive
        - The 'accept' request header is stating that the request will accept a JSON response, 
          while the 'connection' request header is informing the server to keep the connection 
          alive after the current request is completed.

    c.) Empty Line: Separates the request headers from the response body.

    d.) Request/Response Body: The actual data related to performing the request/response.
        - EX: {"description": "order new drill bits"}
        - If the POST HTTP method was being used, this data would most likely be added to 
          the responding server's database. 
*/

//HTTP Status Codes Reference: 'httpstatuses.com'

//Imports & Setting up Database
const Mongoose = require('mongoose');
const Express = require('express');
const app = Express();
const {databaseConnection, User} = require('./6.js');
databaseConnection();

//'express.json()' is used to treat the request body from a client as JSON.
app.use(express.json());

//CRUD Operation: Create | HTTP Method: POST
app.post('/users', async (req, res) => {
    // 'req.body' is the request body.
    const user = new User(req.body);

    try {
        await user.save();
        //The 201 status represents 'Created'.
        res.status(201).send(user);
    } catch (error) {
        //The 400 status represents 'Bad Request'.
        res.status(400).send(error);
    }
});

//CRUD Operation: Read | HTTP Method: GET
//All Users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        //The 500 status represents 'Server Error'.
        res.status(500).send();
    }
})

//One User
app.get('/users/:id', async (req, res) => {
    //:id is a parameter that can be accessed through 'req.params'
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);

        if (!user) {
            //The 404 status represents 'Not Available'.
            return res.status(404).send();
        }

        res.send(user);
    } catch (error) {
        res.status(500).send();
    }
});

//CRUD Operation: Update | HTTP Method: PATCH
app.patch('/users/:id', async (req, res) => {
    //Checks whether the updates being made are allowed by the user.
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'age', 'email', 'password'];
    if (!updates.every(update => allowedUpdates.includes(update))) {
        return res.status(400).send({error: 'Invalid Updates!'});
    }

    try {
        const user = await User.findById(req.params.id);
        updates.forEach(update => user[update] = req.body[update]);
        await user.save();

        if (!user) {
            return res.status(404).send();
        }
        res.send(user);

    } catch (error) {
        res.status(400).send();
    }
});

//CRUD Operation: Delete | HTTP Method: DELETE
app.delete('/users/:id', async (req, res) => {
    try {
        const user = findByIDAndDelete(req.params.id);

        if (!user) {
            return res.status(404).send();
        }
        res.send(user);

    } catch(error) {
        res.status(500).send();
    }
});