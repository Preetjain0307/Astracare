import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowRight,
  Heart,
  Shield,
  Brain,
  Sparkles,
  ChevronRight,
  Activity,
  Smile,
  CheckCircle2,
  Watch,
  Lock,
  Zap,
  Star,
} from 'lucide-react'

const FEATURES = [
  {
    icon: Brain,
    title: 'AI Clinical Intelligence',
    desc: 'Deep learning models analyze multi-factor cycle data, hormonal markers, and vitals for predictive health insights.',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
  },
  {
    icon: Heart,
    title: 'Reproductive & Hormonal Tracking',
    desc: 'Precision ovulation tracking, fertility windows, pregnancy support, and perimenopause tracking built for every life stage.',
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    border: 'border-pink-100',
  },
  {
    icon: Shield,
    title: 'Predictive Risk Index (PCOS & Endometriosis)',
    desc: 'Early warning biomarkers and symptom tracking to alert you and your physician before symptoms escalate.',
    color: 'text-rose-700',
    bg: 'bg-rose-100/60',
    border: 'border-rose-200',
  },
  {
    icon: Watch,
    title: 'AstraBand AI Wearable Integration',
    desc: 'Seamless continuous Bluetooth sync for HRV, continuous core body temperature, resting heart rate, and sleep staging.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
  },
]

const STATS = [
  { value: '500K+', label: 'Active Women Empowered' },
  { value: '99.4%', label: 'Prediction Accuracy' },
  { value: '256-bit', label: 'End-to-End Encryption' },
  { value: '24/7', label: 'AI Health Companion' },
]

const TRUST_TAGS = [
  'Medical-Grade Data Privacy',
  'Instant Email Verification',
  'End-to-End Encrypted',
  '24/7 Vital Insights',
]


export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 selection:bg-rose-500 selection:text-white">
      {/* Top Floating Navbar */}
      <header className="sticky top-0 z-50 glass-card border-b border-rose-100/80 shadow-2xs backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-600 to-pink-600 flex items-center justify-center shadow-glow text-white">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-xl tracking-tight">AstraCare AI</span>
              <span className="text-[10px] text-rose-600 font-bold block -mt-1 tracking-wider uppercase">Intelligent Women's Health</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm font-bold text-slate-700 hover:text-rose-600 transition-colors px-4 py-2 rounded-xl"
            >
              Sign in
            </Link>
            <Link
              href="/auth/register"
              className="text-sm font-extrabold bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-5 py-2.5 rounded-2xl transition-all shadow-glow hover:shadow-glow-lg cursor-pointer"
            >
              Get started free
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-mesh pt-12 pb-24 md:pt-20 md:pb-32">
        {/* Soft pink ambient glowing blur circles */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-rose-200/50 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl animate-pulse-glow" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 border border-rose-200/80 text-rose-800 text-xs font-extrabold px-4 py-2 rounded-full mb-8 shadow-xs backdrop-blur-md animate-fade-in">
            <Sparkles className="h-4 w-4 text-rose-600" />
            <span>Next-Generation Predictive Healthcare Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 mb-8 leading-[1.1] tracking-tight max-w-4xl mx-auto">
            Intelligent healthcare <br />
            <span className="text-gradient">designed around your body</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed font-normal">
            AstraCare AI integrates continuous physiological tracking, cycle intelligence, and personalized medical insight into one seamless platform.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 max-w-md mx-auto">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-rose-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-extrabold text-base hover:from-rose-700 hover:to-pink-700 transition-all shadow-glow hover:shadow-glow-lg w-full sm:w-auto cursor-pointer"
            >
              <span>Start Your Health Journey</span>
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center gap-2 bg-white/90 text-slate-800 px-8 py-4 rounded-2xl font-bold text-base border border-rose-200 hover:bg-rose-50/60 transition-all shadow-xs w-full sm:w-auto cursor-pointer"
            >
              <span>Sign In to Account</span>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16 text-xs text-slate-500 font-semibold">
            {TRUST_TAGS.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1.5 bg-white/70 border border-rose-100 px-3.5 py-1.5 rounded-full shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                {tag}
              </span>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {STATS.map((stat) => (
              <div key={stat.label} className="p-6 rounded-3xl glass-card border border-rose-100/80 shadow-xs hover:border-rose-300 transition-all">
                <div className="text-3xl md:text-4xl font-extrabold text-gradient-rose mb-1">{stat.value}</div>
                <div className="text-xs text-slate-500 font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-24 bg-white border-t border-rose-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Comprehensive Health Intelligence
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-base">
              Built specifically for women, combining clinical accuracy with end-to-end medical privacy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className={`p-8 rounded-3xl bg-white border ${feature.border} shadow-2xs hover:shadow-glow hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group`}
              >
                <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 border ${feature.border}`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive AI Preview Banner */}
      <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-950/40 via-slate-950 to-pink-950/30" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-rose-900/50 border border-rose-700/60 text-rose-300 text-xs font-bold px-4 py-1.5 rounded-full">
            <Zap className="h-4 w-4 text-rose-400" /> AstraCare AI Health Engine
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Take full control of your health journey
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Join thousands of women leveraging AI predictive analytics, cycle synchronization, and continuous vital tracking.
          </p>

          <div>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-rose-600 to-pink-600 text-white px-9 py-4 rounded-2xl font-extrabold text-base hover:from-rose-700 hover:to-pink-700 transition-all shadow-glow cursor-pointer"
            >
              <span>Create Free Account</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center text-white">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <span className="font-extrabold text-white text-base">AstraCare AI Systems</span>
            </div>
            <p className="text-xs text-slate-500 text-center md:text-right">
              © {new Date().getFullYear()} AstraCare AI Systems Inc. All rights reserved. Information is provided for educational and health management purposes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
