# 二次规划问题标准形式

OSQP（Operator Splitting Quadratic Program）求解器用于求解如下标准形式的二次规划问题：

$$ \min_{x} \frac{1}{2} x^T P x + q^T x $$

$$ \text{subject to:} \quad l \leq A x \leq u $$

其中：
- $P$ 是半正定矩阵（目标函数的二次项系数）
- $q$ 是矢量（目标函数的一次项系数）
- $A$ 是约束矩阵
- $l, u$ 分别是约束的下界和上界

# 参考量分配的QP形式

将空中机械臂的参考量分配问题转化为标准QP形式：

## 目标函数

$$ F(\dot{s}) = \dot{s}^T(J^T J + W)\dot{s} - 2(\dot{p}_E + [R_B p_E^B]\times \omega)^T J \dot{s} $$

对应标准形式中的参数：

$$ P = 2(J^T J + W) $$

$$ q = -2 J^T (\dot{p}_E + [R_B p_E^B]\times \omega) $$

## 约束条件

将三类约束统一表示为：

$$ \dot{s}_{lower} \leq \dot{s} \leq \dot{s}_{upper} $$

对应标准形式中的参数：

$$ A = I_6 $$

$$ l = \max(\dot{s}_{\underline{p}}, \dot{s}_{min}, \dot{s}_{\underline{v}}) $$

$$ u = \min(\dot{s}_{\overline{p}}, \dot{s}_{max}, \dot{s}_{\overline{v}}) $$

# 算子分裂法

OSQP采用交替方向乘子法（ADMM）进行求解，其核心迭代步骤为：

$$ \tilde{x}^{k+1} = (P + \sigma I)^{-1}(\sigma x^k - q - A^T v^k) $$

$$ z^{k+1} = \Pi_{[l,u]}(A\tilde{x}^{k+1} + v^k / \rho) $$

$$ v^{k+1} = v^k + \rho(A\tilde{x}^{k+1} - z^{k+1}) $$

$$ x^{k+1} = \sigma x^k + \tilde{x}^{k+1} $$

其中：
- $\sigma > 0$ 是正则化参数
- $\rho > 0$ 是惩罚参数
- $\Pi_{[l,u]}(\cdot)$ 表示到区间 $[l,u]$ 的投影算子

# 热启动策略

利用上一控制周期的求解结果作为当前周期的迭代初值：

$$ x^0 = x^*_{prev} $$

$$ z^0 = z^*_{prev} $$

$$ v^0 = v^*_{prev} $$

显著减少迭代次数，满足机载实时性要求。
