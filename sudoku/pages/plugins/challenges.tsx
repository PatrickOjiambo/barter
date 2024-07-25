import { PortalDefinition, PortalPacket, PortalPlugin } from "@kade-net/portals-parser";
import { PortalParams } from "../types";
import { generateURL } from "../utils";
import { theme } from "../theme";
import { JSX } from "react";
export class ChallengesPortalPlugin extends PortalPlugin<PortalParams, any> {
    async generateAsync(args: PortalParams): Promise<PortalDefinition> {

        return Promise.resolve({
            id: this.id,
            title: "Sudoku",
            icon: "🧩",
            type: "app",
            description: "Play sudoku now",
            image: generateURL({
                params: {
                    id: "challenges"

                },
                is_image: true
            }),
            aspect_ratio: '1:1',
            buttons: [
                {
                    title: "Back",
                    target: generateURL({
                        params: {
                            id: "challenges",
                            button: '1'
                        }
                    }),
                    index: 1,
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
                src="https://res.cloudinary.com/dra0xwf8z/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1721896756/soon_jjv2sl.png"
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
                    Hold on buddy❗❗. Coming soon🔜
                </p>

            </div>
        )
    }
    async getNext<T = Record<string, any>>(params: T, packet: PortalPacket) {
        const { button } = params as unknown as { button: `${number}` }
        if (button === '1') {

            return {
                id: 'home',
            }
        }

        return {} as any
    }
    static init() {
        return new ChallengesPortalPlugin('challenges')
    }
}
