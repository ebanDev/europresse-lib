import {DOMParser, fetch, Node} from "../deps.ts";

type AuthData = {
    domain: string;
    cookieJar: string;
};  

export async function search(authData: AuthData, query: string, searchIn = "fullText", dateRange = "allTime", lang = ["Anglais", "Français"], sources = []): Promise<Array<{title: string, source: string, date: string, description: string, id: string}>> {
    const searchPageReq = await fetch(authData.cookieJar, `https://${authData.domain}/Search/Reading`);

    const searchPageDom = new DOMParser().parseFromString(await searchPageReq.text(), "text/html")!;
    let requestVerificationToken = searchPageDom.querySelector("input[name=__RequestVerificationToken]")?.getAttribute("value")!;

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
    if (sources.length > 0) {
        params.append("SourcesForm", "1");
        sources.forEach((source, index) => {
            params.append(`CriteriaExp[${index}].CriteriaId`, source);
            params.append(`CriteriaExp[${index}].OperatorId`, "2");
        });
    } else {
        params.append("SourcesForm", "2");
        if (lang.length > 0) {
            lang.forEach((language, index) => {
                params.append(`CriteriaExp[${index}].CriteriaName`, language);
                params.append(`CriteriaExp[${index}].CriteriaId`, language === "Anglais" ? "2" : "1");
                params.append(`CriteriaExp[${index}].OperatorId`, "2");
            });
        }
    }
    
    params.append("__RequestVerificationToken", requestVerificationToken);

    await fetch(authData.cookieJar, `https://${authData.domain}/Search/AdvancedMobile`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params
    });

    const searchResultsReq = await fetch(authData.cookieJar, `https://${authData.domain}/Search/GetPage?pageNo=0&docPerPage=50`);
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
