import Image from 'next/image'
import Link from 'next/link'

export default function ZkEmailOptionItem() {
    return <Link href={'/zkemail'}
        className={`cursor-pointer w-full shadow btn btn-md bg-[var(--background)] mb-3 sm:mb-0 justify-start`}
    >
        <Image alt="Zupass" src={'/images/zkemail.png'} width={24} height={24} className="w-6 h-6 mr-2 rounded"/>
        ZK Email
    </Link>
}
