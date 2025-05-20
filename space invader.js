let UI = document.querySelector(".UI");
let newGameBtn = document.querySelector("#BTN");
let scoreboard = document.querySelector("#points");

let canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");
let arrwo_lft_btn = document.querySelector("#leftbtn");
let arrwo_rgt_btn = document.querySelector("#rightbtn");
let moving_btns = document.querySelector("#btns");
let fireBtn = document.querySelector("#fireBtn");
let prsntattionUI = document.querySelector("#presentationUI");

canvas.width = innerWidth;
canvas.height = innerHeight;

let points = 0;

prsntattionUI.addEventListener("click", () => {
  prsntattionUI.style.display = "none";
});

window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});
// create player class

class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.rotaion = 0;
    this.opacity = 1;

    let spaceShipImage = new Image();
    spaceShipImage.src =
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJypOoSDfou31jGjya2y94NodthE-0444njk8-5eMtXPCCje5wRSulfSFX0BZvZ-bZuK4&usqp=CAU";

    //   seting image width and height on loading the screen
    spaceShipImage.onload = () => {
      let scaleofImage = 0.45;
      this.Image = spaceShipImage;
      this.width = spaceShipImage.width * scaleofImage;
      this.height = spaceShipImage.height * scaleofImage;

      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height,
      };
    };
  }

  draw() {
    c.save();
    c.globalAlpha = this.opacity;
    c.translate(
      player.position.x + player.width / 2,
      player.position.y + player.height / 2
    );
    c.rotate(this.rotaion);
    c.translate(
      -player.position.x - player.width / 2,
      -player.position.y - player.height / 2
    );

    c.drawImage(
      this.Image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    c.restore();
  }

  update() {
    if (this.Image) {
      this.draw();
      this.position.x += this.velocity.x;
    }
  }
}

// creating projectile (fire from player)
class Projectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.radius = 3.7;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = "red";
    c.fill();
    c.closePath;
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

// creating particles when player fire hit enemy (enemy explosion)
class Particle {
  constructor({ position, velocity, radius, color, fades }) {
    this.position = position;
    this.velocity = velocity;

    this.radius = radius;
    this.color = color;
    this.opacity = 1;
    this.fades = fades;
  }

  draw() {
    c.save();
    c.globalAlpha = this.opacity;
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath;
    c.restore();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.fades) this.opacity -= 0.008;
  }
}

// creating invaders projectiles (fires)
class InvaderProjectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.width = 3;
    this.height = 15;
  }

  draw() {
    c.fillStyle = "white";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

// creating invaders
class Invader {
  constructor({ position }) {
    this.velocity = {
      x: 0,
      y: 0,
    };

    let invaderImage = new Image();
    invaderImage.src = "invaderpic.jpg";

    //   seting image width and height on loading the screen
    invaderImage.onload = () => {
      let scaleofImage = 0.08;

      // for mobile
      if (window.innerWidth <= 500 && window.innerWidth >= 315) {
        scaleofImage = 0.045;
      }
      this.Image = invaderImage;
      this.width = invaderImage.width * scaleofImage;
      this.height = invaderImage.height * scaleofImage;

      this.position = {
        x: position.x,
        y: position.y,
      };
    };
  }

  draw() {
    c.drawImage(
      this.Image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update({ velocity }) {
    if (this.Image) {
      this.draw();
      this.position.x += velocity.x;
      this.position.y += velocity.y;
    }
  }

  shoot(invaderProjectiles) {
    invaderProjectiles.push(
      new InvaderProjectile({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height,
        },
        velocity: {
          x: 0,
          y: 7,
        },
      })
    );
  }
}

// creating class of grid for invaders(rows and coloums)
class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };

    this.velocity = {
      x: 4.2,
      y: 0,
    };

    // calling invader into invader Array
    this.invaders = [];

    // 1) x loop for coloumns
    // 2) y loop for rows

    // for mobiles
    if (window.innerWidth <= 500 && window.innerWidth >= 315) {
      let coloumns = Math.floor(Math.random() * 3 + 3);
      let rows = Math.floor(Math.random() * 3 + 3);

      this.width = coloumns * 37;

      for (let x = 0; x < coloumns; x++) {
        for (let y = 0; y < rows; y++) {
          this.invaders.push(
            new Invader({
              position: {
                x: x * 45,
                y: y * 30,
              },
            })
          );
        }
      }
    } else {
      //for laptops
      let coloumns = Math.floor(Math.random() * 8 + 5);
      let rows = Math.floor(Math.random() * 2 + 2);

      this.width = coloumns * 69;

      for (let x = 0; x < coloumns; x++) {
        for (let y = 0; y < rows; y++) {
          this.invaders.push(
            new Invader({
              position: {
                x: x * 75,
                y: y * 75,
              },
            })
          );
        }
      }
    }
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.velocity.y = 0.099;
    if (window.innerWidth <= 500 && window.innerWidth >= 315) {
      if (this.position.x + this.width >= canvas.width || this.position.x < 4) {
        this.velocity.x = -this.velocity.x;
        this.velocity.y = 25;
      }
    } else {
      if (this.position.x + this.width >= canvas.width || this.position.x < 0) {
        this.velocity.x = -this.velocity.x;
        this.velocity.y = 30;
      }
    }
  }
}

