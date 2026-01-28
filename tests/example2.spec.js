//// @ts-check
import { test, expect } from '@playwright/test';
const {POManager} = require('../pageobjects/POManager');
const dataset = JSON.parse(JSON.stringify(require('../utils/mainMenuCategoriesOptions.json')));
const {APIProducts} = require('../utils/APIProducts');

/**
 * @type {import("playwright-core").Page}
 */


for(const data of dataset){
test(`Verify placing and order - "${data.generalCategory}", "${data.orderByOption[0].label}", "${data.toogleOption[0].label}"`, async ({browser}) => {
  const context = await browser.newContext(
    {
      permissions : ['geolocation']
    }
  );
  const page = await context.newPage();
  const poManager = new POManager(page);
  const mainMenuBar = poManager.getMainMenuBar();
  const productPage = poManager.getProductPage();

  await page.goto("https://www.fravega.com/");
  await productPage.getRidOfDirectionModal();
  //Seleccion de Categoria en el Dropdown del Menu Principal
  await mainMenuBar.hoverCategoryMenu();
  await mainMenuBar.selectGeneralCategory(data.generalCategory);
  await mainMenuBar.selectAndNavigateToSpecificCategoty(data.specificCategory);
  expect(page.url()).toContain(data.specificCategory.toLowerCase());
  //Seleccion de Ordenamiento de Productos
  for(const option of data.orderByOption){
    await productPage.selectOrderOption(option.label, option.value);
    expect(page.url()).toContain(option.value.toUpperCase());
  };
  //Seleccion de filtros de productos
  for(const option of data.toogleOption){
    await productPage.toogleOption(option.label, option.value);
    expect(page.url()).toContain(option.value);
  };
  //Verificacion de Ordenamiento de Productos
  for(const option of data.orderByOption){
  if(option.label === "Menor precio")
    {
    const isCheaperFirst = await productPage.theCheaperIsTheFirst();
    expect(isCheaperFirst).toBe(true);
    console.log("Se ordenaron los productos en base al metodo "+option.label)
    } 
    else if (option.label === "Mayor precio")
    {
    const isExpensiveFirst = await productPage.theExpensiveIsTheFirst();
    expect(isExpensiveFirst).toBe(true);
    console.log("Se ordenaron los productos en base al metodo "+option.label)
    }
    else
    {
    const biggestDiscountFirst = await productPage.theHighestDiscountIsTheFirst()
    expect(biggestDiscountFirst).toBe(true);
    console.log("Se ordenaron los productos en base al metodo "+option.label)
    }
  }
  //Seleccionamos al azar in producto de la pagina
  const nameOfArticleSelected = (await productPage.clickTheRandomProduct()).trim();
  console.log("El producto seleccionado es: " + nameOfArticleSelected);
  await page.waitForURL(/p/);
  expect(await productPage.verifySelectedArticleEqualsToArticleToBuy(nameOfArticleSelected)).toBeTruthy();
  await productPage.addProductToCart();
  await productPage.proceedToCartPage();
  await page.waitForURL("**/chk-ui-headless");
  await page.waitForSelector("div.bqsZAS");
  const elementsInCart = await page.locator("div.bqsZAS").count();
  console.log("La cantidad de elementos en el carrito es: " + elementsInCart);
  for(let i = 0; i < elementsInCart; i++){
    let elementInCartDescription = await page.locator("div.CEnZU").nth(i).textContent();
    let elementCurated = elementInCartDescription?.trim()
    if(elementCurated === nameOfArticleSelected){
      await page.locator("#endPurchaseCart").click();
      break;
    }
  }
});
}

/**
 * @type {Array<{id: string, title: string, listPrice: number|null, salePrice: number|null, discount: number|null}>}
 */ 
for(const data of dataset){
test('Comparar productos API vs UI', async ({ browser }) => {
  //Obtener datos de la API
  const apiClient = new APIProducts();
  const apiProducts = await apiClient.listProducts();
  //Navegar a la página y obtener datos de la UI
  const context = await browser.newContext(
    {
      permissions : ['geolocation']
    }
  );
  const page = await context.newPage();
  const poManager = new POManager(page);
  const productPage = poManager.getProductPage();
  await page.goto("https://www.fravega.com/l/celulares/celulares-liberados/");
  await page.waitForSelector("ul.peNi > li > article.bwMsmt");
  const uiNameAndPrice = await productPage.getProductsWithNameAndPrice(); // [{ name, price }]
  //const uiDiscounts = await productPage.getProductsWithDiscount(); // [{ name, discount }]
  //Comparaciones //
  // Comparar títulos
  const apiTitles = apiProducts.map(p => p.title.trim());
  const uiTitles = uiNameAndPrice.map(p => p.name.trim());
  console.log("Esto son los nombres de la UI")
  console.log(uiTitles);
  console.log("Esto son los nombres de la API")
  console.log(apiTitles)
  //await page.pause()
  expect(uiTitles).toEqual(await expect.arrayContaining(apiTitles));
  // Comparar precios de venta
  const apiSalePrices = apiProducts.map(p => p.salePrice);
  const uiSalePrices = uiNameAndPrice.map(p => p.price);
  console.log("Esto son los precios de la UI")
  console.log(apiSalePrices);
  console.log("Esto son los precios de la API")
  console.log(uiSalePrices)
  expect(uiSalePrices).toEqual(await expect.arrayContaining(apiSalePrices));
});
}



