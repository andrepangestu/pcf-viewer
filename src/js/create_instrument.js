import { Mesh, MeshStandardMaterial, Vector3, CylinderGeometry } from '../vendor_mods/three/build/three.module.js';

function createInstrument(i_start = new Vector3(0,0,0), i_end = new Vector3(0,1,0), i_dia = 1) {

  const material = new MeshStandardMaterial({ color: 'grey' });

  const i_height = i_start.distanceTo(i_end);

  const geometry = new CylinderGeometry(i_dia / 2, i_dia / 2, i_height, 16, 1, false);

  geometry.translate(0, i_height / 2, 0); //raise cylinder at half height, setting bottom to 0,0,0
  geometry.rotateX(Math.PI / 2); //align cylinder with Z-axis

  const instrument = new Mesh(geometry, material);

  instrument.position.copy(i_start); //set position
  instrument.lookAt(i_end); //orient coupling

  instrument.tick = (delta) => {
  };

  return instrument;
}

export { createInstrument };