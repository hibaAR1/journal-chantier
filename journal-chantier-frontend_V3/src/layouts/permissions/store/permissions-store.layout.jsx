import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { usePermissionsContext } from "../../../context/permissions/permissions.context.jsx";

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

const PermissionsStoreLayout = () => {
    const { addPermission } = usePermissionsContext();
    const [isOpen, setIsOpen] = useState(false);

    const formSchema = z.object({
        name: z.string().min(2).max(150),
        abbreviation: z.string().min(2).max(50),
        guard_name: z.string().min(2).max(50),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            abbreviation: "",
            guard_name: "web",
        },
    });

    const onSubmit = async (values) => {
        await addPermission(values, form);
        setIsOpen(false);
    };

    return (
        <SheetFormLayout
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Ajouter une permission"
            btn={
                <Button variant="primaryOutline" className="justify-start gap-2">
                    <FiPlusCircle />
                    <span className="hidden md:inline">Ajouter</span>
                </Button>
            }
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

                    <div className="flex justify-start gap-2 mt-4">
                        <Button type="button" variant="primaryOutline" onClick={() => form.reset()}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={form.formState.isSubmitting} variant="primary">
                            {form.formState.isSubmitting && <FiLoader className="me-2 animate-spin" />}
                            Enregistrer
                        </Button>
                    </div>
                </form>
            </Form>
        </SheetFormLayout>
    );
};

export default PermissionsStoreLayout;
