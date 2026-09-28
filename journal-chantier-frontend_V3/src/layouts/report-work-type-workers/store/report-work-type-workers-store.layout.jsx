import {useEffect, useState} from "react";

import {useReportWorkTypeWorkersContext} from "../../../context/report-work-type-workers/report-work-type-workers.context.jsx";

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

const ReportWorkTypeWorkersStoreLayout = ({reportWorkTypeId}) => {
    const {workers, addReportWorkTypeWorker} = useReportWorkTypeWorkersContext();

    const [isOpen, setIsOpen] = useState(false);
    const [qualification, setQualification] = useState("");

    const closeSheet = () => setIsOpen(false);

    const formSchema = z.object({
        worker_id: z.number({
            required_error: errorMessages.required(),
            invalid_type_error: errorMessages.required()
        }).positive({message: errorMessages.select('un ouvrier')}),
        type: z.string().optional().nullable(),
        normal_hours: z.number({
            required_error: errorMessages.required(),
            invalid_type_error: errorMessages.required()
        }),
        overtime_hours: z.number({
            required_error: errorMessages.required(),
            invalid_type_error: errorMessages.required()
        }),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            report_work_type_id: reportWorkTypeId,
            worker_id: "",
            type: "",
            normal_hours: 0,
            overtime_hours: 0,
        },
    });

    const {formState: {isSubmitting, errors}} = form;

    const getTypeLabel = (type) => {
        switch (type) {
            case 1:
                return 'Service Normal';
            case 2:
                return 'Travail à la tache';
            case 3:
                return 'Travail à la tache multiple';
            case 4:
                return 'Licencié';
            case 5:
                return 'Absent autorisé';
            case 6:
                return 'Absent non autorisé';
            case 7:
                return 'Malade';
            default:
                return '';
        }
    };


    useEffect(() => {
        if (!isOpen) {
            form.reset();
        }
    }, [isOpen]);

    const onSubmit = async (values) => {
        await addReportWorkTypeWorker(values, form, reportWorkTypeId);

        if (Object.keys(errors).length <= 0) {
            closeSheet();
        }
    };

    return (
        <SheetFormLayout
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Ajouter un pointage d'ouvrier"
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
                        name="worker_id"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>
                                    Ouvrier <LabelRequiredStarComponent/>
                                </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="primaryControl"
                                                role="combobox"
                                            >
                                                {field.value
                                                    ? workers.find(
                                                        (worker) => worker.value === field.value
                                                    )?.label
                                                    : "Sélectionner ouvrier"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[100%] p-0">
                                        <Command>
                                            <CommandInput placeholder="Sélectionner ouvrier"/>
                                            <CommandList>
                                                <CommandEmpty>Aucun ouvrier trouvable.</CommandEmpty>
                                                <CommandGroup>
                                                    {workers.length > 0 && workers.map((worker, index) => (
                                                        <CommandItem
                                                            value={Number(worker.label)}
                                                            key={worker.value}
                                                            onSelect={() => {
                                                                form.setValue("worker_id", worker.value)
                                                                setQualification(worker.resource_name);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    worker.value === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            <div className="flex items-center gap-2 w-full">
                                                            <span className="text-xs font-bold text-gray-500 min-w-[28px]">
                                                                {index + 1}.
                                                            </span>
                                                                <span>
                                                                    {worker.label}
                                                                </span>
                                                            </div>
                                                        </CommandItem> ))}
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
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled
                                        className="text-black text-sm cursor-not-allowed"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="normal_hours"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Heures Normales <LabelRequiredStarComponent/>
                                </FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="Heures Normales"
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
                        name="overtime_hours"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Heures Supplémentaires <LabelRequiredStarComponent/>
                                </FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="Heures Supplémentaires"
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

export default ReportWorkTypeWorkersStoreLayout;