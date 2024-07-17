import { PortalGenerator, PortalPacket } from "@kade-net/portals-parser";
import {PortalParams} from "./types";
import { HomePortalPlugin } from "./plugins";
import { register } from "module";
function registerPortalPages(args: PortalParams)
{
    return new PortalGenerator<PortalParams>(args.id ? args: {
        ...args,
        id: 'home'
    })
    .registerPlugin(HomePortalPlugin.init());
}
export async function generatePortalModel(args: PortalParams) {
    return registerPortalPages(args.id ? args : {
        ...args,
        id: 'home'
    })
        .serialize()
}

export async function renderView(args: PortalParams) {
    return registerPortalPages(args.id ? args : {
        ...args,
        id: 'home'
    })
        .render()
}

export async function getNextPortal(args: any, packet: PortalPacket) {
    return registerPortalPages(args.id ? args : {
        ...args,
        id: 'home'
    })
        .next(args, packet)
}