from typing import Optional
from fastapi import APIRouter
from pydantic import BaseModel
from fastapi.encoders import jsonable_encoder
from src.databaseutils import get_database
import uuid
import datetime
import json

router = APIRouter()

SECRET_KEY = "my_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 800

class BaseDashboard(BaseModel):
    jwt: str

class EditDocument(BaseDashboard):
    id: str

class DocumentDetails(BaseModel):
    username: str
    id: str

class SaveDocumentDetails(DocumentDetails):
    data: str

@router.post("/dashboard")
async def get_dashboard_content(dashboard_item: BaseDashboard):
    data = jsonable_encoder(dashboard_item)

    database = get_database()
    users = database["users"]
    print(data["jwt"])
    found_users = users.find({"jwt" : data["jwt"]})
    user = [i for i in found_users][0]
    
    print(user)
    
    
    return {
        'name': user["name"],
        'env': user["env"]
    }

@router.post("/add_env")
async def add_environmnet(dashboard_item: BaseDashboard):
    data = jsonable_encoder(dashboard_item)

    database = get_database()
    users = database["users"]
    print(data["jwt"])
    found_users = users.find({"jwt" : data["jwt"]})
    user = [i for i in found_users][0]

    today = datetime.date.today()

    print(user["env"])

    users.update_one(
        {"jwt":data["jwt"]},
        {
            "$set":{
                "env":[
                    {
                        "name": "Untitled Project",
                        "id": str(uuid.uuid4()),
                        "data": {
                            "stocks":{},
                            "converters":{},
                            "integration_method":"euler",
                            "dt":"0.25",
                            "end_time":"10",
                            "env_name":"Untitled Document",
                            "start_time":"0",
                            "names":["timestep"],
                            "state":{
                                "stock":[],
                                "flow":[],
                                "converter":[],
                                "connector":[]
                            }
                        },
                        "editHistory": today.strftime('%m/%d/%Y')
                    }
                ] + user["env"]
            }
        }
    )

    found_users = users.find({"jwt" : data["jwt"]})
    user = [i for i in found_users][0]
    
    return {
        'env': user["env"]
    }

@router.post("/delete_env")
async def delete_environment(document_details: EditDocument):
    data = jsonable_encoder(document_details)

    database = get_database()
    users = database["users"]
    print(data["jwt"])
    found_users = users.find({"jwt" : data["jwt"]})
    user = [i for i in found_users][0]

    user_env = user["env"]
    for i, env in enumerate(user_env):
        print(env)
        if env["id"] == data["id"]:
            user_env.pop(i)
            break

    users.update_one(
        {"jwt":data["jwt"]},
        {
            "$set":{
                "env": user_env
            }
        }
    )

    found_users = users.find({"jwt" : data["jwt"]})
    user = [i for i in found_users][0]
    
    return {
        'env': user["env"]
    }

@router.post("/get_env")
async def get_environment(document_details: DocumentDetails):
    data = jsonable_encoder(document_details)

    database = get_database()
    users = database["users"]
    found_users = users.find({"_id" : data["username"]})
    user = [i for i in found_users][0]

    user_env = user["env"]
    for i, env in enumerate(user_env):
        print(env["id"])
        if env["id"] == data["id"]:
            print(env["data"])
            return {
                'data': env["data"]
            }


@router.post("/save_env")
async def save_environment(document_details: SaveDocumentDetails):
    data = jsonable_encoder(document_details)

    database = get_database()
    users = database["users"]
    found_users = users.find({"_id" : data["username"]})
    user = [i for i in found_users][0]

    user_env = user["env"]
    for i, env in enumerate(user_env):
        print(env)
        if env["id"] == data["id"]:
            user_env[i]["data"] = json.loads(data["data"])
            user_env[i]["name"] = json.loads(data["data"])["env_name"]
            break

    users.update_one(
        {"_id":data["username"]},
        {
            "$set":{
                "env": user_env
            }
        }
    )
    
    return {
        'response': 200
    }