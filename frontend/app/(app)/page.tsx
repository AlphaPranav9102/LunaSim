"use client"

import { GeneralNavbar } from "../_components/GeneralNavbar"
import type { NextPage } from 'next'
import { RequireToken } from "./auth"

const Home: NextPage = () => {

  return (
    <RequireToken>
      <div className="h-screen">
        <GeneralNavbar/>
        <div className=" ">
        <svg viewBox="0 0 1108 632" aria-hidden="true" className="absolute top-10 left-[calc(50%-4rem)] -z-10 w-[69.25rem] max-w-none transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"><path fill="url(#175c433f-44f6-4d59-93f0-c5c51ad5566d)" fill-opacity=".2" d="M235.233 402.609 57.541 321.573.83 631.05l234.404-228.441 320.018 145.945c-65.036-115.261-134.286-322.756 109.01-230.655C968.382 433.026 1031 651.247 1092.23 459.36c48.98-153.51-34.51-321.107-82.37-385.717L810.952 324.222 648.261.088 235.233 402.609Z"></path><defs><linearGradient id="175c433f-44f6-4d59-93f0-c5c51ad5566d" x1="1220.59" x2="-85.053" y1="432.766" y2="638.714" gradientUnits="userSpaceOnUse"><stop stop-color="#4F46E5"></stop><stop offset="1" stop-color="#80CAFF"></stop></linearGradient></defs></svg>
            <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
                <img className="w-full dark:hidden" src="https://www.fabworks.com/sheetmetalrender.png" alt="dashboard image"/>
                <img className="w-full hidden dark:block" src="https://www.fabworks.com/sheetmetalrender.png" alt="dashboard image"/>
                <div className="mt-4 md:mt-0">
                    <div className="h-12 mb-4">
                      <span className="px-3 py-1 text-sm font-semibold mr-2 border-blue-600 border-[0.5px] leading-6 text-blue-500 rounded-full bg-green-600/10 ring-1 ring-inset ring-green-600/20">Latest update</span>
                      <h1 className="inline text-sm ml-4 font-semibold text-gray-300">Autosaving models</h1>
                    </div>
                    <h2 className="mb-4 text-5xl tracking-tight font-bold text-white-900">Simple, Free, Modeling Software.</h2>
                    <p className="mb-6 font-[400] text-gray-300 md:text-lg">No need to download any software, deal with versioning issues, and licenses. Everything you need is now online in Equinox.</p>
                    <a href="/login" className="inline-flex items-center text-white bg-blue-600 focus:ring-4 focus:ring-blue-300 font-semibold rounded-lg text-sm px-5 py-2.5 text-center">
                        Log in
                        <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    </a>
                </div>
            </div>
        </div>
      </div>
    </RequireToken>
  );
}

export default Home
