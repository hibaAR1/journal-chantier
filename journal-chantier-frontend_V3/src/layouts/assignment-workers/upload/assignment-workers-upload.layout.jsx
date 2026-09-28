'use client';

import { useRef } from 'react';

import {useAssignmentWorkersContext} from "../../../context/assignment-workers/assignment-workers.context.jsx";
import {useLoadingContext} from "../../../context/loading/loading.context.jsx";

import { Button } from '@/components/ui/button';

import {toast} from "../../../hooks/use-toast.js";

import {FiLoader, FiUpload} from "react-icons/fi";

const AssignmentWorkersUpload = ({assignmentId}) => {
    const {uploadAssignmentWorkers} = useAssignmentWorkersContext();
    const {importLoading} = useLoadingContext();

    const inputRef = useRef(null);

    const handleButtonClick = () => {
        inputRef.current?.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (file && file.name.endsWith('.xlsx')) {
            console.log('Valid XLSX file selected!');

            const formData = new FormData();
            formData.append('file', file);

            await uploadAssignmentWorkers(formData, {
                setError: (field, error) => {
                    console.error(`Error on ${field}:`, error.message);
                    toast({
                        variant: 'danger',
                        title: 'Erreur d’importation',
                        description: "Le fichier n’a pas pu être importé. Veuillez vérifier le",
                    });
                },
                reset: () => {
                    inputRef.current.value = '';
                },
            }, assignmentId);
        } else {
            toast({
                variant: 'danger',
                title: 'Format invalide',
                description: 'Veuillez sélectionner un fichier .xlsx valide.',
            });
        }
    };

    return (
        <>
            <Button
                variant="primaryOutline"
                className="justify-start gap-2 m-0"
                onClick={handleButtonClick}
            >
                {
                    importLoading
                        ? <FiLoader className="me-2 animate-spin"/>
                        : <FiUpload/>
                }

                <span className="hidden md:inline">Import</span>
            </Button>

            {/* Hidden file input */}
            <input
                ref={inputRef}
                type="file"
                accept=".xlsx"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
        </>
    );
};

export default AssignmentWorkersUpload;