// calling a player
let player = new Player();

// projectile Array (fire)
let projectiles = [];

// calling grid into grid array
let grids = [];

// invader projecitles array (invadeers firs)
let invaderProjectiles = [];

// array for particles of invaders explosion
let particles = [];

// making key constant
let keys = {
  arrowLeft: {
    pressed: false,
  },
  arrowRight: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
  arrowup: {
    pressed: false,
  },
};

// making game over constant
let game = {
  over: false,
  active: true,
};

// frames variables new invaders
let frames = 0;

let randomInterval = Math.floor(Math.random() * 400 + 400);
console.log(randomInterval);

function createParticles({ object, color, fades }) {
  //  calling and pushing particle into particles array
  for (let i = 0; i < 15; i++) {
    particles.push(
      new Particle({
        position: {
          x: object.position.x + object.width / 2,
          y: object.position.y + object.height / 2,
        },

        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
        },
        radius: Math.random() * 3.8,
        color: color || "red",
        fades: true,
      })
    );
  }
}

// whole animation of the game
moving_btns.style.display = "none";

let animationId;
function animation() {
  if (!game.active) return;
  requestAnimationFrame(animation);

  c.fillStyle = "black";
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillRect(0, 0, canvas.width, canvas.height);

  // calling and rendering player
  player.update();

  // calling and rendering particles (invaders explosion)
  particles.forEach((particle, index) => {
    if (particle.position.y - particle.radius >= canvas.height) {
      particle.position.x = Math.random() * canvas.width;
      particle.position.y = -particle.radius;
    }

    if (particle.opacity <= 0) {
      setTimeout(() => {
        particles.splice(index, 1);
      }, 0);
    } else {
      particle.update();
    }
  });

  // calling and rendering invader projectiles
  invaderProjectiles.forEach((invaderProjectile, index) => {
    if (
      invaderProjectile.position.y + invaderProjectile.height >=
      canvas.height
    ) {
      setTimeout(() => {
        invaderProjectiles.splice(index, 1);
      }, 0);
    } else {
      invaderProjectile.update();
    }

    // collission detection b\w player and invader fire
    if (
      invaderProjectile.position.y + invaderProjectile.height >
        player.position.y &&
      player.position.x + player.width - 20 >= invaderProjectile.position.x &&
      player.position.x <= player.width + invaderProjectile.position.x - 110
    ) {
      console.log("you lose");
      setTimeout(() => {
        player.opacity = 0;
        invaderProjectiles.splice(index, 1);
        game.over = true;
        moving_btns.style.display = "none";
      }, 0);

      // stopping animation
      setTimeout(() => {
        game.active = false;
        UI.style.display = "flex";
      }, 1500);

      // sound for hitting player
      let hitingplayersound = document.createElement("audio");
      hitingplayersound.src = "hitinvader.wav";
      hitingplayersound.play();

      createParticles({ object: player, color: "red", fades: true });
    }
  });

  // calling and rendering each grid and into the grid callig and rendering invaders
  grids.forEach((grid) => {
    grid.update();

    // spawning invader projectiles
    if (frames % 70 === 0 && grid.invaders.length > 0) {
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
        invaderProjectiles
      );
    }

    grid.invaders.forEach((invader, i) => {
      invader.update({ velocity: grid.velocity });
      // in the grid.invader loop check collission detection bw each projectile and invader
      projectiles.forEach((projectile, j) => {
        setTimeout(() => {
          if (
            projectile.position.y - projectile.radius <=
              invader.position.y + invader.height &&
            projectile.position.x + projectile.radius >= invader.position.x &&
            projectile.position.x - projectile.radius <=
              invader.position.x + invader.width &&
            projectile.position.y + projectile.radius >= invader.position.y
          ) {
            setTimeout(() => {
              let invaderFound = grid.invaders.find(
                (invader2) => invader2 === invader
              );
              let projectileFound = projectiles.find(
                (projectile2) => projectile2 === projectile
              );

              points++;
              scoreboard.innerHTML = `${points} `;

              if (invaderFound && projectileFound) {
                createParticles({ object: invader, fades: true });
                // removing projectiles and invader
                grid.invaders.splice(i, 1);
                projectiles.splice(j, 1);

                // take into  account  new grid width
                if (grid.invaders.length > 0) {
                  let firstInvader = grid.invaders[0];
                  let lastInvader = grid.invaders[grid.invaders.length - 1];

                  grid.width =
                    lastInvader.position.x -
                    firstInvader.position.x +
                    lastInvader.width;
                  grid.position.x = firstInvader.position.x;
                }

                // ssound for hiting invader
                let hitinginvaderound = document.createElement("audio");
                hitinginvaderound.src = "hitinvader.wav";
                hitinginvaderound.play();
              }
            }, 0);
          }
        }, 0);
      });
    });
  });

  // calling and rendering each projrectiles and removing fires off the screen
  projectiles.forEach((projectile, index) => {
    if (projectile.position.y + projectile.radius <= 0) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    } else {
      projectile.update();
    }
  });

  // moving player left right within their canvas boundires
  let shipPadding = 25;

  if (window.innerWidth >= 500) {
    if (keys.arrowLeft.pressed && player.position.x >= -shipPadding) {
      player.velocity.x = -8.5;
      player.rotaion = -0.3;
    } else if (
      keys.arrowRight.pressed &&
      player.position.x + player.width <= canvas.width + shipPadding
    ) {
      player.velocity.x = 8.5;
      player.rotaion = 0.3;
    } else {
      player.velocity.x = 0;
      player.rotaion = 0;
    }
  } else {
    // controls  for mobile
    if (movelft && player.position.x >= -shipPadding) {
      player.velocity.x = -8.5;
      player.rotaion = -0.3;
    } else if (
      movergt &&
      player.position.x + player.width <= canvas.width + shipPadding
    ) {
      player.velocity.x = 8.5;
      player.rotaion = 0.3;
    } else {
      player.velocity.x = 0;
      player.rotaion = 0;
    }
  }

  // calling new invaders
  if (frames % randomInterval === 0) {
    grids.push(new Grid());
    randomInterval = Math.floor(Math.random() * 400 + 400);
    frames = 0;
  }

  frames++;
}
// animation();

