import {Page} from "../page/page";
import {Cursor, Direction} from "./cursor";
import {TextFragment} from "../fragments/textFragment";
import {Meter} from "./meter";

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
				//backspace
				case 8:
					this.deleteChar(Direction.Left);
					break;
				//delete
				case 46:
					this.deleteChar(Direction.No);
					break;
				//right
				case 39:
					this.moveCursor(Direction.Right);
					break;
				//left
				case 37:
					this.moveCursor(Direction.Left);
					break;
				//up
				case 38:
					this.moveCursor(Direction.Up);
					break;
				//down
				case 40:
					this.moveCursor(Direction.Down);
					break;
				default:
					console.log(event.keyCode);
					break;
			}
		});
		window.document.body.addEventListener("keypress", (event) => {
			let character = String.fromCharCode(event.charCode);

			this.write(character);
		});
	}

	deleteChar(direction: Direction) {
		let cursor = this.cursor,
			fragment = cursor.getFragment(),
			paragraph = cursor.paragraph;

		//nothing to delete left
		if (cursor.index + direction < 0 ) {
			if (paragraph > 0) {
				this.deleteParagraph(direction);
			}
			return;
		}
		//nothing to delete right
		if (cursor.index + direction === fragment.text.length ) {
			return;
		}
		if (fragment instanceof TextFragment) {
			fragment.text = fragment.text.substring(0, cursor.index + direction) + fragment.text.substring(cursor.index + direction + 1);
			fragment.update();
		}
		if (direction !== 0) {
			cursor.index += direction;
		}
		this.refreshCursor();
		
	}

	deleteParagraph(direction: Direction) {
		let cursor = this.cursor,
			fragment = cursor.getFragment(),
			paragraphIndex = cursor.paragraph,
			area = cursor.getArea(),
			previousParagraph = area.paragraphs[paragraphIndex - 1],
			paragraph = cursor.getParagraph();

		//update cursor
		cursor.paragraph = paragraphIndex - 1;
		cursor.fragment = 	previousParagraph.fragments.length - 1;
		cursor.index = previousParagraph.fragments[previousParagraph.fragments.length - 1].text.length;
		//join paragraphs
		area.joinParagraphs(previousParagraph, paragraph);
		this.refreshCursor();
	}

	writeEnter() {
		let cursor = this.cursor,
			fragment = cursor.getFragment(),
			paragraph = cursor.getParagraph(),
			area = cursor.getArea(),
			secondParagraph;

		if (fragment instanceof TextFragment) {
			secondParagraph = paragraph.split(fragment, cursor.index);
			area.paragraphs.splice(area.paragraphs.indexOf(paragraph) + 1, 0, secondParagraph);
			area.refresh();
			this.cursor.fragment = 0;
			this.cursor.index = 0;
			this.cursor.paragraph++;
			this.refreshCursor();
		}
	}

	write(character: string) {
		let cursor = this.cursor,
			fragment = cursor.getFragment();

		if (fragment instanceof TextFragment) {
			fragment.text = fragment.text.substring(0, cursor.index) + character + fragment.text.substring(cursor.index);
			fragment.update();
			this.moveCursor(Direction.Right);
			this.refreshCursor();
		}
	}

	moveCursor(direction: Direction) {
		this.cursor.move(direction);
		this.refreshCursor();
	}

	refreshCursor() {
		let position = this.meter.getCursorPosition();

		this.cursor.setPosition(position);
	}

	placeCaret(event: MouseEvent) {
		let pages = this.pages,
			cursor = this.cursor,
			target = event.target,
			foundElement: HTMLElement|null = null;

		this.pages.forEach((page, pageIndex) => {
			page.areas.forEach((area, areaIndex) => {
				area.paragraphs.forEach((paragraph, paragraphIndex) => {
					foundElement = paragraph.element === target ? paragraph.element : null;
					if (foundElement) {
						cursor.page = pageIndex;;
						cursor.area = areaIndex;
						cursor.paragraph = paragraphIndex;
						cursor.fragment = 0;
						cursor.index = 0;
						this.refreshCursor();
						return;
					}
					paragraph.fragments.forEach((fragment, fragmentIndex) => {
						foundElement = fragment.element === target ? fragment.element : null;
						if (foundElement) {
							cursor.page = pageIndex;
							cursor.area = areaIndex;
							cursor.paragraph = paragraphIndex;
							cursor.fragment = fragmentIndex;
							cursor.index = fragment.getLastIndex();
							this.meter.setCursorIndexByFragmentPosition(event.clientX, event.clientY);
							this.refreshCursor();
							return;
						}
					})
				});
			})
		});
	}
}
