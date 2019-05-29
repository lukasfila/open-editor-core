import {Paragraph} from "./paragraph";

export class Area {
	element: HTMLElement;
	paragraphs: Paragraph[];
	constructor(paragraphs: Paragraph[]) {
		this.element = document.createElement("div");
		this.element.className = "area";

		this.paragraphs = paragraphs;
	}
	render(parentElement: HTMLElement) {
		parentElement.appendChild(this.element);
		let paragraphs: Paragraph[] = this.paragraphs;

		for (let i = 0; i < paragraphs.length; i++) {
			paragraphs[i].render();
			this.element.appendChild(paragraphs[i].element);
		}
	}
	joinParagraphs(paragraph: Paragraph, paragraphToJoin: Paragraph) {
		paragraph.join(paragraphToJoin);
		this.paragraphs.slice(this.paragraphs.indexOf(paragraph), 1);
		paragraphToJoin.element.remove();

		this.refresh();
	}
	refresh() {
		let paragraphs = this.paragraphs;

		for (let i = 0; i < paragraphs.length; i++) {
			paragraphs[i].refresh();
		}
	}
}