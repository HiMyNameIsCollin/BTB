import React, { useEffect }from 'react'
import useDidMountEffect from '../hooks/useDidMountEffect'

const NavWindow = ({navOpen, setNav, setUserInteract, Link}) => {

	useDidMountEffect(()=> {
		const navWindow = document.getElementById('navWindow')
		navWindow.style.display = 'block'
		if(navOpen === true) {
			navWindow.classList.add('slide-in-left')
			navWindow.classList.remove('slide-out-left')
		} else {
			navWindow.classList.add('slide-out-left')
			navWindow.classList.remove('slide-in-left')
		}

	}, [navOpen])

	useEffect(() => {
		/*CLOSES NAV WINDOW WHEN MOuSE CLICKS OFF OF NAV WINDOW */
		const navWindow = document.getElementById('navWindow')
		const navList = document.getElementById('navList')
		if(navOpen === true){
			const childNodes = navList.childNodes
			let childNodeClicked = false
			document.addEventListener('click', function navClick(e){
				if(e.target !== navWindow || e.target !== navList) {
					childNodes.forEach((n, i) => {
						if(n === e.target) {

						} else {
							n.childNodes.forEach((no, j) => {
								if(no === e.target){
									childNodeClicked = true
								} else {
									setNav(false)
									document.removeEventListener('click', navClick)
								}
							})
						}

					})
				if(childNodeClicked === true){
					childNodeClicked = false
					setNav(false)
					document.removeEventListener('click', navClick)
				}
				}
			})
		}
	}, [navOpen, setNav])


	return(
		<div id='navWindow' >
			<ul id='navList'>
				<li className='list-Header'>Browse</li>
				<li onClick={() => setUserInteract(undefined)} className='list-Item'>
					<Link className='list-Tab' to='/restaurants'>
						<div className='menu-Icon' id='cityIcon'> </div>
						Restaurants
					</Link>

				</li>
				<li onClick={() => setUserInteract(undefined)} className='list-Item'>
					<Link className='list-Tab' to='/'>
						<div className='menu-Icon' id='trendingIcon'> </div>
						Trending
					</Link>
				</li>
				<li onClick={() => setUserInteract('submit')} className='list-Item'>
					<div className='list-Tab'>
						<div className='menu-Icon' id='menuSubmitIcon'> </div>
						Submit
					</div>
				</li>
				<li className='list-Header'> Connect with us! </li>
				<li className='list-Item'>
					<a href='https://twitter.com/BTB_Toronto' target="_blank" className='list-Tab'>
						<div className='menu-Icon' id='twitterIcon'> </div>
						Twitter
					</a>
				</li>
				<li className='list-Item'>
					<a href='https://www.facebook.com/behind.thebar.39' target="_blank" className='list-Tab'>
						<div className='menu-Icon' id='facebookIcon'> </div>
						Facebook
					</a>
				</li>
				<li onClick={() => setUserInteract('email')} className='list-Item'>
					<div className='list-Tab'>
						<div className='menu-Icon' id='emailIcon'> </div>
						<p> Email </p>										
					</div>
				</li>
				<li className='list-Header'> Fun reads </li>
				<li onClick={() => setUserInteract(undefined)} className='list-Item'>
					<Link className='list-Tab' to='/about'>
						<div className='menu-Icon' id='thumbsUpIcon'> </div>
						Mission statement
					</Link>
				</li>
				<li onClick={() => setUserInteract(undefined)} className='list-Item'>
					<Link className='list-Tab' to='/terms'>
						<div className='menu-Icon' id='thumbsDownIcon'> </div>
						Terms and Conditions
					</Link>
				</li>
				<div className='list-Header list-Footer'> © Behind the Bar 2020 </div>
			</ul>
		</div>
	)
}

export default NavWindow