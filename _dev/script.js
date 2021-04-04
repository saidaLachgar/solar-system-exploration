import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import * as data from './data.json';

let camera, scene, renderer;
let mesh;

init();
animate();

function init() {
    // Canvas
    const canvas = document.querySelector('canvas.planet')
    // camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 400;
    scene = new THREE.Scene();

    // original
    // material.map = THREE.ImageUtils.loadTexture('images/earthmap1k.jpg');
    // //black
    // material.bumpMap = THREE.ImageUtils.loadTexture('images/earthbump1k.jpg');
    // material.bumpScale = 0.05;
    // //white black
    // material.specularMap = THREE.ImageUtils.loadTexture('images/earthspec1k.jpg')
    // material.specular = new THREE.Color('grey')
    // // Cloud Layer
    // var geometry = new THREE.SphereGeometry(0.51, 32, 32)
    // var material = new THREE.MeshPhongMaterial({
    //     map: new THREE.Texture(canvasCloud),
    //     side: THREE.DoubleSide,
    //     opacity: 0.8,
    //     transparent: true,
    //     depthWrite: false,
    // });
    // var cloudMesh = new THREE.Mesh(geometry, material)
    // earthMesh.add(cloudMesh)

    
    
    // textures
    const loader = new THREE.TextureLoader()
    const earthTexture = loader.load('../_dev/textures/2k_earth.jpg');
    const geometry = new THREE.SphereGeometry(200, 200, 50);
    const material = new THREE.MeshBasicMaterial({ map: earthTexture });
    mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas: canvas });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    planetsText();
    window.addEventListener('resize', onWindowResize);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.listenToKeyEvents(window); // optional
    controls.addEventListener('change', render); // call this only in static scenes (i.e., if there is no animation loop)
    controls.enableZoom = false;
    controls.rotateSpeed = 0.1;
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    planetsText();

}

function animate() {

    requestAnimationFrame(animate);

    mesh.rotation.x += 0.001;
    mesh.rotation.y += 0.001;

    renderer.render(scene, camera);

}

function render() {
    renderer.render(scene, camera);
}

function planetsText(){
    const numLetters= 60,
        angleSpan= 180,
        angleoffset= -90,
        circSize= [document.querySelector('canvas.planet').height + 100],
        anglePerChar = angleSpan / numLetters;

    for (let i = 0; i < numLetters; i++) {
        document.querySelectorAll(".circular-text span")[i].style.cssText = "width: "+circSize+"px;height: "+circSize+"px;transform: rotate("+[angleoffset+anglePerChar*i]+"deg) translatex("+[circSize/2]+"px);";
    }
    document.querySelector(".circular-text").style.cssText = "width: "+circSize+"px;height: "+circSize+"px;";
}
