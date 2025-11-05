import { Mesh, MeshStandardMaterial, Vector3, CylinderGeometry, Matrix4 } from '../vendor_mods/three/build/three.module.js';

function createReducerEccentric(re_start = new Vector3(0,0,0), re_end = new Vector3(0,1,0), re_diaS = 1, re_diaE = 1) {

  const material = new MeshStandardMaterial({ color: 'grey' });

  const re_height = re_start.distanceTo(re_end);

  const geometry = new CylinderGeometry(re_diaE / 2, re_diaS / 2, re_height, 10, 1, false);

  geometry.translate(0, re_height / 2, 0); //raise cylinder at half height, setting bottom to 0,0,0
  geometry.rotateX(Math.PI / 2); //align cylinder with Z-axis

  /*
  //Shear
  const matrix = new Matrix4();
  matrix.makeShear(0, 0, 0, 0, 0, -re_diaS/2);

  geometry.applyMatrix4(matrix);
  */

  const reducerEcc = new Mesh(geometry, material);

  reducerEcc.position.copy(re_start); //set position
  reducerEcc.lookAt(re_end); //orient pipe

  reducerEcc.tick = (delta) => {
  };

  return reducerEcc;
}

export { createReducerEccentric };