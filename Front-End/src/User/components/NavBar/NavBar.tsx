import CategoryBar from "./components/categoryBar/CategoryBar";
import MainBar from "./components/mainBar/MainBar";
import styles from "./NavBar.module.css";

const NavBar: React.FC = () => {
  return (
    <div className={styles.body}>
      <MainBar />
      <CategoryBar />
    </div>
  );
};

export default NavBar;
