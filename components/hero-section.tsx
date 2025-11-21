import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { HeroHeader } from "@/components/hero8-header";


export default function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-x-hidden ">
        <section
          className={[
            "relative isolate text-white",
            "bg-[#140405]","min-h-dvh",
            "bg-[radial-gradient(1200px_620px_at_70%_40%,#3a0d0d_0%,#1a0606_35%,#0e0303_100%)]",
          ].join(" ")}
        >
          
          {/* golden ring */}
          <div className="pointer-events-none absolute right-10 top-24 hidden aspect-square w-[620px] rounded-full border-[3px] border-yellow-400/50 lg:block" />

          <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-6 ">
            <div className="relative mx-auto grid min-h-[70vh] grid-cols-1 items-center gap-8 pb-20 pt-16 md:pb-28 lg:pb-48 lg:pt-36 lg:block">
              {/* TEXT */}
              <div className="mx-auto max-w-xl text-center lg:ml-0 lg:w-1/2 lg:text-left">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/70 sm:text-sm">
                  We Are The Best In Town
                </p>

                <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl xl:text-7xl pointer-events-none">
                  Discover And
                  <br /> Share{" "}
                  <span className="relative text-yellow-300 ">
                    Food
                    {/* scribble underline */}
                    <svg
                      viewBox="0 0 200 40"
                      className="absolute -bottom-2 left-0 h-5 w-[80px] fill-none stroke-yellow-300/70 stroke-[6] sm:h-6 sm:w-[170px]"
                    >
                      <path
                        d="M5 25 C50 10, 120 40, 195 20"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <br /> Anytime
                </h1>

                <p className="mt-5 text-base text-white/75 sm:text-lg">
                Discover tasty recipes from around the world. Share your own and get inspired anytime.
                </p>

                <div className="mt-12 flex flex-col items-center justify-center gap-7 sm:flex-row lg:justify-start">
                  <Button
                    asChild
                    size="lg"
                    className="bg-yellow-300 text-black hover:bg-yellow-200"
                  >
                    <Link href="/Menu">Discovers Now</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="secondary"
                    className="bg-white/10 text-white hover:bg-white/20"
                  >
                    <Link href="/Menu">See Our Menu</Link>
                  </Button>
                </div>
              </div>

              {/* IMAGE — keep SAME URL & SAME ABSOLUTE POSITION on lg+ */}
              <Image
                className="animate-float will-change-transform -z-10 order-first ml-auto h-auto w-full object-cover mt-10 sm:h-auto lg:absolute lg:inset-0 lg:-right-30 lg:top-45 lg:order-last lg:h-max lg:w-2xl lg:object-contain dark:mix-blend-lighten "
                src="https://static.vecteezy.com/system/resources/previews/028/195/647/non_2x/beef-wellington-with-ai-generated-free-png.png"
                alt="Abstract Object"
                height="4000"
                width="3000"
                priority
              />
            </div>
          </div>

          {/* inner ring behind dish for depth (lg+) */}
          <div className="pointer-events-none absolute right-20 top-40 hidden h-[550px] w-[550px] -translate-y-6 rounded-full border border-yellow-400/30 lg:block" />
        </section>
      </main>
    </>
  );
}