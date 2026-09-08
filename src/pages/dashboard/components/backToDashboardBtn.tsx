import { Button } from "@components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export default function BackToDashBoardBtn() {
    return (
        <Button variant="outline" size="lg" className="font-mono">
            <Link to="/dashboard" className="flex items-center gap-1.5">
                <ArrowLeft className="size-4" />
                Back to Dashboard
            </Link>
        </Button>
    );
}
