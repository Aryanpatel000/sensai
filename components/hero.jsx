"use client";

import { Button } from './ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

const Herosection = () => {

    const imageRef = useRef(null);

    useEffect(() => {
        const imageElement = imageRef.current;

        const handlescroll = () => {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;

            if (scrollPosition > scrollThreshold) {
                imageElement.classList.add("scrolled");
            } else{
                imageElement.classList.remove("scrolled")
            }
        };
          window.addEventListener("scroll",handlescroll);
          return () => window.removeEventListener("scroll",handlescroll)
    }, []);

    return (
        <section className='w-full pt-36 md:pt-48 pb-10'>
            <div className='space-y-6 text-center'>
                <div className='space-y-6 mx-auto'>
                    <h1 className='text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl '>
                        Your AI Career Coach for
                        <br />
                        Professional Success
                    </h1>
                    <p className='mx-auto max-w-[600px] text-muted-foreground md:text-xl'>
                        Advance your career with Professional guidence, interview prep , and AI-powered tools for job success.
                    </p>
                </div>

                <div className='flex justify-center space-x-4'>
                    <Link href='/dashboard'>
                        <Button size="lg" className="px-8">
                            Get Started
                        </Button>
                    </Link>

                    <Link href='http://www.youtube.com/@RoadsideCoder'>
                        <Button size="lg" className="px-8" variant="outline">
                            Get Started
                        </Button>
                    </Link>
                </div>

                <div className='hero-image-wrapper mt-5 md:mt-0'>
                    <div ref={imageRef} className='hero-image'>
                        <Image
                            src={"/banner.jpeg"}
                            width={1280}
                            height={720}
                            alt="Banner Sensai"
                            className='rounded-lg shadow-2x1 border mx-auto'
                            priority />
                    </div>
                </div>
            </div>

        </section>
    )
}

export default Herosection
