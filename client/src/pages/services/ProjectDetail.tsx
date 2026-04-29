import { motion } from 'framer-motion';
import { Link, useParams } from 'wouter';
import { ArrowLeft, ArrowRight, CheckCircle2, Settings, Tag, Building2, MapPin, Clock, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { projects } from '@/data/projects';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground mb-4">Projet introuvable</p>
            <Link href="/projects">
              <button className="inline-flex items-center gap-2 text-accent font-semibold hover:underline">
                <ArrowLeft size={16} /> Retour aux projets
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const techList = project.tech.split(',').map((t) => t.trim());
  const resultList = project.result.split(',').map((r) => r.trim());

  const otherProjects = projects.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${project.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-transparent" />

        <div className="container relative z-10 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Link href="/projects">
              <button className="inline-flex items-center gap-2 text-cyan-300 hover:text-white font-semibold text-sm mb-6 transition-colors">
                <ArrowLeft size={16} /> Tous les projets
              </button>
            </Link>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 backdrop-blur-sm mb-4">
              <Tag size={12} className="text-accent" />
              <span className="text-accent font-bold text-xs uppercase tracking-widest">{project.category}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight max-w-4xl">
              {project.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Meta bar */}
      {(project.client || project.location || project.duration || project.year) && (
        <div className="bg-primary/95 border-b border-white/10">
          <div className="container py-4">
            <div className="flex flex-wrap gap-6 text-sm text-gray-300">
              {project.client && (
                <div className="flex items-center gap-2">
                  <Building2 size={14} className="text-accent" />
                  <span>{project.client}</span>
                </div>
              )}
              {project.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-accent" />
                  <span>{project.location}</span>
                </div>
              )}
              {project.duration && (
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-accent" />
                  <span>{project.duration}</span>
                </div>
              )}
              {project.year && (
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-accent" />
                  <span>{project.year}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Left: description */}
            <div className="lg:col-span-2 space-y-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl font-black text-foreground mb-4">Présentation du projet</h2>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {project.longDescription || project.description}
                </p>
              </motion.div>

              {/* Gallery placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h2 className="text-2xl font-black text-foreground mb-4">Galerie</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative rounded-2xl overflow-hidden h-56 bg-muted">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {(project.gallery || []).map((img, i) => (
                    <div key={i} className="relative rounded-2xl overflow-hidden h-56 bg-muted">
                      <img src={img} alt={`${project.title} ${i + 2}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {(!project.gallery || project.gallery.length === 0) && (
                    <div className="rounded-2xl h-56 bg-muted/50 border-2 border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
                      Photos à venir
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right: sidebar */}
            <div className="space-y-6">

              {/* Technologies */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="card-premium p-6"
              >
                <h3 className="font-black text-foreground mb-4 flex items-center gap-2">
                  <Settings size={16} className="text-accent" /> Technologies utilisées
                </h3>
                <div className="flex flex-wrap gap-2">
                  {techList.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold border border-accent/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Results */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="card-premium p-6"
              >
                <h3 className="font-black text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-accent" /> Résultats obtenus
                </h3>
                <ul className="space-y-2">
                  {resultList.map((res, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 size={14} className="text-accent mt-0.5 flex-shrink-0" />
                      {res}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-br from-primary to-slate-800 rounded-2xl p-6 text-white"
              >
                <h3 className="font-black mb-2">Un projet similaire ?</h3>
                <p className="text-sm text-gray-300 mb-4">Contactez-nous pour discuter de votre besoin.</p>
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold px-6 py-3 rounded-xl inline-flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30"
                  >
                    Nous contacter <ArrowRight size={16} />
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Other projects */}
      {otherProjects.length > 0 && (
        <section className="section-padding bg-muted/30">
          <div className="container">
            <h2 className="text-2xl font-black text-foreground mb-8">Autres réalisations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((p, i) => (
                <motion.div
                  key={p.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="card-premium overflow-hidden group"
                >
                  <div className="h-40 overflow-hidden rounded-t-2xl">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <span className="badge-premium text-xs">{p.category}</span>
                    <h3 className="font-bold text-foreground text-sm mt-2 mb-3 line-clamp-2">{p.title}</h3>
                    <Link href={`/projects/${p.slug}`}>
                      <button className="inline-flex items-center gap-1 text-accent text-xs font-semibold hover:underline">
                        En savoir plus <ArrowRight size={12} />
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
