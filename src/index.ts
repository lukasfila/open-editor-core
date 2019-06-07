import {Page} from "./page/page";
import {Paragraph} from "./page/paragraph";
import {ParagraphStyle} from "./styles/paragraphStyle";
import {TextStyle} from "./styles/textStyle";
import {Area} from "./page/area";
import {TextFragment} from "./fragments/textFragment";
import {Editor} from "./core/editor";
import { Fragment } from "./fragments/fragment";
import { ImageFragment } from "./fragments/imageFragment";

// Conditions of Use

// Dear User,

// Messe Berlin will provide you with free internet access, subject to the following Conditions of Use: 

// 1. Contractual partner under the terms of § 598 ff BGB
// The agreement concerning use of internet access is concluded between Messe Berlin GmbH, Messedamm 22, 14055 Berlin (referred to hereinafter as the “Operator“) and the respective User.

// 2. Subject matter
// The following conditions regulate the utilization by the User of the internet access provided by the Operator. Use of the internet access is made available to the User solely in a wireless form.

// 3. Implementation of the agreement
// The agreement between the Operator and the User comes into effect through acceptance of these Conditions of Use by the User on the portal page, and may be terminated by either party at any time without notice.

// 4. Services to be provided by the Operator/Prerequisites for use
// The following section provides more details about such aspects as the transfer rate and prerequisites for use, as well as data protection, data security and limitations of liability.

// 4.1. Transfer rate
// Subject to technical availability the User will be offered internet access via a WLAN installed on the Operator’s premises. However, no specific transfer rates will be guaranteed because such rates are dependent on the number of registered users and the respective, current data transfer volume.

// 4.2. Prerequisites for use
// The User requires a terminal with a WLAN interface with DHCP client configuration. An internet browser, supporting the http protocol, is used to sign in.

// 4.3. Data protection 
// The terminal’s MAC address is required in order to obtain internet access. This is stored for a maximum of seven days, together with the duration of the connection, the data volume and the IP address that has been assigned to the device.

// 4.4. Data security / Limitation of liability
// The Operator draws attention to the fact that data from the terminal can be transferred unencrypted to the WLAN access point and that third parties may be able to intercept the transferred/local data. Users themselves are responsible for the security of their own data and must take suitable precautions, which shall be their own responsibility. The Operator only bears responsibility in accordance with Item 7 of these conditions. 

// 5. Obligations and liability of the User/Exemption/Blocking
// The User bears sole responsibility for content retrieved or made available via the internet access. The Operator will not carry out checks of the content. Improper use of the hotspot is prohibited. In particular the following provisions apply:

// 1.	The internet access may not be used to transmit any information containing illegal or indecent content. This includes in particular any information within the meaning of §§ 130, 130a and 131 StGB that promotes incitement to hatred, encourages criminal acts, glorifies or downplays violence, is sexually offensive, pornographic within the meaníng of § 184 StGB, presents a serious moral danger to children or young people, is detrimental to their welfare, or harms the reputation of the Operator. Also included is content that infringes other statutory regulations or the rights of third parties, and in particular copyrights, design rights, labelling rights, personal rights, competition law or data protection rights. The provisions of the Youth Media Protection State Agreement and the Law for the Protection of Young Persons must be complied with.

// 2.	The User may not undertake any activities that lead or could lead to interference/changes to the physical or logical structure of the Operator’s network.

// 3.	When making use of the internet access the User is not permitted to carry out any of the following activities:
// a)	The unsolicited dispatch of news or information for advertising purposes (spamming).
// b)	Unauthorized access to information and data belonging to third parties.
// c)	Unauthorized intrusion in the data networks of others.
// d)	Passing on log-in data to third persons.
// e)	Use of the internet access outside the reserved period.

// The User shall be liable for infringements of the obligations stated in Items 1 to 3. The User shall exempt the Operator from all third party claims arising from unlawful use of the internet access and associated services by the user or which take place with his approval, in particular in cases referred to in Item 3 a – e. If the User becomes aware that such an infringement has occurred or threatens to occur, he shall be obliged to inform the Operator immediately. The User’s liability (including the obligation to grant exemption) shall be excluded if he is not responsible for the breach of duty. This does not affect the obligation to inform the operator of a breach of duty.
// In the event of a breach of the duties referred to in Items 1 to 3 the Operator shall be entitled to block access to the internet if the User does not desist from committing the breach of duty despite being called upon to do so. A prior demand before access is blocked is not required if the breach of duty by the User is wilful. The Operator is also entitled to block access in cases where unlawful content is transmitted via the User’s hardware even if the User is not responsible for the transmission, if the block is necessary in order to prevent further contravention of the law.

