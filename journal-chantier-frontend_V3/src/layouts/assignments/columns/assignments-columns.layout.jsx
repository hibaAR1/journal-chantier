import {Button} from "../../../components/ui/button.jsx";

import {useAuthContext} from "../../../context/auth/auth.context.jsx";

import FilterTextComponent from "../../../components/filters/filter-text/filter-text.component.jsx";

import AssignmentsUpdateLayout from "../update/assignments-update.layout.jsx";
import AssignmentsDestroyLayout from "../destroy/assignments-destroy.layout.jsx";

import LinkIconBtnComponent from "../../../components/link-icon-btn/link-icon-btn.component.jsx";

import {FaList} from "react-icons/fa6";

export const AssignmentsColumnsLayout = () => {
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
            name: 'Code',
            accessorKey: "code",
            header: ({column}) => {
                return (
                    <div className="flex justify-start items-start min-w-[125px]">
                        <Button
                            variant="ghost2"
                            className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Code
                        </Button>
                    </div>
                )
            },
            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column}/>,
            cell: ({row}) => {
                return <div className="text-left px-2">{row.getValue("code")}</div>
            }
        }, {
            name: 'Sites',
            accessorKey: "site_name",
            header: ({column}) => {
                return (
                    <div className="flex justify-start items-start min-w-[200px]">
                        <Button
                            variant="ghost2"
                            className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Chantier
                        </Button>
                    </div>
                )
            },
            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column}/>,
            cell: ({row}) => {
                return <div className="text-left px-2">{row.getValue("site_name")}</div>
            }
        }, {
            id: "data_entry",
            name: "Data Entry",
            header: () => {
                return (
                    <div className="flex justify-center items-center font-bold hover:text-gray-100 px-0 min-w-[110px]">
                        Saisie
                    </div>
                )
            },
            cell: ({row}) => {
                const item = row.original;

                return (
                    <div className="flex justify-center items-center gap-1">
                        {
                            permissions.includes("view assignments") &&
                            <LinkIconBtnComponent
                                link={`/assignment-workers/${item.id}`}
                                text_color={"#fff"}
                                bg_color={"#C94D25"}
                            >
                                <FaList />
                            </LinkIconBtnComponent>
                        }
                    </div>
                )
            },
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
                            permissions.includes("update assignments") &&
                            <AssignmentsUpdateLayout assignment={item}/>
                        }

                        {
                            (permissions.includes("delete assignments") ) &&
                            <AssignmentsDestroyLayout assignment={item}/>
                        }
                    </div>
                )
            },
        },
    ]
};
