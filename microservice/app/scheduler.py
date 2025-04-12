import asyncio
from datetime import datetime, timedelta
from app.services.notifications import NotificationService
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class NotificationScheduler:
    def __init__(self):
        self.notification_service = NotificationService()
        self.running = False
        self.task = None

    async def check_notifications(self):
        """
        Check if it's time to send notifications to any user
        """
        try:
            # In a real application, you would:
            # 1. Get all users with enabled notifications from the database
            # 2. For each user, check their reminder times
            # 3. Send notifications if needed
            logger.info("Checking notifications...")
            # Placeholder for actual implementation
            pass
        except Exception as e:
            logger.error(f"Error in notification check: {str(e)}")

    async def start(self):
        """
        Start the scheduler
        """
        if self.running:
            logger.warning("Scheduler is already running")
            return

        self.running = True
        logger.info("Notification scheduler started")
        
        try:
            while self.running:
                await self.check_notifications()
                # Check every minute
                await asyncio.sleep(60)
        except asyncio.CancelledError:
            logger.info("Scheduler task cancelled")
            raise
        except Exception as e:
            logger.error(f"Unexpected error in scheduler: {str(e)}")
            raise
        finally:
            self.running = False
            logger.info("Notification scheduler stopped")

    def stop(self):
        """
        Stop the scheduler
        """
        if not self.running:
            return
            
        self.running = False
        if self.task and not self.task.done():
            self.task.cancel()
        logger.info("Notification scheduler stopped")

# Create a global scheduler instance
scheduler = NotificationScheduler()

async def send_scheduled_notifications():
    """
    Send scheduled notifications to all users
    """
    try:
        await scheduler.notification_service.send_scheduled_notifications()
    except Exception as e:
        logger.error(f"Error in scheduled notifications: {str(e)}")

async def start_scheduler():
    """
    Start the notification scheduler
    """
    if scheduler.task and not scheduler.task.done():
        logger.warning("Scheduler is already running")
        return scheduler.task
        
    scheduler.task = asyncio.create_task(scheduler.start())
    return scheduler.task

async def stop_scheduler():
    """
    Stop the notification scheduler
    """
    scheduler.stop()
    if scheduler.task and not scheduler.task.done():
        try:
            await scheduler.task
        except asyncio.CancelledError:
            pass 