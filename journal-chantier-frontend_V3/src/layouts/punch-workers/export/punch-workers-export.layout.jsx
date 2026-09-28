import {usePunchWorkersContext} from "../../../context/punch-workers/punch-workers.context.jsx";

import {Button} from "../../../components/ui/button.jsx";

import {FiDownload, FiLoader} from "react-icons/fi";
import {useLoadingContext} from "../../../context/loading/loading.context.jsx";

const PunchWorkersExportLayout = ({punchId}) => {
    const {exportPunchWorkers} = usePunchWorkersContext();

    const {exportLoading} = useLoadingContext();

    const handleExportClick = async () => {
        await exportPunchWorkers(punchId);
    }


    return (
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

            <span className="hidden md:inline">Télécharger</span>
        </Button>
    )
};

export default PunchWorkersExportLayout;