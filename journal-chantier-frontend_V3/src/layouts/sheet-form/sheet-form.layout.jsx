import {
    Sheet, SheetContent, SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "../../components/ui/sheet.jsx";

const SheetFormLayout = ({side = 'right', btn, title, children, setIsOpen, isOpen}) => {
    return (
        <Sheet key={side} className='font-dax' open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                {btn}
            </SheetTrigger>
            <SheetContent
                side={side}
                closeIcon='show'
                className='sm:w-[100%] w-[330px] px-3 overflow-y-scroll'
            >
                <SheetHeader>
                    <SheetTitle className="py-2 text-left text-primary-600 font-bold text-[20px]">
                        {title}
                    </SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>

                {children}

            </SheetContent>
        </Sheet>
    )
};

export default SheetFormLayout;
