import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { HeroHeader } from "@/components/hero8-header";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

export default function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-x-hidden">
        <section >
          <div className="pb-24 pt-12  md:pb-32 lg:pb-56 lg:pt-44 ">
            <div className="relative mx-auto flex max-w-6xl flex-col px-6 lg:block mt-20">
              <div className="mx-auto max-w-lg text-center lg:ml-0 lg:w-1/2 lg:text-left">
                <h1 className="mt-8 max-w-2xl text-balance text-5xl font-medium md:text-6xl lg:mt-16 xl:text-7xl">
                  Ship 10x Faster with NS
                </h1>
                <p className="mt-8 max-w-2xl text-pretty text-lg">
                  Highly customizable components for building modern websites
                  and applications that look and feel the way you mean it.
                </p>

                <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                  <Button asChild size="lg" className="px-5 text-base">
                    <Link href="#link">
                      <span className="text-nowrap">Start Building</span>
                    </Link>
                  </Button>
                  <Button
                    key={2}
                    asChild
                    size="lg"
                    variant="ghost"
                    className="px-5 text-base"
                  >
                    <Link href="#link">
                      <span className="text-nowrap">Request a demo</span>
                    </Link>
                  </Button>
                </div>
              </div>
              
              <Image
                className="animate-float will-change-transform  -z-10 order-first  ml-auto h-auto w-full object-cover mt-10 sm:h-auto lg:absolute lg:inset-0 lg:-right-20 lg:-top-10 lg:order-last  lg:h-max lg:w-2xl lg:object-contain dark:mix-blend-lighten "
                src="https://static.vecteezy.com/system/resources/previews/028/195/647/non_2x/beef-wellington-with-ai-generated-free-png.png"
                alt="Abstract Object"
                height="4000"
                width="3000"
                priority

              />
            </div>
          </div>
        </section>
        
      </main>
    </>
  );
}