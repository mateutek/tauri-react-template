import { Link } from "react-router-dom";
import { Moon, Settings, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/stores/themeStore";

interface BottomBarProps {
  appName?: string;
  appVersion?: string;
}

function BottomBar({
  appName = "Tauri React Template",
  appVersion = "v0.1.0",
}: BottomBarProps) {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] border-t bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-8 py-2.5">
        <div className="flex items-center gap-3 text-sm">
          <Link to="/" className="font-semibold transition-opacity hover:opacity-70">
            {appName}
          </Link>
          <span className="rounded-sm bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
            {appVersion}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link to="/settings" title="Settings">
              <Settings className="size-[18px]" />
              <span className="font-medium">Settings</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              <Sun className="size-[18px]" />
            ) : (
              <Moon className="size-[18px]" />
            )}
            <span className="font-medium">{theme === "light" ? "Light" : "Dark"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BottomBar;
