定义 $\gamma_\nu(t) = \rho_\nu(t) - \epsilon_\nu - \lvert \alpha_\nu(t) \rvert$，我们可以得到：

$$ 
\begin{aligned}
\gamma_\nu(t) &= (\rho_{\nu,0} - \rho_{\nu,\infty})e^{-l_E t} + \rho_{\nu,\infty} - \epsilon_\nu - \lvert e_{E,\nu}(0)e^{-l_E t} + \frac{b_\nu}{c_\nu}[1 - e^{-c_\nu t}]e^{-l_E t} \rvert \\

&\geq [\rho_{\nu,0} - \epsilon_\nu - \lvert e_{E,\nu}(0) \rvert - \frac{\lvert b_\nu \rvert}{c_\nu}(1 - e^{-c_\nu t})]e^{-l_E t} + \rho_{\nu,\infty}(1 - e^{-l_E t}) - \epsilon_\nu + \epsilon_\nu e^{-l_E t} \\

&= [\rho_{\nu,0} - \epsilon_\nu - \lvert e_{E,\nu}(0) \rvert - \frac{\lvert b_\nu \rvert}{c_\nu}(1 - e^{-c_\nu t})]e^{-l_E t} + (\rho_{\nu,\infty} - \epsilon_\nu)(1 - e^{-l_E t})
\end{aligned}
$$

由此，我们可以总结出，当 $ \rho_{\nu,0} - \lvert e_{E,\nu}(0) \rvert - \frac{\lvert b_\nu \rvert}{c_\nu} > 0$ 且 $ \rho_{\nu,\infty} > \epsilon_\nu$ 时，$\gamma_\nu > 0$。

根据 $\epsilon_\nu$ 的定义：

$$
\epsilon_\nu < \min\{\rho_{\nu,\infty}, \rho_{\nu,0} - \lvert e_{E,\nu}(0) \rvert\}
$$

可知 $\rho_{\nu,\infty} > \epsilon_\nu$ 是自然满足的。因此，如果令 $c_\nu > \frac{\lvert b_\nu \rvert}{\rho_{\nu,0} - \epsilon_\nu - \lvert e_{E,\nu}(0) \rvert}$，则 $\gamma_\nu > 0$。

这样，根据 $\gamma_\nu(t)$ 的定义，我们可以得到 $\lvert \alpha_\nu(t) \rvert < \rho_\nu(t) - \epsilon_\nu, \quad \forall t \geq 0$。

引理 1 证毕。