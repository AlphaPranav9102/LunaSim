import { RequireToken, fetchToken, fetchUser } from "../auth"
import axios from "axios"
import { Dropdown } from 'flowbite';
import type { DropdownInterface } from "flowbite";
import { redirect } from "next/navigation";

interface documentProps {
    name: String,
    editHistory: String,
    id: String,
    setDashboardItems: any
}

export default function DocumentCard(props: documentProps) {

    const url = `/env/create.html?id=${props.id}&username=${fetchUser()}`

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

    return(
        <div className="w-full h-20 bg-gray-700 rounded-md py-2 px-4">   
            <div className="mb-2">
                <a href={url}>
                    <img className="select-none inline h-6 w-6 rounded-md mr-4" src="https://replit.com/cdn-cgi/image/width=48,quality=80,format=auto/https://storage.googleapis.com/replit/images/1664475688613_6389b0b7355db425d8a6f234809ddd35.jpeg"/>
                    <h1 className="select-none inline text-md font-semibold mr-4">{props.name}</h1>
                    <h1 className="select-none inline text-sm font-regular -mt-1">{props.editHistory}</h1>
                </a>
                <button className="float-right -mr-4 text-sm select-none" onClick={deleteEnv}><svg xmlns="http://www.w3.org/2000/svg" className="fill-white" height="20" viewBox="0 -960 960 960" width="48"><path d="M261-120q-24.75 0-42.375-17.625T201-180v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z"/></svg></button>
                
            </div>
            <div>
                <svg className="inline mr-2" preserveAspectRatio="xMidYMin" width="16" height="16" viewBox="0 0 24 24" fill="#ffffff" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.77997 11.25H7.28229C7.48347 8.23408 8.53193 5.34326 10.296 2.90662C6.2409 3.66174 3.11597 7.06245 2.77997 11.25ZM12 3.14873C10.1266 5.45651 9.00431 8.28426 8.78597 11.25H15.214C14.9957 8.28426 13.8734 5.45651 12 3.14873ZM15.214 12.75C14.9957 15.7157 13.8734 18.5435 12 20.8513C10.1266 18.5435 9.00431 15.7157 8.78597 12.75H15.214ZM7.28229 12.75H2.77997C3.11597 16.9376 6.2409 20.3383 10.296 21.0934C8.53193 18.6567 7.48347 15.7659 7.28229 12.75ZM13.704 21.0934C15.4681 18.6567 16.5165 15.7659 16.7177 12.75H21.22C20.884 16.9376 17.7591 20.3383 13.704 21.0934ZM21.22 11.25H16.7177C16.5165 8.23408 15.4681 5.34326 13.704 2.90662C17.7591 3.66174 20.884 7.06245 21.22 11.25ZM1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12Z"></path></svg>
                <h1 className="inline text-sm font-medium">Public</h1>
            </div>
        </div>
)
}