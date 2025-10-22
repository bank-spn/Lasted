import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import POS from "./pages/POS";
import Cashier from "./pages/Cashier";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import HRM from "./pages/HRM";
import Accounting from "./pages/Accounting";
import AuditLog from "./pages/AuditLog";
import CMS from "./pages/CMS";
import SystemSettings from "./pages/SystemSettings";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/pos"} component={POS} />
      <Route path={"/cashier"} component={Cashier} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/inventory"} component={Inventory} />
      <Route path={"/hrm"} component={HRM} />
      <Route path={"/accounting"} component={Accounting} />
      <Route path={"/audit-log"} component={AuditLog} />
      <Route path={"/cms"} component={CMS} />
      <Route path={"/settings"} component={SystemSettings} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
