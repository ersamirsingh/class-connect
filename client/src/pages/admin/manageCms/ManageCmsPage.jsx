import React, { useState, useEffect, useRef } from 'react';
import { contentApi } from '../../../api/models/content.api';
import { courseApi } from '../../../api/models/course.api';
import { uploadApi } from '../../../api/models/upload.api';
import { 
  Layout, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Image as ImageIcon,
  Layers,
  X,
  Loader2,
  Search,
  Check,
  UploadCloud,
  Video,
  HelpCircle,
  MessageSquare,
  Award,
  Radio,
  Sliders,
  FolderOpen,
  ArrowUp,
  ArrowDown,
  User,
  Building2,
  DollarSign,
  Calendar,
  ExternalLink,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Website Sections Definition for 1-Click Navigation
const CMS_SECTIONS = [
  { id: 'hero', name: 'Homepage Hero Banner', category: 'Header', icon: Layout, description: 'Headline, subtitle, hero background image & CTA button.' },
  { id: 'student-results', name: 'Batch Zero Real Results', category: 'Outcomes', icon: Award, description: 'Placement metric, CTC packages & graduate student cards.' },
  { id: 'featured_courses', name: 'Featured Masterclasses', category: 'Courses', icon: Sparkles, description: 'Select and order homepage featured courses.' },
  { id: 'live-classes', name: 'Live Classes & Workshops', category: 'Schedule', icon: Radio, description: 'Upcoming live sessions, hosts & workshop posters.' },
  { id: 'video-testimonials', name: 'Real Video Reviews', category: 'Social Proof', icon: Video, description: 'Student video testimonials with hike badges & stream URLs.' },
  { id: 'testimonial', name: 'Student Love Stories', category: 'Social Proof', icon: MessageSquare, description: 'Written student reviews, quotes & star ratings.' },
  { id: 'faqs', name: 'Frequently Asked Questions', category: 'Help', icon: HelpCircle, description: 'Q&A accordion list addressing common queries.' },
  { id: 'banner', name: 'Promotional Banners', category: 'Marketing', icon: ImageIcon, description: 'Custom promotional image banners & discount alerts.' }
];

// PRE-FILLED DEFAULT CONTENT EXACTLY MATCHING THE LIVE HOMEPAGE
const DEFAULT_HOMEPAGE_CMS = {
  'hero': {
    page: 'home',
    section: 'hero',
    title: 'Master High-Income skills that scale your career',
    subtitle: 'Break free from generic tutorials. Build production-grade Web apps, AI agents & Design systems alongside senior industry leaders with 100% bilingual clarity.',
    isActive: true,
    data: {
      imageUrl: '/assets/hero_students_hq.jpg',
      badge: '🚀 100% Practical • High-CTC Tech Outcomes',
      ctaText: 'Explore Courses',
      ctaLink: '/courses'
    }
  },
  'student-results': {
    page: 'home',
    section: 'student-results',
    title: 'Real Results from Batch Zero',
    subtitle: '100% of graduates secured paid industry opportunities',
    isActive: true,
    data: {
      headlineMetric: '100% of graduates* secured paid industry opportunities.',
      opportunitiesText: 'Full-time jobs | Paid internships | Freelance clients',
      ctcStat: '₹16.2 LPA Combined CTC',
      footnote: '*Out of all the students who completed the program and actively pursued paid opportunities from ClassConnect',
      students: [
        {
          id: 'student-1',
          name: 'Abhishek',
          role: 'Video Editor & Media Tech Lead',
          company: 'ATZA Digital',
          packageCTC: '₹18.5 LPA Package',
          avatarUrl: '/assets/students/abhishek.jpg',
          rating: 5,
          review: 'ClassConnect transformed my career. The live masterclasses and microservices project portfolio got me selected at a top tech company with a dream package!',
          skills: ['React 19', 'Node.js', 'System Design'],
          batch: 'Batch Zero 2026'
        },
        {
          id: 'student-2',
          name: 'Yes Patel',
          role: 'Social Media Executive & Brand Tech',
          company: 'Arron Insurance',
          packageCTC: '₹16.8 LPA Package',
          avatarUrl: '/assets/students/yes_patel.jpg',
          rating: 5,
          review: 'The hands-on architecture training gave me the confidence to crack tough technical interviews. Highly recommended for ambitious developers!',
          skills: ['Go', 'Microservices', 'Redis'],
          batch: 'Batch Zero 2026'
        },
        {
          id: 'student-3',
          name: 'Bhoomika',
          role: 'Full-Stack Software Engineer',
          company: 'CloudNative Labs',
          packageCTC: '₹21.0 LPA Package',
          avatarUrl: '/assets/students/bhoomika.jpg',
          rating: 5,
          review: 'Batch Zero was an incredible journey. Mentors provided real-world code reviews that directly translated into my new lead engineering role.',
          skills: ['Next.js', 'LLM Integration', 'Docker'],
          batch: 'Batch Zero 2026'
        },
        {
          id: 'student-4',
          name: 'Divye Ratan',
          role: 'Product Engineer & Core Dev',
          company: 'SaaS Scaleup',
          packageCTC: '₹15.2 LPA Package',
          avatarUrl: '/assets/students/divye_ratan.jpg',
          rating: 5,
          review: 'The bilingual learning environment made complex data structures crystal clear. Secured my dream offer within 3 weeks of graduation!',
          skills: ['TypeScript', 'GraphQL', 'AWS'],
          batch: 'Batch Zero 2026'
        }
      ]
    }
  },
  'live-classes': {
    page: 'home',
    section: 'live-classes',
    title: 'Live Classes & Workshops',
    subtitle: 'Join live interactive sessions with top instructors and solve real problems together.',
    isActive: true,
    data: {
      items: [
        {
          id: 'live-1',
          status: 'LIVE NOW',
          isLiveNow: true,
          registered: '340 registered',
          title: 'Advanced React 19 & Server Components Masterclass',
          host: 'Rohan Sharma',
          type: 'Interactive Session',
          actionText: 'Join Room',
          actionLink: '/courses',
          image: '/assets/workshops/workshop_react19.jpg'
        },
        {
          id: 'live-2',
          status: 'Tomorrow • 6:00 PM IST',
          isLiveNow: false,
          registered: '215 registered',
          title: 'Full-Stack Architecture & Microservices Q&A',
          host: 'Sneha Gupta',
          type: 'Interactive Session',
          actionText: 'Reserve Spot',
          actionLink: '/courses',
          image: '/assets/workshops/workshop_fullstack.jpg'
        },
        {
          id: 'live-3',
          status: 'Aug 4 • 8:00 PM IST',
          isLiveNow: false,
          registered: '490 registered',
          title: 'AI Engineering & LLM Integration Live Workshop',
          host: 'Vikram Mehta',
          type: 'Interactive Session',
          actionText: 'Reserve Spot',
          actionLink: '/courses',
          image: '/assets/workshops/workshop_ai.jpg'
        }
      ]
    }
  },
  'video-testimonials': {
    page: 'home',
    section: 'video-testimonials',
    title: 'Real Video Reviews',
    subtitle: 'Listen to video feedback directly from our learners',
    isActive: true,
    data: {
      items: [
        {
          id: 'v1',
          studentName: 'Rohan Sharma',
          role: 'Full-Stack Engineer @ TechCorp',
          courseName: 'Full-Stack Architecture & Microservices',
          hikeStat: '45% Salary Increase',
          quote: 'The live coding sessions & visual diagrams made microservices so easy to understand!',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          posterUrl: '/assets/students/video_poster_1.jpg'
        },
        {
          id: 'v2',
          studentName: 'Priya Sundaram',
          role: 'Product Developer @ SaaS Scaleup',
          courseName: 'React 19 & Next.js Masterclass',
          hikeStat: '100% Placement Success',
          quote: 'Being able to ask questions in Hindi during live Q&A gave me total confidence in my code.',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          posterUrl: '/assets/students/video_poster_2.jpg'
        },
        {
          id: 'v3',
          studentName: 'Vikram Mehta',
          role: 'Backend Architect @ FinTech',
          courseName: 'AI & LLM Integration System',
          hikeStat: '₹18.5 LPA Placement',
          quote: 'The project-based learning model helped me build production-ready AI applications!',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
          posterUrl: '/assets/students/video_poster_3.jpg'
        }
      ]
    }
  },
  'testimonial': {
    page: 'home',
    section: 'testimonial',
    title: 'Loved by 10,000+ skill builders',
    subtitle: 'Real stories from learners who transformed their careers with ClassConnect.',
    isActive: true,
    data: {
      items: [
        {
          id: 't1',
          name: 'Arjun Mehta',
          role: 'Frontend Engineer @ Swiggy',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
          quote: 'ClassConnect\'s bilingual Hindi & English visual learning made complex React & Next.js concepts crystal clear. Landed my first developer role in 3 months!',
          rating: 5
        },
        {
          id: 't2',
          name: 'Ananya Sharma',
          role: 'UI/UX Designer @ CRED',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
          quote: 'The Figma motion design system and hands-on portfolio projects are top-notch. Best learning OS built for real-world skill builders.',
          rating: 5
        },
        {
          id: 't3',
          name: 'Rohan Verma',
          role: 'Full-Stack Lead @ Razorpay',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
          quote: 'I\'ve tried many platforms, but ClassConnect stands out with its attention to visual detail, bilingual clarity, and verifiable certificates.',
          rating: 5
        },
        {
          id: 't4',
          name: 'Kavita Patel',
          role: 'AI Engineer @ SaaS Startup',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
          quote: 'From zero Python knowledge to building custom LLM AI agents. The bilingual explanations and community support are a total game changer!',
          rating: 5
        }
      ]
    }
  },
  'faqs': {
    page: 'home',
    section: 'faqs',
    title: 'Frequently Asked Questions',
    subtitle: 'Quick answers to common questions about courses, lifetime access, and support.',
    isActive: true,
    data: {
      items: [
        {
          id: 'faq-1',
          question: 'Do I get full lifetime access?',
          answer: 'Yes! Once you enroll in a course, you receive full lifetime access to all video lessons, project code repositories, live class recordings, and future course updates.'
        },
        {
          id: 'faq-2',
          question: 'Are the courses taught in Hindi or English?',
          answer: 'Our courses feature a bilingual learning system — key technical terms are explained in English, with step-by-step practical walk-throughs in clear Hindi and English.'
        },
        {
          id: 'faq-3',
          question: 'Do you provide verifiable certificates upon completion?',
          answer: 'Absolutely! Upon completing 90% or more of your course content, you earn a verifiable certificate of completion with a unique credential ID.'
        },
        {
          id: 'faq-4',
          question: 'Can I access the platform on my mobile phone?',
          answer: 'Yes, ClassConnect is fully optimized for mobile devices, tablets, and desktops so you can learn on the go anywhere, anytime.'
        },
        {
          id: 'faq-5',
          question: 'What is your refund policy?',
          answer: 'We offer a hassle-free 7-day money-back guarantee. If you\'re not completely satisfied with the course, you can request a 100% refund within the first 7 days.'
        }
      ]
    }
  },
  'banner': {
    page: 'home',
    section: 'banner',
    title: 'Live Interactive Masterclasses Daily',
    subtitle: 'Join live sessions with top instructors and solve real problems together.',
    isActive: true,
    data: {
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
      ctaText: 'View Live Schedule',
      ctaLink: '/courses',
      tag: 'LIVE NOW'
    }
  }
};

export const ManageCmsPage = () => {
  const [blocks, setBlocks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSectionId, setActiveSectionId] = useState('hero');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [courseSearch, setCourseSearch] = useState('');

  // Active Section Data State
  const [formData, setFormData] = useState(DEFAULT_HOMEPAGE_CMS['hero']);

  // Media Upload State
  const [uploadingField, setUploadingField] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [cmsRes, courseRes] = await Promise.all([
        contentApi.getAllContentAdmin(),
        courseApi.getAllCoursesAdmin()
      ]);

      const loadedBlocks = Array.isArray(cmsRes?.data) 
        ? cmsRes.data 
        : (cmsRes?.data?.blocks || (Array.isArray(cmsRes) ? cmsRes : []));
      setBlocks(loadedBlocks);

      const loadedCourses = Array.isArray(courseRes?.data) 
        ? courseRes.data 
        : (courseRes?.data?.courses || (Array.isArray(courseRes) ? courseRes : []));
      setCourses(loadedCourses);

      // Select initial block data for 'hero' (either DB block or DEFAULT_HOMEPAGE_CMS['hero'])
      const initialHero = loadedBlocks.find(b => b.section === 'hero') || DEFAULT_HOMEPAGE_CMS['hero'];
      setFormData(initialHero);
    } catch (err) {
      console.warn('Failed to load CMS data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Switch Active Section Tab
  const handleSelectSection = (sectionId) => {
    setActiveSectionId(sectionId);
    const dbBlock = blocks.find(b => b.section === sectionId);

    if (dbBlock) {
      setFormData(dbBlock);
    } else {
      // Pre-fill with PRESENT homepage content default
      const defaultBlock = DEFAULT_HOMEPAGE_CMS[sectionId] || {
        page: 'home',
        section: sectionId,
        title: 'New Section',
        subtitle: 'Section description...',
        isActive: true,
        data: {}
      };
      setFormData(defaultBlock);
    }
  };

  // Save Current Section Form Data
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      if (formData._id) {
        await contentApi.updateContentBlock(formData._id, formData);
        setMessage({ type: 'success', text: `Saved "${formData.title}" content successfully!` });
      } else {
        const created = await contentApi.createContentBlock(formData);
        if (created?.data) setFormData(created.data);
        setMessage({ type: 'success', text: `Created & published "${formData.title}" section!` });
      }
      loadAllData();
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    } catch (err) {
      console.error('Save error:', err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save changes.' });
    } finally {
      setSaving(false);
    }
  };

  // Generic Media File Uploader Handler
  const handleUploadFile = async (file, targetPath, isVideo = false) => {
    if (!file) return;
    setUploadingField(targetPath);
    try {
      const res = await uploadApi.uploadFile(file, isVideo ? 'class-connect/cms-videos' : 'class-connect/cms');
      const url = res.url || res.playbackUrl || res.data?.url;
      if (!url) throw new Error('Upload succeeded but no URL was returned.');

      // Update nested path in formData
      setFormData(prev => {
        const keys = targetPath.split('.');
        const updated = { ...prev };
        let curr = updated;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!curr[keys[i]]) curr[keys[i]] = {};
          curr[keys[i]] = { ...curr[keys[i]] };
          curr = curr[keys[i]];
        }
        curr[keys[keys.length - 1]] = url;
        return updated;
      });
    } catch (err) {
      alert(err.message || 'Failed to upload media file.');
    } finally {
      setUploadingField(null);
    }
  };

  // Toggle Featured Course
  const toggleFeaturedCourse = (courseId) => {
    const currentIds = formData.data?.courseIds || [];
    const newIds = currentIds.includes(courseId)
      ? currentIds.filter(id => id !== courseId)
      : [...currentIds, courseId];
    
    setFormData(prev => ({
      ...prev,
      data: { ...prev.data, courseIds: newIds }
    }));
  };

  // Generic List Items Handlers (for Students, Workshops, Video Reviews, FAQs, Testimonials)
  const handleAddItem = (defaultItem) => {
    const isStudents = activeSectionId === 'student-results';
    const currentItems = formData.data?.items || formData.data?.students || [];
    const newItems = [...currentItems, { id: `item-${Date.now()}`, ...defaultItem }];
    
    setFormData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [isStudents ? 'students' : 'items']: newItems
      }
    }));
  };

  const handleUpdateItem = (index, field, value) => {
    const isStudents = activeSectionId === 'student-results';
    const currentItems = [...(formData.data?.items || formData.data?.students || [])];
    if (!currentItems[index]) return;
    
    currentItems[index] = { ...currentItems[index], [field]: value };
    
    setFormData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [isStudents ? 'students' : 'items']: currentItems
      }
    }));
  };

  const handleDeleteItem = (index) => {
    const isStudents = activeSectionId === 'student-results';
    const currentItems = [...(formData.data?.items || formData.data?.students || [])];
    currentItems.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [isStudents ? 'students' : 'items']: currentItems
      }
    }));
  };

  const currentSectionMeta = CMS_SECTIONS.find(s => s.id === activeSectionId) || CMS_SECTIONS[0];
  const SectionIcon = currentSectionMeta.icon;

  return (
    <div className="p-6 md:p-10 space-y-8 bg-[var(--canvas)] min-h-screen text-[var(--ink)] font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--surface)] p-6 md:p-8 rounded-3xl border border-[var(--border)] shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] text-xs font-extrabold mb-2">
            <Layout className="w-4 h-4" /> ClassConnect CMS Engine
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-manrope">Manage Homepage Content</h1>
          <p className="text-xs md:text-sm text-[var(--ink-muted)] font-medium">All present homepage sections are pre-loaded below. Edit text, replace media, and click Save to update live.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-[var(--primary)] text-white text-xs font-extrabold rounded-full hover:bg-[var(--deep-anchor,#24216F)] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50 min-h-[44px] shrink-0"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save "{formData.title || currentSectionMeta.name}"</span>
        </button>
      </div>

      {/* Alert Banner */}
      {message.text && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between border shadow-xs ${
          message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage({ type: '', text: '' })} className="p-1 hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* MAIN 2-COLUMN CMS LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT SIDEBAR: 1-CLICK SECTION SELECTOR */}
        <div className="lg:col-span-4 bg-[var(--surface)] p-4 md:p-6 rounded-3xl border border-[var(--border)] shadow-xs space-y-3">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-[var(--border)]">
            <span className="text-xs font-extrabold uppercase text-[var(--ink-muted)] tracking-wider">Homepage Sections</span>
            <span className="text-[10px] font-mono font-bold text-[var(--primary)] bg-[var(--primary-soft)] px-2 py-0.5 rounded-full">{CMS_SECTIONS.length} Sections</span>
          </div>

          <div className="space-y-2">
            {CMS_SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isSelected = activeSectionId === sec.id;
              const isSavedInDb = blocks.some(b => b.section === sec.id && b.isActive);

              return (
                <button
                  key={sec.id}
                  onClick={() => handleSelectSection(sec.id)}
                  className={`w-full p-3.5 rounded-2xl flex items-start gap-3 text-left transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-[var(--primary)] text-white shadow-md' 
                      : 'bg-[var(--canvas)] hover:bg-[var(--primary-soft)] text-[var(--ink)] border border-[var(--border)]'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[var(--surface)] text-[var(--primary)]'
                  }`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-extrabold text-xs truncate">{sec.name}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        isSavedInDb 
                          ? (isSelected ? 'bg-emerald-400 text-slate-900' : 'bg-emerald-100 text-emerald-700')
                          : (isSelected ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700')
                      }`}>
                        {isSavedInDb ? 'Saved in DB' : 'Default Preset'}
                      </span>
                    </div>
                    <p className={`text-[10px] line-clamp-1 mt-0.5 ${isSelected ? 'text-white/80' : 'text-[var(--ink-muted)]'}`}>
                      {sec.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT MAIN EDITOR WORKSPACE */}
        <div className="lg:col-span-8 bg-[var(--surface)] p-6 md:p-8 rounded-3xl border border-[var(--border)] shadow-xs space-y-6">
          
          {/* Section Header & Active Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center shrink-0">
                <SectionIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold font-manrope">{currentSectionMeta.name}</h2>
                <p className="text-xs text-[var(--ink-muted)] font-medium">Loaded present content. Edit fields below and click Save.</p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer p-2.5 bg-[var(--canvas)] rounded-xl border border-[var(--border)] text-xs font-bold shrink-0">
              <input
                type="checkbox"
                checked={formData.isActive ?? true}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-[var(--primary)]"
              />
              <span>{formData.isActive ? '✅ Visible on Website' : '⚠️ Section Hidden'}</span>
            </label>
          </div>

          {/* MAIN EDIT FORM */}
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Section Title & Subtitle */}
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-xs font-bold uppercase text-[var(--ink-muted)]">Section Heading / Title</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Heading text..."
                  className="w-full p-3 bg-[var(--canvas)] border border-[var(--border)] rounded-xl text-sm font-semibold focus:outline-none focus:border-[var(--primary)] min-h-[44px]"
                />
              </div>

              <div>
                <label className="block mb-1 text-xs font-bold uppercase text-[var(--ink-muted)]">Section Subtitle / Description</label>
                <textarea
                  rows={2}
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Short description..."
                  className="w-full p-3 bg-[var(--canvas)] border border-[var(--border)] rounded-xl text-sm font-semibold focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>

            {/* DYNAMIC SECTION SPECIFIC EDITORS */}

            {/* 1. FEATURED COURSES SELECTOR */}
            {activeSectionId === 'featured_courses' && (
              <div className="space-y-4 pt-4 border-t border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold uppercase text-[var(--ink)] tracking-wider">
                    Select Courses for Homepage Showcase ({(formData.data?.courseIds || []).length} Selected)
                  </label>
                  <span className="text-[10px] text-[var(--primary)] font-bold">Check to display on home page</span>
                </div>

                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" size={16} />
                  <input
                    type="text"
                    placeholder="Search courses by title..."
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-[var(--canvas)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                  />
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2 border border-[var(--border)] rounded-2xl p-3 bg-[var(--canvas)]">
                  {courses
                    .filter(c => c.title.toLowerCase().includes(courseSearch.toLowerCase()))
                    .map(c => {
                      const isSelected = (formData.data?.courseIds || []).includes(c._id);
                      return (
                        <div
                          key={c._id}
                          onClick={() => toggleFeaturedCourse(c._id)}
                          className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-[var(--primary-soft)] border border-[var(--primary)] text-[var(--primary)] font-bold shadow-xs' 
                              : 'bg-[var(--surface)] hover:bg-[var(--primary-soft)]/50 border border-[var(--border)] text-[var(--ink)]'
                          }`}
                        >
                          <div className="flex items-center gap-3 truncate">
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${isSelected ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-slate-300 bg-white'}`}>
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </div>
                            <span className="text-xs truncate">{c.title}</span>
                          </div>
                          <span className="text-xs font-mono font-bold">₹{c.price}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* 2. BATCH ZERO RESULTS EDITOR */}
            {activeSectionId === 'student-results' && (
              <div className="space-y-6 pt-4 border-t border-[var(--border)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-xs font-bold uppercase text-[var(--ink-muted)]">Headline Outcome Metric</label>
                    <input
                      type="text"
                      value={formData.data?.headlineMetric || ''}
                      onChange={(e) => setFormData({ ...formData, data: { ...formData.data, headlineMetric: e.target.value } })}
                      className="w-full p-3 bg-[var(--canvas)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-xs font-bold uppercase text-[var(--ink-muted)]">CTC / Salary Stat</label>
                    <input
                      type="text"
                      value={formData.data?.ctcStat || ''}
                      onChange={(e) => setFormData({ ...formData, data: { ...formData.data, ctcStat: e.target.value } })}
                      className="w-full p-3 bg-[var(--canvas)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* Student Graduate Cards List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-extrabold uppercase text-[var(--ink)] tracking-wider">
                      Graduate Student Outcome Cards ({(formData.data?.students || []).length})
                    </label>
                    <button
                      type="button"
                      onClick={() => handleAddItem({
                        name: 'New Graduate',
                        role: 'Software Engineer',
                        company: 'Tech Company',
                        packageCTC: '₹18.0 LPA Package',
                        review: 'ClassConnect transformed my career with real-world projects!',
                        skills: ['React 19', 'Node.js']
                      })}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-extrabold hover:bg-emerald-700 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Student Card</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(formData.data?.students || []).map((student, idx) => (
                      <div key={student.id || idx} className="p-4 bg-[var(--canvas)] rounded-2xl border border-[var(--border)] space-y-3">
                        <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                          <span className="text-xs font-bold text-[var(--primary)] font-mono">Student #{idx + 1}: {student.name}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(idx)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            type="text"
                            placeholder="Student Name"
                            value={student.name || ''}
                            onChange={(e) => handleUpdateItem(idx, 'name', e.target.value)}
                            className="p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                          />
                          <input
                            type="text"
                            placeholder="Role / Title"
                            value={student.role || ''}
                            onChange={(e) => handleUpdateItem(idx, 'role', e.target.value)}
                            className="p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                          />
                          <input
                            type="text"
                            placeholder="Company & Package CTC"
                            value={student.packageCTC || ''}
                            onChange={(e) => handleUpdateItem(idx, 'packageCTC', e.target.value)}
                            className="p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                          />
                        </div>

                        <textarea
                          rows={2}
                          placeholder="Review quote..."
                          value={student.review || ''}
                          onChange={(e) => handleUpdateItem(idx, 'review', e.target.value)}
                          className="w-full p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. WORKSHOPS & LIVE CLASSES EDITOR */}
            {activeSectionId === 'live-classes' && (
              <div className="space-y-4 pt-4 border-t border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold uppercase text-[var(--ink)] tracking-wider">
                    Scheduled Live Masterclasses & Workshops ({(formData.data?.items || []).length})
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddItem({
                      status: 'LIVE NOW',
                      isLiveNow: true,
                      title: 'New Masterclass',
                      host: 'Senior Instructor',
                      registered: '200+ registered',
                      actionText: 'Join Room',
                      actionLink: '/courses'
                    })}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-extrabold hover:bg-indigo-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Workshop</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(formData.data?.items || []).map((item, idx) => (
                    <div key={item.id || idx} className="p-4 bg-[var(--canvas)] rounded-2xl border border-[var(--border)] space-y-3">
                      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                        <span className="text-xs font-bold text-indigo-600 font-mono">Workshop #{idx + 1}: {item.title}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(idx)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Workshop Title"
                          value={item.title || ''}
                          onChange={(e) => handleUpdateItem(idx, 'title', e.target.value)}
                          className="p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                        />
                        <input
                          type="text"
                          placeholder="Host Instructor Name"
                          value={item.host || ''}
                          onChange={(e) => handleUpdateItem(idx, 'host', e.target.value)}
                          className="p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. REAL VIDEO REVIEWS EDITOR */}
            {activeSectionId === 'video-testimonials' && (
              <div className="space-y-4 pt-4 border-t border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold uppercase text-[var(--ink)] tracking-wider">
                    Student Video Reviews ({(formData.data?.items || []).length})
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddItem({
                      studentName: 'Student Name',
                      role: 'Software Engineer',
                      courseName: 'Full-Stack Architecture',
                      hikeStat: '50% Salary Increase',
                      quote: 'ClassConnect transformed my technical understanding!',
                      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
                    })}
                    className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-extrabold hover:bg-purple-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Video Review</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(formData.data?.items || []).map((item, idx) => (
                    <div key={item.id || idx} className="p-4 bg-[var(--canvas)] rounded-2xl border border-[var(--border)] space-y-3">
                      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                        <span className="text-xs font-bold text-purple-600 font-mono">Video Review #{idx + 1}: {item.studentName}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(idx)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Student Name"
                          value={item.studentName || ''}
                          onChange={(e) => handleUpdateItem(idx, 'studentName', e.target.value)}
                          className="p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                        />
                        <input
                          type="text"
                          placeholder="Hike / Outcome Stat"
                          value={item.hikeStat || ''}
                          onChange={(e) => handleUpdateItem(idx, 'hikeStat', e.target.value)}
                          className="p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                        />
                      </div>

                      <input
                        type="text"
                        placeholder="Video Stream URL"
                        value={item.videoUrl || ''}
                        onChange={(e) => handleUpdateItem(idx, 'videoUrl', e.target.value)}
                        className="w-full p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. STUDENT LOVE STORIES TESTIMONIALS */}
            {activeSectionId === 'testimonial' && (
              <div className="space-y-4 pt-4 border-t border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold uppercase text-[var(--ink)] tracking-wider">
                    Student Love Stories ({(formData.data?.items || []).length})
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddItem({
                      name: 'Student Name',
                      role: 'Developer @ Company',
                      quote: 'Amazing learning platform with bilingual clarity!',
                      rating: 5
                    })}
                    className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-extrabold hover:bg-rose-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Testimonial</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(formData.data?.items || []).map((item, idx) => (
                    <div key={item.id || idx} className="p-4 bg-[var(--canvas)] rounded-2xl border border-[var(--border)] space-y-3">
                      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                        <span className="text-xs font-bold text-rose-600 font-mono">Testimonial #{idx + 1}: {item.name}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(idx)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Student Name"
                          value={item.name || ''}
                          onChange={(e) => handleUpdateItem(idx, 'name', e.target.value)}
                          className="p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                        />
                        <input
                          type="text"
                          placeholder="Role & Company"
                          value={item.role || ''}
                          onChange={(e) => handleUpdateItem(idx, 'role', e.target.value)}
                          className="p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                        />
                      </div>

                      <textarea
                        rows={2}
                        placeholder="Student quote..."
                        value={item.quote || ''}
                        onChange={(e) => handleUpdateItem(idx, 'quote', e.target.value)}
                        className="w-full p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-medium"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. FAQS & Q&A EDITOR */}
            {activeSectionId === 'faqs' && (
              <div className="space-y-4 pt-4 border-t border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold uppercase text-[var(--ink)] tracking-wider">
                    Frequently Asked Questions ({(formData.data?.items || []).length})
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddItem({
                      question: 'New Question?',
                      answer: 'Detailed answer response...'
                    })}
                    className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-extrabold hover:bg-amber-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Question</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(formData.data?.items || []).map((faq, idx) => (
                    <div key={faq.id || idx} className="p-4 bg-[var(--canvas)] rounded-2xl border border-[var(--border)] space-y-3">
                      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                        <span className="text-xs font-bold text-amber-600 font-mono">Q&A #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(idx)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <input
                        type="text"
                        placeholder="Question title..."
                        value={faq.question || ''}
                        onChange={(e) => handleUpdateItem(idx, 'question', e.target.value)}
                        className="w-full p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-extrabold"
                      />

                      <textarea
                        rows={2}
                        placeholder="Detailed answer text..."
                        value={faq.answer || ''}
                        onChange={(e) => handleUpdateItem(idx, 'answer', e.target.value)}
                        className="w-full p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-medium"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GENERIC HERO / BANNER IMAGE DROPZONE */}
            {(activeSectionId === 'hero' || activeSectionId === 'banner') && (
              <div className="space-y-4 pt-4 border-t border-[var(--border)]">
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--ink-muted)] mb-2">Section Media / Image Banner</label>
                  {formData.data?.imageUrl ? (
                    <div className="relative group rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--canvas)]">
                      <img src={formData.data.imageUrl} alt="Banner" className="w-full h-44 object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3.5 py-2 bg-white text-slate-900 text-xs font-extrabold rounded-lg cursor-pointer"
                        >
                          Replace
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, data: { ...formData.data, imageUrl: '' } })}
                          className="px-3.5 py-2 bg-red-600 text-white text-xs font-extrabold rounded-lg cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => !uploadingField && fileInputRef.current?.click()}
                      className="w-full h-36 border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]/50 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      {uploadingField === 'data.imageUrl' ? (
                        <>
                          <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                          <span className="text-xs font-bold text-amber-600">Uploading banner image...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-8 h-8 text-[var(--ink-muted)]" />
                          <span className="text-xs font-bold text-[var(--ink-muted)]">Click or drag banner image</span>
                          <span className="text-[10px] text-[var(--ink-muted)]/60">JPEG, PNG, WEBP, SVG</span>
                        </>
                      )}
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadFile(f, 'data.imageUrl'); e.target.value = ''; }}
                  />
                </div>
              </div>
            )}

            {/* SAVE BUTTON FOOTER */}
            <div className="pt-6 border-t border-[var(--border)] flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--ink-muted)]">
                Status: {formData.isActive ? 'Active on Site' : 'Hidden'}
              </span>

              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-[var(--primary)] text-white text-xs font-extrabold rounded-full hover:bg-[var(--deep-anchor,#24216F)] transition-all flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50 min-h-[44px]"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Section Changes</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
