from pymongo import mongo_client
import pymongo
from app.config import settings
import motor.motor_asyncio


client = pymongo.MongoClient(settings.MONGODB_URL)
db = client.database

try:
    conn = client.server_info()
    print(f'Connected to MongoDB {conn.get("version")}')
except Exception:
    print("Unable to connect to the MongoDB server.")

User = db.users
User.create_index([("email", pymongo.ASCENDING)], unique=True)

Post = db.posts
