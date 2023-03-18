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
const boxGeometry = new THREE.BoxGeometry(5, 5, 5, 10);
const boxMaterial = new THREE.MeshNormalMaterial();
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 0, -15);
box.rotation.set(1, 1, 0);

const torusGeometry = new THREE.TorusGeometry(8, 2, 16, 100);
const torusMaterial = new THREE.MeshNormalMaterial();
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(0, 1, 10);

scene.add(box, torus);

// 移動用の関数
function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}
function scalePercent(start, end) {
    return (scrollPercent - start) / (end - start);
}

// スクロールアニメーション
const animationScripts = [];

animationScripts.push({
    start: 0,
    end: 40,
    function() {
        camera.lookAt(box.position);
        camera.position.set(0, 1, 10);
        box.position.z = lerp(-15, 2, scalePercent(0, 40));
        torus.position.z = lerp(10, -20, scalePercent(0, 40));
    },
});

// スクロールアニメーションを実行する関数
const playScrollAnimation = () => {
    animationScripts.forEach((script) => {
        if (scrollPercent >= script.start && scrollPercent <= script.end) {
            script.function();
        }
    });
};

// ブラウザのスクロール率を取得
let scrollPercent = 0;
document.body.onscroll = () => {
    const scroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    scrollPercent = (scroll / height) * 100;
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
