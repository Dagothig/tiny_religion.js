const { contextBridge, ipcRenderer } = require("electron/renderer");

let language;
try {
    const steamworks = require('steamworks.js');
    const client = steamworks.init(480);
    const steamLangs = { english: "en", french: "fr" };
    language = steamLangs[client.apps.currentGameLanguage()] || "en";
} catch (err) {
    console.error(err);
}

contextBridge.exposeInMainWorld("app", {
    exit: () => ipcRenderer.send("exit"),
    setFullscreen: (value) => ipcRenderer.send("fullscreen", value),
    updateStatusTint: () => {},
    language
});

ipcRenderer.on("readSave", (_, save) => {
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
