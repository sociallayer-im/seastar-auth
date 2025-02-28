import type {Metadata} from "next"
import "@/styles/globals.css"
import '@farcaster/auth-kit/styles.css'
import Head from 'next/head'
import {ReactNode} from "react"
import LangSwitcher from '@/components/client/LangSwitcher'
import {Toaster} from '@/components/client/shadcn/Toast/toaster'
import Modals from '@/components/client/Modal/Modals'
import {selectLang} from '@/app/actions'
import Image from 'next/image'
// import Script from 'next/script'

export const metadata: Metadata = {
    title: "Social Layer",
    description: "Social Layer",
}

export default async function RootLayout({
    children,
}: Readonly<{ children: ReactNode }>) {
    const langType = (await selectLang()).type

    return (<html lang={langType}>
        <Head>
            <link rel="icon" type="image/svg+xml" href="/images/favicon.svg"/>
            <meta name="viewport"
                content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        </Head>
        <body className={`antialiased`}>
            {/*<Script async src="https://telegram.org/js/telegram-widget.js?22"*/}
            {/*    data-telegram-login="develop_solar_auth_bot" data-size="hidden" data-userpic="false"*/}
            {/*    data-onauth="onTelegramAuth(user)" data-request-access="write" />*/}
            <div className="min-h-[100svh]">
                <header className="w-full h-[48px] shadow sticky top-0 bg-[var(--background)] z-[999]">
                    <div className="page-width w-full flex-row-item-center justify-between items-center h-[48px]">
                        <div className="flex-row-item-center">
                            <a href="/">
                                <Image src="/images/logo_horizontal.svg" width={102} height={32}
                                    alt="Social Layer"/>
                            </a>
                        </div>
                        <div className="flex-row-item-center text-xs">
                            <div className="cursor-pointer">
                                <LangSwitcher value={langType} refresh={true}/>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="relative">
                    <div className="page-bg"/>
                    {children}
                </div>
            </div>
            <div className="relative z-[9998]"><Modals/></div>
            <div className="relative z-[9999]"><Toaster/></div>
        </body>
    </html>
    )
}
