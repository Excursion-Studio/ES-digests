---
title: "Attention Is All You Need"
authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar", "Jakob Uszkoreit", "Llion Jones", "Aidan N. Gomez", "Łukasz Kaiser", "Illia Polosukhin"]
date: "2017-06-12"
tags: ["Transformer", "NLP", "Deep Learning", "Attention Mechanism"]
venue: "NeurIPS 2017"
pdf_url: "https://arxiv.org/abs/1706.03762"
code_url: "https://github.com/tensorflow/tensor2tensor"
editor_note: ["这篇论文提出了具有里程碑意义的 Transformer 架构，彻底改变了 NLP 领域。", "核心创新是自注意力机制（Self-Attention），使模型能够并行处理序列数据。"]
---

# 摘要

> 我们提出了一种新的简单网络架构——**Transformer**，它完全基于注意力机制，摒弃了循环和卷积结构。在两个机器翻译任务上的实验表明，这些模型在质量上更优，同时更易于并行化，训练时间显著减少。

Transformer 模型在 WMT 2014 英德翻译任务上达到了 **28.4 BLEU**，比现有的最佳结果（包括集成模型）提高了 **2 BLEU** 以上。在 WMT 2014 英法翻译任务上，我们的模型在 8 个 GPU 上训练 3.5 天后，建立了新的单模型最先进 BLEU 分数 **41.8**。

---

# 1. 引言

循环神经网络（RNN），特别是长短期记忆（LSTM）和门控循环单元（GRU），已经被牢固地确立为序列建模和转导问题（如语言建模和机器翻译）的最先进方法。

## 1.1 现有方法的局限性

循环模型通常沿输入和输出序列的符号位置进行计算。将位置与计算时间的步骤对齐，它们生成一系列隐藏状态 $h_t$，作为前一个隐藏状态 $h_{t-1}$ 和位置 $t$ 的输入的函数：

$$h_t = f(h_{t-1}, x_t)$$

这种固有的顺序性质阻碍了训练示例内的并行化，这在序列长度较长时变得至关重要。

## 1.2 注意力机制

注意力机制已经成为各种任务中序列建模和转导模型的重要组成部分，允许对依赖关系进行建模，而不考虑它们在输入或输出序列中的距离。

---

# 2. 模型架构

大多数竞争性神经序列转导模型都具有**编码器-解码器**结构。在这里，编码器将符号表示的输入序列 $(x_1, \ldots, x_n)$ 映射到连续表示的序列 $\mathbf{z} = (z_1, \ldots, z_n)$。给定 $\mathbf{z}$，解码器然后生成一个输出序列 $(y_1, \ldots, y_m)$，每次生成一个元素。

## 2.1 编码器和解码器堆栈

**编码器**：编码器由 $N = 6$ 个相同层的堆栈组成。每层有两个子层：
1. 多头{{note:note-self-attention|自注意力机制}}
2. 简单的、位置逐元素的全连接前馈网络

我们对每个子层采用残差连接，然后进行层归一化。即每个子层的输出为：

$$\text{LayerNorm}(x + \text{Sublayer}(x))$$

**解码器**：解码器也由 $N = 6$ 个相同层的堆栈组成。除了编码器层中的两个子层外，解码器还插入了第三个子层，对编码器堆栈的输出执行多头注意力。

## 2.2 注意力机制

注意力函数可以描述为将一个查询和一组键-值对映射到输出，其中查询、键、值和输出都是向量。输出被计算为值的加权和，其中分配给每个值的权重由查询与相应键的兼容性函数计算。

### 2.2.1 缩放点积注意力

我们称我们的注意力为"缩放点积注意力"（Scaled Dot-Product Attention）。输入包括维度为 $d_k$ 的查询和键，以及维度为 $d_v$ 的值。我们计算查询与所有键的点积，除以 $\sqrt{d_k}$，然后应用 softmax 函数以获得值的权重：

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right)V$$

在实际应用中，我们同时计算一组查询的注意力函数，将它们打包成矩阵 $Q$。键和值也打包成矩阵 $K$ 和 $V$。

### 2.2.2 多头注意力

我们发现，与使用 $d_{\text{model}}$ 维度的键、值和查询执行单个注意力函数不同，将查询、键和值分别用不同的、学习到的线性投影投影到 $d_k$、$d_k$ 和 $d_v$ 维度 $h$ 次是有益的：

$$\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, \ldots, \text{head}_h)W^O$$

其中：

