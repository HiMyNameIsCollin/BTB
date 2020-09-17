import React, { useEffect, useState } from 'react'
import Login from './Login'
import ContentCard from './ContentCard'

const Admin = ({ setMessage }) => {

	const [loggedIn, setLoggedIn] = useState(false)
	return(
		<React.Fragment>
			{
				loggedIn === false ?
				<Login setLoggedIn={setLoggedIn} setMessage={setMessage} /> : 
				<AdminControls setMessage={setMessage} /> 
			}
		</React.Fragment>
	)
}

const AdminControls = ({setMessage}) => {

	const [newPosts, setNewPosts] = useState([])

	useEffect(() => {
		fetch('https://btb-to.herokuapp.com/api/admin')
		.then(response => response.json())
		.then(response => setNewPosts(response))
	}, [])

	const deletePost = (e, _id) => {
		e.preventDefault()
		fetch(`https://btb-to.herokuapp.com/api/delete/${_id}`)
		.then(response => response.text())
		.then(response => {
			if(response === 'Success'){
				const adminPosts = [...newPosts]
				adminPosts.forEach((post, i) => {
					if(post._id === _id){
						adminPosts.splice(i, 1)
					}
				})
				setNewPosts(adminPosts)
			}
		})
		.catch(err => setMessage(err))
	}

	const approvePost = (e, _id, imageRefs, tag, notes) => {
		if(tag !== '--Choice--'){
			e.preventDefault()
			fetch('https://btb-to.herokuapp.com/api/approve', {
				method: 'put',
				headers: {'Content-Type' : 'application/json'}, 
				body: JSON.stringify({
					id: _id,
					imageRefs: imageRefs,
					tag: tag,
					notes: notes
				})
			})
			.then(response => response.text())
			.then(response => {
				if(response === 'Success'){
					const adminPosts = [...newPosts]
					adminPosts.forEach((post, i) => {
						if(post._id === _id){
							adminPosts.splice(i, 1)
						}
					})
					setNewPosts(adminPosts)
				}
			})
			.catch(err => setMessage(err))
		} else{
			setMessage('Forgot Tag')
		}
	}

	return(
		<div id='content-Feed'>
			
			{
			newPosts.map((post, i ) => {
			const { _id } = post
				return(
						<ContentCard post={post} type={'admin'} _id={_id} deletePost={deletePost} approvePost={approvePost}/>

				)
			})
			}
		</div>
	)
}

export default Admin