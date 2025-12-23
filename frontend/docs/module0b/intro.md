# Module 0b: ML & DL Basics

Machine Learning (ML) and Deep Learning (DL) provide the "brains" for physical AI. This module explores how robots learn from data and simulate neural pathways.

## 1. Machine Learning (ML) Basics

Traditional ML focuses on statistical models to make predictions based on input data.

### Linear Regression & Classification

- **Regression**: Predicting a continuous value (e.g., the exact voltage needed for a motor).
- **Classification**: Categorizing data (e.g., identifying if an object is a "obstacle" or "target").

```python
from sklearn.linear_model import LogisticRegression

# Classification example
clf = LogisticRegression()
clf.fit(X_train, y_train)
is_safe = clf.predict([[obstacle_distance, velocity]])
```

## 2. Deep Learning (DL) Basics

DL uses multi-layered Neural Networks to process complex sensory data like images and depth maps.

### Neural Networks

Inspired by the human brain, these networks consist of:

1. **Input Layer**: Takes raw sensory data.
2. **Hidden Layers**: Extracts features (edges, shapes, patterns).
3. **Output Layer**: Makes the final decision (e.g., "Step forward").

### Backpropagation

The process by which the network learns from its mistakes by adjusting the weights of its connections.

## 3. Libraries: PyTorch and TensorFlow

While many exist, **PyTorch** and **TensorFlow** are the industry leaders.

```python
import torch
import torch.nn as nn

# A simple linear layer
layer = nn.Linear(in_features=128, out_features=64)
```

## 4. Why DL for Humanoids?

Humanoid robots must process high-dimensional data (vision, touch, balance) in real-time. Direct mathematical modeling is often impossible, so we use DL to learn complex behaviors like **Natural Walking** and **Object Manipulation**.

---

> [!IMPORTANT]
> Understanding the difference between a **Feature** (input) and a **Label** (output) is crucial for all following chapters.
