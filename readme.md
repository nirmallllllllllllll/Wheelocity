# ⚡ Wheelocity

> **Spacecraft Reaction Wheel Sizing & Rotor Synthesis Studio**

Wheelocity is a high-performance aerospace engineering web tool designed for sizing attitude determination and control system (ADCS) reaction wheels, evaluating rest-to-rest slew maneuver kinematics, computing multi-orbit environmental disturbances, and synthesizing 18-bolt high-inertia metallic flywheel rotors.

---

## 🚀 Key Features

* **Spacecraft & Bus Presets**: Quick-load predefined parameters for **1U, 3U, 6U, 12U CubeSats, 50kg MicroSats, and 150kg SmallSats**.
* **Parametric Moment of Inertia (MOI)**: Box geometry auto-estimators and principal axis selectors ($I_{xx}, I_{yy}, I_{zz}$).
* **Slew Maneuver Profiler**: Rest-to-rest trajectory calculator supporting Bang-Bang and Trapezoidal profiles.
* **Environmental Disturbance Modeling**: Computes Gravity Gradient, Solar Radiation Pressure, Atmospheric Drag, and Residual Magnetic Dipole torque accumulators.
* **COTS Hardware Trade Space**: Live comparison against commercial reaction wheel portfolios from CubeSpace, Rocket Lab/Sinclair, Blue Canyon Technologies, and NewSpace Systems.
* **Flywheel Rotor CAD Synthesis**: Calculations for rim thickness, mass, and centrifugal hoop stress safety factors.

---

## 🛠️ Tech Stack

* **React 18** (via UMD / Babel standalone for zero-build deployment)
* **Tailwind CSS** (for styling with a custom Obsidian Black, Gunmetal Grey, and Metallic Gold theme)
* **SVG / Canvas Graphics** (for interactive telemetry plotting and rotor cross-sections)

---

## 📦 Getting Started & GitHub Hosting

1. Clone or download this repository.
2. Ensure `image_fb4440.png` (or your 3D wheel background image) is placed in the root directory.
3. Open `index.html` in any modern web browser or deploy directly to **GitHub Pages**.

---

### 🌍 Credits
* **Made for fun, by Nirmal**
* Crafted in Chennai for the Universe 🚀✨