import type {Metadata} from "next"
import "@/styles/globals.css"
import Head from 'next/head'
import {ReactNode} from "react"
import {getLangType} from '@/lang'
import {cookies, headers} from 'next/headers'
import LangSwitcher from '@/components/client/LangSwitcher'
import {Toaster} from '@/components/client/shadcn/Toast/toaster'

export const metadata: Metadata = {
    title: "Social Layer",
    description: "Social Layer",
}

export default function RootLayout({
    children,
}: Readonly<{ children: ReactNode }>) {
    const userLang = cookies().get('lang')?.value
    const acceptLanguage = headers().get('accept-language')
    const langType = getLangType(acceptLanguage, userLang)

    return (<html lang={langType}>
        <Head>
            <link rel="icon" type="image/svg+xml" href="/images/favicon.svg"/>
            <meta name="viewport"
                content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        </Head>
        <body className={`antialiased`}>
            <div className="min-h-[100svh]">
                <header className="w-full h-[48px] shadow sticky top-0 bg-[var(--background)] z-[999]">
                    <div className="page-width w-full flex-row-item-center justify-between items-center h-[48px]">
                        <div className="flex-row-item-center">
                            <a href="/">
                                <img src="/images/logo_horizontal.svg" alt="Social Layer"/>
                            </a>
                        </div>
                        <div className="flex-row-item-center text-xs">
                            <div className="cursor-pointer">
                                <LangSwitcher value={langType} refresh={true} />
                            </div>
                        </div>
                    </div>
                </header>
                <div className="relative">
                    <div className="page-bg" />
                    {children}
                </div>
            </div>
            <Toaster />
        </body>
    </html>)
}
