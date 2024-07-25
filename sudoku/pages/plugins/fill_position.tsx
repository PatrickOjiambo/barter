import { PortalDefinition, PortalGenerator, PortalPacket, PortalPlugin } from "@kade-net/portals-parser";
import { PortalParams } from "../types";
import { generateURL } from "../utils";
import assert from "assert";
import { JSX } from "react";
export class FillPositionPlugin extends PortalPlugin<PortalParams, any> {
    async generateAsync(args: PortalParams): Promise<PortalDefinition> {
        const { sudoku, position } = args;
        return Promise.resolve({
            id: this.id,
            title: "Fill Position",
            description: "Fill a position in Sudoku",
            image: generateURL({
                params: { id: 'fill_position', sudoku: sudoku, position: position },
                is_image: true,
            }),
            aspect_ratio: '1,1',
            input: 'Enter solution for the highlighted position',
            buttons: [
                {
                    title: 'Back',
                    target: generateURL({
                        params: {
                            id: 'choose_position',
                            button: '1',
                            sudoku: sudoku,
                            position: position
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
                            sudoku: sudoku,
                            position: position
                        }
                    }),
                    index: 2,
                    type: 'post'
                }
            ]
        })
    }
    generateView(props: {
        sudoku: string
        positions: [number, number]
    }): JSX.Element {
        const { sudoku, positions } = props;
        const [rowI, colI] = positions;
        const sudarray: Array<Array<number>> = JSON.parse(sudoku);


        return (
            <div tw="flex flex-1 flex-col w-full h-full items-center p-5">
                <p>Fill Position</p>
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
                                            color: value === 0 ? 'transparent' : value < 10 ? '#75E6DA' : 'white',
                                            backgroundColor: rowI === rowIndex && colI === colIndex ? 'red' : 'transparent'
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
    prepareProps(args: PortalParams): Promise<any> {
        const { sudoku, position } = args;
        const [rowIndex, colIndex] = indexMapping(position);
        return Promise.resolve({
            sudoku: sudoku,
            positions: [rowIndex, colIndex]
        })
    }
    async getNext(params: any, packet: PortalPacket): Promise<Record<string, string> & { id: string; }> {
        const { button, position, sudoku } = params as unknown as { button: `${number}`, position: string, sudoku: string }
        if (button === '1') {
            return Promise.resolve({
                id: 'choose_position',
                sudoku: sudoku
            })
        }
        if (button === '2') {
            const digit = packet.input_text;
            // assert(parseInt(digit) > 0 && parseInt(digit) < 10, 'Invalid digit')
            if (!(parseInt(digit) > 0 && parseInt(digit) < 10)) {
                return Promise.resolve({
                    id: 'fill_position',
                    sudoku: sudoku,
                })
            }
            const sudarray = JSON.parse(sudoku);
            const [row_index, col_index] = indexMapping(position);
            sudarray[row_index][col_index] = parseInt(digit);

            return Promise.resolve({
                id: 'choose_position',
                sudoku: JSON.stringify(sudarray)
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