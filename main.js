import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
import * as THREE from 'three';

fetch('scene.json').then(r=>r.json()).then(data=>{
  const viewer=new GaussianSplats3D.Viewer({
    cameraUp:[0.01933,-0.75830,-0.65161],
    initialCameraPosition:[1.5,2.6,-6.3],
    initialCameraLookAt:[0.45,1.95,1.5]
  });
  viewer.addSplatScene(data.splatPath,{progressiveLoad:false}).then(()=>{
    viewer.start();
    const scene=viewer.threeScene;

    const box=new THREE.Mesh(
      new THREE.BoxGeometry(1,1,1),
      new THREE.MeshStandardMaterial({color:'#'+data.box.color})
    );
    box.position.fromArray(data.box.position);
    box.rotation.set(...data.box.rotation);
    box.scale.setScalar(data.box.scale);

    scene.add(new THREE.AmbientLight(0x404040,1.5));
    const dir=new THREE.DirectionalLight(0xffffff,1);
    dir.position.set(5,10,7);
    scene.add(dir);
    scene.add(box);
  });
});