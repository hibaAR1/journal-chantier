import {useAuthContext} from "../../../context/auth/auth.context.jsx";

import SuppliersUpdateLayout from "../update/suppliers-update.layout.jsx";
import SuppliersDestroyLayout from "../destroy/suppliers-destroy.layout.jsx";

import {Button} from "../../../components/ui/button.jsx";

import FilterTextComponent from "../../../components/filters/filter-text/filter-text.component.jsx";

export const SuppliersColumnsLayout = () => {
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
            name: 'Code Système',
            accessorKey: "code_system",
            header: ({column}) => {
                return (
                    <div className="flex justify-start items-start min-w-[128px]">
                        <Button
                            variant="ghost2"
                            className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Code Système
                            {/*<CgArrowsExchangeAltV className="ml-2 h-4 w-4" />*/}
                        </Button>
                    </div>
                )
            },
            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column}/>,
            cell: ({row}) => {
                return <div className="text-center">{row.getValue("code_system")}</div>
            }
        }, {
            accessorKey: "registered_name",
            header: ({column}) => {
                return (
                    <div className="flex justify-start items-start min-w-[190px]">
                        <Button
                            variant="ghost2"
                            className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Raison Social
                        </Button>
                    </div>
                )
            },
            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column}/>,
            cell: ({row}) => {
                return <div className="text-left px-2">{row.getValue("registered_name")}</div>
            }
        },{
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
                            permissions.includes("update suppliers") &&
                            <SuppliersUpdateLayout supplier={item}/>
                        }

                        {
                            (permissions.includes("delete suppliers")) &&
                            <SuppliersDestroyLayout supplier={item}/>
                        }
                    </div>
                )
            },
        },
    ]
};
