import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "@/components/ThemeSwitcher";

function SettingsView() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-[760px] px-8 py-10">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
          <p className="text-[15px] text-muted-foreground">
            Manage your app configuration
          </p>
        </div>
      </div>

      {/* Appearance section */}
      <section className="mb-4 rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="mb-5 text-base font-semibold tracking-tight">Appearance</h2>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="font-medium">Theme</span>
            <span className="text-sm text-muted-foreground">
              Light, dark, or follow your system
            </span>
          </div>
          <ThemeSwitcher />
        </div>
      </section>

      {/* Add more sections below as needed */}
    </div>
  );
}

export default SettingsView;
