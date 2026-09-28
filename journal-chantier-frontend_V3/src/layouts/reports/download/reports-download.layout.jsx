import React, { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "../../../components/ui/button.jsx";
import { useReportsContext } from "../../../context/reports/reports.context.jsx";

const ReportsDownloadLayout = ({ reportId }) => {
    const { downloadReportPDF, downloadReportExcel } = useReportsContext();
    const [open, setOpen] = useState(false);

    return (
        <div className="relative inline-block text-left">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(!open)}
            >
                <Download className="h-4 w-4" />
            </Button>

            {open && (
                <div className="absolute right-0 bottom-full mb-2 w-28 bg-white border rounded shadow-md z-10">
                    <button
                        className="w-full text-left px-3 py-1 hover:bg-gray-100"
                        onClick={() => {
                            downloadReportPDF(reportId);
                            setOpen(false);
                        }}
                    >
                        PDF
                    </button>
                    <button
                        className="w-full text-left px-3 py-1 hover:bg-gray-100"
                        onClick={() => {
                            downloadReportExcel(reportId);
                            setOpen(false);
                        }}
                    >
                        Excel
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReportsDownloadLayout;
