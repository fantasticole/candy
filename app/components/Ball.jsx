import paper from 'paper';
import { Path, Point } from 'paper/dist/paper-core'

// kynd.info 2014
let view;

export default function Ball (r, p, v, canvas) {
  this.radius = r;
  this.point = p;
  this.vector = v;
  view = canvas;
  this.maxVec = 15;
  this.numSegment = Math.floor(r / 3 + 2);
  this.boundOffset = [];
  this.boundOffsetBuff = [];
  this.sidePoints = [];
  this.path = new Path({
    fillColor: {
      hue: Math.random() * 360,
      saturation: 1,
      brightness: 1
    },
    blendMode: 'lighter'
  });

  for (var i = 0; i < this.numSegment; i ++) {
    this.boundOffset.push(this.radius);
    this.boundOffsetBuff.push(this.radius);
    this.path.add(new Point());
    this.sidePoints.push(new Point({
      angle: 360 / this.numSegment * i,
      length: 1
    }));
  }
}

Ball.prototype = {
  iterate () {
    this.checkBorders();
    if (this.vector.length > this.maxVec)
      this.vector.length = this.maxVec;
    this.point = this.point.add(this.vector);
    this.updateShape();
  },

  checkBorders () {
    let { size } = view;

    if (this.point.x < -this.radius)
      this.point.x = size.width + this.radius;
    if (this.point.x > size.width + this.radius)
      this.point.x = -this.radius;
    if (this.point.y < -this.radius)
      this.point.y = size.height + this.radius;
    if (this.point.y > size.height + this.radius)
      this.point.y = -this.radius;
  },

  updateShape () {
    let segments = this.path.segments;

    for (var i = 0; i < this.numSegment; i ++)
      segments[i].point = this.getSidePoint(i);

    this.path.smooth();
    for (var i = 0; i < this.numSegment; i ++) {
      if (this.boundOffset[i] < this.radius / 4)
        this.boundOffset[i] = this.radius / 4;
      let next = (i + 1) % this.numSegment;
      let prev = (i > 0) ? i - 1 : this.numSegment - 1;
      let offset = this.boundOffset[i];

      offset += (this.radius - offset) / 15;
      offset += ((this.boundOffset[next] + this.boundOffset[prev]) / 2 - offset) / 3;
      this.boundOffsetBuff[i] = this.boundOffset[i] = offset;
    }
  },

  react (b) {
    let dist = this.point.getDistance(b.point);

    if (dist < this.radius + b.radius && dist != 0) {
      let overlap = this.radius + b.radius - dist;
      let direc = this.point.subtract(b.point).normalize(overlap * 0.015);

      this.vector = this.vector.add(direc);
      b.vector = b.vector.subtract(direc);

      this.calcBounds(b);
      b.calcBounds(this);
      this.updateBounds();
      b.updateBounds();
    }
  },

  getBoundOffset (b) {
    let diff = this.point.subtract(b);
    let angle = (diff.angle + 180) % 360;

    return this.boundOffset[Math.floor(angle / 360 * this.boundOffset.length)];
  },

  calcBounds (b) {
    for (var i = 0; i < this.numSegment; i ++) {
      let tp = this.getSidePoint(i);
      let bLen = b.getBoundOffset(tp);
      let td = tp.getDistance(b.point);

      if (td < bLen) {
        this.boundOffsetBuff[i] -= (bLen  - td) / 2;
      }
    }
  },

  getSidePoint (index) {
    return this.point.add(this.sidePoints[index].multiply(this.boundOffset[index]));
  },

  updateBounds () {
    for (var i = 0; i < this.numSegment; i ++)
      this.boundOffset[i] = this.boundOffsetBuff[i];
  }
};
