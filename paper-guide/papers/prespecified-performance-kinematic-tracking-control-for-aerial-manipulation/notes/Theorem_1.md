设一个待定的 Lyapunov 函数 $V_E(s) = \frac{1}{2}s^T s$，那么其导函数为：

$$
\begin{aligned}
\dot{V}_E &= s^T (\dot{p_E} - \dot{p_O} - \dot{\alpha} + \Lambda z) \\

&= s^T (\dot{p}_{E,d} + \Delta - \dot{p}_O - \dot{\alpha} + \Lambda z)
\end{aligned}
$$

结合 $\dot{p}_E = \dot{p_O} + \dot{\alpha} - \Lambda z - Ks$ 可以得到：$\dot{V}_E = -s^T Ks + s^T \Delta$，

结合非线性系统中提到的比较定理：

$$
\dot{W} \leq -kW \Rightarrow W \leq W(0)e^{-kt}
$$

我们可以定义 $W = \sqrt{V_E} = \frac{\lVert s \rVert}{\sqrt{2}}$，如此可以得到：

$$
\begin{aligned}
\dot{W} &= \frac{-s^T Ks + s^T \Delta}{\sqrt{2} \lVert s \rVert} \\

&\leq \frac{-\lambda_{min}(K) {\lVert s \rVert}^2 + \delta_E \lVert s \rVert}{\sqrt{2} \lVert s \rVert} \\

&= -\lambda_{min}(K) W + \frac{\delta_E}{\sqrt{2}}
\end{aligned}
$$

其中，$\lambda_{min}(K)$ 为矩阵 $K$ 的最小特征值。由于 $K_\nu$ 为正对角矩阵，所以 $\lambda_{min}(K) > 0$，就能得到：

$$
W(t) \leq W(0)e^{-\lambda_{min}(K) t} + \frac{\delta_E}{\sqrt{2} \lambda_{min}(K)}
$$

由于 $W(0) = 0$，即可得到：

$$
W(t) \leq \frac{\delta_E}{\sqrt{2} \lambda_{min}(K)}
$$

根据 $W$ 的定义，我们就有了 $\lVert s \rVert \leq \frac{\delta_E}{\lambda_{min}(K)}$

令 $z_{\int} = \int_{0}^{t} z d\tau$，根据 $s = z + \Lambda \int_{0}^{t} z d\tau$，我们有：

$$
\dot{z_{\int}} = -\Lambda z_{\int} + s
$$

解这个微分方程，代入 $z_{\int}(0) = 0$，可得：

$$
\begin{aligned}
z_{\int} &= z_{\int}(0)e^{-\Lambda t} + \int_{0}^{t} e^{-\Lambda (t - \tau)} s(\tau) d\tau \\

&= \int_{0}^{t} e^{-\Lambda (t - \tau)} s(\tau) d\tau
\end{aligned}
$$

因此，我们有：

$$
\begin{aligned}
\lVert z_{\int} \rVert &\leq \frac{\delta_E}{\lambda_{min}(K)} \int_{0}^{t} e^{-\lambda_{min}(\Lambda) (t - \tau)} d\tau \\

&= \frac{\delta_E (1 - e^{-\lambda_{min}(\Lambda) t})}{\lambda_{min}(K) \lambda_{min}(\Lambda)} \\

&\leq \frac{\delta_E}{\lambda_{min}(K)\lambda_{min}(\Lambda)}
\end{aligned}
$$

根据 $s$ 的定义，可以得到：

$$
\begin{aligned}
\lVert z \rVert - \lVert \Lambda z_{\int} \rVert &\leq \lvert \lVert z \rVert - \lVert \Lambda z_{\int} \rVert \rvert \leq \lVert z + \Lambda z_{\int} \rVert \\
&= \lVert s \rVert \leq \frac{\delta_E}{\lambda_{min}(K)}
\end{aligned}
$$

令 $\delta_z$ 表示 $\lVert z \rVert$ 的上界，根据上两式可得：

$$
\begin{aligned}
\lVert z \rVert &\leq \lVert \Lambda z_{\int} \rVert + \frac{\delta_E}{\lambda_{min}(K)} \\

&\leq \frac{(\lambda_{min}(\Lambda) + \lambda_{max}(\Lambda)) \delta_E}{\lambda_{min}(K) \lambda_{min}(\Lambda)} = \delta_z
\end{aligned}
$$

如此，我们就得到 $z$ 是有界的。我们选取 $c_\nu$，满足：

$$
c_\nu > \frac{b_\nu}{\rho_{\nu,0} - \delta_z - \lvert e_{E,\nu}(0) \rvert}, \quad \nu \in \{x, y, z\}
$$

根据引理 1，我们就有了：

$$
\alpha_\nu(t) \leq \rho_\nu(t) - \delta_z, \quad t \geq 0 \text{ and } \nu \in \{x, y, z\}
$$

根据 $z = e_E - \alpha(t)$，可以得到：

$$
\lvert e_{E,\nu} \rvert = \lvert e_{E,\nu} - \alpha_\nu + \alpha_\nu \rvert \leq \lVert z \rVert + \lvert \alpha_\nu \rvert
$$

即：

$$
\lvert e_{E,\nu} \rvert < \delta_z + \alpha_\nu
$$

结合引理 1 推导后得到的式子，以及上式，可以得到 $\lvert e_{E,\nu} \rvert < \rho_\nu(t), \quad \forall t \geq 0 $，证毕。