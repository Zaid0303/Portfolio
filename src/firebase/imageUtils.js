// Base64 Image Utilities
// Convert images to base64 for storing in Firestore

// Convert file to base64 string
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

// Convert image file to base64
export const imageToBase64 = async (file) => {
  try {
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    // Check file size (max 5MB for base64)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { success: false, error: 'Image size should be less than 5MB' };
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'File must be an image' };
    }

    const base64 = await fileToBase64(file);
    return { success: true, data: base64 };
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return { success: false, error: error.message };
  }
};

// Convert PDF file to base64
export const pdfToBase64 = async (file) => {
  try {
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    // Check file size (max 10MB for PDF)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { success: false, error: 'PDF size should be less than 10MB' };
    }

    // Check file type
    if (file.type !== 'application/pdf') {
      return { success: false, error: 'File must be a PDF' };
    }

    const base64 = await fileToBase64(file);
    return { success: true, data: base64 };
  } catch (error) {
    console.error('Error converting PDF to base64:', error);
    return { success: false, error: error.message };
  }
};




