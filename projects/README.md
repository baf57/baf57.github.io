# 1D Self Consistent Quantum Poisson Problem

## Overview

Brayden Freitas
CEA
University of Pittsburgh

### Elevator Pitch

A python pack to solve the self-consistent quantum-poisson problem for 
applications in quantum-mechanically dictated systems within condensed matter
semiconductor setups.

### Summary

This solver provides an open source and lightweight algorithm to solve the 
aforementioned problem. First, on a region of interest (referd to as the set 
$`Q`$) the Poisson-derived local charge density as a function of potential 
equation (refered to as "LLP($`\mu`$,z)") is found via the Poisson solver. Next 
the quantum-mechanically-derived local charge density as a function of potential
equation (refered to as "ILDOS($`\mu`$,z)") is found via the quantum mechanics 
solver. Lastly, since LLP($`\mu`$,z) is a decreasing or constant function, and 
ILDOS($`\mu`$,z) is a strictly increasing function, the intersection point
between the two functions can always be found, and thus the solution to the 
problem will always converge.

## Poisson Solver
### Solving for the Charge Density and Potential

By Gauss's Law (applied in one dimension via the 1D Stoke's Theorem)
```math
E(z_{i+1})-E(z_i)=\frac{q_i}{\epsilon_r\epsilon_0}, \qquad(1)
```
where $`E(z_i)`$ is the electric field at position $`z_i`$, $`q_i`$ is the 
charge over the interval $`[i,i+1)`$, $`\epsilon_r`$ is the relative 
permitivitty of the material, and $`\epsilon_0`$ is the vacuum permitivitty.
From Poisson's Equation, it is known that $`E(z)=-\frac{\partial V}{\partial z},`$
which can be discretized in one dimension as
$`\frac{\partial V}{\partial z}\approx\frac{2(V_{i-1}-V_i)}{z_{i+1}-z_{i-1}}.`$
Thus,
```math
E(z_i)\approx\frac{2(V_{i-1}-V_i)}{z_{i+1}-z_{i-1}}, \qquad (2)
```
where $`V_i`$ is the potential at the position $`\frac{1}{2}(z_i+z_{i+1})`$.

Subsituting $`(2)`$ into $`(1)`$ yields
```math
V_{i-1} (\frac{-2}{z_{i+1}-z_{i-1}}) + 
V_i(\frac{2(z_{i+2}+z_{i+1}-z_i-z_{i-1})}{(z_{i+1}-z_{i-1})(z_{i+2}-z_i)}) + 
V_{i+1} (\frac{-2}{z_{i+2}-z_i}) = \frac{q_i}{\epsilon_r\epsilon_0}, \qquad (3)
```
for any $`i\in\N[1,N-1]`$ in a system with $`N`$ sites. Since the charge on each
site is based on the potential on the site as well as the two sites around it, 
this system can be written as a linear system of the form
```math
M\vec{V}=\vec{q}\qquad (4)\\
s.t\ M_{i,i-1}=\frac{-2}{z_{i+1}-z_{i-1}},\ 
M_{i,i}=\frac{2(z_{i+2}+z_{i+1}-z_i-z_{i-1})}{(z_{i+1}-z_{i-1})(z_{i+2}-z_i)},\ 
M_{i,i+1}=\frac{-2}{z_{i+2}-z_i}\ \forall i\in\N[1,N-1],
```
where $`M`$ is a matrix of the form above, $`\vec{V}`$ is a vector containing 
each potential in the system, and $`\vec{q}`$ is a vector containing each charge
in the system (the $`\frac{1}{\epsilon_r\epsilon_0}`$ factor is absorbed into 
$`\vec{q}`$).

Since the inputs to the solver can be a mixture of potentials and charge 
densities, it is efficient to restructure the problem so that it can be solved 
as a linear equation. To accomplish this, $`(4)`$ can be rewritten as
```math
\begin{bmatrix}M_{NN} & M_{ND} \\ M_{DN} & M_{DD}\end{bmatrix}
\begin{bmatrix}V_N\\V_D \end{bmatrix} = \begin{bmatrix}q_N\\q_D \end{bmatrix}\\
\Rightarrow \begin{bmatrix}M_{NN}&\mathbb{0}\\M_{DN}&-\mathbb{1}\end{bmatrix}
\begin{bmatrix}V_N\\q_D\end{bmatrix}=
\begin{bmatrix}\mathbb{1}&-M_{ND}\\\mathbb{0}&-M_{DD}\end{bmatrix}
\begin{bmatrix}q_N\\V_D\end{bmatrix}. \qquad (5)
```
The subscripts $`_D`$ and $`_N`$ indicated that the values are either dirichilet
conditions or nuemann conditions, repsectively. For example, a value which is 
subscripted as dirichilet is 0 unless the site that it is associated with was 
defined by the user as a dirichlet site, or in other words the user defined the 
potential for that site, rather than the charge density. Likewise, a value 
subscritpted with nuemann is 0 unless the site it is associated with was defined
by the user as a nuemann site (charge density defined). From $`(5)`$, the RHS of
the equation is always a known vector, and thus this is a linear system which
is solved using NumPy's sparse linear algebra package, producing the output for
the solver.

