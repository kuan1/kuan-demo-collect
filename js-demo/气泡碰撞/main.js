// 获取canvas dom
var canvas = document.querySelector('canvas')
// canvas2D绘图
var ctx = canvas.getContext('2d')
// 获取页面宽度
var WIDTH = document.documentElement.clientWidth
// 获取页面高度
var HEIGHT = document.documentElement.clientHeight
// canvas赋值宽度
canvas.width = WIDTH
// canvas赋值高度
canvas.height = HEIGHT

// 配置文件
var config = {
  speedMin: -7,
  speedMax: 7,
  ballMin: 10,
  ballMax: 20,
  ballCount: 30,
}

/**
 *
 *
 * @param max
 * @param min
 * @returns {*}
 */
function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

/**
 * define Ball constructor
 *
 * @param x
 * @param y
 * @param velX
 * @param velY
 * @param color
 * @param size
 */
function Ball(x, y, velX, velY, color, size) {
  this.x = x
  this.y = y
  this.velX = velX
  this.velY = velY
  this.color = color
  this.size = size
}

/**
 * define Ball draw method
 */
Ball.prototype.draw = function () {
  ctx.beginPath()
  ctx.fillStyle = this.color
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
  ctx.fill()
}

/**
 * define Ball update method
 */
Ball.prototype.update = function () {
  if (this.x + this.size >= WIDTH) {
    this.velX = -this.velX
  }
  if (this.x - this.size <= 0) {
    this.velX = -this.velX
  }

  if (this.y + this.size >= HEIGHT) {
    this.velY = -this.velY
  }
  if (this.y - this.size <= 0) {
    this.velY = -this.velY
  }

  this.x += this.velX
  this.y += this.velY
}

/**
 * define Ball collision detection
 */
Ball.prototype.collisionDetect = function () {
  for (var j = 0; j < balls.length; j++) {
    var ball = balls[j]
    if (this !== ball) {
      // be care of this line, we can't compare one with itself
      var dxv = this.x + this.velX - (ball.x + ball.velX) //detect the next step which will updated
      var dyv = this.y + this.velY - (ball.y + ball.velY)
      var distance = Math.sqrt(dxv * dxv + dyv * dyv)

      if (distance <= this.size + ball.size) {
        ball.color = this.color =
          'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')'

        // rebound the balls when collision
        var dvx = this.velX - ball.velX
        var dvy = this.velY - ball.velY
        var dx = this.x - ball.x // but when update just use this step
        var dy = this.y - ball.y
        var xx_yy = dx * dx + dy * dy
        var v_dvx = (dvx * dx * dx + dvy * dx * dy) / xx_yy
        var v_dvy = (dvy * dy * dy + dvx * dx * dy) / xx_yy
        this.velX = checkSpeed(this.velX - v_dvx)
        this.velY = checkSpeed(this.velY - v_dvy)
        ball.velX = checkSpeed(ball.velX + v_dvx)
        ball.velY = checkSpeed(ball.velY + v_dvy)
      }
    }
  }
}

/**
 * validate the speed
 *
 * @param speed
 * @returns {*}
 */
function checkSpeed(speed) {
  if (speed > config.speedMax) {
    speed = config.speedMax
  } else if (speed < config.speedMin) {
    speed = config.speedMin
  }
  return speed
}

// define array to store balls
var balls = []

/**
 * draw the balls loops
 */
function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  while (balls.length < config.ballCount) {
    var b_var = createBall()
    var ball = new Ball(
      b_var.x,
      b_var.y,
      random(config.speedMin, config.speedMax),
      random(config.speedMin, config.speedMax),
      'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
      b_var.r
    )
    balls.push(ball)
  }

  for (var i = 0; i < balls.length; i++) {
    balls[i].draw()
    balls[i].collisionDetect() //detect before update
    balls[i].update()
  }

  // run again and again to realize the effect of the animation
  requestAnimationFrame(loop)
}

var createdBalls = []

/**
 * ensure the created ball will not collision
 *
 * @returns {{x: *, y: *, r: *}}
 */
function createBall() {
  var x = random(0, WIDTH)
  var y = random(0, HEIGHT)
  var r = random(config.ballMin, config.ballMax)
  for (var i = 0; i < createdBalls.length; i++) {
    var dx = createdBalls[i].x - x
    var dy = createdBalls[i].y - y
    var distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < createdBalls[i].r + r) {
      return createBall()
    }
  }
  var ball = {
    x: x,
    y: y,
    r: r,
  }
  createdBalls.push(ball)
  return ball
}

loop()
