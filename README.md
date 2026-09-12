#  Dogs vs Cats Image Classification using CNN

A deep learning project for classifying images as **Cat** or **Dog** using a Convolutional Neural Network (CNN) built with TensorFlow and Keras.

##  Project Overview

This project implements an end-to-end image classification pipeline for distinguishing between cats and dogs.

The project covers:

- Dataset loading
- Dataset exploration
- Image preprocessing
- Image normalization
- CNN architecture design
- Model training
- Model evaluation
- Single-image prediction
- Multiple-image testing
- Misclassified image analysis

##  Dataset

The project uses the **Dogs vs Cats** dataset from Kaggle by `salader`.

### Dataset Distribution

| Dataset | Cats | Dogs | Total |
|---|---:|---:|---:|
| Training | 10,000 | 10,000 | 20,000 |
| Testing | 2,500 | 2,500 | 5,000 |
| **Total** | **12,500** | **12,500** | **25,000** |

The dataset contains two classes:

```text
0 → Cat
1 → Dog
```

##  Image Preprocessing

Each input image is resized to:

```text
256 × 256 × 3
```

Pixel values are normalized from the range:

```text
0–255
```

to:

```text
0–1
```

using:

```python
image = image / 255.0
```

This preprocessing is also applied during single-image prediction.

## 🧠 CNN Architecture

The model uses three convolutional blocks followed by Global Average Pooling and fully connected layers.

```text
Input
256 × 256 × 3
       │
       ▼
Conv2D
32 Filters, 3×3
       │
       ▼
Batch Normalization
       │
       ▼
MaxPooling2D
       │
       ▼
Conv2D
64 Filters, 3×3
       │
       ▼
Batch Normalization
       │
       ▼
MaxPooling2D
       │
       ▼
Conv2D
128 Filters, 3×3
       │
       ▼
Batch Normalization
       │
       ▼
MaxPooling2D
       │
       ▼
GlobalAveragePooling2D
       │
       ▼
Dense
128 neurons
       │
       ▼
Dropout
       │
       ▼
Dense
64 neurons
       │
       ▼
Dropout
       │
       ▼
Dense
1 neuron
Sigmoid
```

## 🔍 Why GlobalAveragePooling2D?

The initial CNN architecture used `Flatten()` before the dense layers.

For a 256×256 input, this produced a large number of parameters and resulted in significant overfitting.

The model was therefore changed to:

```python
GlobalAveragePooling2D()
```

This significantly reduces the number of parameters before the dense layers and improves generalization.

##  Model Performance

Current model results:

| Metric              | Result |
| ------------------- | -----: |
| Training Accuracy   | ~89.5% |
| Validation Accuracy | ~85.3% |
| Validation Loss     | ~0.398 |

The model shows a much smaller gap between training and validation accuracy compared with the original `Flatten()` architecture.

##  Image Prediction

The trained CNN can classify individual images.

Prediction pipeline:

```text
Input Image
     ↓
Resize to 256×256
     ↓
Normalize /255
     ↓
CNN
     ↓
Sigmoid Probability
     ↓
Cat / Dog
```

For example, a dog image produced:

```text
Raw prediction: 0.9838
Prediction: Dog
Confidence: 98.38%
```

Since the sigmoid output represents the probability of the Dog class:

```text
Probability < 0.5 → Cat
Probability ≥ 0.5 → Dog
```

##  Model Evaluation

The project also evaluates the model using:

* Accuracy
* Loss
* Confusion Matrix
* Classification Report
* Precision
* Recall
* F1-score
* Misclassified image analysis

The misclassified images are visualized to understand the types of images that are difficult for the CNN.

##  Technologies Used

* Python
* TensorFlow
* Keras
* NumPy
* Matplotlib
* Seaborn
* Scikit-learn
* Pillow
* KaggleHub
* Google Colab

##  Project Structure

```text
Dogs-vs-Cats-Image-Classification-using-CNN/
│
├── images/
│   └── .gitkeep
│
├── models/
│   └── .gitkeep
│
├── notebooks/
│   └── Cat_Dog.ipynb
│
├── README.md
├── requirements.txt
└── .gitignore
```

##  How to Run

### 1. Clone the repository

```bash
git clone <your-repository-url>
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Open the notebook

Open:

```text
notebooks/Cat_Dog.ipynb
```

The notebook can be executed using Google Colab or a local Jupyter environment.

### 4. Dataset

The notebook downloads the dataset using KaggleHub:

```python
import kagglehub

dataset_path = kagglehub.dataset_download("salader/dogsvscats")
```

##  Key Learning Outcomes

Through this project, I practiced:

* Image classification
* Convolutional Neural Networks
* Convolution and pooling
* Batch normalization
* Global Average Pooling
* Dropout
* Binary classification
* Sigmoid activation
* Model evaluation
* Confusion matrix analysis
* Image prediction
* Overfitting analysis

##  Future Improvements

The next versions of this project can include:

* Data augmentation
* Hyperparameter tuning
* Improved regularization
* Transfer learning
* MobileNetV2
* EfficientNet
* Better validation strategy
* Model saving and loading
* Streamlit deployment
* Live image classification web application

## Author

**Vivek Kumar**

B.Tech Computer Science & Engineering
Specialization: Machine Learning

---
