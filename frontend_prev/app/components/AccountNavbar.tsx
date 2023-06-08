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
                        <div className="bg-white rounded-full w-10 h-10 mr-4">
                        </div>
                        <h1 className="font-semibold">
                            {props.accountName}
                        </h1>
                    </div>
                    
                </div>
            </nav>
        </header>
    )
}