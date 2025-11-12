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
  CylinderGeometry,
  Mesh,
} from "../vendor_mods/three/build/three.module.js";

import { OrbitControls } from "../vendor_mods/three/examples/jsm/controls/OrbitControls.js";
import { ViewHelper } from "../vendor_mods/three/examples/jsm/helpers/ViewHelper.js";

import { pcfLoader } from "./pcfloader.js";

let renderer, scene, camera, controls, helper, pipingSystem;

let raycaster;
let INTERSECTED;
const pointer = new Vector2();
let currentColor = new Color();
let myDiv = document.getElementById("objProp");
let contextMenu = null;
let selectedObject = null;

//init();
//animate();

function init(test) {
  //Default Z direction Up
  Object3D.DEFAULT_UP = new Vector3(0, 0, 1);

  //got this idea from https://sentry.io/answers/how-to-get-values-from-urls-in-javascript/#:~:text=Getting%20URL%20Query%20Parameters%20in%20the%20Browser&text=The%20get()%20method%20returns,for%20a%20given%20query%20parameter.
  const searchParams = new URLSearchParams(window.location.search);
  let fileLocation = searchParams.get("fl");

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
  scene.background = new Color("lightblue");

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
  const light = new HemisphereLight(0xffffff, 0x555555, 8);
  scene.add(light);

  //pipingSystem to be loaded here
  pipingSystem = new pcfLoader(camera, controls, myFileLocation);
  scene.add(pipingSystem);

  // helper
  helper = new ViewHelper(camera, renderer, "bottom-left");
  helper.setControls(controls);

  //Add Raycaster
  raycaster = new Raycaster();

  document.addEventListener("mousedown", onMouseDownEvent);
  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  // Tutup context menu saat klik di area lain
  document.addEventListener("click", () => {
    hideContextMenu();
  });

  // Cegah klik pada dialog dari menutup context menu atau mereset objek
  document.addEventListener("mousedown", (e) => {
    // Jika klik pada dialog atau elemen di dalamnya, jangan proses
    if (e.target.closest("#trimOverlay")) {
      return;
    }
  });
}

function animate() {
  requestAnimationFrame(animate);

  renderer.clear();

  renderer.render(scene, camera);

  helper.render();

  //render();
}

function onMouseDownEvent(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Cek apakah ada objek yang diklik
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(pipingSystem.children, false);

  // Hanya proses jika ada objek yang diklik
  if (intersects.length > 0) {
    if (event.button === 0) {
      // Klik kiri - tampilkan info dan highlight objek
      console.log("Klik kiri pada objek terdeteksi");
      render();
    } else if (event.button === 2) {
      // Klik kanan - tampilkan context menu
      console.log("Klik kanan pada objek terdeteksi");
      selectedObject = intersects[0].object;
      showContextMenu(event.clientX, event.clientY);
      render();
    }
  } else {
    // Klik pada area kosong - reset highlight
    if (INTERSECTED) {
      INTERSECTED.material.color = currentColor;
      INTERSECTED = null;
      myDiv.innerHTML = "";
      renderer.render(scene, camera);
    }
  }
}

function render() {
  //Entered render loop
  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(pipingSystem.children, false);

  if (intersects.length > 0) {
    if (INTERSECTED != intersects[0].object) {
      if (INTERSECTED) INTERSECTED.material.color = currentColor;

      INTERSECTED = intersects[0].object;
      currentColor = intersects[0].object.material.color;
      INTERSECTED.material.color = new Color("hsl(0, 100%, 50%)");

      //Clear myDiv so that it can show data for clicked item
      myDiv.innerHTML = "";

      //Check if clicked item has userData with it
      if (Object.keys(intersects[0].object.userData).length > 0) {
        let itemData = intersects[0].object.userData.split(",");

        myDiv.innerHTML += itemData[0];
        myDiv.innerHTML += "<br />Size: " + itemData[1];

        if (
          itemData[0].includes("REDUCER") /*|| itemData[0].includes("BEND")*/
        ) {
          myDiv.innerHTML += " x " + itemData[9];
        }

        if (itemData[0].includes("ELBOW") || itemData[0].includes("BEND")) {
          //Just skip, nothing to add
        } else {
          myDiv.innerHTML += "<br />Length: " + itemData[2];
        }

        myDiv.innerHTML +=
          "<br />Start: " +
          itemData[3] +
          ", " +
          itemData[4] +
          ", " +
          itemData[5];
        myDiv.innerHTML +=
          "<br />End: " + itemData[6] + ", " + itemData[7] + ", " + itemData[8];

        if (itemData[0].includes("Tee Header")) {
          myDiv.innerHTML +=
            "<br />Centre: " +
            itemData[9] +
            ", " +
            itemData[10] +
            ", " +
            itemData[11];
        }
      } else {
        myDiv.innerHTML += "Info not available";
      }
    }
  } else {
    if (INTERSECTED) INTERSECTED.material.color = currentColor;

    INTERSECTED = null;
    myDiv.innerHTML = "";
  }

  renderer.render(scene, camera);
}

