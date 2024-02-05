import {DOMParser, fetch, Node} from "../deps.ts";

export async function search(cookieJar: string, query: string): Promise<Array<{title: string, source: string, date: string, description: string, id: string}>> {
    const searchPageReq = await fetch(cookieJar, "https://nouveau.europresse.com/Search/Reading");

    const searchPageDom = new DOMParser().parseFromString(await searchPageReq.text(), "text/html")!;
    const requestVerificationToken = searchPageDom.querySelector("input[name=__RequestVerificationToken]")?.getAttribute("value")!;


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

    const searchResultsDom = new DOMParser().parseFromString(await searchResultsReq.text(), "text/html")!;

    const searchResults = searchResultsDom.querySelectorAll(".docListItem")!;


    return Array.from(searchResults).map((item: Node) => {
        // @ts-ignore: deno-dom is not returning the correct type for querySelectorAll see https://github.com/b-fuze/deno-dom/issues/4
        const title = item.querySelector(".docList-links")?.textContent;
        // @ts-ignore: deno-dom is not returning the correct type for querySelectorAll see https://github.com/b-fuze/deno-dom/issues/4
        const source = item.querySelector(".source-name")?.textContent;
        // @ts-ignore: deno-dom is not returning the correct type for querySelectorAll see https://github.com/b-fuze/deno-dom/issues/4
        const date = item.querySelector(".details")?.textContent.split("•")[0].trim();
        // @ts-ignore: deno-dom is not returning the correct type for querySelectorAll see https://github.com/b-fuze/deno-dom/issues/4
        const description = item.querySelector(".kwicResult.clearfix")?.textContent.split('\n').slice(9).join('\n');
        // @ts-ignore: deno-dom is not returning the correct type for querySelectorAll see https://github.com/b-fuze/deno-dom/issues/4
        const id = item.querySelector("input#doc-name")?.getAttribute("value");

        return {title, source, date, description, id};
    });
}