const {User, userSchema} = accessingMiddleware();
const bCrypt = hashingPasswords();
userLoginWithBcrypt();
const jwt = jsonWebTokens();
userAuthenticationExample();

function accessingMiddleware() {
  const Mongoose = require('mongoose');

  /*To be able to edit the schema for a model, it needs
      to be stored as a variable. */
  const userSchema = new Mongoose.Schema({
      name: {
          type: String,
          required: true
      },
      password: {
          type: String,
          required: true
      }, 
      //Array Syntax for a Field:
      tokens: [{
        token: {
          type: String,
          required: true
        }
      }]
  });

  //The schema can then be passed into the model constructor normally.
  const User = Mongoose.model('User', userSchema);

  /*.pre() and .post() can be used to execute code before and after
      schema code runs. A normal function is used instead of a callback
      because we use the 'this' keyword.*/
  userSchema.pre('save', async function (next) {
      const user = this;

      console.log('I am accessed before every save call!');

      //next() informs Mongoose to continue execution after the middleware is completed.
      next();
  })

  /* By modifying specifically the toJSON function, the data can be modified when
    converted to JSON. This is helpful when hiding private server data from the client.
    
    NOTE: The data has to be sent as JSON for toJSON() to work.
  */
  userSchema.methods.toJSON = function() {
    const user = this.toObject();

    delete user.password;
    delete user.tokens;

    return userObject;
  }

  return {User, userSchema};
}

/* The Rainbow Table Attack:
  Because users often reuse the same passwords for different accounts,
  hackers often target insecure password databases and test these
  passwords on other online services. As a result, it is important
  to prevent passwords from being accessed, which can be done through
  password hashing. 
  
  NOTE: An encrypted value can be decoded, but a hashed value cannot.
*/
async function hashingPasswords() {
    //Download: 'npm i bcryptjs'
    const bCrypt = require('bcryptjs');

    //To generate a hashed password:
    const password = 'example';
    //The 2nd parameter specifies how many times to hash a password.
    const hashedPassword = await bCrypt.hash(password, 8);

    console.log(password);
    console.log(hashedPassword);

    //Instead of comparing passwords, the hashed passwords can now be compared instead:
    const matching = await bCrypt.compare(password, hashedPassword);
    console.log(matching); //True

    return bCrypt;
}

// An example of how to use bCrypt to find the correct user.
function userLoginExample() {
  /*The schema statics object can be used to store custom made
    functions that can be accessed by a Mongoose model. */
  userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    if (!user) throw new Error('Unable to Login');

    const isMatch = await bCrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Unable to Login');

    return user;
  }
}

/* A JSON web token is a standard used to define a compact way to 
  securely transmit information between the client and the server.
  If a person has access to a token, they will have access to the
  associated account.
  
  Token Format: Header.Payload.Signature
  
  a.) Header: Usually consists of the type of token and signing
    algorithm being used.
      -EX: {"alg": "HS256", "typ": "JWT"}
      -Naturally, the token type is the JSON web token.

  b.) Payload: Contains claims, which are user-specific statements
    and additional data.
      -EX: { _id: 'exampleID', iat: 1589919338, exp: 1589926538 }
      - Payload contains the user ID, time of creation, and expiration time.

  c.) Signature: An encrypted string created from the header, payload, and a 
    secret string specified by the server. Verifies whether the header or 
    payload was changed before transmission.
  
*/
function jsonWebTokens() {
  //Download: 'npm i jsonwebtoken'
  const jwt = require('jsonwebtoken')

  //The token requires a user-specific identifier, from an email to '_id'.
  userID = {_id: 'exampleID'};
  //A secret is needed to encrypt the identifier.
  secret = 'DKTE04TDKKJ';

  /*The token should be passed in an 'expiresIn' attribute to determine
    how long it should last for user authentication. */
  const token = jwt.sign(userID, secret, {expiresIn: '2 hours'});

  /*The tokens can then be decrypted when sent from each client to the server. */
  const data = jwt.verify(token, secret);
  console.log(data);
}

function userAuthenticationExample() {
  //The schema methods object stores general methods used for the schema.
  userSchema.methods.generateAuthToken = async function () {
    const secret = '4sdoWOI4fnOEI';
    
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, secret);
    user.tokens = user.tokens.concat({ token });
    return token;
  }

  /*The JSON Web Token can then be used in the HTTP request header to authenticate 
    an user. It can be accessed by Express through the header or query:

    req.header('TokenKeyName'); 
    req.query.tokenkeyname

  */
}