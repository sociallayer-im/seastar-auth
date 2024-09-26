import {useRef, useState} from 'react'

const codeLength = 5

export default function InputPinCode(props: { onChange?: (code: string) => void}) {
    const [code, setCode] = useState('')
    const inputRef = useRef<HTMLInputElement | null>(null)

    const handleChange = (code: string) => {
        if (!isNaN(Number(code))) {
            setCode(code)
            if (props.onChange) {
                props.onChange(code)
            }
        }
    }

    const handleFocus = () => {
        if (inputRef.current) {
            const length = inputRef.current.value.length
            inputRef.current.setSelectionRange(length, length)
        }
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
    </>
}
