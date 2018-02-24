import React from 'react';
import { Rectangle, PaperScope, Path, Point, Size } from 'paper/dist/paper-core'

import Ball from './Ball';

/**
 * App
 *
 * @param {[type]} [varname] [description]
 * @returns {[type]} [description]
 */
export default class App extends React.Component {
  constructor (props) {
    super(props);

    this.paper = new PaperScope();
    console.log('this.paper:', this.paper)
    this.balls = [];
  }

  componentDidMount () {
    this.paper.setup(this.canvas);
    this.paper.view.viewSize = new Size(500, 500);
    this.paper.view.onFrame = () => this.onFrame();
    console.log('this.paper:', this.paper)
    this.draw();
    // this.drawSthn();
  }

  // componentDidUpdate () {
  //   console.log('update!')
  //   this.paper.setup(this.canvas);
  //   this.paper.view.viewSize = new Size(500, 500);
  //   this.paper.view.onFrame = () => this.onFrame();
  //   this.draw();
  //   // this.drawSthn();
  // }

  createNewBall (r, p, v) {
    let { view } = this.paper,
        newBall = new Ball(r, p, v, view),
        path = new Path({
          fillColor: {
            hue: Math.random() * 360,
            saturation: 1,
            brightness: 1
          },
          blendMode: 'lighter'
        }),
        sthn = Object.assign({}, newBall);

    console.log({sthn})
    newBall.path = path;
    console.log('newBall 1:', newBall)

    for (var i = 0; i < newBall.numSegment; i ++) {
      newBall.boundOffset.push(newBall.radius);
      newBall.boundOffsetBuff.push(newBall.radius);
      newBall.path.add(new Point());
      newBall.sidePoints.push(new Point({
        angle: 360 / newBall.numSegment * i,
        length: 1
      }));
    }

    console.log({newBall})
    return newBall;
  }

  draw () {
    let { project, tools, view } = this.paper;
    var numBalls = 18;
    for (var i = 0; i < numBalls; i++) {
      var position = Point.random().multiply(view.size);
      var vector = new Point({
        angle: 360 * Math.random(),
        length: Math.random() * 10
      });
      var radius = Math.random() * 60 + 60;
      this.balls.push(this.createNewBall(radius, position, vector));
    }
  }

  // drawSthn () {
  //   // var size = new Size(100, 50);
  //   // var rect = new Rectangle(new Point(20, 15), size);
  //   var path = new Path({
  //     segments: [[20, 20], [80, 80], [140, 20]],
  //     fillColor: 'yellow',
  //     closed: true
  //   });
    
  //   // var path = new Path.Rectangle(rect);
  //   // path.strokeColor = 'black';
  //   // path.fillColor = 'purple';
  // }

  getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  onFrame () {
    let { balls } = this;

    if (balls) {
      for (var i = 0; i < balls.length - 1; i++) {
        for (var j = i + 1; j < balls.length; j++) {
          balls[i].react(balls[j]);
        }
      }
      for (var i = 0, l = balls.length; i < l; i++) {
        balls[i].iterate();
      }
    }
  }

	render () {
		return (
			<div className='container'>
				<canvas id='canvas' ref={ el => {this.canvas = el}} />
			</div>
		)
	}
}


