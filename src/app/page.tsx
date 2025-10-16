import LiquidEther from "@/components/ui/LiquidEther";
import GlassSurface from "@/components/ui/GlassSurface";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import MagicBento from "@/components/ui/MagicBento";

export default function Home() {
    return (
        <div className="relative h-full">
            {/* LiquidEther Container */}
            <div className="fixed inset-0 w-full h-screen">
                <LiquidEther
                    colors={["#56047c", "#8007ab", "#8f58c6"]}
                    mouseForce={20}
                    cursorSize={100}
                    isViscous={true}
                    viscous={35}
                    iterationsViscous={30}
                    iterationsPoisson={32}
                    resolution={0.4}
                    isBounce={true}
                    autoDemo={true}
                    autoSpeed={0.5}
                    autoIntensity={2.2}
                    takeoverDuration={0.25}
                    autoResumeDelay={3000}
                    autoRampDuration={0.6}
                    style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 0,
                        pointerEvents: "auto",
                    }}
                />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 h-screen pointer-events-none">
                <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center">
                    <GlassSurface
                        width={"12rem"}
                        height={"2.5rem"}
                        borderRadius={24}
                        backgroundOpacity={0.1}
                        saturation={1}
                        borderWidth={0.07}
                        brightness={50}
                        opacity={0.93}
                        blur={11}
                        displace={0.5}
                        distortionScale={-180}
                        redOffset={0}
                        greenOffset={10}
                        blueOffset={20}
                        className="my-custom-class mb-5"
                    >
                        <div className="text-white font-medium tracking-wider flex gap-3">
                            <div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="icon icon-tabler icons-tabler-outline icon-tabler-background"
                                >
                                    <path
                                        stroke="none"
                                        d="M0 0h24v24H0z"
                                        fill="none"
                                    />
                                    <path d="M4 8l4 -4" />
                                    <path d="M14 4l-10 10" />
                                    <path d="M4 20l16 -16" />
                                    <path d="M20 10l-10 10" />
                                    <path d="M20 16l-4 4" />
                                </svg>
                            </div>
                            AI Finances
                        </div>
                    </GlassSurface>
                    <div className="max-w-[60rem] mx-auto text-center text-white">
                        <h1 className="text-6xl font-bold mb-6 leading-[5rem]">
                            <LayoutTextFlip
                                text="The Intelligent Way to"
                                words={["Manage", "Grow"]}
                            />
                            <div>Your Finances</div>
                        </h1>
                        <div className="cta h-[3rem] flex justify-center gap-10 mt-15">
                            <button className="w-[10rem] h-[2.8rem] bg-white text-black font-medium rounded-[100] hover:bg-[#9659ff45] hover:text-white transition-all duration-300 pointer-events-auto">
                                Explore Now
                            </button>
                            <GlassSurface
                                width={"10rem"}
                                height={"2.8rem"}
                                borderRadius={24}
                                backgroundOpacity={0.1}
                                saturation={1}
                                borderWidth={0.07}
                                brightness={50}
                                opacity={0.93}
                                blur={11}
                                displace={0.5}
                                distortionScale={-180}
                                redOffset={0}
                                greenOffset={10}
                                blueOffset={20}
                                className="my-custom-class"
                            >
                                <button className="w-full h-full text-white font-medium rounded-[100] transition-all duration-300 pointer-events-auto">
                                    See Plans
                                </button>
                            </GlassSurface>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-screen w-full">
                <MagicBento
                    textAutoHide={true}
                    enableStars={true}
                    enableSpotlight={true}
                    enableBorderGlow={true}
                    enableTilt={false}
                    enableMagnetism={false}
                    clickEffect={true}
                    spotlightRadius={300}
                    particleCount={12}
                    glowColor="132, 0, 255"
                />
            </div>
        </div>
    );
}
