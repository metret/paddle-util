"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paddle = exports.allowedCustomProperties = exports.StrictPaddleProduct = exports.PaddleProduct = exports.PaddleOverridePrice = exports.PaddleUnitPrice = exports.PaddleBillingCycle = exports.PaddlePrice = exports.euroZone = exports.paddleCountries = void 0;
exports.getCurrencyCountries = getCurrencyCountries;
exports.getAllProducts = getAllProducts;
exports.getProduct = getProduct;
exports.updateProduct = updateProduct;
exports.createPrice = createPrice;
exports.archivePrice = archivePrice;
exports.archiveProduct = archiveProduct;
exports.createProduct = createProduct;
exports.updatePrice = updatePrice;
var paddle_node_sdk_1 = require("@paddle/paddle-node-sdk");
var colour_1 = require("./colour");
var fs = require("fs");
try {
    exports.paddleCountries = JSON.parse(fs.readFileSync("paddleCountries.json").toString()).data;
}
catch (error) {
    console.log((0, colour_1.colour)(["BgRed", "FgWhite"], "Could not open the file containing the list of country codes"));
}
exports.euroZone = [
    "Austria",
    "Belgium",
    "Croatia",
    "Cyprus",
    "Estonia",
    "Finland",
    "France",
    "Germany",
    "Greece",
    "Ireland",
    "Italy",
    "Latvia",
    "Lithuania",
    "Luxembourg",
    "Malta",
    "Netherlands",
    "Portugal",
    "Slovakia",
    "Slovenia",
    "Spain"
];
function getCurrencyCountries(currency) {
    var countries = [];
    switch (currency) {
        case "EUR":
            exports.euroZone.forEach(function (euroZoneCountry) {
                countries.push(euroZoneCountry);
            });
            break;
        case "CAD":
            countries.push("Canada");
            break;
        case "GBP":
            //I think there are more
            countries.push("United Kingdom");
            break;
        default:
            break;
    }
    countries = countries.map(function (countryName) {
        var foundPaddleCountry = exports.paddleCountries.find(function (pCountry) { return pCountry.name == countryName; });
        if (foundPaddleCountry) {
            return foundPaddleCountry.code;
        }
        else {
            console.log((0, colour_1.colour)(["BgYellow", "FgBlack"], "Could not find the country code for ".concat(countryName, ".  Please check the country has been spelt correctly.\nThe country will be skipped, and the custom rule will not apply to this country only.")));
        }
    });
    //console.log(colour(["BgBlue","FgGreen","Dim"],countries))
    return countries;
}
var PaddlePrice = /** @class */ (function () {
    function PaddlePrice(name, unitPrice, billingCycle) {
        this.description = "Default description";
        this.unitPriceOverrides = [];
        this.productId = "";
        this.customData = null;
        this.name = name;
        this.unitPrice = unitPrice;
        this.billingCycle = billingCycle;
    }
    return PaddlePrice;
}());
exports.PaddlePrice = PaddlePrice;
var PaddleBillingCycle = /** @class */ (function () {
    function PaddleBillingCycle(interval, frequency) {
        this.interval = interval;
        this.frequency = frequency;
    }
    return PaddleBillingCycle;
}());
exports.PaddleBillingCycle = PaddleBillingCycle;
var PaddleUnitPrice = /** @class */ (function () {
    function PaddleUnitPrice(amount, currencyCode) {
        this.amount = amount;
        this.currencyCode = currencyCode;
    }
    return PaddleUnitPrice;
}());
exports.PaddleUnitPrice = PaddleUnitPrice;
var PaddleOverridePrice = /** @class */ (function () {
    function PaddleOverridePrice(price, countries) {
        this.unitPrice = price;
        this.countryCodes = countries;
    }
    return PaddleOverridePrice;
}());
exports.PaddleOverridePrice = PaddleOverridePrice;
var PaddleProduct = /** @class */ (function () {
    function PaddleProduct(name, prices) {
        this.prices = [];
        this.name = name;
        if (prices) {
            this.prices = prices;
        }
    }
    return PaddleProduct;
}());
exports.PaddleProduct = PaddleProduct;
var StrictPaddleProduct = /** @class */ (function (_super) {
    __extends(StrictPaddleProduct, _super);
    function StrictPaddleProduct(name, prices) {
        var _this = _super.call(this, name, prices) || this;
        _this.taxCategory = "standard";
        return _this;
    }
    return StrictPaddleProduct;
}(PaddleProduct));
exports.StrictPaddleProduct = StrictPaddleProduct;
/*
export let apiKey:string
if (process.env.PADDLE_API_KEY){
    apiKey = process.env.PADDLE_API_KEY
} else {
    console.log(colour(["BgRed","FgWhite"],"No API key specified"))
    exit()
}

export const sandbox:boolean = true
*/
var targets = JSON.parse(fs.readFileSync("./targets.json").toString());
var apiKey = targets[process.argv[2]].apiKey;
var sandbox = targets[process.argv[2]].sandbox;
exports.allowedCustomProperties = [
    "productLine",
    "mapTo",
    "display"
];
exports.paddle = new paddle_node_sdk_1.Paddle(apiKey, sandbox ? { environment: paddle_node_sdk_1.Environment.sandbox, logLevel: paddle_node_sdk_1.LogLevel.error } : {});
function getAllProducts() {
    return __awaiter(this, void 0, void 0, function () {
        var productCollection, allItems, _a, productCollection_1, productCollection_1_1, product, e_1_1, e_2;
        var _b, e_1, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    productCollection = exports.paddle.products.list();
                    allItems = [];
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 14, , 15]);
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 7, 8, 13]);
                    _a = true, productCollection_1 = __asyncValues(productCollection);
                    _e.label = 3;
                case 3: return [4 /*yield*/, productCollection_1.next()];
                case 4:
                    if (!(productCollection_1_1 = _e.sent(), _b = productCollection_1_1.done, !_b)) return [3 /*break*/, 6];
                    _d = productCollection_1_1.value;
                    _a = false;
                    product = _d;
                    allItems.push(product);
                    _e.label = 5;
                case 5:
                    _a = true;
                    return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 13];
                case 7:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 13];
                case 8:
                    _e.trys.push([8, , 11, 12]);
                    if (!(!_a && !_b && (_c = productCollection_1.return))) return [3 /*break*/, 10];
                    return [4 /*yield*/, _c.call(productCollection_1)];
                case 9:
                    _e.sent();
                    _e.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 12: return [7 /*endfinally*/];
                case 13:
                    if (allItems.length === 0) {
                        console.log('No products were found.');
                    }
                    return [2 /*return*/, allItems];
                case 14:
                    e_2 = _e.sent();
                    console.error('Error within getAllProducts():', e_2);
                    throw e_2;
                case 15: return [2 /*return*/];
            }
        });
    });
}
function getProduct(productId, queryParams) {
    return __awaiter(this, void 0, void 0, function () {
        var product, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, exports.paddle.products.get(productId, queryParams)
                        // Returns a product entity
                    ];
                case 1:
                    product = _a.sent();
                    // Returns a product entity
                    return [2 /*return*/, product];
                case 2:
                    e_3 = _a.sent();
                    // Handle Network/API errors
                    console.log("network api error");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function updateProduct(productId, requestBody) {
    return __awaiter(this, void 0, void 0, function () {
        var product, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, exports.paddle.products.update(productId, requestBody)
                        // Returns an updated product entity
                    ];
                case 1:
                    product = _a.sent();
                    // Returns an updated product entity
                    return [2 /*return*/, product];
                case 2:
                    e_4 = _a.sent();
                    console.log(JSON.stringify(e_4));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function createPrice(requestBody) {
    return __awaiter(this, void 0, void 0, function () {
        var price, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, exports.paddle.prices.create(requestBody)];
                case 1:
                    price = _a.sent();
                    return [2 /*return*/, price
                        // Returns a price entity
                    ];
                case 2:
                    e_5 = _a.sent();
                    console.error('Error creating price:', e_5);
                    // Handle Network/API errors
                    throw new Error;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function archivePrice(priceId) {
    return __awaiter(this, void 0, void 0, function () {
        var price, e_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, exports.paddle.prices.archive(priceId)
                        // Returns an archived price entity
                    ];
                case 1:
                    price = _a.sent();
                    // Returns an archived price entity
                    return [2 /*return*/, price];
                case 2:
                    e_6 = _a.sent();
                    // Handle Network/API errors
                    console.error("Error archiving price ".concat(priceId, ":"), e_6);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function archiveProduct(productId) {
    return __awaiter(this, void 0, void 0, function () {
        var product, e_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, exports.paddle.products.archive(productId)
                        // Returns an archived product entity
                    ];
                case 1:
                    product = _a.sent();
                    // Returns an archived product entity
                    return [2 /*return*/, product];
                case 2:
                    e_7 = _a.sent();
                    // Handle Network/API errors
                    console.error("Error archiving product ".concat(productId, ":"), e_7);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function createProduct(requestBody) {
    return __awaiter(this, void 0, void 0, function () {
        var product, e_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, exports.paddle.products.create(requestBody)
                        // Returns a product entity
                    ];
                case 1:
                    product = _a.sent();
                    // Returns a product entity
                    return [2 /*return*/, product];
                case 2:
                    e_8 = _a.sent();
                    console.log(JSON.stringify(e_8, null, 4));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function updatePrice(priceId, requestBody) {
    return __awaiter(this, void 0, void 0, function () {
        var price, e_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, exports.paddle.prices.update(priceId, requestBody)
                        // Returns an updated price entity
                    ];
                case 1:
                    price = _a.sent();
                    // Returns an updated price entity
                    return [2 /*return*/, price];
                case 2:
                    e_9 = _a.sent();
                    console.error("Error updating price ".concat(priceId, ":"), e_9);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
