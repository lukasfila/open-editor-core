import {ParagraphStyle} from "../styles/paragraphStyle";
import {Fragment} from "../fragments/fragment";

type CursorFragment = [number, number];

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
			splitted: Fragment,
			results: Fragment[][] = [[], []],
			arrayIndex = 0;

		for (let i = 0; i < fragments.length; i++) {
			iterFragment = fragments[i];
			if (iterFragment === fragment) {
				[splitted, iterFragment] = iterFragment.split(index);
				results[arrayIndex].push(splitted);
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
	splitFragment(fragment: Fragment, index: number) {
		let splitted: Fragment,
			created: Fragment;

		[splitted, created] = fragment.split(index);
		this.fragments.splice(this.fragments.indexOf(fragment), 1, splitted, created);
		this.renderFragment(index === 0 ? splitted : created);
		return index === 0 ? splitted : created;
	}

	join(paragraphToJoin: Paragraph) {
		let paragraph = new Paragraph(this.paragraphStyle, [...this.fragments, ...paragraphToJoin.fragments]);

		this.fragments = this.fragments.concat(paragraphToJoin.fragments);
	}
	refresh() {
		let fragments = this.fragments;

		for (let i = fragments.length - 1;i >= 0; i--) {
			fragments[i].refresh();
			if (!fragments[i].element.closest("body")) {
				if (i === fragments.length - 1) {
					this.element.appendChild(fragments[i].element);
				} else {
					this.element.insertBefore(fragments[i].element, fragments[i + 1].element);
				}
			}
		}
	}
	cleanFragments(cursorFragment: Fragment, cursorIndex: number): CursorFragment {
		let fragments = this.fragments,
			toDelete = [],
			fragment: Fragment;

		if (this.fragments.length === 1) {
			return [this.fragments.indexOf(cursorFragment), cursorIndex];
		}

		for (let i = 0; i < fragments.length; i++) {
			fragment = fragments[i];
			if (fragment.isEmpty()) {
				toDelete.push(fragment);
			} else {
				toDelete.push(null);
			}
		}
		for (let i = 0; i < fragments.length; i++) {
			if (toDelete[i]) {
				if (cursorFragment === toDelete[i]) {
					cursorFragment = i === 0 ? fragments[i + 1] : fragments[i - 1];
					cursorIndex = i === 0 ? 0 : fragments[i - 1].getLastIndex();
				}
				toDelete[i] = null;
				this.fragments.splice(i, 1);
				i--;
			}
		}
		return [this.fragments.indexOf(cursorFragment), cursorIndex];
	}
	renderFragment(fragment: Fragment)  {
		const index = this.fragments.indexOf(fragment);

		if (index === this.fragments.length - 1) {
			this.element.append(fragment.element);
		} else {
			this.element.insertBefore(fragment.element, this.fragments[index + 1].element);
		}
	};
}
