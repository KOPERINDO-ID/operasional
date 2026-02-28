/**
 * ========================================
 * GLOBAL IMAGE COMPRESSION UTILITIES
 * ========================================
 * Fungsi-fungsi untuk kompresi gambar sebelum upload
 * Target: Maksimal 4MB per file
 * Support: JPEG, PNG, WebP
 */

/**
 * Kompresi gambar dengan target size maksimal 4MB
 * @param {File|Blob} file - File gambar yang akan dikompres
 * @param {Object} options - Opsi kompresi
 * @returns {Promise<Blob>} - Promise yang resolve dengan gambar terkompresi
 */
async function compressImage(file, options = {}) {
    const defaults = {
        maxSizeMB: 4,           // Target maksimal 4MB
        maxWidthOrHeight: 1920, // Maksimal dimensi 1920px
        useWebWorker: true,     // Gunakan web worker untuk performa
        quality: 0.8,           // Kualitas awal (0.0 - 1.0)
        minQuality: 0.3,        // Kualitas minimal jika masih oversize
        fileType: 'image/jpeg'  // Default output type
    };

    const config = { ...defaults, ...options };

    console.log('🔄 Starting image compression...');
    console.log('   Original size:', formatBytes(file.size));
    console.log('   Target max size:', formatBytes(config.maxSizeMB * 1024 * 1024));

    try {
        // Validasi file type
        if (!file.type.startsWith('image/')) {
            throw new Error('File bukan gambar yang valid');
        }

        // Jika file sudah kecil, tidak perlu kompresi
        if (file.size <= config.maxSizeMB * 1024 * 1024) {
            console.log('✅ File already under limit, no compression needed');
            return file;
        }

        // Load image
        const img = await loadImage(file);
        
        // Calculate new dimensions
        const { width, height } = calculateNewDimensions(
            img.width, 
            img.height, 
            config.maxWidthOrHeight
        );

        console.log('   Original dimensions:', img.width, 'x', img.height);
        console.log('   New dimensions:', width, 'x', height);

        // Compress dengan iterasi quality jika perlu
        let compressedBlob = await compressWithCanvas(
            img, 
            width, 
            height, 
            config.quality, 
            config.fileType
        );

        // Jika masih oversize, kurangi quality bertahap
        let currentQuality = config.quality;
        let attempts = 0;
        const maxAttempts = 5;

        while (compressedBlob.size > config.maxSizeMB * 1024 * 1024 && 
               currentQuality > config.minQuality && 
               attempts < maxAttempts) {
            
            attempts++;
            currentQuality -= 0.1;
            
            console.log(`   Attempt ${attempts}: Reducing quality to ${currentQuality.toFixed(2)}`);
            
            compressedBlob = await compressWithCanvas(
                img, 
                width, 
                height, 
                currentQuality, 
                config.fileType
            );
            
            console.log('   Current size:', formatBytes(compressedBlob.size));
        }

        // Final check
        if (compressedBlob.size > config.maxSizeMB * 1024 * 1024) {
            console.warn('⚠️ Warning: Could not compress below target size');
            console.warn('   Final size:', formatBytes(compressedBlob.size));
            
            // Last resort: reduce dimensions further
            const reducedWidth = Math.floor(width * 0.7);
            const reducedHeight = Math.floor(height * 0.7);
            
            console.log('   Last resort: Reducing dimensions to', reducedWidth, 'x', reducedHeight);
            
            compressedBlob = await compressWithCanvas(
                img, 
                reducedWidth, 
                reducedHeight, 
                config.minQuality, 
                config.fileType
            );
        }

        console.log('✅ Compression complete!');
        console.log('   Final size:', formatBytes(compressedBlob.size));
        console.log('   Compression ratio:', ((1 - compressedBlob.size / file.size) * 100).toFixed(1) + '%');

        return compressedBlob;

    } catch (error) {
        console.error('❌ Compression error:', error);
        throw error;
    }
}

/**
 * Load image dari file
 * @param {File|Blob} file 
 * @returns {Promise<HTMLImageElement>}
 */
function loadImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('Failed to load image'));
            
            img.src = e.target.result;
        };
        
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

