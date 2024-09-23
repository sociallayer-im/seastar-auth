import {cookies, headers} from 'next/headers'
import SignInOptions from '@/components/client/SignInOptions'
import {getLangType, getLang} from '@/lang'


export default function Home() {
    const session = cookies().get('session')?.value
    const userLang = cookies().get('lang')?.value
    const acceptLanguage = headers().get('accept-language')
    const langType = getLangType(acceptLanguage, userLang)
    const lang = getLang(langType)

    return <div className="w-full min-h-[calc(100svh-48px)] flex flex-row justify-center items-center relative z-10">
        {session}

        <div className="w-[360px] mx-auto p-4">
            <div className="font-semibold mb-6 text-lg">{lang['Sign In']}</div>
            <SignInOptions lang={lang}/>
        </div>
    </div>
}
