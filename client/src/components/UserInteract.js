import React from 'react'
import SubmitForm from './SubmitForm'
import EmailForm from './EmailForm'

const UserInteract = ({ userInteract, setUserInteract, Link, message, setMessage }) => {
	return(
		<div id='userInteract'>
			<span onClick={() => setUserInteract(undefined)}> X </span>
			{
				userInteract === 'submit' ?
				<SubmitForm Link={Link} setMessage={setMessage} setUserInteract={setUserInteract}/> :
				userInteract === 'email' ?
				<EmailForm message={message} setMessage={setMessage} setUserInteract={setUserInteract}/> :
				null
			}
		</div>
	)
}

export default UserInteract