const path = require("path");
const { app, BrowserWindow, shell, ipcMain } = require("electron/main");

(async () => {
    await app.whenReady();
    const win = new BrowserWindow({
        title: "Tiny Religion",
        resizable: true,
        width: 640,
        height: 480,
        backgroundColor: "#484848",
        webPreferences: {
            preload: path.join(app.getAppPath(), "app/page.js")
        }
    });
    win.removeMenu();

    win.webContents.executeJavaScript("({ ...localStorage })", true).then(localStorage =>
        win.fullScreen = localStorage.fullscreen ?? true);

    win.webContents.setWindowOpenHandler(function({ url }) {
        shell.openExternal(url);
        return { action: "deny" };
    });

    ipcMain.on("exit", () =>
        app.quit());

    ipcMain.on("fullscreen", (_, fs) =>
        win.fullScreen = fs);

    app.on('window-all-closed', () =>
        app.quit());

    win.loadFile("index.html");
})();
