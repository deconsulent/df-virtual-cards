"use client";

import React, { useState } from 'react';
import Tilt from 'react-parallax-tilt';
import styles from './VirtualCard.module.css';
import { UserProfile } from '../data/mockData';
import { 
  RefreshCw, Mail, Box, Zap, 
  Layers, Calendar, Wrench, Rocket
} from 'lucide-react';

const LinkedinIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

interface VirtualCardProps {
  user: UserProfile;
}

export default function VirtualCard({ user }: VirtualCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <Tilt
      className={styles.cardContainer}
      perspective={1000}
      glareEnable={true}
      glareMaxOpacity={0.2}
      scale={1.02}
      trackOnWindow={true}
    >
      <div className={`${styles.card} ${isFlipped ? styles.isFlipped : ''}`}>
        {/* Front Face */}
        <div className={styles.cardFace}>
          <div className={styles.cardHeader}>
            <div className={styles.logo} title={user.isAvailable ? "Available in the LAB" : "Busy / Do not disturb"}>
              <Box size={20} /> DF
              <div className={`${styles.availabilityDot} ${user.isAvailable ? styles.available : ''}`} />
            </div>
            <button 
              className={styles.flipBtn} 
              onClick={() => setIsFlipped(!isFlipped)}
              title="Flip Card"
            >
              <RefreshCw size={18} />
            </button>
          </div>

          <div className={styles.profileSection}>
            <div className={styles.profileImgContainer}>
              <img src={user.avatarUrl} alt={user.name} className={styles.profileImg} />
            </div>
            <h1 className={styles.name}>{user.name}</h1>
            <p className={styles.role}>{user.role}</p>
          </div>

          <div className={styles.contactSection}>
            <a href={`mailto:${user.email}`} className={styles.contactPill}>
              <Mail size={16} /> Email Me
            </a>
            {user.linkedin && (
              <a href={user.linkedin} target="_blank" rel="noreferrer" className={styles.contactIcon}>
                <LinkedinIcon size={18} />
              </a>
            )}
          </div>
        </div>

        {/* Back Face */}
        <div className={`${styles.cardFace} ${styles.cardBack}`}>
          <div className={styles.cardHeader}>
            <div className={styles.logo}>
              <Box size={20} /> DF
            </div>
            <button 
              className={styles.flipBtn} 
              onClick={() => setIsFlipped(!isFlipped)}
              title="Flip Card"
            >
              <RefreshCw size={18} />
            </button>
          </div>

          <div className={styles.backContent}>
            <div>
              <h3><Zap size={14} /> Superpower</h3>
              <p className={styles.superpowerText}>{user.superpower}</p>
            </div>

            {user.currentProject && (
              <div>
                <h3><Rocket size={14} /> Currently Building</h3>
                <p className={styles.currentProjectText}>{user.currentProject}</p>
              </div>
            )}

            {(user.certifications.length > 0 || user.skills.length > 0) && (
              <div>
                <h3><Wrench size={14} /> Lab Expertise & Skills</h3>
                <div className={styles.skillsTags}>
                  {user.certifications.map(cert => (
                    <span key={cert} className={styles.tag} style={{ background: 'rgba(255, 179, 0, 0.2)', border: '1px solid rgba(255, 179, 0, 0.5)' }}>
                      {cert}
                    </span>
                  ))}
                  {user.skills.map(skill => (
                    <span key={skill} className={styles.tag}>{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {user.calendly && (
              <a href={user.calendly} target="_blank" rel="noreferrer" className={styles.bookBtn}>
                <Calendar size={18} /> Book a Consultation
              </a>
            )}
          </div>
        </div>
      </div>
    </Tilt>
  );
}
