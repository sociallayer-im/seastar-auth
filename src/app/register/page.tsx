import {selectLang, getCurrProfile, redirectToReturn} from '@/app/actions'
import RegisterForm from '@/app/register/RegisterForm'
import {pickSearchParam} from '@/utils'
import CancelBtn from '@/app/register/CancelBtn'

export default async function Register(props: {searchParams : {username: string | string[]}}) {
    const lang = (await selectLang()).lang
    const currProfile = await getCurrProfile()

    if (currProfile?.name) {
        redirectToReturn()
    }

    const username = props.searchParams.username ? pickSearchParam(props.searchParams.username) : ''

    return <div className="w-full min-h-[calc(100svh-48px)] flex flex-row justify-center items-center relative z-10">
        <div className="max-w-[500px] mx-auto p-4">
            <CancelBtn lang={lang} />
            <div className="font-semibold text-2xl">{lang['Set a unique Social Layer username']}</div>
            <div className="text-sm text-gray-500 my-2">
                <ul className="pl-4">
                    <li className="list-disc">{lang['Contain the English-language letters and the digits 0-9']}</li>
                    <li className="list-disc">Underscores (_) can also be used</li>
                    <li className="list-disc">Should be 3 to 30 characters</li>
                </ul>
            </div>
            <div className="my-4">
                <RegisterForm lang={lang} prefill={username} />
            </div>
        </div>
    </div>
}
