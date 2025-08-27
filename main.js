
import * as GaussianSplats3D from '/lib/gaussian-splats-3d.module.js';
import * as THREE from '/lib/three.module.js';
import { GLTFLoader } from '/lib/GLTFLoader.js';

const loader = new GLTFLoader();

fetch('scene.json')
  .then(res => res.json())
  .then(data => {
    const viewer = new GaussianSplats3D.Viewer({
      cameraUp: [0.01933, -0.7583, -0.65161],
      initialCameraPosition: [1.5, 2.6, -6.3],
      initialCameraLookAt: [0.45, 1.95, 1.5]
    });

    viewer.addSplatScene(data.splatPath, { progressiveLoad: false }).then(() => {
      viewer.start();
      const scene = viewer.threeScene;

      // Lighting
      scene.add(new THREE.AmbientLight(0x404040, 1.5));
      const dir = new THREE.DirectionalLight(0xffffff, 1);
      dir.position.set(5,10,7);
      scene.add(dir);

      data.models.forEach(model => {
        if(model.name.toLowerCase().endsWith('.glb')) {
          loader.load('assets/' + model.name, gltf => {
            const obj = gltf.scene;
            obj.name = model.name;
            if(model.position) obj.position.fromArray(model.position);
            if(model.rotation) obj.rotation.set(...model.rotation);
            if(model.scale) obj.scale.setScalar(model.scale);
            scene.add(obj);
          });
        } else {
          let geometry;
          switch(model.geometryType) {
            case 'BoxGeometry': geometry = new THREE.BoxGeometry(1,1,1); break;
            case 'TrapeziumGeometry': geometry = new THREE.CylinderGeometry(0.5,1,1,4); break;
            case 'CylinderGeometry': geometry = new THREE.CylinderGeometry(0.5,0.5,1,16); break;
            default: geometry = new THREE.BoxGeometry(1,1,1);
          }

          const material = new THREE.MeshStandardMaterial({
            color: model.color ? '#' + model.color : '#ffff00',
            wireframe: model.wireframe || false
          });

          const obj = new THREE.Mesh(geometry, material);
          if(model.position) obj.position.fromArray(model.position);
          if(model.rotation) obj.rotation.set(...model.rotation);
          if(model.scale) obj.scale.setScalar(model.scale);
          obj.name = model.name;
          scene.add(obj);
        }
      });
    });
  })
  .catch(err => console.error('Failed to load scene.json', err));
