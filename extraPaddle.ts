import { CountryCode, CreatePriceRequestBody, CreateProductRequestBody, Environment, GetProductQueryParameters, LogLevel, Paddle, Price, Product, ProductCollection, TaxCategory, UpdatePriceRequestBody, UpdateProductRequestBody } from "@paddle/paddle-node-sdk";
import {colour} from "./colour"
import * as fs from 'fs';
import { exit } from "process";

export let paddleCountries:any

try {
    paddleCountries = JSON.parse(fs.readFileSync("paddleCountries.json").toString()).data
} catch (error) {
    console.log(colour(["BgRed","FgWhite"],"Could not open the file containing the list of country codes"))
}


export const euroZone = [
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
]

export function getCurrencyCountries(currency:string){
    let countries = []
    switch (currency) {
        case "EUR":
            euroZone.forEach((euroZoneCountry)=>{
                countries.push(euroZoneCountry);
            })
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
    countries = countries.map((countryName)=>{
        let foundPaddleCountry = paddleCountries.find((pCountry: { name: string; })=>{return pCountry.name == countryName})
        
        if (foundPaddleCountry){
            return foundPaddleCountry.code
        } else {
            console.log(colour(["BgYellow","FgBlack"],`Could not find the country code for ${countryName}.  Please check the country has been spelt correctly.\nThe country will be skipped, and the custom rule will not apply to this country only.`))
        }
    })
    //console.log(colour(["BgBlue","FgGreen","Dim"],countries))
    return countries
}

export class PaddlePrice{
    name:string
    description:string="Default description"
    unitPriceOverrides:PaddleOverridePrice[]=[]
    unitPrice:PaddleUnitPrice
    billingCycle:PaddleBillingCycle
    productId?:string=""
    customData?:any = null
    constructor(name:string,unitPrice:PaddleUnitPrice,billingCycle:PaddleBillingCycle){
        this.name = name
        this.unitPrice = unitPrice
        this.billingCycle = billingCycle
    }
}

export class PaddleBillingCycle{
    interval:any
    frequency:number
    constructor (interval:any,frequency:number){
        this.interval = interval
        this.frequency = frequency
    }
}

export class PaddleUnitPrice{
    amount:string
    currencyCode:any
    constructor(amount:string,currencyCode:CountryCode){
        this.amount = amount
        this.currencyCode = currencyCode
    }
}

export class PaddleOverridePrice{
    unitPrice:PaddleUnitPrice
    countryCodes:string[]
    constructor(price:PaddleUnitPrice,countries:CountryCode[]){
        this.unitPrice = price
        this.countryCodes = countries
    }
}

export class PaddleProduct {
    name:string;
    prices?:PaddlePrice[] = [];
    constructor(name:string,prices?:PaddlePrice[]){
        this.name = name
        
        if (prices){
            this.prices = prices
        }
    }
}

export class StrictPaddleProduct extends PaddleProduct{
    taxCategory:TaxCategory = "standard"
    constructor(name:string,prices?:PaddlePrice[]){
        super(name,prices)
    }
}
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

const targets = JSON.parse(fs.readFileSync("./targets.json").toString())

const apiKey = targets[process.argv[2]].apiKey
const sandbox = targets[process.argv[2]].sandbox

export const allowedCustomProperties:string[] = [
    "productLine",
    "mapTo",
    "display"
]

export const paddle = new Paddle(apiKey, sandbox?{environment: Environment.sandbox,logLevel: LogLevel.error}:{});


export async function getAllProducts(): Promise<Product[]> {
  const productCollection: ProductCollection = paddle.products.list()
  const allItems: Product[] = []

  try {
    for await (const product of productCollection) {
        allItems.push(product)
    }
    if (allItems.length === 0) {
        console.log('No products were found.')
    }
    return allItems
  } catch (e) {
    console.error('Error within getAllProducts():', e)
    throw e
  }
}

export async function getProduct(productId: string, queryParams?: GetProductQueryParameters): Promise<Product | undefined> {
    try {
        // Pass the product id get
        const product = await paddle.products.get(productId, queryParams)
        // Returns a product entity
        return product
    } catch (e) {
        // Handle Network/API errors
        console.log("network api error")
    }
}

export async function updateProduct(productId: string, requestBody: UpdateProductRequestBody) {
    try {
        // Pass the product id and request body with the attributes to update
        const product = await paddle.products.update(productId, requestBody)
        // Returns an updated product entity
        return product
    } catch (e) {
        console.log(JSON.stringify(e))
        // Handle Network/API errors
    }
}

export async function createPrice(requestBody: CreatePriceRequestBody): Promise<Price | undefined> {
    try {
        const price = await paddle.prices.create(requestBody)
        return price
        // Returns a price entity
    } catch (e) {
        console.error('Error creating price:', e)
        // Handle Network/API errors
        throw new Error
    }
}

export async function archivePrice(priceId: string): Promise<Price | undefined> {
    try {
        // Pass the price id to archive
        const price = await paddle.prices.archive(priceId)
        // Returns an archived price entity
        return price
    } catch (e) {
        // Handle Network/API errors
        console.error(`Error archiving price ${priceId}:`, e)
    }
}

export async function archiveProduct(productId: string): Promise<Product | undefined> {
    try {
        // Pass the product id archive
        const product = await paddle.products.archive(productId)
        // Returns an archived product entity
        return product
    } catch (e) {
        // Handle Network/API errors
        console.error(`Error archiving product ${productId}:`, e)
    }
}

export async function createProduct(requestBody: CreateProductRequestBody) {
    try {
        const product = await paddle.products.create(requestBody)
        // Returns a product entity
        return product
    } catch (e) {
        console.log(JSON.stringify(e,null,4))
    }
}

export async function updatePrice(priceId: string, requestBody: UpdatePriceRequestBody): Promise<Price | undefined> {
    try {
        // Pass the price id and request body with the attributes to update
        const price = await paddle.prices.update(priceId, requestBody)
        // Returns an updated price entity
        return price
    } catch (e) {
        console.error(`Error updating price ${priceId}:`, e)
        // Handle Network/API errors
    }
}