import {Button} from "../../../components/ui/button.jsx";

import {useAuthContext} from "../../../context/auth/auth.context.jsx";
import FilterTextComponent from "../../../components/filters/filter-text/filter-text.component.jsx";

import WorkersUpdateLayout from "../update/workers-update.layout.jsx";
import WorkersDestroyLayout from "../destroy/workers-destroy.layout.jsx";

export const WorkersColumnsLayout = () => {
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
            accessorKey: "registration_number",
            header: ({column}) => {
                return (
                    <div className="flex justify-start items-start min-w-[190px]">
                        <Button
                            variant="ghost2"
                            className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Matricule
                        </Button>
                    </div>
                )
            },
            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column}/>,
            cell: ({row}) => {
                return <div className="text-left px-2">{row.getValue("registration_number")}</div>
            }
        }, {
            accessorKey: "name",
            header: ({column}) => {
                return (
                    <div className="flex justify-start items-start min-w-[190px]">
                        <Button
                            variant="ghost2"
                            className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Nom
                        </Button>
                    </div>
                )
            },
            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column}/>,
            cell: ({row}) => {
                return <div className="text-left px-2">{row.getValue("name")}</div>
            }
        }, {
            name: 'Resources',
            accessorKey: "resource_name",
            header: ({column}) => {
                return (
                    <div className="flex justify-start items-start min-w-[190px]">
                        <Button
                            variant="ghost2"
                            className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Quallification
                        </Button>
                    </div>
                )
            },
            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column}/>,
            cell: ({row}) => {
                return <div className="text-left px-2">{row.getValue("resource_name")}</div>
            }
        }, {
            name: 'Contract Type',
            accessorKey: "contract_type",
            header: ({column}) => {
                return (
                    <div className="flex justify-start items-start min-w-[190px]">
                        <Button
                            variant="ghost2"
                            className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Type de contrat
                        </Button>
                    </div>
                )
            },
            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column}/>,
            cell: ({row}) => {
                return <div className="text-left px-2">{row.getValue("contract_type")}</div>
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

                return (
                    <div className="flex justify-center items-center gap-1">
                        {
                            permissions.includes("update workers") &&
                            <WorkersUpdateLayout worker={item}/>
                        }

                        {
                            (permissions.includes("delete workers")) &&
                            <WorkersDestroyLayout worker={item}/>
                        }
                    </div>
                )
            },
        },
    ]
};