// eventlistener for laptop
addEventListener("keydown", (e) => {
  if (game.over) return;
  switch (e.key) {
    case "ArrowLeft":
      keys.arrowLeft.pressed = true;
      break;

    case "ArrowRight":
      keys.arrowRight.pressed = true;
      break;

    case " ":

    case "ArrowUp":
      let popsound = document.createElement('audio');
      popsound.src = "plop.ogg";
      popsound.play();

      // pushing projectle to projectiles array when pressing spacebar
      projectiles.push(
        new Projectile({
          position: {
            x: player.position.x + player.width / 2,
            y: player.position.y + player.height - 90,
          },
          velocity: {
            x: 0,
            y: -12,
          },
        })
      );
      break;
  }
});

addEventListener("keyup", (e) => {
  switch (e.key) {
    case "ArrowLeft":
      keys.arrowLeft.pressed = false;
      break;

    case "ArrowRight":
      keys.arrowRight.pressed = false;
      break;

    case " ":
      break;
  }
});

// fire for mobile
let isFiring = false;
let firePointerID = null;
fireBtn.addEventListener("pointerdown", (e) => {
  if (!isFiring) {
    isFiring = true;
    firePointerID = e.pointerid;

    
  }
    
});

fireBtn.addEventListener("pointerup", (e) => {
  if (e.pointerid === firePointerID) {
    isFiring = false;
    firePointerID = null;

    projectiles.push(
      new Projectile({
        position: {
          x: player.position.x + player.width / 2,
          y: player.position.y + player.height / 2,
        },
        velocity: {
          x: 0,
          y: -8,
        },
      })
    );
  }
});

function newGame() {
  newGameBtn.addEventListener("click", () => {
    UI.style.display = "none";
    scoreboard.innerHTML = "00";

    moving_btns.style.display = "flex";

    points = 0;
    player = new Player();
    projectiles = [];
    grids = [];
    invaderProjectiles = [];
    particles = [];
    frames = 0;
    randomInterval = Math.floor(Math.random() * 400 + 400);

    game.over = false;
    game.active = true;

    // creating stars
    for (let i = 0; i < 100; i++) {
      particles.push(
        new Particle({
          position: {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
          },

          velocity: {
            x: 0,
            y: 1.5,
          },
          radius: Math.random() * 4,
          color: "white",
        })
      );
    }
    animation();
  });
}
newGame();

// btns for moving left for mobile
let movelft = false;
let movergt = false;

arrwo_lft_btn.addEventListener("touchstart", () => {
  player.velocity.x = -8.5;
  player.rotaion = -0.3;
  movelft = true;
});

arrwo_lft_btn.addEventListener("touchend", () => {
  player.velocity.x = 0;
  player.rotaion = 0;
  movelft = false;
});

// btns for moving right
arrwo_rgt_btn.addEventListener("touchstart", () => {
  player.velocity.x = -8.5;
  player.rotaion = -0.3;
  movergt = true;
});

arrwo_rgt_btn.addEventListener("touchend", () => {
  player.velocity.x = 0;
  player.rotaion = 0;
  movergt = false;
});
