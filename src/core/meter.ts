import {Editor} from "./editor";
import { Cursor } from "./cursor";

export class Meter {
	element: HTMLElement;
	meter: HTMLElement;
	editor: Editor;
	constructor(editor: Editor) {
		this.editor = editor;

		this.element = document.createElement("div");
		this.meter = document.createElement("span");
		this.meter.className = "meter";
		this.element.appendChild(this.meter);
		this.element.className = "meter";

		window.document.body.appendChild(this.element);
	}

	getCursorPosition(): CursorPosition|null {
		let cursor = this.editor.cursor,
			fragment = this.editor.getCursorFragment(),
			bounding = fragment.element.getClientRects();

		this.meter.innerHTML = "";

		this.meter.appendChild(fragment.create(cursor.index));
		let width = this.meter.offsetWidth;

		for (let i = 0; i < bounding.length; i++) {
			if (bounding[i].width >= width || i === bounding.length - 1) {
				return {
					left: bounding[i].left + width,
					top: bounding[i].top,
					height: bounding[i].height
				}
			}
			width -= bounding[i].width;
		}
		return {
			left: bounding[0].left,
			top: bounding[0].top,
			height: bounding[0].height
		};
	}

	setCursorIndexByFragmentPosition(left: number, top: number)  {
		console.log(left, top)
		let cursor = this.editor.cursor,
			fragment = this.editor.getCursorFragment(),
			bounding = fragment.element.getClientRects(),
			lastDifference = Number.MAX_VALUE,
			x: number;

		for (let i = 0; i < fragment.getLastIndex(); i++) {
			this.meter.innerHTML = "";
			this.meter.appendChild(fragment.create(cursor.index));
			x = this.meter.offsetWidth;
			if (x < left) {
				if (Math.abs(lastDifference) < Math.abs(x - left)) {
					cursor.index++;
				}
				return;
			}
			lastDifference = x - left;
			cursor.index--;
		}
	}
}

interface CursorPosition {
	left: number;
	top: number;
	height: number;
}