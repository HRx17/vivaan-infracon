import { getSettings } from "@/lib/data";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  return <SettingsForm initial={await getSettings()} />;
}
