import React from 'react';
import { PaperScope, Path } from 'paper/dist/paper-core'

/**
 * App
 */
export default class App extends React.Component {
  constructor (props) {
    super(props);

    this.paper = new PaperScope();
    this.balls = [];
  }

  componentDidMount () {
    this.paper.setup(this.canvas);
    this.draw();
  }

  componentDidUpdate () {
    this.paper.setup(this.canvas);
    this.draw();
  }

  draw () {
    var path = new Path({
      segments: [[20, 20], [80, 80], [140, 20]],
      fillColor: 'yellow',
      closed: true
    });
  }

	render () {
		return (
			<div className='container'>
				<canvas id='canvas' ref={ el => {this.canvas = el}} />
			</div>
		)
	}
}


