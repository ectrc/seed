import { useEffect, useState } from "react";
import "src/styles/blobs.css";

const MovingBlobs = () => {
  const [random, setter] = useState([
    [30, 40],
    [40, 55],
    [50, 40],
  ]);

  const update = () => {
    setter([
      [Math.random() * 100, Math.random() * 100],
      [Math.random() * 100, Math.random() * 100],
      [Math.random() * 100, Math.random() * 100],
    ]);
  };

  useEffect(() => {
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="blobs">
      <div
        className="blob green"
        style={{
          left: `${random[0][0]}%`,
          top: `${random[0][1]}%`,
        }}
      />
      <div
        className="blob blue"
        style={{
          left: `${random[1][0]}%`,
          top: `${random[1][1]}%`,
        }}
      />
      <div
        className="blob red"
        style={{
          left: `${random[2][0]}%`,
          top: `${random[2][1]}%`,
        }}
      />
    </div>
  );
};

export default MovingBlobs;
