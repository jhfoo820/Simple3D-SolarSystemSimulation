const canvas = document.getElementById('solarSystemCanvas');
const ctx = canvas.getContext('2d');

let canvasWidth, canvasHeight;
let isPaused = false;

const planets = [
    { name: 'Mercury', orbitRadius: 60, orbitalPeriod: 88, color: 'gray', angle: 0, moons: 0, distanceFromEarth: 77, size: 3 },
    { name: 'Venus', orbitRadius: 100, orbitalPeriod: 225, color: 'orange', angle: 0, moons: 0, distanceFromEarth: 41, size: 6 },
    { name: 'Earth', orbitRadius: 140, orbitalPeriod: 365, color: 'blue', angle: 0, moons: 1, distanceFromEarth: 0, size: 6 },
    { name: 'Mars', orbitRadius: 180, orbitalPeriod: 687, color: 'red', angle: 0, moons: 2, distanceFromEarth: 78, size: 5 },
    { name: 'Jupiter', orbitRadius: 300, orbitalPeriod: 4333, color: 'yellow', angle: 0, moons: 95, distanceFromEarth: 628, size: 12 },
    { name: 'Saturn', orbitRadius: 400, orbitalPeriod: 10759, color: 'lightgray', angle: 0, moons: 146, distanceFromEarth: 1275, size: 10 },
    { name: 'Uranus', orbitRadius: 500, orbitalPeriod: 30688, color: 'cyan', angle: 0, moons: 28, distanceFromEarth: 2724, size: 9 },
    { name: 'Neptune', orbitRadius: 600, orbitalPeriod: 60200, color: 'blue', angle: 0, moons: 16, distanceFromEarth: 4351, size: 9 }
  ];  

let stars = [];
let asteroids = [];

function generateAsteroids(count = 300) {
  asteroids = [];
  for (let i = 0; i < count; i++) {
    const orbitRadius = 210 + Math.random() * 40; // Between Mars and Jupiter
    const angle = Math.random() * 360;
    const speed = 0.05 + Math.random() * 0.1;
    asteroids.push({ orbitRadius, angle, speed });
  }
}

function resizeCanvas() {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  generateStars();
}

function generateStars() {
  stars = [];
  for (let i = 0; i < 300; i++) {
    stars.push({ x: Math.random() * canvasWidth, y: Math.random() * canvasHeight });
  }
}

function drawStars() {
  ctx.fillStyle = 'white';
  for (const star of stars) {
    ctx.fillRect(star.x, star.y, 1, 1);
  }
}

// Helper function to convert degrees to radians
Math.toRadians = function(degrees) {
  return degrees * Math.PI / 180;
};

function drawPlanets() {
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  const tilt = 0.5; // Y-axis tilt for fake 3D perspective

  // Draw elliptical orbits
  for (const planet of planets) {
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, planet.orbitRadius, planet.orbitRadius * tilt, 0, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.stroke();
  }

  // Draw the Sun
  ctx.beginPath();
  ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
  ctx.fillStyle = 'yellow';
  ctx.fill();

  // Sort planets based on their vertical position for proper depth layering
  const sortedPlanets = [...planets].sort((a, b) => {
    const yA = centerY + a.orbitRadius * Math.sin(Math.toRadians(a.angle)) * tilt;
    const yB = centerY + b.orbitRadius * Math.sin(Math.toRadians(b.angle)) * tilt;
    return yA - yB;
  });

  for (const planet of sortedPlanets) {
    planet.angle = (planet.angle + 360 / planet.orbitalPeriod) % 360;
    const x = centerX + planet.orbitRadius * Math.cos(Math.toRadians(planet.angle));
    const y = centerY + planet.orbitRadius * Math.sin(Math.toRadians(planet.angle)) * tilt;

    // Fake perspective: scale based on y-depth
    const depthScale = 1 + 0.3 * (y - centerY) / canvasHeight;
    const size = planet.size * depthScale;

    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fillStyle = planet.color;
    ctx.fill();

    // Optional: draw planet name
    ctx.fillStyle = 'white';
    ctx.font = '12px sans-serif';
    ctx.fillText(planet.name, x + 8, y);
  }
}

function drawAsteroids() {
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const tilt = 0.5;
  
    for (const asteroid of asteroids) {
      asteroid.angle = (asteroid.angle + asteroid.speed) % 360;
      const x = centerX + asteroid.orbitRadius * Math.cos(Math.toRadians(asteroid.angle));
      const y = centerY + asteroid.orbitRadius * Math.sin(Math.toRadians(asteroid.angle)) * tilt;
  
      // Scale asteroid size based on depth
      const depthScale = 1 + 0.3 * (y - centerY) / canvasHeight;
      const size = 1.5 * depthScale;
  
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fillStyle = 'lightgray';
      ctx.fill();
    }
  }
  

  function handleMouseClick(event) {
    const clickX = event.clientX;
    const clickY = event.clientY;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const tilt = 0.5;
    const infoBox = document.getElementById('planetInfoBox');
  
    let clickedPlanet = null;
  
    for (const planet of planets) {
      const x = centerX + planet.orbitRadius * Math.cos(Math.toRadians(planet.angle));
      const y = centerY + planet.orbitRadius * Math.sin(Math.toRadians(planet.angle)) * tilt;
      const distance = Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2);
  
      if (distance < planet.size + 5) {
        clickedPlanet = { ...planet, screenX: x, screenY: y };
        break;
      }
    }
  
    if (clickedPlanet) {
      infoBox.innerHTML = `
        <strong>🌍 ${clickedPlanet.name}</strong><br>
        🪐 <b>Moons:</b> ${clickedPlanet.moons}<br>
        🌀 <b>Orbital Period:</b> ${clickedPlanet.orbitalPeriod} days<br>
        📏 <b>Orbit Radius:</b> ${clickedPlanet.orbitRadius} units<br>
        🚀 <b>From Earth:</b> ${clickedPlanet.distanceFromEarth} million km
      `;
  
      infoBox.style.left = `${clickX + 15}px`;
      infoBox.style.top = `${clickY + 15}px`;
      infoBox.style.opacity = 1;
    } else {
      infoBox.style.opacity = 0;
    }
  }
  

function animate() {
  if (isPaused) return;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawStars();
  drawAsteroids();
  drawPlanets();
  requestAnimationFrame(animate);
}

resizeCanvas();
generateStars();
generateAsteroids();
animate();

window.addEventListener('resize', resizeCanvas);
canvas.addEventListener('click', handleMouseClick);
canvas.addEventListener('dblclick', () => {
  isPaused = !isPaused;
  if (!isPaused) animate();
});
