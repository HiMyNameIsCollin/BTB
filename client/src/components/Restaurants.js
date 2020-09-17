import React, {useEffect, useState} from 'react'
import RestaurantCard from './RestaurantCard'


const Restaurants = ({setCurrentRoute, setSearchInput}) => {

	const [posts, setPosts] = useState([])

	useEffect(() => {
		fetch('http://localhost:3000/restaurants')
		.then(response => response.json())
		.then(response => setPosts(response))
		setCurrentRoute('Restaurants')
	},[setCurrentRoute])

	return(
		<React.Fragment>
			{
			posts.map((post, i) => {
				return <RestaurantCard post={post} key={i} setSearchInput={setSearchInput}/>
			})
			}
		</React.Fragment>
	)
}

export default Restaurants