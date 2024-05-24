import * as THREE from "./three.js/build/three.module.js"
import {OrbitControls} from "./three.js/examples/jsm/controls/OrbitControls.js"
import {FontLoader} from "./three.js/examples/jsm/loaders/FontLoader.js"
import {TextGeometry} from "./three.js/examples/jsm/geometries/TextGeometry.js"
import {GLTFLoader} from "./three.js/examples/jsm/loaders/GLTFLoader.js"


const width = window.innerWidth
const height = window.innerHeight
const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer()
renderer.setSize(width, height)
renderer.shadowMap.enabled = true

document.body.appendChild(renderer.domElement)

const camera1 = new THREE.PerspectiveCamera(50, width/height)
camera1.position.set(180, 180, 180)
camera1.lookAt(0,0,0)
const camera2 = new THREE.PerspectiveCamera(50, width/height)
camera2.position.set(180, 180, -180)
camera2.lookAt(0,0,0)
const camera3 = new THREE.PerspectiveCamera(50, width/height)
camera3.position.set(-180, 180, -180)
camera3.lookAt(0,0,0)
const camera4 = new THREE.PerspectiveCamera(50, width/height)
camera4.position.set(-180, 180, 180)
camera4.lookAt(0,0,0)
const cameras = [camera1, camera2, camera3, camera4]
let idx = 0

const upKey = 'w'
const downKey = 's'
const rightKey = 'd'
const leftKey = 'a'

const textureLoader = new THREE.TextureLoader()
const gltfLoader = new GLTFLoader()
let farmer
gltfLoader.load("./assets/farmer/source/model.gltf", (model)=>{
    farmer = model.scene
    farmer.scale.set(20,20,20)
    farmer.traverse((child)=>{
        child.castShadow = true
        child.name = 'farmer'
    })
    farmer.rotation.set(0, -0.5*Math.PI, 0)
    farmer.position.set(-40, 0, 40)
    scene.add(farmer)
})

let capybara
gltfLoader.load("./assets/capybara/source/model.gltf", (model)=>{
    capybara = model.scene
    capybara.scale.set(20,20,20)
    capybara.traverse((child)=>{
        child.castShadow = true
        child.name = 'capybara'
    })
    capybara.rotation.set(0, -0.5*Math.PI, 0)
    capybara.position.set(40, 0, 40)
    scene.add(capybara)
    capybaraMove()
    setInterval(capybaraMove, 8000)
})


const skyBoxGeometry = new THREE.BoxGeometry(700, 700, 700)
const skyBoxMaterial  = [
    new THREE.MeshStandardMaterial({
        map: textureLoader.load("./assets/backg.jpg"),
        side: THREE.DoubleSide
    }),
    new THREE.MeshStandardMaterial({
        map: textureLoader.load("./assets/backg.jpg"),
        side: THREE.DoubleSide
    }),
    new THREE.MeshStandardMaterial({
        map: textureLoader.load("./assets/topg.jpg"),
        side: THREE.DoubleSide
    }),
    new THREE.MeshStandardMaterial({
        map: textureLoader.load("./assets/grass.jpg"),
        side: THREE.DoubleSide
    }),
    new THREE.MeshStandardMaterial({
        map: textureLoader.load("./assets/backg.jpg"),
        side: THREE.DoubleSide
    }),
    new THREE.MeshStandardMaterial({
        map: textureLoader.load("./assets/backg.jpg"),
        side: THREE.DoubleSide
    })
]
const skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial)
skyBox.position.y = 330
scene.add(skyBox)

