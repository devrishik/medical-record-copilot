"use client";

import { createContext, useContext, useState } from "react";

interface UploadedFile {
	id: string;
	url: string;
	filename: string;
}

interface DashboardContextType {
	medicalRecord: UploadedFile | null;
	setMedicalRecord: (file: UploadedFile | null) => void;
	guidelinesFile: UploadedFile | null;
	setGuidelinesFile: (file: UploadedFile | null) => void;
}

const DashboardContext = createContext<DashboardContextType>({
	medicalRecord: null,
	setMedicalRecord: () => {},
	guidelinesFile: null,
	setGuidelinesFile: () => {},
});

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
	const [medicalRecord, setMedicalRecord] = useState<UploadedFile | null>(null);
	const [guidelinesFile, setGuidelinesFile] = useState<UploadedFile | null>(null);

	return (
		<DashboardContext.Provider
			value={{
				medicalRecord,
				setMedicalRecord,
				guidelinesFile,
				setGuidelinesFile,
			}}
		>
			{children}
		</DashboardContext.Provider>
	);
};

export const useDashboard = () => useContext(DashboardContext);