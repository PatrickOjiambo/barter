import { BASE_HOST } from "@/contract/main"
import { getNextPortal } from "@/sudoku/pages"
import { PortalPacket } from "@kade-net/portals-parser"

function generateParamsObject(params: URLSearchParams) {
    const entries = Array.from(params.entries())
    return Object.fromEntries(entries)
}


export async function POST(req: Request) {
    const url = new URL(req.url)
    const params = generateParamsObject(new URLSearchParams(url.search))
    const body = (await req.json()) as PortalPacket

    const nextParams = await getNextPortal(params, body)

    const newURL = new URL(`${BASE_HOST}/sudoku`)
    newURL.search = new URLSearchParams(nextParams).toString()

    const headers = new Headers()
    headers.append('Location', newURL.toString())

    return new Response(null, {
        status: 302,
        headers
    })

}