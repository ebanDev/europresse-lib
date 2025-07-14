import {DOMParser, fetch, Node} from "../deps.ts";

type AuthData = {
    domain: string;
    cookieJar: string;
};  

export async function fetchSources(authData: AuthData, query: string): Promise<Array<{title: string, id: string}>> {
  const sourcesPageReq = await fetch(authData.cookieJar, `https://${authData.domain}/Criteria/SourcesFilterMobile?term=${encodeURIComponent(query)}`);
  const sourcesPageDom = new DOMParser().parseFromString(await sourcesPageReq.text(), "text/html")!;
  
  const sources: Array<{title: string, id: string}> = [];
  
  sourcesPageDom.querySelectorAll("div").forEach((sourceNode: Node) => {
    let title = sourceNode.querySelector(".plainTxt")?.textContent || "";
    const id = sourceNode.querySelector("input")?.getAttribute("criteriaId") || "";
    
    // Reformat titles: move "Le" from end to beginning
    title = title.replace(/^(.+), Le(\s*\(.+\))?$/, "Le $1$2");
    
    sources.push({title, id});
  });
  
  return sources;
}
