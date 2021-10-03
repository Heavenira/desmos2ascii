
# desmos2ascii
Convert Desmos LaTeX into ASCIImath via a JavaScript function. To my belief, there exists no other online solution to accomplish this task. Only vice-versa. I plan to fork this to [DesModder](https://github.com/DesModder/DesModder) in the near future, which should make this more usable. But in the meantime, here is the function in its raw state.

## Usage
Open up `desmos2ascii.js`. Inside contains a single function, `desmos2ascii(x)`. `desmos2ascii(x)` accepts any `x` string formatted as LaTeX and outputs an ASCIImath string. This is useful if you want to paste the input to any website, or utilize a parser.

## Features
There is only one flag that exists, namely `optimizeForParsing`. When `true`, this will:
- Implement `*` operators, preventing implicit multiplication.
- Force brackets after every function. ie `\sin x` → `sin(x)` .
- Reformat logarithms. `\log_{b}a` → `(log(b))/(log(a))`.
- Reformat`trig^{-1}` with `arctrig`.
- Reformat `nthroot` to exponential form.
- Much more.


Finally, desmos2ascii will perform the following alterations regardless:
- Replace piecewise notation `{}` with `IF()`. This is a compatibility feature for [wolfram2desmos](https://github.com/Heavenira/wolfram2desmos).
- Remove excess brackets. `2^{(x)}` will become `2^x`.
- Express `|x|` as `abs(x)`. No exceptions.

## Example Usage
```js
// best strategy is using String.raw`` for containing LaTeX equations
let latexString = String.raw`O_{bs0}\left(x,y,z\right)=\sum_{i=0}^{s_{teps}}\left\{M_{esh0}\left(\Delta_{Ray}\left(x,x_{CameraFinal},i\right),\Delta_{Ray}\left(y,y_{CameraFinal},i\right),\Delta_{Ray}\left(z,z_{CameraFinal},i\right)\right)=0:0\right\}`

// runs the function
let asciiString = desmos2ascii(latexString)

console.log(asciiString)
>>> "O_bs0(x,y,z)=sum_(i=0)^(s_teps) IF【M_esh0(Δ_Ray(x,x_CameraFinal,i),Δ_Ray(y,y_CameraFinal,i),Δ_Ray(z,z_CameraFinal,i))=0:0】"
```
