export class AccountPage {
	constructor(page) {
		this.page = page;
        this.accountSignInButton = page.getByRole('button', { name: 'SIGN IN' });
        this.accountPasswordLabel = page.getByText('Password*');
        this.accountSubheader = page.getByText('Не зарегистрированы? Нажмите кнопку ниже');
	}
    async clickAccountSignInButton() {
		await this.accountSignInButton.click();
	}
    async clickAccountPasswordLabel() {
		await this.accountPasswordLabel.click();
	}
    async clickAccountSubheader() {
		await this.accountSubheader.click();
	}
}
