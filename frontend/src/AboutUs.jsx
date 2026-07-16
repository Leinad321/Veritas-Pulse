/* eslint-disable no-unused-vars */
import React from 'react';

export default function AboutUs() {
  const team = [
    {
      name: "Daniel Olawale Iyanda",
      role: "Lead Systems & Software Engineer",
      dept: "Electrical & Electronic Engineering",
      institution: "University of Ibadan",
      bio: "An undergraduate engineer specializing in building high-performance software systems integrated closely with physical embedded hardware. Passionate about IoT development, robust web architectures, and creating secure, data-driven automation pipelines.",
      avatar: "/daniel.jpg",
      interests: [
        "⚙️ Embedded Systems & IoT",
        "💻 Frontend Web Architecture",
        "🗄️ Database Management & APIs"
      ],
      socials: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        email: "mailto:daniel@example.com"
      }
    },
    {
      name: "Durosaro Greatness",
      role: "Operations & Infrastructure Analyst",
      dept: "Civil Engineering",
      institution: "University of Ibadan",
      bio: "An engineering student focused on operational frameworks and structural systems. Bringing systematic problem-solving methods, system design paradigms, and analytical structures to ensure software operations are streamlined and resilient.",
      avatar: "/greatness.jpg",
      interests: [
        "🏗️ Structural Infrastructure",
        "📊 Operational Management",
        "📐 System Design Paradigms"
      ],
      socials: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        email: "mailto:greatness@example.com"
      }
    }
  ];

  return (
    <div className="py-12 px-6 font-sans bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Project Creators
          </span>
          <h1 className="text-3xl font-extrabold mt-3 text-slate-900 dark:text-white tracking-tight">
            Meet Team DaGreat
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed">
            Representing the University of Ibadan at the DCP University Engineering Challenge. Bridging the gap between software development, hardware automation, and analytical operations.
          </p>
        </div>

        {/* Profile Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {team.map((member, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header Profile Photo */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-blue-500/20 shrink-0 flex items-center justify-center">
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      onError={(e) => {
                        e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${member.name}`;
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">
                      {member.name}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                      {member.role}
                    </p>
                    <p className="text-slate-400 dark:text-slate-500 text-[11px] font-medium">
                      {member.dept} | {member.institution}
                    </p>
                  </div>
                </div>

                {/* About Bio */}
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-6">
                  {member.bio}
                </p>

                {/* Specific Highlighted Interests */}
                <div className="mb-6">
                  <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5">
                    Areas of Expertise
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {member.interests.map((interest, i) => (
                      <span 
                        key={i} 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 text-xs font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Connect Links */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-850 flex justify-between items-center">
                <span className="text-[10px] text-slate-400">LES UI Session '24/'25</span>
                <div className="flex gap-3">
                  {/* GitHub SVG */}
                  <a 
                    href={member.socials.github} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>

                  {/* LinkedIn SVG */}
                  <a 
                    href={member.socials.linkedin} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>

                  {/* Email SVG */}
                  <a 
                    href={member.socials.email}
                    className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}