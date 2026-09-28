import PunchWorkersExportLayout from "../export/punch-workers-export.layout.jsx";
import PunchWorkersUploadLayout from "../upload/punch-workers-upload.layout.jsx";

const PunchWorkersLinksLayout = ({punchId}) => {
    return (
        <div className="flex gap-2">
            <PunchWorkersExportLayout punchId={punchId} />

            <PunchWorkersUploadLayout />
        </div>
    )
};

export default PunchWorkersLinksLayout;