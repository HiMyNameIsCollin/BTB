import React, {useState, useEffect} from 'react'
import ContentCard from './ContentCard'


const Search = ({searchInput, setSearchInput, location, setCurrentRoute, setMessage}) => {

	const [posts, setPosts] = useState([])
	const [searchError, setSearchError] = useState(false)
	const [endOfPosts, setEndOfPosts] = useState(false)

	useEffect(() => {
			fetch(`https://btb-to.herokuapp.com/search/${searchInput}`)
			.then(response => response.json())
			.then(response => {
					setCurrentRoute(response[0].business)
					setSearchError(false)
					setPosts(response)
			})
			.catch(err => {
				setSearchError(true)
			})
			setSearchInput('Search for a restaurant')
	},[location])


	return(
		<React.Fragment>
		{
			searchError === false ?
			posts.map((post, i) => {
				return <ContentCard post={post} key={i} posts={posts} setPosts={setPosts} />
			}):
			<h4 style={{color: 'white', margin: 'auto', textAlign: 'center'}}> No results </h4>
		}
		{
			posts.length > 9 && endOfPosts === false && searchError === false ?
				<div onClick={() => {
					fetch('http://localhost:3000/searchMore', {
						method: 'post',
						headers: {'Content-Type' : 'application/json'},
						body: JSON.stringify({
							business: posts[0].business,
							postsLength: posts.length
						})
					})
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
		</React.Fragment>
	)
}

export default Search