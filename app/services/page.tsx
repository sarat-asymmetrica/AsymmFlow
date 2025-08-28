'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, Zap, Database, FileText, 
  TrendingUp, Shield, Cloud, Sparkles,
  BarChart, Users, Settings, Globe
} from 'lucide-react';

const services = [
  {
    id: 'intelligence',
    title: 'Business Intelligence',
    description: 'Advanced analytics and insights powered by AI',
    icon: Brain,
    color: 'from-purple-500 to-blue-500',
    features: [
      'Real-time analytics dashboard',
      'Predictive trend analysis',
      'Customer behavior insights',
      'Competitive intelligence'
    ],
    metrics: {
      accuracy: '94%',
      speed: '3x faster',
      insights: '250+ KPIs'
    }
  },
  {
    id: 'automation',
    title: 'Process Automation',
    description: 'Streamline operations with intelligent automation',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    features: [
      'Workflow optimization',
      'Task automation',
      'Smart scheduling',
      'Resource allocation'
    ],
    metrics: {
      efficiency: '+45%',
      timeSaved: '20hrs/week',
      accuracy: '99.9%'
    }
  },
  {
    id: 'data',
    title: 'Data Management',
    description: 'Secure, scalable data processing and migration',
    icon: Database,
    color: 'from-green-500 to-teal-500',
    features: [
      'Excel to database migration',
      'OneDrive integration',
      'Real-time synchronization',
      'Data quality assurance'
    ],
    metrics: {
      processing: '1M+ records',
      uptime: '99.99%',
      security: 'Enterprise-grade'
    }
  },
  {
    id: 'reporting',
    title: 'Smart Reporting',
    description: 'Generate comprehensive reports instantly',
    icon: FileText,
    color: 'from-blue-500 to-cyan-500',
    features: [
      'Automated report generation',
      'Custom templates',
      'Multi-format export',
      'Real-time updates'
    ],
    metrics: {
      formats: '15+',
      speed: '<2 seconds',
      customization: 'Unlimited'
    }
  }
];

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0f1922] to-[#243442] text-white py-20">
        <div className="container mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-light mb-4"
          >
            Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300"
          >
            Powerful business solutions that drive growth
          </motion.p>
        </div>
      </div>
      
      {/* Services Grid */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedService(service.id)}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all"
            >
              <div className={`h-2 bg-gradient-to-r ${service.color}`} />
              
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${service.color} text-white`}>
                    <service.icon size={28} />
                  </div>
                  <h2 className="text-2xl font-semibold ml-4">{service.title}</h2>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {service.description}
                </p>
                
                {/* Features */}
                <div className="space-y-3 mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center">
                      <Sparkles className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-700 dark:text-gray-200">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  {Object.entries(service.metrics).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        {value}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Additional Services */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-semibold mb-8">Also Included</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, label: 'Team Collaboration' },
              { icon: Shield, label: 'Security & Compliance' },
              { icon: Cloud, label: 'Cloud Integration' },
              { icon: Globe, label: 'Multi-language Support' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6"
              >
                <item.icon className="w-8 h-8 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                <p className="text-sm font-medium">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-16"
        >
          <a
            href="/dashboard"
            className="inline-block px-8 py-4 bg-gradient-to-r from-[#4a9b9f] to-[#6ab5b9] text-white rounded-full font-semibold hover:shadow-xl transition-all"
          >
            Start Using Services
          </a>
        </motion.div>
      </div>
    </div>
  );
}