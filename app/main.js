const path = require("path");
const { app, BrowserWindow, shell, ipcMain } = require("electron/main");

(async () => {
    await app.whenReady();
    const win = new BrowserWindow({
        title: "Tiny Religion",
        fullScreenable: true,
        resizable: true,
        width: 640,
        height: 480,
        webPreferences: {
            preload: path.join(app.getAppPath(), "app/page.js")
        }
    });
    //win.removeMenu();

    win.webContents.setWindowOpenHandler(function({ url }) {
        shell.openExternal(url);
        return { action: "deny" };
    });

    ipcMain.on("exit", () =>
        app.quit());

    app.on('window-all-closed', () =>
        app.quit());

    win.loadFile("index.html");
})();
