# 非线性系统描述

空中机械臂系统具有高度非线性特性，其运动学方程可表示为：

$$ \dot{p}_E = f(p_E, u) + \Delta $$

其中：
- $p_E$ 是末端执行器位置
- $u$ 是控制输入
- $\Delta$ 表示未建模动态、外部扰动等不确定性

# 比较定理

对于非线性系统的稳定性分析，常用比较定理进行放缩。

## 基本形式

设 $W(t)$ 满足微分不等式：

$$ \dot{W} \leq -kW + d $$

其中 $k > 0$，$d \geq 0$ 为常数。

则 $W(t)$ 的上界为：

$$ W(t) \leq W(0)e^{-kt} + \frac{d}{k}(1 - e^{-kt}) $$

当 $t \to \infty$ 时：

$$ W(\infty) \leq \frac{d}{k} $$

## 应用

在滑模控制稳定性分析中，定义 $W = \sqrt{V_E}$，利用比较定理可得：

$$ \lVert s \rVert \leq \frac{\delta_E}{\lambda_{min}(K)} $$

# 李雅普诺夫稳定性

## 基本定义

对于系统 $\dot{x} = f(x)$，若存在连续可微函数 $V(x)$ 满足：

1. $V(0) = 0$ 且 $V(x) > 0$ 对 $x \neq 0$
2. $\dot{V}(x) \leq 0$

则系统在原点稳定。

若进一步满足 $\dot{V}(x) < 0$ 对 $x \neq 0$，则系统渐近稳定。

## 有界性

对于存在扰动的系统，通常只能证明一致最终有界（UUB）：

$$ \lVert x(t) \rVert \leq \beta(\lVert x(0) \rVert, t) + \gamma(\delta) $$

其中 $\beta$ 是KL类函数，$\gamma$ 是K类函数，$\delta$ 是扰动上界。

# 空中机械臂的非线性特性

## 运动学非线性

末端位置与关节角的映射关系：

$$ p_E = p_B + R_B p_E^B $$

其中旋转矩阵 $R_B$ 是欧拉角的非线性函数。

## 耦合非线性

四旋翼基座与机械臂之间存在动力学耦合：

$$ M(q)\ddot{q} + C(q, \dot{q})\dot{q} + G(q) = \tau + \tau_{ext} $$

其中：
- $M(q)$ 是质量矩阵
- $C(q, \dot{q})$ 是科氏力和离心力项
- $G(q)$ 是重力项
- $\tau_{ext}$ 是外部扰动

## 不确定性

实际系统中存在多种不确定性：

$$ \Delta = \Delta_{model} + \Delta_{disturbance} + \Delta_{param} $$

其中：
- $\Delta_{model}$：未建模动态
- $\Delta_{disturbance}$：外部扰动（如风扰）
- $\Delta_{param}$：参数不确定性

假设不确定性有界：

$$ \lVert \Delta \rVert \leq \delta_E $$
