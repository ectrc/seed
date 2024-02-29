import { Outlet } from "@tanstack/react-router";
import { motion } from "framer-motion";

import SnowDrawer from "src/components/drawer";
import "src/styles/pageSnow.css";

const SnowPage = () => {
  return (
    <div className="snowPage">
      <SnowDrawer />
      <motion.div
        className="pageContainer"
        animate="visible"
        initial="hidden"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
        }}
      >
        <Outlet />
      </motion.div>
    </div>
  );
};

export default SnowPage;
