import { Button } from "@components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export default function BackToDashBoardBtn() {
    return (
        <Button variant="default" size="lg">
            <Link to="/dashboard" className="flex items-center gap-1">
                <ArrowLeft />
                Back to Dashboard
            </Link>
        </Button>
    );
}
