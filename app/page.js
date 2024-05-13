const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("app", {
    exit: () => ipcRenderer.send("exit"),
    setFullscreen: (value) => ipcRenderer.send("fullscreen", value),
    updateStatusTint: () => {}
});
