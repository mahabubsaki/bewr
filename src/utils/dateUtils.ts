export const getCurrentDateGerman = () => {
    const months = [
        "Januar", "Februar", "März", "April", "Mai", "Juni",
        "Juli", "August", "September", "Oktober", "November", "Dezember"
    ];
    const now = new Date();
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    return `${day}. ${month} ${year}`;
};

export const formatFilename = (name: string, type: string, extra?: string) => {
    const clean = (str: string) => str.trim().replace(/\s+/g, "_");
    let filename = `${clean(name)}_${clean(type)}`;
    if (extra) {
        filename += `_${clean(extra)}`;
    }
    return `${filename}.pdf`;
};
