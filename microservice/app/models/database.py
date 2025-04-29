from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic.json_schema import JsonSchemaValue
import certifi

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler):
        return {'type': 'string', 'pattern': '^[0-9a-fA-F]{24}$', 'description': 'MongoDB ObjectId'}

    def __str__(self):
        return str(self)

class User(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    name: str
    email: str
    phone_number: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
    preferences: dict = Field(default_factory=dict)

    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={ObjectId: str}
    )

class Analytics(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    metric_type: str
    value: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: dict = Field(default_factory=dict)

    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={ObjectId: str}
    )

class NotificationSettings(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    phone_number: str
    enabled: bool = True
    reminder_times: List[str] = Field(default_factory=list)
    notification_types: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={ObjectId: str}
    )

# Database connection
client = AsyncIOMotorClient("mongodb+srv://sindhufin0820:4toCXLcrxsICRU83@cluster0.macce.mongodb.net/fitnics", tlsCAFile=certifi.where())
db = client.fitnics

# Collections
users = db.users
analytics = db.analytics
notification_settings = db.notification_settings 