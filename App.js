const { useState, useEffect, useMemo } = React;

const SPACECRAFT_PRESETS = {
    "1U": { id: "1U", name: "1U CubeSat", mass: 1.33, dims: { l: 0.1, w: 0.1, h: 0.1 }, ixx: 0.0022, iyy: 0.0022, izz: 0.0022, slewAngle: 45, slewTime: 30, altitude: 500, inclination: 97.4, residualDipole: 0.01, cpCgOffset: 0.005, wheelRpm: 6000, rotorDiameterMm: 28, material: "steel304" },
    "3U": { id: "3U", name: "3U CubeSat", mass: 4.0, dims: { l: 0.1, w: 0.1, h: 0.34 }, ixx: 0.0418, iyy: 0.0418, izz: 0.0067, slewAngle: 60, slewTime: 45, altitude: 550, inclination: 97.6, residualDipole: 0.03, cpCgOffset: 0.015, wheelRpm: 6000, rotorDiameterMm: 42, material: "steel304" },
    "6U": { id: "6U", name: "6U CubeSat", mass: 12.0, dims: { l: 0.1, w: 0.226, h: 0.34 }, ixx: 0.1667, iyy: 0.1256, izz: 0.0611, slewAngle: 60, slewTime: 40, altitude: 550, inclination: 97.6, residualDipole: 0.08, cpCgOffset: 0.02, wheelRpm: 6000, rotorDiameterMm: 58, material: "tungsten" },
    "12U": { id: "12U", name: "12U CubeSat", mass: 24.0, dims: { l: 0.226, w: 0.226, h: 0.34 }, ixx: 0.333, iyy: 0.333, izz: 0.204, slewAngle: 45, slewTime: 35, altitude: 600, inclination: 53.0, residualDipole: 0.15, cpCgOffset: 0.025, wheelRpm: 6500, rotorDiameterMm: 75, material: "tungsten" },
    "50kg": { id: "50kg", name: "50kg MicroSat", mass: 50.0, dims: { l: 0.5, w: 0.5, h: 0.6 }, ixx: 2.54, iyy: 2.54, izz: 2.08, slewAngle: 45, slewTime: 40, altitude: 600, inclination: 97.8, residualDipole: 0.4, cpCgOffset: 0.04, wheelRpm: 6000, rotorDiameterMm: 115, material: "steel304" },
    "150kg": { id: "150kg", name: "150kg SmallSat", mass: 150.0, dims: { l: 0.8, w: 0.8, h: 1.0 }, ixx: 20.5, iyy: 20.5, izz: 16.0, slewAngle: 30, slewTime: 45, altitude: 650, inclination: 98.0, residualDipole: 1.2, cpCgOffset: 0.06, wheelRpm: 6000, rotorDiameterMm: 185, material: "steel304" }
};

const ROTOR_MATERIALS = {
    steel304: { id: "steel304", name: "Stainless Steel 304 (Brushed Champagne)", density: 8000, yieldStrengthMPa: 215, color: "#D4AF37" },
    tungsten: { id: "tungsten", name: "Tungsten Heavy Alloy (18-Bolt High-Density Rim)", density: 17500, yieldStrengthMPa: 620, color: "#F3E5AB" }
};

const COTS_WHEELS = [
    { id: "cw0017", manufacturer: "CubeSpace", model: "CubeWheel CW0017", maxTorque_mNm: 0.23, maxMomentum_mNms: 1.77, mass_g: 60, size_mm: "28×28×26", peakPower_W: 1.5, maxRpm: 8000, class: "1U–2U CubeSat", passAll: true },
    { id: "cw0162", manufacturer: "CubeSpace", model: "CubeWheel CW0162", maxTorque_mNm: 2.5, maxMomentum_mNms: 16.2, mass_g: 150, size_mm: "46×46×31", peakPower_W: 4.5, maxRpm: 8000, class: "3U–6U CubeSat", passAll: true },
    { id: "bct050", manufacturer: "Blue Canyon (BCT)", model: "RWP050", maxTorque_mNm: 7.0, maxMomentum_mNms: 50.0, mass_g: 250, size_mm: "59×59×31", peakPower_W: 6.5, maxRpm: 6000, class: "6U–16U CubeSat", passAll: true },
    { id: "bct500", manufacturer: "Blue Canyon (BCT)", model: "RWP500", maxTorque_mNm: 50.0, maxMomentum_mNms: 500.0, mass_g: 1500, size_mm: "125×125×58", peakPower_W: 28.0, maxRpm: 6000, class: "MicroSat", passAll: true }
];

