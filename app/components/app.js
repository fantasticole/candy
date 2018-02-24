import React from 'react';
import { Rectangle, PaperScope, Path, Point, Size } from 'paper/dist/paper-core'

import Ball from './Ball';

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
    this.paper.view.viewSize = new Size(this.canvas.width, this.canvas.height);
    this.paper.view.onFrame = () => this.onFrame();
    this.draw();
  }

  draw () {
    let { view } = this.paper;
    let numBalls = 18;

    for (var i = 0; i < numBalls; i++) {
      let position = Point.random().multiply(view.size);
      let vector = new Point({
        angle: 360 * Math.random(),
        length: Math.random() * 10
      });
      let radius = Math.random() * 60 + 60;

      this.balls.push(new Ball(radius, position, vector, view));
    }
  }

  onFrame () {
    let { balls } = this;

    balls.forEach(ball => {
      balls.forEach(b =>{
        ball.react(b);
      })
    })
    balls.forEach(ball => ball.iterate());
  }

	render () {
		return (
			<div className='container'>
				<canvas data-paper-resize id='canvas' ref={ el => {this.canvas = el}} />
			</div>
		)
	}
}


