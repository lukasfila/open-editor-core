import {TextStyle} from "../styles/textStyle";
import {Fragment} from "./fragment";
import {TextFragment} from "./textFragment";

let zeroWidthSpace = "&#8203;";

export class ImageFragment extends Fragment {
    element: HTMLImageElement;
    textStyle: TextStyle;
    src: string;
    width: number;
    height: number;
	text: string = "*";
	constructor(textStyle: TextStyle, src: string, width: number, height: number) {
        super();
        this.textStyle = textStyle;
        this.src = src;
        this.width = width;
        this.height = height;
		this.element = this.create();
	}
	update(given?: HTMLImageElement) {
		let element = given || this.element;

        element.src = this.src;
        element.style.width = this.width + "px";
        element.style.height = this.height + "px";
	}
	create(): HTMLImageElement {
		let element = document.createElement("img");
		element.className = "image-fragment";
		this.update(element);
		return element;
	}
	split(index: number): Fragment[] {
        let fragment = new TextFragment(this.textStyle, "");

        return index === 0 ? [fragment, this] : [this, fragment];
	}
	render() {
		return this.element;
	}
	measurePositionOnIndex(index: number): {x: number, y: number, h: number} {
		return {
			x: index === 0 ? this.element.offsetLeft : this.element.offsetLeft + this.element.offsetWidth,
			y: this.element.offsetTop,
			h: this.element.offsetHeight
		}

	}
	refresh() {
		this.update();
	}
}