import { Injectable, Inject } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

/**
 * Custom metrics specific to user-related operations.
 */
@Injectable()
export class UserMetrics {
  constructor(
    @InjectMetric('user_creation_total')
    private readonly userCreationCounter: Counter<string>,

    @InjectMetric('user_already_exists_total')
    private readonly userAlreadyExistsCounter: Counter<string>,
  ) {}

  /**
   * Increment the counter for user creation attempts
   * @param status The result status (success/failure)
   */
  incrementUserCreation(status: 'success' | 'failure'): void {
    this.userCreationCounter.inc({ status });
  }

  /**
   * Increment the counter for attempts with existing emails
   * @param email The email that was attempted
   */
  incrementUserAlreadyExists(email: string): void {
    const domain = email.split('@')[1] || 'unknown';
    this.userAlreadyExistsCounter.inc({ email_domain: domain });
  }
}
