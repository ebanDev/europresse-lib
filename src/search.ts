import { JSDOM, Element, fetch } from "../deps.ts";

export async function search(cookieJar: string, query: string): Promise<Array<{title: string, source: string, date: string, description: string, id: string}>> {
    const searchPageReq = await fetch(cookieJar, "https://nouveau.europresse.com/Search/Reading");

    const searchPageDom = new JSDOM(await searchPageReq.text());
    const requestVerificationToken = searchPageDom.window.document.querySelector("input[name=__RequestVerificationToken]")?.getAttribute("value")!;

    const params = new URLSearchParams
    params.append("PostedFilters.FiltersIDs", "8000");
    params.append("PostedFilters.FiltersIDs", "8001");
    params.append("PostedFilters.FiltersIDs", "8002");
    params.append("PostedFilters.FiltersIDs", "403");
    params.append("PostedFilters.FiltersIDs", "5355");
    params.append("Keywords", query);
    params.append("DateFilter.DateRange", "4");
    params.append("CriteriaSet", "0");
    params.append("SearchType", "Mobile");
    params.append("DateFilter.DateStart", new Date(new Date().setFullYear(new Date().getFullYear() - 10)).toISOString().slice(0, 10));
    params.append("DateFilter.DateStop", new Date().toISOString().slice(0, 10));
    params.append("__RequestVerificationToken", requestVerificationToken);

    await fetch(cookieJar, "https://nouveau.europresse.com/Search/Reading", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params
    });

    const searchResultsReq = await fetch(cookieJar, "https://nouveau.europresse.com/Search/GetPage?pageNo=0&docPerPage=50");

    const searchResultsDom = new JSDOM(await searchResultsReq.text());

    const searchResults = searchResultsDom.window.document.querySelectorAll(".docOcurrContainer");

    return searchResults.map((item: Element) => {
        const title = item.querySelector(".docList-links")?.textContent;
        const source = item.querySelector(".source-name")?.textContent;
        const date = item.querySelector(".details")?.textContent.split("•")[0].trim();
        const description = item.querySelector(".kwicResult.clearfix")?.textContent.split('\n').slice(9).join('\n');
        const id = item.querySelector("input#doc-name")?.getAttribute("value");

        return {title, source, date, description, id};
    });
}