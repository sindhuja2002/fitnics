from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from bson import ObjectId

class PyObjectId(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, _):
        if isinstance(v, ObjectId):
            return str(v)
        if isinstance(v, str):
            return v
        raise ValueError("Not a valid ObjectId")

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