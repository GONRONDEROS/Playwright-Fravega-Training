// @ts-check
import { test, expect } from '@playwright/test';

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
  await page.locator("ul.dXuxpr > li.erbUBo > div.cbwmbG > a > span.brTaXr:has-text('Celulares')").click();
  await page.locator("div.cgAxxT > label.kcAyqR:has-text('Samsung')").click();
  await page.waitForURL("https://www.fravega.com/l/celulares/celulares-liberados/?marcas=samsung");
  const checkboxCuotas = await page.locator("div.cFwhSX:has(div.fsNAZr:has-text('Cuotas sin interés')) a.hTZzZP > label.jIkFVx");
  await checkboxCuotas.click();
  expect(await checkboxCuotas.isChecked()).toBeTruthy();
  const checkboxApple = await page.locator("[id*='brand-filter-checkbox-apple-Apple']");
  await checkboxApple.click();
  await page.waitForURL(/apple/);
  await page.locator("button.bVvgMq").click();
  await page.locator("a.jVZMfP:has-text('Mayor descuento')").click();
  await page.waitForURL(/HIGHEST_DISCOUNT/);
  //await page.locator("ul.ebdNvu > li.kgGNyw").last().click();
  await page.locator("ul.peNi").click();
  const cartElement = await page.locator("h1[data-test-id='product-title']").first().textContent();
  await page.getByRole('button', { name: 'Agregar al carrito' }).first().click();
  await page.locator("button.user-cart-btn").click();
  const cartElementToBuy = await page.locator("div.dPZWkG").first().textContent();
  await expect(cartElement?.trim()).toBe(cartElementToBuy?.trim());
  const elementsInCart = await page.locator("div.dMnKzX").count();
  console.log(elementsInCart);
  await page.pause();
  for(let i = 0; i < elementsInCart; i++){
    if(await page.locator("div.CEnZU").nth(i).textContent() === cartElementToBuy){
      await page.locator("#endPurchaseCart").click();
      break;
    }
  }
  
  await page.pause();
});

