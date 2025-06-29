import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

/**
 * Notification processor that handles jobs from the notification queue.
 * This consumer processes notification jobs asynchronously.
 */
@Processor('notification')
export class NotificationConsumer extends WorkerHost {
  private readonly logger = new Logger(NotificationConsumer.name);

  /**
   * Process method for the notification queue.
   * BullMQ uses a single process method that handles all job types.
   * @param job The BullMQ job containing the notification data
   */
  async process(job: Job) {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}`);

    try {
      // Route the job to the appropriate handler based on the job name
      switch (job.name) {
        case 'welcome-email':
          return await this.processWelcomeEmail(job);
        case 'general-notification':
          return await this.processGeneralNotification(job);
        default:
          this.logger.warn(`Unknown job type: ${job.name}`);
          return { success: false, error: `Unknown job type: ${job.name}` };
      }
    } catch (error) {
      this.logger.error(
        `Failed to process job ${job.id} of type ${job.name}`,
        error.stack,
      );
      throw error; // Rethrow to let BullMQ handle the retry logic
    }
  }

  /**
   * Process a welcome email notification job
   * @param job The BullMQ job containing the welcome email data
   */
  private async processWelcomeEmail(
    job: Job<{ userId: string; email: string; name: string }>,
  ) {
    this.logger.debug(`Processing welcome email for user ${job.data.email}`);

    // In a real application, we would integrate with an email service here
    // Example:
    // await this.emailService.sendWelcomeEmail({
    //   to: job.data.email,
    //   name: job.data.name
    // });

    this.logger.log(`Welcome email sent successfully to ${job.data.email}`);
    return { success: true };
  }

  /**
   * Process a general notification job
   * @param job The BullMQ job containing the general notification data
   */
  private async processGeneralNotification(
    job: Job<{ userId: string; message: string }>,
  ) {
    this.logger.debug(
      `Processing general notification job ${job.id} for user ${job.data.userId}`,
    );

    try {
      // In a real application, this could dispatch to different notification channels
      // based on user preferences (push notification, SMS, etc.)
      this.logger.log(
        `Notification processed: ${job.data.message} for user ${job.data.userId}`,
      );
      return { processed: true };
    } catch (error) {
      this.logger.error(
        `Failed to process notification for user ${job.data.userId}`,
        error.stack,
      );
      throw error;
    }
  }
}
