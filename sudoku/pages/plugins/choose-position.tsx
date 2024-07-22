import { PortalDefinition, PortalGenerator, PortalPacket, PortalPlugin } from "@kade-net/portals-parser";
import { PortalParams } from "../types";
import { JSX } from "react";
import { generateURL } from "../utils";
import assert from "assert";
export class ChoosePositionPlugin extends PortalPlugin<PortalParams, any> {
    async generateAsync(args: PortalParams): Promise<PortalDefinition> {
        const { sudoku } = args;
        return Promise.resolve({
            id: this.id,
            title: "Choose Position",
            description: "Choose a position to play Sudoku",
            image: generateURL({
                params: { id: 'choose_position', sudoku: JSON.stringify(sudoku) },
            }),
            aspect_ratio: '1,1',
            input: 'Enter the position you want to play. eg a8 for the first row and first column',
            buttons: [
                {
                    title: 'Back',
                    target: generateURL({
                        params: {
                            id: 'choose_position',
                            button: '1',
                            sudoku: JSON.stringify(sudoku)
                        }
                    }),
                    index: 1,
                    type: 'post'
                },
                {
                    title: 'Play Now!',
                    target: generateURL({
                        params: {
                            id: 'choose_position',
                            button: '2',
                            sudoku: JSON.stringify(sudoku)
                        }
                    }),
                    index: 2,
                    type: 'post'
                }
            ]
        })
    }
generateView(props: any): JSX.Element{
    return (
        <div>
            
        </div>
    )

}
    async getNext<CurrentParams = Record<string, any>>(params: CurrentParams, packet: PortalPacket): Promise<Record<string, string> & { id: string; }> {
        const { button, sudoku } = params as unknown as { button: `${number}` , sudoku: string}
        if (button === '1') {
            return Promise.resolve({
                id: 'quick_play'
            })
        }
        if (button === '2') {
            const position: string = packet.input_text;
            assert(position.length === 2, 'Invalid position');
            assert(position[0] >= 'a' && position[0] <= 'i', 'Invalid row');
            assert(position[1] >= '1' && position[1] <= '9', 'Invalid column');
            return Promise.resolve({
                id: 'play',
                position: position,
                sudoku: sudoku
            })


        }
        return Promise.resolve({
            id: 'choose_position'
        })

    }
    async prepareProps(args: PortalParams): Promise<any> {
        return Promise.resolve({})
    }
    static init() {
        return new ChoosePositionPlugin('choose_position')
    }
}
