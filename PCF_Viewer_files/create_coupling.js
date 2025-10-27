import { Mesh, MeshStandardMaterial, Vector3, CylinderGeometry } from '../vendor_mods/three/build/three.module.js';

function createCoupling(c_start = new Vector3(0,0,0), c_end = new Vector3(0,1,0), c_dia = 1) {

  const material = new MeshStandardMaterial({ color: 'grey' });

  const c_height = c_start.distanceTo(c_end);

  const geometry = new CylinderGeometry(c_dia / 2, c_dia / 2, c_height, 16, 1, false);

  geometry.translate(0, c_height / 2, 0); //raise cylinder at half height, setting bottom to 0,0,0
  geometry.rotateX(Math.PI / 2); //align cylinder with Z-axis

  const coupling = new Mesh(geometry, material);

  coupling.position.copy(c_start); //set position
  coupling.lookAt(c_end); //orient coupling

  coupling.tick = (delta) => {
  };

  return coupling;
}

export { createCoupling };