import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "./NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "../../components/ErrorBoundary";
import { ThemeProvider } from "../../contexts/ThemeContext";
import Home from "./Home";
import About from "./About";
import { LanguageProvider } from "../../contexts/LanguageContext";
import Services from "./Services";
import Automation from "./Automation";
import Regulation from "./Regulation";
import Electrical from "./Electrical";
import Maintenance from "./Maintenance";
import Conseil from "./Conseil";
import Realisation from "./Realisation";
import Formation from "./Formation";
import Projects from "./Projects";
import Contact from "./Contact";
import Privacy from "./Privacy";
import Terms from "./Terms";
import Products from "../../pages/shop/Products";
import WhatsAppButton from "../../components/WhatsAppButton";


function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      <Route path="/services/conseil" component={Conseil} />
      <Route path="/services/automation" component={Automation} />
      <Route path="/services/regulation" component={Regulation} />
      <Route path="/services/electrical" component={Electrical} />
      <Route path="/services/realisation" component={Realisation} />
      <Route path="/services/maintenance" component={Maintenance} />
      <Route path="/services/formation" component={Formation} />
      <Route path="/projects" component={Projects} />
      <Route path="/contact" component={Contact} />
      <Route path="/products" component={Products} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
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
        // switchable
      >
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <ScrollToTop />
            <Router />
            <WhatsAppButton />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