$$\text{head}_i = \text{Attention}(QW_i^Q, KW_i^K, VW_i^V)$$

投影矩阵为：

$$W_i^Q \in \mathbb{R}^{d_{\text{model}} \times d_k}, \quad W_i^K \in \mathbb{R}^{d_{\text{model}} \times d_k}, \quad W_i^V \in \mathbb{R}^{d_{\text{model}} \times d_v}$$

在这项工作中，我们使用 $h = 8$ 个并行注意力层（头）。对于每个头，我们使用 $d_k = d_v = d_{\text{model}} / h = 64$。

## 2.3 位置逐元素前馈网络

除了注意力子层外，我们的编码器和解码器中的每一层都包含一个完全连接的前馈网络，该网络以相同的方式应用于每个位置。这包括两个线性变换，中间有一个 ReLU 激活：

$$\text{FFN}(x) = \max(0, xW_1 + b_1)W_2 + b_2$$

不同位置的线性变换相同，但它们在层与层之间使用不同的参数。另一种描述方式是两个核大小为 1 的卷积。输入和输出的维度为 $d_{\text{model}} = 512$，内层的维度为 $d_{ff} = 2048$。

## 2.4 位置编码

由于我们的模型不包含循环和卷积，为了让模型利用序列的顺序，我们必须注入一些关于序列中标记的相对或绝对位置的信息。为此，我们在编码器和解码器堆栈底部的输入嵌入中添加"位置编码"。位置编码与嵌入具有相同的维度 $d_{\text{model}}$，因此两者可以相加。

我们使用不同频率的正弦和余弦函数：

$$PE_{(pos, 2i)} = \sin\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right)$$

$$PE_{(pos, 2i+1)} = \cos\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right)$$

其中 $pos$ 是位置，$i$ 是维度。

---

# 3. 实验

## 3.1 训练数据和批处理

我们在标准的 WMT 2014 英德数据集上进行训练，该数据集包含约 450 万个句子对。句子使用字节对编码（BPE）进行编码，具有约 37000 个标记的共享源-目标词汇表。

## 3.2 硬件和时间

我们在一台配备 8 个 NVIDIA P100 GPU 的机器上训练我们的模型。对于使用本文描述的超参数的基础模型，每个训练步骤大约需要 0.4 秒。我们训练基础模型共 100,000 步或 12 小时。

## 3.3 优化器

我们使用 Adam 优化器，其中 $\beta_1 = 0.9$，$\beta_2 = 0.98$ 和 $\epsilon = 10^{-9}$。我们根据以下公式在训练过程中改变学习率：

$$lrate = d_{\text{model}}^{-0.5} \cdot \min(step\_num^{-0.5}, step\_num \cdot warmup\_steps^{-1.5})$$

这对应于在第一个 $warmup\_steps$ 训练步骤中线性增加学习率，然后与步骤数的倒数平方根成比例地减少它。我们使用 $warmup\_steps = 4000$。

## 3.4 结果

| 模型 | BLEU | 训练成本 (FLOPs) |
|------|------|-----------------|
| GNMT + RL Ensemble | 24.6 | $1.4 \times 10^{20}$ |
| ConvS2S Ensemble | 25.16 | $1.5 \times 10^{20}$ |
| **Transformer (base)** | **27.3** | $3.3 \times 10^{18}$ |
| **Transformer (big)** | **28.4** | $2.3 \times 10^{19}$ |

---

# 4. 结论

在这项工作中，我们提出了 **Transformer**，这是第一个完全基于注意力的序列转导模型，用多头自注意力取代了编码器-解码器架构中最常用的循环层。

对于翻译任务，Transformer 可以比基于循环或卷积层的架构训练得更快。在 WMT 2014 英德和 WMT 2014 英法翻译任务上，我们实现了新的最先进水平。

## 未来工作

我们对基于注意力的模型的未来感到兴奋，并计划将它们应用于其他任务。我们计划将 Transformer 扩展到涉及文本以外的输入和输出模式的问题，并研究局部的、受限的注意力机制，以有效处理大型输入和输出，如图像、音频和视频。

---

# 参考文献

1. Dzmitry Bahdanau, Kyunghyun Cho, and Yoshua Bengio. Neural machine translation by jointly learning to align and translate. *ICLR*, 2015.
2. Kyunghyun Cho et al. Learning phrase representations using RNN encoder-decoder for statistical machine translation. *EMNLP*, 2014.
3. Sepp Hochreiter and Jürgen Schmidhuber. Long short-term memory. *Neural Computation*, 1997.
