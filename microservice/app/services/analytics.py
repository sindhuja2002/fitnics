from typing import List, Optional, Dict
from datetime import datetime, timedelta
import random
from ..models.database import analytics
from ..models.schemas import AnalyticsData, Metric

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
        """
        Get analytics data for a specific user with optional filters
        """
        try:
            query = {"user_id": user_id}
            if start_date:
                query["timestamp"] = {"$gte": start_date}
            if end_date:
                query["timestamp"] = {"$lte": end_date}
            if metric_type:
                query["metric_type"] = metric_type

            results = await self.collection.find(query).to_list(length=None)
            metrics = [self._convert_to_metric(doc) for doc in results]
            
            return {
                "user_id": user_id,
                "metrics": metrics,
                "time_range": {
                    "start": start_date or datetime.min,
                    "end": end_date or datetime.utcnow()
                },
                "summary": self._calculate_summary(results)
            }
        except Exception as e:
            print(f"Error getting user analytics: {str(e)}")
            # Return a valid empty response instead of an empty dict
            return {
                "user_id": user_id,
                "metrics": [],
                "time_range": {
                    "start": start_date or datetime.min,
                    "end": end_date or datetime.utcnow()
                },
                "summary": {
                    "total_metrics": 0,
                    "average_value": 0,
                    "metric_types": []
                }
            }

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