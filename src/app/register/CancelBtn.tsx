'use client'

import {Dictionary} from '@/lang'
import {signOut} from '@/utils'

export default function CancelBtn({lang}:{lang: Dictionary}) {

    const handleCancel = () => {
        signOut()
        location.href = '/'
    }

    return <div
        onClick={handleCancel}
        className="hover:text-primary my-3 inline-flex flex-row items-center cursor-pointer">
        <i className="uil-arrow-left text-xl"/>
        <span className="text-sm">{lang['Cancel']}</span>
    </div>
}

