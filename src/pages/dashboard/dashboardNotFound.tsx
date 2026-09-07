import DashboardBanner from "@pages/dashboard/components/dashboardBanner";
import BackToDashBoardBtn from "./components/backToDashboardBtn";
export default function DashboardNotFound() {
    return (
        <>
            <DashboardBanner />
            <div className="flex flex-1 items-center justify-center bg-neutral-950 p-8">
                <div className="flex flex-col items-center gap-3 font-mono">
                    <span className="text-5xl font-bold text-teal-400">404</span>
                    <span className="text-sm text-stone-200">Page not found</span>
                    <BackToDashBoardBtn />
                </div>
            </div>
        </>
    );
}
