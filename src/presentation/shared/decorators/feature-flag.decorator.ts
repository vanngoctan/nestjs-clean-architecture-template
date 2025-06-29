import { SetMetadata } from "@nestjs/common";

export const FEATURE_FLAG_KEY = "featureFlag";

/**
 * Decorator that marks a controller or endpoint as protected by a feature flag.
 * The endpoint will only be accessible if the specified feature flag is enabled.
 *
 * @param flag The name of the feature flag to check
 * @returns The decorator function
 */
export const FeatureFlag = (flag: string) =>
  SetMetadata(FEATURE_FLAG_KEY, flag);
