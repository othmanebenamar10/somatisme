import { motion } from 'framer-motion';
import { GraduationCap, CheckCircle2, ArrowRight, Laptop, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function Formation() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <section className="py-20 bg-muted/30">
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
              <div className="p-4 bg-accent/10 rounded-2xl mb-6 inline-block">
                <GraduationCap className="text-accent w-12 h-12" />
              </div>
              <h1 className="text-display mb-6">Formation <span className="text-accent">Industrielle</span></h1>
              <p className="text-xl text-muted-foreground">
                Formations à la carte, pratiques et efficaces par des hommes de terrain expérimentés.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-12">
                <div className="bg-card border border-border p-8 rounded-2xl">
                  <h2 className="text-heading mb-6 flex items-center gap-3"><Users className="text-accent" /> Opérateurs & Pilotes</h2>
                  <p className="text-muted-foreground mb-4">Formation des opérateurs et pilotes de procédés :</p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm italic border-l-2 border-accent/30 pl-4 py-1">
                      En plateforme : soit en parallèle à la programmation des systèmes d’automatisme et de supervision, soit à l’issue des essais fonctionnels.
                    </li>
                    <li className="flex items-start gap-3 text-sm italic border-l-2 border-accent/30 pl-4 py-1">
                      Sur votre site : sur leur futur poste de travail, préalablement à la mise en service industriel de l’installation.
                    </li>
                  </ul>
                </div>

                <div className="bg-card border border-border p-8 rounded-2xl">
                  <h2 className="text-heading mb-6 flex items-center gap-3"><Laptop className="text-accent" /> Maintenance & Technique</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Diagnostic de pannes sur systèmes automatisés (Niveau 1 & 2)",
                      "Programmation d'automates (Langages LADDER, SCL, GRAFCET)",
                      "Maintenance et exploitation de systèmes SCADA / HMI",
                      "Paramétrage et optimisation de variateurs de fréquence",
                      "Instrumentation industrielle : Calibration et réglages",
                      "Réseaux industriels : Diagnostic et supervision",
                      "Sécurité machine : Normes et bonnes pratiques"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 p-4 bg-muted/20 rounded-lg">
                        <CheckCircle2 className="text-accent shrink-0" size={18} />
                        <span className="text-sm font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <aside className="space-y-6">
                <div className="bg-accent text-accent-foreground p-8 rounded-2xl">
                  <h3 className="text-xl font-bold mb-4">Formation sur mesure</h3>
                  <p className="text-sm opacity-90 mb-6 leading-relaxed">
                    Nous adaptons nos modules à vos équipements spécifiques (Schneider, Siemens, Rockwell, etc.) et à votre niveau technique.
                  </p>
                  <Link href="/contact">
                    <Button variant="outline" className="w-full bg-accent-foreground/10 border-accent-foreground/20 hover:bg-accent-foreground/20 text-accent-foreground">
                      Demander un devis
                    </Button>
                  </Link>
                </div>
                <div className="rounded-2xl overflow-hidden h-64 border border-border">
                  <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80" alt="Training" className="w-full h-full object-cover" />
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
