/* DEFINITIONS:

    - ORM (Object Relational Mapper): Provides framework for accessing
        and modifying data within relational (SQL) databases.

    - ODM (Object Document Mapper): Provides framework for accessing
        and modifying data within non-relational (NoSQL) databases.

    - Mongoose: An ODM library for MongoDB and Node.js. It manages the
        relationship between data and provides schema validation.

    - Schema Validation: Ensures that data conforms to predefined rules. 
*/

//Install: 'npm i mongoose'
const Mongoose = require('mongoose');
const validator = require('validator');

databaseConnection();
documentCreationDeletion();

/* The User model will appear as a 'users' collection in the MongoDB database. This is because
    Mongoose turns the specified string into a lowercase format and pluralizes it. */
const User = Mongoose.model('User', Mongoose.Schema({
    name: {
        type: String,
        //'required' ensures that the document has the related field.
        required: true,
        //'trim' removes white space that appears before and after the content.
        trim: true
    },
    age: {
        type: Number,
        // If a value isn't specified, 'default' will provide the value instead.
        default: 0,
        /*Custom validators can be created; an error can be thrown if the field's input
            doesn't match up with certain requirements. */
        validate(value) { if (value < 0) throw new Error('Age must be a positive number'); }
    },
    email: {
        type: String,
        required: true,
        /*'unique' was just added to the schema. That said, the property will be ignored
            unless the database being used is deleted and reset. */
        unique: true,
        trim: true,
        //'lowercase' transforms the entire input into lowercase.
        lowercase: true,
        validate(value) { if (!validator.isEmail(value)) throw new Error('Invalid email.')}
    },
    password: {
        type: String,
        required: true,
        trim: true,
        //'minLength' requires that the input value has a minimum of X characters.
        minLength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password'))
                throw new Error('Invalid password.');
        }
    }
}, {
    /*Setting 'timestamps' to true will add the 'createdAt' and 'updatedAt' properties to
      each User instance. */
    timestamps: true
}));

function databaseConnection() {
    //The connection URl and database name are concatenated into a single string.
    const connectionURL = 'mongodb://127.0.0.1:27017/task-manager'

    /*The useCreateIndex property needs to be specified so that when Mongoose works with MongoDB, 
    indexes are created that allow for easier access to data.*/
    Mongoose.connect(connectionURL, {
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useCreateIndex: true
    });
}

function documentCreationDeletion() {
    //Creating a new user document.
    const me = new User({
        name: ' Dinesh',
        email: 'balakrishnan@gmail.com',
        password: 'DanishTheDinesh'
    });

    //Adding the document to the database.
    me.save().then(
        () => console.log(me),
        error => console.log(error)
    );

    //Removing the document from the database.
    me.remove().then (
        () => console.log('Removed!'),
        error => console.log(error)
    )
}

module.exports = {databaseConnection, User};