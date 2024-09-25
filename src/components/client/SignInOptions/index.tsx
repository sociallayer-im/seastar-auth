"use client"

import WagmiWrapper from './WagmiWrapper'
import EmailInput from '@/components/client/SignInOptions/EmailInput'
import {Dictionary} from '@/lang'
import Options from '@/components/client/SignInOptions/Options'

export default function SignInOptions(props: { lang: Dictionary }) {
    return <WagmiWrapper>
        <div>
            <EmailInput lang={props.lang}/>
            <div
                className="flex flex-row items-center mb-3 after:content-['']  after:block after:flex-1 after:bg-base-200 after:h-[1px]  before:block before:flex-1 before:bg-base-200 before:h-[1px]">
                <div className="mx-2">or</div>
            </div>
            <Options />
        </div>
    </WagmiWrapper>
}
