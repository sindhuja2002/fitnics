from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from ..services.notifications import NotificationService
from ..models.schemas import NotificationSettingsInput

router = APIRouter()
notification_service = NotificationService()

class NotificationResponse(BaseModel):
    user_id: str
    settings: dict
    last_updated: datetime

@router.put("/settings/{user_id}", response_model=NotificationResponse)
async def update_notification_settings(user_id: str, settings: NotificationSettingsInput):
    """
    Update notification settings for a user
    """
    try:
        updated_settings = await notification_service.update_settings(user_id, settings)
        return NotificationResponse(
            user_id=user_id,
            settings=updated_settings,
            last_updated=datetime.utcnow()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/settings/{user_id}", response_model=NotificationResponse)
async def get_notification_settings(user_id: str):
    """
    Get notification settings for a user
    """
    try:
        settings = await notification_service.get_settings(user_id)
        return NotificationResponse(
            user_id=user_id,
            settings=settings,
            last_updated=datetime.utcnow()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/test/{user_id}", response_model=dict)
async def send_test_notification(user_id: str):
    """
    Send a test notification to a user
    """
    try:
        settings = await notification_service.get_settings(user_id)
        if not settings:
            raise HTTPException(status_code=400, detail="No notification settings found for user")
        
        if not settings.get("enabled"):
            raise HTTPException(status_code=400, detail="Notifications are disabled for user")
            
        if not settings.get("phone_number"):
            raise HTTPException(status_code=400, detail="No phone number configured for user")
            
        success = await notification_service.send_test_notification(user_id)
        if success:
            return {"status": "success", "message": "Test notification sent successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to send test notification. Please check the server logs for details.")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@router.post("/schedule", response_model=dict)
async def schedule_notifications():
    """
    Schedule notifications for all users based on their settings
    """
    try:
        success = await notification_service.send_scheduled_notifications()
        if success:
            return {"status": "success", "message": "Notifications scheduled successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to schedule notifications")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 