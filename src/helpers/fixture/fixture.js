import { test as base } from '@playwright/test';
import { App } from '../../pages/appPage';

export const test = base.extend({
	webApp: async ({ page }, use) => {
		const app = new App(page);
		await use(app);
	},
});
