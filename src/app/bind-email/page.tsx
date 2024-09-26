import {getCurrProfile, selectLang} from '@/app/actions'
import {redirect} from 'next/navigation'
import BindEmailForm from '@/app/bind-email/BindEmailForm'
import {cookies} from 'next/headers'

export default async function BindEmail() {
    const lang = (await selectLang()).lang
    const currProfile = await getCurrProfile()

    if (!currProfile) {
        console.log('BindEmail-redirect-to-root')
        redirect('/')
    }

    const returnTo = cookies().get('return')?.value || process.env.NEXT_PUBLIC_DEFAULT_RETURN!

    return <div className="w-full min-h-[calc(100svh-48px)] flex flex-row justify-center items-center relative z-10">
        <div className="max-w-[500px] mx-auto p-4">
            <a className="hover:text-primary my-3 inline-flex flex-row items-center"
                href={returnTo}>
                <i className="uil-arrow-left text-xl"/>
                <span className="text-sm">{lang['Skip']}</span>
            </a>
            <div className="font-semibold text-2xl">{lang['Bind Email']}</div>
            <div className="text-sm text-gray-500 my-2">
                {lang['Please enter your email address so that you can log in and receive important notifications via email.']}
            </div>
            <div className="my-4">
                <BindEmailForm lang={lang}/>
            </div>
        </div>
    </div>
}
