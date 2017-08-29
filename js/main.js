// cannon.js
// 物理演算ワールド
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);       //重力を設定
world.broadphase = new CANNON.NaiveBroadphase();    //ぶつかっている可能性のあるオブジェクト同士を見つける
world.solver.iterations = 8;        //反復計算回数
world.solver.tolerance = 0.1;       //許容値

// 箱
const boxMass = 1;
const boxShape = new CANNON.Box(new CANNON.Vec3(6.1, 6.1, 6.1));
const phyBox = new CANNON.Body({mass: boxMass, shape: boxShape});
phyBox.position.y = 110;
phyBox.angularVelocity.set(0.1, 0.1, 0.1);   //角速度
phyBox.angularDamping = 0.1;　　　       //減衰率
world.addBody(phyBox);

// 床
const planeMass = 0;
const planeShape = new CANNON.Plane();
const phyPlaneMaterial = new CANNON.Material('phyPlaneMaterial');
const phyPlane = new CANNON.Body({mass: planeMass, shape: planeShape, material: phyPlaneMaterial});
phyPlane.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);   //X軸に９０度回転
phyPlane.position.set(0, 0, 0);
world.addBody(phyPlane);

const floorMass = 0;
const floorShape = new CANNON.Box(new CANNON.Vec3(50, 50, 1));
const phyFloorMaterial = new CANNON.Material('phyFloorMaterial');
const phyFloor = new CANNON.Body({mass: floorMass, shape: floorShape, material: phyFloorMaterial});
phyFloor.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);   //X軸に９０度回転
phyFloor.position.set(0, 100, 0);
world.addBody(phyFloor);


// 球
const sphereMass = 1;
const sphereShape = new CANNON.Sphere(2);
const phySphereMaterial = new CANNON.Material('phySphereMaterial');
const phySphere = new CANNON.Body({mass: sphereMass, shape: sphereShape, material: phySphereMaterial});
phySphere.position.set(0, 110, 20);
phySphere.angularVelocity.set(0, 0, 0);
phySphere.angularDamping = 0.1;
world.add(phySphere);



const contactSphereFloor = new CANNON.ContactMaterial(
  phyFloorMaterial,
  phySphereMaterial,
  {friction: 0.9, restitution: 0.1}
);
world.addContactMaterial(contactSphereFloor);

// three.js
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
camera.position.set(0, 150, 200);
// camera.rotation.set(-Math.PI / 2, 0, 0);
// OrbitControls
// const controls = new THREE.OrbitControls(camera);
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

// 箱
const boxGeometry = new THREE.BoxGeometry(12, 12, 12);
const boxMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.castShadow = true;
// box.position.set(0, 0, 0);
scene.add(box);

// 床
const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
const planeMaterial = new THREE.MeshLambertMaterial({color: 0xdddddd});
planeMaterial.side = THREE.DoubleSide;
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.castShadow = true;
plane.receiveShadow = true;
scene.add(plane);

const floorGeometry = new THREE.BoxGeometry(100, 100, 1);
const floorMaterial = new THREE.MeshPhongMaterial({color: 0xffccff, transparent: false, opacity: 0.8});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.castShadow = true;
scene.add(floor);

// 球
const sphereGeometry = new THREE.SphereGeometry(2);
const sphereMaterial = new THREE.MeshPhongMaterial({color: 0xff0000});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// レンダリング
render();
function render() {
  console.log(phySphere.angularVelocity);
  requestAnimationFrame(render);
  world.step(1 / 60);
  box.position.copy(phyBox.position);
  box.quaternion.copy(phyBox.quaternion);
  plane.position.copy(phyPlane.position);
  plane.quaternion.copy(phyPlane.quaternion);
  floor.position.copy(phyFloor.position);
  floor.quaternion.copy(phyFloor.quaternion);
  sphere.position.copy(phySphere.position);
  sphere.quaternion.copy(phySphere.quaternion);
  // controls.update();

  window.addEventListener("keydown", function(e) {
    if ( e.keyCode == 38 ) {
      // phySphere.angularVelocity.set(-7, 0, 0);
      let f = new CANNON.Vec3(0, 0, -0.3);
      phySphere.applyForce(f, phySphere.position);
    }
    if ( e.keyCode == 40 ) {
      // phySphere.angularVelocity.set(7, 0, 0);
      let f = new CANNON.Vec3(0, 0, 0.3);
      phySphere.applyForce(f, phySphere.position);
    }
    if ( e.keyCode == 39 ) {
      // phySphere.angularVelocity.set(0, 0, -7);
      let f = new CANNON.Vec3(0.3, 0, 0);
      phySphere.applyForce(f, phySphere.position);
    }
    if ( e.keyCode == 37 ) {
      // phySphere.angularVelocity.set(0, 0, 7);
      let f = new CANNON.Vec3(-0.3, 0, 0);
      phySphere.applyForce(f, phySphere.position);
    }
  }, false);
  window.addEventListener("keyup", function(e) {

  }, false);

  renderer.render(scene, camera);
}
