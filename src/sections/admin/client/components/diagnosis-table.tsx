'use client';

// schemas
import { type IDiagnosisData } from "src/core/schemas";
// @mui
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
// components
import Scrollbar from "src/components/scrollbar";
import NoResultsCard from "src/components/no-results-card";
import { TableHeadCustom, TableNoData } from "src/components/table";
//
import DiagnosisTableRow from "./diagnosis-table-row";

// ----------------------------------------------------------------------

interface DiagnosisTableProps {
    diagnoses: IDiagnosisData[];
    onRemove: (index: number) => void;
    onEdit: (index: number) => void;
}

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'date', label: 'Fecha', align: 'center' },
    //
    { id: 'leftSphere', label: 'OI Esfera', align: 'center' },
    { id: 'leftCylinder', label: 'OI Cilindro', align: 'center' },
    { id: 'leftAxis', label: 'OI Eje', align: 'center' },
    { id: 'di', label: 'DI', align: 'center' },
    //
    { id: 'rightSphere', label: 'OD Esfera', align: 'center' },
    { id: 'rightCylinder', label: 'OD Cilindro', align: 'center' },
    { id: 'rightAxis', label: 'OD Eje', align: 'center' },
    { id: 'add', label: 'ADD', align: 'center' },
    //
    { id: 'addition', label: 'Adición', align: 'center' },
    { id: 'notes', label: 'Notas', align: 'center' },
    //
    { id: 'actions', label: 'Operaciones', align: 'center', width: 20 },
];

// ----------------------------------------------------------------------

export default function DiagnosisTable({ diagnoses, onRemove, onEdit }: DiagnosisTableProps) {
    const shouldShowNoResults = diagnoses.length === 0;

    return (
        <>
            {!shouldShowNoResults ? (
                <TableContainer component={Paper}>
                    <Scrollbar>
                        <Table size='small'>
                            <TableHeadCustom headLabel={TABLE_HEAD} />

                            <TableBody>
                                {diagnoses.map((diagnose, index) => (
                                    <DiagnosisTableRow
                                        key={diagnose.id ?? index}
                                        row={diagnose}
                                        onRemove={() => onRemove(index)}
                                        onEdit={() => onEdit(index)}
                                    />
                                ))}

                                <TableNoData notFound={diagnoses.length === 0} />
                            </TableBody>
                        </Table>
                    </Scrollbar>
                </TableContainer>
            ) : (
                <NoResultsCard description="No se ha encontrado ningún diagnóstico asociado al cliente." />
            )}
        </>
    )
}
