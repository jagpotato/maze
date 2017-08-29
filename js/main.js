// cannon.js
// 物理演算ワールド
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);       //重力を設定
world.broadphase = new CANNON.NaiveBroadphase();    //ぶつかっている可能性のあるオブジェクト同士を見つける
world.solver.iterations = 8;        //反復計算回数
world.solver.tolerance = 0.1;       //許容値

// ボックス
const boxMass = 1;
const boxShape = new CANNON.Box(new CANNON.Vec3(6.1, 6.1, 6.1));
const phyBox = new CANNON.Body({mass: boxMass, shape: boxShape});
phyBox.position.y = 6.1;
phyBox.angularVelocity.set(0.1, 0.1, 0.1);   //角速度
phyBox.angularDamping = 0.1;　　　       //減衰率
world.addBody(phyBox);

// 床
const planeMass = 0;
const planeShape = new CANNON.Plane();
const phyPlane = new CANNON.Body({mass: planeMass, shape: planeShape});
phyPlane.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);   //X軸に９０度回転
world.addBody(phyPlane);


// シーン
const scene = new THREE.Scene();
// カメラ
const width = 600;
const height = 400;
const fov = 60;
const aspect = width / height;
const near = 1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(10, 30, 50);
// OrbitControls
const controls = new THREE.OrbitControls(camera);
// レンダラー
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.setClearColor(0xefefef);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);
// ライト
const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(20, 20, 20);
directionalLight.castShadow = false;
scene.add(directionalLight);
// 環境光
const ambient = new THREE.AmbientLight(0x666666);
scene.add(ambient);

const boxGeometry = new THREE.BoxGeometry(12,12,12);
const boxMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.castShadow = true;
// box.position.set(0, 0, 0);
scene.add(box);

const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
const planeMaterial = new THREE.MeshLambertMaterial({color: 0x00cc00});
planeMaterial.side = THREE.DoubleSide;
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.castShadow = true;
plane.receiveShadow = true;
scene.add(plane);






// レンダリング
render();
function render() {
  requestAnimationFrame(render);
  world.step(1 / 60);
  box.position.copy(phyBox.position);
  box.quaternion.copy(phyBox.quaternion);
  plane.position.copy(phyPlane.position);
  plane.quaternion.copy(phyPlane.quaternion);
  controls.update();
  renderer.render(scene, camera);
}
