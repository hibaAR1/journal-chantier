import {useEffect, useState} from "react";

import {useReportWorkTypesContext} from "../../../context/report-work-types/report-work-types.context.jsx";

import {useForm} from "react-hook-form";

import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

import {errorMessages} from "../../../utilities/errors.js";

import SheetFormLayout from "../../sheet-form/sheet-form.layout.jsx";

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../../components/ui/form.jsx";
import {Input} from "../../../components/ui/input.jsx";
import {Textarea} from "../../../components/ui/textarea.jsx";

import {Button} from "../../../components/ui/button.jsx";

import LabelRequiredStarComponent from "../../../components/form/label-required-star/label-required-star.component.jsx";

import {FiLoader, FiPlusCircle} from "react-icons/fi";
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

const ReportWorkTypesStoreLayout = ({reportId}) => {
    const {workTypes, siteLocations, addReportWorkType} = useReportWorkTypesContext();

    const [isOpen, setIsOpen] = useState(false);

    const closeSheet = () => setIsOpen(false);

    const formSchema = z.object({
        work_type_id: z.number({
            required_error: errorMessages.required(),
            invalid_type_error: errorMessages.required()
        }).positive({message: errorMessages.select('une tâche')}),
        site_location_id: z.number({
            required_error: errorMessages.required(),
            invalid_type_error: errorMessages.required()
        }).positive({message: errorMessages.select('un emplacement chantier')}),
        stat_work: z.number({
            required_error: errorMessages.required(),
            invalid_type_error: errorMessages.required()
        }),
        quantity_completed: z.number({
            required_error: errorMessages.required(),
            invalid_type_error: errorMessages.required()
        }),
        observations: z.string().optional(),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            report_id: reportId,
            work_type_id: "",
            site_location_id: "",
            stat_work: 100,
            quantity_completed: 0,
            observations: "",
        },
    });

    const {formState: {isSubmitting, errors}} = form;

    const sortedWorkTypes = [...workTypes].sort((a, b) => {
        // 1) chantier avant global
        if (a.scope !== b.scope) {
            return a.scope === "C" ? -1 : 1;   // C en premier, puis G
        }

        // 2) à scope égal, tri alphabétique
        return a.label.localeCompare(b.label);
    });



    useEffect(() => {
        if (!isOpen) {
            form.reset();
        }
    }, [isOpen]);

    const onSubmit = async (values) => {
        await addReportWorkType(values, form, reportId);

        if (Object.keys(errors).length <= 0) {
            closeSheet();
        }
    };

    return (
        <SheetFormLayout
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Ajouter un journal de travail"
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
                        name="work_type_id"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>
                                    Tâche <LabelRequiredStarComponent/>
                                </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="primaryControl"
                                                role="combobox"
                                            >
                                                {field.value
                                                    ? (() => {
                                                        const selected = workTypes.find(
                                                            (wt) => wt.value === field.value
                                                        );
                                                        if (!selected) return "Sélectionner tâche";

                                                        const scopeLabel = selected.scope === "G"
                                                            ? "Global"
                                                            : "Chantier";

                                                        return `[${scopeLabel}] ${selected.label}`;
                                                    })()
                                                    : "Sélectionner tâche"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[100%] p-0">
                                        <Command>
                                            <CommandInput placeholder="Sélectionner tâche"/>
                                            <CommandList>
                                                <CommandEmpty>Aucune tâche trouvable.</CommandEmpty>
                                                <CommandGroup>
                                                    {sortedWorkTypes.length > 0 && sortedWorkTypes.map((workType) => (
                                                        <CommandItem
                                                            value={Number(workType.label)}
                                                            key={workType.value}
                                                            onSelect={() => {
                                                                form.setValue("work_type_id", workType.value)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    workType.value === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {/* {workType.label} */}
                                                             <div className="flex flex-col">
                                                                <span
                                                                    className={cn(
                                                                        "text-sm",
                                                                        workType.scope === "G"
                                                                            ? "text-blue-600"
                                                                            : "text-emerald-600"
                                                                    )}
                                                                >
                                                                    [{workType.scope === "G" ? "Global" : "Chantier"}]{" "}
                                                                    {workType.label}
                                                                </span>

                                                                {workType.t_u !== null &&
                                                                    workType.t_u !== undefined && (
                                                                        <span className="text-xs text-gray-500">
                                                                        T.U. réf : {workType.t_u.toString().padStart(3, '0')}
                                                                    </span>
                                                                    )}
                                                            </div>
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
                        name="site_location_id"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>
                                    Emplacement chantier <LabelRequiredStarComponent/>
                                </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="primaryControl"
                                                role="combobox"
                                            >
                                                {field.value
                                                    ? siteLocations.find(
                                                        (siteLocation) => siteLocation.value === field.value
                                                    )?.label
                                                    : "Sélectionner emplacement chantier"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[100%] p-0">
                                        <Command>
                                            <CommandInput placeholder="Sélectionner emplacement chantier"/>
                                            <CommandList>
                                                <CommandEmpty>Aucun emplacement chantier trouvable.</CommandEmpty>
                                                <CommandGroup>
                                                    {siteLocations.length > 0 && siteLocations.map((siteLocation) => (
                                                        <CommandItem
                                                            value={Number(siteLocation.label)}
                                                            key={siteLocation.value}
                                                            onSelect={() => {
                                                                form.setValue("site_location_id", siteLocation.value)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    siteLocation.value === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {siteLocation.label}
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
                        name="stat_work"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Etat Travail % <LabelRequiredStarComponent/>
                                </FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="Etat Travail %"
                                        type="number"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        className="text-black text-sm"
                                    />
                                </FormControl>

                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="quantity_completed"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                        Quantité Réalisé <LabelRequiredStarComponent/>
                                </FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="Quantité Réalisé"
                                        type="number"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        className="text-black text-sm"
                                    />
                                </FormControl>

                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="observations"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Observation
                                </FormLabel>

                                <FormControl>
                                    <Textarea
                                        placeholder="Observation"
                                        {...field}
                                        className="text-black text-sm resize-none"
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

export default ReportWorkTypesStoreLayout;
