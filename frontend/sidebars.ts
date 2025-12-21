import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    "intro",
    {
      type: "category",
      label: "Module 1: The Robotic Nervous System (ROS 2)",
      items: [
        "module1/intro",
        "module1/ros2-nodes",
        "module1/rclpy-python",
        "module1/urdf-humanoids",
      ],
    },
    {
      type: "category",
      label: "Module 2: The Digital Twin (Gazebo & Unity)",
      items: ["module2/intro"],
    },
    {
      type: "category",
      label: "Module 3: The AI-Robot Brain (NVIDIA Isaac)",
      items: ["module3/intro"],
    },
    {
      type: "category",
      label: "Module 4: Vision-Language-Action (VLA)",
      items: ["module4/intro", "module4/capstone-project"],
    },
  ],
};

export default sidebars;
