const formData = require("express-form-data");
const express = require("express");
const os = require("os");
const cors = require('cors')

// const fileUpload = require('express-fileupload');


require('dotenv').config();

const port = 3000

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const app = express()

app.use(cors())
app.use(express.json());
// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(express.static('uploads'))

/* 
const options = {
    uploadDir: os.tmpdir(),
    autoClean: true
};

// parse data with connect-multiparty. 
app.use(formData.parse(options));
// delete from the request all empty files (size == 0)
app.use(formData.format());
// change the file objects to fs.ReadStream 
app.use(formData.stream());
// union the body and the files
app.use(formData.union());
 */

// app.use(fileUpload());

const TaskSchema = new Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    name : {
        type: String
    }
});

const Tasks = mongoose.model('Task', TaskSchema);

const token = process.env.token;

//Set up default mongoose connection
const mongoDBConnectionUrl = process.env.mongo_url + '/' + process.env.db_name || null;
console.log('mongoDBConnectionUrl : ', mongoDBConnectionUrl)
mongoose.connect(mongoDBConnectionUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then((res) => {
    console.log('connected to tasks db')
});

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/** API path that will upload the files */
// app.post('/upload-image', function (req, res) {
//     console.log('req***** : ', req)
//     console.log('req file***** : ', req.files)
//     let sampleFile;
//     let uploadPath;

//     if (!req.files || Object.keys(req.files).length === 0) {
//         return res.status(400).send('No files were uploaded.');
//     }

//     // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
//     sampleFile = req.files.profile_picture;
//     console.log('__dirname : ', __dirname)
//     uploadPath = __dirname + '/src/assets/' + sampleFile.name;

//     console.log('uploadPath : ', uploadPath)

//     // Use the mv() method to place the file somewhere on your server
//     sampleFile.mv(uploadPath, function (err) {
//         if (err) {
//             console.log('error in upload path : ', err)
//             return res.status(500).send(err);
//         }
//         res.send('File uploaded!');
//     });
// });

// This API adds new user to database
app.post('/add', (req, res) => {
    console.log('/add post api : req : ', req.body)
    Tasks.findOne({ username: req.body.username, password: req.body.password }, (err, data) => {
        if (err) {
            console.log(err)
            res.send({ err: 'Error in /get-task API' })
        }
        else {
            if (data === null) {
                const newTask = new Tasks(req.body);
                newTask.save(function (err, result) {
                    if (err) {
                        console.log('/add /get-task errrrror in addd API err : ', err)
                    } else {
                        console.log('Saved to tasks db : result : ', result)
                        res.send({ data: 'Task saved!' })
                    }
                });
            } else {
                res.send({ error: 'Task Already Exists!' })
            }
        }
    });
})

app.post('/get-task', (req, res) => {
    console.log('/get-task req.body : ', req.body)
    Tasks.findOne(req.body, (err, data) => {
        if (err) {
            console.log('/get-task : err : ', err)
            res.send(err)
        }
        else {
            console.log('/get-task data : ', data)
            let access_token;
            if (data && data._id) {
                access_token = { access_token: token + data._id }
            } else {
                access_token = { access_token: null }
            }
            console.log('access_token : ', access_token)
            res.send(access_token)
        }
    });
})

app.get('/all', (req, res) => {
    Tasks.find((err, data) => {
        if (err) {
            console.log('errrrror in all API, err : ', err)
        }
        else {
            console.log(data)
            res.send(data)
        }
    })
})

app.post('/update-one', (req, res) => {
    console.log('update-one****** req.body._id : ', req.body._id)
    Tasks.findByIdAndUpdate(req.body._id,
        {
            username: req.body.username,
            password: req.body.password,
            name: req.body.name
        }, function (err, data) {
            if (err) {
                console.log('Error in updating task')
                res.send(err)
            } else {
                res.send(data)
            }
        });
})

app.post('/delete-one', (req, res) => {
    console.log('delete-one req.body._id : ', req.body._id)
    Tasks.findByIdAndRemove(req.body._id, function (err, data) {
        if (err) {
            res.send(err)
        } else {
            res.send(data)
        }
    });
})

app.post('/delete-all', (req, res) => {
    Tasks.deleteMany({}, (err, data) => {
        if (err) {
            console.log('errrrror in delete-all API, Failed to load collection: err : ', err)
        }
        else {
            console.log(data)
            res.send(data)
        }
    })
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})