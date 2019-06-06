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
					//todo use place caret by mouse event after its ready
					break;
				//down
				case 40:
					//todo use place caret by mouse event after its ready
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
			fragment = this.getCursorFragment(),
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
			fragment = this.getCursorFragment(),
			paragraphIndex = cursor.paragraph,
			area = this.getCursorArea(),
			previousParagraph = area.paragraphs[paragraphIndex - 1],
			paragraph = this.getCursorParagraph();

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
			this.refreshCursor();
		}
	}

	write(character: string) {
		let cursor = this.cursor,
			fragment = this.getCursorFragment();

		if (fragment instanceof TextFragment) {
			fragment.text = fragment.text.substring(0, cursor.index) + character + fragment.text.substring(cursor.index);
			fragment.update();
			this.moveCursor(Direction.Right);
			this.refreshCursor();
		}
	}

	moveCursor(direction: Direction) {
		let cursor = this.cursor,
			paragraph = this.getCursorParagraph(),
			fragment = this.getCursorFragment(),
			fragments = paragraph.fragments;

		switch (direction) {
		case Direction.Left:
			cursor.index--;
			break;
		case Direction.Right:
			cursor.index++;
			break;
		}
		if (cursor.index < 0) {
			if (cursor.fragment === 0 && cursor.paragraph > 0) {
				cursor.paragraph--;
				cursor.fragment = this.getCursorParagraph().fragments.length - 1;
				cursor.index = this.getCursorFragment().getLastIndex();

			} else if (cursor.fragment > 0) {
				cursor.fragment--;
				cursor.index = this.getCursorFragment().text.length - 1;
			}
		}
		if (cursor.index > this.getCursorFragment().text.length) {
			if (cursor.fragment === paragraph.fragments.length - 1 && cursor.paragraph < this.getCursorArea().paragraphs.length - 1) {
				cursor.paragraph++
				cursor.fragment = 0;
				cursor.index = 0;
			} else if (cursor.fragment < paragraph.fragments.length - 1) {
				cursor.fragment++;
				cursor.index = 1;	
			}
		}
		this.cursor.index = Math.max(this.cursor.index, 0);
		this.cursor.index = Math.min(this.cursor.index, this.getCursorFragment().text.length);

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

enum Direction {
	No = 0,
	Left = -1,
	Right = 1
}