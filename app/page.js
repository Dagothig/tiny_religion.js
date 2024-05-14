const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("app", {
    exit: () => ipcRenderer.send("exit"),
    setFullscreen: (value) => ipcRenderer.send("fullscreen", value),
    updateStatusTint: () => {}
});

ipcRenderer.on("readSave", (_, save) => {
    console.log(save);
    for (const key in save) {
        localStorage.setItem(key, save[key]);
    }
});

contextBridge.exposeInMainWorld("saveStorage", {
    setItem(key, value) {
        localStorage.setItem(key, value);
        ipcRenderer.send("setSave", key, value);
    },
    removeItem(key) {
        localStorage.removeItem(key);
        ipcRenderer.send("removeSave", key);
    },
    getItem(key) {
        return localStorage.getItem(key);
    }
});
