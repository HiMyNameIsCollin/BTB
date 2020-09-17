 import React from 'react'
import useDidMountEffect from '../hooks/useDidMountEffect'
import image from '../assets/BTB.png'
import { useHistory } from "react-router-dom"


const Header = ({navOpen, setNav, Link, setUserInteract, searchInput, setSearchInput}) => {

	const history = useHistory()

	useDidMountEffect(() => {
		const hamNav = document.getElementById('hamNav')
		if(navOpen === true) {
			hamNav.classList.add('hamOpen')
			hamNav.classList.remove('hamClose')
		} else {
			hamNav.classList.add('hamClose')
			hamNav.classList.remove('hamOpen')
		}
	}, [navOpen])

	const handleInputEvents = () => {
		const headerSearch = document.getElementById('header-Search')
		setSearchInput('')
		window.addEventListener('keydown', function listenForEnter(e) {
			if(e.keyCode === 13){
				history.push('/search')
				window.removeEventListener('keydown', listenForEnter)
			}
		})
		headerSearch.addEventListener('focusout', function listenForFocusOut(e){
			headerSearch.removeEventListener('focusout', listenForFocusOut)
			window.removeEventListener('keydown', listenForFocusOut)
		})
	}


	return(
		<div id='header'>
			<div className='header-Btn' onClick={()=> setNav(!navOpen)} id='hamNav'> </div>
			<Link to='/' onClick={() => setUserInteract(undefined)} style={{height: '100%', display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'black'}}>
				<img src={image} alt='Behind the bar logo'/>
				<span id='logo-Text'> Behind the bar </span>
			</Link>
			<input id='header-Search' onChange={(e) => {
				setSearchInput(e.target.value)
				}} onClick={handleInputEvents} type='text' value={searchInput} />
			<div onClick={() => history.push('/search')} style={{margin: 'auto 0 auto 0'}} className='header-Btn' id='search-Icon'> </div>
			<div onClick={() => setUserInteract('submit')} style={{cursor: 'pointer'}}  id='submit-Container'>
				<div className='header-Btn' id='submit-Icon'></div>
				<span id='submit-Text'>Submit</span>
			</div>

		</div>
	)
}

export default Header