function App() {
    const [activePreset, setActivePreset] = useState("6U");
    const [scMass, setScMass] = useState(12);
    const [dimL, setDimL] = useState(0.1);
    const [dimW, setDimW] = useState(0.226);
    const [dimH, setDimH] = useState(0.34);
    const [ixx, setIxx] = useState(0.1667);
    const [iyy, setIyy] = useState(0.1256);
    const [izz, setIzz] = useState(0.0611);
    const [slewAngleDeg, setSlewAngleDeg] = useState(60);
    const [slewDurationSec, setSlewDurationSec] = useState(40);
    const [maxWheelRpm, setMaxWheelRpm] = useState(6000);
    const [rotorMaterialId, setRotorMaterialId] = useState("tungsten");
    const [spinHeroWheel, setSpinHeroWheel] = useState(false);

    const applyPreset = (presetKey) => {
        const p = SPACECRAFT_PRESETS[presetKey];
        if (!p) return;
        setActivePreset(presetKey);
        setScMass(p.mass);
        setDimL(p.dims.l);
        setDimW(p.dims.w);
        setDimH(p.dims.h);
        setIxx(p.ixx);
        setIyy(p.iyy);
        setIzz(p.izz);
        setSlewAngleDeg(p.slewAngle);
        setSlewDurationSec(p.slewTime);
        setMaxWheelRpm(p.wheelRpm);
        setRotorMaterialId(p.material);
    };

    const results = useMemo(() => {
        const maxI = Math.max(ixx, iyy, izz);
        const thetaRad = slewAngleDeg * Math.PI / 180;
        const alphaRadSec2 = (4 * thetaRad) / (slewDurationSec * slewDurationSec);
        const omegaMaxRadSec = alphaRadSec2 * (slewDurationSec / 2);
        const reqTorque = maxI * alphaRadSec2 * 1000; // mN.m
        const reqMomentum = maxI * omegaMaxRadSec * 1000; // mN.m.s
        const omegaWheel = maxWheelRpm * 2 * Math.PI / 60;
        const rotorInertia = (reqMomentum / 1000) / omegaWheel;
        const mat = ROTOR_MATERIALS[rotorMaterialId];
        const rotorMassG = (rotorInertia * 2 / (0.058 * 0.058)) * mat.density * 1000 * 0.35;

        return {
            maxI,
            reqTorque: reqTorque.toFixed(2),
            reqMomentum: reqMomentum.toFixed(2),
            rotorMassG: Math.max(45, rotorMassG).toFixed(1),
            peakPower: (reqTorque * 0.001 * omegaWheel / 0.75 + 1.2).toFixed(2)
        };
    }, [ixx, iyy, izz, slewAngleDeg, slewDurationSec, maxWheelRpm, rotorMaterialId]);

    return (
        <div className="min-h-screen flex flex-col justify-between">
            {/* Header */}
            <header className="sticky top-0 z-30 border-b backdrop-blur-xl bg-[#060608]/90 border-[#D4AF37]/25 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1A1813] to-[#292211] flex items-center justify-center border border-[#D4AF37]/50 shadow-md shadow-[#D4AF37]/20">
                        <span className="text-xl">⚡</span>
                    </div>
                    <div>
                        <h1 className="font-black tracking-[0.18em] text-sm uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#FFF6D6] via-[#D4AF37] to-[#B38728]">
                            WHEELOCITY
                        </h1>
                        <p className="text-[11px] text-zinc-400 font-mono">Reaction Wheel Sizing & Rotor Synthesis Studio</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {Object.keys(SPACECRAFT_PRESETS).map((key) => (
                        <button
                            key={key}
                            onClick={() => applyPreset(key)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                                activePreset === key 
                                    ? "bg-[#D4AF37]/25 text-[#FFF6D6] border-[#D4AF37]" 
                                    : "bg-[#0E0E12] text-zinc-400 border-zinc-800 hover:text-zinc-200"
                            }`}
                        >
                            {key}
                        </button>
                    ))}
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-[1400px] mx-auto px-6 py-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto">
                <div className="lg:col-span-6 bg-[#0C0C10]/80 border border-zinc-800 p-6 rounded-2xl backdrop-blur-xl space-y-6">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">Spacecraft & Slew Parameters</h2>
                    
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-[11px] font-mono text-zinc-400 mb-1">Mass (kg)</label>
                            <input type="number" value={scMass} onChange={e => setScMass(parseFloat(e.target.value))} className="w-full bg-black/60 border border-zinc-700 rounded p-2 text-xs font-mono text-zinc-100" />
                        </div>
                        <div>
                            <label className="block text-[11px] font-mono text-zinc-400 mb-1">Slew Angle (°)</label>
                            <input type="number" value={slewAngleDeg} onChange={e => setSlewAngleDeg(parseFloat(e.target.value))} className="w-full bg-black/60 border border-zinc-700 rounded p-2 text-xs font-mono text-zinc-100" />
                        </div>
                        <div>
                            <label className="block text-[11px] font-mono text-zinc-400 mb-1">Slew Time (s)</label>
                            <input type="number" value={slewDurationSec} onChange={e => setSlewDurationSec(parseFloat(e.target.value))} className="w-full bg-black/60 border border-zinc-700 rounded p-2 text-xs font-mono text-zinc-100" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-2 border-t border-zinc-800">
                        <div>
                            <label className="block text-[11px] font-mono text-zinc-400 mb-1">Ixx (kg·m²)</label>
                            <input type="number" step="0.01" value={ixx} onChange={e => setIxx(parseFloat(e.target.value))} className="w-full bg-black/60 border border-zinc-700 rounded p-2 text-xs font-mono text-zinc-100" />
                        </div>
                        <div>
                            <label className="block text-[11px] font-mono text-zinc-400 mb-1">Iyy (kg·m²)</label>
                            <input type="number" step="0.01" value={iyy} onChange={e => setIyy(parseFloat(e.target.value))} className="w-full bg-black/60 border border-zinc-700 rounded p-2 text-xs font-mono text-zinc-100" />
                        </div>
                        <div>
                            <label className="block text-[11px] font-mono text-zinc-400 mb-1">Izz (kg·m²)</label>
                            <input type="number" step="0.01" value={izz} onChange={e => setIzz(parseFloat(e.target.value))} className="w-full bg-black/60 border border-zinc-700 rounded p-2 text-xs font-mono text-zinc-100" />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-6 bg-[#0C0C10]/80 border border-[#D4AF37]/35 p-6 rounded-2xl backdrop-blur-xl flex flex-col justify-between space-y-6 shadow-2xl">
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37] mb-4">Sized Reaction Wheel Envelope</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black/50 p-4 rounded-xl border border-zinc-800">
                                <span className="text-xs text-zinc-400 block mb-1">Required Torque</span>
                                <span className="text-3xl font-extrabold font-mono text-[#FFF6D6]">{results.reqTorque}</span>
                                <span className="text-xs text-[#D4AF37] ml-1">mN·m</span>
                            </div>
                            <div className="bg-black/50 p-4 rounded-xl border border-zinc-800">
                                <span className="text-xs text-zinc-400 block mb-1">Momentum Capacity</span>
                                <span className="text-3xl font-extrabold font-mono text-[#FFF6D6]">{results.reqMomentum}</span>
                                <span className="text-xs text-[#D4AF37] ml-1">mN·m·s</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs font-mono text-zinc-300 pt-4 border-t border-zinc-800">
                        <div>Rotor Mass: <span className="text-[#F3E5AB] font-bold">{results.rotorMassG} g</span></div>
                        <div>Peak Power Draw: <span className="text-[#F59E0B] font-bold">{results.peakPower} W</span></div>
                    </div>
                </div>
            </main>

            {/* Custom Footer */}
            <footer className="mt-16 w-full py-10 border-t border-[#D4AF37]/20 bg-[#040406]/9ode backdrop-blur-xl flex justify-center">
                <div className="bg-[#0B0B0E]/85 backdrop-blur-xl border border-[#D4AF37]/25 rounded-2xl px-10 py-6 text-center shadow-2xl max-w-lg w-full mx-4 flex flex-col gap-3">
                    <div className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
                        Made for fun, by <span className="text-[#F3E5AB] font-bold">Nirmal</span>
                    </div>
                    <div className="text-2xl font-black uppercase tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-r from-[#FFF6D6] via-[#D4AF37] to-[#B38728] flex items-center justify-center gap-2">
                        Wheelocity <span className="font-mono text-[#D4AF37] text-base font-normal">&copy;</span>
                    </div>
                    <div className="font-mono text-xs text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30 py-1.5 px-3 rounded-md inline-block mx-auto">
                        Crafted in Chennai for the Universe 🚀✨
                    </div>
                </div>
            </footer>
        </div>
    );
}
window.App = App;