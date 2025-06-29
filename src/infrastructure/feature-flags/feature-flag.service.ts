import { Injectable } from '@nestjs/common';

/**
 * Service for managing feature flags.
 * This provides a centralized way to check if features are enabled.
 */
@Injectable()
export class FeatureFlagService {
  /**
   * Checks if a feature flag is enabled.
   *
   * @param flag The name of the feature flag to check
   * @returns True if the feature flag is enabled, false otherwise
   */
  isEnabled(flag: string): boolean {
    // First, try environment variable
    const envVarName = `FEATURE_${flag.toUpperCase().replace(/-/g, '_')}`;
    const envValue = process.env[envVarName];

    if (envValue !== undefined) {
      return envValue === 'true' || envValue === '1';
    }

    // Finally, check our default flags
    const defaultFlags: Record<string, boolean> = {
      'new-user-endpoint': process.env.NODE_ENV !== 'production',
    };

    return flag in defaultFlags ? defaultFlags[flag] : false;
  }
}
