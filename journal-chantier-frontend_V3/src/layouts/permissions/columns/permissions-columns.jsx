import { Button } from "../../../components/ui/button.jsx";
import { useAuthContext } from "../../../context/auth/auth.context.jsx";
import PermissionsUpdateLayout from "../update/permissions-update.layout.jsx";
import PermissionsDestroyLayout from "../destroy/permissions-destroy.layout.jsx";
import FilterTextComponent from "../../../components/filters/filter-text/filter-text.component.jsx";

export const PermissionsColumnsLayout = () => {
    const { user } = useAuthContext();
    const permissions = user?.permissions || [];

    return [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <div className="flex justify-start items-start min-w-[190px]">
                    <Button
                        variant="ghost2"
                        className="justify-center font-bold hover:text-gray-100 px-0 w-full"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Nom
                    </Button>
                </div>
            ),
            filterFn: "includesString",
            Filter: ({ column }) => <FilterTextComponent column={column} />,
            cell: ({ row }) => (
                <div className="text-left px-2">{row.getValue("name")}</div>
            ),
        },
        {
            accessorKey: "abbreviation",
            header: () => (
                <div className="text-left font-bold min-w-[150px]">Abréviation</div>
            ),
            cell: ({ row }) => (
                <div className="text-left px-2">{row.getValue("abbreviation")}</div>
            ),
        },
        {
            accessorKey: "guard_name",
            header: () => (
                <div className="text-left font-bold min-w-[120px]">Garde</div>
            ),
            cell: ({ row }) => (
                <div className="text-left px-2">{row.getValue("guard_name")}</div>
            ),
        },
        {
            id: "actions",
            header: () => (
                <div className="flex justify-center items-center font-bold min-w-[100px]">
                    Actions
                </div>
            ),
            cell: ({ row }) => {
                const permission = row.original;

                return (
                    <div className="flex justify-center items-center gap-1">
                        {permissions.includes("update permissions") && (
                            <PermissionsUpdateLayout permission={permission} />
                        )}
                        {permissions.includes("delete permissions") && (
                            <PermissionsDestroyLayout permission={permission} />
                        )}
                    </div>
                );
            },
        },
    ];
};
