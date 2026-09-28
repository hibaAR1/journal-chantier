import  {useWorkersContext} from "../../../context/workers/workers.context.jsx";
import {useLoadingContext} from "../../../context/loading/loading.context.jsx";

import {Button} from "../../../components/ui/button.jsx";

import {FiDownload, FiLoader} from "react-icons/fi";

const WorkersExportLayout = () => {
    const {exportWorkers, exportAllWorkers} = useWorkersContext();

    const {exportLoading} = useLoadingContext();

    const handleExportClick = async () => {
        await exportWorkers();
    }

    const handleExportAll = async () => {
        await exportAllWorkers();
    };

    return (
        <div className="flex gap-2">
            {/* Export Template */}
            <Button
                variant="primaryOutline"
                className="justify-start gap-2 m-0"
                onClick={handleExportClick}
            >
                {
                    exportLoading
                        ? <FiLoader className="me-2 animate-spin"/>
                        : <FiDownload/>
                }

                <span className="hidden md:inline">
                Canvas
            </span>
            </Button>

            {/* Export All */}
            <Button
                variant="primaryOutline"
                className="justify-start gap-2 m-0"
                onClick={handleExportAll}
            >
                {
                    exportLoading
                        ? <FiLoader className="me-2 animate-spin"/>
                        : <FiDownload/>
                }

                <span className="hidden md:inline">
                Tous les ouvriers
            </span>
            </Button>
        </div>
    );
};

export default WorkersExportLayout;