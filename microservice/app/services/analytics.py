from typing import List, Optional, Dict
from datetime import datetime, timedelta
import random
from ..models.database import analytics
from ..models.schemas import AnalyticsData, Metric
from fastapi import HTTPException

class AnalyticsService:
    def __init__(self):
        self.collection = analytics

    def _convert_to_metric(self, doc: Dict) -> Metric:
        """
        Convert a MongoDB document to a Metric object
        """
        return Metric(
            id=doc.get("_id"),
            user_id=doc.get("user_id"),
            metric_type=doc.get("metric_type"),
            value=doc.get("value"),
            timestamp=doc.get("timestamp"),
            metadata=doc.get("metadata", {})
        )

    async def generate_sample_data(self, user_id: str, days: int = 30) -> bool:
        """
        Generate sample analytics data for a user
        """
        try:
            # Define metric types and their ranges
            metric_types = {
                "steps": (5000, 15000),
                "calories_burned": (200, 800),
                "workout_duration": (20, 120),
                "heart_rate": (60, 160),
                "weight": (60, 80),
                "sleep_duration": (4, 9)
            }
            
            # Generate data for each day
            for day in range(days):
                date = datetime.utcnow() - timedelta(days=day)
                
                # Generate data for each metric type
                for metric_type, (min_val, max_val) in metric_types.items():
                    # Add some randomness to make data more realistic
                    value = random.uniform(min_val, max_val)
                    if metric_type in ["weight", "sleep_duration"]:
                        # These metrics should change more gradually
                        value = round(value, 1)
                    else:
                        value = round(value)
                    
                    # Create analytics data
                    data = AnalyticsData(
                        user_id=user_id,
                        metric_type=metric_type,
                        value=value,
                        timestamp=date,
                        metadata={
                            "source": "sample_data",
                            "day_of_week": date.strftime("%A"),
                            "is_weekend": date.weekday() >= 5
                        }
                    )
                    
                    # Insert into database
                    await self.collection.insert_one(data.dict())
            
            print(f"Generated {days * len(metric_types)} sample analytics records for user {user_id}")
            return True
        except Exception as e:
            print(f"Error generating sample data: {str(e)}")
            return False

    async def track_analytics(self, data: AnalyticsData) -> bool:
        """
        Track analytics data for a user
        """
        try:
            await self.collection.insert_one(data.dict())
            return True
        except Exception as e:
            print(f"Error tracking analytics: {str(e)}")
            return False

    async def get_user_analytics(
        self,
        user_id: str,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        metric_type: Optional[str] = None
    ) -> Dict:
        try:
            query = {"user_id": user_id}
            
            if start_date or end_date:
                query["timestamp"] = {}
                if start_date:
                    query["timestamp"]["$gte"] = start_date
                if end_date:
                    query["timestamp"]["$lte"] = end_date
            
            if metric_type:
                query["metric_type"] = metric_type

            # Use aggregation pipeline for better performance
            pipeline = [
                {"$match": query},
                {"$sort": {"timestamp": 1}},
                {"$project": {
                    "_id": 0,
                    "user_id": 1,
                    "metric_type": 1,
                    "value": 1,
                    "timestamp": 1,
                    "metadata": 1
                }}
            ]

            cursor = self.collection.aggregate(pipeline)
            results = await cursor.to_list(length=None)
            
            # Return a properly structured response
            return {
                "user_id": user_id,
                "metrics": results,
                "time_range": {
                    "start": start_date or datetime.min,
                    "end": end_date or datetime.utcnow()
                },
                "summary": {
                    "total_metrics": len(results),
                    "average_value": sum(metric.get("value", 0) for metric in results) / len(results) if results else 0,
                    "metric_types": list(set(metric.get("metric_type") for metric in results))
                }
            }
        except Exception as e:
            logger.error(f"Error getting user analytics: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to get user analytics: {str(e)}"
            )

    async def get_weekly_analytics(
        self,
        user_id: str,
        week_start: datetime
    ) -> Dict:
        try:
            week_end = week_start + timedelta(days=7)
            
            # Use aggregation pipeline for better performance
            pipeline = [
                {
                    "$match": {
                        "user_id": user_id,
                        "timestamp": {
                            "$gte": week_start,
                            "$lt": week_end
                        }
                    }
                },
                {
                    "$group": {
                        "_id": "$metric_type",
                        "total": {"$sum": "$value"},
                        "average": {"$avg": "$value"},
                        "count": {"$sum": 1},
                        "min": {"$min": "$value"},
                        "max": {"$max": "$value"}
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "metric_type": "$_id",
                        "total": 1,
                        "average": 1,
                        "count": 1,
                        "min": 1,
                        "max": 1
                    }
                }
            ]

            cursor = self.collection.aggregate(pipeline)
            results = await cursor.to_list(length=None)
            
            return {
                "week_start": week_start,
                "week_end": week_end,
                "metrics": results
            }
        except Exception as e:
            logger.error(f"Error getting weekly analytics: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to get weekly analytics: {str(e)}"
            )

    async def get_weekly_summary(self, user_id: str) -> Dict:
        """
        Get weekly analytics summary for a user
        """
        try:
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=7)
            
            return await self.get_user_analytics(user_id, start_date, end_date)
        except Exception as e:
            print(f"Error getting weekly summary: {str(e)}")
            return {}

    def _calculate_summary(self, metrics: List[Dict]) -> Dict:
        """
        Calculate summary statistics from metrics
        """
        if not metrics:
            return {
                "total_metrics": 0,
                "average_value": 0,
                "metric_types": []
            }

        total_value = sum(metric.get("value", 0) for metric in metrics)
        metric_types = list(set(metric.get("metric_type") for metric in metrics))

        return {
            "total_metrics": len(metrics),
            "average_value": total_value / len(metrics),
            "metric_types": metric_types
        } 