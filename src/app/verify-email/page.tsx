import FormVerifyEmail from './FormVerifyEmail'
import {selectLang} from '@/app/actions'
import {pickSearchParam} from '@/utils'
import {redirect} from 'next/navigation'

export default async function EmailVerification({searchParams}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const lang = (await selectLang()).lang
    const email = pickSearchParam(searchParams.email)

    if (!email) {
        redirect('/')
    }

    return <div className="w-full min-h-[calc(100svh-48px)] flex flex-row justify-center items-center relative z-10">
        <div className="max-w-[400px] mx-auto p-4">
            <a className="hover:text-primary my-3 inline-flex flex-row items-center"  href='/'>
                <i className="uil-arrow-left text-xl"/>
                <span className="text-sm">{lang['Back']}</span>
            </a>
            <div className="font-semibold text-2xl">{lang['Check your inbox']}</div>
            <div className="text-sm text-gray-500 my-2">{lang['Enter the code we sent to']}
                <span className="font-semibold text-[var(--foreground)]"> {email} </span>
                {lang['to complete your account set-up']}
            </div>
            <div className="my-6">
                <FormVerifyEmail lang={lang} email={email} />
            </div>
        </div>
    </div>
}
