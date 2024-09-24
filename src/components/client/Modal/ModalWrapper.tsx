import {ReactElement, useEffect, useRef} from 'react'

export default function ModalWrapper({clickOutsideToClose = true, ...props}: {
    close: () => void,
    content: (close: () => void) => ReactElement,
    clickOutsideToClose?: boolean
}) {
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!!contentRef.current) {
            setTimeout(() => {
                contentRef.current?.classList.add('!opacity-100')
                contentRef.current?.classList.add('!scale-100')
            }, 100)
        }
    }, [])

    const handleClickOutside = () => {
        if (clickOutsideToClose) {
            props.close()
        }
    }

    return <div
        onClick={handleClickOutside}
        className="fixed left-0 top-0 z-[9999] w-[100vw] h-[100svh] bg-[rgba(255,255,255,0.5)] blur-md flex flex-col items-center justify-center">
        <div ref={contentRef} className="opacity-0 scale-95 relative transition-all duration-300">
            {props.content(props.close)}
        </div>
    </div>
}
