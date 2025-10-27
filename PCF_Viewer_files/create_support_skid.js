import { Mesh, MeshStandardMaterial, Vector3, CylinderGeometry, Group, PlaneGeometry, DoubleSide } from '../vendor_mods/three/build/three.module.js';

function createSupportSKID(sS_position = new Vector3(), sS_dia = 1, sS_direction = "DOWN", sS_lookAt = new Vector3()) {

    //console.log(sS_direction);
    const material = new MeshStandardMaterial({ color: 'green', side: DoubleSide });

    const cone_height = sS_dia / 2;
    const cone_dia = sS_dia / 4;

    //create cone
    const geometry = new CylinderGeometry(0, cone_dia, cone_height, 10, 1, false);
    geometry.rotateX(Math.PI / 2);

    //If direction of pipe is vertical then do not subtract diameter of pipe
    if ((Math.round(sS_lookAt.z) == 1 || Math.round(sS_lookAt.z) == -1) && ( sS_direction == "DOWN" || sS_direction == "UP" )) {
        geometry.translate(0, 0, -(cone_height / 2)); //lower cylinder at half height, setting top to 0,0,0
    } else {
        geometry.translate(0, 0, -(cone_height / 2) - (sS_dia / 2)); //lower cylinder at half height, setting top to 0,0,0
    }

    const cone_mesh = new Mesh(geometry, material);

    const supportSKID = new Group();
    supportSKID.add(cone_mesh);

    const cyl_height = cone_height * 2;
    const cyl_dia = cone_dia / 3;

    //create cone
    const geometry1 = new CylinderGeometry(cyl_dia, cyl_dia, cyl_height, 10, 1, false);
    //If direction of pipe is vertical then do not subtract diameter of pipe
    if ((Math.round(sS_lookAt.z) == 1 || Math.round(sS_lookAt.z) == -1) && ( sS_direction == "DOWN" || sS_direction == "UP" )) {
        geometry1.translate(0, -(cyl_height / 2) - cone_height, 0); //lower cylinder at half height, setting top of cylinder to bottom of cone
    } else {
        geometry1.translate(0, -(cyl_height / 2) - cone_height - (sS_dia / 2), 0); //lower cylinder at half height, setting top of cylinder to bottom of cone
    }
    geometry1.rotateX(Math.PI / 2);

    const cyl_mesh = new Mesh(geometry1, material);
    
    supportSKID.add(cyl_mesh);

    //create base square
    const geometry2 = new PlaneGeometry(cone_dia * 2, cone_dia * 2, 1, 1);
    //If direction of pipe is vertical then do not subtract diameter of pipe
    if ((Math.round(sS_lookAt.z) == 1 || Math.round(sS_lookAt.z) == -1) && ( sS_direction == "DOWN" || sS_direction == "UP" )) {
        geometry2.translate(0, 0, -cyl_height - cone_height );
    } else {
        geometry2.translate(0, 0, -cyl_height - cone_height - (sS_dia / 2));
    }

    const base_mesh = new Mesh(geometry2, material);

    supportSKID.add(base_mesh);

    if (sS_direction == "DOWN") {

    } else if (sS_direction == "UP") {
        supportSKID.rotateX(Math.PI);
    } else if (sS_direction == "EAST") {
        supportSKID.rotateY(Math.PI / 2);
    } else if (sS_direction == "WEST") {
        supportSKID.rotateY(-Math.PI / 2);
    } else if (sS_direction == "NORTH") {
        supportSKID.rotateX(Math.PI / 2);
    } else if (sS_direction == "SOUTH") {
        supportSKID.rotateX(-Math.PI / 2);
    }

    //Place Support SKID in its right position
    supportSKID.position.copy(sS_position); //set position

    supportSKID.tick = (delta) => {
  };

  return supportSKID;
}

export { createSupportSKID };