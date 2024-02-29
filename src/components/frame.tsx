import { appWindow } from "@tauri-apps/api/window";

import { HiX, HiMinusSm } from "react-icons/hi";
import { FaSeedling } from "react-icons/fa6";
import "src/styles/frame.css";

type TauriFrameProps = {
  children?: React.ReactNode;
};

const TauriFrame = (props: TauriFrameProps) => {
  const isTauri = !!window.__TAURI__;
  const render = isTauri ? <Frame {...props} /> : props.children;
  return <div className="tauriFrameContainer">{render}</div>;
};

type FrameProps = {
  children?: React.ReactNode;
};

const Frame = (props: FrameProps) => {
  return (
    <>
      <nav data-tauri-drag-region className="tauriFrame">
        <span data-tauri-drag-region className="tauriFrameIcon">
          <FaSeedling />
        </span>
        {/* <span data-tauri-drag-region className="tauriFrameText">
          seed
        </span> */}
        <s />
        <button
          className="tauriFrameAction"
          onClick={() => appWindow.minimize()}
        >
          <HiMinusSm />
        </button>
        <button className="tauriFrameAction" onClick={() => appWindow.close()}>
          <HiX />
        </button>
      </nav>
      <div className="tauriFrameContent">{props.children}</div>
    </>
  );
};

export default TauriFrame;
