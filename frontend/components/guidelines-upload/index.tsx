"use client";

import { useDashboard } from "@/context/dashboard-context";
import classNames from "classnames";
import { FaCheck } from "react-icons/fa";
import { PulseLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useState } from "react";

export default function GuidelinesUpload() {
    const { guidelinesFile, setGuidelinesFile, medicalRecord } = useDashboard();
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = () => {
        if (!medicalRecord) {
            toast.error("Please upload a medical record first");
            return;
        }

        setIsLoading(true);
        // Simulate upload delay
        setTimeout(() => {
            setGuidelinesFile({ url: "/assets/guidelines.pdf" });
            setIsLoading(false);
        }, 3000);
    }

    return(
        <div className="w-1/2 h-64 border border-4 border-gray-200 border-dashed rounded flex flex-row items-center justify-center">
            <button
                className={classNames(
                    "text-white font-medium py-2 px-4 rounded border border-2",
                    guidelinesFile === null ? "bg-orange-500 border-orange-500 hover:bg-orange-600" : "border-transparent text-green-600",
                    !medicalRecord && "opacity-50 cursor-not-allowed"
                )}
                onClick={handleClick}
                disabled={!medicalRecord}
            >
                {isLoading && <PulseLoader size={8} color="#ffffff" />}
                {!isLoading && guidelinesFile === null && (<span>Simulate Guidelines Upload</span>)}
                {!isLoading && guidelinesFile !== null && (
                    <span className="text-green-600 flex flex-row gap-1 items-center">
                        <FaCheck />
                        <span>Guidelines File Uploaded</span>
                    </span>
                )}
            </button>
        </div>
    )
}