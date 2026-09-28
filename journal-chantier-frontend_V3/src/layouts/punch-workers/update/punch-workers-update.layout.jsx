import {useEffect, useState} from "react";

import {usePunchesContext} from "../../../context/punches/punches.context.jsx";

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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../../components/ui/select.jsx";
import {usePunchWorkersContext} from "../../../context/punch-workers/punch-workers.context.jsx";

const PunchWorkersUpdateLayout = ({punchWorker, punchId}) => {
    const {workers, updatePunchWorker} = usePunchWorkersContext();

    const [isOpen, setIsOpen] = useState(false);

    const closeSheet = () => setIsOpen(false);

    const formSchema = z.object({
        worker_id: z.number({
            required_error: errorMessages.required(),
            invalid_type_error: errorMessages.required()
        }).positive({message: errorMessages.select('un ouvrier')}),
        type: z.enum(["1", "2", "3", "4", "5", "6", "7"], {
            errorMap: () => ({message: errorMessages.select('un type')}),
        }),
        natural_hours: z.number({
            required_error: errorMessages.required(),
            invalid_type_error: errorMessages.required()
        }),
        overtime_hours: z.number({
            required_error: errorMessages.required(),
            invalid_type_error: errorMessages.required()
        }),
        direct: z.boolean({
            required_error: errorMessages.required(),
            invalid_type_error: errorMessages.required()
        }),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            punch_id: punchId,
            worker_id: punchWorker.worker_id ?? '',
            type: punchWorker.type ? `${punchWorker.type}` : '',
            natural_hours: punchWorker.natural_hours ?? '',
            overtime_hours: punchWorker.overtime_hours ?? '',
            direct: punchWorker.direct,
        },
    });

    const {formState: {isSubmitting, errors}} = form;

    useEffect(() => {
        if (!isOpen) {
            form.reset();
        }
    }, [isOpen]);

    const onSubmit = async (values) => {
        await updatePunchWorker(punchWorker.id, values, form, punchId);

        if (Object.keys(errors).length <= 0) {
            closeSheet();
        }
    };

    return (
        <SheetFormLayout
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Modifier le pointage"
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
                        name="worker_id"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>
                                    Ouvrier <LabelRequiredStarComponent />
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
                                                    {workers.length > 0 && workers.map((worker) => (
                                                        <CommandItem
                                                            value={Number(worker.label)}
                                                            key={worker.value}
                                                            onSelect={() => {
                                                                form.setValue("worker_id", worker.value)
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
                                                            {worker.registration_number} - {worker.label}
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
                        name="type"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Type <LabelRequiredStarComponent/>
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger variant="primary">
                                            <SelectValue placeholder="Sélectionner"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="1">Service Normal</SelectItem>
                                        <SelectItem value="2">Travail à la tache</SelectItem>
                                        <SelectItem value="3">Travail à la tache multiple</SelectItem>
                                        <SelectItem value="4">Licencié</SelectItem>
                                        <SelectItem value="5">Absent autorisé</SelectItem>
                                        <SelectItem value="6">Absent non autorisé</SelectItem>
                                        <SelectItem value="7">Malade</SelectItem>
                                    </SelectContent>
                                </Select>

                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="direct"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Direct/Indirect <LabelRequiredStarComponent/>
                                </FormLabel>

                                <Select
                                    onValueChange={(value) =>
                                        field.onChange(
                                            value === "true"
                                                ? true
                                                : value === "false"
                                                    ? false
                                                    : null
                                        )
                                    }
                                    defaultValue={
                                        field.value === true
                                            ? "true"
                                            : field.value === false
                                                ? "false"
                                                : "null"
                                    }
                                >
                                    <FormControl>
                                        <SelectTrigger variant="primary">
                                            <SelectValue placeholder="Sélectionner" />
                                        </SelectTrigger>
                                    </FormControl>

                                    <SelectContent>
                                        <SelectItem value="null"> - </SelectItem>
                                        <SelectItem value="true">Direct</SelectItem>
                                        <SelectItem value="false">Indirect</SelectItem>

                                    </SelectContent>
                                </Select>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="natural_hours"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Heures Normales <LabelRequiredStarComponent/>
                                </FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="Heures Normales"
                                        type="natural_hours"
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
                                        type="overtime_hours"
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

export default PunchWorkersUpdateLayout;
