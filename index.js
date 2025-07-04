"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var colour_1 = require("./colour");
var readline = require("readline");
var process_1 = require("process");
var extraPaddle_1 = require("./extraPaddle");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
var setupFileLocation = "pricing.json";
function niceJSON(json) {
    return JSON.stringify(json, null, 4);
}
function areTheSame(obj1, obj2) {
    // If the objects are strictly the same reference, return true
    if (obj1 === obj2) {
        return true;
    }
    // If either is null or not an object, they can't be equal (unless both are null, which is handled above)
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
        return false;
    }
    var keys1 = Object.keys(obj1);
    var keys2 = Object.keys(obj2);
    // Check if they have the same number of keys
    if (keys1.length !== keys2.length) {
        return false;
    }
    // Iterate over the keys of the first object
    for (var _i = 0, keys1_1 = keys1; _i < keys1_1.length; _i++) {
        var key = keys1_1[_i];
        // Check if the key exists in the second object and if the values are different
        if (!Object.prototype.hasOwnProperty.call(obj2, key) || !areTheSame(obj1[key], obj2[key])) {
            return false;
        }
    }
    // If all checks pass, the objects have the same keys and values
    return true;
}
function compareObjects(obj1, obj2) {
    var different = false;
    // Check if both inputs are objects and not null
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
        console.error("Error: Both arguments must be non-null objects.");
        return;
    }
    console.log("Comparing \"".concat(obj1.name, "\""));
    // Iterate over the keys of the first object
    for (var key in obj1) {
        // Ensure the key is an own property of obj1 (not inherited)
        if (key != "productId" && Object.prototype.hasOwnProperty.call(obj1, key)) {
            // Compare the values for the current key
            if (!areTheSame(obj1[key], obj2[key])) {
                different = true;
                console.log((0, colour_1.colour)(["FgYellow", "Bright"], "Property '".concat(key, "': Values are different. (obj1: ").concat(niceJSON(obj1[key]), ", obj2: ").concat(niceJSON(obj2[key]))));
            }
            else {
                console.log((0, colour_1.colour)(["FgGreen"], "Property '".concat(key, "': Values are the same. ") /*(Value: ${niceJSON(obj1[key])}*/));
            }
        }
    }
    return different;
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
                                                            return [4 /*yield*/, (0, extraPaddle_1.archiveProduct)(realProduct.id)];
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
                        var newProd, existingProduct, archive, count, _loop_3, _d, _e, price, currentPaddleProduct, currentPrices, i, _loop_4, _f, _g, individualPrice;
                        return __generator(this, function (_h) {
                            switch (_h.label) {
                                case 0:
                                    if (!!currentProducts.includes(templateProduct.name)) return [3 /*break*/, 3];
                                    newProd = new extraPaddle_1.StrictPaddleProduct(templateProduct.name);
                                    delete newProd.prices;
                                    return [4 /*yield*/, (0, extraPaddle_1.createProduct)(newProd)];
                                case 1:
                                    _h.sent();
                                    console.log((0, colour_1.colour)(["FgGreen"], "Created a new product: ".concat(templateProduct.name)));
                                    return [4 /*yield*/, (0, extraPaddle_1.getAllProducts)()];
                                case 2:
                                    //need to update the real object, as it is now out of date - if the product has been created succesfully, it will be reflected here
                                    real = _h.sent();
                                    _h.label = 3;
                                case 3:
                                    existingProduct = real.find(function (element) {
                                        return element.name == templateProduct.name;
                                    });
                                    return [4 /*yield*/, (0, extraPaddle_1.getProduct)(existingProduct.id, { include: ['prices'] })];
                                case 4:
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
                                                        //display a little message to explain what is being done to the price
                                                        //this could be an opportunity to prompt the user for confirmation
                                                        console.log((0, colour_1.colour)(["FgYellow"], "Archived 1 price from the product ".concat(existingProduct.name, ", because it did not match any prices in the template")));
                                                    }
                                                    return [4 /*yield*/, (0, extraPaddle_1.archivePrice)(price.id)];
                                                case 1:
                                                    _j.sent();
                                                    count += 1;
                                                    _j.label = 2;
                                                case 2: return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _d = 0, _e = existingProduct.prices;
                                    _h.label = 5;
                                case 5:
                                    if (!(_d < _e.length)) return [3 /*break*/, 8];
                                    price = _e[_d];
                                    return [5 /*yield**/, _loop_3(price)];
                                case 6:
                                    _h.sent();
                                    _h.label = 7;
                                case 7:
                                    _d++;
                                    return [3 /*break*/, 5];
                                case 8:
                                    if (archive) {
                                        console.log((0, colour_1.colour)(["FgRed", "Bright"], "Archived ".concat(count, " prices from the product ").concat(existingProduct.name)));
                                    }
                                    currentPaddleProduct = new extraPaddle_1.PaddleProduct(templateProduct.name);
                                    templateProduct.prices.forEach(function (templatePrice) {
                                        var _a;
                                        //convert the object to an array of keys and values, so it can be iterated through
                                        var priceArray = Object.entries(templatePrice.amounts);
                                        //@ts-ignore
                                        var basePrice = new extraPaddle_1.PaddleUnitPrice((priceArray[0][1] * 100).toString(), priceArray[0][0]);
                                        //handle the billing cycle for the two hardcoded options
                                        var currentBillingCycle;
                                        switch (templatePrice.billingInterval) {
                                            case "year":
                                                currentBillingCycle = new extraPaddle_1.PaddleBillingCycle("year", 1);
                                                break;
                                            case "month":
                                                currentBillingCycle = new extraPaddle_1.PaddleBillingCycle("month", 1);
                                                break;
                                            default:
                                                console.log((0, colour_1.colour)(["BgYellow", "FgRed", "Bright"], "A billing cycle property value could not be recognised."));
                                                throw new Error;
                                                break;
                                        }
                                        // instantiate a price object for storing all the pricing information
                                        var currentPrice = new extraPaddle_1.PaddlePrice(templatePrice.name, basePrice, currentBillingCycle);
                                        //for each currency in the template, find the countries which need a currency overwrite
                                        priceArray.forEach(function (priceGroup) {
                                            if (priceGroup[0] != basePrice.currencyCode) {
                                                var relevantCountries = (0, extraPaddle_1.getCurrencyCountries)(priceGroup[0]);
                                                // @ts-ignore
                                                var currencyPrice = new extraPaddle_1.PaddleUnitPrice((priceGroup[1] * 100).toString(), priceGroup[0]);
                                                var overridePrice = new extraPaddle_1.PaddleOverridePrice(currencyPrice, relevantCountries);
                                                //adds the override price to the complete price object
                                                currentPrice.unitPriceOverrides.push(overridePrice);
                                            }
                                        });
                                        currentPrice.description = templatePrice.label;
                                        //prices need to be sent seperately, but are included for now
                                        //iterate through all of the properties of the template price object, and check which match the list of custom properties
                                        var customData = Object.entries(templatePrice);
                                        customData = customData.filter(function (pair) {
                                            return extraPaddle_1.allowedCustomProperties.includes(pair[0]);
                                        });
                                        var customDataObject = {};
                                        customData.forEach(function (pair) {
                                            // values are converted into strings, else they are not displayed by Paddle.
                                            // If this creates an issue, the following code can be modified, just note that the data won't be displayed in the Paddle web UI
                                            customDataObject[pair[0]] = "".concat(pair[1]);
                                        });
                                        //adds the obejct of custom data to the current price
                                        currentPrice.customData = customDataObject;
                                        (_a = currentPaddleProduct.prices) === null || _a === void 0 ? void 0 : _a.push(currentPrice);
                                    });
                                    currentPrices = currentPaddleProduct.prices;
                                    delete currentPaddleProduct.prices;
                                    return [4 /*yield*/, (0, extraPaddle_1.updateProduct)(existingProduct.id, currentPaddleProduct)];
                                case 9:
                                    _h.sent();
                                    i = 0;
                                    _loop_4 = function (individualPrice) {
                                        var foundPrice;
                                        return __generator(this, function (_k) {
                                            switch (_k.label) {
                                                case 0:
                                                    foundPrice = existingProduct.prices.find(function (price) {
                                                        return (price.name == individualPrice.name) && (price.status != "archived");
                                                    });
                                                    if (!foundPrice) return [3 /*break*/, 4];
                                                    if (!!compareObjects(individualPrice, foundPrice)) return [3 /*break*/, 1];
                                                    //the same
                                                    console.log("Both prices are the same, no changes will be made");
                                                    //@ts-ignore
                                                    currentPrices.splice(i, 1);
                                                    return [3 /*break*/, 3];
                                                case 1:
                                                    console.log("This price will be updated");
                                                    return [4 /*yield*/, makeChanges(currentPaddleProduct, currentPrices, existingProduct)];
                                                case 2:
                                                    _k.sent();
                                                    _k.label = 3;
                                                case 3: return [3 /*break*/, 5];
                                                case 4:
                                                    //price does not yet exist
                                                    console.log("There is no existing price called ".concat(foundPrice.name, " in the product: ").concat(currentPaddleProduct.name, ", so a new one will be made"));
                                                    _k.label = 5;
                                                case 5:
                                                    i++;
                                                    return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _f = 0, _g = currentPrices ? currentPrices : [];
                                    _h.label = 10;
                                case 10:
                                    if (!(_f < _g.length)) return [3 /*break*/, 13];
                                    individualPrice = _g[_f];
                                    return [5 /*yield**/, _loop_4(individualPrice)];
                                case 11:
                                    _h.sent();
                                    _h.label = 12;
                                case 12:
                                    _f++;
                                    return [3 /*break*/, 10];
                                case 13: return [2 /*return*/];
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
function makeChanges(currentPaddleProduct, currentPrices, existingProduct) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        rl.question((0, colour_1.colour)(["FgBlack", "BgWhite", "Bright"], "Confirm the above changes to the  ".concat(currentPaddleProduct.name, " product (y/n)")) + " ", function (answer) { return __awaiter(_this, void 0, void 0, function () {
                            var _loop_5, _i, _a, individualPrice;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (!(answer == "y" || answer == "Y")) return [3 /*break*/, 5];
                                        _loop_5 = function (individualPrice) {
                                            var foundPrice;
                                            return __generator(this, function (_c) {
                                                switch (_c.label) {
                                                    case 0:
                                                        foundPrice = existingProduct.prices.find(function (price) {
                                                            //console.log(JSON.stringify(price,null,4))
                                                            return (price.name == individualPrice.name) && (price.status != "archived");
                                                        });
                                                        if (!foundPrice) return [3 /*break*/, 2];
                                                        //existing price found, update it
                                                        delete individualPrice.productId;
                                                        //@ts-ignore
                                                        return [4 /*yield*/, (0, extraPaddle_1.updatePrice)(foundPrice.id, individualPrice)];
                                                    case 1:
                                                        //@ts-ignore
                                                        _c.sent();
                                                        console.log((0, colour_1.colour)(["FgGreen"], "Updated the price: ".concat(individualPrice.name, " for the product: ").concat(currentPaddleProduct.name)));
                                                        return [3 /*break*/, 4];
                                                    case 2:
                                                        individualPrice.productId = existingProduct.id;
                                                        //@ts-ignore
                                                        return [4 /*yield*/, (0, extraPaddle_1.createPrice)(individualPrice)];
                                                    case 3:
                                                        //@ts-ignore
                                                        _c.sent();
                                                        console.log((0, colour_1.colour)(["FgGreen"], "Added the price: ".concat(individualPrice.name, " to the product: ").concat(currentPaddleProduct.name)));
                                                        _c.label = 4;
                                                    case 4: return [2 /*return*/];
                                                }
                                            });
                                        };
                                        _i = 0, _a = currentPrices ? currentPrices : [];
                                        _b.label = 1;
                                    case 1:
                                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                                        individualPrice = _a[_i];
                                        return [5 /*yield**/, _loop_5(individualPrice)];
                                    case 2:
                                        _b.sent();
                                        _b.label = 3;
                                    case 3:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 4: return [3 /*break*/, 6];
                                    case 5:
                                        console.log((0, colour_1.colour)(["FgYellow"], "Changes to the product were not made (skipped)"));
                                        _b.label = 6;
                                    case 6:
                                        resolve(1);
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    })];
                case 1:
                    _a.sent();
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
                case 0: return [4 /*yield*/, (0, extraPaddle_1.getAllProducts)()];
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
        var saveFile, allProducts, product, _i, allProducts_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    saveFile = "[";
                    return [4 /*yield*/, (0, extraPaddle_1.getAllProducts)()];
                case 1:
                    allProducts = _a.sent();
                    _i = 0, allProducts_1 = allProducts;
                    _a.label = 2;
                case 2:
                    if (!(_i < allProducts_1.length)) return [3 /*break*/, 5];
                    product = allProducts_1[_i];
                    return [4 /*yield*/, (0, extraPaddle_1.getProduct)(product.id, { include: ['prices'] })];
                case 3:
                    product = _a.sent();
                    saveFile += "".concat(JSON.stringify(product, null, 4), ",\n");
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    //write data to file, removing trailing comma
                    fs.writeFileSync("prices-".concat(process_1.argv[2], ".json"), saveFile.substring(0, saveFile.length - 2) + "]");
                    console.log((0, colour_1.colour)(["FgMagenta", "Bright"], "Found and wrote ".concat(allProducts.length, " products to the file: prices-").concat(process_1.argv[2], ".json")));
                    (0, process_1.exit)(0);
                    return [2 /*return*/];
            }
        });
    });
}
if (process.argv[3] == "read") {
    console.log((0, colour_1.colour)(["BgMagenta", "FgBlack"], "Finding all products and prices."));
    data();
}
else {
    main();
}
