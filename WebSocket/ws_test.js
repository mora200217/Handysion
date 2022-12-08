const { type } = require('os');
const WebSocket = require('ws')
const miWebSocket = new WebSocket('ws://192.168.0.15');

let json = require('C:/Users/Valentina/Documents/1_Universidad/11S/2. Sensores/Proyecto/WebSocke/test.json');
let data = JSON.stringify(json);
function open () {
    // Abre conexión
    console.log("WebSocket abierto.");
    miWebSocket.send(data);
    miWebSocket.close();
}


function close () {
    // Cierra la conexión
    console.log("WebSocket cerrado.");
}


miWebSocket.addEventListener('open', open);
miWebSocket.addEventListener('close', close);