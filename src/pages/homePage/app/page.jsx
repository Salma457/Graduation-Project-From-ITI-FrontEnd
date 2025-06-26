import { useEffect, useState } from "react"
import {
  Search, Users, Building2, CheckCircle, TrendingUp, Code,
  PenTool, Palette, BarChart3, DollarSign, Globe, Database,
  Megaphone, ArrowRight, Star, User, GraduationCap, Award,
  BookOpen, MapPin, Briefcase, Target, Zap, Shield, Cpu
} from "lucide-react"
import { useNavigate } from "react-router-dom"
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

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem("access-token");
    setIsLoggedIn(!!token);
  }, []);

  const handleGetStarted = () => {
    if (!isLoggedIn) {
      navigate("/login"); // Redirect to login page using React Router
    }
  };

  const itiStats = [
    { label: "Annual Employment Rate", value: "85", icon: TrendingUp, color: "from-red-500 to-rose-600" },
    { label: "Partner Companies", value: "500", icon: Building2, color: "from-red-600 to-red-700" },
    { label: "Universities & Faculties", value: "80", icon: GraduationCap, color: "from-red-500 to-red-600" },
    { label: "ITI Graduates", value: "16000", icon: Users, color: "from-red-700 to-red-800" },
  ]

  const itiLocations = [
    "Smart Village", "New Capital", "Cairo University", "Alexandria", "Assiut",
    "Aswan", "Beni Suef", "Fayoum", "Ismailia", "Mansoura", "Menofia",
    "Minya", "Qena", "Sohag", "Tanta", "Zagazig", "New Valley",
    "Damanhour", "Al Arish", "Banha", "Port Said"
  ]

  const jobCategories = [
    { name: "Software Development", icon: Code, color: "from-red-500 to-rose-500" },
    { name: "Graphic Design", icon: Palette, color: "from-rose-500 to-pink-500" },
    { name: "Network & Security", icon: Shield, color: "from-red-600 to-red-700" },
    { name: "Digital Marketing", icon: Megaphone, color: "from-red-400 to-rose-500" },
    { name: "Business Management", icon: BarChart3, color: "from-rose-600 to-red-600" },
    { name: "Artificial Intelligence", icon: Cpu,  color: "from-red-500 to-red-600" },
    { name: "Computer Engineering", icon: Building2,  color: "from-rose-500 to-red-500" },
    { name: "Data Science", icon: Database,  color: "from-red-600 to-rose-600" },
  ]

  // Top Hiring Companies Data
  const hiringCompanies = [
    {
      name: "Valeo",
      logo: "/public/valeo.png",
      hiring: "120+ ITI Graduates",
      description: "Global automotive supplier specializing in driving assistance systems",
      positions: ["Software Engineer", "Embedded Systems", "Automotive Cybersecurity"],
      website: "https://www.valeo.com"
    },
    {
      name: "IBM Egypt",
      logo: "/public/ibm.png",
      hiring: "90+ ITI Graduates",
      description: "Technology and consulting giant with strong presence in Egypt",
      positions: ["Cloud Architect", "Data Scientist", "AI Specialist"],
      website: "https://www.ibm.com/eg-en"
    },
    {
      name: "ITWorx",
      logo: "/public/itworx.png",
      hiring: "75+ ITI Graduates",
      description: "Leading software development and digital transformation company",
      positions: ["Full Stack Developer", "UX Designer", "DevOps Engineer"],
      website: "https://www.itworx.com"
    },
    {
      name: "Raya Holding",
      logo: "/public/Raya.png",
      hiring: "60+ ITI Graduates",
      description: "Diversified technology and telecommunications group",
      positions: ["Network Engineer", "IT Consultant", "Business Analyst"],
      website: "https://www.raya.com"
    },
    {
      name: "TE Data",
      logo: "/public/tedata.png",
      hiring: "50+ ITI Graduates",
      description: "Egypt's leading internet service provider and digital solutions company",
      positions: ["Network Administrator", "Security Specialist", "Technical Support"],
      website: "https://www.tedata.net"
    },
    {
      name: "Siemens Egypt",
      logo: "/public/siemens1.png",
      hiring: "45+ ITI Graduates",
      description: "Global technology powerhouse focusing on industry, infrastructure and transport",
      positions: ["Automation Engineer", "IoT Developer", "Digital Twin Specialist"],
      website: "https://www.siemens.com/eg/en"
    }
  ]

  const testimonials = [
    {
      name: "Ahmed Mohamed",
      role: "Software Developer at Valeo",
      content: "The ITI program gave me the exact skills needed to land my dream job at Valeo.",
      rating: 5,
    },
    {
      name: "Fatma Ali",
      role: "UI/UX Designer at ITWorx",
      content: "Excellent platform with quality job listings specifically for ITI graduates.",
      rating: 5,
    },
    {
      name: "Mohamed Saad",
      role: "Network Engineer at Raya",
      content: "Love the user experience and the variety of tech opportunities available for ITI alumni.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-rose-50 to-pink-50"></div>
        <FloatingElement className="absolute top-20 left-10 w-20 h-20 bg-red-200 rounded-full opacity-30" delay={0} />
        <FloatingElement className="absolute top-40 right-20 w-16 h-16 bg-rose-300 rounded-full opacity-20" delay={1} />
        <FloatingElement className="absolute bottom-32 left-1/4 w-12 h-12 bg-red-300 rounded-full opacity-25" delay={2} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Side */}
            <FadeInElement className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-red-100 to-rose-100 border border-red-200 animate-pulse">
                  <GraduationCap className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-red-800 font-semibold">Welcome to ITI Career Gateway</span>
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                  Launch Your <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">Tech Career</span>
                  <span className="block text-3xl mt-3 text-gray-700 font-semibold">As an ITI Graduate</span>
                </h1>
                
                <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                  Exclusive opportunities for ITI graduates to connect with top tech employers. 
                  Accelerate your career with our specialized job portal designed for your expertise.
                </p>
              </div>
            </FadeInElement>

            {/* Image Side - Animated */}
            <FadeInElement delay={1} className="flex justify-center items-center">
              <div className="relative">
               <img src="/public/choice-worker-concept.png" alt=""className="max-w-md w-full rounded-lg shadow-xl" />
                <FloatingElement className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl opacity-20" delay={0.5} />
                <FloatingElement className="absolute -bottom-20 -left-30 w-32 h-32 bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl opacity-20" delay={1.5} />
              </div>
            </FadeInElement>
          </div>
        </div>
      </section>

      {/* ITI Stats Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 to-rose-50/50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <FadeInElement className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              ITI <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">Success Statistics</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the impressive achievements and reach of Information Technology Institute
            </p>
          </FadeInElement>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {itiStats.map((stat, index) => (
              <FadeInElement
                key={index}
                delay={index + 2}
                className="group text-center hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${stat.color} rounded-2xl mb-6 shadow-lg group-hover:shadow-xl group-hover:rotate-6 transition-all duration-300`}>
                  <stat.icon className="w-10 h-10 text-white" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-3">
                  <AnimatedCounter value={stat.value} />
                  {stat.label.includes('Rate') ? '%' : stat.label.includes('Graduates') ? '+' : '+'}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </FadeInElement>
            ))}
          </div>
        </div>
      </section>

      {/* Top Hiring Companies Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <FadeInElement className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Top <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">Hiring Companies</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leading organizations that actively recruit ITI graduates for their technical teams
            </p>
          </FadeInElement>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hiringCompanies.map((company, index) => (
              <FadeInElement
                key={index}
                delay={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-2 border border-gray-100 hover:border-red-200"
              >
                <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
                  <div className="w-full h-24 flex items-center justify-center">
                    <img 
                      src={company.logo} 
                      alt={company.name} 
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                      {company.name}
                    </h3>
                    <span className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                      {company.hiring}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-6">{company.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Popular Positions:</h4>
                    <div className="flex flex-wrap gap-2">
                      {company.positions.map((position, i) => (
                        <span 
                          key={i}
                          className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full group-hover:bg-red-50 group-hover:text-red-600 transition-colors"
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
                    className="inline-flex items-center text-red-600 font-semibold hover:text-red-700 transition-colors group-hover:translate-x-2 transform duration-300"
                  >
                    Visit Website
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </FadeInElement>
            ))}
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <FadeInElement className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Explore <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">Career Categories</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover opportunities across various tech domains perfectly suited for ITI graduates
            </p>
          </FadeInElement>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {jobCategories.map((category, index) => (
              <FadeInElement
                key={index}
                delay={index}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2 border border-gray-100 hover:border-red-200"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-red-600 transition-colors">{category.name}</h3>
              </FadeInElement>
            ))}
          </div>
        </div>
      </section>
  
      {/* Job Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <FadeInElement className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Explore <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">Career Categories</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover opportunities across various tech domains perfectly suited for ITI graduates
            </p>
          </FadeInElement>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {jobCategories.map((category, index) => (
              <FadeInElement
                key={index}
                delay={index}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2 border border-gray-100 hover:border-red-200"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-red-600 transition-colors">{category.name}</h3>
              </FadeInElement>
            ))}
          </div>
        </div>
      </section>
        {/* Market Opportunities Section */}
      <section className="py-20 bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 relative overflow-hidden">
          <FadeInElement delay={5} className="mt-12 text-center">
            <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white p-8 rounded-2xl shadow-xl">
              <h4 className="text-2xl font-bold mb-4">🚀 Perfect Timing for ITI Graduates!</h4>
              <p className="text-red-100 text-lg max-w-4xl mx-auto">
                Egypt offers 20%+ cost savings compared to global tech hubs like India, making it an attractive destination for international companies. The government's Digital Egypt initiative is driving massive demand for skilled tech professionals.
              </p>
            </div>
          </FadeInElement>
      </section>
      {/* ITI Locations */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <FadeInElement className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              ITI <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">Nationwide Presence</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              With locations across Egypt, ITI provides quality education and career opportunities everywhere
            </p>
          </FadeInElement>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {itiLocations.map((location, index) => (
              <FadeInElement
                key={index}
                delay={index * 0.5}
                className="group bg-gradient-to-br from-gray-50 to-gray-100 hover:from-red-50 hover:to-rose-50 p-4 rounded-xl text-center transition-all duration-300 hover:shadow-lg cursor-pointer hover:scale-105"
              >
                <MapPin className="w-6 h-6 text-gray-400 group-hover:text-red-500 mx-auto mb-2 transition-colors group-hover:bounce" />
                <p className="text-gray-700 group-hover:text-gray-900 font-medium text-sm">{location}</p>
              </FadeInElement>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <FadeInElement className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from ITI graduates who found their dream careers through our platform
            </p>
          </FadeInElement>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <FadeInElement
                key={index}
                delay={index + 2}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 hover:border-red-200 group"
              >
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-red-400 text-red-400 group-hover:scale-110 transition-transform duration-300" style={{transitionDelay: `${i * 100}ms`}} />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 text-lg italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </FadeInElement>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-rose-600 to-red-700"></div>
        <div className="absolute inset-0 bg-black opacity-10"></div>
        
        {/* Animated background elements */}
        <FloatingElement className="absolute top-10 left-10 w-24 h-24 bg-white/10 rounded-full" delay={0} />
        <FloatingElement className="absolute bottom-20 right-20 w-32 h-32 bg-white/5 rounded-full" delay={1} />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <FadeInElement className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Launch Your ITI Career?</h2>
            <p className="text-red-100 mb-10 text-xl">
              Join thousands of ITI graduates who have found their dream tech jobs through our platform
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {!isLoggedIn && (
                <button 
                  onClick={handleGetStarted}
                  className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 transform"
                >
                  Get Started Now
                </button>
              )}
            </div>
          </FadeInElement>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <FadeInElement>
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
                ITI Career Gateway
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Your gateway to professional success and career growth as an ITI graduate.
              </p>
            </FadeInElement>
            <FadeInElement delay={1}>
              <h4 className="font-semibold mb-6 text-lg">Quick Links</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#" className="hover:text-red-400 transition-colors">Find Jobs</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Post a Job</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">About ITI</a></li>
              </ul>
            </FadeInElement>
            <FadeInElement delay={2}>
              <h4 className="font-semibold mb-6 text-lg">Categories</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#" className="hover:text-red-400 transition-colors">Software Development</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Network Engineering</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Graphic Design</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Data Science</a></li>
              </ul>
            </FadeInElement>
            <FadeInElement delay={3}>
              <h4 className="font-semibold mb-6 text-lg">Support</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#" className="hover:text-red-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Terms of Service</a></li>
              </ul>
            </FadeInElement>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ITI Career Gateway. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPageContent