import { Vector3, Group } from '../vendor_mods/three/build/three.module.js';
import { createPipe } from './create_pipe.js';

function createTee(t_start = new Vector3(0,0,0), t_end = new Vector3(0,1,0), t_dia = 1, t_mid = new Vector3(0,0,0), t_branch = new Vector3(0,1,0), t_diaBr = 1) {

    const tee = new Group();

    /*console.log("From createTee")
    console.log(t_start);
    console.log(t_end);
    console.log(t_mid);
    console.log(t_branch);*/

    const header = createPipe(t_start, t_end, t_dia);
    tee.add(header);

    const branch = createPipe(t_mid, t_branch, t_diaBr);
    tee.add(branch);

  tee.tick = (delta) => {
  };

  //return tee;
  return {header, branch};
}

export { createTee };