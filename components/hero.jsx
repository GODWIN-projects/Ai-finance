"use client"
import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'

const HeroSection = () => {

    const imgRef = useRef()

    useEffect(() => {
        const imageElement = imgRef.current

        const handleScroll = ()=> {
            const scrollPosition  = window.scrollY
            const scrollThershold = 10

            if (scrollPosition > scrollThershold) {
                imageElement.classList.add("scrolled")
            } else {
                imageElement.classList.remove("scrolled")
            }
        }

        window.addEventListener("scroll", handleScroll)

        return ()=> window.removeEventListener("scroll", handleScroll)
    },[])

  return (
    <div className='pb-20 px-4'>
        <div className='container mx-auto text-center'>
            <h1 className='text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title'>
                Manage Your Finances <br /> with Intelligence
            </h1>
            <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>
                An AI-powered financial mangement platform that 
                helps you track, analyze and optimizze your spending
                with real-time insights
            </p>
            <div className='text-center'>
                <Link href={"/dashboard"}>
                    <Button size={"lg"} className={"px-8"}>
                        Get started
                    </Button>
                </Link>
            </div>
        </div>
        <div className='hero-image-wrapper'>
            <div ref={imgRef} className='hero-image'>
                <Image src={"/AI-smart-finance-scaled.jpg"}
                width={1280}
                height={720}
                alt='home screen banner'
                priority
                className='rounded-lg shadow-2xl border mx-auto'/>
            </div>
        </div>
    </div>

  )
}

export default HeroSection