import {TextStyle} from "../styles/textStyle";
import {Fragment} from "./fragment";

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
		element.innerHTML = index !== undefined ? this.text.substring(0, index) : this.text;
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
	refresh() {
		this.update();
	}
}