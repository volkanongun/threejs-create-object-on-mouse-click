import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

import starsTexture from '../img/stars.jpg';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0,6,6);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, .8);
scene.add(directionalLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture
]);

const helper = new THREE.AxesHelper(20)
scene.add(helper)

const mouse = new THREE.Vector2()
const intersectionPoint = new THREE.Vector3()
const planeNormal = new THREE.Vector3()
const plane = new THREE.Plane()
const reaycaster = new THREE.Raycaster()

window.addEventListener('click', function(e){
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1
    planeNormal.copy(camera.position).normalize()
    plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position)
    reaycaster.setFromCamera(mouse, camera)
    reaycaster.ray.intersectPlane(plane, intersectionPoint)

    const sphereMesh = new THREE.Mesh(new THREE.SphereGeometry(0.125, 30, 30), new THREE.MeshStandardMaterial({
        color: 0xffea00,
        metalness: 0,
        roughness: 0
    }))
    scene.add(sphereMesh)
    sphereMesh.position.copy(intersectionPoint)
})

function animate() {
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});