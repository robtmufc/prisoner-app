const electron = require('electron');
const {
    ipcRenderer
} = electron;

const name = document.querySelector('#name');
const age = document.querySelector('#age');
const address = document.querySelector('#address');
const category = document.querySelector('#category');
const charge = document.querySelector('#charge');

const backButton = document.querySelector('#back-button');
backButton.addEventListener('click', backButtonPress);
const forwardButton = document.querySelector('#forward-button');
forwardButton.addEventListener('click', forwardButtonPress);


let i = 0;

window.onload = function(e) {
    ipcRenderer.send('main:load', 0);
    ipcRenderer.on('prisoner:load', function(e, p) {
        name.value = p.name;
        age.value = p.age;
        address.value = p.address;
        category.value = p.category;
        charge.value = p.charge;
    });
}


function backButtonPress(e) {
    var less = i -1;
    if(less < 0){
        alert("You're back at the start");
    }else{
        i-=1;
        console.log("Back I is: "+i);
        ipcRenderer.send('prisoner:back', i);
        ipcRenderer.once('item:back', function(e, p) {
            
                name.value = p.name;
                age.value = p.age;
                address.value = p.address;
                category.value = p.category;
                charge.value = p.charge;
                
                console.log("In back I is: " + i);
            
    
        });
    }
}

function forwardButtonPress(e) {
    e.preventDefault();
    ipcRenderer.send('prisoner:getCount', i);

    ipcRenderer.once('prisoner:count', function(e, count){
        console.log("Count:"+count);
        let max = i +1;
        console.log("Max:"+ max);
        if(max != count){
            i +=1;
        } else{
            alert("There are no more prisoners");
            return;
        }
        console.log("in prisoner count"+i);
        console.log(count);
    

    console.log("inbetween pris count and next : Sending I: " + i);
    // send the next index to the prisoner next
    ipcRenderer.send('prisoner:next', i);

    ipcRenderer.once('item:next', function(e, p) {
        console.log("item next I: " + i);
        console.log("received data: " + p);
        if (p == undefined || p == null) {
            alert("There are no more prisoners!");
            console.log("MainHTML I:" + i);
        } else {
            console.log("else block I: " + i);
            name.value = p.name;
            age.value = p.age;
            address.value = p.address;
            category.value = p.category;
            charge.value = p.charge;
            console.log("after display I: " + i);
        }
        console.log("after if/else I: " + i);
    });
});
    console.log("after count I: " + i);
}


// catch add item
ipcRenderer.on('item:add', function(e, item) {
    ul.className = 'collection';
    const li = document.createElement('li');
    li.className = 'collection-item';
    const itemText = document.createTextNode(item);
    li.appendChild(itemText);
    ul.appendChild(li);
});