### Generating the Local Poisson (LPP) Equation

The local Poisson equation derives from the discretized Poisson equation, and
takes the form
```math
n_i= \epsilon_i \delta U + n_i^s,\qquad (6)
```
where $`\epsilon_i`$ is a local capacitance term, and $`n_i^s`$ is a source 
term. From $`q_D`$ found in $`(5)`$, the source term can be calculated as
```math
n_i^s = \frac{q_D}{z_{i+1}-z_i}.\qquad (7)
```
The local capacitance term is
```math
\epsilon_i = \begin{cases} C_i, & C_i \neq 0 \\ C_{ii}, & \text{else}\end{cases}
\qquad (8)
```
where $`C_i`$ is the edge local capacitance term, and $`C_{ii}`$ is the bulk
local capacitance term. The edge term is found via setting all sites in $`Q`$ as
dirichlet sites with $`V=1`$, all sites which are originally dirichlet sites to
their initial values, and all other sites to have $`V=0`$. This only produces
non-zero values on sites of interest which are on the borders of $`Q`$, and so
the bulk local capacitance term must be used on those sites instead. The bulk
term is found via the same method as above, however instead of setting all sites
in $`Q`$ to have $`V=1`$ at the same time, each site is instead individually set
to $`V=1`$ while every other site in $`Q`$ besides that one is set to $`V=0`$.

Lastly, equations $`(7)`$ and $`(8)`$ are substituted into $`(6)`$, and the LPP
is fully defined.

## Quantum Mechanics Solver
### The Quantum System

After the classical system is constrcuted, a quantum region of that system can
be defined. Typically, the quantum system 
will have a much smaller discretization, on the order of at least 100 times 
smaller than that of the classical system. Either the potential or the charge 
density must be defined over the entire quantum system at construction. Unlike 
the classical system, the entirety of the quantum system must have the same 
discretization throughout since it is solved using the tight bining model.

### Solving for the Energy and Wavefunctions

Using the tight binding model, the time independent Schrodinger wave equation is 
discretized and rewritten in 1D as follows:
```math
(\frac{-\hbar^2}{2m}\nabla^2 + V)\Psi=E\Psi\\
\rightarrow\frac{-\hbar^2}{2ma^2}(\Psi_{i-1}+(\frac{V}{t}-2)\Psi_i+\Psi_{i+1})=
(E_i+\frac{\hbar^2}{2m}(k_x^2+k_y^2))\Psi_i.
\qquad (7)
```
Substituting $`t=\frac{\hbar^2}{2ma^2}`$ and $`\bar{E}=E+\frac{\hbar^2}{2m}
(k_x^2+k_y^2)`$ into $`(7)`$ allows us to rewrite it as follows:
```math
H\Psi=\bar{E}\Psi\qquad (8)\\s.t.\ 
H_{i,i-1}=-t,\ H_{i,i}=V+2t,\ H_{i,i+1}=-t.
```
This is just a problem of diagonalizing the Hamiltonian, which is again done
using NumPy's sparse linear algebra package, producing the solved energy and
wavefunction.

### Generating the Integrated Local Density of States (ILDOS) Equation

