interface NavbarProps {
    accountName?: String;
    imageUrl?: String;
}

export default function AccountNavbar(props: NavbarProps) {
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
                        <h1 className="font-semibold">
                            {props.accountName}
                        </h1>
                    </div>
                    
                </div>
            </nav>
        </header>
    )
}