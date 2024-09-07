import {DOMParser, fetch} from "../deps.ts";

type AuthData = {
  domain: string;
  cookieJar: string;
};

export async function article(authData: AuthData, id: string, outputType: string) {

    const articleReq = await fetch(authData.cookieJar, `https://${authData.domain}/Document/ViewMobile?docKey=${encodeURI(id)}&fromBasket=false&viewEvent=1&invoiceCode=`);

    const articleDom = new DOMParser().parseFromString(await articleReq.text(), "text/html")!;

    const articleContentRaw = articleDom.querySelector(".docOcurrContainer")?.innerHTML;

    let articleHtml = articleContentRaw?.replace(/<mark>/g, "").replace(/<\/mark>/g, "");
    const articleTitle = articleDom.querySelector(".titreArticleVisu")?.textContent;
    articleHtml = `<h1>${articleTitle}</h1>${articleHtml}`;

    if (outputType === "html") {
        return articleHtml;
    }
}