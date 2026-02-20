---
title: "自注意力机制详解"
---

自注意力机制（Self-Attention）是 Transformer 架构的核心组件。

## 数学表达

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right)V
$$

## 关键特点

1. **并行计算**：不同于 RNN 的序列处理，Self-Attention 可以并行处理所有位置
2. **长距离依赖**：直接计算任意两个位置之间的关系，无需通过中间状态传递
3. **多头注意力**：通过多个注意力头捕获不同的语义关系

## 代码示例

```python
import torch
import torch.nn.functional as F

def scaled_dot_product_attention(query, key, value):
    d_k = query.size(-1)
    scores = torch.matmul(query, key.transpose(-2, -1)) / math.sqrt(d_k)
    attention_weights = F.softmax(scores, dim=-1)
    return torch.matmul(attention_weights, value)
```

这个机制彻底改变了 NLP 领域，成为现代大语言模型的基础。
