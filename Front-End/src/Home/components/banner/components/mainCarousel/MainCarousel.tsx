import React from "react";
import styles from "./MainCarousel.module.css";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";
// import { Button } from 'react-bootstrap'
import img1 from "../../../../../assets/carousel1.jpg";

const MainCarousel: React.FC = () => {
  var items = [
    {
      img: img1,
    },
    {
      img: img1,
    },
  ];

  return (
    <div className={styles.body}>
      <Carousel autoPlay={true}>
        {items.map((item, index) => (
          <Paper>
            <h2 key={index}>
              <img src={item.img} alt="bvjhvhj" />
            </h2>

            {/* <Button className="CheckButton">
                            Check it out!
                        </Button> */}
          </Paper>
        ))}
      </Carousel>
    </div>
  );
};

export default MainCarousel;
