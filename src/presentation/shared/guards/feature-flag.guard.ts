import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { FEATURE_FLAG_KEY } from "../decorators/feature-flag.decorator";
import { FeatureFlagService } from "../../../infrastructure/feature-flags/feature-flag.service";

/**
 * Guard that checks if a feature flag is enabled before allowing access to an endpoint.
 */
@Injectable()
export class FeatureFlagGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly featureFlagService: FeatureFlagService
  ) {}

  /**
   * Determines if the current request should be allowed to proceed.
   *
   * @param context The execution context
   * @returns True if the feature flag is enabled, false otherwise
   */
  canActivate(context: ExecutionContext): boolean {
    // Get the feature flag from the route or controller metadata
    const requiredFlag = this.reflector.getAllAndOverride<string>(
      FEATURE_FLAG_KEY,
      [context.getHandler(), context.getClass()]
    );

    // If no feature flag is required, allow access
    if (!requiredFlag) {
      return true;
    }

    // Check if the feature flag is enabled
    const isEnabled = this.isFlagEnabled(requiredFlag);

    // Log the decision for debugging
    const request = context.switchToHttp().getRequest();
    console.log(
      `Feature flag "${requiredFlag}" ${isEnabled ? "enabled" : "disabled"} for ${request.method} ${request.url}`
    );

    return isEnabled;
  }

  /**
   * Checks if a feature flag is enabled using the FeatureFlagService.
   *
   * @param flag The name of the feature flag to check
   * @returns True if the feature flag is enabled, false otherwise
   */
  private isFlagEnabled(flag: string): boolean {
    return this.featureFlagService.isEnabled(flag);
  }
}
