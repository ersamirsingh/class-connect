import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryApi } from '../../api/models/category.api';
import { Navbar } from '../../components/guest/Navbar';
import { Footer } from '../../components/guest/Footer';
import { Code, Palette, Database, Smartphone, BarChart3, Cpu, Layers, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ICON_MAP = {
  Code,
  Palette,
  Database,
  Smartphone,
  BarChart3,
  Cpu,
};

export const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoryApi.getCategories();
        if (res.success && res.data) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3730E0]/10 text-[#3730E0] text-xs font-extrabold">
            <Layers className="w-4 h-4 text-[#FF7A33]" /> Course Categories
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1E1E2E]">Choose Your Learning Track</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Discover visual courses categorized by domain. Select a track to explore all classes.
          </p>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-10 h-10 text-[#3730E0] animate-spin mb-3" />
            <span className="text-xs font-bold text-slate-500">Loading categories...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const IconComponent = ICON_MAP[cat.icon] || Code;
              return (
                <motion.div key={cat._id} whileHover={{ y: -4 }}>
                  <Link
                    to={`/courses?category=${cat._id}`}
                    className="card-visual p-6 flex flex-col justify-between h-48 group hover:border-[#3730E0]/40 transition-all block"
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"
                        style={{ backgroundColor: cat.color || '#3730E0' }}
                      >
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <span className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#3730E0] group-hover:text-white transition-all">
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-lg text-[#1E1E2E] group-hover:text-[#3730E0] transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-1">
                        {cat.description || 'Explore interactive lessons and projects'}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
