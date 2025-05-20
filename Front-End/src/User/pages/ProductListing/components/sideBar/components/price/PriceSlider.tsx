import React, { useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import styles from "./PriceSlider.module.css";
import { Dropdown } from "react-bootstrap";

interface PriceSliderProps {
  onChange: (range: [number, number]) => void;
}

const PriceSlider: React.FC<PriceSliderProps> = ({ onChange }) => {
  const [value, setValue] = useState<number[]>([400, 2000]);
  const [min, setMin] = useState<string>("Min");
  const [max, setMax] = useState<string>("Max");

  const handleChange = (event: Event, newValue: number | number[]) => {
    console.log(event);

    const newRange = newValue as number[];
    setValue(newRange);
    onChange([newRange[0], newRange[1]]);
  };

  const priceOptions = [500, 1000, 2000, 3000, 5000];

  return (
    <div className={styles.body}>
      <div className={styles.sectionTitle}>Price</div>
      <div className={styles.slider}>
        <Box sx={{ width: "100%" }}>
          <Slider
            value={value}
            onChange={handleChange}
            valueLabelDisplay="auto"
            min={400}
            max={5000}
            step={100}
          />
        </Box>
      </div>
      <div className={styles.minMax}>
        <div className={styles.min}>
          <Dropdown>
            <Dropdown.Toggle className={styles.dropdownToggle}>
              ₹{min}
            </Dropdown.Toggle>
            <Dropdown.Menu className={styles.dropdownMenu}>
              {priceOptions.map((price) => (
                <Dropdown.Item
                  key={price}
                  onClick={() => {
                    setMin(price.toString());
                    setValue([price, value[1]]);
                    onChange([price, value[1]]);
                  }}
                >
                  ₹{price}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <span>to</span>
        <div className={styles.max}>
          <Dropdown>
            <Dropdown.Toggle className={styles.dropdownToggle}>
              ₹{max}
            </Dropdown.Toggle>
            <Dropdown.Menu className={styles.dropdownMenu}>
              {priceOptions.map((price) => (
                <Dropdown.Item
                  key={price}
                  onClick={() => {
                    setMax(price.toString());
                    setValue([value[0], price]);
                    onChange([value[0], price]);
                  }}
                >
                  ₹{price}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default PriceSlider;
