import { PortalDefinition, PortalGenerator, PortalPacket, PortalPlugin } from "@kade-net/portals-parser";
import { PortalParams } from "../types";
import { generateURL } from "../utils";
import assert from "assert";
import { JSX } from "react";
export class FillPositionPlugin extends PortalPlugin<PortalParams, any> {
    async generateAsync(args: PortalParams): Promise<PortalDefinition> {
        const { position, sudoku } = args;
        return Promise.resolve({
            id: this.id,
            title: "Fill Position",
            description: "Fill a position in Sudoku",
            image: generateURL({
                params: { id: 'fill_position', position: position, sudoku: JSON.stringify(sudoku) },
                is_image: true,
            }),
            aspect_ratio: '1,1',
            input: 'Enter solution for the highlighted position',
            buttons: [
                {
                    title: 'Back',
                    target: generateURL({
                        params: {
                            id: 'fill_position',
                            button: '1',
                            position: position,
                            sudoku: JSON.stringify(sudoku)
                        }
                    }),
                    index: 1,
                    type: 'post'
                },
                {
                    title: 'Submit',
                    target: generateURL({
                        params: {
                            id: 'fill_position',
                            button: '2',
                            position: position,
                            sudoku: JSON.stringify(sudoku)
                        }
                    }),
                    index: 2,
                    type: 'post'
                }
            ]
        })
    }
    generateView(props: {
        sudoku: Array<Array<number>>
    }): JSX.Element {
        const { sudoku } = props;
        return (<div>sudoku</div>)
    }
    prepareProps(args: PortalParams): Promise<any> {
        const {sudoku} = args;
        return Promise.resolve({
            sudoku: sudoku
        })
    }
    async getNext<CurrentParams = Record<string, any>>(params: CurrentParams, packet: PortalPacket): Promise<Record<string, string> & { id: string; }> {
        const { button, position, sudoku } = params as unknown as { button: `${number}`, position: string, sudoku: Array<Array<number>> }
        if (button === '1') {
            return Promise.resolve({
                id: 'choose_position'
            })
        }
        if (button === '2') {
            const digit = packet.input_text;
            assert(parseInt(digit) > 0 && parseInt(digit) < 10, 'Invalid digit')

            const col_mapping: any = {
                a: 0,
                b: 1,
                c: 2,
                d: 3,
                e: 4,
                f: 5,
                g: 6,
                h: 7
            }
            const [row, col] = position.split('');
            const row_index = parseInt(row) - 1;
            const col_index = col_mapping[col];
            sudoku[row_index][col_index] = parseInt(digit);
            Promise.resolve({
                id: 'play',
                sudoku: sudoku
            })      
        }
        return Promise.resolve({
            id: 'choose_position'
        })
    }
    static init() {
        return new FillPositionPlugin('fill_position')
    }
}