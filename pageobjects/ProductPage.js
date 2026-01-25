class ProductPage{
    constructor(page){
        this.page = page;
        this.orderByMenuButton = page.locator(".fJusGh > .bVvgMq");
        this.articleListed = page.locator(".bwMsmt");
        this.articlePrices = page.locator(".jWfKDq > .OZgQ");
        this.articlesDiscount = page.locator("span[data-test-id='discount-tag'].dlxdmf");
        //this.productsLocator = page.locator("ul.peNi > li > article.bwMsmt");
        this.titleLocator = page.locator(".kUaLHc"); // selector del título del producto
        this.priceLocator = page.locator(".OZgQ"); // selector del precio
        this.discountLocator = "span[data-test-id='discount-tag'].dlxdmf"; // selector del descuento }

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

    // 1️⃣ Método: obtener solo los precios con el nombre de cada producto
    async getProductPrices() {
        const count = await this.productsLocator.count();
        const products = [];
        for (let i = 0; i < count; i++) {
            const title = await this.productsLocator.nth(i).locator(this.titleLocator).textContent();
            const priceText = await this.productsLocator.nth(i).locator(this.priceLocator).textContent();
            const price = parseFloat(priceText.replace(/[^0-9]/g, ""));
            products.push({ title: title?.trim(), price });
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
        const count = await this.productsLocator.count();
        const products = [];
        for (let i = 0; i < count; i++){
            const title = await this.productsLocator.nth(i).locator(this.titleLocator).textContent();
            const discountText = await this.productsLocator.nth(i).locator(await this.discountLocator).textContent();
            const discount = parseFloat(discountText.replace(/[^0-9]/g, ""));
            products.push({ name: title?.trim(), discount });
            }
        return products;
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