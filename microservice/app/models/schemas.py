from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from bson import ObjectId

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

class Metric(BaseModel):
    """
    Schema for individual metric data
    """
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    metric_type: str
    value: float
    timestamp: datetime
    metadata: Dict[str, Any] = Field(default_factory=dict)

    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={ObjectId: str},
        arbitrary_types_allowed=True
    )

class AnalyticsData(BaseModel):
    """
    Schema for analytics data input
    """
    user_id: str
    metric_type: str
    value: float
    timestamp: Optional[datetime] = Field(default_factory=datetime.utcnow)
    metadata: Dict = Field(default_factory=dict)

    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={ObjectId: str}
    )

class NotificationSettingsInput(BaseModel):
    """
    Schema for notification settings input
    """
    user_id: str
    phone_number: str
    enabled: bool = True
    reminder_times: list[str] = Field(default_factory=list)
    notification_types: list[str] = Field(default_factory=list)

    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={ObjectId: str}
    )

class UserInput(BaseModel):
    """
    Schema for user input
    """
    user_id: str
    name: str
    email: str
    phone_number: str
    preferences: Dict = Field(default_factory=dict)

    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={ObjectId: str}
    ) 