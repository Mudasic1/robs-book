import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import { useAuth } from "../components/AuthContext";
import styles from "./index.module.css";
import { JSX } from "react";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const { isAuthenticated, user } = useAuth();

  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro"
          >
            Start Learning 📚
          </Link>
          {!isAuthenticated && (
            <>
              <Link
                className="button button--primary button--lg"
                to="/signup"
                style={{ marginLeft: "1rem" }}
              >
                Sign Up
              </Link>
              <Link
                className="button button--outline button--lg"
                to="/login"
                style={{ marginLeft: "1rem" }}
              >
                Login
              </Link>
            </>
          )}
          {isAuthenticated && (
            <div
              style={{ marginLeft: "1rem", color: "white", fontSize: "1.1rem" }}
            >
              Welcome back, {user?.sub || "User"}! 👋
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function Feature({
  title,
  description,
}: {
  title: string;
  description: JSX.Element;
}) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

const FeatureList = [
  {
    title: "AI-Powered Learning 🤖",
    description: (
      <>
        Built-in RAG chatbot helps you understand complex topics. Select any
        text to ask questions instantly.
      </>
    ),
  },
  {
    title: "Personalized Content 🎯",
    description: (
      <>
        Content adapts to your background. Whether you're a software dev or
        hardware engineer, the book speaks your language.
      </>
    ),
  },
  {
    title: "Multi-Language Support 🌏",
    description: (
      <>
        Switch between English and Urdu with a single click to learn in your
        preferred language.
      </>
    ),
  },
];

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Physical AI & Humanoid Robotics Textbook"
    >
      <HomepageHeader />
      <main>
        <section className={styles.features} style={{ padding: "4rem 0" }}>
          <div className="container">
            <div className="row">
              {FeatureList.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
