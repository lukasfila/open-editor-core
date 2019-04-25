import {Editor} from "./editor";

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
}