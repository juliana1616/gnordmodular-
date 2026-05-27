// Global variables for unload container functionality
let currentUnloadOrder = null;
let unloadVideoStream = null;

// Simple wrapper function for inline onclick - defined globally
function showUnloadDetail(orderNumber) {
    console.log('showUnloadDetail called with:', orderNumber);
    openUnloadOrderDetail(orderNumber);
}

// Global function for My Orders page
function showClientOrderDetail(orderNumber) {
    console.log('showClientOrderDetail called with:', orderNumber);
    // Call the function through window object since it's defined inside DOMContentLoaded
    if (typeof window.openClientOrderDetail === 'function') {
        window.openClientOrderDetail(orderNumber);
    } else {
        console.error('openClientOrderDetail not yet loaded');
        // Fallback: manually show order details
        showClientOrderDetailFallback(orderNumber);
    }
}

// Fallback function for showing order details before DOMContentLoaded completes
function showClientOrderDetailFallback(orderNumber) {
    console.log('Using fallback for order:', orderNumber);
    
    // Mock data for orders
    const mockOrders = {
        'ORD-2026-001': {
            orderNumber: 'ORD-2026-001',
            clientName: 'ABC Trading Co.',
            orderDate: '2026-03-15',
            countryPin: 'United States, New York, 10001',
            status: 'In Progress',
            products: [
                { mfId: 'MF-001', productBarcode: '978020137962', productBarcodeId: 'PBC-001', name: 'Premium Plywood Sheet', qty: 100, boxesQty: 5, boxBarcode: '123456789012', boxBarcodeId: 'BOX-001-A', containerInfo: 'CNTR-2026-A', status: 'Loaded', note: 'Handle with care' },
                { mfId: 'MF-002', productBarcode: '978020137963', productBarcodeId: 'PBC-002', name: 'OSB Board 18mm', qty: 50, boxesQty: 3, boxBarcode: '123456789013', boxBarcodeId: 'BOX-001-B', containerInfo: 'CNTR-2026-A', status: 'Loaded', note: '' }
            ]
        },
        'ORD-2026-003': {
            orderNumber: 'ORD-2026-003',
            clientName: 'ABC Trading Co.',
            orderDate: '2026-03-20',
            countryPin: 'United Kingdom, London, SW1A 1AA',
            status: 'Completed',
            products: [
                { mfId: 'MF-004', productBarcode: '978020137964', productBarcodeId: 'PBC-004', name: 'Purewood Furniture Set', qty: 25, boxesQty: 8, boxBarcode: '123456789014', boxBarcodeId: 'BOX-003-A', containerInfo: 'CNTR-2026-C', status: 'Delivered', note: 'Fragile items' },
                { mfId: 'MF-005', productBarcode: '978020137965', productBarcodeId: 'PBC-005', name: 'Decorative Panels', qty: 75, boxesQty: 4, boxBarcode: '123456789015', boxBarcodeId: 'BOX-003-B', containerInfo: 'CNTR-2026-C', status: 'Delivered', note: '' }
            ]
        },
        'ORD-2026-004': {
            orderNumber: 'ORD-2026-004',
            clientName: 'ABC Trading Co.',
            orderDate: '2026-03-22',
            countryPin: 'Australia, Sydney, 2000',
            status: 'Loaded',
            products: [
                { mfId: 'MF-006', productBarcode: '978020137966', productBarcodeId: 'PBC-006', name: 'Marine Plywood', qty: 150, boxesQty: 7, boxBarcode: '123456789016', boxBarcodeId: 'BOX-004-A', containerInfo: 'CNTR-2026-D', status: 'Loaded', note: 'Waterproof' }
            ]
        }
    };
    
    const order = mockOrders[orderNumber];
    if (!order) {
        alert('Order not found');
        return;
    }
    
    // Store current order
    window.currentClientOrder = order;
    
    // Parse countryPin
    const countryPinParts = order.countryPin ? order.countryPin.split(',') : ['', ''];
    const location = countryPinParts[0] ? countryPinParts[0].trim() : '';
    const pinCode = countryPinParts[1] ? countryPinParts[1].trim() : '';
    
    // Populate order details
    const orderNumberEl = document.getElementById('client-detail-order-number');
    const clientNameEl = document.getElementById('client-detail-client-name');
    const orderDateEl = document.getElementById('client-detail-order-date');
    const locationEl = document.getElementById('client-detail-location');
    const pincodeEl = document.getElementById('client-detail-pincode');
    const statusBadgeEl = document.getElementById('client-detail-status');
    
    if (orderNumberEl) orderNumberEl.textContent = order.orderNumber;
    if (clientNameEl) clientNameEl.textContent = order.clientName || 'N/A';
    if (orderDateEl) orderDateEl.textContent = order.orderDate || '-';
    if (locationEl) locationEl.textContent = location;
    if (pincodeEl) pincodeEl.textContent = pinCode;
    
    if (statusBadgeEl) {
        statusBadgeEl.innerHTML = `<span class="status-badge status-${(order.status || 'Pending').toLowerCase()}">${order.status || 'Pending'}</span>`;
    }
    
    // Populate products table
    const tbody = document.getElementById('client-detail-products-body');
    if (tbody) {
        tbody.innerHTML = '';
        
        if (!order.products || order.products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" class="no-data">No products found</td></tr>';
        } else {
            order.products.forEach((product, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${product.mfId || '-'}</td>
                    <td>${product.productBarcode || '-'}</td>
                    <td>${product.productBarcodeId || '-'}</td>
                    <td>${product.name || '-'}</td>
                    <td>${product.qty || '-'}</td>
                    <td>${product.boxesQty || '-'}</td>
                    <td>${product.boxBarcode || '-'}</td>
                    <td>${product.boxBarcodeId || '-'}</td>
                    <td>${product.containerInfo || '-'}</td>
                    <td><span class="status-badge status-${(product.status || 'Pending').toLowerCase().replace(/\s+/g, '-')}">${product.status || 'Pending'}</span></td>
                    <td>${product.note || '-'}</td>
                `;
                tbody.appendChild(row);
            });
        }
    }
    
    // Switch views
    const ordersList = document.getElementById('client-orders-list');
    const orderDetail = document.getElementById('client-order-detail');
    if (ordersList) ordersList.style.display = 'none';
    if (orderDetail) orderDetail.style.display = 'block';
}

// Global function for showing client order list
function showClientOrderList() {
    const ordersList = document.getElementById('client-orders-list');
    const orderDetail = document.getElementById('client-order-detail');
    if (ordersList) ordersList.style.display = 'block';
    if (orderDetail) orderDetail.style.display = 'none';
    window.currentClientOrder = null;
}

// Global variables for client scanner
let clientScannerStream = null;

// Global function to open client scanner
function openClientScanner() {
    const modal = document.getElementById('client-scanner-modal');
    if (modal) {
        modal.style.display = 'flex';
        startClientScanner();
    }
}

// Global function to close client scanner
function closeClientScanner() {
    const modal = document.getElementById('client-scanner-modal');
    if (modal) modal.style.display = 'none';
    
    if (clientScannerStream) {
        clientScannerStream.getTracks().forEach(track => track.stop());
        clientScannerStream = null;
    }
}

// Global function to start client scanner camera
async function startClientScanner() {
    try {
        clientScannerStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        });
        const video = document.getElementById('client-scanner-video');
        if (video) video.srcObject = clientScannerStream;
    } catch (err) {
        console.error('Camera error:', err);
        alert('Could not access camera. Please use manual entry.');
    }
}

// Global function to process manual barcode entry
function processClientManualBarcode() {
    const barcodeInput = document.getElementById('client-manual-barcode');
    const barcode = barcodeInput ? barcodeInput.value.trim() : '';
    
    if (!barcode) {
        alert('Please enter a barcode');
        return;
    }
    
    findAndShowProduct(barcode);
    
    if (barcodeInput) barcodeInput.value = '';
    closeClientScanner();
}

// Global function to find and show product details
function findAndShowProduct(barcode) {
    const order = window.currentClientOrder;
    
    if (!order || !order.products) {
        alert('No order selected');
        return;
    }
    
    // Find product by barcode
    const product = order.products.find(p => 
        p.productBarcode === barcode || 
        p.productBarcodeId === barcode ||
        p.boxBarcode === barcode ||
        p.boxBarcodeId === barcode
    );
    
    if (!product) {
        alert('Product not found in this order');
        return;
    }
    
    // Show product details
    showScannedProductDetails(product);
}

// Global function to show scanned product details
function showScannedProductDetails(product) {
    const modal = document.getElementById('client-scanned-product-modal');
    const content = document.getElementById('client-scanned-product-content');
    
    if (!content) return;
    
    content.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
            <div>
                <span style="color: #666; font-size: 0.9rem;">Product Name</span>
                <div style="font-weight: 600; color: #2c3e50; font-size: 1.1rem;">${product.name || 'N/A'}</div>
            </div>
            <div>
                <span style="color: #666; font-size: 0.9rem;">MF ID</span>
                <div style="font-weight: 600; color: #2c3e50;">${product.mfId || '-'}</div>
            </div>
            <div>
                <span style="color: #666; font-size: 0.9rem;">Product Barcode</span>
                <div style="font-weight: 600; color: #2c3e50;">${product.productBarcode || '-'}</div>
            </div>
            <div>
                <span style="color: #666; font-size: 0.9rem;">Product Barcode ID</span>
                <div style="font-weight: 600; color: #2c3e50;">${product.productBarcodeId || '-'}</div>
            </div>
            <div>
                <span style="color: #666; font-size: 0.9rem;">Quantity</span>
                <div style="font-weight: 600; color: #2c3e50;">${product.qty || '-'}</div>
            </div>
            <div>
                <span style="color: #666; font-size: 0.9rem;">Boxes Quantity</span>
                <div style="font-weight: 600; color: #2c3e50;">${product.boxesQty || '-'}</div>
            </div>
            <div>
                <span style="color: #666; font-size: 0.9rem;">Box Barcode</span>
                <div style="font-weight: 600; color: #2c3e50;">${product.boxBarcode || '-'}</div>
            </div>
            <div>
                <span style="color: #666; font-size: 0.9rem;">Box Barcode ID</span>
                <div style="font-weight: 600; color: #2c3e50;">${product.boxBarcodeId || '-'}</div>
            </div>
            <div>
                <span style="color: #666; font-size: 0.9rem;">Container Info</span>
                <div style="font-weight: 600; color: #2c3e50;">${product.containerInfo || '-'}</div>
            </div>
            <div>
                <span style="color: #666; font-size: 0.9rem;">Status</span>
                <div style="font-weight: 600; color: #2c3e50;">
                    <span class="status-badge status-${(product.status || 'Pending').toLowerCase().replace(/\s+/g, '-')}">${product.status || 'Pending'}</span>
                </div>
            </div>
        </div>
        ${product.note ? `
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
            <span style="color: #666; font-size: 0.9rem;">Note</span>
            <div style="font-weight: 600; color: #2c3e50; margin-top: 0.5rem;">${product.note}</div>
        </div>
        ` : ''}
    `;
    
    if (modal) modal.style.display = 'flex';
}

// Global function to close scanned product modal
function closeScannedProductModal() {
    const modal = document.getElementById('client-scanned-product-modal');
    if (modal) modal.style.display = 'none';
}

// Global function for opening unload order detail
function openUnloadOrderDetail(orderNumber) {
    console.log('openUnloadOrderDetail called with:', orderNumber);
    
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    console.log('Saved orders:', savedOrders);
    
    let order = savedOrders.find(o => o.orderNumber === orderNumber);
    console.log('Found order:', order);
    
    // Fallback mock data if order not found in localStorage
    if (!order) {
        if (orderNumber === 'ORD-2026-001') {
            order = {
                orderNumber: 'ORD-2026-001',
                clientName: 'ABC Trading Co.',
                clientEmail: 'abc@trading.com',
                orderDate: '2026-03-15',
                countryPin: 'United States, New York, 10001',
                status: 'In Progress',
                assignedClientId: 'CLI-001',
                partnerId: 'PAR-001',
                products: [
                    {
                        mfId: 'MF-001',
                        productBarcode: '978020137962',
                        productBarcodeId: 'PBC-001',
                        name: 'Premium Plywood Sheet',
                        qty: 100,
                        boxesQty: 5,
                        boxBarcode: '123456789012',
                        boxBarcodeId: 'BOX-001-A',
                        containerInfo: 'CNTR-2026-A',
                        status: 'Loaded',
                        unloadingStatus: 'Pending',
                        note: 'Handle with care'
                    },
                    {
                        mfId: 'MF-002',
                        productBarcode: '978020137963',
                        productBarcodeId: 'PBC-002',
                        name: 'OSB Board 18mm',
                        qty: 50,
                        boxesQty: 3,
                        boxBarcode: '123456789013',
                        boxBarcodeId: 'BOX-001-B',
                        containerInfo: 'CNTR-2026-A',
                        status: 'Loaded',
                        unloadingStatus: 'Pending',
                        note: ''
                    }
                ]
            };
        } else if (orderNumber === 'ORD-2026-004') {
            order = {
                orderNumber: 'ORD-2026-004',
                clientName: 'ABC Trading Co.',
                clientEmail: 'abc@trading.com',
                orderDate: '2026-03-22',
                countryPin: 'Australia, Sydney, 2000',
                status: 'Loaded',
                assignedClientId: 'CLI-001',
                partnerId: 'PAR-001',
                products: [
                    {
                        mfId: 'MF-006',
                        productBarcode: '978020137966',
                        productBarcodeId: 'PBC-006',
                        name: 'Marine Plywood',
                        qty: 150,
                        boxesQty: 7,
                        boxBarcode: '123456789016',
                        boxBarcodeId: 'BOX-004-A',
                        containerInfo: 'CNTR-2026-D',
                        status: 'Loaded',
                        unloadingStatus: 'Pending',
                        note: 'Waterproof'
                    }
                ]
            };
        } else {
            alert('Order not found');
            return;
        }
    }
    
    currentUnloadOrder = order;
    
    // Parse countryPin to extract location and pincode
    const countryPinParts = order.countryPin ? order.countryPin.split(',') : ['', ''];
    const location = countryPinParts[0] ? countryPinParts[0].trim() : '';
    const pinCode = countryPinParts[1] ? countryPinParts[1].trim() : '';
    
    // Populate order details
    const orderNumberEl = document.getElementById('unload-detail-order-number');
    const clientNameEl = document.getElementById('unload-detail-client-name');
    const orderDateEl = document.getElementById('unload-detail-order-date');
    const locationEl = document.getElementById('unload-detail-location');
    const pincodeEl = document.getElementById('unload-detail-pincode');
    const statusBadgeEl = document.getElementById('unload-detail-status');
    
    if (orderNumberEl) orderNumberEl.textContent = order.orderNumber;
    if (clientNameEl) clientNameEl.textContent = order.clientName || 'N/A';
    if (orderDateEl) orderDateEl.textContent = order.orderDate || '-';
    if (locationEl) locationEl.textContent = location;
    if (pincodeEl) pincodeEl.textContent = pinCode;
    
    if (statusBadgeEl) {
        statusBadgeEl.innerHTML = `<span class="status-badge status-${(order.status || 'Pending').toLowerCase().replace(/\s+/g, '-')}">${order.status || 'Pending'}</span>`;
    }
    
    // Populate products table
    const tbody = document.getElementById('unload-detail-products-body');
    if (tbody) {
        tbody.innerHTML = '';
        
        if (!order.products || order.products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="12" class="no-data">No products found</td></tr>';
        } else {
            order.products.forEach((product, index) => {
                const unloadingStatus = product.unloadingStatus || 'Pending';
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${product.mfId || '-'}</td>
                    <td>${product.productBarcode || '-'}</td>
                    <td>${product.productBarcodeId || '-'}</td>
                    <td>${product.name || '-'}</td>
                    <td>${product.qty || '-'}</td>
                    <td>${product.boxesQty || '-'}</td>
                    <td>${product.boxBarcode || '-'}</td>
                    <td>${product.boxBarcodeId || '-'}</td>
                    <td>${product.containerInfo || '-'}</td>
                    <td><span class="status-badge status-${unloadingStatus.toLowerCase().replace(/\s+/g, '-')}">${unloadingStatus}</span></td>
                    <td>${product.note || '-'}</td>
                `;
                tbody.appendChild(row);
            });
        }
    }
    
    // Switch views
    console.log('Switching views...');
    const ordersList = document.getElementById('unload-orders-list');
    const orderDetail = document.getElementById('unload-order-detail');
    console.log('ordersList element:', ordersList);
    console.log('orderDetail element:', orderDetail);
    
    if (ordersList) ordersList.style.display = 'none';
    if (orderDetail) orderDetail.style.display = 'block';
    console.log('Views switched successfully');
}

// Global function for showing unload order list
function showUnloadOrderList() {
    const ordersList = document.getElementById('unload-orders-list');
    const orderDetail = document.getElementById('unload-order-detail');
    if (ordersList) ordersList.style.display = 'block';
    if (orderDetail) orderDetail.style.display = 'none';
    currentUnloadOrder = null;
    
    // Stop camera if running
    if (unloadVideoStream) {
        unloadVideoStream.getTracks().forEach(track => track.stop());
        unloadVideoStream = null;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Get all DOM elements first
    const tabButtons = document.querySelectorAll('.dashboard-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const startScannerBtn = document.getElementById('client-start-scanner');
    const stopScannerBtn = document.getElementById('client-stop-scanner');
    const scanResult = document.getElementById('client-scan-result');
    const scanAgainBtn = document.getElementById('client-scan-again');
    const unloadBoxBtn = document.getElementById('client-unload-box');
    const manualScanForm = document.getElementById('client-manual-scan-form');
    const clientOrdersBody = document.getElementById('client-orders-body');
    const unloadOrdersBody = document.getElementById('unload-orders-body');

    let videoStream = null;

    // Initialize mock data for client testing
    initializeClientMockData();

    // Mock Data Initialization for Client Dashboard
    function initializeClientMockData() {
        // Always set mock client login for testing
        localStorage.setItem('clientId', 'CLI-001');
        localStorage.setItem('clientEmail', 'abc@trading.com');
        localStorage.setItem('clientCompany', 'ABC Trading Co.');
        localStorage.setItem('isClientLoggedIn', 'true');

        // Clear existing orders and always set mock orders for testing
        localStorage.removeItem('orders');
        const mockOrders = [
            {
                orderNumber: 'ORD-2026-001',
                clientName: 'ABC Trading Co.',
                clientEmail: 'abc@trading.com',
                orderDate: '2026-03-15',
                countryPin: 'United States, New York, 10001',
                status: 'In Progress',
                assignedClientId: 'CLI-001',
                partnerId: 'PAR-001',
                products: [
                    {
                        mfId: 'MF-001',
                        productBarcode: '978020137962',
                        productBarcodeId: 'PBC-001',
                        name: 'Premium Plywood Sheet',
                        qty: 100,
                        boxesQty: 5,
                        boxBarcode: '123456789012',
                        boxBarcodeId: 'BOX-001-A',
                        containerInfo: 'CNTR-2026-A',
                        status: 'Loaded',
                        unloadingStatus: 'Pending',
                        note: 'Handle with care'
                    },
                    {
                        mfId: 'MF-002',
                        productBarcode: '978020137963',
                        productBarcodeId: 'PBC-002',
                        name: 'OSB Board 18mm',
                        qty: 50,
                        boxesQty: 3,
                        boxBarcode: '123456789013',
                        boxBarcodeId: 'BOX-001-B',
                        containerInfo: 'CNTR-2026-A',
                        status: 'Loaded',
                        unloadingStatus: 'Pending',
                        note: ''
                    }
                ]
            },
            {
                orderNumber: 'ORD-2026-003',
                clientName: 'ABC Trading Co.',
                clientEmail: 'abc@trading.com',
                orderDate: '2026-03-20',
                countryPin: 'United Kingdom, London, SW1A 1AA',
                status: 'Completed',
                assignedClientId: 'CLI-001',
                partnerId: 'PAR-003',
                products: [
                    {
                        mfId: 'MF-004',
                        productBarcode: '978020137964',
                        productBarcodeId: 'PBC-004',
                        name: 'Purewood Furniture Set',
                        qty: 25,
                        boxesQty: 8,
                        boxBarcode: '123456789014',
                        boxBarcodeId: 'BOX-003-A',
                        containerInfo: 'CNTR-2026-C',
                        status: 'Delivered',
                        unloadingStatus: 'Unloaded',
                        note: 'Fragile items'
                    },
                    {
                        mfId: 'MF-005',
                        productBarcode: '978020137965',
                        productBarcodeId: 'PBC-005',
                        name: 'Decorative Panels',
                        qty: 75,
                        boxesQty: 4,
                        boxBarcode: '123456789015',
                        boxBarcodeId: 'BOX-003-B',
                        containerInfo: 'CNTR-2026-C',
                        status: 'Delivered',
                        unloadingStatus: 'Unloaded',
                        note: ''
                    }
                ]
            },
            {
                orderNumber: 'ORD-2026-004',
                clientName: 'ABC Trading Co.',
                clientEmail: 'abc@trading.com',
                orderDate: '2026-03-22',
                countryPin: 'Australia, Sydney, 2000',
                status: 'Loaded',
                assignedClientId: 'CLI-001',
                partnerId: 'PAR-001',
                products: [
                    {
                        mfId: 'MF-006',
                        productBarcode: '978020137966',
                        productBarcodeId: 'PBC-006',
                        name: 'Marine Plywood',
                        qty: 150,
                        boxesQty: 7,
                        boxBarcode: '123456789016',
                        boxBarcodeId: 'BOX-004-A',
                        containerInfo: 'CNTR-2026-D',
                        status: 'Loaded',
                        unloadingStatus: 'Pending',
                        note: 'Waterproof'
                    }
                ]
            }
        ];
        localStorage.setItem('orders', JSON.stringify(mockOrders));
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            // Load unload orders when tab is clicked
            if (tabId === 'unload-container') {
                loadUnloadOrders();
            }
        });
    });

    startScannerBtn.addEventListener('click', async function() {
        try {
            videoStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            
            const videoElement = document.getElementById('client-qr-video');
            videoElement.srcObject = videoStream;
            videoElement.play();
            
            startScannerBtn.style.display = 'none';
            stopScannerBtn.style.display = 'inline-block';
            
            startQRScanning();
        } catch (error) {
            alert('Unable to access camera. Please ensure camera permissions are granted.');
            console.error('Camera error:', error);
        }
    });

    stopScannerBtn.addEventListener('click', function() {
        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
            videoStream = null;
        }
        
        const videoElement = document.getElementById('client-qr-video');
        videoElement.srcObject = null;
        
        startScannerBtn.style.display = 'inline-block';
        stopScannerBtn.style.display = 'none';
    });

    function startQRScanning() {
        const videoElement = document.getElementById('client-qr-video');
        
        if (!videoStream) return;

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        function scanFrame() {
            if (!videoStream) return;
            
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            context.drawImage(videoElement, 0, 0);
            
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const qrCode = scanQRCode(imageData);
            
            if (qrCode) {
                handleQRCodeResult(qrCode);
                return;
            }
            
            requestAnimationFrame(scanFrame);
        }
        
        scanFrame();
    }

    function scanQRCode(imageData) {
        const savedBoxes = JSON.parse(localStorage.getItem('boxes') || '[]');
        
        for (const box of savedBoxes) {
            return box.boxId;
        }
        
        return null;
    }

    function handleQRCodeResult(boxId) {
        stopScannerBtn.click();
        
        const boxData = findBoxData(boxId);
        
        if (boxData) {
            displayScanResult(boxData);
        } else {
            alert('Box not found. Please check QR code or enter box ID manually.');
        }
    }

    function findBoxData(boxId) {
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const savedBoxes = JSON.parse(localStorage.getItem('boxes') || '[]');
        
        for (const box of savedBoxes) {
            if (box.boxId === boxId) {
                const order = savedOrders.find(o => o.orderNumber === box.orderNumber);
                return {
                    ...box,
                    orderNumber: order ? order.orderNumber : 'Unknown',
                    productCode: order ? order.productCode : 'Unknown'
                };
            }
        }
        
        return null;
    }
    
    function unloadBox(boxId) {
        const savedBoxes = JSON.parse(localStorage.getItem('boxes') || '[]');
        const boxIndex = savedBoxes.findIndex(box => box.boxId === boxId);
        
        if (boxIndex !== -1) {
            savedBoxes[boxIndex].status = 'Unloaded';
            localStorage.setItem('boxes', JSON.stringify(savedBoxes));
            
            // Update UI
            const statusElement = document.getElementById('client-result-status');
            statusElement.textContent = 'Unloaded';
            statusElement.className = 'detail-value status-badge status-unloaded';
            
            alert('Box unloaded successfully!');
            loadClientOrders(); // Refresh orders list
        }
    }

    function displayScanResult(boxData) {
        document.getElementById('client-result-box-id').textContent = boxData.boxId;
        document.getElementById('client-result-order-number').textContent = boxData.orderNumber;
        document.getElementById('client-result-product-code').textContent = boxData.productCode;
        
        const statusElement = document.getElementById('client-result-status');
        statusElement.textContent = boxData.status || 'Pending';
        statusElement.className = `detail-value status-badge status-${(boxData.status || 'Pending').toLowerCase()}`;
        
        const contentsElement = document.getElementById('client-result-contents');
        if (boxData.contents && boxData.contents.length > 0) {
            contentsElement.innerHTML = boxData.contents.map(item => 
                `<div>${item.name} x${item.quantity} (${item.specification})</div>`
            ).join('');
        } else {
            contentsElement.textContent = 'No contents recorded';
        }
        
        scanResult.style.display = 'block';
        scanResult.scrollIntoView({ behavior: 'smooth' });
    }

    scanAgainBtn.addEventListener('click', function() {
        scanResult.style.display = 'none';
    });
    
    unloadBoxBtn.addEventListener('click', function() {
        const boxId = document.getElementById('client-result-box-id').textContent;
        if (boxId && boxId !== '-') {
            unloadBox(boxId);
        }
    });

    manualScanForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const boxId = document.getElementById('client-manual-box-id').value.trim();
        
        if (!boxId) {
            alert('Please enter a box ID');
            return;
        }
        
        const boxData = findBoxData(boxId);
        
        if (boxData) {
            displayScanResult(boxData);
        } else {
            alert('Box not found. Please check box ID.');
        }
    });

    // Store current order for download functions
    window.currentClientOrder = null;

    function loadClientOrders() {
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const clientId = localStorage.getItem('clientId');
        
        // Filter orders assigned to this client
        const clientOrders = savedOrders.filter(order => order.assignedClientId === clientId);
        
        if (clientOrders.length === 0) {
            clientOrdersBody.innerHTML = '<tr><td colspan="5" class="no-data">No orders assigned to you</td></tr>';
            return;
        }

        clientOrdersBody.innerHTML = clientOrders.map(order => {
            const countryPinParts = order.countryPin ? order.countryPin.split(',') : ['', ''];
            const pinCode = countryPinParts[1] ? countryPinParts[1].trim() : '-';
            
            return `
                <tr onclick="openClientOrderDetail('${order.orderNumber}')" style="cursor: pointer;">
                    <td>${order.orderNumber}</td>
                    <td>${order.orderDate || '-'}</td>
                    <td>${pinCode}</td>
                    <td><span class="status-badge status-${(order.status || 'Pending').toLowerCase()}">${order.status || 'Pending'}</span></td>
                    <td>
                        <button class="btn btn-small" onclick="event.stopPropagation(); openClientOrderDetail('${order.orderNumber}')">View</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    window.openClientOrderDetail = function(orderNumber) {
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        let order = savedOrders.find(o => o.orderNumber === orderNumber);
        
        // Fallback mock data if order not found in localStorage
        if (!order) {
            if (orderNumber === 'ORD-2026-001') {
                order = {
                    orderNumber: 'ORD-2026-001',
                    clientName: 'ABC Trading Co.',
                    clientEmail: 'abc@trading.com',
                    orderDate: '2026-03-15',
                    countryPin: 'United States, New York, 10001',
                    status: 'In Progress',
                    assignedClientId: 'CLI-001',
                    partnerId: 'PAR-001',
                    products: [
                        {
                            mfId: 'MF-001',
                            productBarcode: '978020137962',
                            productBarcodeId: 'PBC-001',
                            name: 'Premium Plywood Sheet',
                            qty: 100,
                            boxesQty: 5,
                            boxBarcode: '123456789012',
                            boxBarcodeId: 'BOX-001-A',
                            containerInfo: 'CNTR-2026-A',
                            status: 'Loaded',
                            note: 'Handle with care'
                        },
                        {
                            mfId: 'MF-002',
                            productBarcode: '978020137963',
                            productBarcodeId: 'PBC-002',
                            name: 'OSB Board 18mm',
                            qty: 50,
                            boxesQty: 3,
                            boxBarcode: '123456789013',
                            boxBarcodeId: 'BOX-001-B',
                            containerInfo: 'CNTR-2026-A',
                            status: 'Loaded',
                            note: ''
                        }
                    ]
                };
            } else if (orderNumber === 'ORD-2026-003') {
                order = {
                    orderNumber: 'ORD-2026-003',
                    clientName: 'ABC Trading Co.',
                    clientEmail: 'abc@trading.com',
                    orderDate: '2026-03-20',
                    countryPin: 'United Kingdom, London, SW1A 1AA',
                    status: 'Completed',
                    assignedClientId: 'CLI-001',
                    partnerId: 'PAR-003',
                    products: [
                        {
                            mfId: 'MF-004',
                            productBarcode: '978020137964',
                            productBarcodeId: 'PBC-004',
                            name: 'Purewood Furniture Set',
                            qty: 25,
                            boxesQty: 8,
                            boxBarcode: '123456789014',
                            boxBarcodeId: 'BOX-003-A',
                            containerInfo: 'CNTR-2026-C',
                            status: 'Delivered',
                            note: 'Fragile items'
                        },
                        {
                            mfId: 'MF-005',
                            productBarcode: '978020137965',
                            productBarcodeId: 'PBC-005',
                            name: 'Decorative Panels',
                            qty: 75,
                            boxesQty: 4,
                            boxBarcode: '123456789015',
                            boxBarcodeId: 'BOX-003-B',
                            containerInfo: 'CNTR-2026-C',
                            status: 'Delivered',
                            note: ''
                        }
                    ]
                };
            } else if (orderNumber === 'ORD-2026-004') {
                order = {
                    orderNumber: 'ORD-2026-004',
                    clientName: 'ABC Trading Co.',
                    clientEmail: 'abc@trading.com',
                    orderDate: '2026-03-22',
                    countryPin: 'Australia, Sydney, 2000',
                    status: 'Loaded',
                    assignedClientId: 'CLI-001',
                    partnerId: 'PAR-001',
                    products: [
                        {
                            mfId: 'MF-006',
                            productBarcode: '978020137966',
                            productBarcodeId: 'PBC-006',
                            name: 'Marine Plywood',
                            qty: 150,
                            boxesQty: 7,
                            boxBarcode: '123456789016',
                            boxBarcodeId: 'BOX-004-A',
                            containerInfo: 'CNTR-2026-D',
                            status: 'Loaded',
                            note: 'Waterproof'
                        }
                    ]
                };
            } else {
                alert('Order not found');
                return;
            }
        }
        
        // Store current order for download functions
        window.currentClientOrder = order;
        
        // Parse countryPin to extract location and pincode
        const countryPinParts = order.countryPin ? order.countryPin.split(',') : ['', ''];
        const location = countryPinParts[0] ? countryPinParts[0].trim() : '';
        const pinCode = countryPinParts[1] ? countryPinParts[1].trim() : '';
        
        // Populate order details
        document.getElementById('client-detail-order-number').textContent = order.orderNumber;
        document.getElementById('client-detail-client-name').textContent = order.clientName || 'N/A';
        document.getElementById('client-detail-order-date').textContent = order.orderDate || '-';
        document.getElementById('client-detail-location').textContent = location;
        document.getElementById('client-detail-pincode').textContent = pinCode;
        
        const statusBadge = document.getElementById('client-detail-status');
        statusBadge.innerHTML = `<span class="status-badge status-${(order.status || 'Pending').toLowerCase()}">${order.status || 'Pending'}</span>`;
        
        // Populate products table
        const tbody = document.getElementById('client-detail-products-body');
        tbody.innerHTML = '';
        
        if (!order.products || order.products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" class="no-data">No products found</td></tr>';
        } else {
            order.products.forEach((product, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${product.mfId || '-'}</td>
                    <td>${product.productBarcode || '-'}</td>
                    <td>${product.productBarcodeId || '-'}</td>
                    <td>${product.name || '-'}</td>
                    <td>${product.qty || '-'}</td>
                    <td>${product.boxesQty || '-'}</td>
                    <td>${product.boxBarcode || '-'}</td>
                    <td>${product.boxBarcodeId || '-'}</td>
                    <td>${product.containerInfo || '-'}</td>
                    <td><span class="status-badge status-${(product.status || 'Pending').toLowerCase().replace(/\s+/g, '-')}">${product.status || 'Pending'}</span></td>
                    <td>${product.note || '-'}</td>
                `;
                tbody.appendChild(row);
            });
        }
        
        // Switch views
        document.getElementById('client-orders-list').style.display = 'none';
        document.getElementById('client-order-detail').style.display = 'block';
    };

    window.showClientOrderList = function() {
        document.getElementById('client-order-detail').style.display = 'none';
        document.getElementById('client-orders-list').style.display = 'block';
        window.currentClientOrder = null;
    };

    window.downloadClientOrderExcel = function() {
        const order = window.currentClientOrder;
        if (!order) {
            alert('No order selected');
            return;
        }

        let csvContent = 'Order Number,Client Name,Order Date,Country & City,Pin Code,Status\n';
        csvContent += `${order.orderNumber},${order.clientName || 'N/A'},${order.orderDate || ''},${order.countryPin || ''},${order.status || 'Pending'}\n\n`;
        
        csvContent += 'Product Details\n';
        csvContent += 'No.,Product MF ID,Product Barcode,Product Barcode ID,Product Name,Product QTY,Boxes QTY,Boxes Barcode,Boxes Barcode ID,Container Info,Product Status,Note\n';
        
        if (order.products && order.products.length > 0) {
            order.products.forEach((product, index) => {
                csvContent += `${index + 1},${product.mfId || ''},${product.productBarcode || ''},${product.productBarcodeId || ''},${product.name || ''},${product.qty || ''},${product.boxesQty || ''},${product.boxBarcode || ''},${product.boxBarcodeId || ''},${product.containerInfo || ''},${product.status || 'Pending'},${product.note || ''}\n`;
            });
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${order.orderNumber}_details.csv`;
        link.click();
    };

    window.downloadClientOrderPDF = function() {
        const order = window.currentClientOrder;
        if (!order) {
            alert('No order selected');
            return;
        }

        // Check if jsPDF is available
        if (typeof window.jspdf === 'undefined') {
            alert('PDF library not loaded. Please try again later.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Parse countryPin
        const countryPinParts = order.countryPin ? order.countryPin.split(',') : ['', ''];
        const location = countryPinParts[0] ? countryPinParts[0].trim() : '';
        const pinCode = countryPinParts[1] ? countryPinParts[1].trim() : '';
        
        // Add title
        doc.setFontSize(16);
        doc.text('Order Details', 105, 20, { align: 'center' });
        
        // Add order information
        doc.setFontSize(12);
        let y = 40;
        doc.text(`Order Number: ${order.orderNumber}`, 20, y);
        y += 10;
        doc.text(`Client Name: ${order.clientName || 'N/A'}`, 20, y);
        y += 10;
        doc.text(`Order Date: ${order.orderDate || '-'}`, 20, y);
        y += 10;
        doc.text(`Country & City: ${location}`, 20, y);
        y += 10;
        doc.text(`Pin Code: ${pinCode}`, 20, y);
        y += 10;
        doc.text(`Status: ${order.status || 'Pending'}`, 20, y);
        
        // Add product details
        y += 20;
        doc.setFontSize(14);
        doc.text('Product Details', 20, y);
        y += 10;
        
        doc.setFontSize(10);
        if (order.products && order.products.length > 0) {
            order.products.forEach((product, index) => {
                if (y > 270) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(`${index + 1}. ${product.name || 'N/A'} (MF ID: ${product.mfId || '-'})`, 20, y);
                y += 6;
                doc.text(`   QTY: ${product.qty || '-'} | Boxes: ${product.boxesQty || '-'} | Status: ${product.status || 'Pending'}`, 20, y);
                y += 6;
                doc.text(`   Box ID: ${product.boxBarcodeId || '-'} | Container: ${product.containerInfo || '-'}`, 20, y);
                y += 10;
            });
        } else {
            doc.text('No products found', 20, y);
        }
        
        doc.save(`${order.orderNumber}_details.pdf`);
    };

    // ==================== UNLOAD FROM CONTAINER ====================
    // Note: unloadOrdersBody, currentUnloadOrder, unloadVideoStream are declared at top of DOMContentLoaded

    function loadUnloadOrders() {
        if (!unloadOrdersBody) {
            console.log('unloadOrdersBody not found');
            return;
        }
        
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const clientId = localStorage.getItem('clientId');
        
        console.log('Loading unload orders, clientId:', clientId);
        console.log('Saved orders:', savedOrders);
        
        // Filter orders assigned to this client that are ready for unloading
        const unloadOrders = savedOrders.filter(order => {
            const matchesClient = order.assignedClientId === clientId;
            const matchesStatus = order.status === 'In Progress' || order.status === 'Loaded' || order.status === 'Ready for Unloading';
            console.log('Order:', order.orderNumber, 'assignedClientId:', order.assignedClientId, 'status:', order.status, 'matchesClient:', matchesClient, 'matchesStatus:', matchesStatus);
            return matchesClient && matchesStatus;
        });
        
        console.log('Filtered unload orders:', unloadOrders);
        
        if (unloadOrders.length === 0) {
            unloadOrdersBody.innerHTML = '<tr><td colspan="5" class="no-data">No orders ready for unloading</td></tr>';
            return;
        }

        unloadOrdersBody.innerHTML = unloadOrders.map(order => {
            const countryPinParts = order.countryPin ? order.countryPin.split(',') : ['', ''];
            const pinCode = countryPinParts[1] ? countryPinParts[1].trim() : '-';
            
            return `
                <tr onclick="openUnloadOrderDetail('${order.orderNumber}')" style="cursor: pointer;">
                    <td>${order.orderNumber}</td>
                    <td>${order.orderDate || '-'}</td>
                    <td>${pinCode}</td>
                    <td><span class="status-badge status-${(order.status || 'Pending').toLowerCase().replace(/\s+/g, '-')}">${order.status || 'Pending'}</span></td>
                    <td>
                        <button class="btn btn-small" onclick="event.stopPropagation(); openUnloadOrderDetail('${order.orderNumber}')">View</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Simple wrapper function for inline onclick
    window.showUnloadDetail = function(orderNumber) {
        console.log('showUnloadDetail called with:', orderNumber);
        openUnloadOrderDetail(orderNumber);
    };

    // View button handlers are now inline onclick in HTML - functions defined globally

    // Scanner functionality
    const unloadScanBtn = document.getElementById('unload-scan-barcode');
    if (unloadScanBtn) {
        unloadScanBtn.addEventListener('click', function() {
            openUnloadScanner();
        });
    }

    window.openUnloadScanner = function() {
        const modal = document.getElementById('unload-scanner-modal');
        modal.style.display = 'flex';
        startUnloadCamera();
    };

    window.closeUnloadScanner = function() {
        const modal = document.getElementById('unload-scanner-modal');
        modal.style.display = 'none';
        
        if (unloadVideoStream) {
            unloadVideoStream.getTracks().forEach(track => track.stop());
            unloadVideoStream = null;
        }
    };

    async function startUnloadCamera() {
        try {
            unloadVideoStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            const video = document.getElementById('unload-camera-video');
            video.srcObject = unloadVideoStream;
        } catch (err) {
            console.error('Camera error:', err);
            alert('Could not access camera. Please use manual entry.');
        }
    }

    window.processUnloadManualBarcode = function() {
        const barcodeInput = document.getElementById('unload-manual-barcode-input');
        const barcode = barcodeInput.value.trim();
        
        if (!barcode) {
            alert('Please enter a barcode');
            return;
        }
        
        processUnloadBarcode(barcode);
        barcodeInput.value = '';
        closeUnloadScanner();
    };

    function processUnloadBarcode(barcode) {
        if (!currentUnloadOrder) {
            alert('No order selected');
            return;
        }
        
        // Find product with matching box barcode
        const product = currentUnloadOrder.products.find(p => 
            p.boxBarcode === barcode || p.boxBarcodeId === barcode
        );
        
        if (!product) {
            alert('Barcode not found in this order');
            return;
        }
        
        // Update product unloading status
        product.unloadingStatus = 'Unloaded';
        
        // Save to localStorage
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const orderIndex = savedOrders.findIndex(o => o.orderNumber === currentUnloadOrder.orderNumber);
        if (orderIndex !== -1) {
            savedOrders[orderIndex] = currentUnloadOrder;
            localStorage.setItem('orders', JSON.stringify(savedOrders));
        }
        
        // Refresh the display
        openUnloadOrderDetail(currentUnloadOrder.orderNumber);
        alert(`Box ${barcode} marked as Unloaded`);
    }

    // Submit unloading button
    const unloadSubmitBtn = document.getElementById('unload-submit-container');
    if (unloadSubmitBtn) {
        unloadSubmitBtn.addEventListener('click', function() {
            if (!currentUnloadOrder) {
                alert('No order selected');
                return;
            }
            
            // Check if all products are unloaded
            const allUnloaded = currentUnloadOrder.products.every(p => 
                p.unloadingStatus === 'Unloaded'
            );
            
            if (!allUnloaded) {
                alert('Not all boxes have been unloaded. Please scan all boxes first.');
                return;
            }
            
            // Update order status
            currentUnloadOrder.status = 'Unloaded';
            
            const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
            const orderIndex = savedOrders.findIndex(o => o.orderNumber === currentUnloadOrder.orderNumber);
            if (orderIndex !== -1) {
                savedOrders[orderIndex] = currentUnloadOrder;
                localStorage.setItem('orders', JSON.stringify(savedOrders));
            }
            
            alert('Unloading submitted successfully!');
            showUnloadOrderList();
            loadUnloadOrders();
        });
    }

    // Download buttons
    const unloadDownloadExcelBtn = document.getElementById('unload-download-excel');
    if (unloadDownloadExcelBtn) {
        unloadDownloadExcelBtn.addEventListener('click', function() {
            if (!currentUnloadOrder) {
                alert('No order selected');
                return;
            }
            
            let csvContent = 'Order Number,Client Name,Order Date,Country & City,Pin Code,Status\n';
            csvContent += `${currentUnloadOrder.orderNumber},${currentUnloadOrder.clientName || 'N/A'},${currentUnloadOrder.orderDate || ''},${currentUnloadOrder.countryPin || ''},${currentUnloadOrder.status || 'Pending'}\n\n`;
            
            csvContent += 'Product Details\n';
            csvContent += 'No.,Product MF ID,Product Barcode,Product Barcode ID,Product Name,Product QTY,Boxes QTY,Boxes Barcode,Boxes Barcode ID,Container Info,Unloading Status,Note\n';
            
            if (currentUnloadOrder.products && currentUnloadOrder.products.length > 0) {
                currentUnloadOrder.products.forEach((product, index) => {
                    csvContent += `${index + 1},${product.mfId || ''},${product.productBarcode || ''},${product.productBarcodeId || ''},${product.name || ''},${product.qty || ''},${product.boxesQty || ''},${product.boxBarcode || ''},${product.boxBarcodeId || ''},${product.containerInfo || ''},${product.unloadingStatus || 'Pending'},${product.note || ''}\n`;
                });
            }

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${currentUnloadOrder.orderNumber}_unloading.csv`;
            link.click();
        });
    }

    const unloadDownloadPdfBtn = document.getElementById('unload-download-pdf');
    if (unloadDownloadPdfBtn) {
        unloadDownloadPdfBtn.addEventListener('click', function() {
            if (!currentUnloadOrder) {
                alert('No order selected');
                return;
            }

            if (typeof window.jspdf === 'undefined') {
                alert('PDF library not loaded. Please try again later.');
                return;
            }

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            const countryPinParts = currentUnloadOrder.countryPin ? currentUnloadOrder.countryPin.split(',') : ['', ''];
            const location = countryPinParts[0] ? countryPinParts[0].trim() : '';
            const pinCode = countryPinParts[1] ? countryPinParts[1].trim() : '';
            
            doc.setFontSize(16);
            doc.text('Unloading Order Details', 105, 20, { align: 'center' });
            
            doc.setFontSize(12);
            let y = 40;
            doc.text(`Order Number: ${currentUnloadOrder.orderNumber}`, 20, y);
            y += 10;
            doc.text(`Client Name: ${currentUnloadOrder.clientName || 'N/A'}`, 20, y);
            y += 10;
            doc.text(`Order Date: ${currentUnloadOrder.orderDate || '-'}`, 20, y);
            y += 10;
            doc.text(`Country & City: ${location}`, 20, y);
            y += 10;
            doc.text(`Pin Code: ${pinCode}`, 20, y);
            y += 10;
            doc.text(`Status: ${currentUnloadOrder.status || 'Pending'}`, 20, y);
            
            y += 20;
            doc.setFontSize(14);
            doc.text('Product Details', 20, y);
            y += 10;
            
            doc.setFontSize(10);
            if (currentUnloadOrder.products && currentUnloadOrder.products.length > 0) {
                currentUnloadOrder.products.forEach((product, index) => {
                    if (y > 270) {
                        doc.addPage();
                        y = 20;
                    }
                    doc.text(`${index + 1}. ${product.name || 'N/A'} (MF ID: ${product.mfId || '-'})`, 20, y);
                    y += 6;
                    doc.text(`   QTY: ${product.qty || '-'} | Boxes: ${product.boxesQty || '-'} | Unloading Status: ${product.unloadingStatus || 'Pending'}`, 20, y);
                    y += 6;
                    doc.text(`   Box ID: ${product.boxBarcodeId || '-'} | Container: ${product.containerInfo || '-'}`, 20, y);
                    y += 10;
                });
            } else {
                doc.text('No products found', 20, y);
            }
            
            doc.save(`${currentUnloadOrder.orderNumber}_unloading.pdf`);
        });
    }

    loadClientOrders();
    loadUnloadOrders();
});