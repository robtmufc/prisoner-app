const Prisoner = require('./prisoner.js');
const electron = require('electron');
const {
    ipcRenderer
} = electron;

const form = document.querySelector('form');
form.addEventListener('submit', submitForm);

function submitForm(e) {
    e.preventDefault();
    const name = document.querySelector('#name').value;
    const age = document.querySelector('#age').value;
    const addr = document.querySelector('#address').value;
    const cat = document.querySelector('#category').value;
    const charge = document.querySelector('#charge').value;
    var pris1 = new Prisoner(name, age, addr, cat, charge);
    ipcRenderer.send('prisoner:add', pris1); // send to main.js
}