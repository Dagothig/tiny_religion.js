'use strict';

const keybindings = {
    "enter": ["ok"],
    "escape": ["menu"],
    "a": ["group:train"],
    "s": ["group:build"],
    "d": ["group:do"],
    "f": ["group:move"],
    "u": ["action:1"],
    "i": ["action:2"],
    "o": ["action:3"],
    "j": ["action:4"],
    "k": ["action:5"],
    "l": ["action:6"],
    "arrowup": ["up"],
    "arrowdown": ["down"],
    "arrowleft": ["left"],
    "arrowright": ["right"],
}

const buttonbindings = {
    0: ["ok", "action:1"],
    1: ["action:2"],
    2: ["action:3"],
    3: ["action:4"],
    4: ["action:5"],
    5: ["action:6"],
    9: ["menu"],
    12: ["group:train", "up"],
    13: ["group:move", "down"],
    14: ["group:build", "left"],
    15: ["group:do", "right"],
}

const knownGamepads = [
    {
        class: "input--gamepad",
        regexp: /x?box|microsoft/i,
        buttonFaces: {
            0: { text: "a", color: "green" },
            1: { text: "b", color: "red" },
            2: { text: "x", color: "blue" },
            3: { text: "y", color: "yellow" },
            4: { text: "lb" },
            5: { text: "rb" },
            9: { text: "☰" },
            12: { text: "▲" },
            13: { text: "▼" },
            14: { text: "◀" },
            15: { text: "▶" }
        }
    }
]

const selectableSelector = "input, a, select";

function handlePress(actions) {
    for (const action of actions) {
        if (splash) {
            splash.click();
            return;
        }
        if (ui.menu.input.checked) {
            switch (action) {
                case "left":
                case "up":
                    ui.menuOffset(-1);
                    return;
                case "right":
                case "down":
                    ui.menuOffset(1);
                    return;
                case "ok":
                    ui.menuOK();
                    return;
                case ui.menu.action:
                    ui.menu.trigger();
                    return;
                default:
                    continue;
            }
        }
        for (const menu of ui.menus) {
            if (menu.action === action) {
                menu.trigger();
                return;
            }
        }
        if (game) {
            if (action === "ok" && !ui.tipTag.classList.contains("hidden")) {
                ui.tipOkTag.click();
                return;
            }
            for (const group of ui.groups) {
                if (group.action === action) {
                    group.trigger();
                    return;
                }
                if (group.radio.checked) {
                    for (const btn of group.btns) {
                        if (!btn.disabled && btn.action === action) {
                            btn.trigger();
                            return;
                        }
                    }
                }
            }
            continue;
        }
        switch (action) {
            case "ok":
                ui.onTitle();
                return;
        }
    }
}

addEventListener("mousedown", () => ui.updateToBindings(keybindings));

addEventListener("keydown", ev => {
    const action = keybindings[ev.key.toLowerCase()];
    action && handlePress(Array.isArray(action) ? action : [action]);

    ui.updateToBindings(keybindings);
});

function onButtonDown(button, knownInfo) {
    const action = buttonbindings[button];
    action && handlePress(Array.isArray(action) ? action : [action]);

    ui.updateToBindings(buttonbindings, knownInfo);
}

const gamepadEntries = {};

(function pollGamepads() {
    for (const gamepad of navigator.getGamepads()) {
        if (!gamepad) {
            continue;
        }
        const entry = gamepadEntries[gamepad.id] || (gamepadEntries[gamepad.id] = {
            knownInfo: (knownGamepads.find(g => gamepad.id.match(g.regexp)) || knownGamepads[0])
        });
        const lastState = entry.lastState || {};
        entry.lastState = {};
        for (const buttonId in gamepad.buttons) {
            const button = gamepad.buttons[buttonId];
            if (button.pressed && !lastState[buttonId]) {
                onButtonDown(buttonId, entry.knownInfo);
            }
            entry.lastState[buttonId] = button.pressed;
        }
    }

    requestAnimationFrame(pollGamepads);
})();
