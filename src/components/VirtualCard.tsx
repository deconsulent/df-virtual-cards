"use client";

import React, { useState, useEffect, useRef } from 'react';
import Tilt from 'react-parallax-tilt';
import styles from './VirtualCard.module.css';
import { UserProfile } from '../data/mockData';
import { 
  RefreshCw, Mail, Box, Zap, 
  Layers, Calendar, Wrench, Rocket,
  Download, QrCode, X, ChevronDown, Globe, Image as ImageIcon
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '@/context/LanguageContext';
import { toPng } from 'html-to-image';

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
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [showFullQR, setShowFullQR] = useState(false);
  const backContentRef = useRef<HTMLDivElement>(null);
  const frontFaceRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage, t } = useLanguage();

  // Use a stable URL to prevent React hydration errors
  const profileUrl = `https://df-id.vercel.app/${user.username}`;

  const themeClass = user.theme && styles[`theme-${user.theme}`] ? styles[`theme-${user.theme}`] : styles['theme-default'];
  const layoutClass = user.layout === 'horizontal' ? styles['layout-horizontal'] : '';

  const customStyle = user.theme === 'custom' && user.customColor1 && user.customColor2 
    ? { background: `linear-gradient(135deg, ${user.customColor1} 0%, ${user.customColor2} 100%)` } 
    : {};

  const checkScroll = () => {
    if (backContentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = backContentRef.current;
      // Show hint if there is scrollable content and we haven't scrolled to the bottom (with a 10px threshold)
      setShowScrollHint(scrollHeight > clientHeight && scrollTop < scrollHeight - clientHeight - 10);
    }
  };

  const scrollToBottom = () => {
    if (backContentRef.current) {
      backContentRef.current.scrollTo({
        top: backContentRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (isFlipped) {
      const timer = setTimeout(() => {
        checkScroll();
      }, 150); // Wait for flip animation to settle
      return () => clearTimeout(timer);
    } else {
      setShowScrollHint(false);
    }
  }, [isFlipped, user]);

  const handleExportImage = async () => {
    if (!frontFaceRef.current) return;
    try {
      const dataUrl = await toPng(frontFaceRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `${user.username}-card.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error exporting image:', err);
    }
  };

  return (
    <>
      <Tilt
      className={`${styles.cardContainer} ${layoutClass} ${themeClass}`}
      perspective={1000}
      glareEnable={true}
      glareMaxOpacity={0.2}
      scale={1.02}
      trackOnWindow={true}
    >
      <div className={`${styles.card} ${isFlipped ? styles.isFlipped : ''}`}>
        {/* Front Face */}
        <div className={styles.cardFace} ref={frontFaceRef} style={customStyle}>
          <div className={styles.cardHeader}>
            <div className={styles.logo}>
              <img src="/rtuin.png" alt="RTU IN" className={styles.logoImg} onError={(e) => { e.currentTarget.style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'inline'; }} />
              <span style={{ display: 'none', fontWeight: 900, letterSpacing: '2px', fontSize: '1.2rem', fontFamily: 'sans-serif' }}>RTU IN</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className={styles.iconBtn} 
                onClick={(e) => { e.stopPropagation(); setLanguage(language === 'en' ? 'lv' : 'en'); }}
                title={language === 'en' ? 'Switch to Latvian' : 'Switch to English'}
              >
                <Globe size={18} />
                <span style={{ fontSize: '0.7rem', fontWeight: 'bold', marginLeft: '4px' }}>{language.toUpperCase()}</span>
              </button>
              <button 
                className={styles.flipBtn} 
                onClick={() => setIsFlipped(!isFlipped)}
                title={t('flipCard')}
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>

          <div className={styles.profileSection}>
            <div className={styles.profileImgContainer}>
              <img src={user.avatarUrl} alt={user.name} className={styles.profileImg} />
              <div 
                className={`${styles.availabilityDot} ${user.isAvailable ? styles.available : ''}`} 
                title={user.isAvailable ? t('available') : t('busy')}
              />
            </div>
            <div className={styles.profileTextInfo}>
              <h1 className={styles.name}>{user.name}</h1>
              <p className={styles.role}>{user.role}</p>
              {user.schedule?.length ? (
                <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  {user.schedule.map(s => {
                    let dayStr = '';
                    if (s.days.length === 5 && ['Mon','Tue','Wed','Thu','Fri'].every(d => s.days.includes(d))) dayStr = 'Mon-Fri';
                    else if (s.days.length === 2 && ['Sat','Sun'].every(d => s.days.includes(d))) dayStr = 'Weekend';
                    else dayStr = s.days.join(', ');
                    
                    return (
                      <p key={s.id} style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', margin: 0 }}>
                        <Calendar size={12} /> 
                        {`${dayStr} ${s.startTime || ''} ${s.endTime ? '- ' + s.endTime : ''}`.trim()}
                      </p>
                    );
                  })}
                </div>
              ) : (user.officeDay || user.officeHours) ? (
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                  <Calendar size={12} /> 
                  {user.officeDay 
                    ? `${user.officeDay} ${user.officeStartTime || ''} ${user.officeEndTime ? '- ' + user.officeEndTime : ''}`.trim()
                    : user.officeHours}
                </p>
              ) : null}
            </div>
            <div className={styles.qrCodeContainer} onClick={() => setShowFullQR(true)} style={{ cursor: 'pointer' }} title="Show Full QR">
              <QRCodeSVG value={profileUrl} size={60} bgColor={"transparent"} fgColor={"#ffffff"} level={"L"} />
            </div>
          </div>

          <div className={styles.contactSection}>
            <a href={`mailto:${user.email}`} className={styles.contactPill}>
              <Mail size={16} /> {t('emailMe')}
            </a>
            {user.linkedin && (
              <a href={user.linkedin} target="_blank" rel="noreferrer" className={styles.contactIcon}>
                <LinkedinIcon size={18} />
              </a>
            )}
            <button onClick={handleExportImage} className={styles.contactIcon} title="Export as PNG" style={{ border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer' }}>
              <ImageIcon size={18} />
            </button>
            <a href={`/api/vcard?username=${user.username}`} className={styles.contactIcon} download title={t('saveContact')}>
              <Download size={18} />
            </a>
          </div>
        </div>

        {/* Back Face */}
        <div className={`${styles.cardFace} ${styles.cardBack}`} style={customStyle}>
          <div className={styles.cardHeader}>
            <div className={styles.logo}>
              <img src="/rtuin.png" alt="RTU IN" className={styles.logoImg} onError={(e) => { e.currentTarget.style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'inline'; }} />
              <span style={{ display: 'none', fontWeight: 900, letterSpacing: '2px', fontSize: '1.2rem', fontFamily: 'sans-serif' }}>RTU IN</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className={styles.iconBtn} 
                onClick={(e) => { e.stopPropagation(); setLanguage(language === 'en' ? 'lv' : 'en'); }}
                title={language === 'en' ? 'Switch to Latvian' : 'Switch to English'}
              >
                <Globe size={18} />
                <span style={{ fontSize: '0.7rem', fontWeight: 'bold', marginLeft: '4px' }}>{language.toUpperCase()}</span>
              </button>
              <button 
                className={styles.flipBtn} 
                onClick={() => setIsFlipped(!isFlipped)}
                title={t('flipCard')}
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>

          <div 
            ref={backContentRef}
            className={styles.backContent}
            onScroll={checkScroll}
          >
            <div>
              <h3><Zap size={14} /> {t('superpower')}</h3>
              <p className={styles.superpowerText}>{user.superpower}</p>
            </div>

            {user.currentProject && (
              <div>
                <h3><Rocket size={14} /> {t('currentlyBuilding')}</h3>
                <p className={styles.currentProjectText}>{user.currentProject}</p>
              </div>
            )}

            {(user.certifications.length > 0 || user.skills.length > 0) && (
              <div>
                <h3><Wrench size={14} /> {t('labExpertise')}</h3>
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
                <Calendar size={18} /> {t('bookConsultation')}
              </a>
            )}

          </div>

          {showScrollHint && (
            <div className={styles.scrollHint} onClick={scrollToBottom} title="Scroll for more info">
              <span>{t('more')}</span>
              <ChevronDown size={14} className={styles.bounceIcon} />
            </div>
          )}
        </div>
      </div>
      </Tilt>

      {showFullQR && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setShowFullQR(false)}>
          <button style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X size={32} />
          </button>
          <div style={{ background: 'white', padding: '20px', borderRadius: '16px', maxWidth: '90vw', width: '340px', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <QRCodeSVG style={{ width: '100%', height: '100%' }} value={profileUrl} bgColor={"#ffffff"} fgColor={"#000000"} level={"M"} />
          </div>
          <h2 style={{ color: 'white', marginTop: '20px', fontSize: '2rem' }}>{user.name}</h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.2rem' }}>Scan to connect</p>
        </div>
      )}
    </>
  );
}
