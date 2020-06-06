const apiKey = "5ObuxzjL3y740CwKHDSWloeaqw5WP0LZ";
const logo = document.querySelector("#logo");
const body = document.querySelector("body");
let video = document.querySelector("video");
let containerVideo = document.querySelector("#containerVideo");
let containerImg = document.querySelector("#containerImg");
let img = document.querySelector("#containerImg img")
const inicio = document.querySelector("#inicio");
const recording = document.querySelector("#recording");
const comenzarButton = document.querySelector("#comenzarButton");
const startRecording = document.querySelector("#startRecording");
const stopButton = document.querySelector("#stop");
const repetirCapturaButton = document.querySelector("#repetirCaptura");
const subirGuifoButton = document.querySelector("#subirGuifo");
const recordAndAccept = document.querySelector("#recordAndAccept");
const uploading = document.querySelector("#uploading");
const cancelar = document.querySelector("#cancelar");
const success = document.querySelector("#success");
const listoButton = document.querySelector("#listo");
const containerGifSubido = document.querySelector("#containerGif");
const gifSubidoImg = document.querySelector("#containerGif img")
const camara = document.querySelector("#startRecording img");
const myGifosContainer = document.querySelector("#myGifosContainer");
let myUploadedGifs = [];
let recorder;

//Funcionalidad theme
function theme () {
  let theme = localStorage.getItem("theme");
  if (theme == "night") {
    body.id = "night";
    camara.setAttribute("src", "/assets/camera_light.svg");
    logo.setAttribute("src", "assets/gifOF_logo_dark.png");
  } else {
    body.id = "day";
    camara.setAttribute("src", "/assets/camera.svg");
    logo.setAttribute("src", "assets/gifOF_logo.png");
  }
}

//Onload
window.onload = () => {
  controlLocalStorageUpload();
  theme();
  traerMisgifos();
}


//Funciones
async function buscar(id) {
  let url = `https://api.giphy.com/v1/gifs/${id}?api_key=${apiKey}`;
  const resp = await fetch(url);
  const datos = await resp.json();
  return datos.data; 
}

async function postToGiphy(gifFormData) {
  const resp = await fetch(`https://upload.giphy.com/v1/gifs?api_key=${apiKey}`, {
    method: 'POST',
    body: gifFormData
  });
  const datos = await resp.json();
  console.log(datos);
  return datos.data;
}

function saveGif (gifID) {
  let gifSubido = document.createElement("img");
  buscar(gifID).then((gif) => {
    console.log(gif)
    gifSubido.setAttribute("src", gif.images.original.url);
  })
  containerGifSubido.innerHTML = "";
  containerGifSubido.appendChild(gifSubido);
  myUploadedGifs = JSON.parse(localStorage.getItem("misGifos"));
  myUploadedGifs.unshift(gifID);
  localStorage.setItem("misGifos", JSON.stringify(myUploadedGifs));
  myGifosContainer.innerHTML = "";
  myUploadedGifs.forEach((gif) => {
    crearMisGifos(gif);
  })
}

async function crearMisGifos (id) {
  buscar(id).then((gif) => {
    let src = gif.images.original.url;
    let containerGif = document.createElement("div");
    const gifHTML = `<img alt="Gif Traido" src=${src}>`
    containerGif.innerHTML = gifHTML;
    myGifosContainer.append(containerGif);
  })
}

const accessCamera = callback => {
	navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
	}).then(stream => callback(stream));
}

function traerMisgifos () {
  myGifosContainer.innerHTML = "";
  myUploadedGifs = JSON.parse(localStorage.getItem("misGifos"));
  console.log(myUploadedGifs);
  myUploadedGifs.forEach((gif) => {
    crearMisGifos(gif)
  })
}

function controlLocalStorageUpload () {
  if (JSON.parse(localStorage.getItem("misGifos")) == null) {
    localStorage.setItem("misGifos", JSON.stringify([]));
  }
}

//Event Listeners
comenzarButton.addEventListener('click', () => {
  accessCamera(async (stream) => {
    video.srcObject = stream
    recorder = RecordRTC(stream, {
      type: 'gif',
      timeSlice: 1000 
    })
  })
  startRecording.addEventListener('click', (stream) => {
    recorder.stream = stream;
    recorder.startRecording();
})
})

stopButton.addEventListener('click', () => {
	recorder.stopRecording( () => {
  	let blob = recorder.getBlob();
    img.src = img.srcObject = null;
    img.src = URL.createObjectURL(blob);
  });
  stopButton.style.display = "none";
  repetirCapturaButton.style.display = "block";
  subirGuifoButton.style.display = "block";
  containerVideo.style.display = "none";
  containerImg.style.display = "flex";
})

subirGuifoButton.addEventListener('click', () => {
  let form = new FormData();
  form.append('file', recorder.getBlob(), 'myGif.gif');
  console.log(form.get('file'));
  postToGiphy(form)
  .then(datos => saveGif(datos.id));
  recorder.destroy();
  recorder = null;
})


//Flow
comenzarButton.addEventListener("click", () => {
  inicio.style.display = "none";
  recording.style.display = "block";
})

startRecording.addEventListener("click", () => {
  startRecording.style.display = "none";
  stopButton.style.display = "flex";
})

repetirCapturaButton.addEventListener("click", () => {
  recording.style.display = "none";
  inicio.style.display = "block";
  subirGuifoButton.style.display = "none";
  repetirCapturaButton.style.display = "none";
  startRecording.style.display = "flex";
  containerVideo.style.display = "block";
  containerImg.style.display = "none";
  recorder.destroy();
  recorder = null;
})

subirGuifoButton.addEventListener("click", () => {
  recordAndAccept.style.display = "none";
  uploading.style.display = "block";
  setTimeout(() => {
    recording.style.display = "none";
    success.style.display = "block"
  }, 3000)
})

listoButton.addEventListener("click", () => {
  success.style.display = "none";
  inicio.style.display = "block";
  subirGuifoButton.style.display = "none";
  repetirCapturaButton.style.display = "none";
  startRecording.style.display = "flex";
  recordAndAccept.style.display = "block";
  uploading.style.display = "none";
  containerVideo.style.display = "block";
  containerImg.style.display = "none";
})
