import { PortalDefinition, PortalPacket, PortalPlugin } from "@kade-net/portals-parser";
import { PortalParams } from "../types";
import { SudokuResponse, SudokuGrid } from "../types";
import { generateURL } from "../utils";
import { JSX } from "react";
import { generateBoard } from "../utils";
import db from "@/db";
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
            input: 'Enter the mode of difficulty you want to play. eg 1 for easy, 2 for medium, 3 for hard',
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
                const game = await generateBoard(levels[difficulty]);
                return Promise.resolve({
                    id: 'play',
                    game: JSON.stringify(game)
                });
            } else {
                const response = await fetch('https://sudoku-api.vercel.app/api/dosuku');
                const data: SudokuGrid = await response.json();
                return {
                    id: 'status_message',
                    back: 'quick_play',
                    status_message: 'Invalid difficulty level',
                    status_message_type: 'error'
                }
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
                This is the page
            </div>
        )


    }
    static init() {
        return new QuickPlayPlugin("quick_play");
    }

}