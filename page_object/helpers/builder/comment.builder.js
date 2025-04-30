import { faker } from '@faker-js/faker';


export class CommentBuilder {
	addComment() {
		this.commentInput = faker.lorem.paragraphs(2);
		return this;
	}
	addName() {
		this.nameInput = faker.person.firstName();
		return this;
	}
	addEmail() {
		this.emailInput = faker.internet.email();
		return this;
	}
    addWebsite() {
		this.websiteInput = faker.internet.domainName();
		return this;
	}
	generateCommentData() {
		return {
            comment: this.commentInput,
            name: this.nameInput,
            email: this.emailInput,
            website: this.websiteInput,
		};
	}
}
