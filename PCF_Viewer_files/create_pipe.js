import { Mesh, MeshStandardMaterial, Vector3, CylinderGeometry } from '../vendor_mods/three/build/three.module.js';

function createPipe(p_start = new Vector3(0,0,0), p_end = new Vector3(0,1,0), p_dia = 1) {

  const material = new MeshStandardMaterial({ color: 'purple', transparent: true, opacity: 0.8 });

  const p_height = p_start.distanceTo(p_end);

  const geometry = new CylinderGeometry(p_dia / 2, p_dia / 2, p_height, 10, 1, false);

  geometry.translate(0, p_height / 2, 0); //raise cylinder at half height, setting bottom to 0,0,0
  geometry.rotateX(Math.PI / 2); //align cylinder with Z-axis

  const pipe = new Mesh(geometry, material);
  pipe.name = "Pipe";

  pipe.position.copy(p_start); //set position
  pipe.lookAt(p_end); //orient pipe

  pipe.tick = (delta) => {
  };

  return pipe;
}

export { createPipe };
