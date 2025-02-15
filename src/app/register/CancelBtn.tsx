'use client'

import {Dictionary} from '@/lang'
import Cookies from 'js-cookie'

export default function CancelBtn({lang}:{lang: Dictionary}) {

    const handleCancel = () => {
        Cookies.remove(process.env.NEXT_PUBLIC_AUTH_FIELD!)
        location.href = '/'
    }

    return <div
        onClick={handleCancel}
        className="hover:text-primary my-3 inline-flex flex-row items-center cursor-pointer">
        <i className="uil-arrow-left text-xl"/>
        <span className="text-sm">{lang['Cancel']}</span>
    </div>
}

