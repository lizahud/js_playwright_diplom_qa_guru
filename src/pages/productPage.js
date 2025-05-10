export class ProductPage {
	constructor(page) {
		this.page = page;
        this.descriptionDetails = page.locator('#post-6190 form').getByText('Nam nec tellus a odio');
        this.orangColorButton = page.getByRole('img', { name: 'Orang' });
		this.yelowColorButton = page.getByRole('img', { name: 'Yelow' });
        this.orangColorText = page.getByText('Orang');
        this.commentInputField = page.getByRole('textbox', { name: 'Comment' });
        this.nameInputField = page.getByRole('textbox', { name: 'Name*' });
        this.emailInputField = page.getByRole('textbox', { name: 'Email*' });
        this.websiteInputField = page.getByRole('textbox', { name: 'Website' });
        this.postCommentButton = page.getByRole('button', { name: 'Post Comment' });
        this.manufacturerDetails = page.getByRole('link', { name: 'L4 Development' });
        this.xIcon = page.getByRole('link', { name: 'X', exact: true });
        this.selectCurrency = page.locator('#ec_currency_conversion');
        this.signInButton = page.getByRole('button', { name: 'SIGN IN' });
        this.filterBySmallPrice = page.getByRole('link', { name: '$15.00 - $19.99 (1)' });
	}
    async clickDescriptionDetails() {
		await this.descriptionDetails.click();
	}
	async chooseOrangProductColor() {
		await this.page.reload();
		await this.orangColorButton.click();
        await this.orangColorText.click();
	}
    async createComment(comment, name, email, website) {
		await this.commentInputField.click();
		await this.commentInputField.fill(comment);
		await this.nameInputField.click();
		await this.nameInputField.fill(name);
		await this.emailInputField.click();
		await this.emailInputField.fill(email);
		await this.websiteInputField.click();
		await this.websiteInputField.fill(website);
		await this.postCommentButton.click();
	}
    async clickManufacturerDetails() {
		await this.manufacturerDetails.click();
	}
    async clickXIcon() {
		await this.xIcon.click();
	}
    async selectEurCurrency() {
		await this.page.reload();
		await this.selectCurrency.selectOption('EUR');
	}
    async clickSignInButton() {
		await this.signInButton.click();
	}
    async clickFilterBySmallPrice() {
		await this.filterBySmallPrice.click();
	}
}
