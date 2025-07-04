import { Product} from '@paddle/paddle-node-sdk';
import * as fs from 'fs';
import {colour} from "./colour"
import * as readline from 'readline';
import { argv, exit } from 'process';
import { allowedCustomProperties, archivePrice, archiveProduct, createPrice, createProduct, getAllProducts, getCurrencyCountries, getProduct, PaddleBillingCycle, PaddleOverridePrice, PaddlePrice, PaddleProduct, PaddleUnitPrice, StrictPaddleProduct, updatePrice, updateProduct } from "./extraPaddle"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const setupFileLocation = "pricing.json"

function niceJSON(json:any){
    return JSON.stringify(json,null,4)
}

function areTheSame(obj1:any, obj2:any) {
  // If the objects are strictly the same reference, return true
  if (obj1 === obj2) {
    return true;
  }

  // If either is null or not an object, they can't be equal (unless both are null, which is handled above)
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if they have the same number of keys
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Iterate over the keys of the first object
  for (const key of keys1) {
    // Check if the key exists in the second object and if the values are different
    if (!Object.prototype.hasOwnProperty.call(obj2, key) || !areTheSame(obj1[key],obj2[key])) {
      return false;
    }
  }

  // If all checks pass, the objects have the same keys and values
  return true;
}

function compareObjects(obj1:any, obj2:any) {
  let different = false
  // Check if both inputs are objects and not null
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    console.error("Error: Both arguments must be non-null objects.");
    return;
  }

  console.log(`Comparing "${obj1.name}"`);

  // Iterate over the keys of the first object
  for (const key in obj1) {
    // Ensure the key is an own property of obj1 (not inherited)
    if (key != "productId" &&Object.prototype.hasOwnProperty.call(obj1, key)) {
      // Compare the values for the current key
      if (!areTheSame(obj1[key],obj2[key])) {
        different = true
        console.log(colour(["FgYellow","Bright"],`Property '${key}': Values are different. (obj1: ${niceJSON(obj1[key])}, obj2: ${niceJSON(obj2[key])}`));
      } else {
        console.log(colour(["FgGreen"],`Property '${key}': Values are the same. `/*(Value: ${niceJSON(obj1[key])}*/));
      }
    }
  }
  return different
}


