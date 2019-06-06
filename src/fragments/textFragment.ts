import {TextStyle} from "../styles/textStyle";
import {Fragment} from "./fragment";

let zeroWidthSpace = "&#8203;";

export class TextFragment extends Fragment {
	element: HTMLElement;
	textStyle: TextStyle;
	text: string;
	constructor(textStyle: TextStyle, text: string) {
		super();
		this.textStyle = textStyle;
		this.text = text;
		this.element = this.create();
	}
	update(given?: HTMLElement, index?: number) {
		let element = given || this.element;

		element.style.fontFamily = this.textStyle.fontStyle;
		element.style.fontSize = this.textStyle.fontSize + "pt";
		element.style.fontWeight = this.textStyle.fontWeight;
		element.innerHTML = index !== undefined ? this.text.substring(0, index) : (this.text.length ? this.text : zeroWidthSpace);
	}
	create(index?: number): HTMLElement {
		let element = document.createElement("span");
		element.className = "text-fragment";
		this.update(element, index);
		return element;
	}
	split(index: number): TextFragment {
		let fragment = new TextFragment(this.textStyle, this.text.substring(index));

		this.text = this.text.substring(0, index);
		return fragment;
	}
	render() {
		return this.element;
	}
	measurePositionOnIndex(index: number): {x: number, y: number, h: number} {
		let backupElement = this.element,
			meterElement = document.createElement("span");

		if (index === 0) {
			meterElement.innerText = zeroWidthSpace;
		}
		this.element.innerHTML = "";
		this.element.appendChild(document.createTextNode(this.text.substring(0, index)));
		this.element.appendChild(meterElement);
		this.element.appendChild(document.createTextNode(this.text.substring(index)));

		let x = meterElement.getBoundingClientRect().left;
		let y = meterElement.getBoundingClientRect().top;
		let h = meterElement.getBoundingClientRect().height;

		this.element.removeChild(meterElement);

		return {
			x,
			y,
			h
		}

	}
	refresh() {
		this.update();
	}
}