const groundGeometry = new THREE.BoxGeometry(150, 20, 150)
const groundMaterial = [
    new THREE.MeshPhysicalMaterial({
        map: textureLoader.load("./assets/ground.jpg"),
        side: THREE.DoubleSide
    }),
    new THREE.MeshPhysicalMaterial({
        map: textureLoader.load("./assets/ground.jpg"),
        side: THREE.DoubleSide
    }),
    new THREE.MeshPhysicalMaterial({
        map: textureLoader.load("./assets/ground.jpg"),
        side: THREE.DoubleSide
    }),
    new THREE.MeshPhysicalMaterial({
        map: textureLoader.load("./assets/ground.jpg"),
        side: THREE.DoubleSide
    }),
    new THREE.MeshPhysicalMaterial({
        map: textureLoader.load("./assets/ground.jpg"),
        side: THREE.DoubleSide
    }),
    new THREE.MeshPhysicalMaterial({
        map: textureLoader.load("./assets/ground.jpg"),
        side: THREE.DoubleSide
    })
]
const ground = new THREE.Mesh(groundGeometry, groundMaterial)
ground.position.y = -10
ground.receiveShadow = true
scene.add(ground)

const sunGeometry = new THREE.SphereGeometry(15, 32, 32)
const sunMaterial = new THREE.MeshPhongMaterial({
    color: 0xED9A13,
    specular: 0xFFFFFF,
    shininess: 50,
    emissive: 0xf5763b
})
const sun = new THREE.Mesh(sunGeometry, sunMaterial)
sun.position.set(-70, 120, 70)
scene.add(sun)

const houseLeftGeometry = new THREE.BoxGeometry(60, 40, 2)
const houseLeftMaterial = new THREE.MeshLambertMaterial({color: 0xF7FFCC})
const houseLeft = new THREE.Mesh(houseLeftGeometry, houseLeftMaterial)
houseLeft.position.set(-60, 20, -30)
houseLeft.rotateY(0.5 * Math.PI)
houseLeft.castShadow = true
houseLeft.receiveShadow = true
scene.add(houseLeft)

const houseRightGeometry = new THREE.BoxGeometry(60, 40, 2)
const houseRightMaterial = new THREE.MeshLambertMaterial({color: 0xF7FFCC})
const houseRight = new THREE.Mesh(houseRightGeometry, houseRightMaterial)
houseRight.position.set(-10, 20, -30)
houseRight.rotateY(0.5 * Math.PI)
houseRight.castShadow = true
houseRight.receiveShadow = true
scene.add(houseRight)

const houseBackGeometry = new THREE.BoxGeometry(50, 40, 2)
const houseBackMaterial = new THREE.MeshLambertMaterial({color: 0xF7FFCC})
const houseBack = new THREE.Mesh(houseBackGeometry, houseBackMaterial)
houseBack.position.set(-35, 20, -59)
houseBack.castShadow = true
houseBack.receiveShadow = true
scene.add(houseBack)

const houseFrontTopGeometry = new THREE.BoxGeometry(50, 10, 2)
const houseFrontTopMaterial = new THREE.MeshLambertMaterial({color: 0xF7FFCC})
const houseFrontTop = new THREE.Mesh(houseFrontTopGeometry, houseFrontTopMaterial)
houseFrontTop.position.set(-35, 35, -1)
houseFrontTop.castShadow = true
houseFrontTop.receiveShadow = true
scene.add(houseFrontTop)

const houseFrontLeftGeometry = new THREE.BoxGeometry(17, 30, 2)
const houseFrontLeftMaterial = new THREE.MeshLambertMaterial({color: 0xF7FFCC})
const houseFrontLeft = new THREE.Mesh(houseFrontLeftGeometry, houseFrontLeftMaterial)
houseFrontLeft.position.set(-51, 15, -1)
houseFrontLeft.castShadow = true
houseFrontLeft.receiveShadow = true
scene.add(houseFrontLeft)

const houseFrontRightGeometry = new THREE.BoxGeometry(17, 30, 2)
const houseFrontRightMaterial = new THREE.MeshLambertMaterial({color: 0xF7FFCC})
const houseFrontRight = new THREE.Mesh(houseFrontRightGeometry, houseFrontRightMaterial)
houseFrontRight.position.set(-19, 15, -1)
houseFrontRight.castShadow = true
houseFrontRight.receiveShadow = true
scene.add(houseFrontRight)

