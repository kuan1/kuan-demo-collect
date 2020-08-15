// 星空插件

window.requestAnimFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame

function initStarSky(id) {
  const canvas = document.getElementById(id)
  const c = canvas.getContext('2d')
  const numStars = 500
  const radius = `0.${Math.floor(Math.random() * 9)}${1}`
  const focalLength = canvas.width * 2
  const warp = 0
  let centerX, centerY

  let stars = [],
    star
  let i

  initializeStars()

  function executeFrame() {
    requestAnimFrame(executeFrame)

    moveStars()
    drawStars()
  }

  function initializeStars() {
    centerX = canvas.width / 2
    centerY = canvas.height / 2

    stars = []
    for (i = 0; i < numStars; i++) {
      star = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * canvas.width,
        o: `0.${Math.floor(Math.random() * 99)}${1}`,
      }
      stars.push(star)
    }
  }

  function moveStars() {
    for (i = 0; i < numStars; i++) {
      star = stars[i]
      star.z--

      if (star.z <= 0) {
        star.z = canvas.width
      }
    }
  }

  function drawStars() {
    let pixelX, pixelY, pixelRadius

    // Resize to the screen
    if (canvas.width !== window.innerWidth || canvas.width !== window.innerWidth) {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initializeStars()
    }
    if (warp === 0) {
      // c.fillStyle = 'rgba(0,10,20,1)';
      c.fillStyle = 'rgba(0,0,0,1)'
      c.fillRect(0, 0, canvas.width, canvas.height)
    }
    c.fillStyle = `rgba(209, 255, 255, ${radius})`
    for (i = 0; i < numStars; i++) {
      c.beginPath()
      star = stars[i]

      pixelX = (star.x - centerX) * (focalLength / star.z)
      pixelX += centerX
      pixelY = (star.y - centerY) * (focalLength / star.z)
      pixelY += centerY
      pixelRadius = focalLength / star.z
      c.arc(pixelX, pixelY, pixelRadius, 0, 2 * Math.PI, true)
      c.fillStyle = `rgba(255, 255, 255, ${star.o})`
      c.fill()
    }
    c.stroke()
  }

  executeFrame()
}
