from typing import List, Optional, Dict
from datetime import datetime, time
import os
from twilio.rest import Client
from ..models.database import notification_settings
from ..models.schemas import NotificationSettingsInput

class NotificationService:
    def __init__(self):
        self.collection = notification_settings
        # Initialize Twilio client with environment variables
        self.twilio_client = None
        self.messaging_service_sid = None
        try:
            # Get environment variables with fallback to empty string
            account_sid = 'ACf9c31cc4584231fc4e208f0301e30dec'
            auth_token =  '646ccd2c2fd0e891215f084eadba84e3'
            self.messaging_service_sid ='MGaac1575780692c99c8cb11fefa9ad867'
            
            print(f"Initializing Twilio with Account SID: {account_sid[:5]}...")
            print(f"Using Twilio Messaging Service SID: {self.messaging_service_sid}")
            
            # Check if any credentials are empty
            missing_credentials = []
            if not account_sid:
                missing_credentials.append("TWILIO_ACCOUNT_SID")
            if not auth_token:
                missing_credentials.append("TWILIO_AUTH_TOKEN")
            if not self.messaging_service_sid:
                missing_credentials.append("TWILIO_MESSAGING_SERVICE_SID")
                
            if missing_credentials:
                print(f"Warning: Missing Twilio credentials: {', '.join(missing_credentials)}")
                print("Notifications will not be sent until credentials are properly configured.")
                return
                
            # Initialize Twilio client
            try:
                self.twilio_client = Client(account_sid, auth_token)
                # Test the client by getting account info
                account = self.twilio_client.api.accounts(account_sid).fetch()
                print(f"Twilio client initialized successfully for account: {account.friendly_name}")
            except Exception as e:
                print(f"Error initializing Twilio client: {str(e)}")
                self.twilio_client = None
                return
                
        except Exception as e:
            print(f"Warning: Twilio client initialization failed: {str(e)}")
            self.twilio_client = None
            self.messaging_service_sid = None

    async def update_settings(self, user_id: str, settings: NotificationSettingsInput) -> Dict:
        """
        Update notification settings for a user
        """
        try:
            settings_dict = settings.dict()
            settings_dict["updated_at"] = datetime.utcnow()
            
            await self.collection.update_one(
                {"user_id": user_id},
                {"$set": settings_dict},
                upsert=True
            )
            return settings_dict
        except Exception as e:
            print(f"Error updating notification settings: {str(e)}")
            return {}

    async def get_settings(self, user_id: str) -> Dict:
        """
        Get notification settings for a user
        """
        try:
            settings = await self.collection.find_one({"user_id": user_id})
            if not settings:
                return {
                    "user_id": user_id,
                    "phone_number": "",
                    "enabled": False,
                    "reminder_times": [],
                    "notification_types": []
                }
            
            # Convert MongoDB document to dict and remove _id
            settings_dict = dict(settings)
            settings_dict.pop('_id', None)
            return settings_dict
        except Exception as e:
            print(f"Error getting notification settings: {str(e)}")
            return {}

    async def send_test_notification(self, user_id: str) -> bool:
        """
        Send a test notification to a user
        """
        try:
            print(f"\nAttempting to send test notification for user: {user_id}")
            settings = await self.get_settings(user_id)
            if not settings:
                print(f"Error: No settings found for user {user_id}")
                return False

            if not settings.get("enabled"):
                print(f"Error: Notifications are disabled for user {user_id}")
                return False

            phone_number = settings.get("phone_number")
            if not phone_number:
                print(f"Error: No phone number configured for user {user_id}")
                return False

            if not self.twilio_client or not self.messaging_service_sid:
                print("Error: Twilio client not properly initialized. Please check your Twilio credentials.")
                return False

            message = "This is a test notification from Fitnics!"
            print(f"Sending message to {phone_number} using messaging service {self.messaging_service_sid}")
            try:
                self.twilio_client.messages.create(
                    messaging_service_sid=self.messaging_service_sid,
                    body=message,
                    to=phone_number
                )
                print(f"Successfully sent test notification to {phone_number}")
                return True
            except Exception as e:
                print(f"Error sending Twilio message: {str(e)}")
                return False

        except Exception as e:
            print(f"Error in send_test_notification: {str(e)}")
            return False

    async def send_scheduled_notifications(self) -> bool:
        """
        Send scheduled notifications to all users
        """
        try:
            current_time = datetime.now().time()
            users = await self.collection.find({"enabled": True}).to_list(length=None)
            
            for user in users:
                reminder_times = [time.fromisoformat(t) for t in user.get("reminder_times", [])]
                if current_time in reminder_times:
                    await self.send_notification(user["user_id"])
            
            return True
        except Exception as e:
            print(f"Error sending scheduled notifications: {str(e)}")
            return False

    async def send_notification(self, user_id: str) -> bool:
        """
        Send a notification to a specific user
        """
        try:
            settings = await self.get_settings(user_id)
            if not settings or not settings.get("enabled"):
                return False

            message = "Time for your Fitnics activity!"
            if self.twilio_client and self.messaging_service_sid:
                self.twilio_client.messages.create(
                    messaging_service_sid=self.messaging_service_sid,
                    body=message,
                    to=settings['phone_number']
                )
            else:
                print(f"Simulating notification to {settings['phone_number']}: {message}")
            return True
        except Exception as e:
            print(f"Error sending notification: {str(e)}")
            return False 
