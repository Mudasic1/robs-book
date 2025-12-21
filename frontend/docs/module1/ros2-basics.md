---
sidebar_position: 1
---

import PersonalizeButton from '@site/src/components/PersonalizeButton';
import TranslateButton from '@site/src/components/TranslateButton';

# ROS 2 Basics

<PersonalizeButton chapterId="module1-ros2-basics" />
<TranslateButton chapterId="module1-ros2-basics" />

## Understanding ROS 2 Architecture

ROS 2 (Robot Operating System 2) is the backbone of modern robotics. It's not an operating system but a middleware framework that enables different parts of a robot to communicate.

### Core Concepts

**Nodes**: Independent processes that perform specific tasks
**Topics**: Communication channels for streaming data
**Services**: Request-response communication
**Actions**: Long-running tasks with feedback

## Your First ROS 2 Node

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class MinimalPublisher(Node):
    def __init__(self):
        super().__init__('minimal_publisher')
        self.publisher_ = self.create_publisher(String, 'topic', 10)
        timer_period = 0.5
        self.timer = self.create_timer(timer_period, self.timer_callback)

    def timer_callback(self):
        msg = String()
        msg.data = 'Hello from ROS 2!'
        self.publisher_.publish(msg)

def main(args=None):
    rclpy.init(args=args)
    node = MinimalPublisher()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Exercise

Try selecting the code above and clicking "Ask 🤖" to learn more about specific parts!
