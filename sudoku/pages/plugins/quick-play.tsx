import { PortalDefinition, PortalPacket, PortalPlugin } from "@kade-net/portals-parser";
import { PortalParams } from "../types";
import { SudokuResponse, SudokuGrid } from "../types";
import { generateURL } from "../utils";
import { JSX } from "react";
import { generateBoard } from "../utils";
import db from "@/db";
import { zero } from "effect/Duration";
import { collectAll } from "effect/Sink";
export class QuickPlayPlugin extends PortalPlugin<PortalParams, any> {
    async generateAsync(args: PortalParams): Promise<PortalDefinition> {
        return Promise.resolve({
            id: this.id,
            title: "Quick Play",
            description: "Play a random game of Sudoku",
            image: generateURL({
                params: { id: "quick_play" },
                is_image: true
            }),
            aspect_ratio: '1,1',
            input: 'Enter the mode of difficulty you want to play.',
            buttons: [
                {
                    title: 'Back',
                    target: generateURL({
                        params: {
                            id: 'quick_play',
                            button: '1'
                        }
                    }),
                    index: 1,
                    type: 'post'
                },
                {
                    title: 'Play Now!',
                    target: generateURL({
                        params: {
                            id: 'quick_play',
                            button: '2'
                        }
                    }),
                    index: 2,
                    type: 'post'
                }
            ]


        })
    }
    async getNext<CurrentParams = Record<string, any>>(params: CurrentParams, packet: PortalPacket): Promise<Record<string, string> & { id: string; }> {
        const { button } = params as unknown as { button: `${number}` }
        if (button === '1') {
            return Promise.resolve({
                id: 'home'
            })

        }
        if (button === '2') {
            const levels: { [key: string]: 'easy' | 'medium' | 'hard' } = {
                '1': 'easy',
                '2': 'medium',
                '3': 'hard'
            };

            const difficulty = packet.input_text;
            if (difficulty in levels) {
                // const game = await generateBoard(levels[difficulty]);
                const game = [[1, 0, 5, 0, 0, 7, 9, 8, 6], [0, 0, 9, 0, 0, 6, 0, 0, 0], [7, 0, 4, 0, 5, 0, 2, 0, 3], [0, 5, 0, 0, 0, 0, 7, 3, 0], [0, 0, 8, 0, 0, 3, 1, 2, 0], [0, 2, 0, 4, 0, 9, 6, 5, 8], [6, 0, 2, 8, 1, 0, 5, 9, 0], [0, 0, 0, 7, 0, 0, 0, 0, 0], [5, 9, 7, 0, 3, 2, 8, 4, 0]];
                //Used to mark original array
                const zeroAdded = game.map((row, rowIndex) => row.map((col, colIndex) => col === 0 ? 0 : Number(`${col}${0}`)));
                console.log(zeroAdded);
                return Promise.resolve({
                    id: 'choose_position',
                    sudoku: JSON.stringify(zeroAdded),

                });
            } else {
                // const response = await fetch('https://sudoku-api.vercel.app/api/dosuku');
                // const data: SudokuGrid = await response.json();
                return Promise.resolve({
                    id: 'quick_play',
                })
            }
        }
        return Promise.resolve({
            id: 'home'
        })

    }
    async prepareProps(args: PortalParams): Promise<any> {
        return Promise.resolve({})

    }
    generateView(props: any): JSX.Element {
        return (
            <div tw="flex flex-1 flex-col w-full h-full items-center p-5">
                <div tw="flex flex-col w-full items-center">
                    <h1 tw="text-2xl font-bold">Quick Play</h1>
                    <p tw="mt-2">Play a random game of Sudoku</p>
                </div>
                <div tw="flex text-lg flex-col w-full items-center mt-5">
                    Enter the mode of difficulty you want to play.
                </div>
                <ul tw="text-xl">
                    <li>1. Easy 👍 </li>
                    <li>2. Medium ✌️</li>
                    <li>3. Hard💪</li>
                </ul>
                <div tw="flex flex-col text-md pb-2">
                    <h4 tw="pb-2">
                        Some tips for solving Sudoku:
                    </h4>
                    <span tw="pb-2">Avoid trial and error – find a logical reason for entering each number.</span>
                    <span tw="pb-2">Look for rows, columns and 3×3 boxes with just a few blanks remaining.</span>
                    <span tw="pb-2">Try adding numbers which already appear often in the Sudoku puzzle.</span>
                    <span tw="pb-2">After entering a number, check to see where else it has to go.</span>
                </div>
                <div tw="text-lg">Have fun🥳🧩🧩</div>
            </div>
        )


    }
    static init() {
        return new QuickPlayPlugin("quick_play");
    }

}