const houseRoofFrontGeometry = new THREE.CylinderGeometry(30, 30, 2, 3)
const houseRoofFrontMaterial = new THREE.MeshLambertMaterial({color: 0xF7FFCC})
const houseRoofFront = new THREE.Mesh(houseRoofFrontGeometry, houseRoofFrontMaterial)
houseRoofFront.position.set(-35, 53, -1)
houseRoofFront.rotateX(-0.5*Math.PI)
scene.add(houseRoofFront)

const houseRoofBackGeometry = new THREE.CylinderGeometry(30, 30, 2, 3)
const houseRoofBackMaterial = new THREE.MeshLambertMaterial({color: 0xF7FFCC})
const houseRoofBack = new THREE.Mesh(houseRoofBackGeometry, houseRoofBackMaterial)
houseRoofBack.position.set(-35, 53, -59)
houseRoofBack.rotateX(-0.5*Math.PI)
scene.add(houseRoofBack)

const houseRoofLeftGeometry = new THREE.BoxGeometry(60, 62, 2)
const houseRoofLeftMaterial  = [
    new THREE.MeshLambertMaterial({
        map: textureLoader.load("./assets/roof.jpg")
    }),
    new THREE.MeshLambertMaterial({
        map: textureLoader.load("./assets/roof.jpg")
    }),
    new THREE.MeshLambertMaterial({
        map: textureLoader.load("./assets/roof.jpg")
    }),
    new THREE.MeshLambertMaterial({
        map: textureLoader.load("./assets/roof.jpg")
    }),
    new THREE.MeshLambertMaterial({
        map: textureLoader.load("./assets/roof.jpg")
    }),
    new THREE.MeshLambertMaterial({
        map: textureLoader.load("./assets/roof.jpg")
    })
]
const houseRoofLeft = new THREE.Mesh(houseRoofLeftGeometry, houseRoofLeftMaterial)
houseRoofLeft.position.set(-20, 58, -30)
houseRoofLeft.rotateY(0.5*Math.PI)
houseRoofLeft.rotateX(-Math.PI/6)
houseRoofLeft.castShadow = true
houseRoofLeft.receiveShadow = true
scene.add(houseRoofLeft)

const houseRoofRightGeometry = new THREE.BoxGeometry(60, 62, 2)
const houseRoofRightMaterial  = [
    new THREE.MeshLambertMaterial({
        map: textureLoader.load("./assets/roof.jpg")
    }),
    new THREE.MeshLambertMaterial({
        map: textureLoader.load("./assets/roof.jpg")
    }),
    new THREE.MeshLambertMaterial({
        map: textureLoader.load("./assets/roof.jpg")
    }),
    new THREE.MeshLambertMaterial({
        map: textureLoader.load("./assets/roof.jpg")
    }),
    new THREE.MeshLambertMaterial({
        map: textureLoader.load("./assets/roof.jpg")
    }),
    new THREE.MeshLambertMaterial({
        map: textureLoader.load("./assets/roof.jpg")
    })
]
const houseRoofRight = new THREE.Mesh(houseRoofRightGeometry, houseRoofRightMaterial)
houseRoofRight.position.set(-50, 58, -30)
houseRoofRight.rotateY(-0.5*Math.PI)
houseRoofRight.rotateX(-Math.PI/6)
houseRoofRight.castShadow = true
houseRoofRight.receiveShadow = true
scene.add(houseRoofRight)

const vector3D = [new THREE.Vector3(-70, 145, 70),
    new THREE.Vector3(-70, 95, 70),
    new THREE.Vector3(-70, 120, 95),
    new THREE.Vector3(-70, 137.5, 87.5),
    new THREE.Vector3(-70, 137.5, 52.5),
    new THREE.Vector3(-70, 102.5, 87.5),
    new THREE.Vector3(-70, 102.5, 52.5),
    new THREE.Vector3(-70, 120, 45)]

