import { QuadraticBezierCurve3, Mesh, MeshStandardMaterial, TubeGeometry, Vector3, MathUtils } from '../vendor_mods/three/build/three.module.js';
import { createFlange } from './create_flange.js';

function createBend(b_start = new Vector3(1.5,0,0), b_end = new Vector3(0,1.5,0), b_centre = new Vector3(0,0,0), p_dia = 1, c_end = "BW") {

  const material = new MeshStandardMaterial({ color: 'blue' });

  //Pipe diameter is 1m
  //Pipe bends have a radius of 1.5m (1.5D bend)
  //90degree Bend points are
  //1.5,0,0 - start
  //0,1.5,0 - end
  //0,0,0 - centre

  //45degree Bend points are
  //1.5,0,0
  //1.0606,1.0606,0
  //0,0,0

  //const b_start = new Vector3(1.5,0,0);
  //const b_end = new Vector3(1.0606,0,1.0606);
  //const b_centre = new Vector3(0,0,0);
   
  //Find direction of start point from centre
  const b_start_dir = new Vector3();
  b_start_dir.subVectors(b_start, b_centre).normalize();
  //console.log(b_start_dir);

  //Find direction of end point from centre
  const b_end_dir = new Vector3();
  b_end_dir.subVectors(b_end, b_centre).normalize();
  //console.log(b_end_dir);

  //find normal vector for the plane in which arc lies
  const b_norm_vec = new Vector3();
  b_norm_vec.crossVectors(b_start_dir, b_end_dir).normalize();
  //console.log(b_norm_vec);

  //find angle between start and end vectors
  //const b_inc_angle = MathUtils.radToDeg( b_start_dir.angleTo(b_end_dir) );
  const b_inc_angle = b_start_dir.angleTo(b_end_dir);
  //console.log("included angle is: " + MathUtils.radToDeg(b_inc_angle) );

  //find radius of arc
  const b_radius = b_start.distanceTo(b_centre);
  //console.log("radius of arc is: " + b_radius);

  //find length of hypoteneous
  //const b_hypo_len = b_radius / Math.cos(MathUtils.degToRad(b_inc_angle / 2));
  const b_hypo_len = b_radius / Math.cos(b_inc_angle / 2);
  //console.log("length of hypoteneous is: " + b_hypo_len);

  //Find midpoint between two end points. https://discussions.unity.com/t/trigonometry-in-3d-space/236496/2
  const b_dummy_mid = new Vector3();
  b_dummy_mid.lerpVectors(b_start, b_end, 0.5);
  //console.log("b_dummy_mid");
  //console.log(b_dummy_mid);

  //Find vector pointing to hypoteneous point
  const b_hypo_dir = new Vector3();
  b_hypo_dir.subVectors(b_dummy_mid,b_centre).normalize();
  //console.log("b_hypo_dir");
  //console.log(b_hypo_dir);

  //Find mid point coordinates
  const b_mid = new Vector3();
  const temp = new Vector3();
  temp.copy(b_hypo_dir).multiplyScalar(b_hypo_len);
  //console.log("temp");
  //console.log(temp);
  b_mid.addVectors(b_centre, temp);
  //console.log("b_mid");
  //console.log(b_mid);

  //This is if the actual centre of the bend is given
  //var path = new QuadraticBezierCurve3(b_start, b_mid, b_end);
  //console.log(path);

  //This code is if the intersection point is given
  var path = new QuadraticBezierCurve3(b_start, b_centre, b_end);

  //*************************************************** */
  //You need to add a code that will check the tangent of the line before the bend and decide whether b_mid to be used or b_centre
  //*************************************************** */

  const geometry = new TubeGeometry(path, 20, p_dia/2, 10, false);
  //console.log(geometry);

  const bend = new Mesh(geometry, material);

  //This is the code for adding Ends of the elbow
  //if ends are BW (butt weld), then do nothing
  //if ends are FL (flanged), then add flanges
  if (c_end == "FL" || c_end == "FL\r") {
    console.log("This bend has flanges");
    console.log(c_end);

    //Try to give it to create_flange.js
    //create temp 3D point near start of bend
    const bf_start = new Vector3();
    bf_start.lerpVectors(b_start, b_end, 0.1);
    console.log(bf_start);
    createFlange(b_start, bf_start, p_dia * 1.5);
  }



  bend.tick = (delta) => {
  };

  return bend;
}

export { createBend };
