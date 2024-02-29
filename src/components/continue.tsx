import { motion } from "framer-motion";

type ContinueProps = {
  customClassName?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const DefaultContinue = (props: ContinueProps) => {
  return (
    <motion.div
      // initial={{ opacity: 0, x: 200 }}
      // animate={{ opacity: 1, x: 0 }}
      className={`continueContainer ${
        props.customClassName ? props.customClassName : ""
      }`}
      {...(props as any)}
    >
      {props.children}
    </motion.div>
  );
};

export default DefaultContinue;
