const canvasDots = function () {
  const canvas = document.getElementById('dot_link'),
    ctx = canvas.getContext('2d'),
    colorDot = [
      'rgb(81, 162, 233)',
      'rgb(81, 162, 233)',
      'rgb(81, 162, 233)',
      'rgb(81, 162, 233)',
      'rgb(255, 77, 90)',
    ], // 80% of dots are blue. 20% pink
    color = 'rgb(81, 162, 233)';

  // ctx.globalAlpha = 0.8;
  canvas.width = document.body.scrollWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = 'block';
  // ctx.fillStyle = colorDot;
  // ctx.fillStyle = 'hsl(' + 360 * Math.random() + ', 50%, 50%)';
  ctx.lineWidth = 0.3;
  ctx.strokeStyle = color;

  let mousePosition = {
    x: (30 * canvas.width) / 100,
    y: (30 * canvas.height) / 100,
  };

  const windowSize = window.innerWidth;
  let dots;

  if (windowSize > 1600) {
    dots = {
      nb: 600, // number of particles
      distance: 70, // max distance between particles for them to link
      d_radius: 300, // radius from mouse location that particles will link
      array: [],
    };
  } else if (windowSize > 1300) {
    dots = {
      nb: 575,
      distance: 60,
      d_radius: 280,
      array: [],
    };
  } else if (windowSize > 1100) {
    dots = {
      nb: 500,
      distance: 55,
      d_radius: 250,
      array: [],
    };
  } else if (windowSize > 800) {
    dots = {
      nb: 350,
      distance: 50,
      d_radius: 400,
      array: [],
    };
  } else if (windowSize > 700) {
    dots = {
      nb: 225,
      distance: 45,
      d_radius: 300,
      array: [],
    }; 
  } else if (windowSize > 600) {
    dots = {
      nb: 200,
      distance: 60,
      d_radius: 150,
      array: [],
    };
  } else if (windowSize > 650) {
    dots = {
      nb: 400,
      distance: 50,
      d_radius: 185,
      array: [],
    };
  } else if (windowSize > 500) {
    dots = {
      nb: 250,
      distance: 20,
      d_radius: 60,
      array: [],
    };
  } else {
    dots = {
      nb: 130,
      distance: 35,
      d_radius: 300,
      array: [],
    };
  }

  function Dot() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.innerHeight;

    this.vx = -0.5 + Math.random();
    this.vy = -0.5 + Math.random();

    this.radius = Math.random() * 1.5;

    // this.colour = 'hsl(' + 360 * Math.random() + ', 50%, 50%)';
    this.colour = colorDot[Math.floor(Math.random() * colorDot.length)];

    if (window.innerWidth <= 600) {
    this.y = Math.random() * window.innerHeight; // full vertical coverage
    } else {
      this.y = Math.random() * canvas.height;
    }

    this.vx = -0.5 + Math.random();
    this.vy = -0.5 + Math.random();
    this.radius = Math.random() * 1.5;
    this.colour = colorDot[Math.floor(Math.random() * colorDot.length)];
  }

  Dot.prototype = {
    create: function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      // ctx.fillStyle = this.colour;

      // make the dot colour fade out the further they are from the mouse
      const dotDistance =
        ((this.x - mousePosition.x) ** 2 + (this.y - mousePosition.y) ** 2) **
        0.5;
      const distanceRatio = dotDistance / (windowSize / 1.7);

      // this chops the bracket off the rgb colour and ads an opacity
      ctx.fillStyle = this.colour.slice(0, -1) + `,${1 - distanceRatio})`;

      ctx.fill();
    },

    animate: function () {
      // dont animate the first dot, it will follow mouse
      for (let i = 1; i < dots.nb; i++) {
        const dot = dots.array[i];

        if (dot.y < 0 || dot.y > canvas.height) {
          dot.vx = dot.vx;
          dot.vy = -dot.vy;
        } else if (dot.x < 0 || dot.x > canvas.width) {
          dot.vx = -dot.vx;
          dot.vy = dot.vy;
        }
        dot.x += dot.vx;
        dot.y += dot.vy;
      }
    },

    line: function () {
      for (let i = 0; i < dots.nb; i++) {
        for (let j = 0; j < dots.nb; j++) {
          const i_dot = dots.array[i];
          const j_dot = dots.array[j];

          if (
            i_dot.x - j_dot.x < dots.distance &&
            i_dot.y - j_dot.y < dots.distance &&
            i_dot.x - j_dot.x > -dots.distance &&
            i_dot.y - j_dot.y > -dots.distance
          ) {
            if (
              i_dot.x - mousePosition.x < dots.d_radius &&
              i_dot.y - mousePosition.y < dots.d_radius &&
              i_dot.x - mousePosition.x > -dots.d_radius &&
              i_dot.y - mousePosition.y > -dots.d_radius
            ) {
              ctx.beginPath();
              ctx.moveTo(i_dot.x, i_dot.y);
              ctx.lineTo(j_dot.x, j_dot.y);

              // make the fill colour fade out the further you are from the mouse
              const dotDistance =
                ((i_dot.x - mousePosition.x) ** 2 +
                  (i_dot.y - mousePosition.y) ** 2) **
                0.5;
              let distanceRatio = dotDistance / dots.d_radius;

              // make it so it doesnt fade out completely
              distanceRatio -= 0.3;
              if (distanceRatio < 0) {
                distanceRatio = 0;
              }

              ctx.strokeStyle = `rgb(81, 162, 233, ${1 - distanceRatio})`;

              ctx.stroke();
              ctx.closePath();
            }
          }
        }
      }
    },
  };

  function createDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < dots.nb; i++) {
      dots.array.push(new Dot());
      var dot = dots.array[i];

      dot.create();
    }

    // first dot to be relativley large
    dots.array[0].radius = 1.5;

    // first dot to be blue
    dots.array[0].colour = '#51a2e9';

    dot.line();
    dot.animate();
  }

  window.onmousemove = function (parameter) {
    mousePosition.x = parameter.pageX;
    mousePosition.y = parameter.pageY;

    // sometimes if the mouse is off screen on refresh, it bugs out
    try {
      // want the first dot to follow the mouse
      dots.array[0].x = parameter.pageX;
      dots.array[0].y = parameter.pageY;
    } catch {
      //
    }
  };

  mousePosition.x = window.innerWidth / 2;
  mousePosition.y = window.innerHeight / 2;

  const draw = setInterval(createDots, 1000 / 30);

  window.onresize = function () {
    clearInterval(draw);
    canvasDots();
    // console.log(yippe);
  };


  // // On touch for mobile
  // canvas.addEventListener('touchstart', function (e) {
  // const touch = e.touches[0];
  // const x = touch.pageX;
  // const y = touch.pageY;

  // // Simulate hover at touch location
  // mousePosition.x = x;
  // mousePosition.y = y;

  // try {
  //   dots.array[0].x = x;
  //   dots.array[0].y = y;
  // } catch {}

  // // Optional: reset after a short time (simulate hover fade-out)
  // // setTimeout(() => {
  // // mousePosition.x = -9999;
  // // mousePosition.y = -9999;
  // // }, 1000); // fade after 1s
  // // });

  // // On Hover for mobile
  // canvas.addEventListener('touchmove', function (e) {
  // const touch = e.touches[0];
  // mousePosition.x = touch.pageX;
  // mousePosition.y = touch.pageY;

  // try {
  //   dots.array[0].x = touch.pageX;
  //   dots.array[0].y = touch.pageY;
  // } catch {}
  // });

};

canvasDots();