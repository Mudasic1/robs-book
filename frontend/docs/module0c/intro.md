# Module 0c: GenAI Fundamentals

Generative AI (GenAI) is revolutionizing how we interact with humanoid robots. This module covers the foundation of Modern AI: Large Language Models and Vision-Language-Action (VLA) architectures.

## 1. The Transformer Architecture

The "T" in GPT stands for **Transformer**. This architecture allows models to process sequences (like text or sensor data) with **Attention**, focusing on the most relevant parts of the input simultaneously.

### Self-Attention Mechanism

Imagine a robot trying to grab a cup. It must pay "attention" to:

- The cup's position.
- The weight of the cup.
- The movement of its own fingers.
  Transformers handle this multi-dimensional dependency efficiently.

## 2. Large Language Models (LLMs)

LLMs like Gemini and GPT-4 are trained on massive datasets to understand and generate human-like text. In robotics, they act as high-level **Reasoners**.

### Prompt Engineering for Robots

Instead of complex code, we can sometimes guide a robot with natural language:

- _"Pick up the green ball and place it gently on the table."_

## 3. From LLM to VLA (Vision-Language-Action)

A humanoid cannot "see" or "act" through text alone. **VLA models** bridge this gap by integrating:

- **Vision**: Understanding the visual world (CNNS/ViTs).
- **Language**: Instructions and context (LLMs).
- **Action**: Converting intent into motor commands (Policy Networks).

## 4. The RAG Chatbot Integration

Our textbook features a built-in **Retrieval-Augmented Generation (RAG)** chatbot. It combines the reasoning of an LLM with the specific technical knowledge contained in these pages, helping you learn faster.

---

> [!TIP]
> This module is the foundation for the **Vision-Language-Action (VLA)** module later in the book.
