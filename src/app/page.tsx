import SignInOptions from '@/components/client/SignInOptions'
import {pickSearchParam} from '@/utils'
import {checkUserLoggedInAndRedirect, selectLang} from '@/app/actions'

export interface SignInSearchParams {
    group: string | string[] | undefined,
    return: string | string[] | undefined,
}

export default async function Home({searchParams}: { searchParams: SignInSearchParams }) {
    const returnTo = pickSearchParam(searchParams.return)

    // if user is already logged in, redirect to the specify page
    await checkUserLoggedInAndRedirect({returnTo})

    const lang = (await selectLang()).lang

    return <div className="w-full min-h-[calc(100svh-48px)] flex flex-row justify-center items-center relative z-10">
        <div className="w-[360px] mx-auto p-4">
            <div className="font-semibold mb-6 text-lg">{lang['Sign In']}</div>
            <SignInOptions lang={lang}/>
        </div>
    </div>
}