// Fungsi untuk menampilkan context menu
function showContextMenu(x, y) {
  // Hapus context menu yang lama jika ada
  hideContextMenu();

  // Buat element context menu
  contextMenu = document.createElement("div");
  contextMenu.id = "contextMenu";
  contextMenu.style.position = "absolute";
  contextMenu.style.left = x + "px";
  contextMenu.style.top = y + "px";
  contextMenu.style.backgroundColor = "white";
  contextMenu.style.border = "1px solid #ccc";
  contextMenu.style.boxShadow = "2px 2px 10px rgba(0,0,0,0.3)";
  contextMenu.style.zIndex = "1000";
  contextMenu.style.padding = "5px 0";
  contextMenu.style.borderRadius = "4px";
  contextMenu.style.minWidth = "120px";

  // Buat menu items
  const menuItems = [
    { text: "Trim", action: onTrimClick },
    { text: "Resize", action: onResizeClick },
    { text: "Reset", action: onResetClick },
  ];

  menuItems.forEach((item) => {
    const menuItem = document.createElement("div");
    menuItem.textContent = item.text;
    menuItem.style.padding = "8px 16px";
    menuItem.style.cursor = "pointer";
    menuItem.style.transition = "background-color 0.2s";

    // Hover effect
    menuItem.addEventListener("mouseenter", () => {
      menuItem.style.backgroundColor = "#e0e0e0";
    });
    menuItem.addEventListener("mouseleave", () => {
      menuItem.style.backgroundColor = "white";
    });

    // Click handler
    menuItem.addEventListener("click", (e) => {
      e.stopPropagation();
      item.action();
      hideContextMenu();
    });

    contextMenu.appendChild(menuItem);
  });

  document.body.appendChild(contextMenu);
}

// Fungsi untuk menyembunyikan context menu
function hideContextMenu() {
  if (contextMenu) {
    contextMenu.remove();
    contextMenu = null;
  }
}

