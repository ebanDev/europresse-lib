import {getCookies} from "../deps.ts";

export async function login(username: string, password: string, provider: string, ent = "None") {
    if (provider === "ent") {
        return await getCookies(ent, username, password, "europresse");
    } else {
        throw new Error("Currently, the only supported provider is 'ent'.");
    }
}