import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GroundedSkybox } from './GroundedSkybox.js';//CUSTOM CLASS
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';//if i'll use draco compression
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

//LOADER OVERLAY
const loadingManager = new THREE.LoadingManager();

loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  const percent = Math.round((itemsLoaded / itemsTotal) * 100);
  document.getElementById('progress-bar').style.width = `${percent}%`;
  document.getElementById('progress-percent').textContent = `${percent}%`;
};

loadingManager.onLoad = () => {
  document.getElementById('loading-overlay').style.opacity = '0';
  setTimeout(() => {
    document.getElementById('loading-overlay').style.display = 'none';
  }, 400);
};

// Parameters for GUI(initial wale)
const params = {
    height: 15,
    radius: 100,
    enabled: true,
};

let camera, scene, renderer, skybox, gui, ground, carModel;

// Initialize everything
init().then(render);

async function init() {
    // Camera
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(-20, 7, 20);
    camera.lookAt(0, 4, 0);

    // Scene
    scene = new THREE.Scene();

    // Environment map (HDR)
    const hdrLoader = new RGBELoader(loadingManager);
    const envMap = await hdrLoader.loadAsync('Assets/textures/equirectangular/environmentTexture.hdr');
    envMap.mapping = THREE.EquirectangularReflectionMapping;

    // Grounded skybox
    skybox = new GroundedSkybox(envMap, params.height, params.radius);
    skybox.position.y = params.height - 0.01;
    scene.add(skybox);
    scene.environment = envMap;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 2, 0);
    controls.maxPolarAngle = THREE.MathUtils.degToRad(90);
    controls.maxDistance = 80;
    controls.minDistance = 20;
    controls.enablePan = false;
    controls.addEventListener('change', render);
    controls.update();

    // ground plane for REAL shadow(ie no the baked one)
    // const groundColor = 0xf2a280; // must match the HDR ground color (sand, grass, etc.)
    ground = new THREE.Mesh(
        new THREE.PlaneGeometry(500, 500),
        new THREE.ShadowMaterial({ opacity: 0.45 }) // Adjust opacity for shadow darkness/intensity ya jo bhi h
        // new THREE.MeshStandardMaterial({
            // color: groundColor,
            // transparent: true,
            // opacity: 0.6,
            // roughness: 1,
            // metalness: 0
        // })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);


    // Add lights
    const sun = new THREE.DirectionalLight(0xffffff, 2);
    sun.position.set(10, 20, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 100;
    sun.shadow.camera.left = -30;
    sun.shadow.camera.right = 30;
    sun.shadow.camera.top = 30;
    sun.shadow.camera.bottom = -30;
    scene.add(sun);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    // scene.add(new THREE.HemisphereLight(0xffffff, 0.5));

    // GUI
    gui = new GUI();
    gui.add(params, 'enabled').name('Grounded').onChange(toggleSkybox);
    gui.add(params, 'height', 5, 50).name('Height').onChange(updateSkyboxHeight);
    gui.add(params, 'radius', 50, 200).name('Radius').onChange(updateSkyboxRadius);
    gui.open();

    // Window resize
    window.addEventListener('resize', onWindowResize);

    // Load car model
    await loadCarModel();
}





async function loadCarModel() {
    // Draco loader setup
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('jsm/libs/draco/gltf/');

    // GLTF loader
    const loader = new GLTFLoader(loadingManager);
    loader.setDRACOLoader(dracoLoader);

    // Materials
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x000000, metalness: 1.0, roughness: 0.8,
        clearcoat: 1.0, clearcoatRoughness: 0.2
    });
    const detailsMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff, metalness: 1.0, roughness: 0.5
    });
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, metalness: 0.25, roughness: 0, transmission: 1.0
    });

    // Load the car model
    // loader.load('Assets/models/gltf/car.glb', function (gltf) { //callback-based fn h ye to, koi wait etc nhi karega for the model to load
    // with Promise wrapper
    const gltf = await new Promise((resolve, reject) => {
        loader.load(
            'Assets/models/gltf/car.glb',
            resolve,
            undefined,
            reject
        );
    });

    carModel = gltf.scene;
    carModel.scale.set(5, 5, 5);
    carModel.rotation.y = Math.PI;

    // Assign materials by index
    let i = 0;
    carModel.traverse(child => {
        if (child.isMesh) {
            if (i === 0) child.material = bodyMaterial;      // Body
            else if (i < 5) child.material = detailsMaterial; // Rims/trim
            else if (i === 5) child.material = glassMaterial; // Glass
            // Enable real-time shadow casting(ie not the baked fake thing)
            child.castShadow = true;
            child.receiveShadow = false;
            i++;
        }
    });

    scene.add(carModel);
    render();
}






// GUI callbacks -----------------------------------------------------------------------------------------------------------------------
function toggleSkybox(value) {
    if (value) {
        scene.add(skybox);
        scene.add(ground); // Show ground when grounded is enabled
        scene.background = null;
    } else {
        scene.remove(skybox);
        scene.remove(ground); // Hide ground when grounded is disabled
        scene.background = scene.environment;
    }
    render();
}

function updateSkyboxHeight(value) {
    if (skybox) {
        skybox.height = value;
        skybox.position.y = value - 0.01;
        render();
    }
}

function updateSkyboxRadius(value) {
    if (skybox) {
        skybox.radius = value;
        render();
    }
}
//------------------------------------------------------------------------------------------------------------------------


// Window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

// Render function
function render() {
    renderer.render(scene, camera);
}
