"use client";
import React, { useState } from "react";
import GlassSurface from "../ui/GlassSurface";
import "@/styles/Navbar.css";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const [isMenuOpen, setisMenuOpen] = useState(false);
    const pathname = usePathname();
    const hideNavbar =
        pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

    const toggleMenu = () => {
        if (isMenuOpen) {
            setisMenuOpen(false);
        } else {
            setisMenuOpen(true);
        }
    };

    if (hideNavbar) {
        return null;
    }

    return (
        <nav className="fixed top-2 left-0 z-[100] flex justify-center w-full text-white">
            <GlassSurface
                width={"99%"}
                height={"8vh"}
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
                className="my-custom-class relative flex justify-between w-full"
            >
                <div className="relative w-full h-full flex justify-between items-center px-5">
                    <div className="logo text-3xl tracking-[.1em]">
                        <h1 className="font-[600]">Monexa</h1>
                    </div>
                    <div
                        className={`hamburger-menu ${
                            isMenuOpen ? "open" : ""
                        } flex gap-[6px] flex-col justify-center px-1 items-end h-full w-[9rem]`}
                        onClick={toggleMenu}
                    >
                        <div className="hamburger-line"></div>
                        <div className="hamburger-line"></div>
                    </div>
                </div>
            </GlassSurface>
        </nav>
    );
};

export default Navbar;
