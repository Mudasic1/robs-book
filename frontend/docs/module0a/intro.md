# Module 0a: Python Fundamentals for Robotics

Python is the primary language for AI and robotics development. This module covers the essential Python concepts you need to build intelligent humanoid systems.

## Why Python?

Python's balance of simplicity and powerful libraries (like NumPy, PyTorch, and ROS 2's `rclpy`) makes it the industry standard for robotics research and development.

## 1. Core Syntax & Data Structures

Mastering Python starts with understanding how to handle data efficiently.

```python
# Lists and Dictionaries are essential for robot state management
robot_joints = ["neck", "shoulder_l", "shoulder_r", "elbow_l", "elbow_r"]
sensor_data = {
    "imu": [0.01, 0.05, 9.81],
    "battery": 85.5
}
```

## 2. Functions and Modularity

Robotic systems are complex; clean, reusable code is a must.

```python
def calculate_torque(current, constant):
    """Simple torque calculation for a DC motor."""
    return current * constant
```

## 3. Object-Oriented Programming (OOP)

In robotics, we treat physical components as objects.

```python
class Joint:
    def __init__(self, name, min_angle, max_angle):
        self.name = name
        self.position = 0.0
        self.limits = (min_angle, max_angle)

    def move_to(self, target):
        if self.limits[0] <= target <= self.limits[1]:
            self.position = target
            print(f"{self.name} moved to {target}")
```

## 4. NumPy for Robotics

Almost all robotic math (kinematics, dynamics) is done using matrices.

```python
import numpy as np

# A 4x4 Transformation Matrix representing position and orientation
transform = np.eye(4)
transform[0:3, 3] = [0.5, 0.2, 1.0] # Move 0.5m in X, 0.2m in Y, 1m in Z
```

---

> [!TIP]
> Focus on understanding **Classes** and **NumPy**, as they are used extensively in the ROS 2 and VLA modules.
