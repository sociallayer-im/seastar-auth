'use server'

import {cookies, headers} from 'next/headers'
import {getLang, getLangType} from '@/lang'
import {AUTH_FIELD} from '@/utils'
import {redirect} from 'next/navigation'
import {getProfileByToken} from '@/service/solar'

export const selectLang = async function () {
    const acceptLanguage = headers().get('accept-language')
    const cookieLang = cookies().get('lang')?.value

    const type = getLangType(acceptLanguage, cookieLang)
    return {
        type: type,
        lang: getLang(type)
    }
}

export const getCurrProfile = async function () {
    const authToken = cookies().get(AUTH_FIELD)?.value
    if (!authToken) {
        return null
    }

    return await getProfileByToken(authToken)
}

export const redirectToReturn = async () => {
    const returnTo = cookies().get('return')?.value
    if (returnTo) {
        redirect(returnTo)
    } else {
        redirect(process.env.NEXT_PUBLIC_APP_URL!)
    }
}

export const checkUserLoggedInAndRedirect = async function () {
    const currProfile = await getCurrProfile()

    if (!currProfile) {
        return
    }

    if (!currProfile.handle) {
        redirect('/register')
    } else {
        await redirectToReturn()
    }
}
