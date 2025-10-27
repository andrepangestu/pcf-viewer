import { Mesh, MeshStandardMaterial, Vector3, CylinderGeometry } from '../vendor_mods/three/build/three.module.js';

function createReducerConcentric(rc_start = new Vector3(0,0,0), rc_end = new Vector3(0,1,0), rc_diaS = 1, rc_diaE = 1) {

  const material = new MeshStandardMaterial({ color: 'grey' });

  const rc_height = rc_start.distanceTo(rc_end);

  const geometry = new CylinderGeometry(rc_diaE / 2, rc_diaS / 2, rc_height, 10, 1, false);

  geometry.translate(0, rc_height / 2, 0); //raise cylinder at half height, setting bottom to 0,0,0
  geometry.rotateX(Math.PI / 2); //align cylinder with Z-axis

  const reducerConc = new Mesh(geometry, material);

  reducerConc.position.copy(rc_start); //set position
  reducerConc.lookAt(rc_end); //orient pipe

  reducerConc.tick = (delta) => {
  };

  return reducerConc;
}

export { createReducerConcentric };