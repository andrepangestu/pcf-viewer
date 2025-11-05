import { Mesh, MeshStandardMaterial, Vector3, CylinderGeometry, Group, SphereGeometry } from '../vendor_mods/three/build/three.module.js';
import { createPipe } from './create_pipe.js';

function createValve(v_start = new Vector3(0,0,0), v_end = new Vector3(0,1,0), v_dia = 1) {

  const material = new MeshStandardMaterial({ color: 'yellow' });

  const v_height = v_start.distanceTo(v_end);
  const v_halfHeight = v_height / 2;

  //create Valve cone1
  const geometry = new CylinderGeometry(0, v_dia / 2, v_halfHeight, 10, 1, false);
  geometry.translate(0, v_halfHeight / 2, 0); //raise cylinder at half height, setting bottom to 0,0,0
  geometry.rotateX(Math.PI / 2); //align cylinder with Z-axis
  const v_body = new Mesh(geometry, material);

  const valve = new Group();
  valve.add(v_body);

  //create Valve cone2
  const geometry1 = new CylinderGeometry(v_dia / 2, 0, v_halfHeight, 10, 1, false);
  geometry1.translate(0, v_halfHeight * 1.5, 0); //raise cylinder at half height, setting bottom to 0,0,0
  geometry1.rotateX(Math.PI / 2); //align cylinder with Z-axis
  const v_body1 = new Mesh(geometry1, material);
  valve.add(v_body1);

  //create Valve bulb
  //check if the half height of bulb is greater than the diameter of the pipe, if it is, reset it to pipe diameter.
  let v_bulbDia = v_halfHeight;
  if (v_halfHeight > v_dia) {v_bulbDia = v_dia;}

  const geometry2 = new SphereGeometry(v_bulbDia / 2, 10, 10);
  geometry2.translate(0, 0, v_halfHeight);
  const v_body2 = new Mesh(geometry2, material);
  valve.add(v_body2);

  
  const valveCover = createPipe(v_start, v_end, v_dia);
  valveCover.material.transparent = true;
  valveCover.material.opacity = 0;
  

  //Place valve in its right position
  valve.position.copy(v_start); //set position
  valve.lookAt(v_end); //orient pipe

  valve.tick = (delta) => {
  };

  return {valve, valveCover};
}

export { createValve };