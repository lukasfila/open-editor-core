import {Page} from "./page/page";
import {Paragraph} from "./page/paragraph";
import {ParagraphStyle} from "./styles/paragraphStyle";
import {TextStyle} from "./styles/textStyle";
import {Area} from "./page/area";
import {TextFragment} from "./fragments/textFragment";
import {Editor} from "./core/editor";

function run() {
	let paragraphStyle = new ParagraphStyle();
	let textStyle = new TextStyle();
	let fragment = new TextFragment(textStyle, "Hello world!");
	let paragraph = new Paragraph(paragraphStyle, [fragment]);
	let area = new Area([paragraph]);
	let page = new Page([area]);


	let parentElement = document.querySelector("#editor") as HTMLElement;
	if (parentElement) {
		let editor = new Editor(parentElement, [page]);
		editor.render();
	}
}

window.addEventListener("load", () => {
	run();
});
