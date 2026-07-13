import "./DashboardCard.css";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

function AnimatedNumber({ value }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, [value]);

  return <motion.span>{rounded}</motion.span>;
}

function DashboardCard({ title, value, icon, color, increase }) {
  return (
    <motion.div
      className="dashboard-card"
      whileHover={{ y: -10, scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <div className="card-icon" style={{ background: color }}>
        <i className={`bi ${icon}`}></i>
      </div>

      <div className="card-details">
        <h5>{title}</h5>

        <h2>
          <AnimatedNumber value={value} />
        </h2>

        <span className="increase">
          <i className="bi bi-graph-up-arrow"></i>
          {increase}% this month
        </span>
      </div>
    </motion.div>
  );
}

export default DashboardCard;
