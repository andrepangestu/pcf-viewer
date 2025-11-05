import { Mesh, MeshStandardMaterial, Vector3, CylinderGeometry } from '../vendor_mods/three/build/three.module.js';

function createMiscComp(mc_start = new Vector3(0,0,0), mc_end = new Vector3(0,1,0), mc_dia = 1) {

  const material = new MeshStandardMaterial({ color: 'grey' });

  const mc_height = mc_start.distanceTo(mc_end);

  const geometry = new CylinderGeometry(mc_dia / 2, mc_dia / 2, mc_height, 16, 1, false);

  geometry.translate(0, mc_height / 2, 0); //raise cylinder at half height, setting bottom to 0,0,0
  geometry.rotateX(Math.PI / 2); //align cylinder with Z-axis

  const miscComp = new Mesh(geometry, material);

  miscComp.position.copy(mc_start); //set position
  miscComp.lookAt(mc_end); //orient coupling

  miscComp.tick = (delta) => {
  };

  return miscComp;
}

export { createMiscComp };