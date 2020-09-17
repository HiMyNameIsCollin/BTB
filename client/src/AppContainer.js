import React, {useState} from 'react'
import Header from './components/Header'
import NavWindow from './components/NavWindow'
import ContentWindow from './components/ContentWindow'
import UserInteract from './components/UserInteract'
import MessageOverlay from './components/MessageOverlay'
import titleCase from './utils/titleCase'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation
} from "react-router-dom";


const AppContainer = () => {
	const [navOpen, setNav] = useState(false)
	const [userInteract, setUserInteract] = useState(undefined)
	const [searchInput, setSearchInput] = useState('Search for a restaurant')
	const [message, setMessage] = useState(undefined)
	const [currentRoute, setCurrentRoute] = useState('')

	return(
		<div id='appContainer'>
		{
			message !== undefined ?
			<MessageOverlay message={message} setMessage={setMessage}/> :
			null
		}
		<Router>
		 	<Header navOpen={navOpen} setNav={setNav} Link={Link} setUserInteract={setUserInteract} searchInput={searchInput} setSearchInput={setSearchInput}/>
		 	<NavWindow navOpen={navOpen} setNav={setNav} Link={Link} setUserInteract={setUserInteract}/> 
		 	<div id='currentPage'><p> {titleCase(currentRoute)} </p> </div>
		 	<ContentWindow Switch={Switch} Route={Route} setMessage={setMessage} useLocation={useLocation} searchInput={searchInput} setSearchInput={setSearchInput} setCurrentRoute={setCurrentRoute}/>
		 	{
		 		userInteract !== undefined ?
		 		<UserInteract Link={Link} userInteract={userInteract} setUserInteract={setUserInteract} message={message} setMessage={setMessage}/> :
		 		null
		 	}

		 </Router>
		</div>
	)
}

export default AppContainer

