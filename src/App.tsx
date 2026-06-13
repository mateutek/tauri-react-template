import { Routes, Route } from "react-router-dom";
import BottomBar from "./components/BottomBar";
import HomeView from "./views/HomeView";
import SettingsView from "./views/SettingsView";

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <div className="flex-1 pb-[60px]">
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/settings" element={<SettingsView />} />
        </Routes>
      </div>
      <BottomBar />
    </div>
  );
}

export default App;
