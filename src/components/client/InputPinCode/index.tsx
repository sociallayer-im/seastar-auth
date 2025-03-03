import {useRef, useState, useEffect} from 'react'
import {Dictionary} from '@/lang'

const codeLength = 5

export default function InputPinCode(props: {lang:Dictionary, onChange?: (code: string) => void, onResend?: () => Promise<void> }) {
    const [code, setCode] = useState('')
    const inputRef = useRef<HTMLInputElement | null>(null)

    const [seconds, setSeconds] = useState(40)

    const handleChange = (code: string) => {
        if (!isNaN(Number(code))) {
            setCode(code)
            if (props.onChange) {
                props.onChange(code)
            }
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            seconds >= 1 && setSeconds(seconds => seconds - 1)
        }, 1000)
        return () => clearInterval(interval)
    })

    const handleFocus = () => {
        if (inputRef.current) {
            const length = inputRef.current.value.length
            inputRef.current.setSelectionRange(length, length)
        }
    }

    const handleResend = async () => {
        if (props.onResend) {
            await props.onResend()
        }
        setSeconds(40)
    }

    return <>
        <div
            className={`flex flew-row w-full relative px-0 h-12 justify-between`}>

            {new Array(codeLength).fill('').map((_, index) => {
                return <input
                    className={`${code.length === index ? 'border-primary select-none border-[1.5px] ' : 'border-gray-500 '}rounded-lg border w-11 text-center bg-white font-semibold text-2xl`}
                    type="text"
                    maxLength={1}
                    key={index}
                    value={code[index] || ''}
                    readOnly={true}/>
            })}

            <input
                data-testid="pin-code-input"
                ref={inputRef}
                autoComplete={'off'}
                autoFocus={true}
                maxLength={5}
                className="w-full opacity-0 absolute left-0 top-0 h-full bg-[rgba(0,0,0,0)] outline-0 text-[rgba(0,0,0,0)] select-none"
                type="phone"
                name="title"
                value={code}
                onSelect={handleFocus}
                onFocus={handleFocus}
                onChange={e => handleChange(e.target.value.trim())}/>
        </div>
        {!!props.onResend &&
            <div onClick={handleResend}
                className={`text-xs mt-4 text-gray-500 text-right ${seconds !== 0 ? 'pointer-events-none': 'text-blue-500 cursor-pointer'}`}>
                {props.lang['Resend Code']} {seconds !== 0 &&
                <span className="w-8 inline-flex">({seconds}s)</span>
                }
            </div>
        }
    </>
}
