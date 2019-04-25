import {ParagraphStyle} from "../styles/paragraphStyle";
import {Fragment} from "../fragments/fragment";

export class Paragraph {
	element: HTMLElement;
	paragraphStyle: ParagraphStyle;
	fragments: Fragment[];
	constructor(paragraphStyle: ParagraphStyle, fragments: Fragment[]) {
		this.element = document.createElement("div");
		this.element.className = "paragraph";

		this.paragraphStyle = paragraphStyle;
		this.fragments = fragments;
	}
	render() {
		let fragments = this.fragments;

		for (let i = 0; i < fragments.length; i++) {
			fragments[i].render();
			this.element.appendChild(fragments[i].element);
		}
	}
	split(fragment: Fragment, index: number) {
		let paragraph = new Paragraph(this.paragraphStyle, []),
			fragments = this.fragments,
			iterFragment: Fragment,
			results: Fragment[][] = [[], []],
			arrayIndex = 0;

		for (let i = 0; i < fragments.length; i++) {
			iterFragment = fragments[i];
			if (iterFragment === iterFragment) {
				results[arrayIndex].push(iterFragment);
				iterFragment = iterFragment.split(index);
				arrayIndex++;
				results[arrayIndex].push(iterFragment);
			} else {
				results[arrayIndex].push(iterFragment);
			}
		}
		this.fragments = results[0];
		paragraph.fragments = results[1];
		paragraph.render();
		if (this.element.nextSibling) {
			this.element.parentElement && this.element.parentElement.insertBefore(paragraph.element, this.element.nextSibling);
		} else {
			this.element.parentElement && this.element.parentElement.appendChild(paragraph.element);
		}
		this.refresh();
		return paragraph;
	}
	refresh() {
		let fragments = this.fragments;

		for (let i = 0; i < fragments.length; i++) {
			fragments[i].refresh();
		}
	}
}