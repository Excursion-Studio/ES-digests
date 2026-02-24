# Delta机械臂结构

Delta机械臂是一种3自由度平动并联机构，由静平台（基座）、动平台（末端执行器）和三条相同的运动支链组成。每条支链包含：
- 主动臂（曲柄）：与电机相连，转角为 $\theta_i$
- 从动臂（摇杆）：通过球铰与主动臂和动平台连接
- 平行四边形结构：保证动平台始终与静平台平行

# 正运动学

正运动学是根据关节角 $q = [\theta_1, \theta_2, \theta_3]^T$ 求解末端位置 $p_E^D = [x, y, z]^T$。

## 几何约束方程

对于第 $i$ 条支链 $(i = 1, 2, 3)$，建立几何约束：

$$ \lVert p_E^D - b_i + a_i \rVert^2 = L^2 $$

其中：
- $b_i$：静平台上第 $i$ 个关节在机械臂坐标系下的位置
- $a_i$：主动臂矢量，$a_i = R_z(\phi_i) \cdot [r + l\cos\theta_i, 0, l\sin\theta_i]^T$
- $R_z(\phi_i)$：绕z轴旋转 $\phi_i$ 角的旋转矩阵
- $r$：静平台半径
- $l$：主动臂长度
- $L$：从动臂长度

## 旋转矩阵

$$ R_z(\phi_i) = \begin{bmatrix} \cos\phi_i & -\sin\phi_i & 0 \\ \sin\phi_i & \cos\phi_i & 0 \\ 0 & 0 & 1 \end{bmatrix} $$

其中 $\phi_1 = 0, \phi_2 = \frac{2\pi}{3}, \phi_3 = \frac{4\pi}{3}$。

## 数值求解

正运动学无解析解，需采用数值方法（如牛顿迭代法）求解非线性方程组：

$$ f_i(x, y, z) = (x - b_{ix} + a_{ix})^2 + (y - b_{iy} + a_{iy})^2 + (z - b_{iz} + a_{iz})^2 - L^2 = 0 $$

迭代公式：

$$ p_{k+1} = p_k - J_f^{-1}(p_k) f(p_k) $$

其中 $J_f$ 是雅可比矩阵。

# 逆运动学

逆运动学是根据末端位置 $p_E^D$ 求解关节角 $q$。

## 解析解

对于第 $i$ 条支链，令：

$$ E_i = 2l(z - b_{iz}) $$

$$ F_i = 2l[\cos\phi_i(x - b_{ix}) + \sin\phi_i(y - b_{iy}) + r] $$

$$ G_i = (x - b_{ix})^2 + (y - b_{iy})^2 + (z - b_{iz})^2 + r^2 + l^2 - L^2 + 2r[\cos\phi_i(x - b_{ix}) + \sin\phi_i(y - b_{iy})] $$

则关节角为：

$$ \theta_i = 2\arctan\left(\frac{-E_i \pm \sqrt{E_i^2 + F_i^2 - G_i^2}}{G_i - F_i}\right) $$

# 雅可比矩阵

对正运动学约束方程求导，得到速度映射关系：

$$ J_p \dot{p}_E^D = J_q \dot{q} $$

其中：

$$ J_p = \begin{bmatrix} (p_E^D - b_1 + a_1)^T \\ (p_E^D - b_2 + a_2)^T \\ (p_E^D - b_3 + a_3)^T \end{bmatrix} $$

$$ J_q = \text{diag}(l(p_E^D - b_1 + a_1)^T c_1, l(p_E^D - b_2 + a_2)^T c_2, l(p_E^D - b_3 + a_3)^T c_3) $$

$c_i$ 是主动臂旋转轴方向的单位矢量。

末端速度与关节速度的关系：

$$ \dot{p}_E^D = J_p^{-1} J_q \dot{q} = J_{Delta} \dot{q} $$

其中 $J_{Delta} = J_p^{-1} J_q$ 是Delta机械臂的雅可比矩阵。