<font color="red">

## IMPORTANT

</font>

#### Make sure you are in the right directory before running the following commands, the path should be `/SRAS/SRAS-camera-access`

## 1 Install virtualenv

```bash
pip install virtualenv
```

## 2 Create virtualenv

```bash
virtualenv venv
```

## 3 Activate virtualenv

```bash
venv\Scripts\activate
```

## 4 Install requirements

```bash
pip install -r requirements.txt
```

## 5 Run flask app

```bash
python main.py
```

## 6 To Deactivate virtualenv

```bash
deactivate
```

### To run the model on the GPU, install CUDA on your sytem and PyTorch version compatible with the CUDA version, and install the compatible torchvision version. You can find the compatible versions [here](https://github.com/pytorch/pytorch/blob/main/RELEASE.md)

### To get CUDA version

```bash
nvcc --version
```

### Example:

<font color="red">

### IMPORTANT

</font>

#### The following commands won't work if you don't have the compatible CUDA version installed on your system.

```bash
pip install torch==2.1.0+cu121 -f https://download.pytorch.org/whl/torch_stable.html
pip install torchvision==0.9.1+cu121 -f https://download.pytorch.org/whl/torch_stable.html
```

### Notice:

Steps `1, 2, 4` are only required for the first time. You can skip these steps for the next time and directly run the following command

```bash
venv\Scripts\activate
python main.py
```
