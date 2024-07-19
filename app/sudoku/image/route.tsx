/* eslint-disable @next/next/no-img-element */
import { renderView } from '@/sudoku/pages'
import { theme } from '@/sudoku/pages/theme'
import { PortalParams } from '@/sudoku/pages/types'
import Image from 'next/image'
import { ImageResponse } from 'next/og'
import fs from 'fs/promises'
import { resolve } from 'path'

export async function GET(req: Request) {
    const url = new URL(req.url)
    const params = Object.fromEntries(Array.from(url.searchParams.entries()))
    const protoMonoRegular = await fs.readFile(
        resolve(process.cwd(), 'public/proto-mono/ProtoMono-Regular.ttf')
    )
    const protoMonoMedium = await fs.readFile(
        resolve(process.cwd(), 'public/proto-mono/ProtoMono-Medium.ttf')
    )
    const protoMonoSemiBold = await fs.readFile(
        resolve(process.cwd(), './public/proto-mono/ProtoMono-SemiBold.ttf')
    )


    const view = await renderView(params as any)

    return new ImageResponse(
        (
            <div style={{
                fontFamily: 'Regular',
                fontSize: '16px',
                backgroundColor: theme.colors.background,
                color: theme.colors.text
            }} tw={` flex flex-col w-full items-start justify-start h-full text-white`}>
                {view}
               
            </div>
        ),
        {
            width: 527,
            height: 527,
            fonts: [
                {
                    name: 'Regular',
                    data: protoMonoRegular,
                    style: 'normal',
                },
                {
                    name: 'Medium',
                    data: protoMonoMedium,
                    style: 'normal',
                },
                {
                    name: 'SemiBold',
                    data: protoMonoSemiBold,
                    style: 'normal',
                },
            ]
        }
    )
}