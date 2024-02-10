import {DOMParser, fetch, Node} from "../deps.ts";

export async function search(cookieJar: string, query: string, searchIn = "fullText", dateRange = "allTime"): Promise<Array<{title: string, source: string, date: string, description: string, id: string}>> {
    const searchPageReq = await fetch(cookieJar, "https://nouveau.europresse.com/Search/Reading");

    const searchPageDom = new DOMParser().parseFromString(await searchPageReq.text(), "text/html")!;
    const requestVerificationToken = searchPageDom.querySelector("input[name=__RequestVerificationToken]")?.getAttribute("value")!;

    const params = new URLSearchParams
    if (searchIn === "fullText") {
        params.append("Keywords", query);
    } else {
        params.append("Keywords", "");
    }
    params.append("CriteriaKeys[0].Operator", "&");
    params.append("CriteriaKeys[0].Key", "TIT_HEAD");
    if (searchIn === "title") {
        params.append("CriteriaKeys[0].Text", query);
    } else {
        params.append("CriteriaKeys[0].Text", "");
    }
    params.append("CriteriaKeys[1].Operator", "&");
    params.append("CriteriaKeys[1].Key", "LEAD");
    params.append("CriteriaKeys[1].Text", "");
    params.append("CriteriaKeys[2].Operator", "&");
    params.append("CriteriaKeys[2].Key", "AUT_BY");
    params.append("CriteriaKeys[2].Text", "");
    params.append("sources", "2");
    params.append("CriteriaSet", "-1");
    params.append("sourcesFilter", "");
    params.append("PostedFilters.FiltersIDs", "8001");
    if (dateRange === "lastWeek") {
        params.append("DateFilter.DateRange", "3");
    } else if (dateRange === "lastMonth") {
        params.append("DateFilter.DateRange", "4");
    } else if (dateRange === "lastYear") {
        params.append("DateFilter.DateRange", "7");
    } else if (dateRange === "allTime") {
        params.append("DateFilter.DateRange", "9");
    }
    params.append("DateFilter.DateStart", new Date().toISOString().slice(0, 10));
    params.append("DateFilter.DateStop", new Date().toISOString().slice(0, 10));
    params.append("SourcesForm", "2");
    params.append("CriteriaExp[0].OperatorId", "2");
    params.append("CriteriaExp[0].CriteriaName", "Anglais");
    params.append("CriteriaExp[0].CriteriaId", "2");
    params.append("CriteriaExp[1].OperatorId", "2");
    params.append("CriteriaExp[1].CriteriaName", "Français");
    params.append("CriteriaExp[1].CriteriaId", "1");
    params.append("__RequestVerificationToken", requestVerificationToken);

    await fetch(cookieJar, "https://nouveau.europresse.com/Search/AdvancedMobile", {
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