const pointsGeometry = new THREE.BufferGeometry().setFromPoints(vector3D)
const pointsMaterial = new THREE.PointsMaterial({color: 0xEB6D00, size: 10})
const points = new THREE.Points(pointsGeometry, pointsMaterial)
scene.add(points)

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.5)
scene.add(directionalLight)
directionalLight.position.set(-70, 120, 70)
directionalLight.color.setHSL( 0.1, 1, 0.9);
directionalLight.castShadow = true
directionalLight.shadow.camera.left = -100;
directionalLight.shadow.camera.right = 100;
directionalLight.shadow.camera.top = 100;
directionalLight.shadow.camera.bottom = -100;

const directionalLightHelper1 = new THREE.DirectionalLightHelper(directionalLight, 30)
// scene.add(directionalLightHelper1)

const hemisphereLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 1)
hemisphereLight.color.setHSL(0.6, 1, 0.1)
hemisphereLight.groundColor.setHSL(0.01, 1, 0.90)
hemisphereLight.position.set(0, 50, 0)
scene.add(hemisphereLight)



const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(dLightShadowHelper)

const tree1HeadGeometry = new THREE.ConeGeometry(10, 20, 15)
const tree1HeadMaterial = new THREE.MeshStandardMaterial({color: 0x0e6900})
const tree1Head = new THREE.Mesh(tree1HeadGeometry, tree1HeadMaterial)
tree1Head.position.set(25, 30, -30)
tree1Head.castShadow = true
scene.add(tree1Head)

const tree1StickGeometry = new THREE.CylinderGeometry(2, 2, 20, 32)
const tree1StickMaterial = new THREE.MeshStandardMaterial({color: 0x914e00})
const tree1Stick = new THREE.Mesh(tree1StickGeometry, tree1StickMaterial)
tree1Stick.position.set(25, 10, -30)
tree1Stick.castShadow = true
scene.add(tree1Stick)

const tree2HeadGeometry = new THREE.ConeGeometry(10, 20, 15)
const tree2HeadMaterial = new THREE.MeshStandardMaterial({color: 0x0e6900})
const tree2Head = new THREE.Mesh(tree2HeadGeometry, tree2HeadMaterial)
tree2Head.position.set(40, 20, -25)
tree2Head.castShadow = true
scene.add(tree2Head)

const tree2StickGeometry = new THREE.CylinderGeometry(2, 2, 10, 32)
const tree2StickMaterial = new THREE.MeshStandardMaterial({color: 0x914e00})
const tree2Stick = new THREE.Mesh(tree2StickGeometry, tree2StickMaterial)
tree2Stick.position.set(40, 5, -25)
tree2Stick.castShadow = true
scene.add(tree2Stick)

const tree3HeadGeometry = new THREE.ConeGeometry(10, 20, 15)
const tree3HeadMaterial = new THREE.MeshStandardMaterial({color: 0x0e6900})
const tree3Head = new THREE.Mesh(tree3HeadGeometry, tree3HeadMaterial)
tree3Head.position.set(55, 25, -35)
tree3Head.castShadow = true
scene.add(tree3Head)

const tree3StickGeometry = new THREE.CylinderGeometry(2, 2, 15, 32)
const tree3StickMaterial = new THREE.MeshStandardMaterial({color: 0x914e00})
const tree3Stick = new THREE.Mesh(tree3StickGeometry, tree3StickMaterial)
tree3Stick.position.set(55, 7.5, -35)
tree3Stick.castShadow = true
scene.add(tree3Stick)

const fontLoader = new FontLoader()
fontLoader.load("./three.js/examples/fonts/optimer_bold.typeface.json", (font)=>{
    let textGeometry = new TextGeometry("'e' and 'q' to change cameras, 'w', 'a', 's', 'd' to move\nfarmer, hover on farmer or capybara to highlight", {
        font: font,
        size: 6,
        height: 0.5
    })
    let textMaterial = new THREE.MeshBasicMaterial({color: 0x2900cc})
    let text = new THREE.Mesh(textGeometry, textMaterial)
    text.position.set(-55, 90, 80)
    text.rotation.set(0, Math.PI/4, 0)
    scene.add(text)
})

