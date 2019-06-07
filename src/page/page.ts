import {Area} from "./area";

export class Page {
	width: number = 480;
	height: number = 640;
	paddingTop: number = 60;
	paddingRight: number = 20;
	paddingLeft: number = 20;
	paddingBottom: number = 40;
	areas: Area[];
	constructor(areas: Area[]) {
		this.areas = areas;
	}
	render(parentElement: HTMLElement) {
		let element = document.createElement("div");
		element.className = "page";
		parentElement.appendChild(element);
		element.style.width = this.width + "px";
//		element.style.height = this.height + "px";
		element.style.paddingTop = this.paddingTop + "px";
		element.style.paddingRight = this.paddingRight + "px";
		element.style.paddingLeft = this.paddingLeft + "px";
		element.style.paddingBottom = this.paddingBottom + "px";

		for (let i = 0; i < this.areas.length; i++) {
			this.areas[i].render(element);
		}

		return element;
	}
}