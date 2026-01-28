const {MainMenuBar} = require('../pageobjects/MainMenuBar');
const {ProductPage} = require('../pageobjects/ProductPage');

class POManager{
    constructor(page){
        this.page = page;
        this.mainMenuBar = new MainMenuBar(this.page);
        this.productPage = new ProductPage(this.page);

        
    };

    getMainMenuBar(){
        return this.mainMenuBar;
    };

    getProductPage(){
        return this.productPage;
    }
}

module.exports = {POManager}