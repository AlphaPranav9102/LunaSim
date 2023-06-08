"use client"


import { GeneralNavbar } from "./components/GeneralNavbar";
import { SessionProvider } from "next-auth/react"
import { useSession, signIn } from "next-auth/react"
import LoginButton from "./components/LoginButton";

export default function Home() {
  return (
      <div className="h-screen bg-[#0e1729]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1), rgba(0,0,0,0.85)), url(https://www.magicpattern.design/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fbrandbird%2Fmagicpattern%2Fwallpapers%2Fmagicpattern-mesh-gradient-1635765150762-preview.jpg&w=3840&q=75)', backgroundSize: "cover"}}>
        <GeneralNavbar/>
        <div className=" dark:bg-gray-900">
            <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
                <img className="w-full dark:hidden" src="https://www.fabworks.com/sheetmetalrender.png" alt="dashboard image"/>
                <img className="w-full hidden dark:block" src="https://www.fabworks.com/sheetmetalrender.png" alt="dashboard image"/>
                <div className="mt-4 md:mt-0">
                    <div className="mb-4">
                      <span className="px-3 py-1 text-sm font-semibold mr-2 border-green-400 border-[0.5px] leading-6 text-green-500 rounded-full bg-green-600/10 ring-1 ring-inset ring-green-600/20">Latest update</span>
                    </div>
                    <h2 className="mb-4 text-5xl tracking-tight font-bold text-white-900">Simple, Free, Modeling Software.</h2>
                    <p className="mb-6 font-medium text-gray-200 md:text-lg">No need to download any software, deal with versioning issues, and licenses. Everything you need is now online in Equinox.</p>
                    <SessionProvider>
                      <LoginButton/>
                    </SessionProvider>
                </div>
            </div>
        </div>
      </div>
    
  );
}
