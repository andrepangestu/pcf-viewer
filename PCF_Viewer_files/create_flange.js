import { Mesh, MeshStandardMaterial, Vector3, CylinderGeometry } from '../vendor_mods/three/build/three.module.js';

function createFlange(f_start = new Vector3(0,0,0), f_end = new Vector3(0,1,0), f_dia = 1) {

  const material = new MeshStandardMaterial({ color: 'cyan' });

  const f_height = f_start.distanceTo(f_end);

  const geometry = new CylinderGeometry(f_dia * 1.5 / 2, f_dia * 1.5 / 2, f_height, 16, 1, false);

  geometry.translate(0, f_height / 2, 0); //raise cylinder at half height, setting bottom to 0,0,0
  geometry.rotateX(Math.PI / 2); //align cylinder with Z-axis

  const flange = new Mesh(geometry, material);

  flange.position.copy(f_start); //set position
  flange.lookAt(f_end); //orient flange

  flange.tick = (delta) => {
  };

  return flange;
}

export { createFlange };
