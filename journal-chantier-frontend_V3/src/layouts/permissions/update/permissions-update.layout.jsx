import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { usePermissionsContext } from "../../../context/permissions/permissions.context.jsx";

import { Button } from "../../../components/ui/button.jsx";
import { Input } from "../../../components/ui/input.jsx";
import { FiEdit, FiLoader } from "react-icons/fi";

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

const PermissionsUpdateLayout = ({ permission }) => {
    const { updatePermission } = usePermissionsContext();
    const [isOpen, setIsOpen] = useState(false);

    const formSchema = z.object({
        name: z.string().min(2).max(150),
        abbreviation: z.string().min(2).max(50),
        guard_name: z.string().min(2).max(50),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: permission.name,
            abbreviation: permission.abbreviation,
            guard_name: permission.guard_name || "web",
        },
    });

    useEffect(() => {
        form.reset({
            name: permission.name,
            abbreviation: permission.abbreviation,
            guard_name: permission.guard_name || "web",
        });
    }, [permission]);

    const onSubmit = async (values) => {
        await updatePermission(permission.id, values, form);
        setIsOpen(false);
    };

    return (
        <>
            <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
                <FiEdit />
            </Button>

            <SheetFormLayout
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title={`Modifier la permission: ${permission.name}`}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Nom <LabelRequiredStarComponent />
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Nom complet (ex: users.create)" />
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
                                        <Input {...field} placeholder="Abréviation (ex: create)" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="guard_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Guard Name <LabelRequiredStarComponent />
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Guard name (ex: web)" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="primaryOutline" onClick={() => setIsOpen(false)}>
                                Annuler
                            </Button>
                            <Button type="submit" variant="primary">
                                Enregistrer
                            </Button>
                        </div>
                    </form>
                </Form>
            </SheetFormLayout>
        </>
    );
};

export default PermissionsUpdateLayout;
