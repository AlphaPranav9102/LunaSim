import Link from "next/link"
import { fetchToken, fetchUser } from "../auth"
import axios from "axios"

interface documentProps {
    name: String,
    editHistory: String,
    id: String,
    setDashboardItems: any
}

export default function DocumentCard(props: documentProps) {

    const url = `http://localhost:3000/env/create.html?id=${props.id}&username=${fetchUser()}`

    const deleteEnv = () => {
        var jwtToken = fetchToken()
        axios.post('http://localhost:8000/user/delete_env', {
            jwt: jwtToken,
            id: props.id
        })
        .then(function (response) {
            props.setDashboardItems(response.data.env)
        })
        .catch(function (error) {
            console.log(error, 'error');
        });
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url)
    }

    return(
        <div className="w-full h-20 bg-gray-700 rounded-md py-2 px-4">   
            <div className="mb-2">
                <Link href={url}>
                    <img className="select-none inline h-6 w-6 rounded-md mr-4" src="https://replit.com/cdn-cgi/image/width=48,quality=80,format=auto/https://storage.googleapis.com/replit/images/1664475688613_6389b0b7355db425d8a6f234809ddd35.jpeg"/>
                    <h1 className="select-none inline text-md font-semibold mr-4">{props.name}</h1>
                    <h1 className="select-none inline text-sm font-regular -mt-1">{props.editHistory}</h1>
                </Link>
                <button className="float-right text-sm select-none w-2 font-bold mt-[4px]" onClick={deleteEnv}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" height="10px" width="10px" version="1.1" id="Capa_1" viewBox="0 0 460.775 460.775">
                        <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55  c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55  c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505  c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55  l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719  c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"/>
                    </svg>
                </button>
                <button className="float-right mr-4 text-sm select-none w-2" onClick={copyToClipboard}>🔗</button>
                
            </div>
            <div>
                <svg className="inline mr-2" preserveAspectRatio="xMidYMin" width="16" height="16" viewBox="0 0 24 24" fill="#ffffff" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.77997 11.25H7.28229C7.48347 8.23408 8.53193 5.34326 10.296 2.90662C6.2409 3.66174 3.11597 7.06245 2.77997 11.25ZM12 3.14873C10.1266 5.45651 9.00431 8.28426 8.78597 11.25H15.214C14.9957 8.28426 13.8734 5.45651 12 3.14873ZM15.214 12.75C14.9957 15.7157 13.8734 18.5435 12 20.8513C10.1266 18.5435 9.00431 15.7157 8.78597 12.75H15.214ZM7.28229 12.75H2.77997C3.11597 16.9376 6.2409 20.3383 10.296 21.0934C8.53193 18.6567 7.48347 15.7659 7.28229 12.75ZM13.704 21.0934C15.4681 18.6567 16.5165 15.7659 16.7177 12.75H21.22C20.884 16.9376 17.7591 20.3383 13.704 21.0934ZM21.22 11.25H16.7177C16.5165 8.23408 15.4681 5.34326 13.704 2.90662C17.7591 3.66174 20.884 7.06245 21.22 11.25ZM1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12Z"></path></svg>
                <h1 className="inline text-sm font-medium">Public</h1>
            </div>
        </div>
)
}