import {Editor} from "./editor";

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

	getCursorPosition(): {left: number, top: number, height: number}|null {
		let cursor = this.editor.cursor,
			fragment = this.editor.getCursorFragment(),
			bounding = fragment.element.getClientRects();

		this.meter.innerHTML = "";

		this.meter.appendChild(fragment.create(cursor.index));
		let width = this.meter.offsetWidth;

		for (let i = 0; i < bounding.length; i++) {
			if (bounding[i].width >= width) {
				return {
					left: bounding[i].left + width,
					top: bounding[i].top,
					height: bounding[i].height
				}
			}
			width -= bounding[i].width;
		}
		debugger;
		return null;
	}
}