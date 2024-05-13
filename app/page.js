const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electron", {
    exit: () => ipcRenderer.send("exit"),
    setFullscreen: (value) => ipcRenderer.send("fullscreen", value)
});
