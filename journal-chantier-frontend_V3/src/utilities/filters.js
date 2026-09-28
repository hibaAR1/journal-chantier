export const numberRangeFilterFn = (row, columnId, filterValue) => {
    const min = filterValue[0] !== undefined ? filterValue[0] : -Infinity;
    const max = filterValue[1] !== undefined ? filterValue[1] : Infinity;
    const cellValue = row.getValue(columnId);
    return cellValue >= min && cellValue <= max;
};

export const selectIncludesFilterFn = (row, columnId, filterValue) => {
    return filterValue !== '' && filterValue.includes(row.getValue(columnId));
};

// Date Range Filter Logic
export const dateRangeFilterFn = (row, columnId, filterValue) => {
    const [start, end] = filterValue;
    const cellValue = new Date(row.getValue(columnId)); // Assuming your data contains valid date strings

    const startDate = start ? new Date(start) : new Date(-8640000000000000); // -Infinity date
    const endDate = end ? new Date(end) : new Date(8640000000000000); // Infinity date

    if (end)  endDate.setHours(23, 59, 59, 999); // Set end date to end of the day

    return cellValue >= startDate && cellValue <= endDate;
};
