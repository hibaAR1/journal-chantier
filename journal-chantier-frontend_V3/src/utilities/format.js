export const formatNumber = number => {
    return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(number);
};

export const formatTime = str => {
    const [hours, minutes] = str.split(':');

    return `${hours}:${minutes}`;
}
