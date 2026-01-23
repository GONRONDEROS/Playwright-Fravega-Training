class MainMenuBar{
    constructor(page){
        this.page = page;
        this.categoriesMenu = page.locator(".ebfYGX");
        this.categories = page.locator(".eWrgLC");
    }

    async hoverCategoryMenu(){
        await this.categoriesMenu.hover();
    }

    async selectGeneralCategory(generalCategory){
        await this.page.locator(`.gmuqsC:has-text("${generalCategory}")`).hover();
    }

    async selectAndNavigateToSpecificCategoty(specificCategory){
        await this.page.locator(`div.fMtTFn > a > a:has-text("${specificCategory}")`).click();
        await this.page.waitForURL(`**/${specificCategory.toLowerCase()}/**`);
    }
}
module.exports = {MainMenuBar}