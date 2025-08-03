export const processImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export const getLocalStorageSize = (key: string): number => {
    const item = localStorage.getItem(key);
    if (!item) return 0;
    return (new TextEncoder().encode(item)).length / 1024;
};

export const saveImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file, file.name);

    try {
        const response = await fetch('/api/save-image', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to save image: ${errorText}`);
        }
        return file.name; // Return the filename
    } catch (error) {
        console.error('Error saving image:', error);
        throw error;
    }
};

export const export const export const loadImage = (filename: string): string => {
    // Assuming images are served from /assets/
    return `/assets/${filename}`;
};
