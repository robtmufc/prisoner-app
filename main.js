const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const Prisoner = require('./prisoner.js');

const {
    app,
    BrowserWindow,
    Menu,
    ipcMain,
    dialog
} = electron;

// Set Environment
//process.env.NODE_ENV ='production';

let mainWindow;
let addWindow;

var prisonerList = [new Prisoner("Bill", "28", "Monsoon Lake", "4", "Robbery"), new Prisoner("Bob", "29", "Monsoon Lakes", "6", "Murder")];

// Listen for app to be ready
app.on('ready', function() {
    // create new window
    mainWindow = new BrowserWindow({});
    // load the html file into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    // Quit app when closed
    mainWindow.on('closed', function() {
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
function createAddPrisonerWindow() {
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
    addWindow.on('close', function() {
        addWindow = null;
    });
}

ipcMain.on('main:load', function(e, i) {
    mainWindow.webContents.send('prisoner:load', prisonerList[0]);
});
ipcMain.on('prisoner:getCount', function(e, i) {
    console.log("In getCount: " + i);
    mainWindow.webContents.send('prisoner:count', prisonerList.length);
});
ipcMain.on('prisoner:next', function(e, i) {
    console.log("MainWindow: I is: " + i);
    console.log(prisonerList[i]);
    mainWindow.webContents.send('item:next', prisonerList[i]);
});
ipcMain.on('prisoner:back', function(e, i) {
    console.log("MainWindow: I is: " + i);
    console.log(prisonerList[i]);
    mainWindow.webContents.send('item:back', prisonerList[i]);
});
// Catch item add
ipcMain.on('prisoner:add', function(e, item) {
    prisonerList.push(item);
    console.log(prisonerList.length); // send to mainWindow.html to deal with
    console.log(prisonerList);
    addWindow.close();
});

function loadFromFile() {
    console.log("In load file");
    prisonerList = [];
    dialog.showOpenDialog({
        filters: [{
            name: 'Text',
            extensions: ['txt']
        }]
    }, (filename) => {
        console.log(filename);
        if (filename == undefined) return;

        var readline = require('readline'),
            instream = fs.createReadStream(filename[0]),
            outstream = new(require('stream'))(),
            rl = readline.createInterface(instream, outstream);

        rl.on('line', function(line) {
            var p = line.split(",");
            console.log(p);
            prisonerList.push(new Prisoner(p[0], p[1], p[2], p[3], p[4]));
            console.log(line);
        });

        rl.on('close', function(line) {
            console.log(line);
            console.log('done reading file.');
        });

        mainWindow.webContents.send('item:load', "yes");
    });

}


function saveToFile() {

    var saveFile = "";
    for (var i = 0; i < prisonerList.length; i++) {
        saveFile += prisonerList[i].name + ",";
        saveFile += prisonerList[i].age + ",";
        saveFile += prisonerList[i].address + ",";
        saveFile += prisonerList[i].category + ",";
        saveFile += prisonerList[i].charge;
        if ((i + 1) != prisonerList.length) {
            saveFile += "\n";
        }
    }

    console.log(saveFile);

    dialog.showSaveDialog({
        filters: [{
            name: 'Text',
            extensions: ['txt']
        }]
    }, (filename) => {
        console.log("Filename:" + filename);
        if (filename === undefined) {
            console.log("You didn't save the file");
            return;
        }
        fs.writeFile(filename, saveFile, 'UTF-8', (err) => {
            // throws an error, you could also catch it here
            if (err) throw err;

            // success case, the file was saved
            console.log('File saved!');
            dialog.showMessageBox({
                type: "info",
                title: "File Saved!",
                message: "Successfully saved to file!"
            });
        });
    });

}

// create menu template
const mainMenuTemplate = [{
    label: 'File',
    submenu: [{
            label: 'Add Prisoner',
            click() {
                createAddPrisonerWindow();
            }
        },
        {
            label: 'Save File',
            accelerator: process.platform == 'darwin' ? 'Command+S' : 'Ctrl+S',
            click() {
                saveToFile();
            }
        },
        {
            label: 'Load File',
            click() {
                loadFromFile();
            }
        },
        {
            label: 'Quit',
            accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
            click() {
                app.quit();
            }
        }
    ]
}];

// If mac, add empty object to menu
if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

// Add developer tools item if in dev
if (process.env.NODE_ENV != 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [{
                label: 'Toggle Dev Tools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}