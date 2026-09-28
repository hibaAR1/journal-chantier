import {Button} from "../../../components/ui/button.jsx";

import {useAuthContext} from "../../../context/auth/auth.context.jsx";

import {selectIncludesFilterFn} from "../../../utilities/filters.js";

import FilterTextComponent from "../../../components/filters/filter-text/filter-text.component.jsx";
import FilterSelectComponent from "../../../components/filters/filter-select/filter-select.component.jsx";

import AssignmentWorkersUpdateLayout from "../update/assignment-workers-update.layout.jsx";
import AssignmentWorkersDestroyLayout from "../destroy/assignment-workers-destroy.layout.jsx";

export const AssignmentWorkersColumnsLayout = () => {
    const {user} = useAuthContext();

    const permissions = user?.permissions || [];

    return [
        {
            id: "index",
            header: () => {
                return (
                    <div className="flex justify-center items-center min-w-[60px] font-bold">
                        #
                    </div>
                )
            },
            cell: ({row}) => {
                return (
                    <div className="text-center">
                        {row.index + 1}
                    </div>
                )
            }
        },
        {
            name: 'Workers',
            accessorKey: "worker_name",
            header: ({column}) => {
                return (
                    <div className="flex justify-start items-start min-w-[200px]">
                        <Button
                            variant="ghost2"
                            className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Ouvrier
                        </Button>
                    </div>
                )
            },
            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column}/>,
            cell: ({row}) => {
                return (
                    <div className="text-left px-2">
                        {row.getValue("worker_name")}
                    </div>
                )
            }
        }, {
            id: "actions",
            name: "Actions",
            header: () => {
                return (
                    <div className="flex justify-center items-center font-bold hover:text-gray-100 px-0 min-w-[80px]">
                        Actions
                    </div>
                )
            },
            cell: ({row}) => {
                const item = row.original;

                const assignmentId = item.assignment_id;

                return (
                    <div className="flex justify-center items-center gap-1">
                        {
                            permissions.includes("update assignments") &&
                            <AssignmentWorkersUpdateLayout assignmentWorker={item} assignmentId={assignmentId}/>
                        }

                        {
                            (permissions.includes("delete assignments") ) &&
                            <AssignmentWorkersDestroyLayout assignmentWorker={item}/>
                        }
                    </div>
                )
            },
        },
    ]
};