// Fungsi untuk menampilkan dialog trim
function onTrimClick() {
  if (!selectedObject) {
    alert("Tidak ada objek yang dipilih");
    return;
  }

  // Hapus dialog trim yang sudah ada jika ada
  const existingOverlay = document.getElementById("trimOverlay");
  if (existingOverlay) {
    existingOverlay.remove();
  }

  // Buat overlay
  const overlay = document.createElement("div");
  overlay.id = "trimOverlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "10000";

  // Buat dialog
  const dialog = document.createElement("div");
  dialog.style.backgroundColor = "white";
  dialog.style.padding = "20px";
  dialog.style.borderRadius = "8px";
  dialog.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  dialog.style.minWidth = "300px";
  dialog.style.maxWidth = "500px";
  dialog.style.fontFamily = "Arial, sans-serif";

  // Cegah event propagation dari dialog agar tidak trigger event lain
  dialog.addEventListener("click", (e) => {
    e.stopPropagation();
  });
  dialog.addEventListener("mousedown", (e) => {
    e.stopPropagation();
  });

  // Title
  const title = document.createElement("h3");
  title.textContent = "Trim Object";
  title.style.marginTop = "0";
  title.style.marginBottom = "15px";
  title.style.color = "#333";

  // Label
  const label = document.createElement("label");
  // label.textContent = "Enter trim value:";
  label.style.display = "block";
  label.style.marginBottom = "8px";
  label.style.color = "#555";

  // Input number
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Enter total trim";
  input.style.width = "100%";
  input.style.padding = "8px";
  input.style.border = "1px solid #ccc";
  input.style.borderRadius = "4px";
  input.style.fontSize = "14px";
  input.style.boxSizing = "border-box";
  input.style.marginBottom = "20px";

  // Validasi input - hanya angka dan titik desimal
  input.addEventListener("input", (e) => {
    // Hapus karakter yang bukan angka atau titik
    let value = e.target.value.replace(/[^0-9.]/g, "");

    // Pastikan hanya ada satu titik desimal
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }

    // Update nilai input
    e.target.value = value;
  });

  // Cegah input karakter yang tidak diinginkan
  input.addEventListener("keydown", (e) => {
    // Allow: backspace, delete, tab, escape, enter, decimal point
    if (
      [8, 9, 27, 13, 46, 110, 190].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      return;
    }
    // Cegah jika bukan angka (0-9)
    if (
      (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  });

  // Cegah paste karakter yang tidak valid
  input.addEventListener("paste", (e) => {
    e.preventDefault();
    const pastedText = (e.clipboardData || window.clipboardData).getData(
      "text"
    );
    const cleanedText = pastedText.replace(/[^0-9.]/g, "");

    // Pastikan hanya satu titik desimal
    const parts = cleanedText.split(".");
    let finalText = parts[0];
    if (parts.length > 1) {
      finalText += "." + parts.slice(1).join("");
    }

    input.value = finalText;
  });

  // Container untuk tombol
  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "flex-end";
  buttonContainer.style.gap = "10px";

  // Tombol Cancel
  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.style.padding = "8px 20px";
  cancelBtn.style.border = "1px solid #ccc";
  cancelBtn.style.borderRadius = "4px";
  cancelBtn.style.backgroundColor = "#f5f5f5";
  cancelBtn.style.cursor = "pointer";
  cancelBtn.style.fontSize = "14px";
  cancelBtn.style.transition = "background-color 0.2s";

  cancelBtn.addEventListener("mouseenter", () => {
    cancelBtn.style.backgroundColor = "#e0e0e0";
  });
  cancelBtn.addEventListener("mouseleave", () => {
    cancelBtn.style.backgroundColor = "#f5f5f5";
  });
  cancelBtn.addEventListener("click", () => {
    overlay.remove();
  });

  // Tombol OK
  const okBtn = document.createElement("button");
  okBtn.textContent = "OK";
  okBtn.style.padding = "8px 20px";
  okBtn.style.border = "none";
  okBtn.style.borderRadius = "4px";
  okBtn.style.backgroundColor = "#007bff";
  okBtn.style.color = "white";
  okBtn.style.cursor = "pointer";
  okBtn.style.fontSize = "14px";
  okBtn.style.transition = "background-color 0.2s";

  okBtn.addEventListener("mouseenter", () => {
    okBtn.style.backgroundColor = "#0056b3";
  });
  okBtn.addEventListener("mouseleave", () => {
    okBtn.style.backgroundColor = "#007bff";
  });
  okBtn.addEventListener("click", () => {
    const value = input.value.trim();
    // Validasi: cek apakah input kosong atau bukan angka yang valid
    if (true) {
      const trimLength = parseFloat(value);
      console.log("Trim value:", trimLength);
      console.log("Trimming object:", selectedObject);
      // Hanya support trim untuk pipe (CylinderGeometry)
      if (
        selectedObject &&
        selectedObject.geometry &&
        selectedObject.geometry.type === "CylinderGeometry"
      ) {
        // Ambil parameter geometry
        const geom = selectedObject.geometry;
        const mat = selectedObject.material;
        // CylinderGeometry(radiusTop, radiusBottom, height, ...)
        const radiusTop = geom.parameters.radiusTop;
        const radiusBottom = geom.parameters.radiusBottom;
        const height = geom.parameters.height;
        const radialSegments = geom.parameters.radialSegments;
        // Bagi menjadi dua bagian sama panjang, posisi total tetap
        const part1Len = height / 2;
        const part2Len = height - part1Len;

        // Siapkan arah dan titik awal
        const startPoint = selectedObject.position.clone();
        const direction = new Vector3(0, 1, 0)
          .applyQuaternion(selectedObject.quaternion)
          .normalize();

        // Buat mesh untuk bagian pertama jika panjang > 0
        // Posisi tetap di startPoint (posisi awal objek)

        let mesh1 = null;
        if (part1Len > 0) {
          const geometry1 = new CylinderGeometry(
            radiusTop,
            radiusBottom,
            part1Len,
            radialSegments || 10,
            geom.parameters.heightSegments || 1,
            geom.parameters.openEnded || false
          );
          geometry1.translate(0, part1Len / 2, 0);
          geometry1.rotateX(Math.PI / 2);
          mesh1 = new Mesh(geometry1, mat.clone());
          mesh1.name = selectedObject.name || "Pipe";
          // Update userData: clone, lalu update panjang (itemData[2])
          if (selectedObject.userData) {
            let userDataArr = selectedObject.userData.split(",");
            let originalLength = parseFloat(userDataArr[2]);
            let halfLength = (originalLength / 2).toFixed(2);
            userDataArr[2] = halfLength;
            mesh1.userData = userDataArr.join(",");
            console.log("Updated userData:", mesh1.userData);
          }
          mesh1.position.copy(startPoint);
          mesh1.rotation.copy(selectedObject.rotation);
          mesh1.quaternion.copy(selectedObject.quaternion);
          mesh1.scale.copy(selectedObject.scale);
        }

        let mesh2 = null;
        if (part2Len > 0) {
          const geometry2 = new CylinderGeometry(
            radiusTop,
            radiusBottom,
            part2Len,
            radialSegments || 10,
            geom.parameters.heightSegments || 1,
            geom.parameters.openEnded || false
          );
          geometry2.translate(0, part2Len / 2 + part1Len, 0);
          geometry2.rotateX(Math.PI / 2);
          mesh2 = new Mesh(geometry2, mat.clone());
          mesh2.name = selectedObject.name || "Pipe";
          // Update userData: clone, lalu update panjang (itemData[2])
          if (selectedObject.userData) {
            let userDataArr = selectedObject.userData.split(",");
            let originalLength = parseFloat(userDataArr[2]);
            let halfLength = (originalLength / 2).toFixed(2);
            userDataArr[2] = halfLength;
            mesh2.userData = userDataArr.join(",");
            console.log("Updated userData:", mesh2.userData);
          }
          mesh2.position.copy(startPoint);
          mesh2.rotation.copy(selectedObject.rotation);
          mesh2.quaternion.copy(selectedObject.quaternion);
          mesh2.scale.copy(selectedObject.scale);
        }

        // Tambahkan mesh yang ada ke parent/pipingSystem
        const parent = selectedObject.parent;
        if (mesh1) {
          parent ? parent.add(mesh1) : pipingSystem.add(mesh1);
        }
        if (mesh2) {
          parent ? parent.add(mesh2) : pipingSystem.add(mesh2);
        }

        // Hapus objek lama
        if (parent) {
          parent.remove(selectedObject);
        } else {
          pipingSystem.remove(selectedObject);
        }
        if (selectedObject.parent === scene) {
          scene.remove(selectedObject);
        }

        // Bersihkan resource lama
        selectedObject.geometry.dispose();
        if (selectedObject.material && selectedObject.material.dispose) {
          selectedObject.material.dispose();
        }

        // Reset selection dan render
        if (INTERSECTED === selectedObject) {
          INTERSECTED = null;
          myDiv.innerHTML = "";
        }
        selectedObject = null;
        renderer.render(scene, camera);
        overlay.remove();
      } else {
        alert("Trim hanya didukung untuk objek pipa (CylinderGeometry)");
        overlay.remove();
      }
    } else if (!value) {
      alert("Please enter a value");
      input.focus();
    } else if (parseFloat(value) <= 0) {
      alert("Please enter a positive number");
      input.focus();
    } else {
      alert("Please enter a valid number");
      input.focus();
    }
  });

  // Tambahkan event listener untuk tombol Enter
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      okBtn.click();
    }
  });

  // Susun elemen
  buttonContainer.appendChild(cancelBtn);
  buttonContainer.appendChild(okBtn);

  dialog.appendChild(title);
  dialog.appendChild(label);
  dialog.appendChild(input);
  dialog.appendChild(buttonContainer);

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  // Auto focus ke input
  setTimeout(() => input.focus(), 100);

  // Tutup dialog saat klik overlay
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
}

function onResizeClick() {
  console.log("Resize clicked");
  if (selectedObject) {
    console.log("Resizing object:", selectedObject);
    // Tambahkan logika resize di sini
    alert("Resize action on object: " + (selectedObject.userData || "Unknown"));
  }
}

function onResetClick() {
  console.log("Reset clicked");
  if (selectedObject) {
    console.log("Resetting object:", selectedObject);
    // Reset warna objek ke warna original
    if (selectedObject === INTERSECTED) {
      selectedObject.material.color = currentColor;
      INTERSECTED = null;
      myDiv.innerHTML = "";
      renderer.render(scene, camera);
    }
    alert("Reset action on object: " + (selectedObject.userData || "Unknown"));
  }
}

window.init = init;
window.animate = animate;
