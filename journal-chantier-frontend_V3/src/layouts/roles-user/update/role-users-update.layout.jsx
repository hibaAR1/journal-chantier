import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRolesContext } from "../../../context/role-users/role-users.context.jsx";
import PermissionsApis from "../../../apis/permissions.apis.jsx";

import SheetFormLayout from "../../sheet-form/sheet-form.layout.jsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form.jsx";
import { Input } from "../../../components/ui/input.jsx";
import { Button } from "../../../components/ui/button.jsx";
import LabelRequiredStarComponent from "../../../components/form/label-required-star/label-required-star.component.jsx";
import { FiEdit2, FiLoader } from "react-icons/fi";

const RoleUsersUpdateLayout = ({ role }) => {
    const { updateRole } = useRolesContext();
    const [isOpen, setIsOpen] = useState(false);
    const [showPermissionsModal, setShowPermissionsModal] = useState(false);
    const [permissionsByModule, setPermissionsByModule] = useState({});
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [search, setSearch] = useState("");
    const [loadingPermissions, setLoadingPermissions] = useState(true);

    const formSchema = z.object({
        name: z.string().min(2).max(150),
        abbreviation: z.string().min(2).max(50),
        permissions: z.array(z.number()).optional(),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: role?.name ?? "",
            abbreviation: role?.abbreviation ?? "",
            permissions: role?.permissions?.map((p) => p.id) ?? [],
        },
    });

    const closeSheet = () => {
        setIsOpen(false);
        setShowPermissionsModal(false);
        setSelectedPermissions([]);
        form.reset();
    };

    useEffect(() => {
        if (!isOpen) return;
        async function fetchPermissions() {
            setLoadingPermissions(true);
            try {
                const { data } = await PermissionsApis.getPermissions();
                const grouped = {};
                data.forEach((perm) => {
                    const module = perm.module_name || "Autres";
                    if (!grouped[module]) grouped[module] = [];
                    grouped[module].push({
                        id: perm.id,
                        name: perm.name,
                        label: perm.abbreviation,
                        moduleAbbr: perm.module_abbreviation,
                    });
                });
                setPermissionsByModule(grouped);

                // Permissions initiales du rôle
                setSelectedPermissions(role?.permissions?.map((p) => p.id) ?? []);
            } catch (err) {
                console.error("Erreur fetch permissions", err);
            } finally {
                setLoadingPermissions(false);
            }
        }
        fetchPermissions();
    }, [isOpen, role]);

    useEffect(() => {
        form.setValue("permissions", selectedPermissions);
    }, [selectedPermissions, form]);

    const togglePermission = (id) => {
        setSelectedPermissions((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    const toggleModulePermissions = (module) => {
        const perms = permissionsByModule[module].map((p) => p.id);
        const allSelected = perms.every((id) => selectedPermissions.includes(id));
        setSelectedPermissions((prev) =>
            allSelected ? prev.filter((id) => !perms.includes(id)) : [...new Set([...prev, ...perms])]
        );
    };

    const toggleAllPermissions = () => {
        const allIds = Object.values(permissionsByModule).flat().map((p) => p.id);
        const allSelected = allIds.every((id) => selectedPermissions.includes(id));
        setSelectedPermissions(allSelected ? [] : allIds);
    };

    const isAllChecked = () => {
        const allIds = Object.values(permissionsByModule).flat().map((p) => p.id);
        return allIds.every((id) => selectedPermissions.includes(id));
    };

    const onSubmit = async (values) => {
        try {
            const payload = { ...values, permissions: selectedPermissions };
            await updateRole(role.id, payload, form);
            closeSheet();
        } catch (error) {
            console.error("Erreur update rôle :", error);
        }
    };

    return (
        <SheetFormLayout
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={`Modifier le rôle "${role.name}"`}
            btn={<Button variant="warningOutline" className="h-6 px-1"><FiEdit2 /></Button>}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nom <LabelRequiredStarComponent /></FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Nom" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="abbreviation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Abréviation <LabelRequiredStarComponent /></FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Abréviation" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowPermissionsModal(true)}
                    >
                        Gérer les permissions ({selectedPermissions.length})
                    </Button>

                    {showPermissionsModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white rounded-lg p-6 w-[90vw] max-w-5xl max-h-[80vh] overflow-auto shadow-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Permissions</h2>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={isAllChecked()}
                                            onChange={toggleAllPermissions}
                                            className="mr-2 cursor-pointer"
                                        />
                                        <span className="text-sm">Tout cocher / décocher</span>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <Input
                                        placeholder="Rechercher une permission..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-6 max-h-[60vh] overflow-auto pr-4">
                                    {loadingPermissions ? (
                                        <div className="flex justify-center py-10">
                                            <FiLoader className="animate-spin text-2xl" />
                                        </div>
                                    ) : (
                                        Object.entries(permissionsByModule)
                                            .sort(([a], [b]) => a.localeCompare(b))
                                            .map(([module, perms]) => {
                                                const filtered = perms.filter(p =>
                                                    p.label.toLowerCase().includes(search.toLowerCase())
                                                );
                                                if (!filtered.length) return null;
                                                const allModuleSelected = filtered.every(p => selectedPermissions.includes(p.id));

                                                return (
                                                    <div key={module} className="border rounded p-4 shadow-sm">
                                                        <div className="flex items-center mb-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={allModuleSelected}
                                                                onChange={() => toggleModulePermissions(module)}
                                                                className="mr-3 cursor-pointer"
                                                            />
                                                            <h3 className="text-lg font-medium capitalize">{perms[0]?.moduleAbbr || module}</h3>
                                                        </div>
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-48 overflow-auto">
                                                            {filtered.map(p => (
                                                                <label key={p.id} className="flex items-center gap-2 select-none cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedPermissions.includes(p.id)}
                                                                        onChange={() => togglePermission(p.id)}
                                                                    />
                                                                    <span className="text-sm">{p.label}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                    )}
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <Button type="button" variant="outline" onClick={() => setShowPermissionsModal(false)}>Fermer</Button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-start gap-2 mt-4">
                        <Button type="button" variant="primaryOutline" onClick={() => form.reset()}>Annuler</Button>
                        <Button type="submit" variant="primary" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting && <FiLoader className="mr-2 animate-spin" />}
                            Enregistrer
                        </Button>
                    </div>
                </form>
            </Form>
        </SheetFormLayout>
    );
};

export default RoleUsersUpdateLayout;
