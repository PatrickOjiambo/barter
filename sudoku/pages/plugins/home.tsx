import { PortalDefinition, PortalPacket, PortalPlugin } from "@kade-net/portals-parser";
import { PortalParams } from "../types";
import { generateURL } from "../utils";
import { theme } from "../theme";
import { JSX } from "react";
export class HomePortalPlugin extends PortalPlugin<PortalParams, any> {
    async generateAsync(args: PortalParams): Promise<PortalDefinition> {

        return Promise.resolve({
            id: this.id,
            title: "Sudoku",
            icon: "🧩",
            type: "app",
            description: "Play sudoku now",
            image: generateURL({
                params: {
                    id: "home"

                },
                is_image: true
            }),
            aspect_ratio: '1:1',
            buttons: [
                {
                    title: "Quick play",
                    target: generateURL({
                        params: {
                            id: "home",
                            button: '1'
                        }
                    }),
                    index: 1,
                    type: 'post'

                },
                {
                    title: "Play with friends",
                    target: generateURL({
                        params: {
                            id: "home",
                            button: '2'
                        }
                    }),
                    index: 2,
                    type: 'post'
                }
            ]

        })

    }
    prepareProps(args: PortalParams): Promise<any> {
        return Promise.resolve({})
    }
    generateView(props: any): JSX.Element {
        return (
            <div tw="w-full h-full flex flex-col items-center justify-center p-5">
            <img
                src="https://res.cloudinary.com/dra0xwf8z/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1721896210/image_qtcxwo.png"
                alt='logo'
                width={100}
                height={100}
            />
            <h1
                style={{
                    fontFamily: 'Signika-Bold',
                    color: theme.colors.primary
                }}
                className="text-lg font-bold">
                sudoku
            </h1>
            <p tw="text-center" >
                A random sudoku portal for you
            </p>
            <p tw="text-sm text-[#f5b01c]" >
                Play for fun or join weekly challenges
            </p>
        </div>
    )
    }
    async getNext<T = Record<string, any>>(params: T, packet: PortalPacket) {
        const { button } = params as unknown as { button: `${number}` }
        if (button === '1') {

            console.log('coming from home');
            return {
                id: 'quick_play',
            }
        }
        if (button === '2') {

            return {
                id: 'challenges',
            }
        }
        return {} as any
    }
    static init() {
        return new HomePortalPlugin('home')
    }
}
