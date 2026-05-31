---
title: "Equivariance Properties in Machine Learning"
description: "Testing whether segmentation models behave consistently under rotation, beyond a single validation score."
publishedAt: 2022-11-14
tags: ["Computer vision", "PyTorch", "Group theory"]
---

When we look for signs that a model is good, we usually start with accuracy,
precision, recall and related metrics. Those are useful, but they require a
ground truth. In scientific imaging, we often also care about a different
question: does a model change its answer in a predictable way when the input
changes?

For classification, flipping an image should usually preserve the predicted
class. For segmentation, flipping an image should flip the predicted mask. The
first property is **invariance**; the second is **equivariance**.

## Why test equivariance?

Data augmentation is the standard way to make models robust to transformations
such as rotation, brightness changes and noise. It is common to add those
transformations during training and stop at an improved validation score.
Explicit equivariance tests let us inspect whether the model actually learned
the behaviour that motivated the augmentation.

I explored this by training segmentation models on the Leeds Butterfly Dataset:
832 images across ten butterfly species, with binary masks for foreground
segmentation.

## Comparing two architectures

I trained four models: a plain U-Net and a Group Convolution U-Net, each with
minimal and full augmentation pipelines. The group convolutions use a cyclic
rotation group of order four, corresponding to 90-degree rotations. This gives
the architecture a built-in notion of rotational structure.

Both U-Nets use four downsampling blocks, residual connections and Group
Normalisation. The Group U-Net uses fewer filters per layer to keep the number
of trainable parameters comparable.

```python
import albumentations as A
from albumentations.pytorch.transforms import ToTensorV2

preprocessing = A.Compose([
    A.PadIfNeeded(width, width, border_mode=cv2.BORDER_CONSTANT, value=0),
    A.Normalize(),
    ToTensorV2(),
])

full_transform = A.Compose([
    A.ColorJitter(),
    A.RandomBrightnessContrast(),
    A.SafeRotate(limit=90),
    preprocessing,
])
```

## Evaluation

Alongside regular validation, I sampled an individual image and evaluated each
model across rotations from 0 to 360 degrees:

1. Rotate the input image.
2. Predict its mask.
3. Rotate the predicted mask back to the original orientation.
4. Compare the result with the original ground truth using intersection over
   union.

This exposes variation hidden by a single aggregate score.

| Model | Augmentation | Train IoU | Validation IoU |
| --- | --- | ---: | ---: |
| Plain U-Net | Minimal | **0.9404** | **0.8678** |
| Plain U-Net | Full | 0.8543 | 0.8522 |
| Group U-Net | Minimal | 0.9076 | 0.8563 |
| Group U-Net | Full | 0.7927 | 0.8332 |

## What I learned

The plain U-Net with minimal augmentation performed best on validation IoU.
That is not the whole story. The Group U-Net predictions were more consistent
as the angle changed, even though its headline score was lower.

There is room to improve these models, but the broader point stands: aggregate
metrics are not enough. When labels are scarce or impossible to obtain, it is
useful to define expected model behaviour and perturb inputs deliberately.

The full implementation and experiment tracking setup are available in the
[group-unet repository](https://github.com/dogeplusplus/group-unet).
