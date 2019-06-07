import { Editor } from "./editor";
import { CursorPosition } from "./meter";
import {Fragment} from "../fragments/fragment";
import {Paragraph} from "../page/paragraph";
import {Area} from "../page/area";
import {Page} from "../page/page";


export class Cursor {
	editor: Editor;
	element: HTMLElement;
	page: number = 0;
	area: number = 0;
	paragraph: number = 0;
	fragment: number = 0;
	index: number = 5;
	constructor(editor: Editor) {
		this.editor = editor;
		this.element = document.createElement("div");
		this.element.className = "cursor animate";
		this.element.style.display = "none";
		this.editor.parentElement.appendChild(this.element);
	}
	setPosition(position: {left: number, top: number, height: number}|null) {
		if (!position) {
			return;
		}
		this.element.style.top = position.top + "px";
		this.element.style.left = position.left + "px";
		this.element.style.height = position.height + "px";
		this.element.style.display = "block";
	}

	move(direction: Direction) {
		let paragraph = this.getParagraph();
		let cursor = this.editor.cursor,
			backup = cursor.clone(),
			meter = this.editor.meter,
			position = meter.getCursorPosition(),
			newPosition: CursorPosition,
			lastPosition = position,
			nextLine: CursorPosition,
			found = false;

		switch (direction) {
		case Direction.Left:
			this.index--;
			if (this.index < 0) {
				if (this.fragment === 0 && this.paragraph > 0) {
					this.paragraph--;
					this.fragment = this.getParagraph().fragments.length - 1;
					this.index = this.getFragment().getLastIndex();
	
				} else if (this.fragment > 0) {
					this.fragment--;
					this.index = this.getFragment().text.length - 1;
				}
			}
				break;
		case Direction.Right:
			this.index++;
			if (this.index > this.getFragment().text.length) {
				if (this.fragment === paragraph.fragments.length - 1 && this.paragraph < this.getArea().paragraphs.length - 1) {
					this.paragraph++
					this.fragment = 0;
					this.index = 0;
				} else if (this.fragment < paragraph.fragments.length - 1) {
					this.fragment++;
					this.index = 1;	
				}
			}
			break;
		case Direction.Down:
			while (!found) {
				this.move(Direction.Right);
				newPosition = meter.getCursorPosition();
				if (lastPosition.top > position.top) {
					nextLine = lastPosition;
					if (lastPosition.left >= position.left) {
						if (Math.abs(position.left - lastPosition.left) < Math.abs(position.left - newPosition.left)) {
							this.move(Direction.Left);
						}
						found = true;
					}
					if (newPosition.top > nextLine.top) {
						this.move(Direction.Left);
						found = true;
					}
				}
				found = found || cursor.isEndPosition();
				lastPosition = newPosition;
			}
			break;
		case Direction.Up:
			while (!found) {
				this.move(Direction.Left);
				newPosition = meter.getCursorPosition();
				if (lastPosition.top < position.top && lastPosition.left <= position.left) {
					if (Math.abs(position.left - lastPosition.left) < Math.abs(position.left - newPosition.left)) {
						this.move(Direction.Right);
					}
					found = true;
				}
				found = found || cursor.isStartPosition();
				lastPosition = newPosition;
			}
			break;
		}
		this.index = Math.max(this.index, 0);
		this.index = Math.min(this.index, this.getFragment().text.length);
	}

	getPage(): Page {
		return this.editor.pages[this.page];
	}
	
	getArea(): Area {
		return this.getPage().areas[this.area];
	}

	getParagraph(): Paragraph {
		return this.getArea().paragraphs[this.paragraph];
	}

	getFragment(): Fragment {
		return this.getParagraph().fragments[this.fragment];
	}

	isStartPosition(): boolean {
		return this.index === 0 && this.page === 0 && this.area === 0 && this.paragraph ===0 && this.fragment === 0;
	}

	isEndPosition(): boolean {
		let editor = this.editor,
			page = this.getPage(),
			area = this.getArea(),
			paragraph = this.getParagraph(),
			fragment = this.getFragment();

		return this.index === fragment.getLastIndex() 
			&& this.page === editor.pages.length - 1 
			&& this.area === page.areas.length - 1 
			&& this.paragraph === area.paragraphs.length - 1 
			&& this.fragment === paragraph.fragments.length - 1;
	}

	clone(): Cursor {
		let cursor = new Cursor(this.editor);

		cursor.page = this.page;
		cursor.area = this.area;
		cursor.paragraph = this.paragraph;
		cursor.fragment = this.fragment;
		cursor.index = this.index;
		return cursor;
	}

}

export enum Direction {
	No = 0,
	Left = -1,
	Right = 1,
	Up = 2,
	Down = -2
}