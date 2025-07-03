import { Product} from '@paddle/paddle-node-sdk';
import * as fs from 'fs';
import {colour} from "./colour"
import * as readline from 'readline';
import { exit } from 'process';
import { allowedCustomProperties, archivePrice, archiveProduct, createPrice, createProduct, getAllProducts, getCurrencyCountries, getProduct, PaddleBillingCycle, PaddleOverridePrice, PaddlePrice, PaddleProduct, PaddleUnitPrice, StrictPaddleProduct, updatePrice, updateProduct } from "./extraPaddle"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const setupFileLocation = "pricing.json"

async function compare(template:any,real:any){
    try{
    //two arrays of products (hopefully)
    //check if there is an equivalent product for each product in the template
    let currentProducts: string[] = []
    let issue:boolean = false
    //real.forEach(async (realProduct: any) => {
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
    }//);
    if (issue){
        console.log(colour(["BgRed","FgWhite"],"Could not commence updating of the prices.  Please address the issue(s) above"))
        throw new Error
    }
    //at this point, template file should contain only unique products
    //await template.forEach(async (templateProduct: any)=>{
    for (let templateProduct of template){
        if (currentProducts.includes(templateProduct.name)){
            

        } else {
            //create new product
            let newProd = new StrictPaddleProduct(templateProduct.name)
            delete newProd.prices
            await createProduct(newProd)
            console.log(colour(["FgGreen"],`Created a new product: ${templateProduct.name}`))

            //need to update the real object, as it is now out of date
            real = await getAllProducts();
        }

        //update (in bulk?)
        //first check which exist already, to log to user
        //get the complete product (with prices!)
        


        let existingProduct = real.find((element:any)=>{
            return element.name == templateProduct.name
        })
        existingProduct = await getProduct(existingProduct.id,{ include: ['prices'] })
        

        let archive = false
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
            if (price.status != "archived"&&(archive||!(templateProduct.prices.find((element:PaddlePrice)=>{
                return element.name == price.name
            })))){
                if (!archive){
                    //display a little message to explain
                    console.log(colour(["FgYellow"],`Archived 1 price from the product ${existingProduct.name}, because it did not match any prices in the template`))
                }
                await archivePrice(price.id)
                count+=1
            }   
        }
        if (archive){
            console.log(colour(["FgRed","Bright"],`Archived ${count} prices from the product ${existingProduct.name}`))
        }
        

        //deal with some of the other properties (if any)

        //existing product found, now iterate through prices
        //each country needs it's own price, unless it uses the base USD price.  Groups of countries can be set as well
        //handle each price specified
        let currentPaddleProduct:PaddleProduct = new PaddleProduct(templateProduct.name)

        templateProduct.prices.forEach((templatePrice:any)=>{
            
            let priceArray: Array<[string, number]> = Object.entries(templatePrice.amounts);
            //create the object for easier management
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

            
            let currentPrice = new PaddlePrice(templatePrice.name,basePrice,currentBillingCycle)
            priceArray.forEach((priceGroup)=>{
                if (priceGroup[0]!=basePrice.currencyCode){
                    let relevantCountries = getCurrencyCountries(priceGroup[0])
                    // @ts-ignore
                    let currencyPrice = new PaddleUnitPrice((priceGroup[1]*100).toString(),priceGroup[0])
                    let overridePrice = new PaddleOverridePrice(currencyPrice,relevantCountries)
                    //add the override price to the complete price object
                    currentPrice.unitPriceOverrides.push(overridePrice)
                }
            })

            //deal with name and internal name
            currentPrice.description = templatePrice.label
            //prices need to be sent seperately, but are included for now
            let customData:any = Object.entries(templatePrice)
            customData = customData.filter((pair:any)=>{
                return allowedCustomProperties.includes(pair[0])
            })

            let customDataObject:any = {}

            customData.forEach((pair:any) => {
                customDataObject[pair[0]] = `${pair[1]}`
            });

            currentPrice.customData = customDataObject

            currentPaddleProduct.prices?.push(currentPrice)

        })
        //product should be done?!?
        //now remove prices

        let currentPrices = currentPaddleProduct.prices
        delete currentPaddleProduct.prices
        await updateProduct(existingProduct.id,currentPaddleProduct)


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
                //console.log(JSON.stringify(individualPrice,null,4))
                
                //@ts-ignore
                await createPrice(individualPrice)
                console.log(colour(["FgGreen"],`Added the price: ${individualPrice.name} to the product: ${currentPaddleProduct.name}`))
            }
        }

    }
    console.log("Done")  
    return
    } catch (error) {
        console.log(JSON.stringify(error,null,4))
    }

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
    let allProducts = await getAllProducts()
    let product:any
    for (product of allProducts){
        product = await getProduct(product.id,{ include: ['prices'] })
        console.log(colour(["FgMagenta","Bright"],`The ${product.name} product:`))
        console.log(JSON.stringify(product,null,4))
    }
    console.log(colour(["FgMagenta","Bright"],`Found and displayed ${allProducts.length} products`))
    exit(0)
}

if (process.argv[2] == "find"){
    console.log(colour(["BgMagenta","FgBlack"],"Finding all products and prices."));
    data();
} else {
    main()
}