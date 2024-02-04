import { fetch, JSDOM } from "../deps.ts";

export async function article(cookieJar: string, id: string, outputType: string) {
    const articleReq = await fetch(cookieJar, `https://nouveau.europresse.com/Document/ViewMobile?docKey=${encodeURI(id)}&fromBasket=false&viewEvent=1&invoiceCode=`);

    const articleDom = new JSDOM(await articleReq.text());

    const articleContentRaw = articleDom.window.document.querySelector(".docOcurrContainer")?.innerHTML;

    let articleHtml = articleContentRaw?.replace(/<mark>/g, "").replace(/<\/mark>/g, "");
    const articleTitle = articleDom.window.document.querySelector(".titreArticleVisu")?.textContent;
    articleHtml = `<h1>${articleTitle}</h1>${articleHtml}`;

    if (outputType === "html") {
        return articleHtml;
    }
}