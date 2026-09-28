import {Button} from "../../../components/ui/button.jsx";

import FilterTextComponent from "../../../components/filters/filter-text/filter-text.component.jsx";

import ResourcesUpdateLayout from "../update/resources-update.layout.jsx";
import ResourcesDestroyLayout from "../destroy/resources-destroy.layout.jsx";
import {selectIncludesFilterFn} from "../../../utilities/filters.js";
import FilterSelectComponent from "../../../components/filters/filter-select/filter-select.component.jsx";

import {useAuthContext} from "../../../context/auth/auth.context.jsx";

export const ResourcesColumnsLayout = () => {
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
            accessorKey: "code",
            header: ({column}) => {
                return (
                    <div className="flex justify-start items-start min-w-[190px]">
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
        },
        {
            accessorKey: "abrv",
            header: ({column}) => {
                return (
                    <div className="flex justify-start items-start min-w-[120px]">
                        <Button
                            variant="ghost2"
                            className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Abrv
                        </Button>
                    </div>
                )
            },
            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column}/>,
            cell: ({row}) => {
                const abrv = row.getValue("abrv");

                return (
                    <div className="text-center">
                        {abrv ? abrv : "-"}
                    </div>
                )
            }
        },
        {
            name: 'Type',
            accessorKey:
                "type",
            header:
                ({column}) => {
                    return (
                        <div className="flex justify-start items-start min-w-[123px]">
                            <Button
                                variant="ghost2"
                                className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            >
                                Type
                            </Button>
                        </div>
                    )
                },
            filterFn:
            selectIncludesFilterFn,
            Filter:
                ({column}) => <FilterSelectComponent
                    column={column}
                    placeholder="Rechercher"
                    options={[
                        {value: 1, name: 'Main-d\'œuvre'},
                        {value: 2, name: 'Matériels & Equipements'},
                    ]}
                />,
            cell:
                ({row}) => {
                    const type = parseInt(row.getValue('type'));
                    let value = '';

                    switch (type) {
                        case 1:
                            value = 'Main-d\'œuvre';
                            break;
                        case 2:
                            value = 'Matériel & Equipements';
                            break;
                    }
                    return <div className="text-center">{value}</div>
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
                            permissions.includes("update resources") &&
                            <ResourcesUpdateLayout resource={item}/>
                        }

                        {
                            (permissions.includes("delete resources") ) &&
                            <ResourcesDestroyLayout resource={item}/>
                        }
                    </div>
                )
            },
        },
    ]
};
