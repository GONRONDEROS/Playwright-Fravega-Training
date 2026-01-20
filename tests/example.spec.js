// @ts-check
import { test, expect } from '@playwright/test';
import { ADDRGETNETWORKPARAMS } from 'node:dns';

/**
 * @type {import("playwright-core").Page}
 */
let page;

test.beforeAll(async({browser})=>{
  const context = await browser.newContext();
  page = await context.newPage();

});

test('Verify placing and order', async () => {
  await page.goto("https://www.fravega.com/");
  await Promise.all([
    page.locator("ul.dXuxpr > li.erbUBo > div.cbwmbG > a > span.brTaXr:has-text('Celulares')").click(),
    page.waitForURL("**/celulares/**")
  ]);
  await Promise.all([
    page.locator("div.cgAxxT > label.kcAyqR:has-text('Samsung')").click(),
    page.waitForURL("**/?marcas=samsung")  
  ]);
  const checkboxCuotas = await page.locator("div.cFwhSX:has(div.fsNAZr:has-text('Cuotas sin interés')) a.hTZzZP > label.jIkFVx");
  await Promise.all([
    checkboxCuotas.click(),
    page.waitForURL(/formas-de-pago=12-cuotas-sin-interes/)
  ]);
  expect(await checkboxCuotas.isChecked()).toBeTruthy();
  const checkboxApple = await page.locator("[id*='brand-filter-checkbox-apple-Apple']");
  await Promise.all([
    checkboxApple.click(),
    page.waitForURL(/apple/)
  ]);
  const orderButton = await page.locator("button.bVvgMq");
  await orderButton.click();
  await Promise.all([
    page.locator("a.jVZMfP:has-text('Mayor descuento')").click(),
    page.waitForURL(/HIGHEST_DISCOUNT/)
  ]);
  const selectableArticles = await page.locator("ul.peNi > li > article.bwMsmt");
  await expect(selectableArticles.first()).toBeVisible();
  const articleToSelect = await page.locator(".kUaLHc").first();
  const nameOfArticleToSelect = await articleToSelect.textContent();
  console.log("El producto a seleccionar es: " + nameOfArticleToSelect);
  await Promise.all([
    articleToSelect.click(),
    page.waitForURL(/p/)
  ]);
  const selectedArticle = await page.locator("h1[data-test-id='product-title']").first().textContent();
  console.log("El producto seleccionado es: " + selectedArticle);
  if(selectedArticle?.trim() === nameOfArticleToSelect?.trim()){
    await page.getByRole('button', { name: 'Agregar al carrito' }).first().click();
    //await page.pause()
  };
  await page.waitForSelector(".Toastify__toast-body", { state: "visible" });
  const nombreAGuardar = await page.locator("div.Toastify__toast-body > div > div.iGnvSC > div.llUDMb > p").first().textContent(); 
  console.log("El producto en el pre carro es: " + nombreAGuardar);
  const esteBotonDelCarrito = await page.locator("div.Toastify__toast-body >> text=Ver carrito");
  await expect(esteBotonDelCarrito).toBeVisible();
  await Promise.all([
    esteBotonDelCarrito.click(),
    page.waitForURL("**/chk-ui-headless")
  ]);   
  await page.waitForSelector("div.bqsZAS");
  const elementsInCart = await page.locator("div.bqsZAS").count();
  console.log("La cantidad de elementos en el carrito es: " + elementsInCart);
  for(let i = 0; i < elementsInCart; i++){
    let elementInCartDescription = await page.locator("div.CEnZU").nth(i).textContent();
    let elementCurated = elementInCartDescription?.trim()
    console.log(elementCurated);
    if(elementCurated === selectedArticle){
      await page.locator("#endPurchaseCart").click();
      break;
    }
  }
});

