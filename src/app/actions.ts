'use server'

import {cookies, headers} from 'next/headers'
import {getLang, getLangType} from '@/lang'
import {AUTH_FIELD} from '@/utils'
import {redirect} from 'next/navigation'
import {getProfile} from '@/service/solar'

export const selectLang = async function () {
    const acceptLanguage = headers().get('accept-language')
    const cookieLang = cookies().get('lang')?.value

    const type = getLangType(acceptLanguage, cookieLang)
    return {
        type: type,
        lang: getLang(type)
    }
}

export const checkUserLoggedInAndRedirect = async function (props: {returnTo?: string}) {
    const authToken = cookies().get(AUTH_FIELD)?.value
    if (!authToken) {
        return
    }

    const currProfile = await getProfile(authToken)

    if (!currProfile) {
        return
    }

    if (!currProfile.handle) {
        redirect('/register')
    } else if (props.returnTo) {
        redirect(props.returnTo)
    } else {
        redirect(process.env.NEXT_PUBLIC_DEFAULT_RETURN!)
    }
}
