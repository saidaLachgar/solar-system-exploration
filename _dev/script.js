import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let media_query = window.matchMedia("(min-width: 768px)");
if (media_query.matches) { // If media query matches
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

        // textures
        const loader = new THREE.TextureLoader()
        loader.setPath( '../_dev/textures/' )
        const earthTexture = loader.load('2k_earth.jpg');
        const geometry = new THREE.SphereGeometry(200, 200, 50);
        const material = new THREE.MeshBasicMaterial({ map: earthTexture });
        mesh = new THREE.Mesh(geometry, material);    

        scene.add(mesh);
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas: canvas });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        planetsText(-90);
        window.addEventListener('resize', onWindowResize);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.listenToKeyEvents(window); // optional
        // controls.addEventListener('change', render); 
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.rotateSpeed = 0.1;
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        planetsText(-90);
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

    function planetsText(angleoffset){
        const numLetters= 60,
            angleSpan= 184,
            circSize= [document.querySelector('canvas.planet').height + 100],
            anglePerChar = angleSpan / numLetters;

        for (let i = 0; i < numLetters; i++) {
            document.querySelectorAll(".circular-text span")[i].style.cssText = "width: "+circSize+"px;height: "+circSize+"px;transform: rotate("+[angleoffset+anglePerChar*i]+"deg) translatex("+[circSize/2]+"px);";
        }
        document.querySelector(".circular-text").style.cssText = "width: "+circSize+"px;height: "+circSize+"px;";
        document.querySelector(".circle").style.cssText = "width: "+[circSize - 50]+"px;height: "+[circSize - 50]+"px;";
    }

    var d = 0;
    fetch('../_dev/data.json')
    .then(response => response.json())
    .then(data => {
        data.Planets.forEach(function(e) {
            for (let i = d; i < [d + e.name.length + 1]; i++) {
                document.querySelector(".char"+i).setAttribute('data-rotation',( getCurrentRotation(".char"+[ d + Math.floor(e.name.length / 2)])* (-1) ));
                document.querySelector(".char"+i).setAttribute('data-info',[e.name, e.image,e.Gravity,e.DayHours,e.DistanceFromSun,e.Fact]);
            }
            d+=e.name.length + 1;
        });
    });

    [...document.querySelectorAll('[class*=char]')].forEach(function(item) {
        item.addEventListener('click', function() {
            if( getCurrentRotation(".circular-text") != this.getAttribute('data-rotation')){
                [...document.querySelectorAll('[data-rotation]')].forEach(function(item) {
                    item.style.opacity= 0.5;
                });
                [...document.querySelectorAll('[data-rotation="'+this.getAttribute('data-rotation')+'"]')].forEach(function(item) {
                    item.style.opacity= 1;
                });
                document.querySelector(".circular-text").style.transform="rotate("+this.getAttribute('data-rotation')+"deg)";
                var info= this.getAttribute('data-info').split(',');
                mesh.material.map.image.src = "../_dev/textures/"+info[1]+".jpg";
                mesh.material.map.needsUpdate = true;
                document.querySelector("#fact").innerHTML = info[5];
                animateValue("DistanceFromSun", info[4]);
                animateValue("Gravity", info[2]);
                animateValue("DayHours",info[3]);
                animateText(info[0]);
            }
        });
    });
    function getCurrentRotation( elid ) {
        var el = document.querySelector(elid);
        var st = window.getComputedStyle(el, null);
        var tr = st.getPropertyValue("-webkit-transform") ||
            st.getPropertyValue("-moz-transform") ||
            st.getPropertyValue("-ms-transform") ||
            st.getPropertyValue("-o-transform") ||
            st.getPropertyValue("transform") ||
            "fail...";
        if( tr !== "none") {
            var values = tr.split('(')[1];
            values = values.split(')')[0];
            values = values.split(',');
            var a = values[0],
                b = values[1],
                radians = Math.atan2(b, a),
                angle = Math.round( radians * (180/Math.PI));
        } else {
        var angle = 0;
        }
        return angle;
    }

    function animateValue(elmID, end) {
        var obj = document.getElementById(elmID),
            start = Number(obj.innerHTML);
        let startTimestamp = null;
        const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / 1000, 1);
        let value = progress * (Number(end) - start) + start;
        obj.innerHTML = value.toFixed(1);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
        };
        window.requestAnimationFrame(step);
    }

    function animateText(word){
        const timeout = document.querySelectorAll('#name > div').length * 100;
        [].forEach.call(document.querySelectorAll('#name > div'), function(letter) {
            letter.style.transform="";
            letter.classList.add("hide");
        });
        setTimeout(function(){ 
            document.getElementById('name').innerHTML = "";
            for (var l = 0; l <= word.length ; l++) {
            var e = document.createElement('div');
            e.innerHTML = word.charAt(l);
            e.style.transform="rotateX(90deg)";
            e.classList.add("show");
            document.getElementById('name').appendChild(e);
            }
        }, timeout); 
    }
}