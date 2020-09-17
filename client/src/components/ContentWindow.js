import React, { useState, useEffect } from 'react'
import Terms from './Terms'
import About from './About'
import Restaurants from './Restaurants'
import Search from './Search'
import ContentCard from './ContentCard'
import Admin from './Admin'

const ContentWindow = ({Switch, Route, setMessage, useLocation, searchInput, setSearchInput, setCurrentRoute}) => {

	const location = useLocation()
	const [posts, setPosts] = useState([])
	const [endOfPosts, setEndOfPosts] = useState(false)


	useEffect(() => {
		if(location.pathname === '/'){
			setCurrentRoute('Trending')
			fetch('https://btb-to.herokuapp.com/api/posts')
			.then(response => response.json())
			.then(response => setPosts(response))
			.catch(err => setMessage('There has been an error'))
		}
	},[location, setCurrentRoute, setMessage])






	return(
		<main id='contentWindow'>
			<Switch>
				<Route path='/' exact>
				<div id='content-Feed' >
				{
					posts.map((post, i) => {
						return <ContentCard post={post} key={i} setPosts={setPosts} posts={posts} setMessage={setMessage}/>
					})	
				}
				{
					posts.length > 9 && endOfPosts === false ?
					<div onClick={() => {
						fetch(`https://btb-to.herokuapp.com/api/${posts.length}`)
						.then(result => result.json())
						.then(result => {
							if(result.endOfPosts){
								setEndOfPosts(true)
							} else {
								setPosts(posts => [...posts, ...result])
							}
						})
						.catch(err => setMessage('There has been an error'))
					}} className='see-More'>
						<span> See more posts </span>
					</div>:
					null
				}
				</div>
				</Route>
				<Route path='/restaurants'>
				<div id='content-Feed'>
					<Restaurants setCurrentRoute={setCurrentRoute} setSearchInput={setSearchInput}/>
				</div>
				</Route>
				<Route path='/search'>
				<div id='content-Feed'>
					<Search searchInput={searchInput} 
							setSearchInput={setSearchInput} 
							location={location} 
							setCurrentRoute={setCurrentRoute}
							setMessage={setMessage}/>
				</div>
				</Route>
				<Route path='/terms'>
					<Terms setCurrentRoute={setCurrentRoute}/>
				</Route>
				<Route path='/about'>
					<About setCurrentRoute={setCurrentRoute}/>
				</Route>
				<Route to='/admin'>
					<Admin setMessage={setMessage} />
				</Route> 
			</Switch>
		</main>
	)
}

export default ContentWindow