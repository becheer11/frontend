import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import '../styles/home.scss';
import logo from "../assets/cc.png";
import elloumiImage from "../assets/Mohamed_ali_elloumi_managers.jpg";
import confetti from 'canvas-confetti';

// Particle background component
const ParticleBackground = () => {
  return (
    <div className="particle-background">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="particle"
          initial={{
            x: Math.random() * 100,
            y: Math.random() * 100,
            opacity: 0,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{
            x: Math.random() * 100,
            y: Math.random() * 100,
            opacity: [0, 0.8, 0],
            transition: {
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
          style={{
            background: `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, 0.7)`,
            width: `${Math.random() * 5 + 2}px`,
            height: `${Math.random() * 5 + 2}px`,
            borderRadius: '50%',
            position: 'absolute'
          }}
        />
      ))}
    </div>
  );
};

// Cursor Lights Component
const CursorLights = () => {
  const lightsContainerRef = useRef(null);
  const lightPool = useRef([]);
  const currentLight = useRef(0);
  const lastTimestamp = useRef(0);

  useEffect(() => {
    const container = lightsContainerRef.current;
    if (!container) return;

    // Create a pool of light elements to reuse
    const poolSize = 20;
    
    for (let i = 0; i < poolSize; i++) {
      const light = document.createElement('div');
      light.className = 'light-trail';
      container.appendChild(light);
      lightPool.current.push(light);
    }

    const handleMouseMove = (e) => {
      const now = Date.now();
      // Throttle to create max 20 lights per second
      if (now - lastTimestamp.current < 50) return;
      lastTimestamp.current = now;
      
      const light = lightPool.current[currentLight.current % poolSize];
      
      // Position the light at cursor
      light.style.left = `${e.clientX}px`;
      light.style.top = `${e.clientY}px`;
      
      // Reset and start animation
      light.style.animation = 'none';
      void light.offsetWidth; // Trigger reflow
      light.style.animation = 'fade-trail 1s ease-out forwards';
      
      currentLight.current++;
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="cursor-lights" ref={lightsContainerRef}></div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [hovered, setHovered] = useState(false);

  const clientImages = [
    require("../assets/cl1.png"),
    require("../assets/cl2.jpg"),
    require("../assets/cl3.png"),
    require("../assets/cl4.png"),
    require("../assets/cl5.jpg"),
    require("../assets/cl6.png"),
    require("../assets/cl7.png"),
    require("../assets/cl8.jpg"),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % clientImages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const createConfetti = (x, y) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: x / window.innerWidth, y: y / window.innerHeight },
    });
  };

  const handleColabClick = (e) => {
    createConfetti(e.clientX, e.clientY);
    navigate('/login');
  };

  return (
    <div className="home-page">
      {/* Cursor Lights - Appears on entire page */}
      <CursorLights />
     
      {/* Futuristic animated background */}
      <div className="futuristic-bg">
        <div className="grid-lines"></div>
        <div className="glowing-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
        <ParticleBackground />
      </div>

      {/* Header with glass morphism effect */}
      <motion.header 
        className="header"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        <div className="header__logo">
          <img src={logo} alt="COLAB" className="header__logo-img" />
        </div>
        <div className="header__buttons">
          <button className="btn btn--text">Login</button>
          <button className="btn btn--primary">Contact Us</button>
        </div>
      </motion.header>

      {/* Hero Section with futuristic elements */}
      <section className="hero">
        <div className="hero__content">
          <motion.div
            className="hero__logo-container"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
          >
            <img src={logo} alt="COLAB" className="hero__logo" />
            <div className="logo-glow"></div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="futuristic-text"
          >
            <span className="text-gradient">We believe</span> in doing things differently
            <br />
            <span className="text-gradient">In an innovative</span> way
            <br />
            <span className="text-gradient">with a creative</span> approach
            <br />
            <span className="text-gradient">looking for</span> effectiveness
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hero__cta-container"
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
          >
            <button 
              onClick={handleColabClick}
              className="btn btn--futuristic hero__cta"
            >
              <span>LET'S COLAB</span>
              <div className="btn-hover-effect"></div>
              <div className="btn-particles">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="particle"
                    animate={{
                      x: hovered ? Math.random() * 100 - 50 : 0,
                      y: hovered ? Math.random() * 100 - 50 : 0,
                      opacity: hovered ? [0, 1, 0] : 0,
                      transition: {
                        duration: 1,
                        delay: i * 0.1
                      }
                    }}
                  />
                ))}
              </div>
            </button>
          </motion.div>
        </div>
        
        <div className="hero__scanline"></div>
      </section>

      {/* About Section with futuristic cards */}
      <section className="about">
        <motion.div 
          className="about__content"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="about__left">
            <motion.h2 
              className="about__title futuristic-title"
              initial={{ x: -50 }}
              whileInView={{ x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              About <span>COLAB</span>
            </motion.h2>
            
            <div className="about-cards">
              <motion.div 
                className="about-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="card-icon">⚡</div>
                <h3>Innovation</h3>
                <p>Pushing boundaries with cutting-edge solutions</p>
              </motion.div>
              
              <motion.div 
                className="about-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="card-icon">🌐</div>
                <h3>Global Reach</h3>
                <p>Working with clients worldwide</p>
              </motion.div>
              
              <motion.div 
                className="about-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="card-icon">🚀</div>
                <h3>Growth</h3>
                <p>Helping businesses scale new heights</p>
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            className="about__image-container"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img src={elloumiImage} alt="COLAB Team" className="about__image" />
            <div className="image-frame"></div>
            <div className="image-hologram"></div>
          </motion.div>
        </motion.div>
        
        <div className="about__grid-bg"></div>
      </section>

      {/* Numbers Section with animated counters */}
      <section className="numbers">
        <motion.h2 
          className="numbers__title futuristic-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Our <span>Impact</span>
        </motion.h2>
        
        <div className="numbers__grid">
          <AnimatedNumber value={1999} label="Since" />
          <AnimatedNumber value={100} prefix="+" label="Collaborators" />
          <AnimatedNumber value={1000} prefix="+" label="Brands" />
          <AnimatedNumber value={90} prefix="+" label="Active clients" />
          <AnimatedNumber value={360} suffix="°" label="Content" />
        </div>
        
        <div className="numbers__connection-lines">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M10,50 Q50,10 90,50" />
            <path d="M10,50 Q50,90 90,50" />
          </svg>
        </div>
      </section>

      {/* Client Trust Section with 3D carousel effect */}
      <section className="client-trust">
        <motion.div 
          className="client-trust__content"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="futuristic-title">Clients Who <span>Trust Us</span></h2>
          
          <div className="client-carousel">
            {clientImages.map((img, index) => (
              <motion.div
                key={index}
                className={`client-card ${index === currentImage ? 'active' : ''}`}
                animate={{
                  scale: index === currentImage ? 1 : 0.8,
                  opacity: index === currentImage ? 1 : 0.6,
                  zIndex: index === currentImage ? 1 : 0,
                  filter: index === currentImage ? 'none' : 'blur(1px)',
                  x: (index - currentImage) * 120
                }}
                transition={{ type: 'spring', stiffness: 100 }}
              >
                <img src={img} alt={`Client ${index}`} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Contact Section with futuristic form */}
      <section className="contact">
        <div className="contact__content">
          <motion.h2 
            className="contact__title futuristic-title"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Get In <span>Touch</span>
          </motion.h2>
          
          <motion.p 
            className="contact__text"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Ready to start your next project with us? Send us a message and we'll get back to you as soon as possible.
          </motion.p>
          
          <motion.form 
            className="contact__form"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="form-grid">
              <div className="form-field">
                <input type="text" id="name" required />
                <label htmlFor="name">Your Name</label>
                <div className="form-field__underline"></div>
              </div>
              
              <div className="form-field">
                <input type="email" id="email" required />
                <label htmlFor="email">Your Email</label>
                <div className="form-field__underline"></div>
              </div>
              
              <div className="form-field full-width">
                <textarea id="message" required></textarea>
                <label htmlFor="message">Your Message</label>
                <div className="form-field__underline"></div>
              </div>
            </div>
            
            <button type="submit" className="btn btn--futuristic">
              <span>Send Message</span>
              <div className="btn-hover-effect"></div>
            </button>
          </motion.form>
        </div>
        
        <div className="contact__particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle"></div>
          ))}
        </div>
      </section>
    </div>
  );
};

// Animated number component
const AnimatedNumber = ({ value, prefix = '', suffix = '', label }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const startTime = Date.now();
    const endValue = value;
    
    const animate = () => {
      const progress = Math.min(1, (Date.now() - startTime) / duration);
      setDisplayValue(Math.floor(progress * endValue));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [value]);

  return (
    <motion.div 
      className="numbers__item"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="number-container">
        <h3>
          {prefix}
          <span className="animated-number">{displayValue}</span>
          {suffix}
        </h3>
        <div className="number-glow"></div>
      </div>
      <p>{label}</p>
    </motion.div>
  );
};

export default Home;