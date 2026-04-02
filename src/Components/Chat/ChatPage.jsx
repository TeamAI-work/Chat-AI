import { useState } from "react";
import Chat from "./Chat";
import Sidebar from "./Sidebar";
import { LoaderPinwheelIcon, Sparkle } from "lucide-react";
import { motion } from "framer-motion";

export default function ChatPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [hoverIcon, setHoverIcon] = useState(false)
    return (
        <div className=" flex h-screen w-screen">
            <motion.div
                initial={{ width: sidebarOpen ? "15%" : "3%" }}
                animate={{ width: sidebarOpen ? "15%" : "3%" }}
                transition={{ duration: 0.2 }}
                exit={{ width: "0%" }}
                className="group bg-gray-800 w-full pt-5">
                {
                    sidebarOpen ?
                        <div className="">
                            <div>
                                <Sidebar setSidebarOpen={setSidebarOpen} />
                            </div>
                        </div>
                        :
                        <div
                            onClick={() => { setSidebarOpen(true) }}
                            onMouseEnter={() => { setHoverIcon(true) }}
                            onMouseLeave={() => { setHoverIcon(false) }}
                            className="h-full cursor-pointer"
                        >
                            <div className="flex justify-center">
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setSidebarOpen(true)} 
                                    className="text-white cursor-pointer"
                                    >
                                    {hoverIcon ?
                                        <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                        exit={{ opacity: 0 }}  
                                        className="font-extralight" 
                                        >
                                            <Sparkle />
                                        </motion.div>
                                        :
                                        <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                        exit={{ opacity: 0 }}
                                        >
                                            <LoaderPinwheelIcon />
                                        </motion.div>
                                    }
                                </motion.button>
                            </div>
                        </div>
                }
            </motion.div>
            <div className="grow bg-gray-900 pt-5 text-white">
                <Chat />
            </div>
        </div>
    )
}