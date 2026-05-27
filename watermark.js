/**
 * Image Watermark and Download Module
 * Adds watermark to images and handles secure download
 * Watermark: Gnord Strular, 45 degrees, 16px font, 50% opacity, 300px spacing
 */

class WatermarkManager {
    constructor() {
        this.watermarkText = 'Gnord Strular';
        this.fontSize = 16;
        this.opacity = 0.5;
        this.spacing = 300;
        this.angle = -45; // 向上45度角（逆时针）
        this.init();
    }

    init() {
        this.setupImageProtection();
        this.setupDownloadHandlers();
        this.setupScreenshotProtection();
    }

    /**
     * Setup image protection - disable right-click and drag
     */
    setupImageProtection() {
        document.addEventListener('contextmenu', (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
                this.showDownloadDialog(e.target);
            }
        });

        document.addEventListener('dragstart', (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
            }
        });

        // Disable image selection
        document.querySelectorAll('img').forEach(img => {
            img.style.userSelect = 'none';
            img.style.webkitUserSelect = 'none';
            img.style.pointerEvents = 'auto';
            img.style.cursor = 'pointer';
        });
    }

    /**
     * Setup download handlers for all images
     */
    setupDownloadHandlers() {
        // Handle all images on the page
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Skip small icons and logos
            if (img.width < 100 || img.height < 100) return;
            
            img.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showDownloadDialog(img);
            });
            
            img.style.cursor = 'pointer';
        });
    }

    /**
     * Process image download with watermark
     */
    async processImageDownload(imgElement) {
        try {
            // Show loading indicator
            this.showLoadingMessage('Processing image...');
            
            const canvas = await this.createWatermarkedCanvas(imgElement);
            const filename = this.generateFilename(imgElement);
            this.downloadCanvas(canvas, filename);
            
            this.hideLoadingMessage();
        } catch (error) {
            console.error('Error processing image:', error);
            this.hideLoadingMessage();
            alert('Unable to download image: ' + error.message);
        }
    }

    /**
     * Create canvas with watermark
     */
    async createWatermarkedCanvas(imgElement) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas size to match image
            const width = imgElement.naturalWidth || imgElement.width || 800;
            const height = imgElement.naturalHeight || imgElement.height || 600;
            canvas.width = width;
            canvas.height = height;
            
            // Create a new image object to handle CORS
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            let loaded = false;
            
            img.onload = () => {
                if (loaded) return;
                loaded = true;
                
                try {
                    // Draw original image
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    
                    // Add watermark
                    this.drawWatermark(ctx, canvas.width, canvas.height);
                    
                    // Test if canvas is valid
                    canvas.toDataURL('image/jpeg', 0.1);
                    
                    resolve(canvas);
                } catch (err) {
                    console.error('Canvas error:', err);
                    // If CORS error, try fallback
                    this.tryFallbackDraw(imgElement, canvas, ctx, resolve, reject);
                }
            };
            
            img.onerror = () => {
                if (loaded) return;
                loaded = true;
                
                // Try fallback immediately
                this.tryFallbackDraw(imgElement, canvas, ctx, resolve, reject);
            };
            
            // Set source after setting up handlers
            // Add cache-busting parameter to avoid cached images without CORS headers
            const cacheBuster = '?v=' + Date.now();
            img.src = imgElement.src + cacheBuster;
        });
    }
    
    /**
     * Try fallback drawing methods
     */
    tryFallbackDraw(imgElement, canvas, ctx, resolve, reject) {
        try {
            // Try using the original element directly
            ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
            this.drawWatermark(ctx, canvas.width, canvas.height);
            
            // Test if canvas is valid
            canvas.toDataURL('image/jpeg', 0.1);
            
            resolve(canvas);
        } catch (err) {
            console.error('Fallback error:', err);
            // If both fail, create watermark-only canvas
            this.createWatermarkOnlyCanvas(imgElement, canvas, ctx, resolve, reject);
        }
    }
    
    /**
     * Create canvas with just watermark (if image cannot be loaded)
     */
    createWatermarkOnlyCanvas(imgElement, canvas, ctx, resolve, reject) {
        try {
            // Fill with a background color
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add text indicating the image
            ctx.fillStyle = '#666';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Image protected by copyright', canvas.width / 2, canvas.height / 2 - 20);
            ctx.fillText('Download to view with watermark', canvas.width / 2, canvas.height / 2 + 20);
            
            // Add watermark
            this.drawWatermark(ctx, canvas.width, canvas.height);
            
            resolve(canvas);
        } catch (err) {
            reject(new Error('Failed to create watermarked image'));
        }
    }

    /**
     * Draw watermark pattern on canvas
     */
    drawWatermark(ctx, width, height) {
        ctx.save();
        
        // Set watermark style - use darker color for better visibility
        ctx.font = `bold ${this.fontSize}px Arial, sans-serif`;
        ctx.fillStyle = `rgba(100, 100, 100, ${this.opacity})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Calculate pattern spacing
        const spacingX = this.spacing;
        const spacingY = this.spacing;
        
        // Draw watermark pattern with offset rows for better coverage
        let rowOffset = 0;
        for (let y = -height; y < height * 2; y += spacingY) {
            for (let x = -width + rowOffset; x < width * 2; x += spacingX) {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate((this.angle * Math.PI) / 180);
                ctx.fillText(this.watermarkText, 0, 0);
                ctx.restore();
            }
            rowOffset = rowOffset === 0 ? spacingX / 2 : 0;
        }
        
        ctx.restore();
    }

    /**
     * Generate filename for download
     */
    generateFilename(imgElement) {
        const timestamp = new Date().getTime();
        return `gnord-image-${timestamp}.jpg`;
    }

    /**
     * Download canvas as image
     */
    downloadCanvas(canvas, filename) {
        try {
            const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Download error:', error);
            throw new Error('Unable to export image. CORS policy may be blocking it.');
        }
    }

    /**
     * Show download dialog
     */
    showDownloadDialog(imgElement) {
        // Remove any existing dialogs
        const existingDialog = document.querySelector('.watermark-dialog');
        if (existingDialog) {
            existingDialog.remove();
        }
        
        const dialog = document.createElement('div');
        dialog.className = 'watermark-dialog';
        dialog.innerHTML = `
            <div class="watermark-dialog-content">
                <h3>Download Image</h3>
                <p>This image will be downloaded with a watermark for copyright protection.</p>
                <div class="watermark-dialog-buttons">
                    <button class="btn btn-primary" id="confirmDownload">Download</button>
                    <button class="btn btn-secondary" id="cancelDownload">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        document.getElementById('confirmDownload').addEventListener('click', () => {
            this.processImageDownload(imgElement);
            dialog.remove();
        });
        
        document.getElementById('cancelDownload').addEventListener('click', () => {
            dialog.remove();
        });
        
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.remove();
            }
        });
    }

    /**
     * Show loading message
     */
    showLoadingMessage(text) {
        this.hideLoadingMessage();
        const loading = document.createElement('div');
        loading.className = 'watermark-loading';
        loading.innerHTML = `<div class="loading-content"><p>${text}</p></div>`;
        document.body.appendChild(loading);
    }

    /**
     * Hide loading message
     */
    hideLoadingMessage() {
        const loading = document.querySelector('.watermark-loading');
        if (loading) {
            loading.remove();
        }
    }

    /**
     * Setup screenshot protection
     */
    setupScreenshotProtection() {
        // Detect PrintScreen key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'PrintScreen' || e.keyCode === 44) {
                e.preventDefault();
                this.showProtectionMessage();
            }
        });

        // Detect Ctrl+S (Save)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                if (window.getSelection().toString() === '') {
                    e.preventDefault();
                    this.showProtectionMessage();
                }
            }
        });

        // Detect Ctrl+P (Print)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                this.showProtectionMessage();
            }
        });

        // Disable copy on images
        document.addEventListener('copy', (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
            }
        });
    }

    /**
     * Show protection message
     */
    showProtectionMessage() {
        const message = document.createElement('div');
        message.className = 'protection-message';
        message.innerHTML = `
            <div class="protection-content">
                <p>Screenshot and screen recording are disabled for copyright protection.</p>
                <p>Please use the download button to get watermarked images.</p>
            </div>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 3000);
    }
}

// Add CSS styles (only once)
if (!document.getElementById('watermark-styles')) {
    const watermarkStyle = document.createElement('style');
    watermarkStyle.id = 'watermark-styles';
    watermarkStyle.textContent = `
        .watermark-dialog {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }
        
        .watermark-dialog-content {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        .watermark-dialog-content h3 {
            margin-bottom: 1rem;
            color: #333;
        }
        
        .watermark-dialog-content p {
            margin-bottom: 1.5rem;
            color: #666;
        }
        
        .watermark-dialog-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }
        
        .watermark-dialog-buttons .btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        
        .watermark-dialog-buttons .btn-primary {
            background: #c9a962;
            color: white;
        }
        
        .watermark-dialog-buttons .btn-primary:hover {
            background: #b89852;
        }
        
        .watermark-dialog-buttons .btn-secondary {
            background: #f0f0f0;
            color: #333;
        }
        
        .watermark-dialog-buttons .btn-secondary:hover {
            background: #e0e0e0;
        }
        
        .watermark-loading {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10002;
        }
        
        .loading-content {
            background: white;
            padding: 1.5rem 2rem;
            border-radius: 8px;
            color: #333;
        }
        
        .protection-message {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 2rem;
            border-radius: 8px;
            z-index: 10001;
            text-align: center;
        }
        
        .protection-content p {
            margin: 0.5rem 0;
        }
        
        /* Disable selection on images */
        img {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -webkit-touch-callout: none;
        }
    `;
    document.head.appendChild(watermarkStyle);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.watermarkManager = new WatermarkManager();
    });
} else {
    window.watermarkManager = new WatermarkManager();
}
