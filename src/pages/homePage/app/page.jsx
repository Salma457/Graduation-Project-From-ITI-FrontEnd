import { useEffect, useState } from "react"
import {
  Search, Users, Building2, CheckCircle, TrendingUp, Code,
  PenTool, Palette, BarChart3, DollarSign, Globe, Database,
  Megaphone, ArrowRight, Star, User, GraduationCap, Award,
  BookOpen, MapPin, Briefcase, Target, Zap, Shield, Cpu
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "../../../contexts/TranslationContext"
import LanguageSwitcher from "../../../components/LanguageSwitcher"
import DarkModeToggle from "../../../components/DarkModeToggle"
import { useDarkMode } from "../../../contexts/DarkModeContext"

// Animation Components
const AnimatedCounter = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    const increment = parseInt(value) / (duration / 50)
    const timer = setInterval(() => {
      setCount(prev => {
        const next = prev + increment
        if (next >= parseInt(value)) {
          clearInterval(timer)
          return parseInt(value)
        }
        return Math.floor(next)
      })
    }, 50)
    return () => clearInterval(timer)
  }, [value, duration])
  
  return <span>{count}{value.includes('+') ? '+' : ''}{value.includes('%') ? '%' : ''}</span>
}

const FloatingElement = ({ children, className = "", delay = 0 }) => {
  return (
    <div 
      className={`animate-bounce ${className}`}
      style={{ 
        animationDelay: `${delay}s`,
        animationDuration: '3s',
        animationIterationCount: 'infinite'
      }}
    >
      {children}
    </div>
  )
}

const FadeInElement = ({ children, className = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 100)
    return () => clearTimeout(timer)
  }, [delay])
  
  return (
    <div 
      className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
    >
      {children}
    </div>
  )
}

function LandingPageContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { t, isRTL } = useTranslation();

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem("access-token");
    setIsLoggedIn(!!token);
  }, []);

  const handleGetStarted = () => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  };

  const itiStats = [
    { label: t('stats.labels.employmentRate'), value: "85", icon: TrendingUp, color: "from-red-500 to-rose-600" },
    { label: t('stats.labels.partnerCompanies'), value: "500", icon: Building2, color: "from-red-600 to-red-700" },
    { label: t('stats.labels.universities'), value: "80", icon: GraduationCap, color: "from-red-500 to-red-600" },
    { label: t('stats.labels.graduates'), value: "16000", icon: Users, color: "from-red-700 to-red-800" },
  ]

  const itiLocations = [
    "Smart Village", "New Capital", "Cairo University", "Alexandria", "Assiut",
    "Aswan", "Beni Suef", "Fayoum", "Ismailia", "Mansoura", "Menofia",
    "Minya", "Qena", "Sohag", "Tanta", "Zagazig", "New Valley",
    "Damanhour", "Al Arish", "Banha", "Port Said"
  ]

  const jobCategories = [
    { name: t('categories.items.softwareDevelopment'), icon: Code, color: "from-red-500 to-rose-500" },
    { name: t('categories.items.graphicDesign'), icon: Palette, color: "from-rose-500 to-pink-500" },
    { name: t('categories.items.networkSecurity'), icon: Shield, color: "from-red-600 to-red-700" },
    { name: t('categories.items.digitalMarketing'), icon: Megaphone, color: "from-red-400 to-rose-500" },
    { name: t('categories.items.businessManagement'), icon: BarChart3, color: "from-rose-600 to-red-600" },
    { name: t('categories.items.artificialIntelligence'), icon: Cpu, color: "from-red-500 to-red-600" },
    { name: t('categories.items.computerEngineering'), icon: Building2, color: "from-rose-500 to-red-500" },
    { name: t('categories.items.dataScience'), icon: Database, color: "from-red-600 to-rose-600" },
  ]

  const hiringCompanies = [
    {
      name: "Valeo",
      logo: "/public/valeo.png",
      hiring: t('companies.companiesData.valeo.hiring'),
      description: t('companies.companiesData.valeo.description'),
      positions: t('companies.companiesData.valeo.positions'),
      website: "https://www.valeo.com"
    },
    {
      name: "IBM Egypt",
      logo: "/public/ibm.png",
      hiring: t('companies.companiesData.ibm.hiring'),
      description: t('companies.companiesData.ibm.description'),
      positions: t('companies.companiesData.ibm.positions'),
      website: "https://www.ibm.com/eg-en"
    },
    {
      name: "ITWorx",
      logo: "/public/itworx.png",
      hiring: t('companies.companiesData.itworx.hiring'),
      description: t('companies.companiesData.itworx.description'),
      positions: t('companies.companiesData.itworx.positions'),
      website: "https://www.itworx.com"
    },
    {
      name: "Raya Holding",
      logo: "/public/Raya.png",
      hiring: t('companies.companiesData.raya.hiring'),
      description: t('companies.companiesData.raya.description'),
      positions: t('companies.companiesData.raya.positions'),
      website: "https://www.raya.com"
    },
    {
      name: "TE Data",
      logo: "/public/tedata.png",
      hiring: t('companies.companiesData.tedata.hiring'),
      description: t('companies.companiesData.tedata.description'),
      positions: t('companies.companiesData.tedata.positions'),
      website: "https://www.tedata.net"
    },
    {
      name: "Siemens Egypt",
      logo: "/public/siemens1.png",
      hiring: t('companies.companiesData.siemens.hiring'),
      description: t('companies.companiesData.siemens.description'),
      positions: t('companies.companiesData.siemens.positions'),
      website: "https://www.siemens.com/eg/en"
    }
  ]

  const testimonials = t('testimonials.items')

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-red-900 dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-white">
            ITI Career Gateway
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-white dark:text-gray-300 hover:text-red-300 dark:hover:text-red-400 transition-colors">
              {t('nav.home')}
            </a>
            <a href="#" className="text-white dark:text-gray-300 hover:text-red-300 dark:hover:text-red-400 transition-colors">
              {t('nav.jobs')}
            </a>
            <a href="#" className="text-white dark:text-gray-300 hover:text-red-300 dark:hover:text-red-400 transition-colors">
              {t('nav.about')}
            </a>
            <LanguageSwitcher />
            <DarkModeToggle className="ml-2" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="relative pt-24 pb-20 overflow-hidden bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
        <div className="absolute inset-0"></div>
        <FloatingElement className="absolute top-20 left-10 w-20 h-20 bg-red-200 rounded-full opacity-30 dark:bg-gray-700 dark:opacity-20" delay={0} />
        <FloatingElement className="absolute top-40 right-20 w-16 h-16 bg-rose-300 rounded-full opacity-20 dark:bg-gray-600 dark:opacity-15" delay={1} />
        <FloatingElement className="absolute bottom-32 left-1/4 w-12 h-12 bg-red-300 rounded-full opacity-25 dark:bg-gray-500 dark:opacity-15" delay={2} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeInElement className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-red-100 to-rose-100 dark:from-gray-800 dark:to-gray-700 border border-red-200 dark:border-gray-600 animate-pulse">
                  <GraduationCap className="w-5 h-5 text-red-600 dark:text-gray-300 mr-2" />
                  <span className="text-red-800 dark:text-gray-200 font-semibold">{t('hero.badge')}</span>
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
                  {t('hero.title')} <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent dark:from-gray-300 dark:to-gray-400">{t('hero.titleHighlight')}</span>
                  <span className="block text-3xl mt-3 text-gray-700 dark:text-gray-300 font-semibold">{t('hero.subtitle')}</span>
                </h1>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed">
                  {t('hero.description')}
                </p>
              </div>
            </FadeInElement>

            <FadeInElement delay={1} className="flex justify-center items-center">
              <div className="relative">
                <img src="/public/choice-worker-concept.png" alt="" className="max-w-md w-full rounded-lg shadow-xl dark:brightness-75" />
                <FloatingElement className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-rose-500 to-pink-500 dark:from-gray-700 dark:to-gray-600 rounded-2xl opacity-20" delay={0.5} />
                <FloatingElement className="absolute -bottom-20 -left-30 w-32 h-32 bg-gradient-to-br from-red-500 to-rose-500 dark:from-gray-800 dark:to-gray-700 rounded-2xl opacity-20" delay={1.5} />
              </div>
            </FadeInElement>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 to-rose-50/50 dark:from-gray-800/50 dark:to-gray-700/50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <FadeInElement className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {t('stats.title').split(' ')[0]} <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent dark:from-gray-300 dark:to-gray-400">{t('stats.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('stats.description')}
            </p>
          </FadeInElement>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {itiStats.map((stat, index) => (
              <FadeInElement
                key={index}
                delay={index + 2}
                className="group text-center hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${stat.color} dark:from-gray-700 dark:to-gray-600 rounded-2xl mb-6 shadow-lg group-hover:shadow-xl group-hover:rotate-6 transition-all duration-300`}>
                  <stat.icon className="w-10 h-10 text-white" />
                </div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                  <AnimatedCounter value={stat.value} />
                  {stat.label.includes('Rate') || stat.label.includes('معدل') ? '%' : stat.label.includes('Graduates') || stat.label.includes('خريجي') ? '+' : '+'}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
              </FadeInElement>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <FadeInElement className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {t('companies.title').split(' ')[0]} <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent dark:from-gray-300 dark:to-gray-400">{t('companies.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('companies.description')}
            </p>
          </FadeInElement>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hiringCompanies.map((company, index) => (
              <FadeInElement
                key={index}
                delay={index}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-2 border border-gray-100 dark:border-gray-700 hover:border-red-200 dark:hover:border-gray-600"
              >
                <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center p-6">
                  <div className="w-full h-24 flex items-center justify-center">
                    <img 
                      src={company.logo} 
                      alt={company.name} 
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 dark:brightness-90"
                    />
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-gray-300 transition-colors">
                      {company.name}
                    </h3>
                    <span className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                      {company.hiring}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{company.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{t('companies.popularPositions')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {company.positions.map((position, i) => (
                        <span 
                          key={i}
                          className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm px-3 py-1 rounded-full group-hover:bg-red-50 dark:group-hover:bg-gray-600 group-hover:text-red-600 dark:group-hover:text-gray-300 transition-colors"
                        >
                          {position}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <a 
                    href={company.website} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-red-600 dark:text-gray-300 font-semibold hover:text-red-700 dark:hover:text-gray-200 transition-colors group-hover:translate-x-2 transform duration-300"
                  >
                    {t('companies.visitWebsite')}
                    <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                  </a>
                </div>
              </FadeInElement>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <FadeInElement className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {t('categories.title').split(' ')[0]} <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent dark:from-gray-300 dark:to-gray-400">{t('categories.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('categories.description')}
            </p>
          </FadeInElement>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {jobCategories.map((category, index) => (
              <FadeInElement
                key={index}
                delay={index}
                className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2 border border-gray-100 dark:border-gray-700 hover:border-red-200 dark:hover:border-gray-600"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${category.color} dark:from-gray-700 dark:to-gray-600 rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-lg group-hover:text-red-600 dark:group-hover:text-gray-300 transition-colors">{category.name}</h3>
              </FadeInElement>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <FadeInElement delay={5} className="text-center">
            <div className="bg-gradient-to-r from-red-600 to-rose-600 dark:from-gray-700 dark:to-gray-600 text-white p-8 rounded-2xl shadow-xl">
              <h4 className="text-2xl font-bold mb-4">{t('market.title')}</h4>
              <p className="text-red-100 dark:text-gray-300 text-lg max-w-4xl mx-auto">
                {t('market.description')}
              </p>
            </div>
          </FadeInElement>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <FadeInElement className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {t('locations.title').split(' ')[0]} <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent dark:from-gray-300 dark:to-gray-400">{t('locations.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('locations.description')}
            </p>
          </FadeInElement>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {itiLocations.map((location, index) => (
              <FadeInElement
                key={index}
                delay={index * 0.5}
                className="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 hover:from-red-50 dark:hover:from-gray-600 hover:to-rose-50 dark:hover:to-gray-700 p-4 rounded-xl text-center transition-all duration-300 hover:shadow-lg cursor-pointer hover:scale-105"
              >
                <MapPin className="w-6 h-6 text-gray-400 dark:text-gray-500 group-hover:text-red-500 dark:group-hover:text-gray-300 mx-auto mb-2 transition-colors group-hover:bounce" />
                <p className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white font-medium text-sm">{location}</p>
              </FadeInElement>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <FadeInElement className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">{t('testimonials.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('testimonials.description')}
            </p>
          </FadeInElement>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <FadeInElement
                key={index}
                delay={index + 2}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700 hover:border-red-200 dark:hover:border-gray-600 group"
              >
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-red-400 text-red-400 group-hover:scale-110 transition-transform duration-300" style={{transitionDelay: `${i * 100}ms`}} />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{testimonial.role}</div>
                  </div>
                </div>
              </FadeInElement>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-rose-600 to-red-700 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800"></div>
        <div className="absolute inset-0 bg-black opacity-10 dark:opacity-20"></div>
        
        <FloatingElement className="absolute top-10 left-10 w-24 h-24 bg-white/10 dark:bg-gray-700/10 rounded-full" delay={0} />
        <FloatingElement className="absolute bottom-20 right-20 w-32 h-32 bg-white/5 dark:bg-gray-600/5 rounded-full" delay={1} />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <FadeInElement className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">{t('cta.title')}</h2>
            <p className="text-red-100 dark:text-gray-300 mb-10 text-xl">
              {t('cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {!isLoggedIn && (
                <button 
                  onClick={handleGetStarted}
                  className="bg-white dark:bg-gray-800 text-red-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 transform"
                >
                  {t('cta.button')}
                </button>
              )}
            </div>
          </FadeInElement>
        </div>
      </section>

      <footer className="bg-gray-900 dark:bg-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <FadeInElement>
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
                ITI Career Gateway
              </h3>
              <p className="text-gray-300 dark:text-gray-200 mb-6 leading-relaxed">
                {t('footer.description')}
              </p>
            </FadeInElement>
            <FadeInElement delay={1}>
              <h4 className="font-semibold mb-6 text-lg text-white">{t('footer.quickLinks.title')}</h4>
              <ul className="space-y-3 text-gray-300 dark:text-gray-200">
                <li><a href="#" className="hover:text-red-400 dark:hover:text-gray-300 transition-colors">{t('footer.quickLinks.items.findJobs')}</a></li>
                <li><a href="#" className="hover:text-red-400 dark:hover:text-gray-300 transition-colors">{t('footer.quickLinks.items.postJob')}</a></li>
                <li><a href="#" className="hover:text-red-400 dark:hover:text-gray-300 transition-colors">{t('footer.quickLinks.items.community')}</a></li>
                <li><a href="#" className="hover:text-red-400 dark:hover:text-gray-300 transition-colors">{t('footer.quickLinks.items.aboutIti')}</a></li>
              </ul>
            </FadeInElement>
            <FadeInElement delay={2}>
              <h4 className="font-semibold mb-6 text-lg text-white">{t('footer.categories.title')}</h4>
              <ul className="space-y-3 text-gray-300 dark:text-gray-200">
                <li><a href="#" className="hover:text-red-400 dark:hover:text-gray-300 transition-colors">{t('footer.categories.items.softwareDev')}</a></li>
                <li><a href="#" className="hover:text-red-400 dark:hover:text-gray-300 transition-colors">{t('footer.categories.items.networkEng')}</a></li>
                <li><a href="#" className="hover:text-red-400 dark:hover:text-gray-300 transition-colors">{t('footer.categories.items.graphicDesign')}</a></li>
                <li><a href="#" className="hover:text-red-400 dark:hover:text-gray-300 transition-colors">{t('footer.categories.items.dataScience')}</a></li>
              </ul>
            </FadeInElement>
            <FadeInElement delay={3}>
              <h4 className="font-semibold mb-6 text-lg text-white">{t('footer.support.title')}</h4>
              <ul className="space-y-3 text-gray-300 dark:text-gray-200">
                <li><a href="#" className="hover:text-red-400 dark:hover:text-gray-300 transition-colors">{t('footer.support.items.helpCenter')}</a></li>
                <li><a href="#" className="hover:text-red-400 dark:hover:text-gray-300 transition-colors">{t('footer.support.items.contactUs')}</a></li>
                <li><a href="#" className="hover:text-red-400 dark:hover:text-gray-300 transition-colors">{t('footer.support.items.privacyPolicy')}</a></li>
                <li><a href="#" className="hover:text-red-400 dark:hover:text-gray-300 transition-colors">{t('footer.support.items.termsOfService')}</a></li>
              </ul>
            </FadeInElement>
          </div>
          <div className="border-t border-gray-800 dark:border-gray-700 mt-12 pt-8 text-center text-gray-400 dark:text-gray-300">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPageContent