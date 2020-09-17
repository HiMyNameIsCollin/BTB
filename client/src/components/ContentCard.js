import React, { useState, useEffect, useRef } from 'react'
import CommentsWindow from  './CommentsWindow'
import titleCase from '../utils/titleCase'


const ContentCard = ({post, type, approvePost, deletePost, posts, setPosts, setMessage}) => {
	const {imageRefs, location, business, userName, body, date, comments,} = post

	const [openComments, setOpenComments] = useState(false)
	const [focusInput, setFocusInput] = useState(false)
	const [displayedImage, setImage] = useState(imageRefs[0])
	const [tag, setTag] = useState('--Choice--')
	const [notes, setNotes] = useState('')
	let selectRef = useRef()
	let notesRef = useRef()

	useEffect(() => {
		setImage(imageRefs[0])
	},[post, posts, imageRefs])


	return(
		<div className='contentCard'>
			<h1>
				{titleCase(business)}
			</h1>
			<div className='post-Image-Container'> 
				<p> {titleCase(business)} </p>
				<img src={`https://btb-to.herokuapp.com/api/img/${displayedImage}`} alt='Restaurant' />
			</div>
			{
				imageRefs.length > 1 ?
					<div className='post-Other-Images-Container'> 
					{
						imageRefs.map((r, i) => {
							if(displayedImage === r) {
								return(
								<div className='selected-Image' key={i}>
									<img onClick={()=> setImage(r)} src={`https://btb-to.herokuapp.com/api/img/${r}`} alt='piece of multimedia provided by user' />
								</div>
								 )								
							} else{
								return(
								<div key={i}>
									<img onClick={()=> setImage(r)} src={`https://btb-to.herokuapp.com/api/img/${r}`} alt='piece of multimedia provided by user' />
								</div>
								 )
							}
						})
					}
					</div>:
					null
			}
			<div className='post-Info'> 
				<p style={{fontSize: '.9em', fontWeight: '400'}}> {titleCase(location)} </p>
				<p> {date} </p>
			</div>
			<article className='post-Text'>
				<p>
				<span> {userName}</span>: {body}
				</p>
			</article>
			{
				type !== 'admin' && post.notes !== '' ?
			<div className='post-Editor-Notes'>
				<p><span>BTB Staff: </span> {post.notes} </p>
			</div> :
			null
			}
			{
				/* REMOVES META TAG AND REPLACES WITH EDITOR NOTES IN ADMIN MODE*/
				type === 'admin' ?
				<div style={{display: 'flex', flexDirection: 'column'}}>
				  <label style={{margin: '0 0.5em'}} forhtml="tag">Choose a tag:</label>
				  <select style={{margin: '0 0.5em', width: '50%'}} ref={selectRef} onChange={(e) => setTag(e.target.value)} id="tag" name="tag">
				  	<option value="--Choice--">--Choice--</option>
				    <option value="Rant">Rant</option>
				    <option value="Nasty">Nasty</option>
				    <option value="Scandalous">Scandalous</option>
				    <option value="PSA">PSA</option>
				    <option value="Scumbag">Scumbag Management / Owner</option>
				  </select> 
				  <label style={{margin: '0 0.5em'}} forhtml='notes'> Editors notes </label>
				  <textarea style={{margin: '.5em', height: '6em', width: 'auto'}} ref={notesRef} onChange={(e) => setNotes(e.target.value)} name='notes' id='notes'/>
				</div> :
				<div className='post-Meta'>
					<div className='meta-Button' style={{background: '#37393A', color: 'white'}}>
						<div className='meta-Icon meta-Tag'> </div>
						<p href=''>{post.tag} </p>
					</div>
					<div style={{cursor: 'pointer'}} className='meta-Button' onClick={() => {
							setOpenComments(true)
							setFocusInput(true)
							}
						}>
						<div className='meta-Icon meta-Comment'> </div>
						<p href=''>Comment </p>
					</div>
				</div>				
			}

			<CommentsWindow post={post} 
							comments={comments} 
							openComments={openComments} 
							focusInput={focusInput} 
							setFocusInput={setFocusInput} 
							posts={posts} 
							setPosts={setPosts}
							setMessage={setMessage}/>
			{
				/* REMOVES COMMENTS IF IN ADMIN MODE, REPLACES WITH ADMIN CONTROLS*/
				type==='admin' ?
				<div className='admin-Buttons'>
					<input onClick={(e) => deletePost(e, post._id)} type='button' value='Delete'/>
					<input onClick={(e) => {
						approvePost(e, post._id, imageRefs, tag, notes)
					}} type='button' value='Approve'/>
				</div> :
				<div className='post-Comment-Container' 
					onClick={()=> {
						if(openComments === false) {
							setOpenComments(true)
						} else {
							setOpenComments(false)
						}
					}}>
					<span className='post-Number-Comments'> {post.comments.length} comments </span>
					<div className='post-showMore-Container'>
						<span>{openComments === false ? "Show comments" : "Hide comments"}</span>
						<div className='post-ShowComments-Icon'> </div>
					</div>
				</div>

			}

		</div>
	)
}




export default ContentCard