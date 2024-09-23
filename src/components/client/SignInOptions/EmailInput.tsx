import { useState } from 'react'
import { Dictionary } from '@/lang'

export default function EmailInput(props: { lang: Dictionary }) {
    const [emial, setEmail] = useState('')
    const [error, setError] = useState('')
    // const [loading, setLoading] = useState(false)

    const checkEmail = (email: string) => {
        if (!email) {
            setError('')
            return
        }
        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            setError('Invalid email')
            return
        }
        setError('')
    }

    return <div className="mb-3">
        <label
            className={`${!!error ? 'input-error ' : ''}input shadow flex flew-row items-center w-full bg-gray-100 focus-within:outline-none focus-within:border-primary pr-0`}>
            <i className="uil-envelope mr-2 text-2xl" />
            <input className="flex-1" type="url" name="email"
                placeholder={props.lang['Email']}
                value={emial}
                onBlur={(e) => {
                    checkEmail(e.target.value)
                }}
                onChange={e => {
                    setEmail(e.target.value)
                }}

                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        checkEmail(emial)
                    }
                }} />
            <i role="button" title="login" className="uil-arrow-right mr-2 text-2xl p-2 cursor-pointer" />
        </label>
        <div className="text-red-400 text-sm my-2">{error}</div>
    </div>
}
