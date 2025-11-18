/*--------------------------------------------------------------------------------
Homework 09
    2021147531 조윤성
    2023193004 태호성
    2023193009 김명재
----------------------------------------------------------------------------------*/

import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { initRenderer, initCamera, initStats, initOrbitControls, 
         initDefaultLighting, addGeometry, } from './util.js';

const scene = new THREE.Scene();
const renderer = initRenderer();
let camera = initCamera(new THREE.Vector3(120, 60, 80));
let orbitControls = initOrbitControls(camera, renderer);
const stats = initStats();

initDefaultLighting(scene);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const textureLoader = new THREE.TextureLoader();

class Planet {
    constructor(scene, name, radius, dist, orbitSpeed, rotationSpeed, color, texturePath) {
        this.name = name;
        this.radius = radius;
        this.dist = dist;

        this.orbitSpeed = orbitSpeed;
        this.rotationSpeed = rotationSpeed;
        this.angle = 0;

        // Geometry
        const geometry = new THREE.SphereGeometry(radius);

        // Material
        const material = new THREE.MeshStandardMaterial({
            color: color,
            map: texturePath ? textureLoader.load(texturePath) : null
        });

        // Mesh
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.x = dist;
        this.mesh.castShadow = true;
        scene.add(this.mesh);

        // GUI parameters
        this.params = {
            orbit: orbitSpeed,
            rotation: rotationSpeed
        };
    }

    update() {
        // 공전
        this.angle += this.params.orbit;
        this.mesh.position.x = Math.cos(this.angle) * this.dist;
        this.mesh.position.z = Math.sin(this.angle) * this.dist;

        // 자전
        this.mesh.rotation.y += this.params.rotation;
    }
}
const sunGeo = new THREE.SphereGeometry(10);
const sunMesh = addGeometry(scene, sunGeo);
sunMesh.material = new THREE.MeshStandardMaterial({
    color: 0xFFD700,          
    emissive: 0xFFFF00,       
    emissiveIntensity: 1.5,   
});

const mercury = new Planet(
    scene, "Mercury", 1.5, 20, 0.02, 0.02, '#6a6a6a', './Mercury.jpg'
);

const venus = new Planet(
    scene, "Venus", 3.0, 35, 0.015, 0.02, '#e39e1c', './Venus.jpg'
);

const earth = new Planet(
    scene, "Earth", 3.5, 50, 0.01, 0.01, '#3498db', './Earth.jpg'
);

const mars = new Planet(
    scene, "Mars", 2.5, 65, 0.008, 0.008, '#c0392b', './Mars.jpg'
);

const gui = new GUI();
// Camera Folder
const controls = new function () {
    this.perspective = "Perspective";
    this.switchCamera = function () {
        if (camera instanceof THREE.PerspectiveCamera) {
            scene.remove(camera);
            camera = null; // 기존의 camera 제거    
            // OrthographicCamera(left, right, top, bottom, near, far)
            camera = new THREE.OrthographicCamera(window.innerWidth / -16, 
                window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / -16, -200, 500);
            camera.position.x = 120;
            camera.position.y = 60;
            camera.position.z = 180;
            camera.lookAt(scene.position);
            orbitControls.dispose(); // 기존의 orbitControls 제거
            orbitControls = null;
            orbitControls = new OrbitControls(camera, renderer.domElement);
            orbitControls.enableDamping = true;
            this.perspective = "Orthographic";
        } else {
            scene.remove(camera);
            camera = null; 
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.x = 120;
            camera.position.y = 60;
            camera.position.z = 180;
            camera.lookAt(scene.position);
            orbitControls.dispose(); // 기존의 orbitControls 제거
            orbitControls = null;
            orbitControls = new OrbitControls(camera, renderer.domElement);
            orbitControls.enableDamping = true;
            this.perspective = "Perspective";
        }
    };
};
gui.add(controls, 'switchCamera').name("Switch Camera Type");
gui.add(controls, 'perspective').name("Current Camera").listen();

// Mercury Folder
const mercuryFolder = gui.addFolder("Mercury");
mercuryFolder.add(mercury.params, "orbit", 0.001, 0.05).name("Orbit Speed");
mercuryFolder.add(mercury.params, "rotation", 0.001, 0.05).name("Rotation Speed");

// Venus Folder
const venusFolder = gui.addFolder("Venus");
venusFolder.add(venus.params, "orbit", 0.001, 0.05).name("Orbit Speed");
venusFolder.add(venus.params, "rotation", 0.001, 0.05).name("Rotation Speed");

// Earth Folder
const earthFolder = gui.addFolder("Earth");
earthFolder.add(earth.params, "orbit", 0.001, 0.05).name("Orbit Speed");
earthFolder.add(earth.params, "rotation", 0.001, 0.05).name("Rotation Speed");

// Mars Folder
const marsFolder = gui.addFolder("Mars");
marsFolder.add(mars.params, "orbit", 0.001, 0.05).name("Orbit Speed");
marsFolder.add(mars.params, "rotation", 0.001, 0.05).name("Rotation Speed");

function render() {
    mercury.update();
    venus.update();
    earth.update();
    mars.update();

    stats.update();
    orbitControls.update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
render();