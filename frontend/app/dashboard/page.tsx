"use client";

import GuidelinesUpload from "@/components/guidelines-upload";
import MedicalRecordUpload from "@/components/medical-record-upload";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/context/dashboard-context";
import { Toaster } from "react-hot-toast";
import classNames from 'classnames';

export const revalidate = 0;

export default function DashboardRoot() {
	const router = useRouter();
	const { medicalRecord, guidelinesFile } = useDashboard();
	const CASE_ID = "case_891a_6fbl_87d1_4326";

	const handleContinue = () => {
		router.push(`/dashboard/case/${CASE_ID}`)
	}

	const canContinue = medicalRecord !== null && guidelinesFile !== null;

	return (
		<div className="w-full flex flex-col justify-center items-center h-screen">
			<Toaster position="top-right" />
			<div className="w-full flex flex-row gap-2 items-center">
				<MedicalRecordUpload />
				<GuidelinesUpload />
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
