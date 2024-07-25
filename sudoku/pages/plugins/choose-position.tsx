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
                params: { id: 'choose_position', sudoku: sudoku },
                is_image: true,
            }),
            aspect_ratio: '1,1',
            input: 'Enter the position to edit. eg 1a for the first box (row,col)',
            buttons: [
                {
                    title: 'Back',
                    target: generateURL({
                        params: {
                            id: 'choose_position',
                            button: '1',
                            sudoku: sudoku,

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
                            sudoku: sudoku,

                        }
                    }),
                    index: 2,
                    type: 'post'
                }
            ]
        })
    }
    generateView(props: { sudoku: string }): JSX.Element {
        const { sudoku } = props;
        const sudarray: Array<Array<number>> = JSON.parse(sudoku);

        return (
            <div tw="flex flex-1 flex-col w-full h-full items-center p-5">
                <p>Choose position</p>
                <div tw="flex flex-col w-full">
                    {sudarray.map((row, rowIndex) => (
                        <div key={rowIndex} tw="flex flex-row">
                            {rowIndex === 0 && (
                                <span
                                    key="empty-top-left"
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        color: 'white',
                                    }}
                                ></span>
                            )}
                            {rowIndex === 0 && row.map((_, colIndex) => (
                                <span
                                    key={`col-${colIndex}`}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        color: 'white',
                                        border: 'none'
                                    }}
                                >
                                    {String.fromCharCode(65 + colIndex)}
                                </span>
                            ))}
                        </div>
                    ))}
                    {sudarray.map((row, rowIndex) => (
                        <div key={rowIndex} tw="flex flex-row">
                            <span
                                key={`row-${rowIndex}`}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    border: 'none'
                                }}
                            >
                                {rowIndex + 1}
                            </span>
                            {row.map((value, colIndex) => {
                                const isTopBorder = rowIndex % 3 === 0 || rowIndex === 0;
                                const isBottomBorder = (rowIndex + 1) % 3 === 0 || rowIndex === sudarray.length - 1;
                                const isLeftBorder = colIndex % 3 === 0 || colIndex === 0;
                                const isRightBorder = (colIndex + 1) % 3 === 0 || colIndex === row.length - 1;

                                const isOuterTop = rowIndex === 0;
                                const isOuterBottom = rowIndex === sudarray.length - 1;
                                const isOuterLeft = colIndex === 0;
                                const isOuterRight = colIndex === row.length - 1;
                                const valueColor = value === 0 ? 'transparent' : value < 10 ? '#75E6DA' : 'white';


                                return (
                                    <span
                                        key={`${rowIndex}-${colIndex}`}
                                        style={{
                                            border: '1px solid white',
                                            borderTop: isTopBorder || isOuterTop ? '2px solid white' : '1px solid white',
                                            borderBottom: isBottomBorder || isOuterBottom ? '2px solid white' : '1px solid white',
                                            borderLeft: isLeftBorder || isOuterLeft ? '2px solid white' : '1px solid white',
                                            borderRight: isRightBorder || isOuterRight ? '2px solid white' : '1px solid white',
                                            width: '40px',
                                            height: '40px',
                                            textAlign: 'center',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '10px',
                                            paddingLeft: '20px',
                                            color: valueColor,
                                        }}
                                    >
                                        {value === 0 ? value : parseInt(value.toString()[0])}
                                    </span>
                                );
                            })}
                        </div>
                    ))}


                </div>
            </div>
        )

    }
    async getNext(params: any, packet: PortalPacket): Promise<Record<string, string> & { id: string; }> {
        const { button, sudoku } = params as unknown as { button: `${number}`, sudoku: string }
        if (button === '1') {
            return Promise.resolve({
                id: 'quick_play'
            })
        }
        if (button === '2') {
            const position: string = packet.input_text;
            const sudarray: Array<Array<number>> = JSON.parse(sudoku);
            const [rowIndex, colIndex] = indexMapping(position);
            // assert(sudarray[rowIndex][colIndex] === 0 && sudarray[rowIndex][colIndex] > 9, 'Position already filled');
            // assert(position.length === 2, 'Invalid position');
            // assert(position[0] >= '1' && position[0] <= '9', 'Invalid row');
            // assert(position[1] >= 'a' && position[1] <= 'i', 'Invalid column');
            try {
                validatePosition(position, sudarray);
                return Promise.resolve({
                    id: 'fill_position',
                    position: position,
                    sudoku: sudoku
                })
            }
            catch (e) {
                return Promise.resolve({
                    id: 'choose_position',
                    sudoku: sudoku
                })
            }

        }
        return Promise.resolve({
            id: 'choose_position'
        })

    }
    async prepareProps(args: PortalParams): Promise<any> {

        const { sudoku } = args;
        console.log('bvbvbkbv');
        console.log(Array.isArray(JSON.parse(sudoku)));
        // const sudarray: Array<Array<number>> = JSON.parse(sudoku);
        return Promise.resolve({ sudoku: sudoku })
    }
    static init() {
        return new ChoosePositionPlugin('choose_position')
    }
}

function indexMapping(str: string) {

    const col_mapping: any = {
        a: 0,
        b: 1,
        c: 2,
        d: 3,
        e: 4,
        f: 5,
        g: 6,
        h: 7,
        i: 8
    }
    const [row, col] = str.split("");
    const colIndex = col_mapping[col];
    const rowIndex = parseInt(row) - 1;
    return [rowIndex, colIndex];
}
function validatePosition(position: string, sudarray: Array<Array<number>>) {
    // Ensure position length is 2
    if (position.length !== 2) {
        throw new Error('Invalid position');
    }

    // Extract row and column from position
    const row = parseInt(position[0], 10);
    const col = position[1].toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0) + 1;

    // Ensure row is between 1 and 9
    if (row < 1 || row > 9) {
        throw new Error('Invalid row');
    }

    // Ensure column is between 'a' and 'i'
    if (col < 1 || col > 9) {
        throw new Error('Invalid column');
    }

    // Ensure the specified position is empty
    if (sudarray[row - 1][col - 1] !== 0) {
        throw new Error('Position already filled');
    }

    // Ensure value is greater than 9
    if (sudarray[row - 1][col - 1] > 9) {
        throw new Error('Position value must be greater than 9');
    }
}