async function compare(template:any,real:any){
    //two arrays of products (hopefully)
    //check if there is an equivalent product for each product in the template
    let currentProducts: string[] = []
    let issue:boolean = false
    
    for (let realProduct of real ){
    let definitionCount:number = 0;
        template.forEach((templateProduct: any) => {
            if (realProduct.name == templateProduct.name) {
                definitionCount +=1
            }
        });
        if (definitionCount > 1){
            console.log(colour(["BgRed","FgWhite"],`Multiple definitions were found for the product ${realProduct.name}.  Please correct the file: ${setupFileLocation}`));
            issue = true
        } else if (definitionCount == 0) {
            await new Promise((resolve,reject)=>{
                rl.question(colour(["FgYellow","BgWhite","Bright"],`The product: ${realProduct.name} is not defined in the template file, delete this product? (y)`)+" ",async (answer)=>{
                    if (answer == "y"||answer == "Y"){
                        await archiveProduct(realProduct.id)
                        console.log(colour(["FgRed","Bright"],"Product archived"))
                    } else {
                        console.log(colour(["FgYellow"],"The product was not archived (skipped)"))
                    }
                    resolve(1)
                })
            })
        } else {
            console.log(colour(["FgGreen"],`Found an appropriate definition in the template for the product: ${realProduct.name}.  This product will be updated`))
            currentProducts.push(realProduct.name)
        }
    }
    if (issue){
        console.log(colour(["BgRed","FgWhite"],"Could not commence updating of the prices.  Please address the issue(s) above"))
        throw new Error
    }
    //at this point, the template file should contain only unique products
    for (let templateProduct of template){
        if (!currentProducts.includes(templateProduct.name)){
            //create new product - it does not already exist
            let newProd = new StrictPaddleProduct(templateProduct.name)
            delete newProd.prices
            await createProduct(newProd)
            console.log(colour(["FgGreen"],`Created a new product: ${templateProduct.name}`))

            //need to update the real object, as it is now out of date - if the product has been created succesfully, it will be reflected here
            real = await getAllProducts();
        }

        //first check which exist already, to log to user
        //get the complete product (with prices!)
        

        //find the product from paddle which matches the product in the template.
        //There must be an existing product, as previously one would have been created if not
        let existingProduct = real.find((element:any)=>{
            return element.name == templateProduct.name
        })
        existingProduct = await getProduct(existingProduct.id,{ include: ['prices'] })

        let archive:boolean = false
        //uncomment code below to present users with a choice of whether to completely clear out the product, or update prices.
        /*while (validInput == false){ 
            await new Promise((resolve,reject)=>{
                rl.question(colour(["BgWhite","FgBlack"],`Archive (and replace) (1) or Update (2) existing prices for the ${existingProduct.name} product?`)+" ",(answer)=>{
                    if (answer == "1"){
                        resolve(1)
                    } else if (answer == "2") {
                        resolve(2)
                    } else {
                        reject()
                    }
                })
            })
            .then((result)=>{
                validInput = true
                if (result=="1"){
                    archive = true
                }
            })
            .catch(()=>{

            })
        }*/

        let count:number = 0
        for (let price of existingProduct.prices){
            //returns the price if the price is not already archived, and either the user is archiving all prices, or it does not match any prices in the template
            if (price.status != "archived"&&(archive||!(templateProduct.prices.find((element:PaddlePrice)=>{
                return element.name == price.name
            })))){
                if (!archive){
                    //display a little message to explain what is being done to the price
                    //this could be an opportunity to prompt the user for confirmation
                    console.log(colour(["FgYellow"],`Archived 1 price from the product ${existingProduct.name}, because it did not match any prices in the template`))
                }
                await archivePrice(price.id)
                count+=1
            }   
        }
        if (archive){
            console.log(colour(["FgRed","Bright"],`Archived ${count} prices from the product ${existingProduct.name}`))
        }

        //existing product found, now iterate through prices
        //each country needs it's own price, unless it uses the base USD price.  Groups of countries can be set as well
        //handle each price specified in amounts
        let currentPaddleProduct:PaddleProduct = new PaddleProduct(templateProduct.name)

        templateProduct.prices.forEach((templatePrice:any)=>{
            
            //convert the object to an array of keys and values, so it can be iterated through
            let priceArray: Array<[string, number]> = Object.entries(templatePrice.amounts);

            //@ts-ignore
            let basePrice = new PaddleUnitPrice((priceArray[0][1]*100).toString(),priceArray[0][0])
            //handle the billing cycle for the two hardcoded options
            let currentBillingCycle:PaddleBillingCycle
            switch (templatePrice.billingInterval) {
                case "year":
                    currentBillingCycle = new PaddleBillingCycle("year",1)
                    break;
                case "month":
                    currentBillingCycle = new PaddleBillingCycle("month",1)
                    break;
                default:
                    console.log(colour(["BgYellow","FgRed","Bright"],"A billing cycle property value could not be recognised."))
                    throw new Error
                    break;
            }

            // instantiate a price object for storing all the pricing information
            let currentPrice = new PaddlePrice(templatePrice.name,basePrice,currentBillingCycle)
            //for each currency in the template, find the countries which need a currency overwrite
            priceArray.forEach((priceGroup)=>{
                if (priceGroup[0]!=basePrice.currencyCode){
                    let relevantCountries = getCurrencyCountries(priceGroup[0])
                    // @ts-ignore
                    let currencyPrice = new PaddleUnitPrice((priceGroup[1]*100).toString(),priceGroup[0])
                    let overridePrice = new PaddleOverridePrice(currencyPrice,relevantCountries)
                    //adds the override price to the complete price object
                    currentPrice.unitPriceOverrides.push(overridePrice)
                }
            })

            currentPrice.description = templatePrice.label
            //prices need to be sent seperately, but are included for now

            //iterate through all of the properties of the template price object, and check which match the list of custom properties
            let customData:any = Object.entries(templatePrice)
            customData = customData.filter((pair:any)=>{
                return allowedCustomProperties.includes(pair[0])
            })

            let customDataObject:any = {}

            customData.forEach((pair:any) => {
                // values are converted into strings, else they are not displayed by Paddle.
                // If this creates an issue, the following code can be modified, just note that the data won't be displayed in the Paddle web UI
                customDataObject[pair[0]] = `${pair[1]}`
            });
            //adds the obejct of custom data to the current price
            currentPrice.customData = customDataObject

            currentPaddleProduct.prices?.push(currentPrice)

        })
        //product should be done?!?
        //now remove prices

        let currentPrices = currentPaddleProduct.prices
        delete currentPaddleProduct.prices
        await updateProduct(existingProduct.id,currentPaddleProduct)

        let i = 0
        for (let individualPrice of currentPrices?currentPrices:[]){
            let foundPrice = existingProduct.prices.find((price:any)=>{
                return (price.name == individualPrice.name)&& (price.status != "archived")
            })
            if (foundPrice) {
                //existing price found, update it
                if (!compareObjects(individualPrice,foundPrice)){
                    //the same
                    console.log("Both prices are the same, no changes will be made")
                    //@ts-ignore
                    currentPrices.splice(i,1)
                } else {
                    console.log("This price will be updated")
                    await makeChanges(currentPaddleProduct,currentPrices,existingProduct)
                }
            } else {
                //price does not yet exist
                console.log(`There is no existing price called ${foundPrice.name} in the product: ${currentPaddleProduct.name}, so a new one will be made`)
            }
            i++
        }

        


        

    }
    console.log("Done")  
    return
}

