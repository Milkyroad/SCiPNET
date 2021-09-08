//credit: https://codepen.io/dilums/pen/pooQZrg
window.runDNA = () => {
  let renderer;
  let scene;
  let particles;
  const {
    sin,
    cos
  } = Math;
  const DENSITY_RADIOUS = 20;
  const PHASE_SHIFT = 120;
  let allPoints = []
  const connectionPoints = [];

  const rad = deg => (deg / 180) * Math.PI;
  const getRandomPoint = () => DENSITY_RADIOUS * Math.random() - (DENSITY_RADIOUS / 2);
  const range = x => Array(x).fill(0).map((_, index) => index)
  const norm = (val, min, max) => (val - min) / (max - min)
  const lerp = (nrm, min, max) => (max - min) * nrm + min
  const lerpMap = (val, sMin, sMax, dMin, dMax) => lerp(norm(val, sMin, sMax), dMin, dMax)

  const init = () => {
    renderer = new THREE.WebGLRenderer({
      alpha: true
    });
    document.getElementById("dnaContainer").appendChild(renderer.domElement);
    renderer.setSize($("#dnaContainer").width(), $("#dnaContainer").height());
    camera = new THREE.PerspectiveCamera(
      15,
      200 / 100,
      1,
      5000
    );
    camera.position.z = 1200;
    scene = new THREE.Scene();
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = 10;
    controls.maxDistance = 1200;
  };

  const addParticles = particleArray => {
    const geometry = new THREE.Geometry();
    particleArray.forEach(particle => {
      geometry.vertices.push(particle)
    });
    const material = new THREE.PointsMaterial({
      size: 0.2,
      opacity: 0.9,
      alphaTest: 0.4,
      transparent: true
    });
    material.color.setHex('0x'+color.substring(1));
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
  };

  const getPoints = p => {
    const {
      x,
      y,
      z
    } = p;
    return range(10).map(() => ({
      x: x + getRandomPoint(),
      y: y + getRandomPoint(),
      z: z + getRandomPoint()
    }));
  };

  const getCirclePoins = a => {
    const angle = rad(a);
    const r = 130;
    const x = r * sin(angle);
    const z = r * cos(angle);
    return {
      x,
      z
    };
  };

  const addConnection = ({
    pa,
    pb
  }) => {
    const connectionDensity = 100
    const connectionPoints = range(connectionDensity).reduce(
      (acc, i) => [
        ...acc,
        ...getPoints({
          x: lerpMap(i, 0, connectionDensity, pa.x, pb.x),
          y: pa.y,
          z: lerpMap(i, 0, connectionDensity, pa.z, pb.z)
        })
      ],
      []
    );
    allPoints = allPoints.concat(connectionPoints)
  };

  const calculateDnaPoints = () => {
    range(360).forEach(a => {
      const pa = {
        ...getCirclePoins(a),
        y: 1.5 * (a - 180)
      };
      const pb = {
        ...getCirclePoins(a + PHASE_SHIFT),
        y: 1.5 * (a - 180)
      };
      allPoints = allPoints.concat(getPoints(pa))
      allPoints = allPoints.concat(getPoints(pb))
      if (a % 36 === 0) {
        connectionPoints.push({
          pa,
          pb
        });
      }
    });
    connectionPoints.map(i => addConnection(i));
  }

  init();
  calculateDnaPoints()
  addParticles(allPoints)


  particles.rotation.z = Math.PI / 2;
  const loop = () => {
    particles.rotation.x += 0.01
    requestAnimationFrame(loop)
    renderer.render(scene, camera);
  }

  loop()

}
