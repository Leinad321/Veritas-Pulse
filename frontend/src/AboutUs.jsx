/* eslint-disable no-unused-vars */
import React from 'react';
import iyandaImg from "./assets/iyanda.jpg";
import greatnessImg from "./assets/greatness.jpg";
import { Cpu, LayoutDashboard, Database, Building2, ClipboardList, GitBranch, Github, Linkedin, Mail } from 'lucide-react';

export default function AboutUs() {
  const team = [
    {
      name: "Daniel Olawale Iyanda",
      role: "Lead Systems & Software Engineer",
      dept: "Electrical & Electronic Engineering",
      institution: "University of Ibadan",
      bio: "An undergraduate engineer specializing in building high-performance software systems integrated closely with physical embedded hardware. Passionate about IoT development, robust web architectures, and creating secure, data-driven automation pipelines.",
      avatar: iyandaImg,
      interests: [
        { label: "Embedded Systems & IoT", icon: Cpu },
        { label: "Frontend Web Architecture", icon: LayoutDashboard },
        { label: "Database Management & APIs", icon: Database }
      ],
      socials: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        email: "mailto:daninioluwab@gmail.com"
      }
    },
    {
      name: "Durosaro Greatness",
      role: "Operations & Infrastructure Analyst",
      dept: "Civil Engineering",
      institution: "University of Ibadan",
      bio: "An engineering student focused on operational frameworks and structural systems. Bringing systematic problem-solving methods, system design paradigms, and analytical structures to ensure software operations are streamlined and resilient.",
      avatar: greatnessImg,
      interests: [
        { label: "Structural Infrastructure", icon: Building2 },
        { label: "Operational Management", icon: ClipboardList },
        { label: "System Design Paradigms", icon: GitBranch }
      ],
      socials: {
        linkedin: "https://linkedin.com",
        email: "mailto:"
      }
    }
  ];

  return (
    <div className="vp-about py-16 px-6">
      <style>{`
        .vp-about {
          background-color: var(--bg-base);
          color: var(--text-primary);
          font-family: 'Inter', sans-serif;
          background-image:
            linear-gradient(var(--grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
          background-size: 42px 42px;
        }
        .vp-about .vp-display { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.01em; }
        .vp-about .vp-mono { font-family: 'JetBrains Mono', monospace; letter-spacing: 0.02em; }
      `}</style>

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="max-w-2xl mx-auto mb-14 text-center">
          <span
            className="vp-mono inline-block text-[10px] font-semibold px-2.5 py-1 rounded uppercase tracking-wider"
            style={{ backgroundColor: 'var(--bg-panel-raised)', color: 'var(--accent-cyan)', border: '1px solid var(--border-hair)' }}
          >
            Project creators
          </span>
          <h1 className="vp-display text-3xl font-bold mt-4">Meet Team Veritas</h1>
          <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Team Veritas &middot; University of Ibadan. Building Veritas Pulse to bridge frontend software development, hardware automation, and digital KPI analytics for the DCP Challenge.
          </p>
        </div>

        {/* Signature pulse divider */}
        <div className="mb-14">
          <svg viewBox="0 0 800 40" preserveAspectRatio="none" className="w-full h-8" aria-hidden="true">
            <path
              d="M0,20 L340,20 L360,6 L375,34 L390,20 L800,20"
              fill="none"
              stroke="var(--accent-kiln)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.6"
            />
          </svg>
        </div>

        {/* Profile cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {team.map((member, index) => (
            <div key={index} className="vp-corner-panel p-8 rounded-md flex flex-col justify-between">
              <div className="vp-corner-br"></div>
              <div className="vp-corner-bl"></div>

              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-16 h-16 rounded-lg overflow-hidden shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: 'var(--bg-panel-raised)', border: '2px solid var(--accent-kiln)' }}
                  >
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
                    <h3 className="vp-display font-bold text-lg leading-tight">{member.name}</h3>
                    <p className="vp-mono text-[10px] font-semibold uppercase tracking-wider mt-1" style={{ color: 'var(--accent-kiln)' }}>
                      {member.role}
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {member.dept} &middot; {member.institution}
                    </p>
                  </div>
                </div>

                <p className="text-xs leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                  {member.bio}
                </p>

                <div className="mb-6">
                  <h4 className="vp-mono text-[9px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
                    Areas of expertise
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {member.interests.map((interest, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium"
                        style={{ backgroundColor: 'var(--bg-panel-raised)', border: '1px solid var(--border-hair)', color: 'var(--text-primary)' }}
                      >
                        <interest.icon size={13} style={{ color: 'var(--accent-cyan)' }} />
                        {interest.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-between items-center" style={{ borderTop: '1px solid var(--border-hair)' }}>
                <span className="vp-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  IEEE UI Session
                </span>
                <div className="flex gap-2">
                  {member.socials.github && (
                    
                      href={member.socials.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-md transition-colors"
                      style={{ backgroundColor: 'var(--bg-panel-raised)', color: 'var(--text-muted)' }}
                    >
                      <Github size={15} />
                    </a>
                  )}
                  
                    href={member.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-md transition-colors"
                    style={{ backgroundColor: 'var(--bg-panel-raised)', color: 'var(--text-muted)' }}
                  >
                    <Linkedin size={15} />
                  </a>
                  
                    href={member.socials.email}
                    className="p-2 rounded-md transition-colors"
                    style={{ backgroundColor: 'var(--bg-panel-raised)', color: 'var(--text-muted)' }}
                  >
                    <Mail size={15} />
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