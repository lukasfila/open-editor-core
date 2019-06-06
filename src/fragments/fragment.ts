export class Fragment {
	element: HTMLElement;
	text: string = "";
	constructor() {
		this.element = document.createElement("div");
	}
	create(index?: number): HTMLElement {
		throw "Do not call here.";
	}
	update(given: HTMLElement|undefined) {
		throw "Do not call here.";
	}
	split(index: number): Fragment {
		throw "Do not call here.";
	}
	render() {
		throw "Do not call here.";
	}
	refresh() {
		throw "Do not call here.";
	}
	getLastIndex() {
		return this.text.length - 1;
	}
}