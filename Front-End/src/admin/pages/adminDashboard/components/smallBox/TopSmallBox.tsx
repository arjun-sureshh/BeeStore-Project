import React from "react";
import { Card, CardBody } from "react-bootstrap";
import Styles from "./TopSmallBox.module.css";

interface TopSmallBoxProps {
  title: string;
  price: string;
  per: string;
  message: string;
  Icon: React.ElementType;
}

const TopSmallBox: React.FC<TopSmallBoxProps> = ({
  title,
  price,
  per,
  message,
  Icon,
}) => {
  return (
    <div className={Styles.smallboxcard}>
      <Card className={Styles.card}>
        <CardBody>
          <div className={Styles.titleRow}>
            <Card.Subtitle className={Styles.cardSubtitle}>
              {title}
            </Card.Subtitle>
            <div className={Styles.iconDiv}>
              {Icon && <Icon className={Styles.icon} />}
            </div>
          </div>
          <div className={Styles.priceSection}>
            <h2>{price}</h2>
          </div>
          <div className={Styles.infoSection}>
            <p className={Styles.percentage}>{per}</p>
            <p className={Styles.message}>{message}</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default TopSmallBox;
