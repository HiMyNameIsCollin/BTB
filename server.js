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
const { mongoose, AdminSchema, CommentSchema, EmailSchema, PostSchema } = require('./mongoose')

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


if(myPort === 3000){
	require('dotenv').config()
	conn = mongoose.createConnection(process.env.MONGODB_URI || process.env.BTBDBKEY , { useNewUrlParser: true, useUnifiedTopology: true})
	conn.once('open',() => {
		console.log('DB connected')
		gfs = Grid(conn.db, mongoose.mongo)
		gfs.collection('uploads')
		AdminModel = conn.model('admins', AdminSchema)
		PostModel = conn.model('posts', PostSchema)
		EmailModel = conn.model('emails', EmailSchema)
		CommentModel = conn.model('comments', CommentSchema)
	}).on('error', (error) => {
		console.log('db error', error)
	})
} else {
	conn = mongoose.createConnection(process.env.MONGODB_URI || process.env.BTBDBKEY, {useNewUrlParser: true, useUnifiedTopology: true})
	conn.once('open',() => {
		console.log('DB connected123')
		gfs = Grid(conn.db, mongoose.mongo)
		gfs.collection('uploads')
		AdminModel = conn.model('admins', AdminSchema)
		PostModel = conn.model('posts', PostSchema)
		EmailModel = conn.model('emails', EmailSchema)
		CommentModel = conn.model('comments', CommentSchema)
	}).on('error', (error) => {
		console.log('Db PRODO didnt connect', error)
	})
}


if(process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'))
	app.get('/', (req, res) => {
    	res.sendFile(path.resolve('client', 'build', 'index.html'))
  })
	app.get('/admin', (req, res) => {
    	res.sendFile(path.resolve('client', 'build', 'index.html'))
  })
	app.get('/restaurants', (req, res) => {
    	res.sendFile(path.resolve('client', 'build', 'index.html'))
  })
	app.get('/search', (req, res) => {
    	res.sendFile(path.resolve('client', 'build', 'index.html'))
  })
}




/* Set storage engine*/
var storage = new GridFsStorage({
  url: process.env.BTBDBKEY,
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

app.get('/api/posts', (req, res) => {
	PostModel.find({approved: true})
	.then(result => {
		let data = []
		result.map((post, i) => {
			data.unshift(post)
		})
		if(data.length <= 10){
			res.json(data)
		} else {
			const payload = data.slice(0, 10)
			res.json(payload)
		}
	})
	.catch(err => res.status(500).json({error: 'There was an error retreiving the posts'}))
})

app.get('/api/posts/:postsLength', (req, res) => {
	PostModel.find({approved: true}).then(result => {
		let data = []
		result.map((post, i) => {
			data.unshift(post)
		})
		if(data.length > req.params.postsLength){
			let difference = data.length - req.params.postsLength
			if(difference > 10) {
				data.splice(0, req.params.postsLength)
				const payload = data.slice(0, 10)
				res.json(data)
			} else {
				data.splice(0, req.params.postsLength)
				res.json(data)
			}
		} else {
			res.json({
				endOfPosts: true
			})
		}
	})
	.catch(err => res.status(500).json({error: 'There was an issue retrieving new posts'}))
})

app.get('/api/search/:query', (req, res) => {
	PostModel.find({approved: true, business: req.params.query.toLowerCase()}, (err, file) => {
		if(err || file.length === 0){
			res.status(500).json({err: err})
			return
		}
		let data = []
		file.map((post, i) => {
			data.unshift(post)
		})
		if(data.length <= 10){
			res.json(data)
		} else {
			const payload = data.slice(0, 10)
			res.json(payload)
		}
	})
})

app.post('/api/searchMore', (req, res) => {
	PostModel.find({approved: true, business: req.body.business}, (err, file) => {
		if(err || file.length === 0){
			res.status(500).json({error: err})
			return
		}
		let data = []
		file.map((post, i) => {
			data.unshift(post)
		})
		if(data.length > req.body.postsLength){
			let difference = data.length - req.body.postsLength
			if(difference > 10) {
				data.splice(0, req.body.postsLength)
				const payload = data.slice(0, 10)
				res.json(data)
			} else {
				data.splice(0, req.body.postsLength)
				res.json(data)
			}
		} else {
			res.json({
				endOfPosts: true
			})
		}
	})
})

app.get('/api/restaurants', (req, res) => {
	PostModel.find({approved: true}).then((result) => {
		let data = []
			result.map((r, i) => {
				let business = data.find((rest) => {
					return rest.business === r.business
				})
				if(business === undefined){
					data.unshift({
						business: r.business,
						posts: 1,
						locations: [r.location],
						image: r.imageRefs[0]
					})
				} else {
					let queriedLocation = business.locations.find((location) => {
						return location === r.location
					})
					if(queriedLocation === undefined){
						business.locations.unshift(r.location)
						business.posts++
					} else {
						business.posts++
					}
				}
			})
		res.json(data)
	})
	.catch(err => res.status(500).json({error: 'There was an error'}))
})

app.get('/api/img/:filename', (req, res) => {
	gfs.files.findOne({filename: req.params.filename})
	.then(file => {
		const readstream = gfs.createReadStream(file.filename)
		readstream.pipe(res)
	})
	.catch(err => res.json(err))

})

app.post('/api/login', (req, res) => {
	const { adminName, password } = req.body
	AdminModel.findOne({'adminName': adminName})
	.then((result) => {
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
	.catch(err => res.status(500).json({error: err}))
})

/* GET Un-approved posts*/
app.get('/api/admin', (req, res) => {
	PostModel.find({'approved': false})
	.then((result) => {
		res.json(result)
	})
	.catch(err => res.status(500).json({error: err}))
})


/* DELETE POST */
app.get('/api/delete/:post', (req, res) => {
	PostModel.findOneAndRemove({'_id': req.params.post}, (error, result) => {
		if(error){
			console.log('Cant find post', error)
			return
		}
		result.imageRefs.map((r, i) => {
			gfs.files.remove({filename: r} , (err, file) => {
				if(err){
					console.log('Theres been an error', err)
					return 
				}
			})
		})
	})
	.then(res.send('Success'))
	.catch(err => res.status(500).json({error: err}))
})

/* APPROVE POST */
app.put('/api/approve', (req, res) => {
	const { id, imageRefs, tag, notes } = req.body
	PostModel.findOneAndUpdate({'_id': id}, {'approved': true, 'tag': tag, 'notes': notes})
	.then(res.send('Success'))
	.catch(err => res.status(500).json({error: err}))
})

/* SUBMIT POST*/
app.post('/api/submit', (req, res) => {
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
		newPost.save()
		.then(res.send('Thanks for your submission, all posts are manually moderated before posting'))
		.catch(err => res.status(500).json({err: 'Unable to post at the moment, please try again' }))
	})
})

/*COMMENT ON POST*/
app.put('/api/comment', (req, res) => {
	const comment = {
			userName: req.body.userName,
			comment: req.body.comment,
			date: moment().format("MM-DD-YYYY")
		}
	PostModel.findOneAndUpdate({_id: req.body.id}, {$push: {comments: comment}}, {new: true})
	.then(result => res.json(result))
	.catch(err => res.status(500).json({err: 'Unable to post comment'}))

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
	.catch(err => res.status(500).json({error: 'There was an issue firing off that email, please try again.'}))
})







app.listen(myPort, () => {
  console.log('SERVER RUNNING ON:', myPort);
})