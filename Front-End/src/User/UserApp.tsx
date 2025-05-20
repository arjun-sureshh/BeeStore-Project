import styles from "./UserApp.module.css";
import Footer from "./components/Footer/Footer";
import NavBar from "./components/NavBar/NavBar";
import UserRoutes from "./routers/UserRoutes";

const UserApp: React.FC = () => {
  return (
    <div className={styles.body}>
      <div className={styles.navBar}>
        <NavBar />
      </div>
      <div className={styles.pages}>
        <UserRoutes />
      </div>

      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  );
};

export default UserApp;