window.addEventListener('keypress', function(e){
    console.log(e.key)
    if(e.key=='e'){
        if(idx==3){
            idx=0
        }
        else{
            idx+=1
        }
    }
    else if(e.key=='q'){
        if(idx==0){
            idx=3
        }
        else{
            idx-=1
        }
    }
    if(e.key==leftKey){
        if(farmer.position.x>-70){
            farmer.position.x -=5
        }
        farmer.rotation.set(0, 0.5*Math.PI, 0)  
    }
    else if(e.key==rightKey){
        if(farmer.position.x<70){
            farmer.position.x +=5
        }
        farmer.rotation.set(0, -0.5*Math.PI, 0)
    }
    else if(e.key==downKey){
        if(farmer.position.z<70){
            farmer.position.z +=5
        }
        farmer.rotation.set(0, 1*Math.PI, 0)
    }
    else if(e.key==upKey){
        if(farmer.position.z>-70){
            farmer.position.z -=5
        }
        farmer.rotation.set(0, 0, 0)
    }
})

const mousePosition = new THREE.Vector2()
window.addEventListener('mousemove', function (e) {
    mousePosition.x = (e.clientX/window.innerWidth)*2 - 1
    mousePosition.y = -(e.clientY/window.innerHeight)*2 +1
})

const raycaster = new THREE.Raycaster()

const spotlight = new THREE.SpotLight(0xFFFFFF)
spotlight.angle = 90
spotlight.distance = 50


function capybaraMove(){
    setTimeout(()=>{
        capybara.rotation.set(0, -0.5*Math.PI, 0)
        capybara.position.x +=5
        setTimeout(()=>{
            capybara.position.x +=5
            capybara.rotation.set(0, Math.PI, 0)
            setTimeout(()=>{
                capybara.position.z +=5
                setTimeout(()=>{
                    capybara.position.z +=5
                    capybara.rotation.set(0, 0.5*Math.PI, 0)
                    setTimeout(()=>{
                        capybara.position.x -=5
                        setTimeout(()=>{
                            capybara.position.x -=5
                            capybara.rotation.set(0, 0, 0)
                            setTimeout(()=>{
                                capybara.position.z -=5
                                setTimeout(()=>{
                                    capybara.position.z -=5
                                    capybara.rotation.set(0, -0.5*Math.PI, 0)
                                }, 1000)
                            }, 1000)
                        }, 1000)
                    }, 1000)
                }, 1000)
            }, 1000)
        }, 1000)
    }, 1000)
}





function highlight(){
    raycaster.setFromCamera(mousePosition, cameras[idx])
    const intersects = raycaster.intersectObjects(scene.children)
    console.log(intersects)
    scene.remove(spotlight)
    directionalLight.intensity = 1.5
    for(let i = 0 ; i < intersects.length;i++){
        if(intersects[i].object.name==='farmer'){
            spotlight.position.set(farmer.position.x, 40, farmer.position.z)
            spotlight.lookAt(farmer.position)
            spotlight.intensity = 3
            directionalLight.intensity = 0.9
            scene.add(spotlight)
        }
        else if(intersects[i].object.name==='capybara'){
            spotlight.position.set(capybara.position.x, 40, capybara.position.z)
            spotlight.lookAt(capybara.position)
            spotlight.intensity = 3
            directionalLight.intensity = 0.9
            scene.add(spotlight)
        }
    }
}

function animate(){
    points.rotateOnAxis(new THREE.Vector3(-70, 120, 70).normalize(), 0.01)
}

function render(){
    animate()
    highlight()
    renderer.render(scene, cameras[idx])
    requestAnimationFrame(render)
}

window.addEventListener('resize', function(){
    cameras.forEach(camera => {
        camera.aspect = this.window.innerWidth/this.window.innerHeight
        camera.updateProjectionMatrix()
    });
    renderer.setSize(window.innerWidth, window.innerHeight)
})

// const controls = new OrbitControls(camera1, renderer.domElement)

render()
