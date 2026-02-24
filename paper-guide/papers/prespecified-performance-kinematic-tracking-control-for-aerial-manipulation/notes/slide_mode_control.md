# 滑模控制基本思想

滑模控制（Sliding Mode Control, SMC）是一种非线性控制方法，通过设计滑模面使系统状态在有限时间内到达并保持在滑模面上，从而实现对系统不确定性和扰动的鲁棒控制。

# 滑模面设计

定义滑模变量：

$$ s = z + \Lambda \int_{0}^{t} z d\tau $$

其中：
- $z = e_E - \alpha(t)$ 是跟踪误差与预设轨迹的偏差
- $\Lambda$ 为正定对角增益矩阵

对滑模变量求导：

$$ \dot{s} = \dot{z} + \Lambda z = \dot{p_E} - \dot{p_O} - \dot{\alpha} + \Lambda z $$

# 控制律设计

考虑系统不确定性，末端实际速度与期望速度满足：

$$ \dot{p}_E = \dot{p}_{E,d} + \Delta $$

其中 $\Delta$ 为未知有界项，满足 $\lVert \Delta \rVert \leq \delta_E$。

代入滑模变量导数：

$$ \dot{s} = \dot{p}_{E,d} + \Delta - \dot{p}_O - \dot{\alpha} + \Lambda z $$

设计控制律使 $\dot{s} = -Ks$，得到末端期望速度：

$$ \dot{p}_E = \dot{p_O} + \dot{\alpha} - \Lambda z - Ks $$

其中 $K$ 为正定对角控制增益矩阵。

# 稳定性分析

定义李雅普诺夫函数：

$$ V_E(s) = \frac{1}{2}s^T s $$

求导并代入控制律：

$$ \dot{V}_E = s^T \dot{s} = -s^T Ks + s^T \Delta $$

利用不等式放缩：

$$ \dot{V}_E \leq -\lambda_{min}(K) \lVert s \rVert^2 + \delta_E \lVert s \rVert $$

定义 $W = \sqrt{V_E} = \frac{\lVert s \rVert}{\sqrt{2}}$，可得：

$$ \dot{W} \leq -\lambda_{min}(K) W + \frac{\delta_E}{\sqrt{2}} $$

根据比较定理：

$$ W(t) \leq W(0)e^{-\lambda_{min}(K) t} + \frac{\delta_E}{\sqrt{2}\lambda_{min}(K)} $$

由于 $W(0) = 0$，得到：

$$ \lVert s \rVert \leq \frac{\delta_E}{\lambda_{min}(K)} $$

滑模变量 $s$ 有界，系统全局一致有界稳定。

# 积分项的作用

定义积分状态 $z_{\int} = \int_{0}^{t} z d\tau$，其动态方程为：

$$ \dot{z}_{\int} = -\Lambda z_{\int} + s $$

解得：

$$ z_{\int} = \int_{0}^{t} e^{-\Lambda (t - \tau)} s(\tau) d\tau $$

其界为：

$$ \lVert z_{\int} \rVert \leq \frac{\delta_E}{\lambda_{min}(K)\lambda_{min}(\Lambda)} $$

积分项的引入消除了系统的稳态误差，提高了控制精度。
