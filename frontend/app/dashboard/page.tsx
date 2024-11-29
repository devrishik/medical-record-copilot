"use client";

import { useRouter } from "next/navigation";
import { useDashboard } from "@/context/dashboard-context";
import { Toaster } from "react-hot-toast";
import classNames from 'classnames';
import FileUpload from "@/components/file-upload";
import toast from "react-hot-toast";

export const revalidate = 0;

interface UploadedFile {
	id: string;
	url: string;
	filename: string;
}

export default function DashboardRoot() {
	const router = useRouter();
	const { medicalRecord, setMedicalRecord, guidelinesFile, setGuidelinesFile } = useDashboard();

	const handleContinue = async () => {
		try {
			console.log('Sending case data:', {
				medical_record_id: (medicalRecord as UploadedFile)?.id,
				guidelines_id: (guidelinesFile as UploadedFile)?.id,
			});
			console.log('Full medical record:', medicalRecord);
			console.log('Full guidelines file:', guidelinesFile);

			const response = await fetch('http://localhost:8000/cases', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					medical_record_id: (medicalRecord as UploadedFile)?.id,
					guidelines_id: (guidelinesFile as UploadedFile)?.id,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				console.error('Error response:', errorData);
				throw new Error(`Failed to create case: ${JSON.stringify(errorData)}`);
			}

			const data = await response.json();
			router.push(`/dashboard/case/${data.case_id}`);
			console.log('Case created:', data);
		} catch (error) {
			console.error('Error creating case:', error);
			toast.error('Failed to create case. Please try again.');
		}
	}

	const canContinue = medicalRecord !== null && guidelinesFile !== null;

	return (
		<div className="w-full flex flex-col justify-center items-center h-screen">
			<Toaster position="top-right" />
			<div className="w-full flex flex-row gap-2 items-center">
				<FileUpload
					title="Medical Record"
					buttonColor="blue"
					isUploaded={medicalRecord !== null}
					onUpload={setMedicalRecord}
					fileType="medical-record"
				/>
				<FileUpload
					title="Guidelines"
					buttonColor="orange"
					isDisabled={!medicalRecord}
					disabledMessage="Please upload a medical record first"
					isUploaded={guidelinesFile !== null}
					onUpload={setGuidelinesFile}
					fileType="guidelines"
				/>
			</div>
			<div className="w-full py-4 flex flex-row justify-center">
				<button
					className={classNames(
						"font-medium text-white py-2 px-4 rounded transition-all duration-200",
						canContinue ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
					)}
					onClick={handleContinue}
					disabled={!canContinue}
				>
					Continue
				</button>
			</div>
		</div>
	)
}
