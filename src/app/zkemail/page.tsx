import {getCurrProfile, redirectToReturn, selectLang} from '@/app/actions'
import ZkEmailSigninForm from '@/app/zkemail/ZkEmailSigninForm'

export default async function ZkEmailSignIn() {
    const lang = (await selectLang()).lang
    const currProfile = await getCurrProfile()

    if (currProfile?.handle) {
        redirectToReturn()
    }

    return <div className="w-full min-h-[calc(100svh-48px)] flex flex-row justify-center items-center relative z-10">
        <div className="max-w-[500px] mx-auto p-4">
            <div className="font-semibold text-2xl">{'Sign-in with ZK Email'}</div>
            <div className="text-sm text-gray-500 my-2">
                <div className="list-disc">{lang['Perform OAuth sign-in operations via an email, you will be asked for One-on-one email reply to sign in.']}</div>
            </div>
            <div className="my-4">
                <ZkEmailSigninForm lang={lang} />
            </div>
        </div>
    </div>
}
