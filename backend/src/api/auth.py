from typing import Optional
from fastapi import FastAPI, HTTPException, Depends, Request,status,APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from fastapi.encoders import jsonable_encoder
import jwt
from studentvue import StudentVue
from src.databaseutils import get_database

router = APIRouter()

SECRET_KEY = "my_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440

class LoginItem(BaseModel):
    username: str
    password: str

@router.post("/login")
async def login_user(login_item: LoginItem):
    data = jsonable_encoder(login_item)
    student = StudentVue(data['username'], data['password'], "md-mcps-psv.edupoint.com")
    
    database = get_database()
    users = database["users"]
    found_users = users.find({"_id" : data["username"]})
    
    user_list = [i for i in found_users]
    print(len(user_list))

    if list(student.get_student_info()) != ['RT_ERROR'] and len(user_list) == 1:
        encoded_jwt = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
        users.update_one(
            {"_id":data["username"]},
            {
                "$set":{
					"jwt":encoded_jwt
				}
			}
		)
       
        print(encoded_jwt)
        return {'token': encoded_jwt }
    else:
        return {'message': 'Login failed'}