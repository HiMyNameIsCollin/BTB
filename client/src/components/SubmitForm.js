import React, { useState, useReducer } from 'react'

const initialState = {
	userName: '',
	email: '',
	business: '',
	location: '',
	body: ''
}

function reducer (state, {field, value}) {
	return{
		...state,
		[field]: value
	}
}

const SubmitForm = ({Link, setMessage, setUserInteract}) => {

	const [state, dispatch] = useReducer(reducer, initialState)
	const [termsAccepted, setTermsAccepted] = useState(false)
	const [formSubmitted, submitForm] = useState(false)

	const { userName, email, business, location, body } = state

	const handleFormSubmit = (e) => {
		e.preventDefault()
		if(formSubmitted === false){
			const emptyFields = document.getElementsByClassName('required')
			const imgInput = document.getElementById('img-Input')
			const emptyArray = Object.values(emptyFields)
			if(imgInput.files[0] !== undefined && business !== '' && location !== '' && body !== '' && termsAccepted){
				submitForm(true)
				emptyArray.forEach((ele, i) => {
					ele.classList.remove('required-Missed')
				})
				const formElem = document.getElementById('submissionForm')
				fetch('https://btb-to.herokuapp.com/api/submit', {
					method: 'post',
					body: new FormData(formElem)
				})
				.then(result => result.text())
				.then(result => {
					setMessage(result)
					setUserInteract(undefined)
					})
				.catch(err => {
					setMessage('There seems to be an error')
					submitForm(false)
				})
			} else {
				console.log(321)
				emptyArray.forEach((ele, i ) => {
					if(ele.type === 'text'){
						if(ele.value === ''){
							ele.classList.add('required-Missed')
						} else {
							ele.classList.remove('required-Missed')
						}
					} else if (ele.type === 'file') {
						if(ele.files.length === 0) {
							ele.classList.add('required-Missed')
						} else {
							if(imgInput.files.length > 5){
								ele.classList.add('required-Missed')
							} else {
								ele.classList.remove('required-Missed')
							}
						}
					} else if(ele.type === 'radio'){
						if(ele.checked === false){
							ele.classList.add('required-Missed')
						} else {
							ele.classList.remove('required-Missed')
						}
					} else {
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

	const onChange = (e) => {
		dispatch({ field: e.target.name, value: e.target.value})
	}


	return(
		<form id='submissionForm' onSubmit={handleFormSubmit} post='post' encType="multipart/form-data">
			<div className='submission-Form-Group'>
				<label htmlFor='name'> Your name</label>
				<input type='text' name='userName' value={userName} onChange={onChange} /> 
			</div>
			<div className='submission-Form-Group'>
				<label htmlFor='email'> Your email</label>
				<input type='text' name='email' value={email}  onChange={onChange}/> 
			</div>
			<div className='submission-Form-Group'>
				<label htmlFor='business' > Name of business </label>
				<input className='required' type='text' name='business' value={business} onChange={onChange} required/>
				<span> * Required </span>
			</div>
			<div className='submission-Form-Group'>
				<label htmlFor='location'> Location </label>
				<input className='required' type='text' name='location' value={location} onChange={onChange} required/> 
				<span> * Required </span>
			</div>
			<div className='submission-Form-Group' style={{width: '100%'}}>
				<label htmlFor='body'> Whats the story? </label>
				<textarea name='body' className='required' value={body}  onChange={onChange} required/>
				<span> * Required </span>
			</div>
			<div className='submission-Image-Group'>
				<label htmlFor='myImage'> Add photo(s) <span style={{position: 'relative'}}> Max: 5</span></label>
				<input name='myImage' id='img-Input' className='submission-Image-Submit required' type='file' accept="image/*" multiple required/>
				<span> * Required </span>
			</div>
			<div className='submission-Image-Group' style={{flexDirection: 'row'}}>
				<input className='required' onClick={()=> setTermsAccepted(!termsAccepted)} type='radio' style={{marginRight: '1em'}}/>
				<p> By checking this checkbox, I hereby indicate that I have read and understood and agree to be bound by <Link to='/terms'> Behind the Bars' Terms of Service.</Link> </p>
			</div>
			<input className='submission-Submit' type='Submit' defaultValue='Submit' onClick={handleFormSubmit}/>
		</form>
	)
}

export default SubmitForm