async function makeChanges(currentPaddleProduct:PaddleProduct,currentPrices:any,existingProduct:any){
    await new Promise((resolve,reject)=>{
        rl.question(colour(["FgBlack","BgWhite","Bright"],`Confirm the above changes to the  ${currentPaddleProduct.name} product (y/n)`)+" ",async (answer)=>{
            if (answer == "y"||answer == "Y"){
                for (let individualPrice of currentPrices?currentPrices:[]){
                    let foundPrice = existingProduct.prices.find((price:any)=>{
                        //console.log(JSON.stringify(price,null,4))
                        return (price.name == individualPrice.name)&& (price.status != "archived")
                    })
                    if (foundPrice) { 
                        //existing price found, update it
                        delete individualPrice.productId
                        //@ts-ignore
                        await updatePrice(foundPrice.id,individualPrice)
                        console.log(colour(["FgGreen"],`Updated the price: ${individualPrice.name} for the product: ${currentPaddleProduct.name}`))
                    } else {
                        individualPrice.productId = existingProduct.id
                        //@ts-ignore
                        await createPrice(individualPrice)
                        console.log(colour(["FgGreen"],`Added the price: ${individualPrice.name} to the product: ${currentPaddleProduct.name}`))
                    }
                }

            } else {
                console.log(colour(["FgYellow"],"Changes to the product were not made (skipped)"))
            }
            resolve(1)
        })
    })
}

async function main() {
    let foundProducts: Product[] = await getAllProducts();
    try {
        let setupFile = fs.readFileSync(setupFileLocation)
        setupFile = JSON.parse(setupFile.toString())
        console.log(colour(["FgGreen"],"Setup file found"))
        try {
            await compare(setupFile,foundProducts)
        } catch (error) {
            console.log(colour(["BgRed","FgBlack","Bright"],"A critical error occurred. "+JSON.stringify(error,null,4)))
        }
        exit(0)
    } catch (error) {
        console.error(colour(["FgRed"],`Could not find the specified file, looking for ${setupFileLocation}, with error ${JSON.stringify(error)}`))
    }
}

async function data(){
    let saveFile = "["
    let allProducts = await getAllProducts()
    let product:any
    for (product of allProducts){
        product = await getProduct(product.id,{ include: ['prices'] })
        saveFile+=`${JSON.stringify(product,null,4)},\n`
        //console.log(colour(["FgMagenta","Bright"],`The ${product.name} product:`))
        //console.log(JSON.stringify(product,null,4))
    }
    //write data to file, removing trailing comma
    fs.writeFileSync(`prices-${argv[2]}.json`,saveFile.substring(0,saveFile.length-2)+"]")
    console.log(colour(["FgMagenta","Bright"],`Found and wrote ${allProducts.length} products to the file: prices-${argv[2]}.json`))
    exit(0)
}

if (process.argv[3] == "read"){
    console.log(colour(["BgMagenta","FgBlack"],"Finding all products and prices."));
    data();
} else {
    main()
}