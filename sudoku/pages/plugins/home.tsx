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
                    id: "sudoku"

                },
                is_image: true
            }),
            aspect_ratio: '1:1',
            input: 'Choose an option',
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
            <div>
                We in this all
            </div>)
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
                id: 'quick_play',
            }
        }
        return {} as any
    }
    static init() {
        return new HomePortalPlugin('home')
    }
}