// 7. The Operator’s liability
// Liability on the part of Messe Berlin in cases of simple negligence is excluded, provided that no substantial contractual obligations have been infringed. Substantial contractual obligations consist of those duties, the fulfilment of which enables the agreement to be duly implemented, and observance of which the contractual partner regularly relies and may rely on.
// In cases of infringement of contractual obligations the liability of Messe Berlin for damages in cases of simple negligence is limited to average, immediate damages that are predictable and typical of the contract, according to the type of agreement.. 
// The Operator shall not be liable for damage arising from measures that he has authorized in order to maintain safety and good order. If, as a result of an erroneous assessment of risks, internet access is restricted or blocked, the Operator shall not be liable for cases of simple negligence. 
// If liability in accordance with the provisions of these conditions of use is excluded or limited, the same shall also apply to the subcontractors and/or vicarious agents of Messe Berlin. The Operator and the User shall be liable for any culpability on the part of their subcontractors, without any possibility for exemption from liability due to fault in selection (culpa in eligendo). 
// The above exemptions from liability and limitations to liability do not apply in the event of culpable loss of life, bodily injury or damage to the health of persons, or to express warranties of quality.

// 8. Changes to the Conditions of Use
// The Operator reserves the right to alter these Conditions of Use in order to deal with future eventualities. In such cases the Operator will include a reference in this document. The User gives an undertaking to keep regularly informed about the current version of the Conditions of Use. If the User disagrees with the changes, he must cease use immediately. 

// 9. Concluding provisions
// The place of performance for all claims arising out of this agreement is Berlin. The law of the Federal Republic of Germany shall apply. 
// If the customer is an entrepreneur or does not have a domestic place of general jurisdiction in the Federal Republic of Germany, for all disputes arising from this agreement or in connection with this agreement, it shall be agreed that Berlin shall be the place of jurisdiction. 
// Should individual clauses of these General Contractual Conditions be or become invalid, this shall not affect the validity of the remaining provisions of the agreement. In such cases the invalid regulation shall be supplemented or amended in such a way as to achieve its intended purpose. 
// Should a dispute arise between the User and the Operator as to whether the Operator has fulfilled his contractual and/or legal obligations to the User, in cases subject to § 47a TKG the latter may initiate an arbitration procedure with the Federal Network Agency. For this purpose the Federal Network Agency website at www.bundesnetzagentur.de provides extensive information and the appropriate application form under the heading Telekommunikation Verbraucher / Schlichtungsverfahren (Telecommunications Consumers / Arbitration Procedures.

function writeParagraph(text: string, ts: TextStyle) {
	let ps = new ParagraphStyle(),
		paragraph = new Paragraph(ps, []),
		fragment = new TextFragment(ts, text);


		paragraph.fragments.push(fragment);
		return paragraph;
}

function writeImage(textStyle: TextStyle, src: string, width: number, height: number) {
	let ps = new ParagraphStyle(),
		paragraph = new Paragraph(ps, []),
		fragment = new ImageFragment(textStyle, src, width, height);

	paragraph.fragments.push(fragment);
	return paragraph;
}

let textStyleNormal = new TextStyle(),
	textStyleHeading = new TextStyle(),
	textStyleBold = new TextStyle();

textStyleNormal.fontSize = "11";
textStyleBold.fontWeight = "600";
textStyleBold.fontSize = "14";
textStyleHeading.fontWeight = "600";
textStyleHeading.fontSize = "20";

function run() {
	let area = new Area([]);

	area.paragraphs.push(writeParagraph("Conditions of Use", textStyleHeading));
	area.paragraphs.push(writeParagraph("Dear User,", textStyleNormal));
	area.paragraphs.push(writeParagraph("Messe Berlin will provide you with free internet access, subject to the following Conditions of Use: ", textStyleNormal));
	area.paragraphs.push(writeParagraph("1. Contractual partner under the terms of § 598 ff BGB", textStyleBold));
	area.paragraphs.push(writeParagraph("The agreement concerning use of internet access is concluded between Messe Berlin GmbH, Messedamm 22, 14055 Berlin (referred to hereinafter as the “Operator“) and the respective User.", textStyleNormal));
	area.paragraphs.push(writeParagraph("2. Subject matter", textStyleBold));
	area.paragraphs.push(writeImage(textStyleNormal, "../demo/image.jpg", 180, 320));
	area.paragraphs.push(writeParagraph("The following conditions regulate the utilization by the User of the internet access provided by the Operator. Use of the internet access is made available to the User solely in a wireless form.", textStyleNormal));
	area.paragraphs.push(writeParagraph("3. Implementation of the agreement", textStyleBold));
	area.paragraphs.push(writeParagraph("The agreement between the Operator and the User comes into effect through acceptance of these Conditions of Use by the User on the portal page, and may be terminated by either party at any time without notice.", textStyleNormal));
	area.paragraphs.push(writeParagraph("4. Services to be provided by the Operator/Prerequisites for use", textStyleBold));
	area.paragraphs.push(writeParagraph("The following section provides more details about such aspects as the transfer rate and prerequisites for use, as well as data protection, data security and limitations of liability.", textStyleNormal));
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
