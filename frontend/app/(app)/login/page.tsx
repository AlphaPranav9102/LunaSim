"use client"

import { GeneralNavbar } from "@/app/_components/GeneralNavbar";
import { useState } from "react";
import axios from "axios"
import { fetchToken, setToken, setUser } from "../auth";

export default function Page() {
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")

    const login = () =>{
      if(name === '' && password === ''){
          return
      }else{
          console.log('axios')
          axios.post('http://localhost:8000/auth/login', {
              username: name,
              password: password
          })
          .then(function (response) {
              if(response.data.token){
                  setToken(response.data.token)
                  console.log(fetchToken())
                  window.location.href = '/dashboard';
                  setUser(name)
              }
          })
          .catch(function (error) {
              console.log(error, 'error');
          });
      }
     
  }

    return (
        <div className="h-screen">
            <div className="">
            <section className="">
            <svg viewBox="0 0 1108 632" aria-hidden="true" className="absolute top-10 left-[calc(50%-4rem)] -z-10 w-[69.25rem] max-w-none transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"><path fill="url(#175c433f-44f6-4d59-93f0-c5c51ad5566d)" fill-opacity=".2" d="M235.233 402.609 57.541 321.573.83 631.05l234.404-228.441 320.018 145.945c-65.036-115.261-134.286-322.756 109.01-230.655C968.382 433.026 1031 651.247 1092.23 459.36c48.98-153.51-34.51-321.107-82.37-385.717L810.952 324.222 648.261.088 235.233 402.609Z"></path><defs><linearGradient id="175c433f-44f6-4d59-93f0-c5c51ad5566d" x1="1220.59" x2="-85.053" y1="432.766" y2="638.714" gradientUnits="userSpaceOnUse"><stop stop-color="#4F46E5"></stop><stop offset="1" stop-color="#80CAFF"></stop></linearGradient></defs></svg>
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo"/>
                        Equinox.    
                    </a>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Sign In
                            </h1>
                              <div>
                                  <label htmlFor="id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                  <input type="text" name="id" id="id" className="border text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 dark:text-white focus:ring-blue-500 focus:border-blue-500" placeholder="123456"
                                      onChange={(e) => setName(e.target.value)}
                                  />
                              </div>
                              <div>
                                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                  <input type="password" name="password" id="password" placeholder="••••••••" className="border text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                                      onChange={(e) => setPassword(e.target.value)}
                                  />
                              </div>
                              <button onClick={login} className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Sign In</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
      </div>
    )
}