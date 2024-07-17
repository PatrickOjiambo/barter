import { generatePortalModel } from "@/sudoku/pages";
import { Metadata, ResolvingMetadata } from 'next'
import React from 'react'

interface Props {
    searchParams: any
}

export async function generateMetadata(
    props: Props,
    parent: ResolvingMetadata
) {
    const { searchParams } = props


    const metadata = await generatePortalModel(searchParams)

    return {
        other: metadata
    } as Metadata
}

function Page() {
    return (
        <div>Page</div>
    )
}

export default Page