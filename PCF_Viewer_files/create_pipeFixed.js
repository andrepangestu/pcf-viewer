import { Mesh, MeshStandardMaterial, Vector3, CylinderGeometry } from '../vendor_mods/three/build/three.module.js';

function createPipeFixed(p_start = new Vector3(0,0,0), p_end = new Vector3(0,1,0), p_dia = 0.1) {

  const material = new MeshStandardMaterial({ color: 'black' });

  const p_height = p_start.distanceTo(p_end);

  if (p_dia > 0.1) { p_dia = 0.1; }

  const geometry = new CylinderGeometry(p_dia / 2, p_dia / 2, p_height, 10, 1, false);

  geometry.translate(0, p_height / 2, 0); //raise cylinder at half height, setting bottom to 0,0,0
  geometry.rotateX(Math.PI / 2); //align cylinder with Z-axis

  const pipeFixed = new Mesh(geometry, material);

  pipeFixed.position.copy(p_start); //set position
  pipeFixed.lookAt(p_end); //orient pipe

  pipeFixed.tick = (delta) => {
  };

  return pipeFixed;
}

export { createPipeFixed };
