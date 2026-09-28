import {useEffect, useState} from "react";

import {useWorkTypesContext} from "../../../context/work-types/work-types.context.jsx";

import {useForm} from "react-hook-form";

import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

import {errorMessages} from "../../../utilities/errors.js";

import SheetFormLayout from "../../sheet-form/sheet-form.layout.jsx";

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../../components/ui/form.jsx";
import {Input} from "../../../components/ui/input.jsx";

import {Button} from "../../../components/ui/button.jsx";

import LabelRequiredStarComponent from "../../../components/form/label-required-star/label-required-star.component.jsx";

import {FiEdit2, FiLoader} from "react-icons/fi";
import {Popover, PopoverContent, PopoverTrigger} from "../../../components/ui/popover.jsx";
import {cn} from "../../../lib/utils.js";
import {Check, ChevronsUpDown} from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "../../../components/ui/command.jsx";

const SiteWorkTypesUpdateLayout = ({workType}) => {
    const {works, updateWorkType} = useWorkTypesContext();

    const [isOpen, setIsOpen] = useState(false);

    const closeSheet = () => setIsOpen(false);

    const formSchema = z.object({
        work_id: z.number({
            required_error: errorMessages.required(),
            invalid_type_error: errorMessages.required()
        }).positive({message: errorMessages.select('un travail')}),
        name: z.string()
            .min(2, {message: errorMessages.min(2)})
            .max(150, {message: errorMessages.max(150)})
            .trim(),
        unit: z.string()
            .max(50, {message: errorMessages.max(50)})
            .optional(),
        t_u: z.preprocess(
            (val) => {
                if (val === "" || val === null || val === undefined) return undefined;
                return Number(val);
            },
            z.number().nonnegative({message: errorMessages.min(0)}).optional()
        ).optional(),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            work_id: workType.work_id ?? '',
            name: workType.name ?? '',
            unit: workType.unit ?? '',
            t_u: workType.t_u ?? '',
        },
    });

    const {formState: {isSubmitting, errors}} = form;

    useEffect(() => {
        if (!isOpen) {
            form.reset();
        }
    }, [isOpen]);

    const onSubmit = async (values) => {
        await updateWorkType(workType.id, values, form);

        if (Object.keys(errors).length <= 0) {
            closeSheet();
        }
    };

    return (
        <SheetFormLayout
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Modifier la tâche"
            btn={
                <Button variant="warningOutline" className="h-6 px-1">
                    <FiEdit2/>
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
                        name="work_id"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Catégorie <LabelRequiredStarComponent /></FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="primaryControl"
                                                role="combobox"
                                            >
                                                {field.value
                                                    ? works.find(
                                                        (work) => work.value === field.value
                                                    )?.label
                                                    : "Sélectionner travail"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[100%] p-0">
                                        <Command>
                                            <CommandInput placeholder="Sélectionner travail"/>
                                            <CommandList>
                                                <CommandEmpty>Aucune travail trouvable.</CommandEmpty>
                                                <CommandGroup>
                                                    {works.length > 0 && works.map((work) => (
                                                        <CommandItem
                                                            value={Number(work.label)}
                                                            key={work.value}
                                                            onSelect={() => {
                                                                form.setValue("work_id", work.value)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    work.value === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {work.label}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

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

                    <FormField
                        control={form.control}
                        name="unit"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Unité <LabelRequiredStarComponent />
                                </FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="Ex : m², m³, kg..."
                                        {...field}
                                        className="text-black text-sm"
                                    />
                                </FormControl>

                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="t_u"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Temps unitaire référentiel (global)
                                </FormLabel>

                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.001"
                                        placeholder="Ex: 2.5"
                                        {...field}
                                        // petite sécurité : on force string pour l'input
                                        value={field.value ?? ""}
                                        className="text-black text-sm"
                                    />
                                </FormControl>

                                <FormMessage/>
                            </FormItem>
                        )}
                    />

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

export default SiteWorkTypesUpdateLayout;
