// Banners.tsx
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./Banners.module.css";
// import { Slider } from '@mui/material';

const Banners: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const banners = [
    {
      image: "https://images.unsplash.com/photo-1556656793-08538906a9f8", // New iPhone image
      title: "New iPhone Arrivals!",
      cta: "Explore Now",
    },
    {
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e", // New headsets image
      title: "Best Deals on Headsets!",
      cta: "Shop Now",
    },
    {
      image:
        "https://media.istockphoto.com/id/1080910832/photo/young-stylish-businessman-having-takeaway-coffee.jpg?s=612x612&w=0&k=20&c=p3gZjqRJ7G9I-RbyA5RF7mmIXJkoL_-6ie81lmCSDRI=", // Unchanged
      title: "Trendy Dresses on Sale!",
      cta: "Shop Now",
    },
    {
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085", // New laptop image
      title: "Big Sale on Electronics!",
      cta: "Shop Now",
    },
    // {
    //   image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68", // Unchanged
    //   title: "Fun Toys for Kids!",
    //   cta: "Shop Now",
    // },
  ];

  return (
    <Slider {...settings} className={styles.slider}>
      {banners.map((banner, index) => (
        <div key={index} className={styles.banner}>
          <img src={banner.image} alt={banner.title} />
          <div className={styles.overlay}>
            <h2>{banner.title}</h2>
            <button>{banner.cta}</button>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default Banners;
