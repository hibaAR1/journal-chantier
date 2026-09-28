import {useEffect, useState} from "react";

import SheetFormLayout from "../sheet-form/sheet-form.layout.jsx";
import {Form} from "../../components/ui/form.jsx";
import {Button} from "../../components/ui/button.jsx";
import {FiLoader} from "react-icons/fi";
const FormLayout = ({
                        title,
                        submitFn,
                        form,
                        openBtn,
                        children
                    }) => {
    const [isOpen, setIsOpen] = useState(false);

    const closeSheet = () => setIsOpen(false);

    const {formState: {isSubmitting, errors}} = form;

    useEffect(() => {
        if (!isOpen) {
            form.reset();
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        await submitFn();

        if (Object.keys(errors).length <= 0) {
            closeSheet();
        }
    };

    return (
        <SheetFormLayout
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={title}
            btn={openBtn}
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="flex flex-col gap-5"
                >
                    {children}

                    <div className="flex justify-start gap-2 mb-2">
                        <Button onClick={() => form.reset()} type='button' variant="blackOutline">
                            Annuler
                        </Button>
                        <Button disabled={isSubmitting} type="submit" variant="black"
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

export default FormLayout;
