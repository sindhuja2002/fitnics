from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime, timedelta
from ..services.analytics import AnalyticsService
from ..models.schemas import AnalyticsData, Metric
from bson import ObjectId

router = APIRouter()
analytics_service = AnalyticsService()

class AnalyticsResponse(BaseModel):
    user_id: str
    metrics: List[Metric]
    time_range: dict
    summary: dict

    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={ObjectId: str},
        arbitrary_types_allowed=True
    )

@router.post("/track")
async def track_analytics(data: AnalyticsData):
    """
    Track analytics data for a user
    """
    try:
        success = await analytics_service.track_analytics(data)
        if success:
            return {"status": "success", "message": "Analytics data tracked successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to track analytics data")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/{user_id}", response_model=AnalyticsResponse)
async def get_user_analytics(
    user_id: str,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    metric_type: Optional[str] = None
):
    """
    Get analytics data for a specific user
    """
    try:
        data = await analytics_service.get_user_analytics(user_id, start_date, end_date, metric_type)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/{user_id}/weekly", response_model=AnalyticsResponse)
async def get_weekly_analytics(user_id: str):
    """
    Get weekly analytics summary for a user
    """
    try:
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=7)
        data = await analytics_service.get_user_analytics(user_id, start_date, end_date)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-sample/{user_id}")
async def generate_sample_data(user_id: str, days: int = 30):
    """
    Generate sample analytics data for a user
    """
    try:
        print(f"Generating sample data for user {user_id} for {days} days")
        success = await analytics_service.generate_sample_data(user_id, days)
        if success:
            return {"status": "success", "message": f"Generated {days} days of sample analytics data"}
        else:
            raise HTTPException(status_code=500, detail="Failed to generate sample data")
    except Exception as e:
        print(f"Error generating sample data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 