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
                is_image: true,
            }),
            aspect_ratio: '1,1',
            input: 'Enter the position you want to play. eg a8 for the first box',
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
    generateView(props: { sudoku: string }): JSX.Element {
        const { sudoku } = props;
        const sudarray = stringTo2DArray(sudoku);
        console.log('sudoku arrxwxwxay', Array.isArray(sudarray));
        console.log(sudarray.length);

        return (
            <div tw="flex flex-1 flex-col w-full h-full items-center p-5">

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
                            color: value === 0 ? 'transparent' : 'white',
                        }}
                    >
                        {value}
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
        const { button, sudoku } = params as unknown as { button: `${number}`, sudoku: Array<Array<number>> }

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
                id: 'fill_position',
                position: position,
                sudoku: JSON.stringify(sudoku)
            })


        }
        return Promise.resolve({
            id: 'choose_position'
        })

    }
    async prepareProps(args: PortalParams): Promise<any> {

        const { sudoku } = args;
        // const sudarray: Array<Array<number>> = JSON.parse(sudoku);
        return Promise.resolve({ sudoku: sudoku })
    }
    static init() {
        return new ChoosePositionPlugin('choose_position')
    }
}
function stringTo2DArray(str: string): number[][] {
    const trimmedString = str.slice(2, -2);
    const f_value = trimmedString[1]
    console.log(f_value);
    console.log(trimmedString);
    const rows = trimmedString.split("],[").map((row) =>
        row.split(",").map((item) => parseInt(item))
    );
    rows[0][0] = parseInt(f_value);

    return rows;
}
