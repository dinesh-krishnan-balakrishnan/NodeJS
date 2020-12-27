/*Multer is an API provided by the developers of Express
  to allow for the transfer of files to and from a server
  using Express routing. 
*/

//Download: 'npm i multer'
const multer = require('multer');

//Sharp is a useful API that can be used for standardizing images received.
//Download 'npm i sharp'
const sharp = require('sharp');

const Express = require('express');
const app = Express();
const Mongoose = require('mongoose');

const User = fileFields();
receivingFiles();
sendingFiles();


function fileFields() {
    /*Files can be stored as field in an User document by specifying 
      them as type Buffer. */
    const User = Mongoose.model({
        name: {
            type: String,
            required: true
        }, 
        profilePic: {
            type: Buffer
        }
    });

    return User;
}

function receivingFiles() {
    /*The upload variable is being assigned Express middleware
    that interprets the input being received as a file. */
    const upload = multer({
        /*The file can be stored in an automatically in a specified directory 
        if needed by using the destination attribute:

        dest: 'images'

        This shouldn't be specified if the file needs to be passed into the 
        Express router's callback function. */

        //The file-size is being limited to 1 MB.
        limits: {
            fileSize: 1000000
        },

        //fileFilter is used to accept only image files.
        fileFilter(req, file, ch) {
            //file.originalname contains the file-name defined by the client.
            if (!file.originalname.match(/\.jpg$/)) {
                //cb() is used for Error responses.
                return cb(new Error('Please upload a PDF file'));
            }

            /*cb(undefined, true) will quietly accept the input file
            provided and continue running the Express code. */
            cb(undefined, true);
        }
    });

    //The single() method can then be used as Express middleware to accept a single file input.
    app.post('/send', upload.single('image'), (req, res) => {
        //The buffer can only be accessed if the destination isn't specified in the multer.
        req.user.profilePic = sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer();
        
        await req.user.save();

        res.send('The file has been uploaded!')
    }, 
    //An error callback function can be passed in to handle uncaught errors.
    (error, req, res, next) => {
        res.status(400).send('Error uploading file!');
    });
}

function sendingFiles() {
    //Sending a file simply involves changing the metadata that specifies the content type.
    app.get('/users/:id', (req, res) => {
        const user = User.findById(req.params.id);

        /*Setting the content type to image/jpg will help the client understand the 
        type of data it is receiving from the server. */
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    });
}