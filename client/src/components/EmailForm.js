import React, { useReducer, useState } from 'react'

const initialState = {
	userName: '',
	phone: '',
	email: '',
	userAddress: ''
}

function reducer (state, {field, value}) {
	return{
		...state,
		[field]: value
	}
}

const EmailForm = ({message, setMessage, setUserInteract}) => {

	const [formSubmitted, submitForm] = useState(false)

	const [state, dispatch] = useReducer(reducer, initialState)

	const { userName, phone, email, userAddress } = state

	const onChange = (e) => {
		dispatch({ field: e.target.name, value: e.target.value})
	}

	const handleEmailSubmit = (e) => {
		e.preventDefault()
		if(formSubmitted === false){
		submitForm(true)
		const emptyFields = document.getElementsByClassName('required')
		const emptyArray = Object.values(emptyFields)
		if(userName !== '' && phone !== '' && email !== '' && userAddress !== ''){
			emptyArray.forEach((ele, i) => {
				ele.classList.remove('required-Missed')
			})
			fetch('https://btb-to.herokuapp.com/email', {
				method: 'post',
				headers: { 'Content-Type' : 'application/json'},
				body: JSON.stringify({
					userName,
					phone,
					userAddress,
					email,
				})
			})
			.then(response => response.text())
			.then(response => {
				setMessage(response)
				setUserInteract(undefined)
			})
			.catch(err => setMessage(err))
		} else {
			emptyArray.forEach((ele, i ) => {
				if(ele.type === 'text'){
					if(ele.value === ''){
						ele.classList.add('required-Missed')
					} else {
						ele.classList.remove('required-Missed')
					}
				}else {
					if(ele.value === ''){
						ele.classList.add('required-Missed')
					} else {
						ele.classList.remove('required-Missed')
					}
				}
			})
		}		
		}


	}

	return(
		<form id='emailForm' onSubmit={handleEmailSubmit} post='post' style={{flexDirection: 'column'}} >
			<div className='submission-Form-Group'>
				<label htmlFor='userName'> Your name</label>
				<input className ='required' type='text' name='userName' value={userName} onChange={onChange} /> 
			</div>
			<div className='submission-Form-Group'>
				<label htmlFor='phone'> Your phone number </label>
				<input className ='required' type='text' name='phone' value={phone}  onChange={onChange}/> 
			</div>
			<div className='submission-Form-Group'>
				<label htmlFor='userAddress'> Your email</label>
				<input className ='required' type='text' name='userAddress' value={userAddress}  onChange={onChange}/> 
			</div>
			<div className='submission-Form-Group' style={{width: '100%'}}>
				<label htmlFor='email'> Your concerns </label>
				<textarea style={{minHeight: '4em'}} className='required' name='email' value={email}  onChange={onChange} required/>
			</div>
			<input className='submission-Submit' type='Submit' value='Submit' onClick={handleEmailSubmit}/>
		</form>
	)
}

export default EmailForm