The density of electrons within the quantum region is calculated by filling all
of the possible states that an electron could occupy up to some energy level, 
and multiplying this by the liklihood that an electron would be at a certain
position. Mathematically, this is described as
```math
n(\mu,z)=|\Psi_z(z)|^2\int\rho(\mu)f(\mu)\ d\mu
```
where f is the fermi function (unit step function with $`E_f=0`$ since it is 
constrained that $`T=0`$) and $`\rho(\bar{E})`$ is the density of states function. 
We then have our ILDOS as 
```math
n_i = |\Psi_z(z_i)|^2\int\Theta(\rho(\mu))\ d\mu\qquad(9)
```
where $`\Theta(x)`$ is the Heaviside function. To derive $`\rho(\bar{E})`$, the 
problem must be considered a 3-Dimensional problem with one confined dimension 
and two unconfined dimensions. To approximate this in the seperable dimension 
case (i.e. no magnetic field), the dimension which the system was being varied 
along up until this point is definedas the $`z`$-dimension, making the thickness
of that dimension $`L_z=`$ the thickness of the quantum region. The$`x`$- and 
$`y`$- dimensions are assumed to have thicknesses $`L_x,L_y>>L_z`$, as well as 
periodic boundary conditions, and thus the wavefunctions along those axes can be 
expressed as
```math
\Psi_x(x)=e^{ik_xx},\ \Psi_y(y)=e^{ik_yy}
```
where
```math
k_x=n_x\frac{2\pi}{L_x},\ k_y=n_y\frac{2\pi}{L_y}\ |\ n_x,n_y\in\Z.
```
Each allowed value of the k-space occupies an area of 
$`A=\left(\frac{2\pi}{L_x}\right)\times\left(\frac{2\pi}{L_y}\right)`$, and so 
the number of states in any given ring in the $`x-y`$ plane with thickness $`dk`$
is
```math
n_s(\vec{k})\ d\vec{k}=\frac{A}{2\pi}\vec{k}\ d\vec{k}.\qquad(10)
```
From the definition of $`\bar{E}`$ we have that 
```math
\mu - \bar{E}=\frac{\hbar^2|\vec{k}|^2}{2m},\ \mu\geq \bar{E},
```
where $`\mu`$ is the energy which all the states will be below. From this and 
$`(10)`$, after substituting real units out and $`t`$ units in, we have
```math
\rho(\mu)=\frac{1}{2ta^2\pi}\sum_n(\mu - \bar{E}_n)\qquad(11)
```
where $`a`$ is the spacing between any two sites in the $`z`$-direction.
Substituting this density of states equation $`(11)`$ with equation $`(9)`$ 
provides the ILDOS equation for 2 dimensions,
```math
n(\mu,z) = \frac{|\Psi_z(z)|^2}{2ta^2\pi}\int_{\mu}\sum_n\Theta(\mu - \bar{E}_n)\ d\mu.
```
When divided by $`a`$ this equation becomes the ILDOS equation in 3 dimensions 
which is desired, and can be discretized as
```math
n_i(\mu_j) = \frac{|\Psi_z(z_i)|^2}{2ta^3\pi}\sum_j\sum_n(\mu_j-\bar{E}_n),
\ \forall\ \mu_j\geq\bar{E}_n.\qquad(12)
```

## Self-Consistent Solver
### Intersection Point

The global classical mechanics from the Poisson solver show that there are 
energy levels in this system on the scale of whole $`\text{eV}`$, while the local
quantum mechanics from the ILDOS derivation show that there are energy levels in
this system on the scale of $`\text{meV}`$. In a system like a 2-dimensional 
electron gas (2DEG) the $`\text{meV}`$ energy scale is of more interest than the 
$`\text{eV}`$ energy scale, however the $`\text{eV}`$ scale has large effects on
the $`\text{meV}`$ scale, and so both types of mechanics must be solved in such 
a way that they change one another until convergence. To accomplish this, the 
LPP and ILDOS solutions are compared. Since the LPP is always a decreasing or 
constant function, and the ILDOS is always increasing, there will always be an 
intersection point which can be found between the two equations. That point 
gives the potential ($`U_i`$) and charge density ($`n_i`$) which satisfy both 
the classical and quantum mechanics.

### Convergence Steps

Once the intersection point is found, the global system must be adjusted to
fit with this new system. In doing this, the LPP and ILDOS may adjust, which 
would create new intersection points, and the adjustments would begin again. To
assure convergence, a three step method was derived.

#### Step $`I`$

The LPP is accurate within the electron gas since screening is occuring, however
any sites in the electron gas which are depleted are not screening, and thus 
would render the LPP inaccurate. To account for this, any sites which have a 
charge density of $`0`$ (the set of which is called $`Q'`$) are removed from 
$`Q`$, and the new set $`Q/Q'`$ is the set which LPP solutions is found on. 
After the removal, the LPP is regenerated with only the capacitance terms 
recalculated. This is repeated unil $`Q/Q'`$ converges.

#### Step $`II`$

To relax the Poisson problem in the remaining sites, the LPP is recalculated 
using $`U_i`$ as input. Since $`Q/Q'`$ is fixed from step $`I`$, only the source 
term is replaced during the LPP recalculation. The intersection is again found, 
and this is repeated until convergence.

#### Step $`III`$

To relax the Quantum problem, the ILDOS is recalculated on the sites $`Q/Q'`$. 
The intersection points are again found, and this is repeated until convergence.

### Step Order

The steps can be preformed in any order, however step $`III`$ is the most
computationally demanding of the steps, and so is preformed last. Since step 
$`I`$ makes the system smaller, thus reducing the computational demand of any 
step which comes after it, it is best to preform this step first. 
Consiquentially, it is logical that step $`II`$ should come second. These steps
are not preformed linearly however, and after each repetition of step $`III`$, 
step $`I`$ is repeated from $`Q`$ to convergence, followed by step $`II`$. While
generally not needed, this assures that the system does not minimize to an 
incorrect $`Q/Q'`$.