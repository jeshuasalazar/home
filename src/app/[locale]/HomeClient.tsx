"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Locale } from "@/lib/i18n";
import GlassCard from "@/components/GlassCard";

interface HomeClientProps {
  dict: any;
  locale: Locale;
}

export default function HomeClient({ dict, locale }: HomeClientProps) {
  // Stagger animation container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
  } as const;

  return (
    <div className="flex flex-col gap-12 py-12 sm:py-20">
      {/* Hero Section */}
      <section className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-6"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {dict.hero.role}
          </span>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-100 to-zinc-500 leading-tight pb-2 max-w-3xl">
            {dict.hero.tagline}
          </h1>

          <p className="max-w-2xl text-base sm:text-lg text-zinc-400 leading-relaxed">
            {dict.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto justify-center">
            <Link
              href={`/${locale}/contacto`}
              className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-black hover:bg-zinc-200 transition-colors duration-300 shadow-md cursor-pointer"
            >
              {dict.hero.cta_contact}
            </Link>
            <Link
              href={`/${locale}/proyectos`}
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-zinc-900/60 px-6 text-sm font-semibold text-white hover:bg-zinc-900/80 hover:border-white/20 transition-all duration-300 shadow-md backdrop-blur-md cursor-pointer"
            >
              {dict.hero.cta_projects}
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Bento Grid */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Card 1: Profile & Bio (Spans 2 columns) */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-2">
            <GlassCard level="featured" className="p-6 sm:p-8 h-full">
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start h-full">
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0 bg-zinc-950">
                  <Image
                    src="/images/jeshua.png"
                    alt="Jeshua Salazar"
                    fill
                    sizes="(max-w-768px) 128px, 160px"
                    className="object-cover object-center"
                    priority
                  />
                </div>
                <div className="flex flex-col justify-between h-full gap-4 text-center sm:text-start">
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                      {dict.bento.profile_title}
                    </h2>
                    <p className="text-sm text-zinc-400 font-medium mt-1">
                      {dict.bento.profile_subtitle}
                    </p>
                    <p className="text-zinc-300 text-sm leading-relaxed mt-4">
                      {dict.bento.profile_bio}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-2">
                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] uppercase tracking-wider text-zinc-400">
                      Next.js
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] uppercase tracking-wider text-zinc-400">
                      TypeScript
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] uppercase tracking-wider text-zinc-400">
                      Cloudflare
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] uppercase tracking-wider text-zinc-400">
                      AI Agents
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] uppercase tracking-wider text-zinc-400">
                      Workflow Automation
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Card 2: Core Capabilities (Spans 1 col, but takes more height/row-span-2) */}
          <motion.div variants={itemVariants} className="col-span-1 md:row-span-2">
            <GlassCard level="default" className="p-6 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight mb-6">
                  {dict.bento.skills_title}
                </h3>
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-zinc-200 font-semibold text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      {dict.bento.skills_automation}
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed ps-3.5">
                      {dict.bento.skills_automation_desc}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-zinc-200 font-semibold text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                      {dict.bento.skills_ai}
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed ps-3.5">
                      {dict.bento.skills_ai_desc}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-zinc-200 font-semibold text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                      {dict.bento.skills_fullstack}
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed ps-3.5">
                      {dict.bento.skills_fullstack_desc}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-white/5 text-[10px] text-zinc-500 flex justify-between items-center">
                <span>Core Capabilities</span>
                <span>v4.0 stable</span>
              </div>
            </GlassCard>
          </motion.div>

          {/* Card 3: Stats (Spans 2 columns) */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-2">
            <GlassCard level="default" className="p-6 sm:p-8">
              <h3 className="text-sm font-semibold tracking-wider text-zinc-500 uppercase mb-6">
                {dict.bento.stats_title}
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col gap-1">
                  <span className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    +500h
                  </span>
                  <span className="text-[10px] sm:text-xs text-zinc-400 font-medium">
                    {dict.bento.stats_hours}
                  </span>
                </div>
                <div className="flex flex-col gap-1 border-x border-white/10">
                  <span className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    99.9%
                  </span>
                  <span className="text-[10px] sm:text-xs text-zinc-400 font-medium">
                    {dict.bento.stats_efficiency}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    -35%
                  </span>
                  <span className="text-[10px] sm:text-xs text-zinc-400 font-medium">
                    {dict.bento.stats_cost}
                  </span>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Card 4: CTA Card (Spans 3 columns) */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-3">
            <GlassCard level="featured" className="p-8 text-center relative overflow-hidden bg-gradient-to-r from-zinc-950 via-zinc-900/60 to-zinc-950 border-white/10 hover:border-white/20">
              <div className="relative z-10 flex flex-col items-center gap-4 py-4 max-w-xl mx-auto">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {dict.contact.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {dict.contact.subtitle}
                </p>
                <Link
                  href={`/${locale}/contacto`}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-6 text-xs font-semibold text-black hover:bg-zinc-200 transition-colors duration-300 mt-2 shadow-md cursor-pointer"
                >
                  {dict.hero.cta_contact}
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
