export class MainPage {
	constructor(page) {
		this.page = page;
        this.paginationButton = page.getByRole('link', { name: '50' });
        this.imageProductItem = page.locator('#ec_product_image_effect_4281370').getByRole('link');
        this.selectOptionsButton = page.locator('#ec_product_image_3981370').getByRole('link', { name: 'Select Options' });
        this.loginForPricingButton = page.getByRole('link', { name: 'Login for Pricing' });
		this.bugPopup = page.locator('#bug-popup');
		this.bugOverlay = page.locator('.academy-bug-overlay');
		this.crashBugOverlay = page.locator('html');
		this.firstBugOverlay = page.locator('#popmake-4406');
	}
	async open() {
		await this.page.goto('.');
		await this.page.reload();
	}
    async clickNextPaginationPage() {
		await this.paginationButton.click();
	}
	async clickImageProduct() {
		await this.imageProductItem.click();
	}
    async gotoSelectOptions() {
		await this.selectOptionsButton.click();
	}
    async gotoLoginForPricing() {
		await this.loginForPricingButton.click();
	}
}
