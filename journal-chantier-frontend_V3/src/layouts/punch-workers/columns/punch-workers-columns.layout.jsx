import {Button} from "../../../components/ui/button.jsx";
import {useAuthContext} from "../../../context/auth/auth.context.jsx";
import FilterTextComponent from "../../../components/filters/filter-text/filter-text.component.jsx";
import FilterSelectComponent from "../../../components/filters/filter-select/filter-select.component.jsx";

import PunchWorkersUpdateLayout from "../update/punch-workers-update.layout.jsx";
import PunchWorkersDestroyLayout from "../destroy/punch-workers-destroy.layout.jsx";
import {selectIncludesFilterFn} from "../../../utilities/filters.js";

export const PunchWorkersColumnsLayout = () => {
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
            header: ({column}) => (
                <div className="flex justify-start items-start min-w-[200px]">
                    <Button
                        variant="ghost2"
                        className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Ouvrier
                    </Button>
                </div>
            ),
            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column} />,
            cell: ({row}) => {
                return row.original.isTotal
                    ? <div className="font-bold px-2">{row.getValue("worker_name")}</div>
                    : <div className="text-left px-2">{row.getValue("worker_name")}</div>
            }
        },
        {
            name: 'Qualification',
            accessorKey: "resource_name",
            header: ({column}) => (
                <div className="flex justify-start items-start min-w-[150px]">
                <Button
                    variant="ghost2"
                    className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} >
                    Qualification </Button> </div> ), filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column}/>,
            cell: ({row}) => { const value = row.getValue("resource_name");
                return <div className="text-left px-2">{value || ""}</div>;
            }
            },
        {
            name: 'Type',
            accessorKey: "type",
            header: ({column}) => (
                <div className="flex justify-start items-start min-w-[120px]">
                    <Button
                        variant="ghost2"
                        className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Type
                    </Button>
                </div>
            ),
            filterFn: selectIncludesFilterFn,
            Filter: ({column}) => <FilterSelectComponent
                column={column}
                placeholder="Rechercher"
                options={[
                    {value: 1, name: 'Service Normal'},
                    {value: 2, name: 'Travail à la tache'},
                    {value: 3, name: 'Travail à la tache multiple'},
                    {value: 4, name: 'Licencié'},
                    {value: 5, name: 'Absent autorisé'},
                    {value: 6, name: 'Absent non autorisé'},
                    {value: 7, name: 'Malade'},
                ]}
            />,
            cell: ({row}) => {
                if(row.original.isTotal) return null; // ligne total vide ici
                const type = parseInt(row.getValue('type'));
                switch(type){
                    case 1: return <div className="text-center">Service Normal</div>;
                    case 2: return <div className="text-center">Travail à la tache</div>;
                    case 3: return <div className="text-center">Travail à la tache multiple</div>;
                    case 4: return <div className="text-center">Licencié</div>;
                    case 5: return <div className="text-center">Absent autorisé</div>;
                    case 6: return <div className="text-center">Absent non autorisé</div>;
                    case 7: return <div className="text-center">Malade</div>;
                    default: return <div className="text-center">—</div>;
                }
            }
        },
        {
            name: 'Direct/Indirect',
            accessorKey: "direct",
            header: ({column}) => (
                <div className="flex justify-center min-w-[120px]">
                    <Button
                        variant="ghost2"
                        className="font-bold px-0 w-full"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Direct
                    </Button>
                </div>
            ),
            cell: ({row}) => {
                if (row.original.isTotal) return null;

                const value = row.getValue("direct");

                if (value === 1 || value === true) {
                    return <div className="text-center text-green-600">Direct</div>;
                }

                if (value === 0 || value === false) {
                    return <div className="text-center text-red-600">Indirect</div>;
                }

                return <div className="text-center text-gray-400">-</div>;
            }
        },
        {
            name: 'Natural Hours',
            accessorKey: "natural_hours",
            header: ({column}) => (
                <div className="flex justify-start items-start min-w-[125px]">
                    <Button
                        variant="ghost2"
                        className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        H.N
                    </Button>
                </div>
            ),
            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column} />,
            cell: ({row}) => {
                return row.original.isTotal
                    ? <div className="font-bold px-2">{row.getValue("natural_hours")}</div>
                    : <div className="text-left px-2">{row.getValue("natural_hours")}</div>
            }
        },
        {
            name: 'Overtime Hours',
            accessorKey: "overtime_hours",
            header: ({column}) => (
                <div className="flex justify-start items-start min-w-[125px]">
                    <Button
                        variant="ghost2"
                        className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        H.S
                    </Button>
                </div>
            ),
            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column} />,
            cell: ({row}) => {
                return row.original.isTotal
                    ? <div className="font-bold px-2">{row.getValue("overtime_hours")}</div>
                    : <div className="text-left px-2">{row.getValue("overtime_hours")}</div>
            }
        },
        {
            id: "actions",
            name: "Actions",
            header: () => <div className="flex justify-center items-center font-bold hover:text-gray-100 px-0 min-w-[80px]">Actions</div>,
            cell: ({row}) => {
                if(row.original.isTotal) return null; // pas d'actions pour la ligne total
                const item = row.original;
                const punchId = item.punch_id;
                const isValidate = item?.punch_validated ?? false;

                return (
                    <div className="flex justify-center items-center gap-1">
                        {permissions.includes("update punches") && !isValidate && <PunchWorkersUpdateLayout punchWorker={item} punchId={punchId} />}
                        {permissions.includes("delete punches") && !isValidate && <PunchWorkersDestroyLayout punchWorker={item} />}
                    </div>
                )
            },
        },
    ]
};
