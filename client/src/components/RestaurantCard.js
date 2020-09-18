import React from 'react'
import titleCase from '../utils/titleCase'
import { useHistory } from "react-router-dom"

const RestaurantCard = ({post, setSearchInput}) => {

	const history = useHistory()

	return(
			<div className='restaurantCard' onClick={() => {
				setSearchInput(post.business)
				history.push('/search')
			}}> 
				<div className='search-Image'>
				<img src={`https://btb-to.herokuapp.com/api/img/${post.image}`} alt='Posts images' />
				</div>
				<p style={{fontSize: '1em', paddingLeft: '.8em'}}> {titleCase(post.business)}</p>
				{
					post.locations.map((l, i) => {
					return 	<p style={{fontSize: '.9em', fontWeight: '400'}}> {titleCase(l)} </p>
					})
				}
				<p style={{background: '#c5b358'}}> {post.posts} posts </p>
			</div>
	)
}

export default RestaurantCard