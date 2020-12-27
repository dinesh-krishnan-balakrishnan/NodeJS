//The mongoDB package can be installed from the NPM. 
//Install: 'npm i mongodb'
const mongoDB = require('mongodb');
const MongoClient = mongoDB.MongoClient;

//The connection URl and database name are needed to connect to a Mongo database.
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager';

//First, a connection has to be made to server hosting the database.
MongoClient.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true}, 
    (error, client) => {
    if (error) return console.log(error);

    /*Once the connection is successful, a specific database must be connected to. A new
    one will be created if the database under the specified name doesn't exist. */
    const DB = client.db(databaseName);

    objectIDs();
    CRUD();
});

function objectIDs() {
    /*The mongoDB objectID class is used to create unique GUIDs, or
     "Globally Unique Object Modifiers" */
    const ObjectID = mongoDB.ObjectID;

    //New GUID
    const id = new ObjectID();

    //To display the GUID and its creation timestamp.
    console.log(id);
    console.log(id.getTimestamp());
    
    //Binary ID: (Original Version)
    console.log(id.id); //Length 12 bytes
    //String Representation of ID
    console.log(id.toHexString()); //Length 24 bytes

    /*If the user has a string representation of an id, 
    it can be recreated to the byte representation. */
    console.log(new ObjectID(id.toHexString()))
}

function CRUD() {
    id = new mongoDB.ObjectID();
    //CRUD Operations (Create, Read, Update, Delete)

    //Create
    //NOTE: 'users' is a collection within the database.
    DB.collection('users').insertOne({
        _id: id, //An ID can be manually set.
        name: 'Dinesh',
        age: 18
    }, (error, result) => {
        if (error) return console.log(error);
        //results.ops contains a description of the operation performed.
        console.log(result.ops); 
    });

    DB.collection('users').insertMany([{
        name: 'Binesh',
        age: 19
    }, {
        name: 'Rinesh',
        age: 20
    }], (error, result) => {
        if (error) return console.log(error);
        console.log(results.ops);
    });

    //Read
    DB.collection('users').findOne({
        _id: id
    }, (error, user) => {
        if (error) return console.log(error);
        console.log(user);
    });

    //.find() returns a cursor, which can be converted into many data types.
    DB.collection('users').find({ 
        age: 19 
    }).toArray((error, users) => { //Converted to an array
        console.log(users);
    });

    DB.collection('users').find({ 
        age: 19 
    }).count((error, count) => { //Converted to an integer, count of objects found.
        console.log(count);
    });

    //Update (Returns a Promise)
    DB.collection('users').updateOne({ //updateMany also exists.
        _id: id
    }, {
        $set: { //Sets a field to a new value.
            name: 'DANISH'
        },
        $inc: { //Increments a field by specified value.
            age: 3
        }
    }).then(
        result => console.log(result), 
        error => console.log(error));

    //Delete
    DB.collection('users').deleteOne({ //deleteMany also exists.
        _id: id
    }).then(
        result => console.log(result), 
        error => console.log(error));
}