import React, { useEffect } from 'react'

const About = ({setCurrentRoute}) => {

	useEffect(()=> {
		setCurrentRoute('About')
	}, [setCurrentRoute])
	return(
		<div id='about'>
			<div id='quote-Container'>
				<div id='about-Quote'>
					“I want to tell you about the dark recesses of the restaurant underbelly — a subculture whose centuries-old militaristic hierarchy and ethos of 'rum, buggery and the lash' make for a mix of unwavering order and nerve-shattering chaos — because I find it all quite comfortable,” 
					<span> - Anthony Bourdain on the inspiration behind his book Kitchen Confidental: Adventures in the Culinary Underbelly</span>
				</div>
				<div id='about-Quote'> 
					“You see a lot of this ailment — perfectly reasonable, even shrewd businessmen, hitting their fifties, suddenly writing checks with their cock. And they are not entirely misguided in this; they probably will get laid. The restaurant business does have somewhat relaxed mores about casual sex, and there are a number of amiably round-heeled waitresses, most of them hopelessly untalented aspiring actresses for whom sexual congress with older, less attractive guys is not entirely unfamiliar.” 
					<span> - Anthony Bourdain's observation of the common sexual promiscuity found in most establishments</span>
				</div>
				<div id='about-Quote'> 
					“Look at your waiter's face. He knows. It's another reason to be polite to your waiter: he could save your life with a raised eyebrow or a sigh.”
					<span> - Anthony Bourdain on how the staff of a restaurant knows what is really going on off the dining room floor. </span>
				</div>
			</div>
			<div id='mission-Container'>
				<h1> The Mission </h1>
				<div>
					<p> Lorem Lipsum blah Lorem Lipsum blah Lorem Lipsum blah Lorem Lipsum blah Lorem Lipsum blah Lorem Lipsum blah Lorem Lipsum blah Lorem Lipsum blah Lorem Lipsum blah Lorem Lipsum blah Lorem Lipsum blah  </p>
					<p> Lorem Lipsum blah Lorem Lipsum blah Lorem Lipsum blah Lorem Lipsum blah Lorem Lipsum blah Lorem Lipsum blah Lorem Lipsum blah Lorem Lipsum blah Lorem Lipsum blah Lorem Lipsum blah Lorem Lipsum blah  </p>
				</div>
			</div>
			<div className='list-Header'>
				 © Behind the Bar 2020 
			</div>
		</div>
	)
}

export default About