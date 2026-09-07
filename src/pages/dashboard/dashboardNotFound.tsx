import { useNavigate } from "react-router";
import DashboardBanner from "@pages/dashboard/components/dashboardBanner";

export default function DashboardNotFound() {
    const navigate = useNavigate();
    return (
        <>
            <DashboardBanner />
            <div className="flex flex-1 items-center justify-center bg-neutral-950 p-8">
                <div className="flex flex-col items-center gap-3 font-mono">
                    <span className="text-5xl font-bold text-teal-400">404</span>
                    <span className="text-sm text-stone-200">Page not found</span>
                    <button
                        className="cursor-pointer rounded-lg border border-teal-900 bg-teal-950 p-2.5 text-sm font-bold text-teal-400 hover:border-teal-800 hover:bg-teal-900"
                        onClick={() => void navigate("/dashboard")}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </>
    );
}
