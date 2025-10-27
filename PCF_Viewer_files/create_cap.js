import { Mesh, MeshStandardMaterial, Vector3, SphereGeometry } from '../vendor_mods/three/build/three.module.js';

function createCap(c_start = new Vector3(0,0,0), c_end = new Vector3(0,1,0), c_dia = 1) {

  const material = new MeshStandardMaterial({ color: 'grey' });

  const c_height = c_start.distanceTo(c_end);

  const geometry = new SphereGeometry((c_dia / 2) * 0.96, 16, 16,);

  //geometry.translate(0, c_height / 2, 0); //raise cylinder at half height, setting bottom to 0,0,0
  //geometry.rotateX(Math.PI / 2); //align cylinder with Z-axis

  const cap = new Mesh(geometry, material);

  cap.position.copy(c_start); //set position
  //cap.lookAt(c_end); //orient cap

  cap.tick = (delta) => {
  };

  return cap;
}

export { createCap };