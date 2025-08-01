import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import vide from './assets/Casino Roulette Free Video Background ,Free Stock Footage,No Copyright, Animations.mp4';
import { 
  Gamepad2, 
  Menu, 
  X, 
  ChevronDown, 
  Star, 
  Users, 
  Trophy, 
  Target,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Bot,
  Zap,
  Shield,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  MessageSquare,
  Brain,
  Sparkles
} from 'lucide-react';

// Enhanced AI Response System
const getAIResponse = (problem: string): string => {
  const responses = {
    'lag': 'Bhai lag ki problem ka solution hai! Pehle internet speed check karo, phir game settings mein graphics quality kam karo. VPN use karo agar server door hai. RAM aur storage bhi clean karo. 90% cases mein ye tricks kaam karti hai!',
    'fps': 'FPS drop ho raha hai? Tension mat lo! Graphics driver update karo, background apps band karo, game ki video settings optimize karo. V-Sync off karo aur frame rate limit set karo. Gaming mode on karo Windows mein!',
    'money': 'Paise kamane ke liye streaming start karo Twitch/YouTube pe, tournaments mein participate karo, coaching dena shuru karo beginners ko. Gaming content banao, affiliate marketing karo gaming products ki. Monthly 50k+ possible hai!',
    'team': 'Team building ke liye Discord server banao, regular practice sessions rakho, communication improve karo, roles define karo clearly. Trust aur coordination sabse important hai. Ek dedicated captain choose karo!',
    'skill': 'Skills improve karne ke liye daily practice karo, pro players ke gameplay dekho, aim trainers use karo, game sense develop karo. Mistakes analyze karo, meta follow karo. Consistency is key bhai!',
    'streaming': 'Streaming setup ke liye OBS use karo, good microphone lena zaroori hai, consistent schedule maintain karo, audience ke saath interact karo. Content quality pe focus karo, views automatically aayenge!',
    'tournament': 'Tournament preparation mein team coordination, strategy planning, aur mental preparation important hai. Scrimmages karo regularly, opponent teams ka analysis karo. Pressure handling practice karo!',
    'equipment': 'Gaming setup ke liye mechanical keyboard, gaming mouse with good DPI, 144Hz monitor, comfortable headset lena zaroori hai. Budget ke according priority set karo. Performance first, aesthetics later!'
  };

  const problemLower = problem.toLowerCase();
  
  for (const [key, response] of Object.entries(responses)) {
    if (problemLower.includes(key)) {
      return response;
    }
  }
  
  return 'Aapka problem unique hai! Hamare experts aapko personalized solution denge. Gaming industry mein har problem ka solution hota hai, bas sahi approach chahiye. Hum aapki help karenge step by step!';
};

