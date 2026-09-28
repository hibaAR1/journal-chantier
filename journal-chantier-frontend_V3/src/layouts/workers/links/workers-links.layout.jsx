import WorkersExportLayout from "../export/workers-export.layout.jsx";
import WorkersUploadLayout from "../upload/workers-upload.layout.jsx";

const WorkersLinksLayout = () => {
    return (
        <div className="flex gap-2">
            <WorkersExportLayout />

            <WorkersUploadLayout />
        </div>
    )
};

export default WorkersLinksLayout;