/**
 * Calculate dimensi baru dengan mempertahankan aspect ratio
 * @param {number} width 
 * @param {number} height 
 * @param {number} maxSize 
 * @returns {Object}
 */
function calculateNewDimensions(width, height, maxSize) {
    if (width <= maxSize && height <= maxSize) {
        return { width, height };
    }

    const ratio = width / height;

    if (width > height) {
        return {
            width: maxSize,
            height: Math.round(maxSize / ratio)
        };
    } else {
        return {
            width: Math.round(maxSize * ratio),
            height: maxSize
        };
    }
}

/**
 * Compress image menggunakan canvas
 * @param {HTMLImageElement} img 
 * @param {number} width 
 * @param {number} height 
 * @param {number} quality 
 * @param {string} fileType 
 * @returns {Promise<Blob>}
 */
function compressWithCanvas(img, width, height, quality, fileType) {
    return new Promise((resolve, reject) => {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            
            // Set white background untuk JPEG (karena tidak support transparency)
            if (fileType === 'image/jpeg') {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, width, height);
            }

            // Draw image dengan smoothing
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to blob
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to create blob'));
                    }
                },
                fileType,
                quality
            );
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Format bytes ke human-readable string
 * @param {number} bytes 
 * @param {number} decimals 
 * @returns {string}
 */
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * ========================================
 * WRAPPER FUNCTIONS UNTUK EXISTING CODE
 * ========================================
 */

/**
 * Compress dan convert file ke base64
 * Gunakan ini untuk replace existing image handling
 * @param {File} file 
 * @param {Object} options 
 * @returns {Promise<string>} Base64 string
 */
async function compressImageToBase64(file, options = {}) {
    try {
        const compressedBlob = await compressImage(file, options);
        return await blobToBase64(compressedBlob);
    } catch (error) {
        console.error('Error compressing to base64:', error);
        throw error;
    }
}

/**
 * Convert blob ke base64
 * @param {Blob} blob 
 * @returns {Promise<string>}
 */
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

/**
 * Convert base64 ke blob (existing function - improved)
 * @param {string} base64 
 * @returns {Blob}
 */
function base64ToBlob(base64) {
    // Remove data URL prefix if exists
    const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
    
    // Get mime type
    let mimeType = 'image/jpeg';
    if (base64.includes('data:')) {
        const matches = base64.match(/data:([^;]+);/);
        if (matches) {
            mimeType = matches[1];
        }
    }

    // Convert to binary
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays.push(byteCharacters.charCodeAt(i));
    }

    return new Blob([new Uint8Array(byteArrays)], { type: mimeType });
}

/**
 * ========================================
 * EVENT HANDLER INTEGRATION
 * ========================================
 */

/**
 * Setup event handler untuk input file dengan auto-compress
 * @param {string} inputId - ID dari input file element
 * @param {string} storageKey - Key untuk localStorage
 * @param {string} previewId - ID untuk preview image (optional)
 * @param {Object} options - Compression options
 */
function setupCompressedFileInput(inputId, storageKey, previewId = null, options = {}) {
    const inputElement = document.getElementById(inputId);
    
    if (!inputElement) {
        console.error('Input element not found:', inputId);
        return;
    }

    inputElement.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        
        if (!file) return;

        // Validasi file type
        if (!file.type.startsWith('image/')) {
            app.dialog.alert('File harus berupa gambar (JPG, PNG, WebP)');
            e.target.value = '';
            return;
        }

        try {
            // Show loading
            app.dialog.preloader('Mengompresi gambar...');

            // Compress image
            const compressedBlob = await compressImage(file, options);

            // Convert to base64
            const base64String = await blobToBase64(compressedBlob);

            // Save to localStorage
            localStorage.setItem(storageKey, base64String);

            // Show preview if previewId provided
            if (previewId) {
                const previewElement = document.getElementById(previewId);
                if (previewElement) {
                    previewElement.src = base64String;
                    previewElement.style.display = 'block';
                }
            }

            app.dialog.close();

            // Show success notification
            app.toast.create({
                text: `✓ Gambar terkompresi (${formatBytes(compressedBlob.size)})`,
                position: 'center',
                closeTimeout: 2000
            }).open();

            console.log('✅ Image compressed and saved to localStorage');
            console.log('   Storage key:', storageKey);
            console.log('   Compressed size:', formatBytes(compressedBlob.size));

        } catch (error) {
            app.dialog.close();
            app.dialog.alert('Gagal mengompresi gambar: ' + error.message);
            console.error('Compression error:', error);
            e.target.value = '';
        }
    });
}