// Enhanced Modal Components
const ProblemModal = ({ isOpen, onClose, onSubmit }: any) => {
  const [problem, setProblem] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (problem.trim()) {
      onSubmit(problem, category);
      setProblem('');
      setCategory('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Bot className="text-red-600" />
            AI Gaming Assistant
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Problem Category Select Karo
            </label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Category Choose Karo</option>
              <option value="performance">Performance Issues</option>
              <option value="monetization">Money Making</option>
              <option value="skill">Skill Development</option>
              <option value="team">Team Building</option>
              <option value="streaming">Streaming Setup</option>
              <option value="tournament">Tournament Prep</option>
              <option value="equipment">Gaming Equipment</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apna Gaming Problem Detail Mein Batao
            </label>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Jaise: Mera game lag kar raha hai, FPS drop ho raha hai, paise kaise kamau gaming se..."
              className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>
          
          <button
            type="submit"
            className="relative w-full bg-gradient-to-r from-red-600/80 to-red-700/80 backdrop-blur-lg border border-red-500/30 text-white py-3 px-6 rounded-lg font-semibold hover:from-red-700/90 hover:to-red-800/90 transition-all duration-500 flex items-center justify-center gap-2 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="absolute inset-0 bg-red-600/20 rounded-lg animate-pulse"></div>
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-lg"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12" style={{animation: 'slideLeftRight 3s ease-in-out infinite'}}></div>
            <Sparkles size={20} />
            <span className="relative z-10">AI Solution Generate Karo</span>
          </button>
        </form>
      </div>
    </div>
  );
};

const UserDetailsModal = ({ isOpen, onClose, problem, solution }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      alert(`Thanks ${name}! Aapka solution email kar diya gaya hai. Hamare experts aapko 24 hours mein contact karenge!`);
      onClose();
      setName('');
      setEmail('');
      setPhone('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <CheckCircle className="text-green-600" />
            AI Solution Ready!
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg mb-6">
          <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
            <Brain className="text-red-600" />
            AI Generated Solution:
          </h4>
          <p className="text-red-700 leading-relaxed">{solution}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aapka Naam
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name enter karo"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@gmail.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 9876543210"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          <button
            type="submit"
            className="relative w-full bg-gradient-to-r from-red-600/80 to-red-700/80 backdrop-blur-lg border border-red-500/30 text-white py-3 px-6 rounded-lg font-semibold hover:from-red-700/90 hover:to-red-800/90 transition-all duration-500 flex items-center justify-center gap-2 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="absolute inset-0 bg-red-600/20 rounded-lg animate-pulse"></div>
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-lg"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12" style={{animation: 'slideLeftRight 3s ease-in-out infinite'}}></div>
            <Mail size={20} />
            <span className="relative z-10">Solution Email Karo</span>
          </button>
        </form>
      </div>
    </div>
  );
};

// Navigation Component
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState('');
  const [mobileDropdowns, setMobileDropdowns] = useState({});

  const toggleMobileDropdown = (menu) => {
    setMobileDropdowns((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <nav className="bg-gradient-to-r from-black via-red-900 to-black shadow-2xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-red-600 p-2 rounded-lg">
              <Gamepad2 className="h-8 w-8 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Gaming Solutions</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-red-400 transition-colors font-medium">
              Home
            </Link>
            {/* Dropdowns - AI Assistant, Consultancy, Premium Services, KA Panel */}
            {[
              {
                label: 'AI Assistant',
                icon: <Bot size={18} />,
                key: 'ai',
                links: [
                  { to: '/ai-chat', label: 'AI Chat Support', sub: '24/7 instant help', icon: <MessageSquare size={16} /> },
                  { to: '/ai-analysis', label: 'Performance Analysis', sub: 'AI-powered insights', icon: <Brain size={16} /> },
                ],
              },
              {
                label: 'Consultancy',
                key: 'consultancy',
                links: [
                  { to: '/consultation', label: 'Free Consultation' },
                  { to: '/expert-advice', label: 'Expert Advice' },
                ],
              },
              {
                label: 'Premium Services',
                key: 'premium',
                links: [
                  { to: '/coaching', label: 'Personal Coaching' },
                  { to: '/strategy', label: 'Strategy Development' },
                  { to: '/team-building', label: 'Team Building' },
                  { to: '/monetization', label: 'Monetization Plans' },
                ],
              },
              {
                label: 'KA Panel',
                key: 'panel',
                links: [
                  { to: '/ka-dashboard', label: 'Dashboard' },
                  { to: '/ka-reports', label: 'Reports' },
                ],
              },
            ].map(({ label, icon, key, links }) => (
              <div
                key={key}
                className="relative"
                onMouseEnter={() => setActiveDropdown(key)}
                onMouseLeave={() => setActiveDropdown('')}
              >
                <button className="text-white hover:text-red-400 transition-colors font-medium flex items-center gap-1">
                  {icon && icon}
                  {label}
                  <ChevronDown size={16} />
                </button>
                {activeDropdown === key && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50">
                    {links.map(({ to, label, sub, icon }) => (
                      <Link
                        key={to}
                        to={to}
                        className="block px-4 py-2 text-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {icon && icon}
                          <div>
                            <div className="font-medium">{label}</div>
                            {sub && <div className="text-xs text-gray-500">{sub}</div>}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-red-400 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black bg-opacity-95 py-4 space-y-2">
            <Link to="/" className="block px-4 py-2 text-white hover:text-red-400 transition-colors">
              Home
            </Link>
            {[
              {
                label: 'AI Assistant',
                key: 'ai',
                links: [
                  { to: '/ai-chat', label: 'AI Chat Support' },
                  { to: '/ai-analysis', label: 'Performance Analysis' },
                ],
              },
              {
                label: 'Consultancy',
                key: 'consultancy',
                links: [
                  { to: '/consultation', label: 'Free Consultation' },
                  { to: '/expert-advice', label: 'Expert Advice' },
                ],
              },
              {
                label: 'Premium Services',
                key: 'premium',
                links: [
                  { to: '/coaching', label: 'Personal Coaching' },
                  { to: '/strategy', label: 'Strategy Development' },
                  { to: '/team-building', label: 'Team Building' },
                  { to: '/monetization', label: 'Monetization Plans' },
                ],
              },
              {
                label: 'KA Panel',
                key: 'panel',
                links: [
                  { to: '/ka-dashboard', label: 'Dashboard' },
                  { to: '/ka-reports', label: 'Reports' },
                ],
              },
            ].map(({ label, key, links }) => (
              <div key={key} className="px-4">
                <button
                  onClick={() => toggleMobileDropdown(key)}
                  className="w-full text-left text-white font-medium flex justify-between items-center py-2"
                >
                  {label}
                  <ChevronDown
                    className={`transition-transform ${mobileDropdowns[key] ? 'rotate-180' : ''}`}
                    size={16}
                  />
                </button>
                {mobileDropdowns[key] && (
                  <div className="pl-4 space-y-1">
                    {links.map(({ to, label }) => (
                      <Link
                        key={to}
                        to={to}
                        className="block py-1 text-sm text-red-200 hover:text-white"
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

// Home Page Component
const HomePage = () => {
  const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [currentProblem, setCurrentProblem] = useState('');
  const [currentSolution, setCurrentSolution] = useState('');

  const handleProblemSubmit = (problem: string, category: string) => {
    const solution = getAIResponse(problem);
    setCurrentProblem(problem);
    setCurrentSolution(solution);
    setIsProblemModalOpen(false);
    setIsUserModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
 <section className="relative w-full min-h-screen text-white overflow-hidden">
  {/* Fullscreen Background Video */}
  <div className="absolute inset-0 z-0 w-full h-full pb-20">
     <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute top-0 left-0 w-full h-full object-cover z-0 pointer-events-none"
  
  >
    <source src={vide} type="video/mp4" />
    Your browser does not support the video tag.
  </video>
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
  </div>

  <style>{`
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeInUp {
    animation: fadeInUp 1s ease-out forwards;
  }

  .delay-200 {
    animation-delay: 0.2s;
  }

  .delay-400 {
    animation-delay: 0.4s;
  }
`}</style>


  {/* Foreground Content */}
  <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-4 mt-12 pb-20">
    <div className="bg-red-600 p-4 rounded-full animate-pulse mb-6">
      <Gamepad2 className="h-16 w-16 text-white" />
    </div>
    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">
      Gaming Solutions
    </h1>
    <p className="text-lg md:text-2xl text-red-200 mb-8 max-w-3xl leading-relaxed">
      Kya aap bahut pareshan ho? Sare paise dub rahe hai gaming mein?
      <br />
      <span className="text-white font-semibold">Chinta karne ki koi zarurat nahi hai!</span>
      <br />
      Gaming Solutions laya hai <span className="text-red-400 font-bold">FREE AI-powered consultancy</span>
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
      <button
        onClick={() => setIsProblemModalOpen(true)}
        className="relative bg-gradient-to-r from-red-600/80 to-red-700/80 backdrop-blur-lg border border-red-500/30 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-red-700/90 hover:to-red-800/90 transition-all duration-500 transform hover:scale-105 shadow-2xl flex items-center gap-3 overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        <div className="absolute inset-0 bg-red-600/20 rounded-full animate-pulse"></div>
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-full"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse duration-2000" style={{ animation: 'slideLeftRight 3s ease-in-out infinite' }}></div>
        <Bot className="animate-bounce" />
        <span className="relative z-10">AI Solution Pao - FREE!</span>
        <ArrowRight />
      </button>
      <div className="flex items-center gap-2 text-red-200">
        <Sparkles className="animate-spin" />
        <span className="text-sm">Instant AI Response</span>
      </div>
    </div>

    {/* Optional Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
      <div className="text-center">
        <div className="text-3xl font-bold text-red-400">50K+</div>
        <div className="text-sm text-red-200">Problems Solved</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-red-400">24/7</div>
        <div className="text-sm text-red-200">AI Support</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-red-400">95%</div>
        <div className="text-sm text-red-200">Success Rate</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-red-400">FREE</div>
        <div className="text-sm text-red-200">Basic Consultation</div>
      </div>
    </div>
  </div>
</section>


      {/* AI Features Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
              <Brain className="text-red-600" />
              AI-Powered Gaming Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced artificial intelligence se milega instant solution har gaming problem ka
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-red-600">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Instant AI Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Sirf 30 seconds mein AI aapke gaming problem ka complete analysis kar dega. 
                Performance issues se lekar monetization tak, sab kuch covered hai.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-red-600">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Personalized Solutions</h3>
              <p className="text-gray-600 leading-relaxed">
                Har gamer unique hai, isliye AI personalized solution deta hai. 
                Aapke gaming style aur goals ke according perfect advice milega.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-red-600">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Success Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                AI continuously track karta hai aapki progress. Real-time insights milte hai 
                ki kya kaam kar raha hai aur kya improve karna hai.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Hamare Pass Hai Sabse Advanced Gaming Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Gaming industry ko mala maal karne ke liye humne develop kiye hai ye powerful tools
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-red-500 to-red-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Performance Boost</h3>
              <p className="text-gray-600">
                FPS drop, lag, stuttering - sabka instant solution. 
                AI-powered optimization techniques se gaming experience smooth banao.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-red-500 to-red-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Skill Development</h3>
              <p className="text-gray-600">
                Noob se pro banne ka complete roadmap. 
                Personalized training plans aur advanced techniques sikhao.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-red-500 to-red-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Team Building</h3>
              <p className="text-gray-600">
                Perfect gaming team banane ka formula. 
                Communication, coordination aur chemistry improve karo.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-red-500 to-red-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Monetization</h3>
              <p className="text-gray-600">
                Gaming se paise kamane ke proven methods. 
                Streaming, coaching, tournaments - sab cover kiya hai.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gradient-to-r from-red-50 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Success Stories - Real Results
            </h2>
            <p className="text-xl text-gray-600">
              Dekho kaise humne help ki hai thousands of gamers ki
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                  R
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-800">Rahul - PUBG Player</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic mb-4">
                "Bhai mera rank stuck tha Bronze mein. AI solution follow kiya, 
                ab Diamond tier mein hu! Performance 300% improve ho gaya."
              </p>
              <div className="text-sm text-red-600 font-semibold">
                Bronze → Diamond in 2 months
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                  P
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-800">Priya - Streamer</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic mb-4">
                "Streaming setup aur monetization strategy se monthly 80k+ earn kar rahi hu. 
                Gaming Solutions ne life change kar di!"
              </p>
              <div className="text-sm text-red-600 font-semibold">
                ₹5k → ₹80k monthly income
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-800">Arjun - Team Captain</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic mb-4">
                "Team building strategies use karke 3 tournaments jeet chuke hai. 
                Prize money se gaming setup upgrade kar liya!"
              </p>
              <div className="text-sm text-red-600 font-semibold">
                3 Tournament Wins - ₹5L+ Prize Money
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-black to-red-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Gaming Journey?
          </h2>
          <p className="text-xl mb-8 text-red-200">
            Join 50,000+ gamers jo already use kar rahe hai hamare AI-powered solutions
          </p>
          <button
            onClick={() => setIsProblemModalOpen(true)}
            className="relative bg-gradient-to-r from-red-600/80 to-red-700/80 backdrop-blur-lg border border-red-500/30 text-white px-12 py-4 rounded-full text-xl font-bold hover:from-red-700/90 hover:to-red-800/90 transition-all duration-500 transform hover:scale-105 shadow-2xl flex items-center gap-3 mx-auto overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="absolute inset-0 bg-red-600/20 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-full"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse duration-2000" style={{animation: 'slideLeftRight 3s ease-in-out infinite'}}></div>
            <Sparkles className="animate-pulse" />
            <span className="relative z-10">Start Your Success Story</span>
            <ArrowRight />
          </button>
        </div>
      </section>

      {/* Modals */}
      <ProblemModal
        isOpen={isProblemModalOpen}
        onClose={() => setIsProblemModalOpen(false)}
        onSubmit={handleProblemSubmit}
      />
      
      <UserDetailsModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        problem={currentProblem}
        solution={currentSolution}
      />
    </div>
  );
};

// AI Chat Page
const AIChatPage = () => {
  const [messages, setMessages] = useState([
    { type: 'ai', content: 'Namaste! Main aapka AI Gaming Assistant hu. Koi bhi gaming problem ho, main instantly solution de sakta hu!' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = { type: 'user', content: input };
    const aiResponse = { type: 'ai', content: getAIResponse(input) };
    
    setMessages([...messages, userMessage, aiResponse]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Bot className="animate-pulse" />
              AI Gaming Assistant - 24/7 Support
            </h1>
            <p className="text-red-200 mt-2">Instant solutions for all gaming problems</p>
          </div>
          
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.type === 'user' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {message.content}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-6 border-t">
            <div className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Apna gaming problem yaha type karo..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button
                onClick={handleSend}
                className="relative bg-gradient-to-r from-red-600/80 to-red-700/80 backdrop-blur-lg border border-red-500/30 text-white px-6 py-3 rounded-lg hover:from-red-700/90 hover:to-red-800/90 transition-all duration-500 flex items-center gap-2 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="absolute inset-0 bg-red-600/20 rounded-lg animate-pulse"></div>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-lg"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12" style={{animation: 'slideLeftRight 3s ease-in-out infinite'}}></div>
                <ArrowRight size={20} />
                <span className="relative z-10">Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Footer
const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      alert('Newsletter subscription successful! Gaming tips aur updates milte rahenge.');
      setEmail('');
    }
  };

  return (
    <footer className="bg-gradient-to-r from-black via-red-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-red-600 p-3 rounded-xl">
                <Gamepad2 className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold">Gaming Solutions</span>
            </div>
            <p className="text-red-200 mb-6 leading-relaxed">
              India ka #1 AI-powered gaming consultancy platform. 
              Har gaming problem ka instant solution, 24/7 support, 
              aur proven strategies jo actually kaam karti hai.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-red-600 p-3 rounded-full hover:bg-red-700 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-red-600 p-3 rounded-full hover:bg-red-700 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="bg-red-600 p-3 rounded-full hover:bg-red-700 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="bg-red-600 p-3 rounded-full hover:bg-red-700 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-red-400">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-red-200 hover:text-white transition-colors flex items-center gap-2"><ArrowRight size={16} /> Home</Link></li>
              <li><Link to="/ai-chat" className="text-red-200 hover:text-white transition-colors flex items-center gap-2"><ArrowRight size={16} /> AI Assistant</Link></li>
              <li><Link to="/consultation" className="text-red-200 hover:text-white transition-colors flex items-center gap-2"><ArrowRight size={16} /> Free Consultation</Link></li>
              <li><Link to="/coaching" className="text-red-200 hover:text-white transition-colors flex items-center gap-2"><ArrowRight size={16} /> Premium Coaching</Link></li>
              <li><Link to="/monetization" className="text-red-200 hover:text-white transition-colors flex items-center gap-2"><ArrowRight size={16} /> Monetization Plans</Link></li>
            </ul>
          </div>

          {/* Gaming Services */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-red-400">Gaming Services</h3>
            <ul className="space-y-3">
              <li className="text-red-200 flex items-center gap-2"><CheckCircle size={16} className="text-red-500" /> Performance Optimization</li>
              <li className="text-red-200 flex items-center gap-2"><CheckCircle size={16} className="text-red-500" /> Skill Development</li>
              <li className="text-red-200 flex items-center gap-2"><CheckCircle size={16} className="text-red-500" /> Team Building</li>
              <li className="text-red-200 flex items-center gap-2"><CheckCircle size={16} className="text-red-500" /> Streaming Setup</li>
              <li className="text-red-200 flex items-center gap-2"><CheckCircle size={16} className="text-red-500" /> Tournament Preparation</li>
              <li className="text-red-200 flex items-center gap-2"><CheckCircle size={16} className="text-red-500" /> Monetization Strategies</li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-red-400">Contact & Updates</h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-red-200">
                <Mail size={18} className="text-red-500" />
                <span>support@gamingsolutions.in</span>
              </div>
              <div className="flex items-center gap-3 text-red-200">
                <Phone size={18} className="text-red-500" />
                <span>+91 9876543210</span>
              </div>
              <div className="flex items-center gap-3 text-red-200">
                <MapPin size={18} className="text-red-500" />
                <span>Mumbai, India</span>
              </div>
              <div className="flex items-center gap-3 text-red-200">
                <Clock size={18} className="text-red-500" />
                <span>24/7 AI Support Available</span>
              </div>
            </div>
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <h4 className="font-semibold text-red-300">Gaming Tips Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="flex-1 px-4 py-2 rounded-l-lg bg-red-800 text-white placeholder-red-300 border border-red-700 focus:outline-none focus:border-red-500"
                  required
                />
                <button
                  type="submit"
                  className="relative bg-gradient-to-r from-red-600/80 to-red-700/80 backdrop-blur-lg border border-red-500/30 px-4 py-2 rounded-r-lg hover:from-red-700/90 hover:to-red-800/90 transition-all duration-500 overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="absolute inset-0 bg-red-600/20 animate-pulse"></div>
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12" style={{animation: 'slideLeftRight 3s ease-in-out infinite'}}></div>
                  <ArrowRight size={20} className="relative z-10" />
                </button>
              </div>
              <p className="text-xs text-red-300">Weekly gaming tips aur exclusive offers</p>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-red-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-red-200 mb-4 md:mb-0">
              © 2024 Gaming Solutions. All rights reserved. Made with ❤️ for Indian Gamers.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-red-200 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-red-200 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-red-200 hover:text-white transition-colors">Refund Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ai-chat" element={<AIChatPage />} />
          <Route path="/consultation" element={<div className="py-20 text-center"><h1 className="text-4xl font-bold">Free Consultation Page</h1></div>} />
          <Route path="/coaching" element={<div className="py-20 text-center"><h1 className="text-4xl font-bold">Premium Coaching Page</h1></div>} />
          <Route path="/strategy" element={<div className="py-20 text-center"><h1 className="text-4xl font-bold">Strategy Development Page</h1></div>} />
          <Route path="/team-building" element={<div className="py-20 text-center"><h1 className="text-4xl font-bold">Team Building Page</h1></div>} />
          <Route path="/monetization" element={<div className="py-20 text-center"><h1 className="text-4xl font-bold">Monetization Plans Page</h1></div>} />
          <Route path="/expert-advice" element={<div className="py-20 text-center"><h1 className="text-4xl font-bold">Expert Advice Page</h1></div>} />
          <Route path="/ai-analysis" element={<div className="py-20 text-center"><h1 className="text-4xl font-bold">AI Performance Analysis Page</h1></div>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;