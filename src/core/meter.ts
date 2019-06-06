import {Editor} from "./editor";

export class Meter {
	editor: Editor;
	constructor(editor: Editor) {
		this.editor = editor;
	}

	getCursorPosition(): CursorPosition|null {
		let cursor = this.editor.cursor,
			fragment = this.editor.getCursorFragment();

		let {x, y, h} = fragment.measurePositionOnIndex(cursor.index);

		return {
			left: x,
			top: y,
			height: h
		}
	}

	setCursorIndexByFragmentPosition(left: number, top: number)  {
		let cursor = this.editor.cursor,
			fragment = this.editor.getCursorFragment(),
			lastDifference = Number.MAX_VALUE;

		for (let i = 0; i < fragment.getLastIndex() + 1; i++) {
			let {x, y, h} = fragment.measurePositionOnIndex(cursor.index);
			if (y <= top && y + h > top) {
				if (x < left) {
					if (Math.abs(lastDifference) < Math.abs(x - left)) {
						cursor.index++;
					}
					return;
				}	
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