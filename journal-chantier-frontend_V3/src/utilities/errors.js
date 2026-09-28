export const errorMessages = {
    min: (number) => `Le texte doit avoir au moins ${number} caractères !`,
    max: (number) => `Le texte ne doit pas dépasser ${number} caractères !`,
    minDate: (date = '3 jours') => `La date ne peut pas être antérieure à ${date}.`,
    maxDate: (date = 'aujourd\'hui') => `La date ne peut pas être postérieure à ${date}.`,
    select: (field) => `Sélectionner ${field} !`,
    selectDate: () => `Sélectionner une date !`,
    required: () => `Le champ est obligatoir !`,
    attachment: () => `Le fichier doit être PDF, PNG ou JPG !`,
    email: () => `Le texte doit être une adresse email valide !`,
    dateMustBeHigh: (fieldHigh, fieldLess) => `La ${fieldHigh} doit être ultérieure à la ${fieldLess}  !`,
    listMustBeFilled: (items) => {
        let str = '(';

        items.forEach((item, index) => {
            if (index === 0) {
                str = str + item;
            } else if (index === items.length - 1 ) {
                str = str + ` ou ${item})`;
            } else {
                str = str + `, ${item}`;
            }
        });

        return `Au moins un champ, ${str} doit être rempli!`
    },
}

export const error = () => {
    // throw { message: "500 Server Error", code: 500 };
};
