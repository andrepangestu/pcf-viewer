import { Mesh, MeshStandardMaterial, Vector3, CylinderGeometry } from '../vendor_mods/three/build/three.module.js';

function createValveAngle(v_start = new Vector3(0,0,0), v_end = new Vector3(0,1,0), v_dia = 1) {

  const material = new MeshStandardMaterial({ color: 'yellow' });

  const v_height = v_start.distanceTo(v_end);

  //create Valve cone1
  const geometry = new CylinderGeometry(0, v_dia / 2, v_height, 10, 1, false);
  geometry.translate(0, v_height / 2, 0); //raise cylinder at half height, setting bottom to 0,0,0
  geometry.rotateX(Math.PI / 2); //align cylinder with Z-axis
  const valveAngle = new Mesh(geometry, material);

  //Place valve in its right position
  valveAngle.position.copy(v_start); //set position
  valveAngle.lookAt(v_end); //orient pipe

  valveAngle.tick = (delta) => {
  };

  return valveAngle;
}

export { createValveAngle };