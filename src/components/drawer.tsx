import { useConfigControl } from "src/state/config";
import { AnimatePresence, motion } from "framer-motion";

import { Link } from "@tanstack/react-router";
import { FaBoxOpen, FaGear, FaLink } from "react-icons/fa6";
import "src/styles/drawer.css";

const SnowDrawer = () => {
  const drawerStyle = useConfigControl((state) => state.drawerStyle);
  const minWidth = drawerStyle === 0 ? "3rem" : "14rem";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ minWidth: minWidth, width: minWidth }}
        animate={{
          minWidth: minWidth,
          width: minWidth,
          transition: {
            type: "spring",
            duration: 0.5,
          },
        }}
        className="snowDrawer"
        key="drawer"
      >
        {drawerStyle === 0 ? <SnowDrawerClosed /> : <SnowDrawerOpen />}
      </motion.div>
    </AnimatePresence>
  );
};

const SnowDrawerOpen = () => {
  return (
    <>
      <Link to="/snow/packages">
        <div className="snowDrawerLink">
          <FaBoxOpen className="snowDrawerLinkIcon" />
          <p className="snowDrawerLinkText">Packages</p>
        </div>
      </Link>
      <Link to="/snow/connections">
        <div className="snowDrawerLink">
          <FaLink className="snowDrawerLinkIcon" />
          <p className="snowDrawerLinkText">Connections</p>
        </div>
      </Link>
      <Link to="/snow/preferences">
        <div className="snowDrawerLink">
          <FaGear className="snowDrawerLinkIcon" />
          <p className="snowDrawerLinkText">Preferences</p>
        </div>
      </Link>
    </>
  );
};

const SnowDrawerClosed = () => {
  return (
    <>
      <Link to="/snow/packages">
        <div className="snowDrawerLink">
          <FaBoxOpen className="snowDrawerLinkIcon" />
        </div>
      </Link>
      <Link to="/snow/connections">
        <div className="snowDrawerLink">
          <FaLink className="snowDrawerLinkIcon" />
        </div>
      </Link>
      <Link to="/snow/preferences">
        <div className="snowDrawerLink">
          <FaGear className="snowDrawerLinkIcon" />
        </div>
      </Link>
    </>
  );
};

export default SnowDrawer;
export { SnowDrawerOpen, SnowDrawerClosed };
