"use client"

import { useEffect, useState } from "react"
import  AccountNavbar  from "../../_components/AccountNavbar"
import { RequireToken, fetchToken } from "../auth"
import axios from "axios"
import Head from "next/head"
import DocumentCard from "./documentCard"

export default function Page() {

    const [name, setName] = useState("")
    const [dashboardItems, setDashboardItems] = useState([])

    useEffect(() => {
        var jwtToken = fetchToken()
        axios.post('http://localhost:8000/user/dashboard', {
            jwt: jwtToken,
        })
        .then(function (response) {
            setName(response.data.name)
            setDashboardItems(response.data.env)
        })
        .catch(function (error) {
            console.log(error, 'error');
        });
    }, [])

    const newEnv = () => {
        var jwtToken = fetchToken()
        axios.post('http://localhost:8000/user/add_env', {
            jwt: jwtToken,
        })
        .then(function (response) {
            setDashboardItems(response.data.env)
        })
        .catch(function (error) {
            console.log(error, 'error');
        });
    }

    return (
        <div className="min-h-screen">
            <Head>
                <title>Equinox | Dashboard</title>
                <meta property="og:title" content="Equinox | Dashboard" key="title" />
            </Head>
            <RequireToken>
                <AccountNavbar accountName={name}/>
                <svg viewBox="0 0 1108 632" aria-hidden="true" className="absolute top-10 left-[calc(50%-4rem)] -z-10 w-[69.25rem] max-w-none transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"><path fill="url(#175c433f-44f6-4d59-93f0-c5c51ad5566d)" fill-opacity=".2" d="M235.233 402.609 57.541 321.573.83 631.05l234.404-228.441 320.018 145.945c-65.036-115.261-134.286-322.756 109.01-230.655C968.382 433.026 1031 651.247 1092.23 459.36c48.98-153.51-34.51-321.107-82.37-385.717L810.952 324.222 648.261.088 235.233 402.609Z"></path><defs><linearGradient id="175c433f-44f6-4d59-93f0-c5c51ad5566d" x1="1220.59" x2="-85.053" y1="432.766" y2="638.714" gradientUnits="userSpaceOnUse"><stop stop-color="#4F46E5"></stop><stop offset="1" stop-color="#80CAFF"></stop></linearGradient></defs></svg>
                <section className="p-3 sm:p-5 mt-20">
                    <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
                        <h1 className="text-3xl font-bold mb-10">Welcome, {name}</h1>
                        <div className="relative shadow-md sm:rounded-lg overflow-hidden">
                            <div className="bg-gray-800 rounded-lg flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                                <h1 className="inline font-medium text-md">{dashboardItems.length} Documents Found</h1>
                                <div className="hidden w-full md:w-1/2">
                                    <form className="flex items-center">
                                        <label htmlFor="simple-search" className="sr-only">Search</label>
                                        <div className="relative w-full">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <svg aria-hidden="true" className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                                                </svg>
                                            </div>
                                            <input type="text" id="simple-search" className="border text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-primary-500" placeholder="Search"/>
                                        </div>
                                    </form>
                                </div>
                                <div className="float-right w-full bg-blue-600 rounded-lg md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                                    <button type="button" onClick={newEnv} className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-primary-800">
                                        <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path clip-rule="evenodd" fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                                        </svg>
                                        Add environoment
                                    </button>
                                </div>
                            </div>
                            <div className="w-full mt-4 bg-gray-900 flex flex-col gap-[12px]">
                                { dashboardItems.map((environment, key) => (
                                    <DocumentCard 
                                        name={environment["name"]}
                                        key={key}
                                        editHistory={environment["editHistory"]} 
                                        id={environment["id"]} 
                                        setDashboardItems={setDashboardItems}                                    
                                    />
                                ))}
                                
                            </div> 
                        </div>
                    </div>
                    </section>
            </RequireToken>
        </div>
    )
}