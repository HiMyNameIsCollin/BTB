import React, {useReducer} from 'react'

const initialState = {
	adminName: '',
	password: ''
}

function reducer (state, {field, value}) {
	return{
		...state,
		[field]: value
	}
}

const Login = ({ setLoggedIn, setMessage }) => {

	const [state, dispatch] = useReducer(reducer, initialState)

	const { adminName, password } = state

	const onChange = (e) => {
		dispatch({ field: e.target.name, value: e.target.value})
	}

	const handleLogin = (e) => {
		e.preventDefault()
		fetch('http://localhost:3000/login', {
			method: 'put',
			headers: {'Content-Type' : 'application/json'},
			body: JSON.stringify({
				adminName,
				password,
			})
		})
		.then(result => result.text())
		.then(result => {
			if(result === 'Success'){
				setLoggedIn(true)
			} else {
				setMessage(result)
			}
		})
		.catch(err => setMessage('There has been an error'))
	}

	return(
		<div id='login'>
			<form onSubmit={handleLogin}>
				<label htmlFor='adminName'> Name </label>
				<input type='text' onChange={onChange} name='adminName' />
				<label htmlFor='password'> Password </label>
				<input type='password' onChange={onChange} name='password' />
				<input onClick={handleLogin} type='button' value='Login' />
			</form>
		</div>
	)
}

export default Login