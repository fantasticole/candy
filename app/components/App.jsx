import React from 'react';

import FloatingBalls from './FloatingBalls';

/**
 * App
 */
export default class App extends React.Component {
  constructor (props) {
    super(props);
  }

	render () {
		return (
			<div className='container'>
				<FloatingBalls />
			</div>
		)
	}
}


