import React,{ useEffect, useReducer, useRef} from 'react'
import titleCase from '../utils/titleCase'

const initialState = {
	userName: '',
	comment: ''
}

function reducer (state, {field, value}) {
	return{
		...state,
		[field]: value
	}
}

const CommentsWindow = ({post, openComments, focusInput, setFocusInput, comments, posts, setPosts, setMessage}) => {

	const commentsContainerRef = useRef()
	const commentInputRef = useRef()

	const [state, dispatch] = useReducer(reducer, initialState)

	const { userName, comment } = state

	const onChange = (e) => {
		dispatch({ field: e.target.name, value: e.target.value})
	}

	useEffect(() => {
		if(openComments === true) {
			commentsContainerRef.current.classList.add('comments-Window-Open')
			} else {
			commentsContainerRef.current.classList.remove('comments-Window-Open')
		}
	}, [openComments])

	useEffect(() => {
		if(focusInput === true) {
			commentInputRef.current.focus()
			document.addEventListener('click', function handler(e){
				if(e.target !== commentInputRef) {
					setFocusInput(false)
					document.removeEventListener('click', handler)
				} 
			})
		}
	}, [focusInput, setFocusInput])

	const submitComment = (e) => {
		e.preventDefault()
		fetch('http://localhost:3000/comment', {
			method: 'put',
			headers: { 'Content-Type' : 'application/json'},
			body: JSON.stringify({
				userName,
				comment,
				id: post._id
			})
		})
		.then(response => response.json())
		.then(response => {
			let newState = [...posts]
			newState.forEach((p, i) => {
				if(p._id === response._id){
					p.comments = response.comments
				}
			})
			setMessage('Thank you for participating')
			setPosts(posts => posts = newState)
			return
		})
		.catch(err => console.log(err))
	}


	return(
		<div ref={commentsContainerRef} className='comments-Window'>
			{
				comments.map((comment, i)=> {
					return <CommentsCard comment={comment} key={i} />
				})
			}
			<form className='comments-Form' onSubmit={submitComment}> 
				<label htmlFor='userName'> Name: </label>
				<span>
					*Not required
				</span>
				<input onChange={onChange} className='comment-Name-Input' style={{width: '50%'}} name='userName' type='text'/>
				<label style={{marginBottom: '0.7em', paddingTop: '1em'}} htmlFor='comment'> Your comment: </label>
				<textarea onChange={onChange} ref={commentInputRef} name='comment'/>
				<input onClick={submitComment} className='comment-Submit-Button' style={{width: '50%', margin: '1em auto auto auto', cursor: 'pointer'}} type='submit' value='Submit'/>
			</form>
		</div>
	)
}

const CommentsCard = ({order, comment}) => {
		return(
			<div className='comments-Card'>
				<div>
					<span className='comments-UserName'> { comment.userName === '' ? 'Anonymous' : titleCase(comment.userName)} </span>
					<span className='comments-Time'> {comment.date}</span>
				</div>
				<p> {comment.comment}  </p>
			</div> 
		)
}

export default CommentsWindow