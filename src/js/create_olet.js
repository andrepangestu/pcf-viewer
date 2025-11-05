import { Mesh, MeshStandardMaterial, Vector3, CylinderGeometry } from '../vendor_mods/three/build/three.module.js';

function createOlet(o_start = new Vector3(0,0,0), o_end = new Vector3(0,1,0), o_dia = 1) {

  const material = new MeshStandardMaterial({ color: 'purple' });

  const o_height = o_start.distanceTo(o_end);

  const geometry = new CylinderGeometry(o_dia / 2, o_dia / 2, o_height, 10, 1, false);

  geometry.translate(0, o_height / 2, 0); //raise cylinder at half height, setting bottom to 0,0,0
  geometry.rotateX(Math.PI / 2); //align cylinder with Z-axis

  const olet = new Mesh(geometry, material);

  olet.position.copy(o_start); //set position
  olet.lookAt(o_end); //orient olet

  olet.tick = (delta) => {
  };

  return olet;
}

export { createOlet };