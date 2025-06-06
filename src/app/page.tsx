import SignInOptions from '@/components/client/SignInOptions'
import {checkUserLoggedInAndRedirect, selectLang} from '@/app/actions'

export interface SignInSearchParams {
    group: string | string[] | undefined,
    return: string | string[] | undefined,
}

export default async function Home() {
    // if user is already logged in, redirect to the specify page
    await checkUserLoggedInAndRedirect()

    const lang = (await selectLang()).lang

    return <div className="w-full min-h-[calc(100svh-48px)] flex flex-row justify-center items-center relative z-10">
        <div className="max-w-[560px] mx-auto p-4 w-full">
            <div className="font-semibold mb-6 text-xl">{lang['Sign In']}</div>
            <SignInOptions lang={lang}/>
        </div>
    </div>
}
