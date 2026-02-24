# 状态空间方程

MPC 的推导从状态空间方程开始：

$$ x(t+1) = A x(t) + B u(t) $$
$$ y(t) = C x(t) + D u(t) $$

其中：
- $x(t)$ 是系统的状态矢量
- $u(t)$ 是系统的输入矢量
- $y(t)$ 是系统的输出矢量
- $A, B, C, D$ 是系统矩阵

# 开环预测

根据状态空间方程，系统的未来状态可以通过递推计算得到：

$$ x(t+1) = A x(t) + B u(t) $$
$$ x(t+2) = A^2 x(t) + A B u(t) + B u(t+1) $$
$$ \vdots $$
$$ x(t+N) = A^N x(t) + A^{N-1} B u(t) + \dots + B u(t+N-1) $$

将上述预测方程写成矩阵形式：

$$ X = \Phi x(t) + \Gamma U $$

其中：
$$ X = \begin{bmatrix} x(t+1|t) \\ x(t+2|t) \\ \vdots \\ x(t+N|t) \end{bmatrix}, \quad \Phi = \begin{bmatrix} A \\ A^2 \\ \vdots \\ A^N \end{bmatrix}, \quad \Gamma = \begin{bmatrix} B & 0 & \dots & 0 \\ A B & B & \dots & 0 \\ \vdots & \vdots & \ddots & \vdots \\ A^{N-1} B & A^{N-2} B & \dots & B \end{bmatrix}, \quad U = \begin{bmatrix} u(t) \\ u(t+1) \\ \vdots \\ u(t+N-1) \end{bmatrix} $$

# 成本函数

MPC 的优化目标是最小化成本函数：

$$ J = \sum_{k=0}^{N-1} \left( x(t+k|t)^T Q x(t+k|t) + u(t+k|t)^T R u(t+k|t) \right) + x(t+N|t)^T P x(t+N|t) $$

其中：
- $Q$ 是状态权重矩阵
- $R$ 是输入权重矩阵
- $P$ 是终端状态权重矩阵

将成本函数写成矩阵形式：

$$ J = X^T \mathcal{Q} X + U^T \mathcal{R} U $$

其中：
$$ \mathcal{Q} = \text{diag}(Q, Q, \dots, Q, P), \quad \mathcal{R} = \text{diag}(R, R, \dots, R) $$

# 优化问题

MPC 的优化问题是在约束条件下，最小化成本函数：

$$ \min_{U} J = X^T \mathcal{Q} X + U^T \mathcal{R} U $$
$$ \text{subject to:} $$
$$ X = \Phi x(t) + \Gamma U $$
$$ x_{\text{min}} \leq x(t+k|t) \leq x_{\text{max}} $$
$$ u_{\text{min}} \leq u(t+k|t) \leq u_{\text{max}} $$

## 无约束优化问题

在无约束情况下，优化问题的解析解为：

$$ U^* = -(\Gamma^T \mathcal{Q} \Gamma + \mathcal{R})^{-1} \Gamma^T \mathcal{Q} \Phi x(t) $$

## 有约束优化问题

在有约束情况下，优化问题通常没有解析解，需要通过数值优化算法求解，如二次规划 (QP)、非线性规划 (NLP) 等。

# 滚动优化

MPC 的优化问题是在每个采样时刻求解的，得到最优的控制输入序列后，只将第一个控制输入应用于系统，然后在下一个采样时刻，根据新的系统状态，重新求解优化问题。