/**
 * ========================================
 * VALIDATION HELPERS
 * ========================================
 */

/**
 * Validasi ukuran file sebelum compress
 * @param {File} file 
 * @param {number} maxSizeMB 
 * @returns {boolean}
 */
function validateFileSize(file, maxSizeMB = 50) {
    if (file.size > maxSizeMB * 1024 * 1024) {
        app.dialog.alert(`Ukuran file terlalu besar (${formatBytes(file.size)}). Maksimal ${maxSizeMB}MB`);
        return false;
    }
    return true;
}

/**
 * Validasi tipe file
 * @param {File} file 
 * @param {Array} allowedTypes 
 * @returns {boolean}
 */
function validateFileType(file, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']) {
    if (!allowedTypes.includes(file.type)) {
        app.dialog.alert('Tipe file tidak didukung. Gunakan JPG, PNG, atau WebP');
        return false;
    }
    return true;
}

/**
 * ========================================
 * BATCH COMPRESSION (untuk multiple files)
 * ========================================
 */

/**
 * Compress multiple files sekaligus
 * @param {FileList|Array} files 
 * @param {Object} options 
 * @returns {Promise<Array>} Array of compressed blobs
 */
async function compressMultipleImages(files, options = {}) {
    const filesArray = Array.from(files);
    const total = filesArray.length;
    const results = [];

    console.log(`🔄 Compressing ${total} images...`);

    for (let i = 0; i < filesArray.length; i++) {
        const file = filesArray[i];
        
        try {
            console.log(`   Processing ${i + 1}/${total}: ${file.name}`);
            const compressed = await compressImage(file, options);
            results.push({
                success: true,
                file: file,
                compressed: compressed,
                originalSize: file.size,
                compressedSize: compressed.size,
                ratio: ((1 - compressed.size / file.size) * 100).toFixed(1)
            });
        } catch (error) {
            console.error(`   Failed ${i + 1}/${total}:`, error);
            results.push({
                success: false,
                file: file,
                error: error.message
            });
        }
    }

    console.log('✅ Batch compression complete');
    console.log('   Success:', results.filter(r => r.success).length);
    console.log('   Failed:', results.filter(r => !r.success).length);

    return results;
}

/**
 * ========================================
 * USAGE EXAMPLE
 * ========================================
 */

/*
// Example 1: Basic usage dengan existing input
setupCompressedFileInput(
    'tambah_file_acc_1',              // input ID
    'file_foto_terima_pabrik',        // localStorage key
    'tambah_file_acc_1_view'          // preview ID (optional)
);

// Example 2: Custom compression options
setupCompressedFileInput(
    'edit_file_acc_1',
    'file_foto_update_terima_pabrik',
    'edit_file_acc_1_view',
    {
        maxSizeMB: 3,           // Target 3MB instead of 4MB
        maxWidthOrHeight: 1600, // Lower resolution
        quality: 0.75           // Lower quality
    }
);

// Example 3: Manual compression dalam existing code
async function handleFileUpload(file) {
    try {
        // Compress first
        const compressed = await compressImage(file);
        
        // Convert to base64
        const base64 = await blobToBase64(compressed);
        
        // Save or use
        localStorage.setItem('my_photo', base64);
        
    } catch (error) {
        console.error('Upload error:', error);
    }
}

// Example 4: Direct integration in FormData
async function uploadWithCompression(file) {
    const compressed = await compressImage(file);
    
    const formData = new FormData();
    formData.append('photo', compressed, 'compressed_photo.jpg');
    
    // Upload...
}
*/

console.log('✅ Image compression utilities loaded');
