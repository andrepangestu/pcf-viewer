import { Mesh, MeshStandardMaterial, Vector3, CylinderGeometry, Group, PlaneGeometry, DoubleSide } from '../vendor_mods/three/build/three.module.js';

function createSupportHANG(sH_position = new Vector3(), sH_dia = 1) {

    //console.log(sH_dia / 2);
    const material = new MeshStandardMaterial({ color: 'green', side: DoubleSide });

    const buckle_height = sH_dia / 2;
    const buckle_dia = sH_dia / 4;
    const cyl_height = sH_dia * 2;
    const cyl_dia = sH_dia / 10;

    //create cylinder
    const geometry = new CylinderGeometry(cyl_dia, cyl_dia, cyl_height, 10, 1, false);
    geometry.translate(0, (cyl_height / 2) + (sH_dia / 2), 0); //raise cylinder at half height, setting top of cylinder to bottom of cone
    geometry.rotateX(Math.PI / 2);
    const cyl_mesh = new Mesh(geometry, material);

    const supportHANG = new Group();
    supportHANG.add(cyl_mesh);

    
    //create turn buckle
    const geometry1 = new CylinderGeometry(buckle_dia, buckle_dia, buckle_height, 10, 1, false);
    geometry1.rotateX(-Math.PI / 2);
    geometry1.translate(0, 0, (sH_dia / 2) + (cyl_height / 2)); //lower cylinder at half height, setting top to 0,0,0

    const buckle_mesh = new Mesh(geometry1, material);
    supportHANG.add(buckle_mesh);

    //create base square
    const geometry2 = new PlaneGeometry(buckle_dia * 2, buckle_dia * 2, 1, 1);
    geometry2.translate(0, 0, cyl_height + (sH_dia / 2));

    const base_mesh = new Mesh(geometry2, material);

    supportHANG.add(base_mesh);

    //Place Support SKID in its right position
    supportHANG.position.copy(sH_position); //set position

    supportHANG.tick = (delta) => {
    };

  return supportHANG;
}

export { createSupportHANG };