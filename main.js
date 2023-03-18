import "./style.css";
import * as THREE from "three";

//canvas
const canvas = document.querySelector("#webgl");

//シーン
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const bgTexture = textureLoader.load("/bg.jpg");
scene.background = bgTexture;

//サイズ
const sizes = {
    width: innerWidth,
    height: innerHeight,
};

//カメラ
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    1000
);

//レンダラー
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

// オブジェクトの作成
const boxGeometry = new THREE.BoxGeometry(5, 5, 5,10);
const boxMaterial = new THREE.MeshNormalMaterial();
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 0, -15);
box.rotation.set(1, 1, 0);

const torusGeometry = new THREE.TorusGeometry(8,2,16,100);
const torusMaterial = new THREE.MeshNormalMaterial();
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(0,1, 10);

scene.add(box, torus);

// スクロールアニメーション
const animationScripts = [];

animationScripts.push({
    start: 0,
    end: 40,
    function() {
        camera.lookAt(box.position);
        camera.position.set(0, 1, 10);
        box.position.z += 0.01;
    },
});

// スクロールアニメーションを実行する関数
const playScrollAnimation = () => {
    animationScripts.forEach((script) => {
        script.function();
    });
};


//アニメーション
const tick = () => {
    window.requestAnimationFrame(tick);
    playScrollAnimation();
    renderer.render(scene, camera);
};

tick();

//ブラウザのリサイズ操作
window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);
});
