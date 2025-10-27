import { Mesh, MeshStandardMaterial, Vector3, BoxGeometry, CylinderGeometry, Group, PlaneGeometry, DoubleSide } from '../vendor_mods/three/build/three.module.js';

function createSupportANCH(sS_position = new Vector3(), sS_dia = 1, sS_lookAt = new Vector3()) {

    //const material = new MeshStandardMaterial({ color: 'red', side: DoubleSide });
    const material = new MeshStandardMaterial({ color: 'red' });

    //create base square
    const geometry = new BoxGeometry(sS_dia * 1.5, sS_dia * 1.5, 0.01);

    const base_mesh = new Mesh(geometry, material);

    //Place Support SKID in its right position
    base_mesh.lookAt(sS_lookAt);
    base_mesh.position.copy(sS_position); //set position
    

    base_mesh.tick = (delta) => {
  };

  return base_mesh;
}

export { createSupportANCH };