import { getAllPlatformsApi } from "@/services/apis/platforms.api";
import AdvancedSettingsSkeleton from "./advanced-settings-skeleton";
import AdvancedSettings from "./advanced-settings";

export default async function AdvancedSettingsWrapper() {
  const allPlatformsResponse = await getAllPlatformsApi();

  if (!allPlatformsResponse.ok) {
    return (
      <AdvancedSettingsSkeleton>
        <div className="flex h-53.75 items-center justify-center p-4">
          <p className="text-sm text-red-500">
            {allPlatformsResponse.body.message ||
              "Failed to load platforms. Please try again."}
          </p>
        </div>
      </AdvancedSettingsSkeleton>
    );
  }

  return <AdvancedSettings allPlatformsResponse={allPlatformsResponse} />;
}
