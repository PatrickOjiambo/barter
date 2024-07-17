import { aptos } from "@/contract/aptos";
import { BASE_HOST } from "@/contract/main";

interface generateURLArgs {
    params: Record<string, string>
    is_image?: boolean

}
export function generateURL(args: generateURLArgs) {
    const { params, is_image } = args
    const url = new URL(`${BASE_HOST}/sudoku` + (is_image ? '/image' : '/action'))

    for (const key in params) {
        url.searchParams.append(key, params[key])
    }
    return url.toString()

}