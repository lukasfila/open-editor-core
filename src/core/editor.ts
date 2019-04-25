import {Page} from "../page/page";
import {Cursor} from "./cursor";
import {Fragment} from "../fragments/fragment";
import {TextFragment} from "../fragments/textFragment";
import {Meter} from "./meter";
import {Paragraph} from "../page/paragraph";
import {Area} from "../page/area";

export class Editor {
	parentElement: HTMLElement;
	pages: Page[];
	cursor: Cursor;
	meter: Meter = new Meter(this);
	constructor (parentElement: HTMLElement, pages: Page[]){
		this.parentElement = parentElement;
		this.cursor = new Cursor(this);
		this.pages = pages;
	}
	render() {
		let pages = this.pages;

		for (let i = 0; i < pages.length; i++) {
			pages[i].render(this.parentElement);
		}
		this.bind();
		this.refreshCursor();
	}
	bind() {
		this.parentElement.addEventListener("mousedown", (event) => {
			this.placeCaret(event);
		});
		window.document.body.addEventListener("keydown", (event) => {
			switch(event.keyCode) {
				case 13:
					this.writeEnter();
					event.preventDefault();
					break;
				default:
					break;
			}
		});
		window.document.body.addEventListener("keypress", (event) => {
			let character = String.fromCharCode(event.charCode);

			this.write(character);
		});
	}

	writeEnter() {
		let cursor = this.cursor,
			fragment = this.getCursorFragment(),
			paragraph = this.getCursorParagraph(),
			area = this.getCursorArea(),
			secondParagraph;

		if (fragment instanceof TextFragment) {
			secondParagraph = paragraph.split(fragment, cursor.index);
			area.paragraphs.splice(area.paragraphs.indexOf(paragraph) + 1, 0, secondParagraph);
			area.refresh();
			this.cursor.fragment = 0;
			this.cursor.index = 0;
			this.cursor.paragraph++;
			debugger;
			this.refreshCursor();
		}
	}

	write(character: string) {
		let cursor = this.cursor,
			fragment = this.getCursorFragment();

		if (fragment instanceof TextFragment) {
			fragment.text = fragment.text.substring(0, cursor.index) + character + fragment.text.substring(cursor.index);
			fragment.update();
			this.cursor.index++;
			this.refreshCursor();
		}
	}

	refreshCursor() {
		let position = this.meter.getCursorPosition();

		this.cursor.setPosition(position);
	}

	placeCaret(event: MouseEvent) {
	}

	getCursorArea(): Area {
		let cursor = this.cursor;

		return this.pages[cursor.page].areas[cursor.area];
	}

	getCursorParagraph(): Paragraph {
		let cursor = this.cursor;

		return this.getCursorArea().paragraphs[cursor.paragraph];
	}

	getCursorFragment(): Fragment {
		let cursor = this.cursor;

		return this.getCursorParagraph().fragments[cursor.fragment];
	}
}