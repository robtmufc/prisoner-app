const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const Prisoner = require('./prisoner.js');

const {app, BrowserWindow, Menu, ipcMain, dialog} = electron;

// Set Environment
//process.env.NODE_ENV ='production';

let mainWindow;
let addWindow;

var prisonerList = [new Prisoner("Bill","28","Monsoon Lake","4","Robbery"),new Prisoner("Bob","28","Monsoon Lakes","4","Murder")];

// Listen for app to be ready
app.on('ready', function(){
    // create new window
    mainWindow = new BrowserWindow({});
    // load the html file into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    // Quit app when closed
    mainWindow.on('closed', function(){
        app.quit();
    });

    // build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert Menu
    Menu.setApplicationMenu(mainMenu);
    console.log(prisonerList);
    console.log(prisonerList.length);
});

// Handle create add window
function createAddPrisonerWindow(){
// create new window
addWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    title: 'Add a new prisoner'
});
// load the html file into window
addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addWindow.html'),
    protocol: 'file:',
    slashes: true
}));
// Garbage collection handle
    addWindow.on('close', function(){
      addWindow = null;
    });
}

ipcMain.on('main:load', function(e, i){
    mainWindow.webContents.send('prisoner:load',prisonerList[0]);
});
ipcMain.on('prisoner:getCount', function(e, i){
    console.log("In getCount: "+ i);
    mainWindow.webContents.send('prisoner:count', prisonerList.length);
});
ipcMain.on('prisoner:next', function(e, i){
    console.log("MainWindow: I is: "+ i);
    console.log(prisonerList[i]);
    mainWindow.webContents.send('item:next',prisonerList[i]);
});
ipcMain.on('prisoner:back', function(e, i){
    console.log("MainWindow: I is: "+ i);
    console.log(prisonerList[i]);
    mainWindow.webContents.send('item:back',prisonerList[i]);
});
// Catch item add
ipcMain.on('prisoner:add', function(e, item){
    prisonerList.push(item);
    console.log(prisonerList.length); // send to mainWindow.html to deal with
    console.log(prisonerList);
    addWindow.close();
});


// create menu template
const mainMenuTemplate = [
    {
        label:'File', 
        submenu:[
            {
                label:'Add Prisoner',
                click(){
                    createAddPrisonerWindow();
                }
            },
            {
                label:'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q':'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

// If mac, add empty object to menu
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}

// Add developer tools item if in dev
if(process.env.NODE_ENV != 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle Dev Tools',
                accelerator: process.platform == 'darwin' ? 'Command+I':'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools(); 
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}