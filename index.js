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
var paddle_node_sdk_1 = require("@paddle/paddle-node-sdk");
var fs = require("fs");
var colour_1 = require("./colour");
var readline = require("readline");
var process_1 = require("process");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
var setupFileLocation = "pricing.json";
var apiKey = 'pdl_sdbx_apikey_01jz36jnrywm66qh66b4q0az86_vbwhMgVtw5735ekbp1CsP5_ArJ';
var sandbox = true;
var allowedCustomProperties = [
    "productLine",
    "mapTo",
    "display"
];
var paddleCountries;
try {
    paddleCountries = JSON.parse(fs.readFileSync("paddleCountries.json").toString()).data;
}
catch (error) {
    console.log((0, colour_1.colour)(["BgRed", "FgWhite"], "Could not open the file containing the list of country codes"));
}
var euroZone = [
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
            euroZone.forEach(function (euroZoneCountry) {
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
        var foundPaddleCountry = paddleCountries.find(function (pCountry) { return pCountry.name == countryName; });
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
var PaddleBillingCycle = /** @class */ (function () {
    function PaddleBillingCycle(interval, frequency) {
        this.interval = interval;
        this.frequency = frequency;
    }
    return PaddleBillingCycle;
}());
var PaddleUnitPrice = /** @class */ (function () {
    function PaddleUnitPrice(amount, currencyCode) {
        this.amount = amount;
        this.currencyCode = currencyCode;
    }
    return PaddleUnitPrice;
}());
var PaddleOverridePrice = /** @class */ (function () {
    function PaddleOverridePrice(price, countries) {
        this.unitPrice = price;
        this.countryCodes = countries;
    }
    return PaddleOverridePrice;
}());
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
var StrictPaddleProduct = /** @class */ (function (_super) {
    __extends(StrictPaddleProduct, _super);
    function StrictPaddleProduct(name, prices) {
        var _this = _super.call(this, name, prices) || this;
        _this.taxCategory = "standard";
        return _this;
    }
    return StrictPaddleProduct;
}(PaddleProduct));
var paddle = new paddle_node_sdk_1.Paddle(apiKey, sandbox ? { environment: paddle_node_sdk_1.Environment.sandbox, logLevel: paddle_node_sdk_1.LogLevel.error } : {});
function getAllProducts() {
    return __awaiter(this, void 0, void 0, function () {
        var productCollection, allItems, _a, productCollection_1, productCollection_1_1, product, e_1_1, e_2;
        var _b, e_1, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    productCollection = paddle.products.list();
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
                    return [4 /*yield*/, paddle.products.get(productId, queryParams)
                        // Returns a product entity
                    ];
                case 1:
                    product = _a.sent();
                    // Returns a product entity
                    return [2 /*return*/, product];
                case 2:
                    e_3 = _a.sent();
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
                    return [4 /*yield*/, paddle.products.update(productId, requestBody)
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
                    return [4 /*yield*/, paddle.prices.create(requestBody)];
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
                    return [4 /*yield*/, paddle.prices.archive(priceId)
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
                    return [4 /*yield*/, paddle.products.archive(productId)
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
                    return [4 /*yield*/, paddle.products.create(requestBody)
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
                    return [4 /*yield*/, paddle.prices.update(priceId, requestBody)
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
function compare(template, real) {
    return __awaiter(this, void 0, void 0, function () {
        var currentProducts, issue, _loop_1, _i, real_1, realProduct, _loop_2, _a, template_1, templateProduct;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    currentProducts = [];
                    issue = false;
                    _loop_1 = function (realProduct) {
                        var definitionCount;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    definitionCount = 0;
                                    template.forEach(function (templateProduct) {
                                        if (realProduct.name == templateProduct.name) {
                                            definitionCount += 1;
                                        }
                                    });
                                    if (!(definitionCount > 1)) return [3 /*break*/, 1];
                                    console.log((0, colour_1.colour)(["BgRed", "FgWhite"], "Multiple definitions were found for the product ".concat(realProduct.name, ".  Please correct the file: ").concat(setupFileLocation)));
                                    issue = true;
                                    return [3 /*break*/, 4];
                                case 1:
                                    if (!(definitionCount == 0)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                                            rl.question((0, colour_1.colour)(["FgYellow", "BgWhite", "Bright"], "The product: ".concat(realProduct.name, " is not defined in the template file, delete this product? (y)")) + " ", function (answer) { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            if (!(answer == "y" || answer == "Y")) return [3 /*break*/, 2];
                                                            return [4 /*yield*/, archiveProduct(realProduct.id)];
                                                        case 1:
                                                            _a.sent();
                                                            console.log((0, colour_1.colour)(["FgRed", "Bright"], "Product archived"));
                                                            return [3 /*break*/, 3];
                                                        case 2:
                                                            console.log((0, colour_1.colour)(["FgYellow"], "The product was not archived (skipped)"));
                                                            _a.label = 3;
                                                        case 3:
                                                            resolve(1);
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); });
                                        })];
                                case 2:
                                    _c.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    console.log((0, colour_1.colour)(["FgGreen"], "Found an appropriate definition in the template for the product: ".concat(realProduct.name, ".  This product will be updated")));
                                    currentProducts.push(realProduct.name);
                                    _c.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, real_1 = real;
                    _b.label = 1;
                case 1:
                    if (!(_i < real_1.length)) return [3 /*break*/, 4];
                    realProduct = real_1[_i];
                    return [5 /*yield**/, _loop_1(realProduct)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    if (issue) {
                        console.log((0, colour_1.colour)(["BgRed", "FgWhite"], "Could not commence updating of the prices.  Please address the issue(s) above"));
                        throw new Error;
                    }
                    _loop_2 = function (templateProduct) {
                        var newProd, existingProduct, archive, count, _loop_3, _d, _e, price, currentPaddleProduct, currentPrices, _loop_4, _f, _g, individualPrice;
                        return __generator(this, function (_h) {
                            switch (_h.label) {
                                case 0:
                                    if (!currentProducts.includes(templateProduct.name)) return [3 /*break*/, 1];
                                    return [3 /*break*/, 4];
                                case 1:
                                    newProd = new StrictPaddleProduct(templateProduct.name);
                                    delete newProd.prices;
                                    return [4 /*yield*/, createProduct(newProd)];
                                case 2:
                                    _h.sent();
                                    console.log((0, colour_1.colour)(["FgGreen"], "Created a new product: ".concat(templateProduct.name)));
                                    return [4 /*yield*/, getAllProducts()];
                                case 3:
                                    //need to update the real object, as it is now out of date
                                    real = _h.sent();
                                    _h.label = 4;
                                case 4:
                                    existingProduct = real.find(function (element) {
                                        return element.name == templateProduct.name;
                                    });
                                    return [4 /*yield*/, getProduct(existingProduct.id, { include: ['prices'] })];
                                case 5:
                                    existingProduct = _h.sent();
                                    archive = false;
                                    count = 0;
                                    _loop_3 = function (price) {
                                        return __generator(this, function (_j) {
                                            switch (_j.label) {
                                                case 0:
                                                    if (!(price.status != "archived" && (archive || !(templateProduct.prices.find(function (element) {
                                                        return element.name == price.name;
                                                    }))))) return [3 /*break*/, 2];
                                                    if (!archive) {
                                                        //display a little message to explain
                                                        console.log((0, colour_1.colour)(["FgYellow"], "Archived 1 price from the product ".concat(existingProduct.name, ", because it did not match any prices in the template")));
                                                    }
                                                    return [4 /*yield*/, archivePrice(price.id)];
                                                case 1:
                                                    _j.sent();
                                                    count += 1;
                                                    _j.label = 2;
                                                case 2: return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _d = 0, _e = existingProduct.prices;
                                    _h.label = 6;
                                case 6:
                                    if (!(_d < _e.length)) return [3 /*break*/, 9];
                                    price = _e[_d];
                                    return [5 /*yield**/, _loop_3(price)];
                                case 7:
                                    _h.sent();
                                    _h.label = 8;
                                case 8:
                                    _d++;
                                    return [3 /*break*/, 6];
                                case 9:
                                    if (archive) {
                                        console.log((0, colour_1.colour)(["FgRed", "Bright"], "Archived ".concat(count, " prices from the product ").concat(existingProduct.name)));
                                    }
                                    currentPaddleProduct = new PaddleProduct(templateProduct.name);
                                    templateProduct.prices.forEach(function (templatePrice) {
                                        var _a;
                                        var priceArray = Object.entries(templatePrice.amounts);
                                        //create the object for easier management
                                        // @ts-ignore
                                        var basePrice = new PaddleUnitPrice((priceArray[0][1] * 100).toString(), priceArray[0][0]);
                                        //handle the billing cycle for the two hardcoded options
                                        var currentBillingCycle;
                                        switch (templatePrice.billingInterval) {
                                            case "year":
                                                currentBillingCycle = new PaddleBillingCycle("year", 1);
                                                break;
                                            case "month":
                                                currentBillingCycle = new PaddleBillingCycle("month", 1);
                                                break;
                                            default:
                                                console.log((0, colour_1.colour)(["BgYellow", "FgRed", "Bright"], "A billing cycle property value could not be recognised."));
                                                throw new Error;
                                                break;
                                        }
                                        var currentPrice = new PaddlePrice(templatePrice.name, basePrice, currentBillingCycle);
                                        priceArray.forEach(function (priceGroup) {
                                            if (priceGroup[0] != basePrice.currencyCode) {
                                                var relevantCountries = getCurrencyCountries(priceGroup[0]);
                                                // @ts-ignore
                                                var currencyPrice = new PaddleUnitPrice((priceGroup[1] * 100).toString(), priceGroup[0]);
                                                var overridePrice = new PaddleOverridePrice(currencyPrice, relevantCountries);
                                                //add the override price to the complete price object
                                                currentPrice.unitPriceOverrides.push(overridePrice);
                                            }
                                        });
                                        //deal with name and internal name
                                        currentPrice.description = templatePrice.label;
                                        //prices need to be sent seperately, but are included for now
                                        var customData = Object.entries(templatePrice);
                                        customData = customData.filter(function (pair) {
                                            return allowedCustomProperties.includes(pair[0]);
                                        });
                                        var customDataObject = {};
                                        customData.forEach(function (pair) {
                                            customDataObject[pair[0]] = "".concat(pair[1]);
                                        });
                                        currentPrice.customData = customDataObject;
                                        (_a = currentPaddleProduct.prices) === null || _a === void 0 ? void 0 : _a.push(currentPrice);
                                    });
                                    currentPrices = currentPaddleProduct.prices;
                                    delete currentPaddleProduct.prices;
                                    return [4 /*yield*/, updateProduct(existingProduct.id, currentPaddleProduct)];
                                case 10:
                                    _h.sent();
                                    _loop_4 = function (individualPrice) {
                                        var foundPrice;
                                        return __generator(this, function (_k) {
                                            switch (_k.label) {
                                                case 0:
                                                    foundPrice = existingProduct.prices.find(function (price) {
                                                        //console.log(JSON.stringify(price,null,4))
                                                        return (price.name == individualPrice.name) && (price.status != "archived");
                                                    });
                                                    if (!foundPrice) return [3 /*break*/, 2];
                                                    //existing price found, update it
                                                    delete individualPrice.productId;
                                                    // @ts-ignore
                                                    return [4 /*yield*/, updatePrice(foundPrice.id, individualPrice)];
                                                case 1:
                                                    // @ts-ignore
                                                    _k.sent();
                                                    console.log((0, colour_1.colour)(["FgGreen"], "Updated the price: ".concat(individualPrice.name, " for the product: ").concat(currentPaddleProduct.name)));
                                                    return [3 /*break*/, 4];
                                                case 2:
                                                    individualPrice.productId = existingProduct.id;
                                                    //console.log(JSON.stringify(individualPrice,null,4))
                                                    // @ts-ignore
                                                    return [4 /*yield*/, createPrice(individualPrice)];
                                                case 3:
                                                    //console.log(JSON.stringify(individualPrice,null,4))
                                                    // @ts-ignore
                                                    _k.sent();
                                                    console.log((0, colour_1.colour)(["FgGreen"], "Added the price: ".concat(individualPrice.name, " to the product: ").concat(currentPaddleProduct.name)));
                                                    _k.label = 4;
                                                case 4: return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _f = 0, _g = currentPrices ? currentPrices : [];
                                    _h.label = 11;
                                case 11:
                                    if (!(_f < _g.length)) return [3 /*break*/, 14];
                                    individualPrice = _g[_f];
                                    return [5 /*yield**/, _loop_4(individualPrice)];
                                case 12:
                                    _h.sent();
                                    _h.label = 13;
                                case 13:
                                    _f++;
                                    return [3 /*break*/, 11];
                                case 14: return [2 /*return*/];
                            }
                        });
                    };
                    _a = 0, template_1 = template;
                    _b.label = 5;
                case 5:
                    if (!(_a < template_1.length)) return [3 /*break*/, 8];
                    templateProduct = template_1[_a];
                    return [5 /*yield**/, _loop_2(templateProduct)];
                case 6:
                    _b.sent();
                    _b.label = 7;
                case 7:
                    _a++;
                    return [3 /*break*/, 5];
                case 8:
                    console.log("Done");
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var foundProducts, setupFile, error_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAllProducts()];
                case 1:
                    foundProducts = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 7, , 8]);
                    setupFile = fs.readFileSync(setupFileLocation);
                    setupFile = JSON.parse(setupFile.toString());
                    console.log((0, colour_1.colour)(["FgGreen"], "Setup file found"));
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, compare(setupFile, foundProducts)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.log((0, colour_1.colour)(["BgRed", "FgBlack", "Bright"], "A critical error occurred. " + JSON.stringify(error_1, null, 4)));
                    return [3 /*break*/, 6];
                case 6:
                    (0, process_1.exit)(0);
                    return [3 /*break*/, 8];
                case 7:
                    error_2 = _a.sent();
                    console.error((0, colour_1.colour)(["FgRed"], "Could not find the specified file, looking for ".concat(setupFileLocation, ", with error ").concat(JSON.stringify(error_2))));
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function data() {
    return __awaiter(this, void 0, void 0, function () {
        var allProducts, product, _i, allProducts_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAllProducts()];
                case 1:
                    allProducts = _a.sent();
                    _i = 0, allProducts_1 = allProducts;
                    _a.label = 2;
                case 2:
                    if (!(_i < allProducts_1.length)) return [3 /*break*/, 5];
                    product = allProducts_1[_i];
                    return [4 /*yield*/, getProduct(product.id, { include: ['prices'] })];
                case 3:
                    product = _a.sent();
                    console.log((0, colour_1.colour)(["FgMagenta", "Bright"], "The ".concat(product.name, " product:")));
                    console.log(JSON.stringify(product, null, 4));
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    console.log((0, colour_1.colour)(["FgMagenta", "Bright"], "Found and displayed ".concat(allProducts.length, " products")));
                    (0, process_1.exit)(0);
                    return [2 /*return*/];
            }
        });
    });
}
if (process.argv[2] == "find") {
    console.log((0, colour_1.colour)(["BgMagenta", "FgBlack"], "Finding all products and prices."));
    data();
}
else {
    main();
}
