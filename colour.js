"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.colour = void 0;
var colour = function (name, text) {
    var colourData = {
        "Reset": "\x1b[0m",
        "Bright": "\x1b[1m",
        "Dim": "\x1b[2m",
        "Underscore": "\x1b[4m",
        "Blink": "\x1b[5m",
        "Reverse": "\x1b[7m",
        "Hidden": "\x1b[8m",
        "FgBlack": "\x1b[30m",
        "FgRed": "\x1b[31m",
        "FgGreen": "\x1b[32m",
        "FgYellow": "\x1b[33m",
        "FgBlue": "\x1b[34m",
        "FgMagenta": "\x1b[35m",
        "FgCyan": "\x1b[36m",
        "FgWhite": "\x1b[37m",
        "FgGray": "\x1b[90m",
        "BgBlack": "\x1b[40m",
        "BgRed": "\x1b[41m",
        "BgGreen": "\x1b[42m",
        "BgYellow": "\x1b[43m",
        "BgBlue": "\x1b[44m",
        "BgMagenta": "\x1b[45m",
        "BgCyan": "\x1b[46m",
        "BgWhite": "\x1b[47m",
        "BgGray": "\x1b[100m"
    };
    var prefix = "";
    name.forEach(function (property) {
        prefix += colourData[property];
    });
    return "".concat(prefix).concat(text, "\u001B[0m");
};
exports.colour = colour;
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.prototype.info = function (message) {
        console.log((0, exports.colour)(['FgGreen'], message));
    };
    return Logger;
}());
exports.Logger = Logger;
