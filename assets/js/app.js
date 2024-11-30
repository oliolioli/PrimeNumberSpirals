// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
import "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html"
// Establish Phoenix Socket and LiveView configuration.
import {Socket} from "phoenix"
import {LiveSocket} from "phoenix_live_view"
import topbar from "../vendor/topbar"

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let liveSocket = new LiveSocket("/live", Socket, {
  longPollFallbackMs: 2500,
  params: {_csrf_token: csrfToken}
})

// Show progress bar on live navigation and form submits
topbar.config({barColors: {0: "#29d"}, shadowColor: "rgba(0, 0, 0, .3)"})
window.addEventListener("phx:page-loading-start", _info => topbar.show(300))
window.addEventListener("phx:page-loading-stop", _info => topbar.hide())

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket



// ### THREE.js ###

import * as THREE from 'three';

let scene; // Declare `scene` in the outer scope

  function initThreeJs() {
  // Set up scene, camera, and renderer
  scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Grid setup
  const gridSize = 10;
  const gridDivisions = 100;
  const gridHelper = new THREE.GridHelper(gridSize, gridDivisions);
  gridHelper.rotation.x = Math.PI / 2; // Rotate to X-Y plane
  scene.add(gridHelper);

  // Camera setup
  const aspectRatio = window.innerWidth / window.innerHeight;
  const gridScale = 0.9; // 90% of the screen
  const gridFullSize = gridSize * gridScale;

  const camera = new THREE.OrthographicCamera(
    -gridFullSize * aspectRatio / 2,
    gridFullSize * aspectRatio / 2,
    gridFullSize / 2,
    -gridFullSize / 2,
    0.1,
    100
  );
  camera.position.set(0, 0, 10); // Z position
  camera.lookAt(0, 0, 0);
  scene.add(camera);


  // Handle resizing
  window.addEventListener('resize', () => {
    const aspectRatio = window.innerWidth / window.innerHeight;

    camera.left = -gridFullSize * aspectRatio / 2;
    camera.right = gridFullSize * aspectRatio / 2;
    camera.top = gridFullSize / 2;
    camera.bottom = -gridFullSize / 2;

    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Render loop
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
}


// Function to add a point to the grid
function addPoint(x, y, scene) {
  const pointGeometry = new THREE.SphereGeometry(0.1, 16, 16); // Small sphere with radius 0.1
  const pointMaterial = new THREE.MeshBasicMaterial({ color: 0x336699 });
  const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);
  pointMesh.position.set(x, y, 0); // Place the point at (x, y, z=0)
  scene.add(pointMesh); // Add the point to the scene
}


// Exported function to add incoming points from user_socket.js
export function addPointToGrid(x, y) {
  console.log("Received point:" + x + " and " + y);

  addPoint(x, y, scene);
}

document.addEventListener("DOMContentLoaded", initThreeJs);