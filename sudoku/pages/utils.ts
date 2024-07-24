import { aptos } from "@/contract/aptos";
import { BASE_HOST } from "@/contract/main";
import { SudokuResponse, SudokuGrid } from "./types";
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
export const isURLImage = async (url: string) => {

    console.log("IMAGE URI::", url)
    try {

        const response = await fetch(url, {
            method: 'HEAD'
        })

        return response.headers.get('content-type')?.includes('image')
    }
    catch (e) {


        console.log("Unable to fetch image", e)

        return false

    }
}
export async function generateBoard(difficulty: 'easy' | 'medium' | 'hard'): Promise<SudokuGrid> {
    console.log("thi is the difficulty", difficulty);
    let grid;
    let count = 0;
    let fallback: SudokuGrid;

    console.log('We are doing something');
    const response = await fetch('https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:5){grids{value,solution,difficulty},results,message}}');
    console.log('We got a response', response);
    const data: SudokuResponse = await response.json();
    fallback = data.newboard.grids[0];
    grid = data.newboard.grids.find((grid) => grid.difficulty === difficulty);

    // while (grid === undefined && count < 1) {
    //     console.log('Entered the while loop');
    //     const response = await fetch('https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:5){grids{value,solution,difficulty},results,message}}');
    //     const data: SudokuResponse = await response.json();
    //     grid = data.newboard.grids.find((grid) => grid.difficulty === 'difficulty');
    //     count++;

    // }
    if (grid === undefined) {
        console.log('Maybe something happened');
        return fallback
    }
    return grid
}