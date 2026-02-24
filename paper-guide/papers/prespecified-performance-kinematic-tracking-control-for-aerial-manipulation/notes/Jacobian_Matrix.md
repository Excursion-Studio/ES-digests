# 雅可比矩阵的定义

雅可比矩阵是机器人学中描述末端执行器速度与关节速度之间线性映射关系的数学工具。对于一个具有 $n$ 个关节的机械臂，雅可比矩阵 $J(q)$ 是一个 $6 \times n$ 的矩阵（其中 $6$ 对应于末端执行器的 3 个线速度分量和 3 个角速度分量）：

$$ J(q) = \begin{bmatrix} \frac{\partial v}{\partial \dot{q}_1} & \frac{\partial v}{\partial \dot{q}_2} & \dots & \frac{\partial v}{\partial \dot{q}_n} \\ \frac{\partial \omega}{\partial \dot{q}_1} & \frac{\partial \omega}{\partial \dot{q}_2} & \dots & \frac{\partial \omega}{\partial \dot{q}_n} \end{bmatrix} $$

其中：
- $v$ 是末端执行器的线速度矢量
- $\omega$ 是末端执行器的角速度矢量
- $\dot{q}$ 是关节速度矢量
- $q$ 是关节位置矢量

# 雅可比矩阵的推导

雅可比矩阵可以通过对正运动学公式求导来推导。对正运动学公式 $x = f(q)$ 求导，得到：

$$ \dot{x} = \frac{\partial f(q)}{\partial q} \dot{q} = J(q) \dot{q} $$

其中 $\dot{x}$ 是末端执行器的速度矢量，$\dot{q}$ 是关节速度矢量，$J(q) = \frac{\partial f(q)}{\partial q}$ 是雅可比矩阵。

对于串联机械臂，雅可比矩阵的第 $j$ 列可以表示为：

$$ J_j = \begin{bmatrix} z_{j-1} \times (p_n - p_{j-1}) \\ z_{j-1} \end{bmatrix} $$

其中：
- $z_{j-1}$ 是第 $j-1$ 个关节的轴线方向单位矢量
- $p_n$ 是末端执行器的位置
- $p_{j-1}$ 是第 $j-1$ 个关节的位置

# 雅可比矩阵的物理意义

雅可比矩阵的物理意义是：将关节空间的速度转换为笛卡尔空间的速度，或者将笛卡尔空间的力转换为关节空间的力矩。

1. **速度映射**：末端执行器的速度等于雅可比矩阵乘以关节速度
   $$ v_{ee} = J(q) \dot{q} $$

2. **力映射**：关节力矩等于雅可比矩阵的转置乘以末端执行器受到的力
   $$ \tau = J(q)^T F $$

# 雅可比矩阵的伪逆

## 伪逆的定义

雅可比矩阵的伪逆可以通过奇异值分解来计算：

$$ J(q)^+ = V \Sigma^+ U^T $$

其中 $U$ 和 $V$ 是正交矩阵，$\Sigma$ 是奇异值矩阵，$\Sigma^+$ 是 $\Sigma$ 的伪逆。

## 伪逆的性质

雅可比矩阵的伪逆具有以下性质：

$$ J(q) J(q)^+ J(q) = J(q) $$
$$ J(q)^+ J(q) J(q)^+ = J(q)^+ $$

后面提到的闭环逆运动学 (CLIK)，就是通过雅可比矩阵的伪逆将末端执行器的速度转换为关节速度。