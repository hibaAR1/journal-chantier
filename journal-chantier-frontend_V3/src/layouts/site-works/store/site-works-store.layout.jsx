import {useEffect, useState} from "react";

import {useWorksContext} from "../../../context/works/works.context.jsx";

import {useForm} from "react-hook-form";

import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

import {errorMessages} from "../../../utilities/errors.js";

import SheetFormLayout from "../../sheet-form/sheet-form.layout.jsx";

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../../components/ui/form.jsx";
import {Input} from "../../../components/ui/input.jsx";

import {Button} from "../../../components/ui/button.jsx";

import LabelRequiredStarComponent from "../../../components/form/label-required-star/label-required-star.component.jsx";

import {FiLoader, FiPlusCircle} from "react-icons/fi";

const SiteWorksStoreLayout = ({ siteId }) => {
    const { addWork } = useWorksContext();

    const [isOpen, setIsOpen] = useState(false);

    const closeSheet = () => setIsOpen(false);

    const formSchema = z.object({
        name: z.string()
            .min(2, {message: errorMessages.min(2)})
            .max(150, {message: errorMessages.max(150)})
            .trim(),
        // unit: z.string()
        //     .min(2, {message: errorMessages.min(2)})
        //     .max(50, {message: errorMessages.max(50)})
        //     .trim(),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            // unit: "",
        },
    });

    const {formState: {isSubmitting, errors}} = form;

    useEffect(() => {
        if (!isOpen) {
            form.reset();
        }
    }, [isOpen]);

    const onSubmit = async values => {
        await addWork(values, form, siteId);

        if (Object.keys(errors).length <= 0) {
            closeSheet();
        }
    };

    return (
        <SheetFormLayout
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Ajouter un nouveau travail"
            btn={
                <Button variant="primaryOutline" className="justify-start gap-2">
                    <FiPlusCircle/>
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
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Nom <LabelRequiredStarComponent />
                                </FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="Nom"
                                        {...field}
                                        className="text-black text-sm"
                                    />
                                </FormControl>

                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    {/*<FormField*/}
                    {/*    control={form.control}*/}
                    {/*    name="unit"*/}
                    {/*    render={({field}) => (*/}
                    {/*        <FormItem>*/}
                    {/*            <FormLabel>*/}
                    {/*                Unité <LabelRequiredStarComponent />*/}
                    {/*            </FormLabel>*/}

                    {/*            <FormControl>*/}
                    {/*                <Input*/}
                    {/*                    placeholder="Unité"*/}
                    {/*                    {...field}*/}
                    {/*                    className="text-black text-sm"*/}
                    {/*                />*/}
                    {/*            </FormControl>*/}

                    {/*            <FormMessage/>*/}
                    {/*        </FormItem>*/}
                    {/*    )}*/}
                    {/*/>*/}

                    <div className="flex justify-start gap-2">
                        <Button onClick={() => form.reset()} type='button' variant="primaryOutline">
                            Annuler
                        </Button>
                        <Button disabled={isSubmitting} type="submit" variant="primary"
                                className="hover:scale-105 transition-all">
                            {isSubmitting && <FiLoader className="me-2 animate-spin"/>}
                            Enregistrer
                        </Button>
                    </div>
                </form>
            </Form>
        </SheetFormLayout>
    )
};

export default SiteWorksStoreLayout;
