import { redirect } from "next/dist/server/api-utils";
import { setToken, setUser } from "../(app)/auth";

interface NavbarProps {
    accountName?: String;
    imageUrl?: String;
}

export default function AccountNavbar(props: NavbarProps) {

    const logout = () => {
        setToken("")
        setUser("")
        window.location.href = "/"
    }

    return (
        <header>
            <nav className="border-gray-200 px-4 lg:px-6 py-2.5">
                
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <a href="/" className="flex items-center text-white text-2xl font-semibold">
                    <h1>Equinox.</h1>
                    </a>
                    <div className="flex items-center lg:order-2">
                        <img className="bg-white rounded-full w-[35px] h-[35px] mr-4 mt-[4px]"
                            src="https://static-cdn.jtvnw.net/user-default-pictures-uv/998f01ae-def8-11e9-b95c-784f43822e80-profile_image-70x70.png"
                        >
                        </img>
                        <h1 id="dropdownInformationButton" data-dropdown-toggle="dropdownInformation" className="font-semibold">
                            {props.accountName}
                        </h1>
                        <button type="button" onClick={logout} className="ml-4 flex items-center justify-center bg-blue-600 text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-primary-800">
                            Logout
                        </button>

                    </div>
                    
                </div>
            </nav>
        </header>
    )
}