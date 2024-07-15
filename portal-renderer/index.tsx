"use client"
import React, { useEffect, useRef, useState } from 'react'
import { sortBy } from 'lodash'
import { PortalButton } from '@kade-net/portals-parser'
import usePortal from './use-portal'
import { Cog, Rewind, RotateCcw } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Props {
    url: string
    kid: number
    post_ref: string
}
const currentParams = {
    data: "",
    response: ""
}

export const convertAspectRatio = (aspect_ratio: string) => {
    if (!aspect_ratio || aspect_ratio.length === 0) return 1
    const [width, height] = aspect_ratio.split(':')
    return Number(width) / Number(height)
}

const generateRandomString = (length: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    const charactersLength = characters.length

    for (let i = 0; i < length; i++) {
        const chosenIndex = Math.floor(Math.random() * charactersLength)
        result += characters.charAt(chosenIndex)
    }

    return result
}


const PortalRenderer = (props: Props) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [cacheBuster, setCacheBuster] = useState<string>(generateRandomString(10))
    const { url, kid, post_ref: ref } = props
    const [input, setInput] = useState<string>()
    const [activeButton, setActiveButton] = React.useState<PortalButton | null>(null)
    const { portal, loading, setPortal, error, handleButtonPress, reloadPortal } = usePortal({
        initialUrl: url?.trim()
    })

    useEffect(() => {
        setCacheBuster(generateRandomString(10))
    }, [portal?.components?.id])


    if (loading) {
        return (
            <div
                className='flex flex-col items-center justify-center aspect-[1]'
            >
                <Cog className='animate-spin' />
            </div>
        )
    }

    return (
        <div
            className='flex flex-col items-center justify-center rounded-md overflow-hidden bg-[#2a2432] border border-portal-border-color'
        >
            <div className='w-[502px] relative' style={{
                aspectRatio: portal?.components?.image?.aspect_ratio ? convertAspectRatio(portal?.components?.image?.aspect_ratio) : 1.91 / 1
            }} >
                <Image
                    src={portal?.components?.image?.image ? `${portal?.components.image?.image}&cache_buster=${cacheBuster}` : ''}

                    width={502}
                    height={502}
                    alt='image'
                />
            </div>
            <div
                className='flex flex-col w-full p-1.5'
            >
                {
                    portal?.components?.input &&
                    <div className='w-full py-1.5 px-2.5' >
                        <Input
                            ref={inputRef}
                            value={input ?? ''}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={portal?.components?.input?.input || ""}
                            autoCapitalize='none'
                            className='w-full h-[30px] rounded-sm'
                        />
                    </div>
                }
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        columnGap: '0.5rem',
                        rowGap: '0.25rem',
                        padding: 5
                    }}
                    className="gap-x-1 gap-y-1 p-1.5 w-full">
                    {
                        sortBy(portal?.components?.buttons, a => a.index)?.map((button, index) => {
                            const IS_LAST_ODD_BUTTON = (portal?.components?.buttons?.length ?? 0) % 2 !== 0 && index === (portal?.components?.buttons?.length ?? 0) - 1
                            return (
                                <Button
                                    style={{
                                        gridColumn: IS_LAST_ODD_BUTTON ? 'span 2' : 'auto'
                                    }}
                                    key={index}
                                    onClick={async () => {
                                        if (inputRef.current) {
                                            inputRef.current.blur()
                                        }

                                        await handleButtonPress({
                                            button,
                                            kid,
                                            ref,
                                            input
                                        }).then(() => {
                                            if (inputRef.current) {
                                                inputRef.current.value = ''
                                            }
                                        })

                                        if (inputRef.current) {
                                            setInput('')
                                        }


                                    }}
                                >
                                    {button.title}
                                </Button>
                            )
                        })
                    }
                </div>

            </div>
            <div onClick={() => {
                setCacheBuster(generateRandomString(10))
                reloadPortal()
            }} className="flex flex-row items-center justify-center p-1 cursor-pointer">
                <RotateCcw />
            </div>
        </div>
    )
}

export default PortalRenderer