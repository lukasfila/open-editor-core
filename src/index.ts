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
	let fragments = [];
	let fragment = new TextFragment(textStyle, "Hello ");
	fragments.push(fragment);
	let boldTextStyle = new TextStyle();
	boldTextStyle.fontWeight = "600";
	fragment = new TextFragment(boldTextStyle, "World eqwio jeqwiojeqwoi jeqowi jeoqwi jeqow jeoqiw jeqowi jeoqw jeoiqwj eoiqw joieqw joeiqw joiewqjoieqw oeqwj oeiqwjoeiq wjoiewq");
	fragments.push(fragment);
	textStyle = new TextStyle();
	fragment = new TextFragment(textStyle, "!");
	fragments.push(fragment);
	textStyle = new TextStyle();
	let paragraph = new Paragraph(paragraphStyle, fragments);
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
