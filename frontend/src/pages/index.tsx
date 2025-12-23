import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import { useAuth } from "../components/AuthContext";
import styles from "./index.module.css";
import React from "react";
import type { JSX } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineCpuChip,
  HiOutlineRocketLaunch,
  HiOutlineChatBubbleLeftRight,
  HiOutlineLanguage,
  HiOutlineBolt,
  HiOutlineCog6Tooth,
} from "react-icons/hi2";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
} as const;

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
} as const;

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const { isAuthenticated, user } = useAuth();

  return (
    <header className={clsx("hero", styles.heroBanner)}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Heading as="h1" className={styles.heroTitle}>
            {siteConfig.title}
          </Heading>
        </motion.div>

        <motion.p
          className="hero__subtitle"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {siteConfig.tagline}
        </motion.p>

        <motion.div
          className={styles.buttons}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro"
            style={{
              borderRadius: "12px",
              padding: "1rem 2rem",
              fontWeight: "600",
            }}
          >
            Explore the Curriculum 🚀
          </Link>
          {!isAuthenticated && (
            <>
              <Link
                className="button button--primary button--lg"
                to="/signup"
                style={{
                  borderRadius: "12px",
                  padding: "1rem 2rem",
                  fontWeight: "600",
                }}
              >
                Get Started
              </Link>
            </>
          )}
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.1rem" }}
            >
              Mastering Robotics, <strong>{user?.sub || "Explorer"}</strong> 👋
            </motion.div>
          )}
        </motion.div>
      </div>
    </header>
  );
}

const TopicList = [
  {
    title: "Physical AI Fundamentals",
    description:
      "Deep dive into the intersection of machine learning and physical embodiment, from neural networks to actuator control.",
    icon: <HiOutlineCpuChip />,
  },
  {
    title: "Humanoid Architecture",
    description:
      "Explore the structural design, biomechanics, and kinematic balancing of state-of-the-art humanoid robots.",
    icon: <HiOutlineRocketLaunch />,
  },
  {
    title: "RAG-Powered Learning",
    description:
      "Interact with our intelligent assistant trained on the latest mechanical engineering and AI research papers.",
    icon: <HiOutlineChatBubbleLeftRight />,
  },
  {
    title: "Bilingual Education",
    description:
      "Comprehensive technical content in both English and Urdu, democratizing high-end robotics education.",
    icon: <HiOutlineLanguage />,
  },
  {
    title: "Real-time Control",
    description:
      "Understand low-latency control loops and sensory feedback systems necessary for humanoid stability.",
    icon: <HiOutlineBolt />,
  },
  {
    title: "Kinematics & Dynamics",
    description:
      "Master the mathematical foundations of motion planning, inverse kinematics, and multi-joint dynamics.",
    icon: <HiOutlineCog6Tooth />,
  },
];

function Topic({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.JSX.Element;
}) {
  return (
    <motion.div
      className={styles.topicCard}
      variants={itemVariants}
      whileHover={{ y: -10, transition: { duration: 0.2 } }}
    >
      <div className={styles.iconWrapper}>{icon}</div>
      <Heading as="h3">{title}</Heading>
      <p>{description}</p>
    </motion.div>
  );
}

export default function Home(): React.JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Physical AI & Humanoid Robotics Textbook"
    >
      <HomepageHeader />
      <main>
        <section className={styles.features}>
          <div className="container">
            <motion.h2
              className={styles.sectionTitle}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Core Topics & Features
            </motion.h2>
            <motion.div
              className={styles.topicsGrid}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {TopicList.map((props, idx) => (
                <Topic key={idx} {...props} />
              ))}
            </motion.div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
