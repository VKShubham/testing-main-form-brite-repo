export const validateForm = (formData: any) => {
    const isPracticeNameValid = formData.practiceName && (formData.practiceName !== null || formData.practiceName !== undefined);
    const fullName = formData.fullName && (formData.fullName !== null || formData.fullName !== undefined);
    const phone = formData.phone && (formData.phone !== null || formData.phone !== undefined);
    const email = formData.email && (formData.email !== null || formData.email !== undefined);
    

    const isValid = isPracticeNameValid && fullName && phone && email;
    return isValid;
}

