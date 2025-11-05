import { createPipe } from "./create_pipe.js";
import { createPipeFixed } from "./create_pipeFixed.js";
import { createFlange } from "./create_flange.js";
import { createBend } from "./create_bend.js";
import { createTee } from "./create_tee.js";
import { createValve } from "./create_valve.js";
import { createReducerConcentric } from "./create_reducer_con.js";
import { createReducerEccentric } from "./create_reducer_ecc.js";
import { createOlet } from "./create_olet.js";
import { createCap } from "./create_cap.js";
import { createCoupling } from "./create_coupling.js";
import { createInstrument } from "./create_instrument.js";
import { createMiscComp } from "./create_miscComp.js";
import { createSupportSKID } from "./create_support_skid.js";
import { createSupportANCH } from "./create_support_anch.js";
import { createSupportHANG } from "./create_support_hang.js";

import { FileLoader, Vector3, Group } from "../vendor_mods/three/build/three.module.js";
import { createValveAngle } from "./create_valveAngle.js";

function pcfLoader(camera, controls, fileLocation) {
    let pipingSystem = new Group(); //All piping components will be added to this Group

    let firstIteration = true;
    let maxX = 0;
    let maxY = 0;
    let maxZ = 0;
    let minX = 0;
    let minY = 0;
    let minZ = 0;

    let allPipingComponents = []; //This is the array that will hold all piping components
    let allElbows = [];
    let allPipes = [];
    let allPipesFixed = [];
    let allFlanges = [];
    let allTees = [];
    let allRedConc = [];
    let allRedEcc = [];
    let allOlets = [];
    let allCaps = [];
    let allValves = [];
    let allCouplings = [];
    let allInstruments = [];
    let allMiscComp = [];
    let allSupports = []; //This is the array that will hold all supports

    /*
    //This section will hold all the future features and piping components that we want to add
    //Y-PIECE-FITTING in 20240216102523.pcf
    */

    //const myFileLocation = './mypcf/pcf/' + fileLocation; //This is to be used in production
    //const myFileLocation = './mypcf/pcf/20240201142349.pcf'; //This is to be used in testing with index.html

    //const loader = new FileLoader();
    //loader.load(
      //resource URL
      
	  //fileLocation,
      
	  
	  var data1 = fileLocation;

      //onLoad callback
      
	  //function ( data1 ) {

          //Strip all spaces from the isogen file and replace it with ","
          let data = data1.replace(/ /g,",");
  
          //iterate over the entire file 7 times and strip ",," with ","
          for (let i = 0; i < 7; i++) {
            data = data.replace(/,,/g,",");
          }
  
          //Iterate over the entire data and store information in different arrays
          //Pipe Array
          //Bend Array
          let data2 = data.split("\n");
          //console.log(data);
  
          //Set scale for multiplying to different values in PCF file
          let boreScale = 1; //for BORE
          let coordScale = 1; // for CO-ORD
          let boreUnit = "MM"; //for saving bore unit
          let coordUnit = "MM"; //for saving CO-ORD unit
  
          //Arrays for piping entities and their counters
          let bend = [];
          let bendCounter = 0;
          let pipe = [];
          let pipeCounter = 0;
          let pipeFixed = [];
          let pipeFixedCounter = 0;
          let flange = [];
          let flangeCounter = 0;
          let tee = [];
          let teeCounter = 0;
          let teeStub = [];
          let teeStubCounter = 0;
          let valve = [];
          let valveCounter = 0;
          let valveAngle = [];
          let valveAngleCounter = 0;
          let redConc = [];
          let redConcCounter = 0;
          let redEcc = [];
          let redEccCounter = 0;
          let olet = [];
          let oletCounter = 0;
          let cap = [];
          let capCounter = 0;
          let coupling = [];
          let couplingCounter = 0;
          let instrument = [];
          let instrumentCounter = 0;
          let miscComp = [];
          let miscCompCounter = 0;
          let suppSKID = [];
          let suppSKIDCounter = 0;
          let suppANCH = [];
          let suppANCHCounter = 0;
          let suppHANG = [];
          let suppHANGCounter = 0;
  
          console.log("data2.length: " + data2.length);
  
          for (let i = 0; i < data2.length; i++) {
            //console.log("iteration " + i + " val: " + data2[i]);
            //While iterating check what are the units for different values and what scale should you use
            let data3 = data2[i].split(",");
            //console.log("data3.length: " + data3.length);
  
            for (let j = 0; j < data3.length; j++) {
              //Depending on the first value sort out the following items
              //If first item is UNITS-BORE, this gives scale for pipe diameter
              
              if (data3[0] === "") {
                //console.log("Blank first column");
              } else if (data3[0].includes("PIPELINE")) {
                //console.log("Ignoring Line with PIPELINE");
                //console.log(data3[0]);
              }  else if (data3[0].includes("UNITS-BORE")) {
                  //If unit is MM, scale is multiply by 0.001;
                  //If unit is IN, scale is multiply by 25.4 and then multiply by 0.001
                  if (data3[1].includes("MM")) {
                    boreScale = 0.001;
                  } else if (data3[1].includes("IN") || data3[1].includes("INCH")) {
                    boreScale = 0.0254; //25.4 * 0.001
                  }

                  boreUnit = data3[1];
  
                  //console.log("boreScale: " + boreScale);
                  //Break the Loop for "j"
                  break;
  
              } else if (data3[0].includes("UNITS-CO-ORDS")) {
                  //If unit is MM, scale is multiply by 0.001;
                  //If unit is IN, scale is multiply by 25.4 and then multiply by 0.001
  
                  if (data3[1].includes("MM")) {
                    coordScale = 0.001;
                  } else if (data3[1].includes("IN") || data3[1].includes("INCH")) {
                    coordScale = 0.0254; //25.4 * 0.001
                  }

                  coordUnit = data3[1];
  
                  //console.log("coordScale: " + coordScale);
                  //Break the Loop for "j"
                  break;
  
              //} else if (data3[0] == "ELBOW" || data3[0] == "ELBOW\r" || data3[0] == "BEND" || data3[0] == "BEND\r") {
              } else if (data3[0].includes("ELBOW") || data3[0] == "BEND" || data3[0] == "BEND\r" || data3[0] == "BEND-TEED" || data3[0] == "BEND-TEED\r") {
                  //console.log("Entered Elbow description");
                  //Get Start Point
                  //Send that information to Elbow function and add it to scene
                  ////////
  
                  //Flag to check if the first END-POINT has been added or not
                  let isFirstPointSet = true;
  
                  //Start, End and Centre Point
                  let startPoint = new Vector3();
                  let endPoint = new Vector3();
                  let centrePoint = new Vector3();
                  let diameter = 1;
                  let componentEnd = "BW";
  
                  for (let myIter = i + 1; myIter < data2.length; myIter++) {
                    let dataIter = data2[myIter].split(",");
                    //If the first column is not equal to blank then break
                    if (dataIter[0] != "") {break;}

                    //If the first column is equal to blank, then continue
                    if (dataIter[1] == "END-POINT") {
                      if (isFirstPointSet === true) {
                        startPoint.setX(dataIter[2] * coordScale);
                        startPoint.setY(dataIter[3] * coordScale);
                        startPoint.setZ(dataIter[4] * coordScale);
                        
                        if (firstIteration === true) {
                            maxX = dataIter[2] * coordScale;
                            maxY = dataIter[3] * coordScale;
                            maxZ = dataIter[4] * coordScale;
                            minX = dataIter[2] * coordScale;
                            minY = dataIter[3] * coordScale;
                            minZ = dataIter[4] * coordScale;
                            
                            firstIteration = false;
                        }
                        
                        if (dataIter[2] * coordScale > maxX ) { maxX = dataIter[2] * coordScale; }
                        if (dataIter[3] * coordScale > maxY ) { maxY = dataIter[3] * coordScale; }
                        if (dataIter[4] * coordScale > maxZ ) { maxZ = dataIter[4] * coordScale; }
                        
                        if (dataIter[2] * coordScale < minX ) { minX = dataIter[2] * coordScale; }
                        if (dataIter[3] * coordScale < minY ) { minY = dataIter[3] * coordScale; }
                        if (dataIter[4] * coordScale < minZ ) { minZ = dataIter[4] * coordScale; }
                        
                        diameter = dataIter[5] * boreScale;

                        if (dataIter[6] != null) {
                          //console.log("There is data for Elbow/Bend end connection");
                          componentEnd = dataIter[6];
                        }
  
                        isFirstPointSet = false;
  
                      } else {
                          //console.log("End Point: " + dataIter[2] * coordScale + "," + dataIter[3] * coordScale + "," + dataIter[4] * coordScale);
                          endPoint.setX(dataIter[2] * coordScale);
                          endPoint.setY(dataIter[3] * coordScale);
                          endPoint.setZ(dataIter[4] * coordScale);
                          
                          if (dataIter[2] * coordScale > maxX ) { maxX = dataIter[2] * coordScale; }
                          if (dataIter[3] * coordScale > maxY ) { maxY = dataIter[3] * coordScale; }
                          if (dataIter[4] * coordScale > maxZ ) { maxZ = dataIter[4] * coordScale; }
                          
                          if (dataIter[2] * coordScale < minX ) { minX = dataIter[2] * coordScale; }
                          if (dataIter[3] * coordScale < minY ) { minY = dataIter[3] * coordScale; }
                          if (dataIter[4] * coordScale < minZ ) { minZ = dataIter[4] * coordScale; }
                      }
                    } else if (dataIter[1] == "CENTRE-POINT") {
                      centrePoint.setX(dataIter[2] * coordScale);
                      centrePoint.setY(dataIter[3] * coordScale);
                      centrePoint.setZ(dataIter[4] * coordScale);
                      
                      if (dataIter[2] * coordScale > maxX ) { maxX = dataIter[2] * coordScale; }
                      if (dataIter[3] * coordScale > maxY ) { maxY = dataIter[3] * coordScale; }
                      if (dataIter[4] * coordScale > maxZ ) { maxZ = dataIter[4] * coordScale; }
                      
                      if (dataIter[2] * coordScale < minX ) { minX = dataIter[2] * coordScale; }
                      if (dataIter[3] * coordScale < minY ) { minY = dataIter[3] * coordScale; }
                      if (dataIter[4] * coordScale < minZ ) { minZ = dataIter[4] * coordScale; }
                    }
                  }
    
                  bend[bendCounter] = createBend(startPoint, endPoint, centrePoint, diameter, componentEnd);

                  //Add Bend parameters to userData
                  bend[bendCounter].userData = data3[0] + "," + (diameter/boreScale).toFixed(2) + boreUnit + "," + (startPoint.distanceTo(centrePoint) / coordScale).toFixed(2) + coordUnit + "," + (startPoint.x / coordScale).toFixed(2) + coordUnit + "," + (startPoint.y / coordScale).toFixed(2) + coordUnit + "," + (startPoint.z / coordScale).toFixed(2) + coordUnit + "," + (endPoint.x / coordScale).toFixed(2) + coordUnit + "," + (endPoint.y / coordScale).toFixed(2) + coordUnit + "," + (endPoint.z / coordScale).toFixed(2) + coordUnit;

                  pipingSystem.add(bend[bendCounter]);
                  bendCounter++;

                  let dummyArray = [];
                  dummyArray.push(data3[0], diameter, startPoint, endPoint, centrePoint);
                  allElbows.push(dummyArray);
                  allPipingComponents.push(dummyArray);
                  //console.log(dummyArray);
  
                  //Break the Loop for "j"
                  break;
  
              } else if (data3[0] == "PIPE-FIXED" || data3[0] == "PIPE-FIXED\r") {
                //Get Start Point
                //Send that information to Pipe function and add it to scene
                ////////
  
                //Flag to check if the first END-POINT has been added or not
                let isFirstPointSet = true;
  
                //Start, End and Centre Point
                let startPoint = new Vector3();
                let endPoint = new Vector3();
                let diameter = 0.1;
  
                for (let myIter = i + 1; myIter < data2.length; myIter++) {
                  let dataIter = data2[myIter].split(",");
                  //If the first column is not equal to blank then break
                  if (dataIter[0] != "") {break;}
                  //If the first column is equal to blank, then continue
  
                  if (dataIter[1] == "END-POINT") {
                    if (isFirstPointSet === true) {
                      //console.log("Start Point: " + dataIter[2] * coordScale + "," + dataIter[3] * coordScale + "," + dataIter[4] * coordScale);
                      startPoint.setX(dataIter[2] * coordScale);
                      startPoint.setY(dataIter[3] * coordScale);
                      startPoint.setZ(dataIter[4] * coordScale);
                      
                      if (firstIteration === true) {
                        maxX = dataIter[2] * coordScale;
                        maxY = dataIter[3] * coordScale;
                        maxZ = dataIter[4] * coordScale;
                        minX = dataIter[2] * coordScale;
                        minY = dataIter[3] * coordScale;
                        minZ = dataIter[4] * coordScale;
                        
                        firstIteration = false;
                      }
                      
                      if (dataIter[2] * coordScale > maxX ) { maxX = dataIter[2] * coordScale; }
                      if (dataIter[3] * coordScale > maxY ) { maxY = dataIter[3] * coordScale; }
                      if (dataIter[4] * coordScale > maxZ ) { maxZ = dataIter[4] * coordScale; }
                      
                      if (dataIter[2] * coordScale < minX ) { minX = dataIter[2] * coordScale; }
                      if (dataIter[3] * coordScale < minY ) { minY = dataIter[3] * coordScale; }
                      if (dataIter[4] * coordScale < minZ ) { minZ = dataIter[4] * coordScale; }

                      diameter = dataIter[5] * boreScale;
  
                      isFirstPointSet = false;
  
                    } else {
                        //console.log("End Point: " + dataIter[2] * coordScale + "," + dataIter[3] * coordScale + "," + dataIter[4] * coordScale);
                        endPoint.setX(dataIter[2] * coordScale);
                        endPoint.setY(dataIter[3] * coordScale);
                        endPoint.setZ(dataIter[4] * coordScale);
  
                        if (dataIter[2] * coordScale > maxX ) { maxX = dataIter[2] * coordScale; }
                        if (dataIter[3] * coordScale > maxY ) { maxY = dataIter[3] * coordScale; }
                        if (dataIter[4] * coordScale > maxZ ) { maxZ = dataIter[4] * coordScale; }
                        
                        if (dataIter[2] * coordScale < minX ) { minX = dataIter[2] * coordScale; }
                        if (dataIter[3] * coordScale < minY ) { minY = dataIter[3] * coordScale; }
                        if (dataIter[4] * coordScale < minZ ) { minZ = dataIter[4] * coordScale; }
                    }
                  }
                }
  
                //console.log(startPoint);
  
                pipeFixed[pipeFixedCounter] = createPipeFixed(startPoint, endPoint, diameter);

                //Add pipeFixed parameters to userData
                pipeFixed[pipeFixedCounter].userData = data3[0] + "," + (diameter/boreScale).toFixed(2) + boreUnit + "," + (startPoint.distanceTo(endPoint) / coordScale).toFixed(2) + coordUnit + "," + (startPoint.x / coordScale).toFixed(2) + coordUnit + "," + (startPoint.y / coordScale).toFixed(2) + coordUnit + "," + (startPoint.z / coordScale).toFixed(2) + coordUnit + "," + (endPoint.x / coordScale).toFixed(2) + coordUnit + "," + (endPoint.y / coordScale).toFixed(2) + coordUnit + "," + (endPoint.z / coordScale).toFixed(2) + coordUnit;

                pipingSystem.add(pipeFixed[pipeFixedCounter]);
                pipeFixedCounter++;

                let dummyArray = [];
                dummyArray.push(data3[0], diameter, startPoint, endPoint);
                allPipesFixed.push(dummyArray);
                allPipingComponents.push(dummyArray);
                //console.log(dummyArray);
  
                //Break the Loop for "j"
                break;
              } else if (data3[0] == "PIPE" || data3[0] == "PIPE\r") {
                //else if (data3[0].includes("PIPE")) {
                //Get Start Point
                //Send that information to Pipe function and add it to scene
                ////////
  
                //Flag to check if the first END-POINT has been added or not
                let isFirstPointSet = true;
  
                //Start, End and Centre Point
                let startPoint = new Vector3();
                let endPoint = new Vector3();
                let diameter = 1;
  
                for (let myIter = i + 1; myIter < data2.length; myIter++) {
                  let dataIter = data2[myIter].split(",");
                  //If the first column is not equal to blank then break
                  if (dataIter[0] != "") {break;}
                  //If the first column is equal to blank, then continue
  
                  if (dataIter[1] == "END-POINT") {
                    if (isFirstPointSet === true) {
                      //console.log("Start Point: " + dataIter[2] * coordScale + "," + dataIter[3] * coordScale + "," + dataIter[4] * coordScale);
                      startPoint.setX(dataIter[2] * coordScale);
                      startPoint.setY(dataIter[3] * coordScale);
                      startPoint.setZ(dataIter[4] * coordScale);
                      
                      if (firstIteration === true) {
                        maxX = dataIter[2] * coordScale;
                        maxY = dataIter[3] * coordScale;
                        maxZ = dataIter[4] * coordScale;
                        minX = dataIter[2] * coordScale;
                        minY = dataIter[3] * coordScale;
                        minZ = dataIter[4] * coordScale;
                        
                        firstIteration = false;
                      }
                      
                      if (dataIter[2] * coordScale > maxX ) { maxX = dataIter[2] * coordScale; }
                      if (dataIter[3] * coordScale > maxY ) { maxY = dataIter[3] * coordScale; }
                      if (dataIter[4] * coordScale > maxZ ) { maxZ = dataIter[4] * coordScale; }
                      
                      if (dataIter[2] * coordScale < minX ) { minX = dataIter[2] * coordScale; }
                      if (dataIter[3] * coordScale < minY ) { minY = dataIter[3] * coordScale; }
                      if (dataIter[4] * coordScale < minZ ) { minZ = dataIter[4] * coordScale; }
  
                      diameter = dataIter[5] * boreScale;
  
                      isFirstPointSet = false;
  
                    } else {
                        //console.log("End Point: " + dataIter[2] * coordScale + "," + dataIter[3] * coordScale + "," + dataIter[4] * coordScale);
                        endPoint.setX(dataIter[2] * coordScale);
                        endPoint.setY(dataIter[3] * coordScale);
                        endPoint.setZ(dataIter[4] * coordScale);
  
                        if (dataIter[2] * coordScale > maxX ) { maxX = dataIter[2] * coordScale; }
                        if (dataIter[3] * coordScale > maxY ) { maxY = dataIter[3] * coordScale; }
                        if (dataIter[4] * coordScale > maxZ ) { maxZ = dataIter[4] * coordScale; }
                        
                        if (dataIter[2] * coordScale < minX ) { minX = dataIter[2] * coordScale; }
                        if (dataIter[3] * coordScale < minY ) { minY = dataIter[3] * coordScale; }
                        if (dataIter[4] * coordScale < minZ ) { minZ = dataIter[4] * coordScale; }
                    }
                  }
                }
  
                //console.log(startPoint);
  
                pipe[pipeCounter] = createPipe(startPoint, endPoint, diameter);

                //Add Pipe parameters to userData
                pipe[pipeCounter].userData = data3[0] + "," + (diameter/boreScale).toFixed(2) + boreUnit + "," + (startPoint.distanceTo(endPoint) / coordScale).toFixed(2) + coordUnit + "," + (startPoint.x / coordScale).toFixed(2) + coordUnit + "," + (startPoint.y / coordScale).toFixed(2) + coordUnit + "," + (startPoint.z / coordScale).toFixed(2) + coordUnit + "," + (endPoint.x / coordScale).toFixed(2) + coordUnit + "," + (endPoint.y / coordScale).toFixed(2) + coordUnit + "," + (endPoint.z / coordScale).toFixed(2) + coordUnit;

                pipingSystem.add(pipe[pipeCounter]);
                pipeCounter++;

                let dummyArray = [];
                dummyArray.push(data3[0], diameter, startPoint, endPoint);
                allPipes.push(dummyArray);
                allPipingComponents.push(dummyArray);
                //console.log(dummyArray);
  
                //Break the Loop for "j"
                break;
              } else if (data3[0].includes("FLANGE")) {
                  //Get Start Point
                  //Send that information to Flange function and add it to scene
                  ////////
    
                  //Flag to check if the first END-POINT has been added or not
                  let isFirstPointSet = true;
    
                  //Start, End and Centre Point
                  let startPoint = new Vector3();
                  let endPoint = new Vector3();
                  let diameter = 1;
    
                  for (let myIter = i + 1; myIter < data2.length; myIter++) {
                    let dataIter = data2[myIter].split(",");
                    //If the first column is not equal to blank then break
                    if (dataIter[0] != "") {break;}
                    //If the first column is equal to blank, then continue
    
                    if (dataIter[1] == "END-POINT") {
                      if (isFirstPointSet === true) {
                        //console.log("Start Point: " + dataIter[2] * coordScale + "," + dataIter[3] * coordScale + "," + dataIter[4] * coordScale);
                        startPoint.setX(dataIter[2] * coordScale);
                        startPoint.setY(dataIter[3] * coordScale);
                        startPoint.setZ(dataIter[4] * coordScale);
                        
                        if (firstIteration === true) {
                          maxX = dataIter[2] * coordScale;
                          maxY = dataIter[3] * coordScale;
                          maxZ = dataIter[4] * coordScale;
                          minX = dataIter[2] * coordScale;
                          minY = dataIter[3] * coordScale;
                          minZ = dataIter[4] * coordScale;
                          
                          firstIteration = false;
                        }
                        
                        if (dataIter[2] * coordScale > maxX ) { maxX = dataIter[2] * coordScale; }
                        if (dataIter[3] * coordScale > maxY ) { maxY = dataIter[3] * coordScale; }
                        if (dataIter[4] * coordScale > maxZ ) { maxZ = dataIter[4] * coordScale; }
                        
                        if (dataIter[2] * coordScale < minX ) { minX = dataIter[2] * coordScale; }
                        if (dataIter[3] * coordScale < minY ) { minY = dataIter[3] * coordScale; }
                        if (dataIter[4] * coordScale < minZ ) { minZ = dataIter[4] * coordScale; }
    
                        diameter = dataIter[5] * boreScale;
                        //Multiply diameter by 1.5 to make it look bigger than pipe
                        //diameter *= 1.5;
    
                        isFirstPointSet = false;
    
                      } else {
                          //console.log("End Point: " + dataIter[2] * coordScale + "," + dataIter[3] * coordScale + "," + dataIter[4] * coordScale);
                          endPoint.setX(dataIter[2] * coordScale);
                          endPoint.setY(dataIter[3] * coordScale);
                          endPoint.setZ(dataIter[4] * coordScale);
    
                          if (dataIter[2] * coordScale > maxX ) { maxX = dataIter[2] * coordScale; }
                          if (dataIter[3] * coordScale > maxY ) { maxY = dataIter[3] * coordScale; }
                          if (dataIter[4] * coordScale > maxZ ) { maxZ = dataIter[4] * coordScale; }
                          
                          if (dataIter[2] * coordScale < minX ) { minX = dataIter[2] * coordScale; }
                          if (dataIter[3] * coordScale < minY ) { minY = dataIter[3] * coordScale; }
                          if (dataIter[4] * coordScale < minZ ) { minZ = dataIter[4] * coordScale; }
                      }
                    }
                  }

                  //If Start Point and End Point are the same then break.
                  if (startPoint.distanceTo(endPoint) == 0) {break;}
    
                  flange[flangeCounter] = createFlange(startPoint, endPoint, diameter);

                  //Add Flange parameters to userData
                  flange[flangeCounter].userData = data3[0] + "," + (diameter/boreScale).toFixed(2) + boreUnit + "," + (startPoint.distanceTo(endPoint) / coordScale).toFixed(2) + coordUnit + "," + (startPoint.x / coordScale).toFixed(2) + coordUnit + "," + (startPoint.y / coordScale).toFixed(2) + coordUnit + "," + (startPoint.z / coordScale).toFixed(2) + coordUnit + "," + (endPoint.x / coordScale).toFixed(2) + coordUnit + "," + (endPoint.y / coordScale).toFixed(2) + coordUnit + "," + (endPoint.z / coordScale).toFixed(2) + coordUnit;

                  pipingSystem.add(flange[flangeCounter]);
                  flangeCounter++;

                  let dummyArray = [];
                  dummyArray.push(data3[0], diameter, startPoint, endPoint);
                  allFlanges.push(dummyArray);
                  allPipingComponents.push(dummyArray);
                  //console.log(dummyArray);
    
                  //Break the Loop for "j"
                  break;
              } else if (data3[0].includes("TEE")) {
                
                  if (data3[0].includes("-TEE")) {
                    //console.log("Reducing something Tee");
                  } else if (!data3[0].includes("-")) {
      
                    //Flag to check if the first END-POINT has been added or not
                    let isFirstPointSet = true;
                    //console.log("Entered Tee");
      
                    //Start, End and Centre Point
                    let startPoint = new Vector3();
                    let endPoint = new Vector3();
                    let midPoint = new Vector3();
                    let branchPoint = new Vector3();
                    let diameter = 1;
                    let diaBranch = 1;
                    let diaEnd = 1; //This is to check if start diameter is different to end diameter, if it is then swap branch dia with the smaller dia.
      
                    for (let myIter = i + 1; myIter < data2.length; myIter++) {
                      let dataIter = data2[myIter].split(",");
                      //If the first column is not equal to blank then break
                      if (dataIter[0] != "") {break;}
                      //If the first column is equal to blank, then continue
      
                      if (dataIter[1] == "END-POINT") {
                        if (isFirstPointSet === true) {
                          startPoint.setX(dataIter[2] * coordScale);
                          startPoint.setY(dataIter[3] * coordScale);
                          startPoint.setZ(dataIter[4] * coordScale);

                          diameter = dataIter[5] * boreScale;
      
                          isFirstPointSet = false;
      
                        } else {
                            endPoint.setX(dataIter[2] * coordScale);
                            endPoint.setY(dataIter[3] * coordScale);
                            endPoint.setZ(dataIter[4] * coordScale);

                            diaEnd = dataIter[5] * boreScale;

                        }
                      } else if (dataIter[1] == "CENTRE-POINT") {
                            midPoint.setX(dataIter[2] * coordScale);
                            midPoint.setY(dataIter[3] * coordScale);
                            midPoint.setZ(dataIter[4] * coordScale);
                      } else if (dataIter[1] == "BRANCH1-POINT") {
                          branchPoint.setX(dataIter[2] * coordScale);
                          branchPoint.setY(dataIter[3] * coordScale);
                          branchPoint.setZ(dataIter[4] * coordScale);

                          diaBranch = dataIter[5] * boreScale;
                      }
                    }

                    //Check if Start diameter is not equal to End dia, if so, swap start Dia with Branch dia
                    if (diameter < diaEnd) {
                      let copyDummyVector = new Vector3();
                      copyDummyVector.copy(startPoint);
                      startPoint.copy(branchPoint);
                      branchPoint.copy(copyDummyVector);

                      diaBranch = diameter;
                      diameter = diaEnd;
                    }

                    //Check if the distance of midPoint to start is less than endPoint to start, if not, swap endPoint and centrePoint
                    if (startPoint.distanceTo(midPoint) > startPoint.distanceTo(endPoint)) {
                      console.log("Tee mid point correction");
                      let copyDummyVector = new Vector3();
                      copyDummyVector.copy(midPoint);
                      midPoint.copy(endPoint);
                      endPoint.copy(copyDummyVector);
                    }
      
                    tee[teeCounter] = createTee(startPoint, endPoint, diameter, midPoint, branchPoint, diaBranch);

                    //Add Tee parameters to userData
                    tee[teeCounter].header.userData = "Tee Header," + (diameter/boreScale).toFixed(2) + boreUnit + "," + (startPoint.distanceTo(endPoint) / coordScale).toFixed(2) + coordUnit + "," + (startPoint.x / coordScale).toFixed(2) + coordUnit + "," + (startPoint.y / coordScale).toFixed(2) + coordUnit + "," + (startPoint.z / coordScale).toFixed(2) + coordUnit + "," + (endPoint.x / coordScale).toFixed(2) + coordUnit + "," + (endPoint.y / coordScale).toFixed(2) + coordUnit + "," + (endPoint.z / coordScale).toFixed(2) + coordUnit + "," + (midPoint.x / coordScale).toFixed(2) + coordUnit + "," + (midPoint.y / coordScale).toFixed(2) + coordUnit + "," + (midPoint.z / coordScale).toFixed(2) + coordUnit;

                    tee[teeCounter].branch.userData = "Tee Branch," + (diaBranch/boreScale).toFixed(2) + boreUnit + "," + (midPoint.distanceTo(branchPoint) / coordScale).toFixed(2) + coordUnit + "," + (midPoint.x / coordScale).toFixed(2) + coordUnit + "," + (midPoint.y / coordScale).toFixed(2) + coordUnit + "," + (midPoint.z / coordScale).toFixed(2) + coordUnit + "," + (branchPoint.x / coordScale).toFixed(2) + coordUnit + "," + (branchPoint.y / coordScale).toFixed(2) + coordUnit + "," + (branchPoint.z / coordScale).toFixed(2) + coordUnit;

                    //pipingSystem.add(tee[teeCounter]);
                    pipingSystem.add(tee[teeCounter].header);
                    pipingSystem.add(tee[teeCounter].branch);

                    tee[teeCounter].header.material.color.set("Green");
                    tee[teeCounter].header.material.opacity = 1;
                    tee[teeCounter].branch.material.color.set("Green");
                    tee[teeCounter].branch.material.opacity = 1;

                    teeCounter++;

                    let dummyArray = [];
                    dummyArray.push(data3[0], diameter, startPoint, endPoint, midPoint, branchPoint);
                    allTees.push(dummyArray);
                    allPipingComponents.push(dummyArray);
                    //console.log(dummyArray);
      
                    //Break the Loop for "j"
                    break;
                  } else {
                    //Assume that it is TEE-STUB or something similar
                    //Get Start Point
                    //Send that information to Olet function and add it to scene
                    ////////

                    //console.log("We are in TEE-STUB or TEE-SET-ON loop");
      
                    //Start, End and Centre Point
                    let startPoint = new Vector3();
                    let endPoint = new Vector3();
                    let diameter = 1;
      
                    for (let myIter = i + 1; myIter < data2.length; myIter++) {
                      let dataIter = data2[myIter].split(",");
                      //If the first column is not equal to blank then break
                      if (dataIter[0] != "") {break;}
                      //If the first column is equal to blank, then continue
      
                      if (dataIter[1] == "CENTRE-POINT") {
                        startPoint.setX(dataIter[2] * coordScale);
                        startPoint.setY(dataIter[3] * coordScale);
                        startPoint.setZ(dataIter[4] * coordScale);

                      } else if (dataIter[1] == "BRANCH1-POINT") {
                        endPoint.setX(dataIter[2] * coordScale);
                        endPoint.setY(dataIter[3] * coordScale);
                        endPoint.setZ(dataIter[4] * coordScale);

                        diameter = dataIter[5] * boreScale;
                      }
                    }

                    //console.log("Special Tee");
                    //console.log(startPoint);
                    //console.log(endPoint);
      
                    teeStub[teeStubCounter] = createOlet(startPoint, endPoint, diameter);

                    //Add TeeStub parameters to userData
                    teeStub[teeStubCounter].userData = data3[0] + "," + (diameter/boreScale).toFixed(2) + boreUnit + "," + (startPoint.distanceTo(endPoint) / coordScale).toFixed(2) + coordUnit + "," + (startPoint.x / coordScale).toFixed(2) + coordUnit + "," + (startPoint.y / coordScale).toFixed(2) + coordUnit + "," + (startPoint.z / coordScale).toFixed(2) + coordUnit + "," + (endPoint.x / coordScale).toFixed(2) + coordUnit + "," + (endPoint.y / coordScale).toFixed(2) + coordUnit + "," + (endPoint.z / coordScale).toFixed(2) + coordUnit;

                    pipingSystem.add(teeStub[teeStubCounter]);

                    teeStub[teeStubCounter].material.color.set("Green");
                    teeStub[teeStubCounter].material.opacity = 1;

                    teeStubCounter++;

                    let dummyArray = [];
                    dummyArray.push(data3[0], diameter, startPoint, endPoint);
                    allTees.push(dummyArray);
                    allPipingComponents.push(dummyArray);
                    //console.log(dummyArray);
      
                    //Break the Loop for "j"
                    break;
                  }
                  
              } else if (data3[0].includes("REDUCER-CONCENTRIC")) {
                //Get Start Point
                //Send that information to Concentric Reducer function and add it to scene
                ////////
  
                //Flag to check if the first END-POINT has been added or not
                let isFirstPointSet = true;
  
                //Start, End and Centre Point
                let startPoint = new Vector3();
                let endPoint = new Vector3();
                let diaStart = 1;
                let diaEnd = 1;
  
                for (let myIter = i + 1; myIter < data2.length; myIter++) {
                  let dataIter = data2[myIter].split(",");
                  //If the first column is not equal to blank then break
                  if (dataIter[0] != "") {break;}
                  //If the first column is equal to blank, then continue
  
                  if (dataIter[1] == "END-POINT") {
                    if (isFirstPointSet === true) {
                      startPoint.setX(dataIter[2] * coordScale);
                      startPoint.setY(dataIter[3] * coordScale);
                      startPoint.setZ(dataIter[4] * coordScale);
                      
                      diaStart = dataIter[5] * boreScale;
  
                      isFirstPointSet = false;
  
                    } else {
                        endPoint.setX(dataIter[2] * coordScale);
                        endPoint.setY(dataIter[3] * coordScale);
                        endPoint.setZ(dataIter[4] * coordScale);
  
                        diaEnd = dataIter[5] * boreScale;
                    }
                  }
                }
  
                redConc[redConcCounter] = createReducerConcentric(startPoint, endPoint, diaStart, diaEnd);

                //Add Concentric Reducer parameters to userData
                redConc[redConcCounter].userData = data3[0] + "," + (diaStart/boreScale).toFixed(2) + boreUnit + "," + (startPoint.distanceTo(endPoint) / coordScale).toFixed(2) + coordUnit + "," + (startPoint.x / coordScale).toFixed(2) + coordUnit + "," + (startPoint.y / coordScale).toFixed(2) + coordUnit + "," + (startPoint.z / coordScale).toFixed(2) + coordUnit + "," + (endPoint.x / coordScale).toFixed(2) + coordUnit + "," + (endPoint.y / coordScale).toFixed(2) + coordUnit + "," + (endPoint.z / coordScale).toFixed(2) + coordUnit + "," + (diaEnd/boreScale).toFixed(2) + boreUnit;
                
                pipingSystem.add(redConc[redConcCounter]);
                redConcCounter++;

                let dummyArray = [];
                dummyArray.push(data3[0], diaStart + "x" + diaEnd, startPoint, endPoint);
                allRedConc.push(dummyArray);
                allPipingComponents.push(dummyArray);
                //console.log(dummyArray);
  
                //Break the Loop for "j"
                break;
              } else if (data3[0].includes("REDUCER-ECCENTRIC")) {
                //Get Start Point
                //Send that information to Eccentric Reducer function and add it to scene
                ////////
  
                //Flag to check if the first END-POINT has been added or not
                let isFirstPointSet = true;
  
                //Start, End and Centre Point
                let startPoint = new Vector3();
                let endPoint = new Vector3();
                let diaStart = 1;
                let diaEnd = 1;
  
                for (let myIter = i + 1; myIter < data2.length; myIter++) {
                  let dataIter = data2[myIter].split(",");
                  //If the first column is not equal to blank then break
                  if (dataIter[0] != "") {break;}
                  //If the first column is equal to blank, then continue
  
                  if (dataIter[1] == "END-POINT") {
                    if (isFirstPointSet === true) {
                      startPoint.setX(dataIter[2] * coordScale);
                      startPoint.setY(dataIter[3] * coordScale);
                      startPoint.setZ(dataIter[4] * coordScale);
                      
                      diaStart = dataIter[5] * boreScale;
  
                      isFirstPointSet = false;
  
                    } else {
                        endPoint.setX(dataIter[2] * coordScale);
                        endPoint.setY(dataIter[3] * coordScale);
                        endPoint.setZ(dataIter[4] * coordScale);
  
                        diaEnd = dataIter[5] * boreScale;
                    }
                  }
                }
  
                redEcc[redEccCounter] = createReducerEccentric(startPoint, endPoint, diaStart, diaEnd);

                //Add Eccentric Reducer parameters to userData
                redEcc[redEccCounter].userData = data3[0] + "," + (diaStart/boreScale).toFixed(2) + boreUnit + "," + (startPoint.distanceTo(endPoint) / coordScale).toFixed(2) + coordUnit + "," + (startPoint.x / coordScale).toFixed(2) + coordUnit + "," + (startPoint.y / coordScale).toFixed(2) + coordUnit + "," + (startPoint.z / coordScale).toFixed(2) + coordUnit + "," + (endPoint.x / coordScale).toFixed(2) + coordUnit + "," + (endPoint.y / coordScale).toFixed(2) + coordUnit + "," + (endPoint.z / coordScale).toFixed(2) + coordUnit + "," + (diaEnd/boreScale).toFixed(2) + boreUnit;

                pipingSystem.add(redEcc[redEccCounter]);
                redEccCounter++;

                let dummyArray = [];
                dummyArray.push(data3[0], diaStart + "x" + diaEnd, startPoint, endPoint);
                allRedEcc.push(dummyArray);
                allPipingComponents.push(dummyArray);
                //console.log(dummyArray);
  
                //Break the Loop for "j"
                break;
              } else if (data3[0].includes("OLET")) {
                  //Get Start Point
                  //Send that information to Olet function and add it to scene
                  ////////
    
                  //Start, End and Centre Point
                  let startPoint = new Vector3();
                  let endPoint = new Vector3();
                  let diameter = 1;
    
                  for (let myIter = i + 1; myIter < data2.length; myIter++) {
                    let dataIter = data2[myIter].split(",");
                    //If the first column is not equal to blank then break
                    if (dataIter[0] != "") {break;}
                    //If the first column is equal to blank, then continue
    
                    if (dataIter[1] == "CENTRE-POINT") {
                      startPoint.setX(dataIter[2] * coordScale);
                      startPoint.setY(dataIter[3] * coordScale);
                      startPoint.setZ(dataIter[4] * coordScale);

                    } else if (dataIter[1] == "BRANCH1-POINT") {
                      endPoint.setX(dataIter[2] * coordScale);
                      endPoint.setY(dataIter[3] * coordScale);
                      endPoint.setZ(dataIter[4] * coordScale);

                      diameter = dataIter[5] * boreScale;
                    }
                  }
    
                  olet[oletCounter] = createOlet(startPoint, endPoint, diameter);

                  //Add Olet parameters to userData
                  olet[oletCounter].userData = data3[0] + "," + (diameter/boreScale).toFixed(2) + boreUnit + "," + (startPoint.distanceTo(endPoint) / coordScale).toFixed(2) + coordUnit + "," + (startPoint.x / coordScale).toFixed(2) + coordUnit + "," + (startPoint.y / coordScale).toFixed(2) + coordUnit + "," + (startPoint.z / coordScale).toFixed(2) + coordUnit + "," + (endPoint.x / coordScale).toFixed(2) + coordUnit + "," + (endPoint.y / coordScale).toFixed(2) + coordUnit + "," + (endPoint.z / coordScale).toFixed(2) + coordUnit;

                  pipingSystem.add(olet[oletCounter]);
                  oletCounter++;

                  let dummyArray = [];
                  dummyArray.push(data3[0], diameter, startPoint, endPoint);
                  allOlets.push(dummyArray);
                  allPipingComponents.push(dummyArray);
                  //console.log(dummyArray);
    
                  //Break the Loop for "j"
                  break;
              } else if (data3[0].includes("CAP")) {
                //Get Start Point
                //Send that information to Cap function and add it to scene
                ////////

                //Flag to check if the first END-POINT has been added or not
                let isFirstPointSet = true;

                //Start, End and Centre Point
                let startPoint = new Vector3();
                let endPoint = new Vector3();
                let diameter = 1;

                for (let myIter = i + 1; myIter < data2.length; myIter++) {
                  let dataIter = data2[myIter].split(",");
                  //If the first column is not equal to blank then break
                  if (dataIter[0] != "") {break;}
                  //If the first column is equal to blank, then continue

                  if (dataIter[1] == "END-POINT") {
                    if (isFirstPointSet === true) {
                      startPoint.setX(dataIter[2] * coordScale);
                      startPoint.setY(dataIter[3] * coordScale);
                      startPoint.setZ(dataIter[4] * coordScale);

                      diameter = dataIter[5] * boreScale;

                      isFirstPointSet = false;
                    } else {
                        endPoint.setX(dataIter[2] * coordScale);
                        endPoint.setY(dataIter[3] * coordScale);
                        endPoint.setZ(dataIter[4] * coordScale);
                    }
                  }
                }

                cap[capCounter] = createCap(startPoint, endPoint, diameter);

                //Add Cap parameters to userData
                cap[capCounter].userData = data3[0] + "," + (diameter/boreScale).toFixed(2) + boreUnit + "," + (startPoint.distanceTo(endPoint) / coordScale).toFixed(2) + coordUnit + "," + (startPoint.x / coordScale).toFixed(2) + coordUnit + "," + (startPoint.y / coordScale).toFixed(2) + coordUnit + "," + (startPoint.z / coordScale).toFixed(2) + coordUnit + "," + (endPoint.x / coordScale).toFixed(2) + coordUnit + "," + (endPoint.y / coordScale).toFixed(2) + coordUnit + "," + (endPoint.z / coordScale).toFixed(2) + coordUnit;

                pipingSystem.add(cap[capCounter]);
                capCounter++;

                let dummyArray = [];
                dummyArray.push(data3[0], diameter, startPoint, endPoint);
                allCaps.push(dummyArray);
                allPipingComponents.push(dummyArray);
                //console.log(dummyArray);

                //Break the Loop for "j"
                break;
              } else if (data3[0].includes("VALVE")) {
                  //Get Start Point
                  //Send that information to Flange function and add it to scene
                  ////////

                  //Flag to check if the first END-POINT has been added or not
                  let isFirstPointSet = true;

                  //Start, End and Centre Point
                  let startPoint = new Vector3();
                  let endPoint = new Vector3();
                  let midPoint = new Vector3();
                  let diameter = 1;
                  let diameter2 = 1; //For Angle valve

                  for (let myIter = i + 1; myIter < data2.length; myIter++) {
                    let dataIter = data2[myIter].split(",");
                    //If the first column is not equal to blank then break
                    if (dataIter[0] != "") {break;}
                    //If the first column is equal to blank, then continue

                    if (dataIter[1] == "END-POINT") {
                      if (isFirstPointSet === true) {
                        startPoint.setX(dataIter[2] * coordScale);
                        startPoint.setY(dataIter[3] * coordScale);
                        startPoint.setZ(dataIter[4] * coordScale);

                        diameter = dataIter[5] * boreScale;

                        isFirstPointSet = false;

                      } else {
                          endPoint.setX(dataIter[2] * coordScale);
                          endPoint.setY(dataIter[3] * coordScale);
                          endPoint.setZ(dataIter[4] * coordScale);

                          if (data3[0].includes("ANGLE")) {
                            diameter2 = dataIter[5] * boreScale;
                          }
                      }
                    }  else if (dataIter[1] == "CENTRE-POINT") {
                      midPoint.setX(dataIter[2] * coordScale);
                      midPoint.setY(dataIter[3] * coordScale);
                      midPoint.setZ(dataIter[4] * coordScale);
                    }
                  } 

                  if (data3[0].includes("ANGLE")) {
                    
                    //Add first half of the angle valve
                    valveAngle[valveAngleCounter] = createValveAngle(startPoint, midPoint, diameter);

                    //Add Valve parameters to userData
                    valveAngle[valveAngleCounter].userData = data3[0] + "," + (diameter/boreScale).toFixed(2) + boreUnit + "," + (startPoint.distanceTo(midPoint) / coordScale).toFixed(2) + coordUnit + "," + (startPoint.x / coordScale).toFixed(2) + coordUnit + "," + (startPoint.y / coordScale).toFixed(2) + coordUnit + "," + (startPoint.z / coordScale).toFixed(2) + coordUnit + "," + (midPoint.x / coordScale).toFixed(2) + coordUnit + "," + (midPoint.y / coordScale).toFixed(2) + coordUnit + "," + (midPoint.z / coordScale).toFixed(2) + coordUnit;

                    pipingSystem.add(valveAngle[valveAngleCounter]);

                    valveAngleCounter++;

                    //Add second half of the angle valve
                    valveAngle[valveAngleCounter] = createValveAngle(midPoint, endPoint, diameter2);

                    //Add Valve parameters to userData
                    valveAngle[valveAngleCounter].userData = data3[0] + "," + (diameter2/boreScale).toFixed(2) + boreUnit + "," + (midPoint.distanceTo(endPoint) / coordScale).toFixed(2) + coordUnit + "," + (midPoint.x / coordScale).toFixed(2) + coordUnit + "," + (midPoint.y / coordScale).toFixed(2) + coordUnit + "," + (midPoint.z / coordScale).toFixed(2) + coordUnit + "," + (endPoint.x / coordScale).toFixed(2) + coordUnit + "," + (endPoint.y / coordScale).toFixed(2) + coordUnit + "," + (endPoint.z / coordScale).toFixed(2) + coordUnit;

                    pipingSystem.add(valveAngle[valveAngleCounter]);

                    valveAngleCounter++;

                  } else {

                    valve[valveCounter] = createValve(startPoint, endPoint, diameter);

                    //Add Valve parameters to userData
                    valve[valveCounter].valveCover.userData = data3[0] + "," + (diameter/boreScale).toFixed(2) + boreUnit + "," + (startPoint.distanceTo(endPoint) / coordScale).toFixed(2) + coordUnit + "," + (startPoint.x / coordScale).toFixed(2) + coordUnit + "," + (startPoint.y / coordScale).toFixed(2) + coordUnit + "," + (startPoint.z / coordScale).toFixed(2) + coordUnit + "," + (endPoint.x / coordScale).toFixed(2) + coordUnit + "," + (endPoint.y / coordScale).toFixed(2) + coordUnit + "," + (endPoint.z / coordScale).toFixed(2) + coordUnit;

                    pipingSystem.add(valve[valveCounter].valve, valve[valveCounter].valveCover);
                    valveCounter++;

                  }

                  let dummyArray = [];
                  dummyArray.push(data3[0], diameter, startPoint, endPoint);
                  allValves.push(dummyArray);
                  allPipingComponents.push(dummyArray);
                  //console.log(dummyArray);

                  //Break the Loop for "j"
                  break;
              } else if (data3[0].includes("COUPLING")) {
                //Get Start Point
                //Send that information to Flange function and add it to scene
                ////////

                //Flag to check if the first END-POINT has been added or not
                let isFirstPointSet = true;

                //Start, End and Centre Point
                let startPoint = new Vector3();
                let endPoint = new Vector3();
                let diameter = 1;

                for (let myIter = i + 1; myIter < data2.length; myIter++) {
                  let dataIter = data2[myIter].split(",");
                  //If the first column is not equal to blank then break
                  if (dataIter[0] != "") {break;}
                  //If the first column is equal to blank, then continue

                  if (dataIter[1] == "END-POINT") {
                    if (isFirstPointSet === true) {
                      //console.log("Start Point: " + dataIter[2] * coordScale + "," + dataIter[3] * coordScale + "," + dataIter[4] * coordScale);
                      startPoint.setX(dataIter[2] * coordScale);
                      startPoint.setY(dataIter[3] * coordScale);
                      startPoint.setZ(dataIter[4] * coordScale);

                      diameter = dataIter[5] * boreScale;

                      isFirstPointSet = false;

                    } else {
                        //console.log("End Point: " + dataIter[2] * coordScale + "," + dataIter[3] * coordScale + "," + dataIter[4] * coordScale);
                        endPoint.setX(dataIter[2] * coordScale);
                        endPoint.setY(dataIter[3] * coordScale);
                        endPoint.setZ(dataIter[4] * coordScale);
                    }
                  }
                }

                coupling[couplingCounter] = createCoupling(startPoint, endPoint, diameter);

                //Add Coupling parameters to userData
                coupling[couplingCounter].userData = data3[0] + "," + (diameter/boreScale).toFixed(2) + boreUnit + "," + (startPoint.distanceTo(endPoint) / coordScale).toFixed(2) + coordUnit + "," + (startPoint.x / coordScale).toFixed(2) + coordUnit + "," + (startPoint.y / coordScale).toFixed(2) + coordUnit + "," + (startPoint.z / coordScale).toFixed(2) + coordUnit + "," + (endPoint.x / coordScale).toFixed(2) + coordUnit + "," + (endPoint.y / coordScale).toFixed(2) + coordUnit + "," + (endPoint.z / coordScale).toFixed(2) + coordUnit;

                pipingSystem.add(coupling[couplingCounter]);
                couplingCounter++;

                let dummyArray = [];
                dummyArray.push(data3[0], diameter, startPoint, endPoint);
                allCouplings.push(dummyArray);
                allPipingComponents.push(dummyArray);
                //console.log(dummyArray);

                //Break the Loop for "j"
                break;
              } else if (data3[0].includes("INSTRUMENT")) {
                //Get Start Point
                //Send that information to Flange function and add it to scene
                ////////

                //Flag to check if the first END-POINT has been added or not
                let isFirstPointSet = true;

                //Start, End and Centre Point
                let startPoint = new Vector3();
                let endPoint = new Vector3();
                let diameter = 1;

                for (let myIter = i + 1; myIter < data2.length; myIter++) {
                  let dataIter = data2[myIter].split(",");
                  //If the first column is not equal to blank then break
                  if (dataIter[0] != "") {break;}
                  //If the first column is equal to blank, then continue

                  if (dataIter[1] == "END-POINT") {
                    if (isFirstPointSet === true) {
                      //console.log("Start Point: " + dataIter[2] * coordScale + "," + dataIter[3] * coordScale + "," + dataIter[4] * coordScale);
                      startPoint.setX(dataIter[2] * coordScale);
                      startPoint.setY(dataIter[3] * coordScale);
                      startPoint.setZ(dataIter[4] * coordScale);

                      diameter = dataIter[5] * boreScale;

                      isFirstPointSet = false;

                    } else {
                        //console.log("End Point: " + dataIter[2] * coordScale + "," + dataIter[3] * coordScale + "," + dataIter[4] * coordScale);
                        endPoint.setX(dataIter[2] * coordScale);
                        endPoint.setY(dataIter[3] * coordScale);
                        endPoint.setZ(dataIter[4] * coordScale);
                    }
                  }
                }

                instrument[instrumentCounter] = createInstrument(startPoint, endPoint, diameter);

                //Add Instrument parameters to userData
                instrument[instrumentCounter].userData = data3[0] + "," + (diameter/boreScale).toFixed(2) + boreUnit + "," + (startPoint.distanceTo(endPoint) / coordScale).toFixed(2) + coordUnit + "," + (startPoint.x / coordScale).toFixed(2) + coordUnit + "," + (startPoint.y / coordScale).toFixed(2) + coordUnit + "," + (startPoint.z / coordScale).toFixed(2) + coordUnit + "," + (endPoint.x / coordScale).toFixed(2) + coordUnit + "," + (endPoint.y / coordScale).toFixed(2) + coordUnit + "," + (endPoint.z / coordScale).toFixed(2) + coordUnit;

                pipingSystem.add(instrument[instrumentCounter]);
                instrumentCounter++;

                let dummyArray = [];
                dummyArray.push(data3[0], diameter, startPoint, endPoint);
                allInstruments.push(dummyArray);
                allPipingComponents.push(dummyArray);
                //console.log(dummyArray);

                //Break the Loop for "j"
                break;
              }  else if (data3[0].includes("MISC-COMPONENT")) {
                //Get Start Point
                //Send that information to Flange function and add it to scene
                ////////

                //Flag to check if the first END-POINT has been added or not
                let isFirstPointSet = true;

                //Start, End and Centre Point
                let startPoint = new Vector3();
                let endPoint = new Vector3();
                let diameter = 1;

                for (let myIter = i + 1; myIter < data2.length; myIter++) {
                  let dataIter = data2[myIter].split(",");
                  //If the first column is not equal to blank then break
                  if (dataIter[0] != "") {break;}
                  //If the first column is equal to blank, then continue

                  if (dataIter[1] == "END-POINT") {
                    if (isFirstPointSet === true) {
                      //console.log("Start Point: " + dataIter[2] * coordScale + "," + dataIter[3] * coordScale + "," + dataIter[4] * coordScale);
                      startPoint.setX(dataIter[2] * coordScale);
                      startPoint.setY(dataIter[3] * coordScale);
                      startPoint.setZ(dataIter[4] * coordScale);

                      diameter = dataIter[5] * boreScale;

                      isFirstPointSet = false;

                    } else {
                        //console.log("End Point: " + dataIter[2] * coordScale + "," + dataIter[3] * coordScale + "," + dataIter[4] * coordScale);
                        endPoint.setX(dataIter[2] * coordScale);
                        endPoint.setY(dataIter[3] * coordScale);
                        endPoint.setZ(dataIter[4] * coordScale);
                    }
                  }
                }

                miscComp[miscCompCounter] = createMiscComp(startPoint, endPoint, diameter);

                //Add Misc Components parameters to userData
                miscComp[miscCompCounter].userData = data3[0] + "," + (diameter/boreScale).toFixed(2) + boreUnit + "," + (startPoint.distanceTo(endPoint) / coordScale).toFixed(2) + coordUnit + "," + (startPoint.x / coordScale).toFixed(2) + coordUnit + "," + (startPoint.y / coordScale).toFixed(2) + coordUnit + "," + (startPoint.z / coordScale).toFixed(2) + coordUnit + "," + (endPoint.x / coordScale).toFixed(2) + coordUnit + "," + (endPoint.y / coordScale).toFixed(2) + coordUnit + "," + (endPoint.z / coordScale).toFixed(2) + coordUnit;

                pipingSystem.add(miscComp[miscCompCounter]);
                miscCompCounter++;

                let dummyArray = [];
                dummyArray.push(data3[0], diameter, startPoint, endPoint);
                allMiscComp.push(dummyArray);
                allPipingComponents.push(dummyArray);
                //console.log(dummyArray);

                //Break the Loop for "j"
                break;
              } else if (data3[0].includes("SUPPORT")) {
                //Get Start Point
                //Send that information to Support function and add it to scene
                ////////

                //Start, End and Centre Point
                let startPoint = new Vector3();
                //let endPoint = new Vector3();
                let diameter = 1;
                let suppType = "SUPP";
                let suppDirection = "DOWN";

                for (let myIter = i + 1; myIter < data2.length; myIter++) {
                  let dataIter = data2[myIter].split(",");
                  //If the first column is not equal to blank then break
                  if (dataIter[0] != "") {break;}
                  //If the first column is equal to blank, then continue

                  if (dataIter[1] == "CO-ORDS") {
                    //console.log("Start Point: " + dataIter[2] * coordScale + "," + dataIter[3] * coordScale + "," + dataIter[4] * coordScale);
                    startPoint.setX(dataIter[2] * coordScale);
                    startPoint.setY(dataIter[3] * coordScale);
                    startPoint.setZ(dataIter[4] * coordScale);

                    diameter = dataIter[5] * boreScale;                
                    
                  } else if (dataIter[1] == "SKEY") {
                    
                    if (dataIter[2].includes("SKID")) {
                      suppType = "SKID";
                    } else if (dataIter[2].includes("ANCH") || dataIter[2].includes("ANC")) {
                      suppType = "ANCH";
                    } else if (dataIter[2].includes("HANG")) {
                      suppType = "HANG";
                    } else if (dataIter[2].includes("DUCK")) {
                      suppType = "DUCK";
                    } else if (dataIter[2].includes("SUPP")) {
                      suppType = "SUPP";
                    } else if (dataIter[2].includes("GUID")) {
                      suppType = "SKID";
                    } else if (dataIter[2] == "") {
                      suppType = "SUPP";
                    } 
                    //console.log("suppType");
                    //console.log(suppType);
                  } else if (dataIter[1] == "SUPPORT-DIRECTION") {
                    if (dataIter[2].includes("DOWN")) {
                      suppDirection = "DOWN";
                    } else if (dataIter[2].includes("UP")) {
                      suppDirection = "UP";
                    } else if (dataIter[2].includes("EAST")) {
                      suppDirection = "EAST";
                    } else if (dataIter[2].includes("WEST")) {
                      suppDirection = "WEST";
                    } else if (dataIter[2].includes("NORTH")) {
                      suppDirection = "NORTH";
                    } else if (dataIter[2].includes("SOUTH")) {
                      suppDirection = "SOUTH";
                    }
                  }
                }

                let dummyArray = [];
                //let pipeLookAt = new Vector3(1,0,0);  //This was giving error as all supports were looking at (1,0,0) which is not correct.
                //dummyArray.push("SUPPORT", suppType, suppDirection, diameter, startPoint, pipeLookAt);
                dummyArray.push("SUPPORT", suppType, suppDirection, diameter, startPoint);
                allSupports.push(dummyArray);

                //Break the Loop for "j"
                break;
              } 
            }
          }

          //add Pipe properties to the Hidden Side Panel
          var myPipeProp = document.getElementById('fileProperties');
          myPipeProp.innerHTML += '<p>No of Pipe segments: ' + pipeCounter + '</p>';
          myPipeProp.innerHTML += '<p>No of Bends: ' + bendCounter + '</p>';
          myPipeProp.innerHTML += '<p>No of Flanges: ' + flangeCounter + '</p>';
          myPipeProp.innerHTML += '<p>No of Tees: ' + teeCounter + '</p>';
          myPipeProp.innerHTML += '<p>No of Stub-ins: ' + teeStubCounter + '</p>';
          myPipeProp.innerHTML += '<p>No of Olets: ' + oletCounter + '</p>';
          myPipeProp.innerHTML += '<p>No of Valves: ' + valveCounter + '</p>';
          myPipeProp.innerHTML += '<p>No of Concentric Reducers: ' + redConcCounter + '</p>';
          myPipeProp.innerHTML += '<p>No of Eccentric Reducers: ' + redEccCounter + '</p>';
          myPipeProp.innerHTML += '<p>No of Couplings: ' + couplingCounter + '</p>';
          myPipeProp.innerHTML += '<p>No of Caps: ' + capCounter + '</p>';
          myPipeProp.innerHTML += '<p>No of Instruments: ' + instrumentCounter + '</p>';
          myPipeProp.innerHTML += '<p>No of Miscellaneous Components: ' + miscCompCounter + '</p>';
          
          const boxSetMax = new Vector3(maxX, maxY, maxZ);
          const boxSetMin = new Vector3(minX, minY, minZ);
          const boxMidPoint = new Vector3();
          boxMidPoint.lerpVectors(boxSetMin, boxSetMax, 0.5);

          //Find maximum Diameter from the allPipingComponents array.
          const maxDiaOfPipes = allPipingComponents.reduce((max, dia) => {
            return dia[1] > max[1] ? dia : max;
          });

          //Iterate over all supports array and draw supports as required
          for (let x = 0; x < allSupports.length; x++) {
                      
            //If Support Diameter is not there or is zero use max diameter of pipes
            if (!allSupports[x][3] || allSupports[x][3] <= 0) {
              //allSupports[x][3] = maxDiaOfPipes[1];
              allSupports[x][3] = 0.2;
            }
            
            //let epsilon = Number.EPSILON;
            let epsilon = 0.0001;
            
            //console.log(epsilon);
            /*console.log(allSupports[x][4].x);
            console.log(allSupports[x][4].y);
            console.log(allSupports[x][4].z);*/
            
            for (let y = 0; y < allPipingComponents.length; y++) {
              //If support vector is equal to either start or end point then 
              //create a normal vector from start to end point
              //if (allSupports[x][4].equals(allPipingComponents[y][2]) || allSupports[x][4].equals(allPipingComponents[y][3])) {
              if ( ( ( Math.abs(allSupports[x][4].x - allPipingComponents[y][2].x) < epsilon ) && ( Math.abs(allSupports[x][4].y - allPipingComponents[y][2].y) < epsilon ) && ( Math.abs( allSupports[x][4].z - allPipingComponents[y][2].z ) < epsilon ) ) || ( ( Math.abs( allSupports[x][4].x - allPipingComponents[y][3].x ) < epsilon ) && ( Math.abs( allSupports[x][4].y - allPipingComponents[y][3].y ) < epsilon ) && ( Math.abs( allSupports[x][4].z - allPipingComponents[y][3].z ) < epsilon ) ) ) {
                const s_start_dir = new Vector3();
                s_start_dir.subVectors(allPipingComponents[y][2], allPipingComponents[y][3]).normalize();

                //make diameter of support equal to pipe diameter.
                allSupports[x][3] = allPipingComponents[y][1];

                //save Pipe LookAt direction to allSupports
                allSupports[x][5] = s_start_dir;
                
                console.log("Support point is on a point");
              }
              
              //If support vector is on the line between start and end point then
              //create a normal vector from start to end point
              
              const nvStartToEnd = new Vector3();
              nvStartToEnd.subVectors(allPipingComponents[y][2], allPipingComponents[y][3]).normalize();
              //console.log(nvStartToEnd);
              
              const nvStartToSupp = new Vector3();
              nvStartToSupp.subVectors(allSupports[x][4], allPipingComponents[y][2]).normalize();
              //console.log(nvStartToSupp);
              
              /*const nvEndToSupp = new Vector3();
              nvEndToSupp.subVectors(allSupports[x][4], allPipingComponents[y][3]).normalize();*/
              //console.log(nvEndToSupp);

              //console.log("(Math.abs(nvStartToEnd.dot(nvStartToSupp)) -1)");
              //console.log(Math.abs(nvStartToEnd.dot(nvStartToSupp)) -1);
              
              /*console.log("(nvStartToEnd.dot(nvStartToSupp) < (1 - epsilon))");
              console.log(nvStartToEnd.dot(nvStartToSupp));
              console.log(1 - epsilon);
              console.log("--------------------")
              console.log("nvStartToEnd.dot(nvEndToSupp) < -( 1 - epsilon))");
              console.log(nvStartToEnd.dot(nvEndToSupp));
              console.log(-( 1 - epsilon));*/
              
              //-------------------
              // It is not working for file 017-ASPIRAZIONE_BOG_DN25.pcf
              // It is not working for file 01PH11222-XXX.pcf
              //-------------------
              
              //if ((nvStartToEnd.dot(nvStartToSupp) < (1 - epsilon)) && (nvStartToEnd.dot(nvEndToSupp) < -( 1 - epsilon))) {
              if ((Math.abs(nvStartToEnd.dot(nvStartToSupp)) - 1) > -epsilon) {
              //if (((Math.abs(nvStartToEnd.dot(nvStartToSupp)) - 1) > -epsilon) && (Math.abs((nvStartToEnd.dot(nvStartToSupp)) - 1) <= 0.0)) {
                  //save Pipe LookAt direction to allSupports
                  allSupports[x][5] = nvStartToEnd;
                  
                  console.log("Support point is on line");
              }

            }
            
            //If support coordinates match, then send it to respective module and generate the support
              if (allSupports[x][1] == "HANG" || allSupports[x][1] == "SUPP") {
                //console.log(allSupports[x][3]);
                suppHANG[suppHANGCounter] = createSupportHANG(allSupports[x][4], allSupports[x][3]);
    
                pipingSystem.add(suppHANG[suppHANGCounter]);
                suppHANGCounter++;
    
              } else if (allSupports[x][1] == "ANCH") {
                  
                //console.log(allSupports[x][5]);
                  
                suppANCH[suppANCHCounter] = createSupportANCH(allSupports[x][4], allSupports[x][3], allSupports[x][5]);
                
                pipingSystem.add(suppANCH[suppANCHCounter]);
                suppANCHCounter++;
    
              } else if (allSupports[x][1] == "SKID" || allSupports[x][1] == "DUCK") {
    
                suppSKID[suppSKIDCounter] = createSupportSKID(allSupports[x][4], allSupports[x][3], allSupports[x][2], allSupports[x][5]);
    
                pipingSystem.add(suppSKID[suppSKIDCounter]);
                suppSKIDCounter++;
              }
              
          }
          
          /*console.log("allSupports");
          console.log(allSupports);
          console.log("allPipingComponents");
          console.log(allPipingComponents);*/
          
          //Find biggest number from the box length, width and height
          //and use it as camera Position
          let camPos = 1;

          if ((maxX - minX) > (maxY - minY)) {
            if ((maxX - minX) > (maxZ - minZ)) {
              camPos = (maxX - minX);
            } else {
              camPos = (maxZ - minZ);
            } 
          } else if ((maxY - minY) > (maxZ - minZ)) {
            camPos = (maxY - minY);
          } else {
            camPos = (maxZ - minZ);
          }

          if (camPos < 10) {camPos = 10;}

          //From the boxMidPoint, add camPos in all three directions and then use it as the position.
          camera.position.set(boxMidPoint.x - camPos, boxMidPoint.y - camPos, boxMidPoint.z + camPos);

          camera.lookAt(boxMidPoint);
          controls.target.copy(boxMidPoint);
          controls.update();
    //    },

    //    undefined, function ( error ) {
    //      console.log(error);
    //    }
   
	//);

    return pipingSystem;
}

export { pcfLoader };