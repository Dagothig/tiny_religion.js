const path = require("path");
const { app, BrowserWindow, shell, ipcMain } = require("electron/main");

// https://www.electronforge.io/config/makers/squirrel.windows
if (require('electron-squirrel-startup')) {
    app.quit();
    return;
}

const steamworks = require('steamworks.js');
steamworks.electronEnableSteamOverlay();
const client = steamworks.init(480);

let save;
try {
    save = JSON.parse(client.cloud.readFile("gamesave") || "{}") || {};
} catch (err) {
    console.log("Could not read cloud save");
    console.log(err);
    save = {};
}

const setSave = ((key, value) => {
    save[key] = value;
    if (!client.cloud.writeFile("gamesave", JSON.stringify(save)))
        console.log("Could not write cloud save");
});

const removeSave = (key => {
    delete save[key];
    if (!client.cloud.writeFile("gamesave", JSON.stringify(save)))
        console.log("Could not write cloud save");
});

(async () => {
    await app.whenReady();
    const win = new BrowserWindow({
        title: "Tiny Religion",
        resizable: true,
        width: 640,
        height: 480,
        icon: path.join(app.getAppPath(), "favicon.png"),
        backgroundColor: "black",
        show: false,
        webPreferences: {
            preload: path.join(app.getAppPath(), "app/page.js")
        }
    });
    //win.removeMenu();

    win.webContents.executeJavaScript("localStorage.fullscreen", true).then(fs => {
        win.fullScreen = fs !== "false";
        win.show()
    });

    win.webContents.setWindowOpenHandler(function({ url }) {
        shell.openExternal(url);
        return { action: "deny" };
    });

    ipcMain.on("exit", () =>
        app.quit());

    ipcMain.on("fullscreen", (_, fs) =>
        win.fullScreen = fs);

    win.webContents.send("readSave", save);
    ipcMain.on("setSave", (_, key, value) => setSave(key, value));
    ipcMain.on("removeSave", (_, key) => removeSave(key));

    app.on('window-all-closed', () =>
        app.quit());

    win.loadFile("index.html");
})();
