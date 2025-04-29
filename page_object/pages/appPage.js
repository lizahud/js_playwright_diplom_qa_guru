import { MainPage, ProductPage, AccountPage} from './index';

export class App {
	constructor(page) {
		this.page = page;
		this.main = new MainPage(page);
		this.product = new ProductPage(page);
        this.account = new AccountPage(page);
	}
}
