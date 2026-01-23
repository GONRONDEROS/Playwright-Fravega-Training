class ProductPage{
    constructor(page){
        this.page = page;
        this.orderByMenuButton = page.locator(".fJusGh > .bVvgMq");
        

    }

    async selectOrderOption(label, value){
        await this.orderByMenuButton.click();
        await this.page.locator(`a.sc-7cadb928-0:has-text("${label}")`).click();
    }

    async toogleOption(label, value){
        await this.page.locator(`div.cFwhSX:has(div.fsNAZr:has-text("${label}")) a.hTZzZP > label.jIkFVx`).click();
    }

}
module.exports = {ProductPage}



// { "label": "Mayor precio",
//   "value": "HIGHEST" },
// { "label": "Mayor descuento",
//   "value": "DISCOUNT" }