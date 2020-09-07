const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require("path");
const multer  = require('multer')
const app = express()
const crypto = require('crypto')
const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const methodOverride = require('method-override')

const BuisnessModel = require('./models/businessModel')
const CommentModel = require('./models/commentModel')
const EmailModel = require('./models/emailModel')
const PostModel = require('./models/postModel')

const myPort = process.env.PORT || 3000

/*MiddleWare*/
app.use(cors())
app.use(bodyParser.json())



/* Set storage engine*/
const storage = multer.diskStorage({
	destination: './public/uploads/',
	filename: function(req, file, cb){
		cb(null, file.fieldname + '-' + Date.now() +
			path.extname(file.originalname))
	}
})

/*Init upload*/
const upload = multer({
	storage: storage
}).array('myImage' ,12)

/*Init gfs*/

let gfs


/*Connect to DB*/

if(myPort === 3000){
	const conn = mongoose.createConnection('mongodb://localhost/btb')

	conn.once('open',() => {
		console.log('Connection good')
		gfs = Grid(conn.db, mongoose.mongo)
		gfs.collection('uploads')
	}).on('error', (error) => {
		console.log(error)
	})


}


/*Routes*/
app.post('/submit', (req, res) => {
	upload(req, res, (err) => {
		console.log(req.body, req.files)
	})
	res.send('Thanks for the submission, all posts will be manually moderated before posting.')
})

app.put('/submit', (req, res) => {
	console.log(req.body)
	res.send('Success')
})

app.post('/email', (req, res) => {
	const { userName, phone, userAddress, email } = req.body
	const receivedEmail = new EmailModel({
		userName,
		phone,
		userAddress,
		email,
	})
	receivedEmail.save()
	.then(() =>{
		console.log(123)
		res.send('Thank you for contacting us, we will reach out ASAP')
	})
	.catch(err => res.status(400).send('There was an issue firing off that email, please try again.'))
})







app.listen(myPort, () => {
  console.log('SERVER RUNNING ON:', myPort);
})