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

/** Individual doc: FirstName_LastName_DocType[_Company].pdf */
export const formatDocFilename = (name: string, type: string, company?: string) => {
    const clean = (str: string) => str.trim().replace(/\s+/g, "_");
    const parts = name.trim().split(/\s+/);
    const shortName = parts.length >= 2
        ? `${parts[0]}_${parts[parts.length - 1]}`
        : clean(name);
    let filename = `${shortName}_${clean(type)}`;
    if (company && company.trim()) {
        filename += `_${clean(company)}`;
    }
    return `${filename}.pdf`;
};

/** Full merged PDF: Bewerbungsunterlagen_FullName[_Company].pdf */
export const formatFullFilename = (name: string, company?: string) => {
    const clean = (str: string) => str.trim().replace(/\s+/g, "_");
    let filename = `Bewerbungsunterlagen_${clean(name)}`;
    if (company && company.trim()) {
        filename += `_${clean(company)}`;
    }
    return `${filename}.pdf`;
};
