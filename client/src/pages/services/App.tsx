import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import React, { Suspense } from "react";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "../../components/ErrorBoundary";
import { ThemeProvider } from "../../contexts/ThemeContext";
import { LanguageProvider, useLanguage } from "../../contexts/LanguageContext";
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

const LoadingFallback = () => {
  const { t } = useLanguage();

  return (
  <main className="somatisme-loader" role="status" aria-live="polite" aria-label={t('loading.aria')}>
    <style>{`
      .somatisme-loader{--loader-cyan:#12c8dd;--loader-orange:#f28a31;position:relative;display:grid;min-height:100svh;place-items:center;overflow:hidden;padding:32px 20px;background:#07131d;color:#f6fbfd;font-family:Inter,ui-sans-serif,system-ui,sans-serif}
      .somatisme-loader:before{position:absolute;inset:0;background-image:linear-gradient(rgba(122,174,190,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(122,174,190,.055) 1px,transparent 1px);background-size:42px 42px;content:"";mask-image:linear-gradient(transparent,#000 20%,#000 80%,transparent)}
      .somatisme-loader:after{position:absolute;width:min(80vw,760px);height:min(80vw,760px);border:1px solid rgba(18,200,221,.12);border-radius:50%;box-shadow:0 0 0 58px rgba(18,200,221,.025),0 0 0 116px rgba(18,200,221,.02);content:""}
      .somatisme-loader__panel{position:relative;z-index:1;width:min(100%,760px);overflow:hidden;border:1px solid rgba(136,193,207,.2);border-radius:22px;background:linear-gradient(145deg,rgba(17,39,52,.97),rgba(9,24,34,.97));box-shadow:0 28px 90px rgba(0,0,0,.42)}
      .somatisme-loader__top{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 24px;border-bottom:1px solid rgba(136,193,207,.13)}
      .somatisme-loader__logo{display:block;width:174px;height:auto;border-radius:3px}
      .somatisme-loader__tag{color:#91aab4;font-size:10px;font-weight:700;letter-spacing:.2em;text-align:right}
      .somatisme-loader__body{display:grid;grid-template-columns:1fr 220px;align-items:center;gap:34px;padding:42px 44px 34px}
      .somatisme-loader__eyebrow{display:flex;align-items:center;gap:9px;margin:0 0 14px;color:var(--loader-cyan);font-size:11px;font-weight:750;letter-spacing:.18em;text-transform:uppercase}
      .somatisme-loader__led{width:8px;height:8px;border-radius:50%;background:#5be4a6;box-shadow:0 0 14px rgba(91,228,166,.8);animation:somatisme-led 1.8s ease-in-out infinite}
      .somatisme-loader__title{margin:0;color:#f7fbfc;font-size:clamp(26px,5vw,38px);font-weight:750;letter-spacing:-.04em;line-height:1.12}
      .somatisme-loader__copy{max-width:390px;margin:14px 0 25px;color:#9db2ba;font-size:14px;line-height:1.7}
      .somatisme-loader__progress{height:3px;overflow:hidden;border-radius:4px;background:rgba(157,178,186,.16)}
      .somatisme-loader__progress:after{display:block;width:38%;height:100%;border-radius:4px;background:linear-gradient(90deg,var(--loader-cyan),var(--loader-orange));content:"";animation:somatisme-progress 1.7s ease-in-out infinite}
      .somatisme-loader__labels{display:flex;justify-content:space-between;gap:12px;margin-top:10px;color:#6f8a95;font-size:10px;letter-spacing:.08em;text-transform:uppercase}
      .somatisme-loader__machine{width:100%;max-width:210px;justify-self:center;color:#43d5e2;filter:drop-shadow(0 0 18px rgba(18,200,221,.15))}
      .somatisme-loader__trace{stroke-dasharray:7 7;animation:somatisme-trace 2s linear infinite}
      @keyframes somatisme-progress{0%{transform:translateX(-110%)}100%{transform:translateX(370%)}}
      @keyframes somatisme-trace{to{stroke-dashoffset:-28}}
      @keyframes somatisme-led{50%{opacity:.45;box-shadow:0 0 4px rgba(91,228,166,.35)}}
      @media(max-width:560px){.somatisme-loader__top{padding:16px 18px}.somatisme-loader__logo{width:145px}.somatisme-loader__tag{max-width:130px;font-size:8px;line-height:1.6}.somatisme-loader__body{grid-template-columns:1fr;padding:32px 24px 26px}.somatisme-loader__machine{display:none}.somatisme-loader__copy{font-size:13px}}
      @media(prefers-reduced-motion:reduce){.somatisme-loader__led,.somatisme-loader__progress:after,.somatisme-loader__trace{animation:none}.somatisme-loader__progress:after{width:55%;transform:translateX(40%)}}
    `}</style>
    <section className="somatisme-loader__panel">
      <header className="somatisme-loader__top">
        <img className="somatisme-loader__logo" src="/logo-somatisme-green.png" alt="SOMATISME" />
        <span className="somatisme-loader__tag">{t('loading.tagline')}</span>
      </header>
      <div className="somatisme-loader__body">
        <div>
          <p className="somatisme-loader__eyebrow"><span className="somatisme-loader__led" />{t('loading.eyebrow')}</p>
          <h1 className="somatisme-loader__title">{t('loading.title')}</h1>
          <p className="somatisme-loader__copy">{t('loading.description')}</p>
          <div className="somatisme-loader__progress" aria-hidden="true" />
          <div className="somatisme-loader__labels"><span>{t('loading.industry')}</span><span>{t('loading.status')}</span></div>
        </div>
        <svg className="somatisme-loader__machine" viewBox="0 0 220 190" fill="none" aria-hidden="true">
          <path d="M20 95h35m110 0h35M110 20v25m0 100v25" stroke="currentColor" strokeOpacity=".35" strokeWidth="2" />
          <path className="somatisme-loader__trace" d="M20 95h35m110 0h35M110 20v25m0 100v25" stroke="currentColor" strokeWidth="2" />
          <rect x="55" y="45" width="110" height="100" rx="12" fill="#102936" stroke="currentColor" strokeOpacity=".8" strokeWidth="2" />
          <rect x="69" y="59" width="82" height="42" rx="5" fill="#091923" stroke="currentColor" strokeOpacity=".4" />
          <path d="M78 84h12l7-13 10 21 8-14h21" stroke="#f28a31" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          <circle cx="77" cy="119" r="5" fill="#5be4a6" /><circle cx="96" cy="119" r="5" fill="#f28a31" />
          <path d="M116 114h35m-35 10h25" stroke="currentColor" strokeLinecap="round" strokeOpacity=".5" strokeWidth="3" />
          <circle cx="20" cy="95" r="4" fill="#f28a31" /><circle cx="200" cy="95" r="4" fill="#5be4a6" />
          <circle cx="110" cy="20" r="4" fill="#5be4a6" /><circle cx="110" cy="170" r="4" fill="#f28a31" />
        </svg>
      </div>
    </section>
  </main>
  );
};

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
