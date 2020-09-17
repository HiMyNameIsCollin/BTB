import React, {useEffect} from 'react'

const MessageOverlay = ({message, setMessage}) => {

	useEffect(() => {
		document.getElementById('messageOverlay').addEventListener('click', function closeMessage(e){
			setMessage(undefined)
		})
	})

	return(
		<div id='messageOverlay'>
			<div id='admin-Message'>
				<p> {message} </p>
			</div>
		</div>
	)
}

export default MessageOverlay