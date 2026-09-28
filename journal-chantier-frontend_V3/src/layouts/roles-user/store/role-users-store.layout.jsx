import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useRolesContext } from "../../../context/role-users/role-users.context.jsx";
import PermissionsApis from "../../../apis/permissions.apis.jsx";

import { Button } from "../../../components/ui/button.jsx";
import { Input } from "../../../components/ui/input.jsx";
import { FiPlusCircle, FiLoader } from "react-icons/fi";

import LabelRequiredStarComponent from "../../../components/form/label-required-star/label-required-star.component.jsx";
import SheetFormLayout from "../../sheet-form/sheet-form.layout.jsx";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../../components/ui/form.jsx";

const RolesStoreLayout = () => {
    const { addRole } = useRolesContext();
    const [isOpen, setIsOpen] = useState(false);
    const [showPermissionsModal, setShowPermissionsModal] = useState(false);
    const [permissionsByModule, setPermissionsByModule] = useState({});
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [loadingPermissions, setLoadingPermissions] = useState(true);
    const [search, setSearch] = useState("");

    const formSchema = z.object({
        name: z.string().min(2).max(150),
        abbreviation: z.string().min(2).max(50),
        permissions: z.array(z.number()).optional(),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            abbreviation: "",
            guard_name: "web",
            permissions: [],
        },
    });

    const closeSheet = () => {
        setIsOpen(false);
        setShowPermissionsModal(false);
        setSelectedPermissions([]);
        form.reset();
    };

    // Récupérer toutes les permissions
    useEffect(() => {
        async function fetchPermissions() {
            setLoadingPermissions(true);
            try {
                const { data } = await PermissionsApis.getPermissions();
                const grouped = {};
                data.forEach((permission) => {
                    const module = permission.module_name || "Autres";
                    if (!grouped[module]) grouped[module] = [];
                    grouped[module].push({
                        id: permission.id,
                        name: permission.name,
                        label: permission.abbreviation,
                        moduleAbbr: permission.module_abbreviation,
                    });
                });
                setPermissionsByModule(grouped);
            } catch (err) {
                console.error("Erreur fetch permissions", err);
            } finally {
                setLoadingPermissions(false);
            }
        }
        fetchPermissions();
    }, []);

    // Reset permissions quand le formulaire se ferme
    useEffect(() => {
        if (!isOpen) {
            setSelectedPermissions([]);
            form.reset();
        }
    }, [isOpen]);

    // Synchroniser les permissions sélectionnées dans le form
    useEffect(() => {
        form.setValue("permissions", selectedPermissions);
    }, [selectedPermissions, form]);

    // Toggle permission individuelle
    const togglePermission = (permId) => {
        setSelectedPermissions((prev) =>
            prev.includes(permId)
                ? prev.filter((p) => p !== permId)
                : [...prev, permId]
        );
    };

    // Toggle toutes les permissions d'un module
    const toggleModulePermissions = (module) => {
        const permsOfModule = permissionsByModule[module].map(p => p.id);
        const allSelected = permsOfModule.every(id => selectedPermissions.includes(id));

        if (allSelected) {
            setSelectedPermissions(prev => prev.filter(id => !permsOfModule.includes(id)));
        } else {
            setSelectedPermissions(prev => [...new Set([...prev, ...permsOfModule])]);
        }
    };

    // Toggle toutes les permissions de tous les modules
    const toggleAllPermissions = () => {
        const allIds = Object.values(permissionsByModule).flat().map(p => p.id);
        const allSelected = allIds.every(id => selectedPermissions.includes(id));

        if (allSelected) {
            setSelectedPermissions([]);
        } else {
            setSelectedPermissions(allIds);
        }
    };

    const isAllChecked = () => {
        const allIds = Object.values(permissionsByModule).flat().map(p => p.id);
        return allIds.every(id => selectedPermissions.includes(id));
    };

    const onSubmit = async (values) => {
        try {
            const payload = {
                name: values.name,
                abbreviation: values.abbreviation,
                guard_name: "web",
                permissions: selectedPermissions, // IDs
            };
            console.log("Payload envoyé :", payload);
            await addRole(payload, form);
            closeSheet();
        } catch (error) {
            console.error("Erreur lors de l'enregistrement du rôle :", error);
        }
    };

    return (
        <SheetFormLayout
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Ajouter un rôle"
            btn={
                <Button variant="primaryOutline" className="justify-start gap-2">
                    <FiPlusCircle />
                    <span className="hidden md:inline">Ajouter</span>
                </Button>
            }
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-5"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Nom <LabelRequiredStarComponent />
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Nom du rôle" />
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
                                <FormLabel>
                                    Abréviation <LabelRequiredStarComponent />
                                </FormLabel>
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
                                    <h2 className="text-xl font-semibold">Liste des permissions</h2>
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
                                                const filteredPerms = perms.filter((p) =>
                                                    p.label.toLowerCase().includes(search.toLowerCase())
                                                );
                                                if (filteredPerms.length === 0) return null;

                                                const permsOfModule = filteredPerms.map(p => p.id);
                                                const allModuleSelected = permsOfModule.every(id =>
                                                    selectedPermissions.includes(id)
                                                );

                                                return (
                                                    <div key={module} className="border rounded p-4 shadow-sm">
                                                        <div className="flex items-center mb-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={allModuleSelected}
                                                                onChange={() => toggleModulePermissions(module)}
                                                                className="mr-3 cursor-pointer"
                                                            />
                                                            <h3 className="text-lg font-medium capitalize">
                                                                {perms[0]?.moduleAbbr || module}
                                                            </h3>

                                                            <div className="ml-auto flex gap-2">
                                                                <button
                                                                    type="button"
                                                                    className="text-xs text-blue-600 underline hover:text-blue-800"
                                                                    onClick={() =>
                                                                        setSelectedPermissions((prev) => [
                                                                            ...new Set([...prev, ...permsOfModule]),
                                                                        ])
                                                                    }
                                                                >
                                                                    Tout cocher
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="text-xs text-red-600 underline hover:text-red-800"
                                                                    onClick={() =>
                                                                        setSelectedPermissions((prev) =>
                                                                            prev.filter((id) => !permsOfModule.includes(id))
                                                                        )
                                                                    }
                                                                >
                                                                    Tout décocher
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-48 overflow-auto">
                                                            {filteredPerms.map((perm) => (
                                                                <label
                                                                    key={perm.id}
                                                                    className="flex items-center gap-2 select-none cursor-pointer"
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedPermissions.includes(perm.id)}
                                                                        onChange={() => togglePermission(perm.id)}
                                                                        className="cursor-pointer"
                                                                    />
                                                                    <span className="text-sm">{perm.label}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                    )}
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowPermissionsModal(false)}
                                    >
                                        Fermer
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-start gap-2 mt-4">
                        <Button type="button" variant="primaryOutline" onClick={() => form.reset()}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={form.formState.isSubmitting} variant="primary">
                            {form.formState.isSubmitting && (
                                <FiLoader className="mr-2 animate-spin" />
                            )}
                            Enregistrer
                        </Button>
                    </div>
                </form>
            </Form>
        </SheetFormLayout>
    );
};

export default RolesStoreLayout;
