import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import React, { Suspense } from "react";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "../../components/ErrorBoundary";
import { ThemeProvider } from "../../contexts/ThemeContext";
import { LanguageProvider } from "../../contexts/LanguageContext";
import WhatsAppButton from "../../components/WhatsAppButton";
import { generateLocalBusinessSchema } from "../../lib/seo";

// Lazy Loaded Pages
const Home = React.lazy(() => import("./Home"));
const About = React.lazy(() => import("./About"));
const Services = React.lazy(() => import("./Services"));
const Automation = React.lazy(() => import("./Automation"));
const Regulation = React.lazy(() => import("./Regulation"));
const Electrical = React.lazy(() => import("./Electrical"));
const Maintenance = React.lazy(() => import("./Maintenance"));
const Conseil = React.lazy(() => import("./Conseil"));
const Realisation = React.lazy(() => import("./Realisation"));
const Formation = React.lazy(() => import("./Formation"));
const Projects = React.lazy(() => import("./Projects"));
const ProjectDetail = React.lazy(() => import("./ProjectDetail"));
const Contact = React.lazy(() => import("./Contact"));
const Privacy = React.lazy(() => import("./Privacy"));
const Terms = React.lazy(() => import("./Terms"));
const Products = React.lazy(() => import("../../pages/shop/Products"));
const NotFound = React.lazy(() => import("./NotFound"));

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function Router() {
  return (
    <Suspense fallback={<LoadingFallback />}>
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
        <Route path="/projects/:slug" component={ProjectDetail} />
        <Route path="/contact" component={Contact} />
        <Route path="/products" component={Products} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  useEffect(() => {
    const scriptId = "structured-data-local-business";
    if (document.getElementById(scriptId)) {
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.type = "application/ld+json";
    script.text = JSON.stringify(generateLocalBusinessSchema());
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

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
