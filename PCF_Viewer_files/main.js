import {
    Object3D,
    Vector3,
    WebGLRenderer,
    Scene,
    PerspectiveCamera,
    HemisphereLight,
    Color,
    Vector2,
    Raycaster,
  } from "../vendor_mods/three/build/three.module.js";

  import { OrbitControls } from "../vendor_mods/three/examples/jsm/controls/OrbitControls.js";
  import { ViewHelper } from "../vendor_mods/three/examples/jsm/helpers/ViewHelper.js";

  import { pcfLoader } from "./pcfloader.js";
  
  let renderer, scene, camera, controls, helper, pipingSystem;

  let raycaster;
  let INTERSECTED;
  const pointer = new Vector2();
  let currentColor = new Color();
  let myDiv = document.getElementById('objProp');
  
  //init();
  //animate();
  
  function init(test) {
    //Default Z direction Up
    Object3D.DEFAULT_UP = new Vector3(0,0,1);

    //got this idea from https://sentry.io/answers/how-to-get-values-from-urls-in-javascript/#:~:text=Getting%20URL%20Query%20Parameters%20in%20the%20Browser&text=The%20get()%20method%20returns,for%20a%20given%20query%20parameter.
    const searchParams = new URLSearchParams(window.location.search);
    let fileLocation = searchParams.get('fl');

    //const myFileLocation = './mypcf/pcf/' + fileLocation;

    //const myFileLocation = "../assets/pcfviewer/src/PCF.pcf";
	
    const myFileLocation = test;

    // renderer
    renderer = new WebGLRenderer({ antialias: true });
    renderer.physicallyCorrectLights = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.autoClear = false;
    document.body.appendChild(renderer.domElement);
  
    // scene
    scene = new Scene();
    scene.background = new Color('lightblue');
  
    // camera
    camera = new PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.001, //Making it 1mm instead of 1m as per previous versions of pcfviewers.
      10000
    );
    camera.position.set(20, 20, 20);
  
    // controls
    controls = new OrbitControls(camera, renderer.domElement);
  
    // light
    const light = new HemisphereLight( 0xffffff, 0x555555, 8 );
    scene.add(light);

    //pipingSystem to be loaded here
    pipingSystem = new pcfLoader(camera, controls, myFileLocation);
    scene.add(pipingSystem);
  
    // helper
    helper = new ViewHelper(camera, renderer, "bottom-left");
    helper.setControls(controls);

    //Add Raycaster
    raycaster = new Raycaster();

    document.addEventListener('mousedown', onMouseDownEvent);
  }
  
  function animate() {
    requestAnimationFrame(animate);
  
    renderer.clear();
  
    renderer.render(scene, camera);
  
    helper.render();

    //render();
  }

  function onMouseDownEvent( event ) {
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
    render();
  }

  function render() {
    //Entered render loop
    raycaster.setFromCamera( pointer, camera );

    const intersects = raycaster.intersectObjects( pipingSystem.children, false );

    if ( intersects.length > 0 ) {
      //console.log(intersects[0].object);
      console.log(intersects[0].object.userData);

      if (INTERSECTED != intersects[0].object) {
        
        if (INTERSECTED) INTERSECTED.material.color = currentColor;

        INTERSECTED = intersects[0].object;
        currentColor = intersects[0].object.material.color;
        INTERSECTED.material.color = new Color("hsl(0, 100%, 50%)");

        //Clear myDiv so that it can show data for clicked item
        myDiv.innerHTML = '';

        //Check if clicked item has userData with it
        if (Object.keys(intersects[0].object.userData).length > 0) {
          let itemData = (intersects[0].object.userData).split(",");

          myDiv.innerHTML += itemData[0];
          myDiv.innerHTML += '<br />Size: ' + itemData[1];

          if (itemData[0].includes("REDUCER") /*|| itemData[0].includes("BEND")*/) {
            myDiv.innerHTML += ' x ' + itemData[9];
          }

          if (itemData[0].includes("ELBOW") || itemData[0].includes("BEND")) {
            //Just skip, nothing to add
          } else {
            myDiv.innerHTML += '<br />Length: ' + itemData[2];
          }
          
          myDiv.innerHTML += '<br />Start: ' + itemData[3] + ", " + itemData[4] + ", " + itemData[5];
          myDiv.innerHTML += '<br />End: ' + itemData[6] + ", " + itemData[7] + ", " + itemData[8];

          if (itemData[0].includes("Tee Header")) {
            myDiv.innerHTML += '<br />Centre: ' + itemData[9] + ", " + itemData[10] + ", " + itemData[11];
          }

        } else {

          myDiv.innerHTML += 'Info not available';

        }

      } 
      
    } else {

      if (INTERSECTED) INTERSECTED.material.color = currentColor;

      INTERSECTED = null;
      myDiv.innerHTML = '';
    }


    renderer.render( scene, camera );
  }
  
  window.init = init;
  window.animate = animate;