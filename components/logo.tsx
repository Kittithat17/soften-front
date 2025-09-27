import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import Image from 'next/image' // Correctly import the Image component
import { img } from 'motion/react-client'

export const Logo = ({ className }: { className?: string }) => {
    return (
        <Image
        className=""
        src="/images/eggHD.png"
        alt="Abstract Object"
        height="50"
        width="50"
        priority

      />
    )
}


