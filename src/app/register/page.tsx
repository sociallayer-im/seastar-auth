import {selectLang, getCurrProfile, redirectToReturn} from '@/app/actions'
import RegisterForm from '@/app/register/RegisterForm'

export default async function Register() {
    const lang = (await selectLang()).lang
    const currProfile = await getCurrProfile()

    if (currProfile?.handle) {
        redirectToReturn()
    }

    return <div className="w-full min-h-[calc(100svh-48px)] flex flex-row justify-center items-center relative z-10">
        <div className="max-w-[500px] mx-auto p-4">
            <div className="font-semibold text-2xl">{lang['Set a unique Social Layer username']}</div>
            <div className="text-sm text-gray-500 my-2">
                <ul className="pl-4">
                    <li className="list-disc">{lang['Contain the English-language letters and the digits 0-9']}</li>
                    <li className="list-disc">{lang['Hyphens can also be used but it can not be used at the beginning and at the end']}</li>
                    <li className="list-disc">{lang['Should be equal or longer than 6 characters']}</li>
                </ul>
            </div>
            <div className="my-4">
                <RegisterForm lang={lang} />
            </div>
        </div>
    </div>
}