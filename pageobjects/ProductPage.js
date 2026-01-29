const { expect } = require("@playwright/test");

class ProductPage{
    constructor(page){
        this.page = page;
        this.orderByMenuButton = page.locator(".fJusGh > .bVvgMq");
        this.articleListed = page.locator(".bwMsmt");
        this.articlePrices = page.locator(".jWfKDq > .OZgQ");
        this.articlesDiscount = page.locator("span[data-test-id='discount-tag'].dlxdmf");
        this.titleLocator = page.locator(".kUaLHc"); // selector del título del producto
        this.priceLocator = page.locator(".OZgQ"); // selector del precio
        this.discountLocator = "span[data-test-id='discount-tag'].dlxdmf"; // selector del descuento }
        this.locationModalCloseButton = page.locator(".jWJPFh");
        this.selectableArticles = page.locator("ul.peNi > li > article.bwMsmt");
        this.selectedArticleTitleInProductPage = page.locator("h1[data-test-id='product-title']").first();
        this.cartButton = page.getByRole('button', { name: 'Agregar al carrito' }).first();
        this.productNameDisplayedInPreCart = page.locator("div.Toastify__toast-body > div > div.iGnvSC > div.llUDMb > p").first();
        this.botonDelPreCarro = page.locator("div.Toastify__toast-body >> text=Ver carrito");
        this.productInCartPage = page.locator(".bqsZAS");
        this.elementInCartDescription = page.locator("div.CEnZU");
        this.endPurchaseButton = page.locator("#endPurchaseCart");
        this.productNotAvailableWarningMessage = page.locator(".vWmG");

    }

    async selectOrderOption(label, value){
        await this.orderByMenuButton.click();
        await this.page.locator(`a.sc-7cadb928-0:has-text("${label}")`).click();
    }

    async toogleOption(label, value){
        await this.page.locator(`div.cFwhSX:has(div.fsNAZr:has-text("${label}")) a.hTZzZP > label.jIkFVx`).click();
    }

    async theCheaperIsTheFirst(){
        const numberOfListedArticles = await this.articleListed.count();
        for(let i=0;i<numberOfListedArticles-1;i++){
            const priceCurrent = await this.articlePrices.nth(i).textContent();
            const priceNext = await this.articlePrices.nth(i+1).textContent();
            const currentValue = parseFloat(priceCurrent.replace(/[^0-9]/g, ""));
            const nextValue = parseFloat(priceNext.replace(/[^0-9]/g, ""));
            if( currentValue > nextValue){
                return false
            }}
        return true
    }

    async theExpensiveIsTheFirst(){
        const numberOfListedArticles = await this.articleListed.count();
        for(let i=0;i<numberOfListedArticles-1;i++){
            const priceCurrent = await this.articlePrices.nth(i).textContent();
            const priceNext = await this.articlePrices.nth(i+1).textContent();
            const currentValue = parseFloat(priceCurrent.replace(/[^0-9]/g, ""));
            const nextValue = parseFloat(priceNext.replace(/[^0-9]/g, ""));
            if( currentValue < nextValue){
                return false
            }}
        return true
    }

    async theHighestDiscountIsTheFirst(){
        const numberOfListedArticles = await this.articlesDiscount.count();
        for(let i=0;i<numberOfListedArticles-1;i++){
            const discountCurrent = await this.articlesDiscount.nth(i).textContent();
            const discountNext = await this.articlesDiscount.nth(i+1).textContent();
            const currentDiscountValue = parseFloat(discountCurrent.replace(/[^0-9]/g, ""));
            const nextDiscountValue = parseFloat(discountNext.replace(/[^0-9]/g, ""));
            if(currentDiscountValue < nextDiscountValue){
                return false
            }}
        return true;
    }

    async getProductNames() {
        const count = await this.selectableArticles.count();
        const products = [];
        for (let i = 0; i < count; i++) {
            const title = await this.selectableArticles.nth(i).locator(this.titleLocator).innerText();
            products.push(title.trim());
            }
        return products;
    }

    async getProductsWithNameAndPrice(){
        await this.page.waitForSelector("ul.peNi > li > article.bwMsmt");
        const count = await this.titleLocator.count();
        console.log(count);
        const products = [];
        for (let i = 0; i < count; i++){
            const title = await this.titleLocator.nth(i).textContent();
            const priceText = await this.priceLocator.nth(i).textContent();
            const price = parseFloat(priceText.replace(/[^0-9]/g, ""));
            products.push({ name: title?.trim(), price });
            }
        console.log(products);
        return products;
    }
        
    async getProductsWithDiscount(){
        const count = await this.selectableArticles.count();
        const products = [];
        for (let i = 0; i < count; i++){
            const title = await this.selectableArticles.nth(i).locator(this.titleLocator).textContent();
            const discountText = await this.selectableArticles.nth(i).locator(await this.discountLocator).textContent();
            const discount = parseFloat(discountText.replace(/[^0-9]/g, ""));
            products.push({ name: title?.trim(), discount });
            }
        return products;
    }

    async getRidOfDirectionModal(){
        
        if(await this.locationModalCloseButton.isVisible()){
            await this.locationModalCloseButton.click();
        };
    }

    async provideARandomProduct(){
        await expect(this.selectableArticles.first()).toBeVisible();
        const uiName = await this.getProductNames(); // [name]
        const randomSelector = Math.floor(Math.random()* uiName.length);
        return uiName[randomSelector];
    }

    async clickTheRandomProduct(){
        const productName = await this.provideARandomProduct();
        await this.page.locator('.kUaLHc', {hasText : productName}).click();
        return productName;
    }

    async verifySelectedArticleEqualsToArticleToBuy(productName){
        const title = await this.selectedArticleTitleInProductPage.textContent();
        return title?.trim() === productName;
        }

    async addProductToCart(){
        await this.cartButton.click();
    }

    async proceedToCartPage(){
        await this.page.waitForSelector(".Toastify__toast-body", { state: "visible" });
        const nombreAGuardar = await this.productNameDisplayedInPreCart.textContent(); 
        console.log("El producto en el pre carro es: " + nombreAGuardar);
        await expect(this.botonDelPreCarro).toBeVisible();
        await this.botonDelPreCarro.click();   
    }

    async completeOrder(){
        const elementsInCart = await this.productInCartPage.count();
        for(let i = 0; i < elementsInCart; i++){
            let productNameInCart = await this.elementInCartDescription.nth(i).textContent(); 
            let elementCurated = productNameInCart?.trim();
            if(await this.productNotAvailableWarningMessage.isVisible()){
                console.log("El producto: " + elementCurated + "no esta disponible. La compra no puede ser finalizada");
            } else {
                await this.endPurchaseButton.click();
                console.log("Compra finalizada con exito");
                break;
            }
        }
    }

}

module.exports = {ProductPage}



// { "label": "Mayor precio",
//   "value": "HIGHEST" },
// { "label": "Mayor descuento",
//   "value": "DISCOUNT" }
// {   "label": "Menor precio",
//     "value": "LOWEST_SALE_PRICE" }

// TV y Audio
// TV por marca

// "generalCategory" : "Tecnología",
// "specificCategory": "Celulares",