from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import certifi

load_dotenv()

MONGODB_URL = os.getenv(
    "MONGODB_URL",
    "mongodb+srv://sindhufin0820:4toCXLcrxsICRU83@cluster0.macce.mongodb.net/fitnics"
)

# Create motor client
client = AsyncIOMotorClient(MONGODB_URL, tlsCAFile=certifi.where())
db = client.fitnics

# Collections
users_collection = db.users
analytics_collection = db.analytics
notification_settings_collection = db.notification_settings

# Create indexes
async def create_indexes():
    # Create indexes for analytics collection
    await analytics_collection.create_index([("user_id", 1)])
    await analytics_collection.create_index([("metric_type", 1)])
    await analytics_collection.create_index([("timestamp", 1)])

    # Create indexes for notification settings
    await notification_settings_collection.create_index([("user_id", 1)], unique=True)
    await notification_settings_collection.create_index([("enabled", 1)])

    # Create indexes for users
    await users_collection.create_index([("phone_number", 1)], unique=True, sparse=True) 