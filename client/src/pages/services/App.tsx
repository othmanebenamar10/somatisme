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
import { useSEO } from "../../hooks/useSEO";

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
  const [location] = useLocation();
  const pageSEO = getPageSEO(location);
  useSEO(pageSEO);

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

function getPageSEO(pathname: string) {
  const path = pathname.replace(/\/+$/, "") || "/";
  const pages: Record<string, { title: string; description: string }> = {
    "/": {
      title: "Automatisme industriel et solutions techniques",
      description: "Automatisme, régulation, installation électrique et maintenance industrielle au Maroc. Présentez votre besoin à l’équipe SOMATISME.",
    },
    "/about": {
      title: "À propos de SOMATISME",
      description: "Découvrez l’équipe, le parcours et les compétences de SOMATISME en automatisme et services industriels.",
    },
    "/services": {
      title: "Services industriels",
      description: "Automatisme, régulation, électricité industrielle, maintenance, conseil et formation pour vos installations.",
    },
    "/services/conseil": {
      title: "Conseil industriel",
      description: "Conseil technique pour analyser vos besoins et définir des solutions adaptées à vos installations industrielles.",
    },
    "/services/automation": {
      title: "Automatisme industriel",
      description: "Étude et intégration de solutions d’automatisme industriel pour améliorer le pilotage de vos équipements.",
    },
    "/services/regulation": {
      title: "Régulation et instrumentation",
      description: "Solutions de régulation, de mesure et d’instrumentation pour vos processus industriels.",
    },
    "/services/electrical": {
      title: "Électricité industrielle",
      description: "Installation et travaux électriques pour les équipements et installations industrielles.",
    },
    "/services/realisation": {
      title: "Réalisations industrielles",
      description: "Quelques réalisations de SOMATISME en automatisme, électricité et équipements industriels.",
    },
    "/services/maintenance": {
      title: "Maintenance industrielle",
      description: "Maintenance préventive et corrective pour préserver la disponibilité de vos équipements industriels.",
    },
    "/services/formation": {
      title: "Formation technique",
      description: "Formations techniques liées à l’automatisme, aux équipements et aux installations industrielles.",
    },
    "/projects": {
      title: "Projets et références",
      description: "Parcourez les projets et références de SOMATISME dans les domaines de l’industrie et de l’automatisme.",
    },
    "/contact": {
      title: "Contacter SOMATISME",
      description: "Contactez SOMATISME pour discuter de vos besoins en automatisme et services industriels au Maroc.",
    },
    "/products": {
      title: "Équipements d’automatisme industriel",
      description: "Découvrez les équipements et composants industriels proposés par SOMATISME.",
    },
    "/privacy": {
      title: "Politique de confidentialité",
      description: "Consultez les informations sur la collecte et le traitement des données personnelles par SOMATISME.",
    },
    "/terms": {
      title: "Conditions d’utilisation",
      description: "Consultez les conditions d’utilisation du site SOMATISME.",
    },
  };

  if (path.startsWith("/projects/")) {
    const slug = decodeURIComponent(path.split("/").at(-1) || "").replace(/[-_]+/g, " ");
    return {
      title: `${slug.charAt(0).toLocaleUpperCase("fr-FR")}${slug.slice(1)} | Projet industriel`,
      description: `Découvrez ce projet industriel réalisé par SOMATISME : ${slug}.`,
    };
  }

  return pages[path] || {
    title: "Page introuvable",
    description: "La page demandée est introuvable. Retrouvez les services et les coordonnées de SOMATISME.",
  };
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
