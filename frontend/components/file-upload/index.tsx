"use client";

import { useState, useRef } from "react";
import classNames from "classnames";
import { FaCheck, FaUpload } from "react-icons/fa";
import { PulseLoader } from "react-spinners";
import toast from "react-hot-toast";

interface FileUploadProps {
    title: string;
    buttonColor: string;
    isDisabled?: boolean;
    disabledMessage?: string;
    isUploaded: boolean;
    onUpload: (file: { id: string, url: string, filename: string }) => void;
    fileType: "medical_record" | "guidelines";
}

export default function FileUpload({
    title,
    buttonColor,
    isDisabled = false,
    disabledMessage = "This action is not available",
    isUploaded,
    onUpload,
    fileType
}: FileUploadProps) {
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.name.toLowerCase().endsWith('.pdf')) {
            toast.error("Please upload a PDF file");
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`http://localhost:8000/upload/${fileType}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            console.log('Upload response:', data);
            onUpload(data);
            toast.success(`${title} uploaded successfully`);
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(`Failed to upload ${title}`);
        } finally {
            setIsLoading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleClick = () => {
        if (isDisabled) {
            toast.error(disabledMessage);
            return;
        }
        fileInputRef.current?.click();
    };

    const getButtonColorClasses = () => {
        if (isUploaded) return "border-transparent text-green-600";
        switch (buttonColor) {
            case "blue":
                return "bg-blue-500 border-blue-500 hover:bg-blue-600";
            case "orange":
                return "bg-orange-500 border-orange-500 hover:bg-orange-600";
            default:
                return "bg-gray-500 border-gray-500 hover:bg-gray-600";
        }
    };

    return (
        <div className="w-1/2 h-64 border border-4 border-gray-200 border-dashed rounded flex flex-col items-center justify-center gap-2">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf"
                className="hidden"
            />
            <button
                className={classNames(
                    "text-white font-medium py-2 px-4 rounded border border-2 transition-all duration-200",
                    getButtonColorClasses(),
                    isDisabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={handleClick}
                disabled={isDisabled}
            >
                {isLoading && <PulseLoader size={8} color="#ffffff" />}
                {!isLoading && !isUploaded && (
                    <span className="flex items-center gap-2">
                        <FaUpload />
                        <span>Upload {title}</span>
                    </span>
                )}
                {!isLoading && isUploaded && (
                    <span className="text-green-600 flex flex-row gap-1 items-center">
                        <FaCheck />
                        <span>{title} Uploaded</span>
                    </span>
                )}
            </button>
            <p className="text-sm text-gray-500">Only PDF files are accepted</p>
        </div>
    );
}
