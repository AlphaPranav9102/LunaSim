from pymongo import MongoClient

def get_database():
    CONNECTION_STRING = "mongodb+srv://pkarthikeyan:Dif1QwUamR6nhmvn@equinox.0x2nbec.mongodb.net/?retryWrites=true&w=majority"
    client = MongoClient(CONNECTION_STRING)
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(e)
    return client['equinox']

if __name__ == "__main__":
    db = get_database()
    collection = db["users"]

    item_1 = {
        "_id" : "131302",
        "jwt" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhc3l1ZUBnbWFpbC5jb20iLCJwYXNzd29yZCI6IjEyMzQifQ.n4dzjCE5MOKVYjE7hqy-dyNTPabU_BCZeJhnJwIuiTg",
        "env" : [
            {
                "name": "Project 1",
                "id": "3b387536d51e5c045256364275533aa4",
                "data": {},
                "editHistory": "5/17/2023"
            },
            {
                "name": "Catapult Project",
                "id": "1a807a02b2843d7256f32be3677f5ce4",
                "data": {},
                "editHistory": "4/21/2023"
            },
            {
                "name": "The final project",
                "id": "2b3f68fbf7c35169b2a5629f997c9285",
                "data": {},
                "editHistory": "2/13/2023"
            }
        ],
        "name": "Pranav Karthikeyan"
    }

    collection.insert_one(item_1)


   
