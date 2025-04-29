import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import '../styles/home.scss';
import logo from "../assets/cc.png";
import elloumiImage from "../assets/Mohamed_ali_elloumi_managers.jpg"; // Correct image import

// Update with actual client image paths
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

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % clientImages.length);
    }, 2000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="home-page">
      {/* Header */}
      <header className="header">
        <div className="header__logo">
          <img src={logo} alt="COLAB" className="header__logo-img" />
        </div>
        <div className="header__buttons">
          <button className="btn btn--text">Login</button>
          <button className="btn btn--primary">Contact Us</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero__background">
          <div className="hero__overlay"></div>
        </div>
        <div className="hero__content">
          <motion.img 
            src={logo} 
            alt="COLAB" 
            className="hero__logo"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            We believe in doing things differently
            In an innovative way
            with a creative approach
            looking for effectiveness
          </motion.h1>
        </div>
      </section>

      {/* Numbers Section */}
      <section className="numbers">
  <h2 className="numbers__title">Access Numbers</h2> {/* Added the "Access Numbers" title */}
  <div className="numbers__grid">
    <div className="numbers__item">
      <h3>1999</h3>
      <p>Since</p>
    </div>
    <div className="numbers__item">
      <h3>+100</h3>
      <p>Collaborators</p>
    </div>
    <div className="numbers__item">
      <h3>+1000</h3>
      <p>Brands</p>
    </div>
    <div className="numbers__item">
      <h3>+90</h3>
      <p>Active clients</p>
    </div>
    <div className="numbers__item">
      <h3>360°</h3>
      <p>Content</p>
    </div>
  </div>
</section>


      {/* Client Trust Section */}
      <section className="client-trust">
        <div className="client-trust__content">
          <h2>Clients Who Trust Us</h2>
          <div className="client-trust__image-container">
            <img
              src={clientImages[currentImage]}
              alt="Client"
              className="client-trust__image"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
