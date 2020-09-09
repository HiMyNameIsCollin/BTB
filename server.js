const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require("path");
const multer  = require('multer')
const app = express()
const crypto = require('crypto')
const moment = require('moment')
const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const methodOverride = require('method-override')
const { mongoose, AdminSchema, BusinessSchema, CommentSchema, EmailSchema, PostSchema } = require('./mongoose')

const myPort = process.env.PORT || 3000

/*MiddleWare*/
app.use(cors())
app.use(bodyParser.json())


/*Init gfs*/
let gfs


/*Connect to DB*/
let conn

/* Set Models*/
let AdminModel
let PostModel
let EmailModel
let CommentModel
let BusinessModel


if(myPort === 3000){
	conn = mongoose.createConnection('mongodb://localhost/btb')
	conn.once('open',() => {
		gfs = Grid(conn.db, mongoose.mongo)
		gfs.collection('uploads')
		AdminModel = conn.model('admin', AdminSchema)
		PostModel = conn.model('post', PostSchema)
		EmailModel = conn.model('email', EmailSchema)
		CommentModel = conn.model('comment', CommentSchema)
		BusinessModel = conn.model('business', BusinessSchema)
	}).on('error', (error) => {
		console.log(error)
	})

}





/* Set storage engine*/
var storage = new GridFsStorage({
  url: 'mongodb://localhost/btb',
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});

/*Init upload*/
const upload = multer({
	storage: storage
}).array('myImage' ,12)



/*Routes*/

app.get('/posts', (req, res) => {
	PostModel.find({approved: true}).then(result => {
		res.json(result)
	})
	.catch(err => console.log(err))
})

app.get('/img/:filename', (req, res) => {
	gfs.files.findOne({filename: req.params.filename}, (err, file) => {
		const readstream = gfs.createReadStream(file.filename)
		readstream.pipe(res)
	})

})

app.put('/login', (req, res) => {
	const { adminName, password } = req.body
	AdminModel.findOne({'adminName': adminName}).then((result) => {
		if(result !== null) {
			if(result.password === password){
				res.send('Success')
			} else {
				res.send('Incorrect credidentals')
			}	
		} else {
			res.send('Incorrect credidentals')
		}

	})
})

/* GET Un-approved posts*/
app.get('/admin', (req, res) => {
	PostModel.find({'approved': false}).then((result) => {
		res.json(result)
	})
})

/* DELETE POST */
app.get('/delete/:post', (req, res) => {
	console.log(req.params.post)
	PostModel.findOneAndDelete({'_id': req.params.post})
	.then(result => {
		result.imageRefs.map((r, i) => {
			gfs.deleteOne({filename: r})
		})
	}).then(res.send('Success'))
})

/* APPROVE POST */
app.put('/approve', (req, res) => {
	const { id, imageRefs } = req.body
	PostModel.findOneAndUpdate({'_id': id}, {'approved': true})
	.then(res.send('Success'))
})

/* SUBMIT POST*/
app.post('/submit', (req, res) => {
	console.log(123)
	upload(req, res, (err) => {
		let imageRefs = []
		req.files.forEach((file, i) => {
			imageRefs.push(file.filename)
		})
		const newPost = new PostModel({
			business: req.body.business.toLowerCase(),
			location: req.body.location.toLowerCase(),
			userName: req.body.userName === '' ? 'Anonymous' : req.body.userName,
			email: req.body.email,
			title: req.body.title,
			body: req.body.body,
			date: moment().format("MM-DD-YYYY"),
			imageRefs: imageRefs,
			comments: [],
			approved: false
		})
		BusinessModel.findOneAndUpdate({business: req.body.business.toLowerCase()}, {$push: {posts: newPost}})
		.then((result) => {
			if(result !== null) {
				newPost.save()
				.then(res.send('Thanks for your submission, all posts are manually moderated before posting'))
				.catch(err => console.log(err))
			} else {
				const newBusiness = new BusinessModel({
					business: req.body.business.toLowerCase(),
					location: req.body.location.toLowerCase(),
					posts: [newPost]
				})
				newBusiness.save()
				.then(newPost.save())
				.then(res.send('Thanks for your submission, all posts are manually moderated before posting'))
				.catch(err => console.log(err))
			}
		})
	})
})

/*COMMENT ON POST*/
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