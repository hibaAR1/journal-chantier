import {useEffect, useState} from "react";

import {useAssignmentWorkersContext} from "../../../context/assignment-workers/assignment-workers.context.jsx";

import {useForm} from "react-hook-form";

import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

import {cn} from "../../../lib/utils.js";

import {errorMessages} from "../../../utilities/errors.js";

import SheetFormLayout from "../../sheet-form/sheet-form.layout.jsx";

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../../components/ui/form.jsx";

import {Button} from "../../../components/ui/button.jsx";
import {Popover, PopoverContent, PopoverTrigger} from "../../../components/ui/popover.jsx";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "../../../components/ui/command.jsx";

import LabelRequiredStarComponent from "../../../components/form/label-required-star/label-required-star.component.jsx";

import {Check, ChevronsUpDown} from "lucide-react";
import {FiEdit2, FiLoader} from "react-icons/fi";

const AssignmentWorkersUpdateLayout = ({assignmentWorker, assignmentId}) => {
    const {workers, updateAssignmentWorker} = useAssignmentWorkersContext();

    const [isOpen, setIsOpen] = useState(false);

    const closeSheet = () => setIsOpen(false);

    const formSchema = z.object({
        worker_id: z.number({
            required_error: errorMessages.required(),
            invalid_type_error: errorMessages.required()
        }).positive({message: errorMessages.select('un ouvrier')}),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            assignment_id: assignmentId,
            worker_id: assignmentWorker.worker_id ?? '',
        },
    });

    const {formState: {isSubmitting, errors}} = form;

    useEffect(() => {
        if (!isOpen) {
            form.reset();
        }
    }, [isOpen]);

    const onSubmit = async (values) => {
        await updateAssignmentWorker(assignmentWorker.id, values, form, assignmentId);

        if (Object.keys(errors).length <= 0) {
            closeSheet();
        }
    };

    return (
        <SheetFormLayout
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Modifier l'affectation"
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
                                                            {worker.label}
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

export default AssignmentWorkersUpdateLayout;
