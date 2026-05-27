document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const submitExcelBtn = document.getElementById('submit-excel');
    const downloadExcelBtn = document.getElementById('download-excel');

    let currentOrder = null;
    let products = [];
    let boxes = [];
    let productCounter = 1;

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            // Re-setup file upload when upload-order tab is activated
            if (tabId === 'upload-order') {
                setupFileUpload();
            }
        });
    });

    const productTableBody = document.getElementById('product-table-body');

    if (submitExcelBtn) {
        submitExcelBtn.addEventListener('click', function() {
            submitCreateOrder();
        });
    }
    
    // Function to submit create order
    function submitCreateOrder() {
        const orderNumber = document.getElementById('order-number').value.trim();
        const clientName = document.getElementById('client-name').value.trim();
        const orderDate = document.getElementById('order-date').value;
        const countryPin = document.getElementById('country-pin').value.trim();
        
        if (!orderNumber || !clientName || !orderDate || !countryPin) {
            alert('Please fill in all required order fields');
            return;
        }
        
        // Collect products from create table
        const tableBody = document.getElementById('product-table-body');
        if (!tableBody || tableBody.querySelectorAll('.product-main-row').length === 0) {
            alert('Please add at least one product');
            return;
        }
        
        const products = collectProductsFromTable('product-table-body');
        
        const order = {
            orderNumber,
            clientName,
            orderDate,
            countryPin,
            status: 'Pending',
            createdAt: new Date().toISOString(),
            products
        };
        
        // Save to localStorage
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        savedOrders.push(order);
        localStorage.setItem('orders', JSON.stringify(savedOrders));
        
        // Reload order lists
        loadOrders();
        
        alert('Order submitted successfully!');
        
        // Clear the form
        document.getElementById('order-number').value = '';
        document.getElementById('client-name').value = '';
        document.getElementById('order-date').value = '';
        document.getElementById('country-pin').value = '';
        document.getElementById('country-name').value = '';
        document.getElementById('city-name').value = '';
        
        // Clear product table but keep the add row button
        const addRow = tableBody.querySelector('.add-row');
        tableBody.innerHTML = '';
        if (addRow) {
            tableBody.appendChild(addRow);
        }
    }

    const addRowBtn = document.getElementById('add-row-btn');
    if (addRowBtn) {
        addRowBtn.addEventListener('click', function() {
            addNewProductRow();
        });
    }

    const downloadBarcodeBtn = document.getElementById('download-barcode');
    if (downloadBarcodeBtn) {
        downloadBarcodeBtn.addEventListener('click', function() {
            downloadBarcodes();
        });
    }

    // Upload order page buttons
    const uploadSubmitExcelBtn = document.getElementById('upload-submit-excel');
    if (uploadSubmitExcelBtn) {
        uploadSubmitExcelBtn.addEventListener('click', function() {
            submitUploadOrder();
        });
    }
    
    // Function to submit upload order
    function submitUploadOrder() {
        const orderNumber = document.getElementById('upload-order-number').value.trim();
        const clientName = document.getElementById('upload-client-name').value.trim();
        const orderDate = document.getElementById('upload-order-date').value;
        const countryPin = document.getElementById('upload-country-pin').value.trim();
        
        if (!orderNumber || !clientName || !orderDate || !countryPin) {
            alert('Please fill in all required order fields');
            return;
        }
        
        // Collect products from upload table
        const tableBody = document.getElementById('uploaded-products-body');
        if (!tableBody || tableBody.querySelectorAll('.product-main-row').length === 0) {
            alert('Please upload an Excel file with product data');
            return;
        }
        
        const products = collectProductsFromTable('uploaded-products-body');
        
        const order = {
            orderNumber,
            clientName,
            orderDate,
            countryPin,
            status: 'Pending',
            createdAt: new Date().toISOString(),
            products
        };
        
        // Save to localStorage
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        savedOrders.push(order);
        localStorage.setItem('orders', JSON.stringify(savedOrders));
        
        // Reload order lists
        loadOrders();
        
        alert('Order submitted successfully!');
        
        // Clear the form
        document.getElementById('upload-order-number').value = '';
        document.getElementById('upload-client-name').value = '';
        document.getElementById('upload-order-date').value = '';
        document.getElementById('upload-country-pin').value = '';
        document.getElementById('upload-excel').value = '';
        document.getElementById('uploaded-data-table').style.display = 'none';
        tableBody.innerHTML = '';
    }

    const uploadDownloadBarcodeBtn = document.getElementById('upload-download-barcode');
    if (uploadDownloadBarcodeBtn) {
        uploadDownloadBarcodeBtn.addEventListener('click', function() {
            downloadBarcodes('uploaded-products-body');
        });
    }

    const uploadDownloadExcelBtn = document.getElementById('upload-download-excel');
    if (uploadDownloadExcelBtn) {
        uploadDownloadExcelBtn.addEventListener('click', function() {
            downloadUploadOrderExcel();
        });
    }

    window.addNewProductRow = function() {
        const productTableBody = document.getElementById('product-table-body');
        if (!productTableBody) return;

        // Remove any existing add row button
        const existingAddRow = productTableBody.querySelector('.add-row');
        if (existingAddRow) {
            existingAddRow.remove();
        }

        const rowCount = productTableBody.children.length + 1;
        // Generate unique Product Barcode ID with shorter format
        const shortTimestamp = Date.now().toString().slice(-6);
        const productBarcodeId = `PROD-${shortTimestamp}-${rowCount}`;
        // Create barcode using the Product Barcode ID as data
        const productBarcode = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(productBarcodeId)}&code=Code128&multiplebarcodes=false&translate-esc=false&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&qunit=Mm&width=100&height=50&quiet=0`;
        
        // Generate unique Box ID and barcode
        const boxId = `BOX-${shortTimestamp}-${rowCount}-1`;
        const boxBarcode = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(boxId)}&code=Code128&multiplebarcodes=false&translate-esc=false&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&qunit=Mm&width=100&height=50&quiet=0`;

        const newRow = document.createElement('tr');
        newRow.className = 'product-main-row';
        newRow.dataset.productId = productBarcodeId;
        newRow.innerHTML = `
            <td rowspan="1">${rowCount}</td>
            <td rowspan="1"><input type="text" class="table-input" placeholder="e.g., MF-001" data-field="mfId"></td>
            <td rowspan="1"><img src="${productBarcode}" alt="Product Barcode" class="qr-small" data-barcode-id="${productBarcodeId}"></td>
            <td rowspan="1" class="table-cell-auto">${productBarcodeId}</td>
            <td rowspan="1"><input type="text" class="table-input" placeholder="e.g., Plywood Sheet" data-field="name"></td>
            <td rowspan="1"><input type="number" class="table-input" min="1" placeholder="e.g., 10" data-field="qty"></td>
            <td><input type="number" class="table-input" min="1" value="1" data-field="boxesQty" onchange="handleBoxesQtyChange(this)"></td>
            <td><img src="${boxBarcode}" alt="Box Barcode" class="qr-small" data-barcode-id="${boxId}"></td>
            <td class="table-cell-auto">${boxId}</td>
            <td><input type="text" class="table-input" placeholder="e.g., CON-2024-001" data-field="containerInfo"></td>
            <td>
                <div class="multi-select-dropdown">
                    <div class="multi-select-trigger" onclick="toggleMultiSelect(this)">Select Status</div>
                    <div class="multi-select-options">
                        <label><input type="checkbox" value="Making"> Making</label>
                        <label><input type="checkbox" value="Packed"> Packed</label>
                        <label><input type="checkbox" value="Labeled"> Labeled</label>
                        <label><input type="checkbox" value="In Factory"> In Factory</label>
                        <label><input type="checkbox" value="In Warehouse"> In Warehouse</label>
                        <label><input type="checkbox" value="In Container"> In Container</label>
                    </div>
                    <input type="hidden" class="table-input" data-field="status">
                </div>
            </td>
            <td><input type="text" class="table-input" placeholder="Additional notes" data-field="note"></td>
            <td><button type="button" class="btn btn-delete" onclick="deleteRow(this)">🗑️</button></td>
        `;
        productTableBody.appendChild(newRow);

        // Add hover functionality to barcode images
        const barcodeImages = newRow.querySelectorAll('img[data-barcode-id]');
        barcodeImages.forEach(function(img) {
            img.addEventListener('mouseenter', function(e) {
                showBarcodeTooltip(e, this);
            });
            img.addEventListener('mouseleave', function() {
                hideBarcodeTooltip();
            });
        });
        
        // Add hover functionality to input fields
        const inputFields = newRow.querySelectorAll('input.table-input');
        inputFields.forEach(function(input) {
            input.addEventListener('mouseenter', function(e) {
                const content = input.value.trim() || input.placeholder;
                if (content) {
                    showInputPopup(e, input, content);
                }
            });
            input.addEventListener('mouseleave', function() {
                hideInputPopup();
            });
            
            // Update popup when input value changes
            input.addEventListener('input', function() {
                const popup = document.querySelector('.cell-popup[data-input]');
                if (popup && popup.dataset.input === input.dataset.field) {
                    const content = input.value.trim() || input.placeholder;
                    if (content) {
                        popup.querySelector('.popup-content').textContent = content;
                    } else {
                        hideInputPopup();
                    }
                }
            });
        });

        // Setup multi-select for the new row
        setupMultiSelect(newRow);

        // Add new add row button
        const addRow = document.createElement('tr');
        addRow.className = 'add-row';
        addRow.innerHTML = `
            <td><button type="button" class="btn btn-add" onclick="addNewProductRow()">+</button></td>
            <td colspan="11" class="add-row-message">Click "+" to add a new product row</td>
        `;
        productTableBody.appendChild(addRow);
    }

    window.handleBoxesQtyChange = function(input) {
        const mainRow = input.closest('.product-main-row');
        const productId = mainRow.dataset.productId;
        const newBoxesQty = parseInt(input.value) || 1;
        
        // Determine which table we're in
        const tableBody = mainRow.closest('tbody');
        const isUploadTable = tableBody.id === 'uploaded-products-body';
        
        // Update rowspan on main row cells (first 7 columns: No. through Boxes QTY)
        const mainCells = mainRow.querySelectorAll('td');
        for (let i = 0; i < 7; i++) {
            if (mainCells[i]) {
                mainCells[i].rowSpan = newBoxesQty;
            }
        }
        
        // Remove existing additional box rows
        let nextRow = mainRow.nextElementSibling;
        while (nextRow && nextRow.classList.contains('product-box-row') && nextRow.dataset.productId === productId) {
            const rowToRemove = nextRow;
            nextRow = nextRow.nextElementSibling;
            rowToRemove.remove();
        }
        
        // Add new box rows if needed
        if (newBoxesQty > 1) {
            const shortTimestamp = Date.now().toString().slice(-6);
            const rowCount = mainRow.cells[0].textContent;
            
            for (let i = 2; i <= newBoxesQty; i++) {
                const boxId = `BOX-${shortTimestamp}-${rowCount}-${i}`;
                const boxBarcode = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(boxId)}&code=Code128&multiplebarcodes=false&translate-esc=false&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&qunit=Mm&width=100&height=50&quiet=0`;
                
                const boxRow = document.createElement('tr');
                boxRow.className = 'product-box-row';
                boxRow.dataset.productId = productId;
                
                // Box row structure: Boxes Barcode, Boxes Barcode ID, Container Info, Product Status, Note, Action
                // For upload table, we need to include all columns including Action
                boxRow.innerHTML = `
                    <td><img src="${boxBarcode}" alt="Box Barcode" class="qr-small" data-barcode-id="${boxId}"></td>
                    <td class="table-cell-auto">${boxId}</td>
                    <td><input type="text" class="table-input" placeholder="e.g., CON-2024-001" data-field="containerInfo"></td>
                    <td>
                        <div class="multi-select-dropdown">
                            <div class="multi-select-trigger" onclick="toggleMultiSelect(this)">Select Status</div>
                            <div class="multi-select-options">
                                <label><input type="checkbox" value="Making"> Making</label>
                                <label><input type="checkbox" value="Packed"> Packed</label>
                                <label><input type="checkbox" value="Labeled"> Labeled</label>
                                <label><input type="checkbox" value="In Factory"> In Factory</label>
                                <label><input type="checkbox" value="In Warehouse"> In Warehouse</label>
                                <label><input type="checkbox" value="In Container"> In Container</label>
                            </div>
                            <input type="hidden" class="table-input" data-field="status">
                        </div>
                    </td>
                    <td><input type="text" class="table-input" placeholder="Additional notes" data-field="note"></td>
                    <td><button type="button" class="btn btn-delete" onclick="deleteRow(this)">🗑️</button></td>
                `;
                
                // Insert the box row after the main row or the last box row
                let insertAfterRow = mainRow;
                let currentNextRow = mainRow.nextElementSibling;
                while (currentNextRow && currentNextRow.classList.contains('product-box-row') && currentNextRow.dataset.productId === productId) {
                    insertAfterRow = currentNextRow;
                    currentNextRow = currentNextRow.nextElementSibling;
                }
                
                insertAfterRow.after(boxRow);
                
                // Add hover functionality to barcode images
                const barcodeImage = boxRow.querySelector('img[data-barcode-id]');
                if (barcodeImage) {
                    barcodeImage.addEventListener('mouseenter', function(e) {
                        showBarcodeTooltip(e, this);
                    });
                    barcodeImage.addEventListener('mouseleave', function() {
                        hideBarcodeTooltip();
                    });
                }
                
                // Add hover functionality to input fields
                const inputFields = boxRow.querySelectorAll('input.table-input');
                inputFields.forEach(function(input) {
                    input.addEventListener('mouseenter', function(e) {
                        const content = input.value.trim() || input.placeholder;
                        if (content) {
                            showInputPopup(e, input, content);
                        }
                    });
                    input.addEventListener('mouseleave', function() {
                        hideInputPopup();
                    });
                    
                    // Update popup when input value changes
                    input.addEventListener('input', function() {
                        const popup = document.querySelector('.input-popup');
                        if (popup && popup.dataset.input === input.dataset.field) {
                            const content = input.value.trim() || input.placeholder;
                            if (content) {
                                popup.querySelector('.popup-content').textContent = content;
                            } else {
                                hideInputPopup();
                            }
                        }
                    });
                });
                
                // Setup multi-select for the new row
                setupMultiSelect(boxRow);
            }
        }
    }

    window.updateBoxNumbers = function() {
        // Update box numbers for both tables
        const productTableBody = document.getElementById('product-table-body');
        const uploadTableBody = document.getElementById('uploaded-products-body');
        
        if (productTableBody) {
            updateTableBoxNumbers(productTableBody);
        }
        
        if (uploadTableBody) {
            updateTableBoxNumbers(uploadTableBody);
        }
    }
    
    function updateTableBoxNumbers(tableBody) {
        const productRows = tableBody.querySelectorAll('.product-main-row');
        
        productRows.forEach((mainRow, mainIndex) => {
            const productId = mainRow.dataset.productId;
            const rowNumber = mainIndex + 1;
            
            // Update main row box number (cell 8 contains the box ID)
            const mainBoxCell = mainRow.cells[8];
            if (!mainBoxCell) return;
            
            const mainBoxId = mainBoxCell.textContent.trim();
            if (mainBoxId && mainBoxId.startsWith('BOX-')) {
                // Extract timestamp from existing box ID
                const timestampMatch = mainBoxId.match(/BOX-(\d{6})-/);
                const timestamp = timestampMatch ? timestampMatch[1] : Date.now().toString().slice(-6);
                
                const newMainBoxId = `BOX-${timestamp}-${rowNumber}-1`;
                const newMainBoxBarcode = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(newMainBoxId)}&code=Code128&multiplebarcodes=false&translate-esc=false&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&qunit=Mm&width=100&height=50&quiet=0`;
                
                // Update box ID in cell
                mainBoxCell.textContent = newMainBoxId;
                
                // Update barcode image - find the box barcode image (second img in the row)
                const barcodeImages = mainRow.querySelectorAll('img[data-barcode-id]');
                if (barcodeImages.length >= 2) {
                    const boxBarcodeImg = barcodeImages[1];
                    boxBarcodeImg.src = newMainBoxBarcode;
                    boxBarcodeImg.setAttribute('data-barcode-id', newMainBoxId);
                }
            }
            
            // Update box rows
            let boxCount = 2;
            let nextRow = mainRow.nextElementSibling;
            while (nextRow && nextRow.classList.contains('product-box-row') && nextRow.dataset.productId === productId) {
                // For box rows, the box ID is in cell 1
                const boxCell = nextRow.cells[1];
                if (!boxCell) {
                    boxCount++;
                    nextRow = nextRow.nextElementSibling;
                    continue;
                }
                
                const boxId = boxCell.textContent.trim();
                if (boxId && boxId.startsWith('BOX-')) {
                    // Extract timestamp from existing box ID
                    const timestampMatch = boxId.match(/BOX-(\d{6})-/);
                    const timestamp = timestampMatch ? timestampMatch[1] : Date.now().toString().slice(-6);
                    
                    const newBoxId = `BOX-${timestamp}-${rowNumber}-${boxCount}`;
                    const newBoxBarcode = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(newBoxId)}&code=Code128&multiplebarcodes=false&translate-esc=false&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&qunit=Mm&width=100&height=50&quiet=0`;
                    
                    // Update box ID in cell
                    boxCell.textContent = newBoxId;
                    
                    // Update barcode image
                    const barcodeImg = nextRow.querySelector('img[data-barcode-id]');
                    if (barcodeImg) {
                        barcodeImg.src = newBoxBarcode;
                        barcodeImg.setAttribute('data-barcode-id', newBoxId);
                    }
                }
                
                boxCount++;
                nextRow = nextRow.nextElementSibling;
            }
        });
    }

    window.deleteRow = function(button) {
        const row = button.closest('tr');
        const isMainRow = row.classList.contains('product-main-row');
        const isBoxRow = row.classList.contains('product-box-row');
        const productId = row.dataset.productId;
        
        console.log('Delete button clicked:', {
            rowClass: row.className,
            isMainRow,
            isBoxRow,
            productId
        });
        
        if (isMainRow) {
            console.log('Deleting main row');
            // Remove all box rows associated with this product
            let nextRow = row.nextElementSibling;
            while (nextRow && nextRow.classList.contains('product-box-row') && nextRow.dataset.productId === productId) {
                const rowToRemove = nextRow;
                nextRow = nextRow.nextElementSibling;
                rowToRemove.remove();
            }
            // Remove the main row
            row.remove();
        } else if (isBoxRow) {
            console.log('Deleting box row');
            // Get the main product row by traversing up
            let mainRow = row.previousElementSibling;
            console.log('Starting to find main row from:', mainRow);
            while (mainRow && !mainRow.classList.contains('product-main-row')) {
                mainRow = mainRow.previousElementSibling;
                console.log('Moving up to:', mainRow);
            }
            
            console.log('Found main row:', mainRow);
            if (mainRow) {
                console.log('Main row productId:', mainRow.dataset.productId);
                // Remove the current box row
                row.remove();
                
                // Count remaining box rows (main row + box rows)
                let boxCount = 1; // Start with 1 for the main row
                let nextRow = mainRow.nextElementSibling;
                console.log('Starting to count box rows from:', nextRow);
                
                while (nextRow && nextRow.classList.contains('product-box-row') && nextRow.dataset.productId === productId) {
                    boxCount++;
                    console.log('Found box row, count now:', boxCount);
                    nextRow = nextRow.nextElementSibling;
                }
                
                console.log('Final box count:', boxCount);
                
                // Update Boxes QTY input
                const boxesQtyInput = mainRow.querySelector('input[data-field="boxesQty"]');
                console.log('Found boxesQtyInput:', boxesQtyInput);
                if (boxesQtyInput) {
                    console.log('Current boxesQtyInput value:', boxesQtyInput.value);
                    boxesQtyInput.value = boxCount;
                    console.log('Updated boxesQtyInput value:', boxesQtyInput.value);
                    // Trigger the handleBoxesQtyChange function to ensure consistency
                    console.log('Calling handleBoxesQtyChange');
                    handleBoxesQtyChange(boxesQtyInput);
                }
            } else {
                console.log('Main row not found, just removing box row');
                // If main row not found, just remove the box row
                row.remove();
            }
        } else {
            console.log('Deleting other row');
            // Remove the current row
            row.remove();
        }
        
        // Update row numbers for both tables
        const productTableBody = document.getElementById('product-table-body');
        const uploadTableBody = document.getElementById('uploaded-products-body');
        
        if (productTableBody) {
            const productRows = productTableBody.querySelectorAll('.product-main-row');
            productRows.forEach((row, index) => {
                if (row.cells[0]) {
                    row.cells[0].textContent = index + 1;
                }
            });
        }
        
        if (uploadTableBody) {
            const uploadRows = uploadTableBody.querySelectorAll('.product-main-row');
            uploadRows.forEach((row, index) => {
                if (row.cells[0]) {
                    row.cells[0].textContent = index + 1;
                }
            });
        }
        
        // Update box numbers for all products
        updateBoxNumbers();
    }



    downloadExcelBtn.addEventListener('click', async function() {
        const orderNumber = document.getElementById('order-number').value.trim();
        const clientName = document.getElementById('client-name').value.trim();
        const orderDate = document.getElementById('order-date').value;
        const countryPin = document.getElementById('country-pin').value.trim();

        if (!orderNumber || !clientName || !orderDate || !countryPin) {
            alert('Please fill in all required order fields');
            return;
        }

        currentOrder = {
            orderNumber,
            clientName,
            orderDate,
            countryPin,
            status: 'Pending',
            createdAt: new Date().toISOString()
        };

        // Collect data from table rows
        const productTableBody = document.getElementById('product-table-body');
        const mainRows = productTableBody.querySelectorAll('.product-main-row');

        // Create workbook using ExcelJS
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Products');

        // Add headers
        worksheet.columns = [
            { header: 'Order Number', key: 'orderNumber', width: 15 },
            { header: 'Client Name', key: 'clientName', width: 20 },
            { header: 'Order Date', key: 'orderDate', width: 12 },
            { header: 'Country Pin', key: 'countryPin', width: 15 },
            { header: 'No.', key: 'no', width: 5 },
            { header: 'Product MF ID', key: 'mfId', width: 15 },
            { header: 'Product Barcode', key: 'productBarcode', width: 20 },
            { header: 'Product Barcode ID', key: 'productQrId', width: 20 },
            { header: 'Product Name', key: 'name', width: 20 },
            { header: 'Product QTY', key: 'qty', width: 10 },
            { header: 'Boxes QTY', key: 'boxesQty', width: 10 },
            { header: 'Boxes Barcode', key: 'boxBarcode', width: 20 },
            { header: 'Boxes Barcode ID', key: 'boxes', width: 20 },
            { header: 'Container Info', key: 'containerInfo', width: 20 },
            { header: 'Product Status', key: 'status', width: 12 },
            { header: 'Note', key: 'note', width: 30 }
        ];

        let excelRowIndex = 1;

        // Process each main product row and its associated box rows
        mainRows.forEach((mainRow, mainIndex) => {
            const productId = mainRow.dataset.productId;
            const mainInputs = mainRow.querySelectorAll('.table-input');
            
            // Get auto-filled values from main row cells
            const productBarcodeId = mainRow.cells[3].textContent.trim();
            const mainBoxId = mainRow.cells[8].textContent.trim();
            
            // Get selected status values from main row multi-select dropdown
            const mainStatusHiddenInput = mainRow.querySelector('input[data-field="status"]');
            let mainStatusValue = '';
            if (mainStatusHiddenInput) {
                mainStatusValue = mainStatusHiddenInput.value;
            }
            
            // Get product information from main row
            const productInfo = {
                orderNumber: currentOrder.orderNumber,
                clientName: currentOrder.clientName,
                orderDate: currentOrder.orderDate,
                countryPin: currentOrder.countryPin,
                no: mainIndex + 1,
                mfId: mainInputs[0].value.trim(),
                productBarcode: '',
                productQrId: productBarcodeId,
                name: mainInputs[1].value.trim(),
                qty: mainInputs[2].value.trim(),
                boxesQty: mainInputs[3].value.trim(),
                boxBarcode: '',
                boxes: mainBoxId,
                containerInfo: mainInputs[4].value.trim(),
                status: mainStatusValue,
                note: mainInputs.length > 6 ? mainInputs[6].value.trim() : ''
            };

            // Add main row to worksheet
            const mainExcelRow = worksheet.addRow(productInfo);
            const mainRowIndex = mainExcelRow.number;
            excelRowIndex++;

            // Generate product barcode image using JsBarcode
            if (productBarcodeId) {
                try {
                    const canvas = document.createElement('canvas');
                    JsBarcode(canvas, productBarcodeId, {
                        format: 'CODE128',
                        width: 2,
                        height: 50,
                        displayValue: true,
                        fontSize: 12,
                        margin: 5
                    });
                    
                    const base64Image = canvas.toDataURL('image/png').split(',')[1];
                    const imageBuffer = Uint8Array.from(atob(base64Image), c => c.charCodeAt(0));
                    
                    const imageId = workbook.addImage({
                        buffer: imageBuffer,
                        extension: 'png'
                    });
                    worksheet.addImage(imageId, {
                        tl: { col: 6, row: mainRowIndex - 1 },
                        ext: { width: 150, height: 60 }
                    });
                    worksheet.getRow(mainRowIndex).height = 50;
                } catch (error) {
                    console.error('Error generating product barcode:', error);
                }
            }

            // Generate box barcode image for main row
            if (mainBoxId) {
                try {
                    const canvas = document.createElement('canvas');
                    JsBarcode(canvas, mainBoxId, {
                        format: 'CODE128',
                        width: 2,
                        height: 50,
                        displayValue: true,
                        fontSize: 12,
                        margin: 5
                    });
                    
                    const base64Image = canvas.toDataURL('image/png').split(',')[1];
                    const imageBuffer = Uint8Array.from(atob(base64Image), c => c.charCodeAt(0));
                    
                    const imageId = workbook.addImage({
                        buffer: imageBuffer,
                        extension: 'png'
                    });
                    worksheet.addImage(imageId, {
                        tl: { col: 11, row: mainRowIndex - 1 },
                        ext: { width: 150, height: 60 }
                    });
                } catch (error) {
                    console.error('Error generating box barcode:', error);
                }
            }

            // Count box rows
            let boxCount = 0;
            let nextRow = mainRow.nextElementSibling;
            while (nextRow && nextRow.classList.contains('product-box-row') && nextRow.dataset.productId === productId) {
                boxCount++;
                nextRow = nextRow.nextElementSibling;
            }

            // Process additional box rows
            nextRow = mainRow.nextElementSibling;
            let currentBoxRow = 1;
            while (nextRow && nextRow.classList.contains('product-box-row') && nextRow.dataset.productId === productId) {
                const boxInputs = nextRow.querySelectorAll('.table-input');
                const boxId = nextRow.cells[1].textContent.trim();
                
                // Get selected status values from box row multi-select dropdown
                const boxStatusHiddenInput = nextRow.querySelector('input[data-field="status"]');
                let boxStatusValue = '';
                if (boxStatusHiddenInput) {
                    boxStatusValue = boxStatusHiddenInput.value;
                }
                
                // Create box row data with product information
                const boxRowData = {
                    orderNumber: currentOrder.orderNumber,
                    clientName: currentOrder.clientName,
                    orderDate: currentOrder.orderDate,
                    countryPin: currentOrder.countryPin,
                    no: '',
                    mfId: '',
                    productBarcode: '',
                    productQrId: '',
                    name: '',
                    qty: '',
                    boxesQty: '',
                    boxBarcode: '',
                    boxes: boxId,
                    containerInfo: boxInputs[0].value.trim(),
                    status: boxStatusValue,
                    note: boxInputs.length > 2 ? boxInputs[2].value.trim() : ''
                };

                // Add box row to worksheet
                const boxExcelRow = worksheet.addRow(boxRowData);
                const boxRowIndex = boxExcelRow.number;
                excelRowIndex++;

                // Generate box barcode image for box row
                if (boxId) {
                    try {
                        const canvas = document.createElement('canvas');
                        JsBarcode(canvas, boxId, {
                            format: 'CODE128',
                            width: 2,
                            height: 50,
                            displayValue: true,
                            fontSize: 12,
                            margin: 5
                        });
                        
                        const base64Image = canvas.toDataURL('image/png').split(',')[1];
                        const imageBuffer = Uint8Array.from(atob(base64Image), c => c.charCodeAt(0));
                        
                        const imageId = workbook.addImage({
                            buffer: imageBuffer,
                            extension: 'png'
                        });
                        worksheet.addImage(imageId, {
                            tl: { col: 11, row: boxRowIndex - 1 },
                            ext: { width: 150, height: 60 }
                        });
                    } catch (error) {
                        console.error('Error generating box barcode:', error);
                    }
                }

                currentBoxRow++;
                nextRow = nextRow.nextElementSibling;
            }

            // Merge cells for main product information if there are box rows
            if (boxCount > 0) {
                const mergeEndRow = mainRowIndex + boxCount;
                
                // Merge Order Number
                worksheet.mergeCells(`A${mainRowIndex}:A${mergeEndRow}`);
                // Merge Client Name
                worksheet.mergeCells(`B${mainRowIndex}:B${mergeEndRow}`);
                // Merge Order Date
                worksheet.mergeCells(`C${mainRowIndex}:C${mergeEndRow}`);
                // Merge Country Pin
                worksheet.mergeCells(`D${mainRowIndex}:D${mergeEndRow}`);
                // Merge No.
                worksheet.mergeCells(`E${mainRowIndex}:E${mergeEndRow}`);
                // Merge Product MF ID
                worksheet.mergeCells(`F${mainRowIndex}:F${mergeEndRow}`);
                // Merge Product Barcode
                worksheet.mergeCells(`G${mainRowIndex}:G${mergeEndRow}`);
                // Merge Product Barcode ID
                worksheet.mergeCells(`H${mainRowIndex}:H${mergeEndRow}`);
                // Merge Product Name
                worksheet.mergeCells(`I${mainRowIndex}:I${mergeEndRow}`);
                // Merge Product QTY
                worksheet.mergeCells(`J${mainRowIndex}:J${mergeEndRow}`);
                // Merge Boxes QTY
                worksheet.mergeCells(`K${mainRowIndex}:K${mergeEndRow}`);
            }
        });

        // Generate Excel file and download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${currentOrder.orderNumber}_products.xlsx`;
        link.click();
    });

    // Function to collect products from a table
    function collectProductsFromTable(tableBodyId) {
        const tableBody = document.getElementById(tableBodyId);
        if (!tableBody) return [];
        
        const products = [];
        const mainRows = tableBody.querySelectorAll('.product-main-row');
        
        mainRows.forEach((mainRow, index) => {
            const productId = mainRow.dataset.productId;
            const inputs = mainRow.querySelectorAll('.table-input');
            
            // Get status from multi-select dropdown
            const statusHiddenInput = mainRow.querySelector('input[data-field="status"]');
            let statusValue = '';
            if (statusHiddenInput) {
                statusValue = statusHiddenInput.value;
            }
            
            // Get box barcode ID from the row
            const boxBarcodeCell = mainRow.cells[8];
            const boxBarcodeId = boxBarcodeCell ? boxBarcodeCell.textContent.trim() : '';
            
            // Get product barcode ID from the row
            const productBarcodeCell = mainRow.cells[3];
            const productBarcodeId = productBarcodeCell ? productBarcodeCell.textContent.trim() : '';
            
            const product = {
                no: index + 1,
                mfId: inputs[0] ? inputs[0].value.trim() : '',
                productBarcodeId: productBarcodeId,
                name: inputs[1] ? inputs[1].value.trim() : '',
                qty: inputs[2] ? inputs[2].value.trim() : '',
                boxesQty: inputs[3] ? inputs[3].value.trim() : '1',
                boxBarcodeId: boxBarcodeId,
                containerInfo: inputs[4] ? inputs[4].value.trim() : '',
                status: statusValue,
                note: inputs[6] ? inputs[6].value.trim() : ''
            };
            
            products.push(product);
            
            // Process additional box rows
            let nextRow = mainRow.nextElementSibling;
            while (nextRow && nextRow.classList.contains('product-box-row') && nextRow.dataset.productId === productId) {
                const boxInputs = nextRow.querySelectorAll('.table-input');
                const boxId = nextRow.cells[1].textContent.trim();
                
                // Get selected status values from box row multi-select dropdown
                const boxStatusHiddenInput = nextRow.querySelector('input[data-field="status"]');
                let boxStatusValue = '';
                if (boxStatusHiddenInput) {
                    boxStatusValue = boxStatusHiddenInput.value;
                }
                
                // Create box row data with product information
                const boxRowData = {
                    no: '',
                    mfId: '',
                    productBarcodeId: '',
                    name: '',
                    qty: '',
                    boxesQty: '',
                    boxBarcodeId: boxId,
                    containerInfo: boxInputs[0] ? boxInputs[0].value.trim() : '',
                    status: boxStatusValue,
                    note: boxInputs[1] ? boxInputs[1].value.trim() : ''
                };
                
                products.push(boxRowData);
                nextRow = nextRow.nextElementSibling;
            }
        });
        
        return products;
    }

    function loadOrders() {
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        
        // Load orders into Revise Orders table
        const reviseOrdersBody = document.getElementById('revise-orders-body');
        if (reviseOrdersBody) {
            if (savedOrders.length === 0) {
                reviseOrdersBody.innerHTML = '<tr><td colspan="6" class="no-data">No orders found</td></tr>';
            } else {
                reviseOrdersBody.innerHTML = savedOrders.map(order => `
                    <tr onclick="openReviseOrderDetail('${order.orderNumber}')">
                        <td class="order-number">${order.orderNumber}</td>
                        <td>${order.clientName}</td>
                        <td>${order.orderDate}</td>
                        <td>${order.countryPin}</td>
                        <td><span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span></td>
                        <td>
                            <button class="btn btn-small" onclick="event.stopPropagation(); openReviseOrderDetail('${order.orderNumber}')">
                                <i class="fas fa-edit"></i> Revise
                            </button>
                        </td>
                    </tr>
                `).join('');
            }
        }
        
        // Load orders into Loading to Container table (show all submitted orders)
        const loadingOrdersBody = document.getElementById('loading-orders-body');
        const loadingOrdersMobile = document.getElementById('loading-orders-mobile');
        if (loadingOrdersBody) {
            const loadingOrders = savedOrders.filter(order => 
                order.status === 'Pending' || order.status === 'Processing' || order.status === 'Ready for Loading' || order.status === 'Loaded'
            );
            if (loadingOrders.length === 0) {
                loadingOrdersBody.innerHTML = '<tr><td colspan="6" class="no-data">No orders ready for loading</td></tr>';
                if (loadingOrdersMobile) {
                    loadingOrdersMobile.innerHTML = '<div class="no-data">No orders ready for loading</div>';
                }
            } else {
                // Desktop table
                loadingOrdersBody.innerHTML = loadingOrders.map(order => {
                    const isLoaded = order.status === 'Loaded';
                    return `
                        <tr onclick="openLoadingOrderDetail('${order.orderNumber}')">
                            <td class="order-number">${order.orderNumber}</td>
                            <td>${order.clientName}</td>
                            <td>${order.orderDate}</td>
                            <td>${order.countryPin}</td>
                            <td><span class="status-badge status-${isLoaded ? 'completed' : 'processing'}">${isLoaded ? 'Loaded' : 'Ready for Loading'}</span></td>
                            <td>
                                <button class="btn btn-small" onclick="event.stopPropagation(); openLoadingOrderDetail('${order.orderNumber}')">
                                    <i class="fas fa-box"></i> ${isLoaded ? 'View' : 'Load'}
                                </button>
                            </td>
                        </tr>
                    `;
                }).join('');
                
                // Mobile cards
                if (loadingOrdersMobile) {
                    loadingOrdersMobile.innerHTML = loadingOrders.map(order => {
                        const isLoaded = order.status === 'Loaded';
                        const countryPinParts = order.countryPin ? order.countryPin.split(',') : ['', ''];
                        const location = countryPinParts[0] ? countryPinParts[0].trim() : '';
                        const pinCode = countryPinParts[1] ? countryPinParts[1].trim() : '';
                        
                        return `
                            <div class="mobile-order-card" onclick="openLoadingOrderDetail('${order.orderNumber}')">
                                <div class="order-header">
                                    <span class="order-number">${order.orderNumber}</span>
                                    <span class="status-badge status-${isLoaded ? 'completed' : 'processing'}">${isLoaded ? 'Loaded' : 'Ready'}</span>
                                </div>
                                <div class="order-info">
                                    <div class="order-info-item">
                                        <span class="order-info-label">Client</span>
                                        <span class="order-info-value">${order.clientName}</span>
                                    </div>
                                    <div class="order-info-item">
                                        <span class="order-info-label">Date</span>
                                        <span class="order-info-value">${order.orderDate}</span>
                                    </div>
                                    <div class="order-info-item">
                                        <span class="order-info-label">Location</span>
                                        <span class="order-info-value">${location}</span>
                                    </div>
                                    <div class="order-info-item">
                                        <span class="order-info-label">Pin Code</span>
                                        <span class="order-info-value">${pinCode}</span>
                                    </div>
                                </div>
                                <div class="order-actions">
                                    <button class="btn btn-submit" onclick="event.stopPropagation(); openLoadingOrderDetail('${order.orderNumber}')">
                                        <i class="fas fa-box"></i> ${isLoaded ? 'View' : 'Load Container'}
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('');
                }
            }
        }
        
        // Load orders into View Orders table (all orders)
        const allOrdersBody = document.getElementById('all-orders-body');
        const allOrdersMobile = document.getElementById('all-orders-mobile');
        if (allOrdersBody) {
            if (savedOrders.length === 0) {
                allOrdersBody.innerHTML = '<tr><td colspan="6" class="no-data">No orders found</td></tr>';
                if (allOrdersMobile) {
                    allOrdersMobile.innerHTML = '<div class="no-data">No orders found</div>';
                }
            } else {
                // Desktop table
                allOrdersBody.innerHTML = savedOrders.map(order => `
                    <tr onclick="openViewOrderDetail('${order.orderNumber}')">
                        <td class="order-number">${order.orderNumber}</td>
                        <td>${order.clientName}</td>
                        <td>${order.orderDate}</td>
                        <td>${order.countryPin}</td>
                        <td><span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span></td>
                        <td>
                            <button class="btn btn-small" onclick="event.stopPropagation(); openViewOrderDetail('${order.orderNumber}')">
                                <i class="fas fa-eye"></i> View
                            </button>
                        </td>
                    </tr>
                `).join('');
                
                // Mobile cards
                if (allOrdersMobile) {
                    allOrdersMobile.innerHTML = savedOrders.map(order => {
                        const countryPinParts = order.countryPin ? order.countryPin.split(',') : ['', ''];
                        const location = countryPinParts[0] ? countryPinParts[0].trim() : '';
                        const pinCode = countryPinParts[1] ? countryPinParts[1].trim() : '';
                        
                        return `
                            <div class="mobile-order-card" onclick="openViewOrderDetail('${order.orderNumber}')">
                                <div class="order-header">
                                    <span class="order-number">${order.orderNumber}</span>
                                    <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span>
                                </div>
                                <div class="order-info">
                                    <div class="order-info-item">
                                        <span class="order-info-label">Client</span>
                                        <span class="order-info-value">${order.clientName}</span>
                                    </div>
                                    <div class="order-info-item">
                                        <span class="order-info-label">Date</span>
                                        <span class="order-info-value">${order.orderDate}</span>
                                    </div>
                                    <div class="order-info-item">
                                        <span class="order-info-label">Location</span>
                                        <span class="order-info-value">${location}</span>
                                    </div>
                                    <div class="order-info-item">
                                        <span class="order-info-label">Pin Code</span>
                                        <span class="order-info-value">${pinCode}</span>
                                    </div>
                                </div>
                                <div class="order-actions">
                                    <button class="btn btn-submit" onclick="event.stopPropagation(); openViewOrderDetail('${order.orderNumber}')">
                                        <i class="fas fa-eye"></i> View Details
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('');
                }
            }
        }
    }

    window.viewOrder = function(orderNumber) {
        alert(`View order: ${orderNumber} - Feature coming soon`);
    };

    function showBarcodeTooltip(event, imgElement) {
        // Remove any existing tooltip
        hideBarcodeTooltip();
        
        const barcodeId = imgElement.getAttribute('data-barcode-id');
        const barcodeSrc = imgElement.src;
        
        // Create larger barcode URL
        const largerBarcodeSrc = barcodeSrc.replace('width=100', 'width=300').replace('height=50', 'height=150');
        
        const tooltip = document.createElement('div');
        tooltip.id = 'barcode-tooltip';
        tooltip.innerHTML = `
            <img src="${largerBarcodeSrc}" alt="Barcode" style="max-width: 300px; margin-bottom: 10px;">
            <div style="font-weight: 600; margin-bottom: 0.5rem; color: var(--secondary-color);">
                <i class="fas fa-barcode" style="color: var(--primary-color); margin-right: 0.5rem;"></i>
                Barcode ID
            </div>
            <div style="line-height: 1.6; color: var(--text-color);">${barcodeId}</div>
        `;
        
        // Position tooltip near the image
        const rect = imgElement.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.bottom + 10}px`;
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.zIndex = '10000';
        tooltip.style.background = 'white';
        tooltip.style.padding = '10px';
        tooltip.style.border = '1px solid #ddd';
        tooltip.style.borderRadius = '5px';
        tooltip.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        
        document.body.appendChild(tooltip);
        
        // Add show class after a small delay to trigger animation
        setTimeout(() => {
            tooltip.classList.add('show');
        }, 10);
        
        // Add mouseleave event listener to the tooltip itself
        tooltip.addEventListener('mouseleave', hideBarcodeTooltip);
    }

    function hideBarcodeTooltip() {
        const tooltip = document.getElementById('barcode-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }
    
    // Input field hover popup functions
    function showInputPopup(event, input, content) {
        // Remove any existing popup
        hideInputPopup();
        
        const popup = document.createElement('div');
        popup.className = 'cell-popup';
        popup.dataset.input = input.dataset.field;
        popup.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 0.5rem; color: var(--secondary-color);">
                <i class="fas fa-info-circle" style="color: var(--primary-color); margin-right: 0.5rem;"></i>
                ${input.dataset.field.charAt(0).toUpperCase() + input.dataset.field.slice(1)}
            </div>
            <div class="popup-content" style="line-height: 1.6; color: var(--text-color);">${content}</div>
        `;
        
        // Position the popup relative to input
        const rect = input.getBoundingClientRect();
        popup.style.position = 'fixed';
        popup.style.left = `${rect.left + rect.width / 2}px`;
        popup.style.top = `${rect.bottom + 10}px`;
        popup.style.transform = 'translateX(-50%)';
        popup.style.zIndex = '10000';
        
        document.body.appendChild(popup);
        
        // Add show class after a small delay to trigger animation
        setTimeout(() => {
            popup.classList.add('show');
        }, 10);
        
        // Add mouseleave event listener to the popup
        popup.addEventListener('mouseleave', function() {
            hideInputPopup();
        });
    }
    
    function hideInputPopup() {
        const popup = document.querySelector('.cell-popup[data-input]');
        if (popup) {
            popup.classList.remove('show');
            setTimeout(() => {
                popup.remove();
            }, 300);
        }
    }

    function downloadBarcodes(tableBodyId = 'product-table-body') {
        const productTableBody = document.getElementById(tableBodyId);
        if (!productTableBody) return;

        // Get only box barcodes (filter out product barcodes)
        // Box barcodes start with "BOX-" while product barcodes start with "PROD-"
        const allBarcodeImages = productTableBody.querySelectorAll('img[data-barcode-id]');
        const boxBarcodeImages = Array.from(allBarcodeImages).filter(img => {
            const barcodeId = img.getAttribute('data-barcode-id');
            return barcodeId && barcodeId.startsWith('BOX-');
        });

        if (boxBarcodeImages.length === 0) {
            alert('No box barcodes to download');
            return;
        }

        // Generate PDF with box barcodes
        generateBoxBarcodePDF(boxBarcodeImages);
    }

    function generateBoxBarcodePDF(boxBarcodeImages) {
        const { jsPDF } = window.jspdf;
        
        // Create A4 size PDF (210mm x 297mm)
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 10;
        const barcodeWidth = 85;  // Width of each barcode area
        const barcodeHeight = 50; // Height of each barcode area
        const barcodesPerRow = 2;
        const barcodesPerColumn = 5;
        const barcodesPerPage = barcodesPerRow * barcodesPerColumn;

        let currentPage = 1;
        let barcodeIndex = 0;

        function addNewPage() {
            if (currentPage > 1) {
                pdf.addPage();
            }
            currentPage++;
        }

        function getBarcodePosition(index) {
            const pageIndex = Math.floor(index / barcodesPerPage);
            const indexOnPage = index % barcodesPerPage;
            const row = Math.floor(indexOnPage / barcodesPerRow);
            const col = indexOnPage % barcodesPerRow;
            
            const x = margin + col * (barcodeWidth + 10);
            const y = margin + row * (barcodeHeight + 10);
            
            return { x, y, pageIndex };
        }

        let currentPageIndex = 0;

        boxBarcodeImages.forEach((img, index) => {
            const barcodeId = img.getAttribute('data-barcode-id');
            const position = getBarcodePosition(index);
            
            // Add new page if needed
            if (position.pageIndex > currentPageIndex) {
                pdf.addPage();
                currentPageIndex = position.pageIndex;
            }

            // Add barcode ID text
            pdf.setFontSize(10);
            pdf.text(barcodeId, position.x + barcodeWidth / 2, position.y + 5, { align: 'center' });

            // Generate barcode locally using JsBarcode
            try {
                const canvas = document.createElement('canvas');
                canvas.width = 200;
                canvas.height = 80;
                
                // Generate barcode on canvas
                JsBarcode(canvas, barcodeId, {
                    format: 'CODE128',
                    width: 2,
                    height: 50,
                    displayValue: false,
                    margin: 0
                });
                
                const imgData = canvas.toDataURL('image/png');
                
                // Add image to PDF
                pdf.addImage(imgData, 'PNG', position.x + 10, position.y + 8, barcodeWidth - 20, barcodeHeight - 15);
            } catch (error) {
                console.error('Error generating barcode:', error);
                // If barcode generation fails, just show the barcode ID as text
                pdf.setFontSize(14);
                pdf.text(barcodeId, position.x + barcodeWidth / 2, position.y + barcodeHeight / 2, { align: 'center' });
            }
        });

        // Download the PDF
        pdf.save('box-barcodes.pdf');
    }

    function downloadUploadOrderExcel() {
        const orderNumber = document.getElementById('upload-order-number').value.trim();
        const clientName = document.getElementById('upload-client-name').value.trim();
        const orderDate = document.getElementById('upload-order-date').value;
        const countryPin = document.getElementById('upload-country-pin').value.trim();

        if (!orderNumber || !clientName || !orderDate || !countryPin) {
            alert('Please fill in all required order fields');
            return;
        }

        const currentOrder = {
            orderNumber,
            clientName,
            orderDate,
            countryPin,
            status: 'Pending',
            createdAt: new Date().toISOString()
        };

        // Collect data from uploaded data table rows
        const productTableBody = document.getElementById('uploaded-products-body');
        const productRows = productTableBody.querySelectorAll('tr');
        
        if (productRows.length === 0) {
            alert('No uploaded data to download');
            return;
        }

        // Create workbook using ExcelJS
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Products');

        // Add headers
        worksheet.columns = [
            { header: 'Order Number', key: 'orderNumber', width: 15 },
            { header: 'Client Name', key: 'clientName', width: 20 },
            { header: 'Order Date', key: 'orderDate', width: 12 },
            { header: 'Country Pin', key: 'countryPin', width: 15 },
            { header: 'No.', key: 'no', width: 5 },
            { header: 'Product MF ID', key: 'mfId', width: 15 },
            { header: 'Product Barcode', key: 'productBarcode', width: 20 },
            { header: 'Product Barcode ID', key: 'productQrId', width: 20 },
            { header: 'Product Name', key: 'name', width: 20 },
            { header: 'Product QTY', key: 'qty', width: 10 },
            { header: 'Boxes QTY', key: 'boxesQty', width: 10 },
            { header: 'Boxes Barcode', key: 'boxBarcode', width: 20 },
            { header: 'Boxes Barcode ID', key: 'boxes', width: 20 },
            { header: 'Container Info', key: 'containerInfo', width: 20 },
            { header: 'Product Status', key: 'status', width: 12 },
            { header: 'Note', key: 'note', width: 30 }
        ];

        // Process each row
        for (let index = 0; index < productRows.length; index++) {
            const row = productRows[index];
            const inputs = row.querySelectorAll('.table-input');
            
            // Get auto-filled values from cells
            const productBarcodeId = row.cells[3].textContent.trim();
            const boxId = row.cells[8].textContent.trim();
            
            // Get selected status values from multi-select dropdown
            const statusHiddenInput = row.querySelector('input[data-field="status"]');
            let statusValue = '';
            if (statusHiddenInput) {
                statusValue = statusHiddenInput.value;
            }
            
            const rowData = {
                orderNumber: currentOrder.orderNumber,
                clientName: currentOrder.clientName,
                orderDate: currentOrder.orderDate,
                countryPin: currentOrder.countryPin,
                no: index + 1,
                mfId: inputs[0].value.trim(),
                productBarcode: '',
                productQrId: productBarcodeId,
                name: inputs[1].value.trim(),
                qty: inputs[2].value.trim(),
                boxesQty: inputs[3].value.trim(),
                boxBarcode: '',
                boxes: boxId,
                containerInfo: inputs[4].value.trim(),
                status: statusValue,
                note: inputs[5].value.trim()
            };

            // Add row to worksheet
            const excelRow = worksheet.addRow(rowData);
            const rowIndex = excelRow.number;

            // Generate product barcode image using JsBarcode
            if (productBarcodeId) {
                try {
                    const canvas = document.createElement('canvas');
                    JsBarcode(canvas, productBarcodeId, {
                        format: 'CODE128',
                        width: 2,
                        height: 50,
                        displayValue: true,
                        fontSize: 12,
                        margin: 5
                    });
                    
                    const base64Image = canvas.toDataURL('image/png').split(',')[1];
                    const imageBuffer = Uint8Array.from(atob(base64Image), c => c.charCodeAt(0));
                    
                    const imageId = workbook.addImage({
                        buffer: imageBuffer,
                        extension: 'png'
                    });
                    worksheet.addImage(imageId, {
                        tl: { col: 6, row: rowIndex - 1 },
                        ext: { width: 150, height: 60 }
                    });
                    worksheet.getRow(rowIndex).height = 50;
                } catch (error) {
                    console.error('Error generating product barcode:', error);
                }
            }

            // Generate box barcode image using JsBarcode
            if (boxId) {
                try {
                    const canvas = document.createElement('canvas');
                    JsBarcode(canvas, boxId, {
                        format: 'CODE128',
                        width: 2,
                        height: 50,
                        displayValue: true,
                        fontSize: 12,
                        margin: 5
                    });
                    
                    const base64Image = canvas.toDataURL('image/png').split(',')[1];
                    const imageBuffer = Uint8Array.from(atob(base64Image), c => c.charCodeAt(0));
                    
                    const imageId = workbook.addImage({
                        buffer: imageBuffer,
                        extension: 'png'
                    });
                    worksheet.addImage(imageId, {
                        tl: { col: 11, row: rowIndex - 1 },
                        ext: { width: 150, height: 60 }
                    });
                } catch (error) {
                    console.error('Error generating box barcode:', error);
                }
            }
        }

        // Generate Excel file and download
        workbook.xlsx.writeBuffer().then(buffer => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${currentOrder.orderNumber}_products.xlsx`;
            link.click();
        });
    }

    function setupCountryLookup() {
        const pinCodeCountryMap = {
            '110001': 'India',
            '110002': 'India',
            '110003': 'India',
            '10001': 'USA',
            '10002': 'USA',
            '10003': 'USA',
            'SW1A 1AA': 'UK',
            'EC1A 1BB': 'UK',
            '2000': 'Australia',
            '3000': 'Australia',
            '100': 'Japan',
            '200': 'Japan',
            '100000': 'China',
            '200000': 'China'
        };

        // Setup for create order form
        const countryPinInput = document.getElementById('country-pin');
        const countryNameElement = document.getElementById('country-name');

        if (countryPinInput && countryNameElement) {
            countryPinInput.addEventListener('input', function() {
                const pinCode = this.value.trim();
                const country = pinCodeCountryMap[pinCode] || '';
                countryNameElement.textContent = country;
            });
        }

        // Setup for upload order form
        const uploadCountryPinInput = document.getElementById('upload-country-pin');
        const uploadCountryNameElement = document.getElementById('upload-country-name');

        if (uploadCountryPinInput && uploadCountryNameElement) {
            uploadCountryPinInput.addEventListener('input', function() {
                const pinCode = this.value.trim();
                const country = pinCodeCountryMap[pinCode] || '';
                uploadCountryNameElement.textContent = country;
            });
        }
    }

    function setupFileUpload() {
        console.log('Setting up file upload...');
        console.log('SheetJS available:', typeof XLSX !== 'undefined');
        
        const fileUploadArea = document.getElementById('file-upload-area');
        const fileInput = document.getElementById('file-input');
        const uploadBtn = document.getElementById('upload-btn');
        const uploadResult = document.getElementById('upload-result');

        console.log('File upload elements:', {
            fileUploadArea: !!fileUploadArea,
            fileInput: !!fileInput,
            uploadBtn: !!uploadBtn,
            uploadResult: !!uploadResult
        });

        if (!fileUploadArea || !fileInput || !uploadBtn || !uploadResult) {
            console.error('Missing file upload elements');
            return;
        }

        // Clear existing event listeners
        fileUploadArea.replaceWith(fileUploadArea.cloneNode(true));
        fileInput.replaceWith(fileInput.cloneNode(true));
        uploadBtn.replaceWith(uploadBtn.cloneNode(true));
        
        // Get the new elements
        const newFileUploadArea = document.getElementById('file-upload-area');
        const newFileInput = document.getElementById('file-input');
        const newUploadBtn = document.getElementById('upload-btn');

        // Click to upload
        newFileUploadArea.addEventListener('click', function() {
            newFileInput.click();
        });

        // Drag and drop functionality
        newFileUploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            newFileUploadArea.classList.add('dragover');
        });

        newFileUploadArea.addEventListener('dragleave', function() {
            newFileUploadArea.classList.remove('dragover');
        });

        newFileUploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            newFileUploadArea.classList.remove('dragover');
            
            if (e.dataTransfer.files.length) {
                newFileInput.files = e.dataTransfer.files;
                showFileInfo(newFileInput.files[0]);
                // Automatically upload the file when dropped
                uploadFile(newFileInput.files[0], uploadResult);
            }
        });

        // File selection
        newFileInput.addEventListener('change', function() {
            if (this.files.length) {
                showFileInfo(this.files[0], uploadResult);
            }
        });

        // Upload button click
        newUploadBtn.addEventListener('click', function() {
            console.log('Upload button clicked');
            console.log('File input files:', newFileInput.files);
            if (newFileInput.files.length) {
                console.log('Calling uploadFile with:', newFileInput.files[0]);
                uploadFile(newFileInput.files[0], uploadResult);
            } else {
                showUploadResult('Please select a file first', 'error', uploadResult);
            }
        });

        function showFileInfo(file, uploadResult) {
            showUploadResult(`Selected file: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`, 'success', uploadResult);
        }

        function uploadFile(file, uploadResult) {
            console.log('uploadFile called with:', file);
            
            // Validate file type
            const validTypes = ['.xlsx', '.xls', '.csv'];
            const fileName = file.name.toLowerCase();
            const isValidType = validTypes.some(type => fileName.endsWith(type));
            
            console.log('File name:', fileName, 'Valid type:', isValidType);

            if (!isValidType) {
                showUploadResult('Please upload only Excel or CSV files', 'error', uploadResult);
                return;
            }

            // Show uploading message
            showUploadResult('Uploading file...', 'success', uploadResult);

            // Read the Excel file
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    console.log('File loaded successfully');
                    
                    let workbook;
                    
                    // Handle different file types
                    if (file.name.endsWith('.csv')) {
                        // For CSV files, read as text
                        const csvData = e.target.result;
                        console.log('CSV data:', csvData);
                        workbook = XLSX.read(csvData, { type: 'string' });
                    } else {
                        // For Excel files, read as array buffer
                        const data = new Uint8Array(e.target.result);
                        console.log('Excel data length:', data.length);
                        workbook = XLSX.read(data, { type: 'array' });
                    }
                    
                    // Get the first worksheet
                    const firstSheetName = workbook.SheetNames[0];
                    console.log('First sheet name:', firstSheetName);
                    const worksheet = workbook.Sheets[firstSheetName];
                    
                    // Convert worksheet to JSON
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);
                    console.log('JSON data:', jsonData);
                    
                    if (jsonData.length === 0) {
                        showUploadResult('No data found in the file', 'error', uploadResult);
                        return;
                    }
                    
                    // Process the data
                    processUploadedData(jsonData);
                    
                    showUploadResult(`File uploaded successfully: ${file.name}`, 'success', uploadResult);
                } catch (error) {
                    console.error('Error reading Excel file:', error);
                    showUploadResult('Error reading Excel file: ' + error.message, 'error', uploadResult);
                } finally {
                    // Reset file input
                    const fileInput = document.getElementById('file-input');
                    if (fileInput) {
                        fileInput.value = '';
                    }
                }
            };
            
            reader.onerror = function() {
                showUploadResult('Error reading file', 'error', uploadResult);
                const fileInput = document.getElementById('file-input');
                if (fileInput) {
                    fileInput.value = '';
                }
            };
            
            // Read the file as array buffer
            if (file.name.endsWith('.csv')) {
                reader.readAsText(file);
            } else {
                reader.readAsArrayBuffer(file);
            }
        }

        function processUploadedData(jsonData) {
            console.log('Processing uploaded data:', jsonData);
            console.log('Number of rows:', jsonData.length);
            
            const tableBody = document.getElementById('uploaded-products-body');
            const tableContainer = document.getElementById('uploaded-data-table');

            console.log('Table body:', tableBody);
            console.log('Table container:', tableContainer);

            if (!tableBody || !tableContainer) {
                console.error('Table elements not found');
                return;
            }

            // Clear existing data
            tableBody.innerHTML = '';
            console.log('Table body cleared');

            // Extract order information from the Excel file
            extractOrderInfo(jsonData);
            console.log('Order info extracted');

            // Process each row of data as products
            let productIndex = 0;
            console.log('Processing products...');
            
            jsonData.forEach((item, index) => {
                console.log('Checking row', index, ':', item);
                
                // Check if this row contains product data
                // Product rows have 'No.' column with values 1, 2, 3, etc.
                const hasNoColumn = item['No.'] !== undefined && item['No.'] !== null && item['No.'] !== '';
                const hasProductData = item['Product MF ID'] || item['product_mf_id'] || item['MF ID'] || 
                                      item['Product Name'] || item['product_name'] || item['Name'] || 
                                      item['Product QTY'] || item['product_qty'] || item['QTY'] ||
                                      item['Product Barcode ID'] || item['product_barcode_id'] || item['Barcode ID'];
                
                console.log('Row', index, 'has No. column:', hasNoColumn, 'has product data:', hasProductData);
                
                // Process row if it has No. column (indicating it's a product row)
                if (hasNoColumn) {
                    productIndex++;
                    console.log('Found product row:', productIndex, item);
                    const row = document.createElement('tr');
                    
                    // Extract data from the Excel file, handling different column names
                    const no = productIndex;
                    const mfId = item['Product MF ID'] || item['product_mf_id'] || item['MF ID'] || '';
                    const productBarcodeId = item['Product Barcode ID'] || item['product_barcode_id'] || item['Barcode ID'] || `PROD-${Date.now().toString().slice(-6)}-${no}`;
                    const name = item['Product Name'] || item['product_name'] || item['Name'] || '';
                    const qty = item['Product QTY'] || item['product_qty'] || item['QTY'] || '';
                    const boxesQty = item['Boxes QTY'] || item['boxes_qty'] || item['Box QTY'] || 1;
                    const boxes = item['Boxes Barcode ID'] || item['boxes_barcode_id'] || item['Boxes ID'] || item['boxes_id'] || item['Box ID'] || `BOX-${Date.now().toString().slice(-6)}-${no}`;
                    const containerInfo = item['Container Info'] || item['container_info'] || item['Container'] || '';
                    const status = item['Product Status'] || item['product_status'] || item['Status'] || 'Pending';
                    const note = item['Note'] || item['note'] || '';

                    console.log('Product data:', { no, mfId, productBarcodeId, name, qty, boxesQty, boxes, containerInfo, status, note });

                    // Generate barcodes
                    const productBarcode = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(productBarcodeId)}&code=Code128&multiplebarcodes=false&translate-esc=false&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&qunit=Mm&width=100&height=50&quiet=0`;
                    const boxBarcode = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(boxes)}&code=Code128&multiplebarcodes=false&translate-esc=false&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&qunit=Mm&width=100&height=50&quiet=0`;

                    // Parse status values
                    const statusValues = status.split(',').map(s => s.trim()).filter(s => s);
                    const statusDisplay = statusValues.length > 0 ? statusValues.join(', ') : 'Select Status';
                    
                    // Create status checkboxes
                    const statusOptions = ['Making', 'Packed', 'Labeled', 'In Factory', 'In Warehouse', 'In Container'];
                    const statusCheckboxes = statusOptions.map(opt => {
                        const checked = statusValues.includes(opt) ? 'checked' : '';
                        return `<label><input type="checkbox" value="${opt}" ${checked}> ${opt}</label>`;
                    }).join('');

                    row.className = 'product-main-row';
                    row.dataset.productId = productBarcodeId;
                    row.innerHTML = `
                        <td rowspan="1">${no}</td>
                        <td rowspan="1"><input type="text" class="table-input" value="${mfId}" data-field="mfId"></td>
                        <td rowspan="1"><img src="${productBarcode}" alt="Product Barcode" class="qr-small" data-barcode-id="${productBarcodeId}"></td>
                        <td rowspan="1" class="table-cell-auto">${productBarcodeId}</td>
                        <td rowspan="1"><input type="text" class="table-input" value="${name}" data-field="name"></td>
                        <td rowspan="1"><input type="number" class="table-input" min="1" value="${qty}" data-field="qty"></td>
                        <td><input type="number" class="table-input" min="1" value="${boxesQty}" data-field="boxesQty" onchange="handleBoxesQtyChange(this)"></td>
                        <td><img src="${boxBarcode}" alt="Box Barcode" class="qr-small" data-barcode-id="${boxes}"></td>
                        <td class="table-cell-auto">${boxes}</td>
                        <td><input type="text" class="table-input" value="${containerInfo}" data-field="containerInfo"></td>
                        <td>
                            <div class="multi-select-dropdown">
                                <div class="multi-select-trigger" onclick="toggleMultiSelect(this)">${statusDisplay}</div>
                                <div class="multi-select-options">
                                    ${statusCheckboxes}
                                </div>
                                <input type="hidden" class="table-input" data-field="status" value="${statusValues.join(', ')}">
                            </div>
                        </td>
                        <td><input type="text" class="table-input" value="${note}" data-field="note"></td>
                        <td><button type="button" class="btn btn-delete" onclick="deleteRow(this)">🗑️</button></td>
                    `;
                    tableBody.appendChild(row);
                    
                    // Add hover functionality to barcode images
                    const barcodeImages = row.querySelectorAll('img[data-barcode-id]');
                    barcodeImages.forEach(function(img) {
                        img.addEventListener('mouseenter', function(e) {
                            showBarcodeTooltip(e, this);
                        });
                        img.addEventListener('mouseleave', function() {
                            hideBarcodeTooltip();
                        });
                    });
                    
                    // Add hover functionality to input fields (Product Name and Note)
                    const inputFields = row.querySelectorAll('input.table-input');
                    inputFields.forEach(function(input) {
                        // Only add hover to Product Name and Note fields
                        if (input.dataset.field === 'name' || input.dataset.field === 'note') {
                            input.addEventListener('mouseenter', function(e) {
                                const content = input.value.trim();
                                if (content) {
                                    showInputPopup(e, input, content);
                                }
                            });
                            input.addEventListener('mouseleave', function() {
                                hideInputPopup();
                            });
                            
                            // Update popup when input value changes
                            input.addEventListener('input', function() {
                                const popup = document.querySelector('.cell-popup[data-input]');
                                if (popup && popup.dataset.input === input.dataset.field) {
                                    const content = input.value.trim();
                                    if (content) {
                                        popup.querySelector('.popup-content').textContent = content;
                                    } else {
                                        hideInputPopup();
                                    }
                                }
                            });
                        }
                    });

                    // Setup multi-select for the uploaded row
                    setupMultiSelect(row);
                    
                    console.log('Row added to table');
                }
            });

            console.log('Total products found:', productIndex);

            // Show the table
            tableContainer.style.display = 'block';
            console.log('Table displayed');
            
            // Add "Add Row" button to the uploaded table
            addUploadTableAddRowButton();
        }
        
        function addUploadTableAddRowButton() {
            const tableBody = document.getElementById('uploaded-products-body');
            if (!tableBody) return;
            
            // Remove any existing add row button
            const existingAddRow = tableBody.querySelector('.add-row');
            if (existingAddRow) {
                existingAddRow.remove();
            }
            
            // Add new add row button
            const addRow = document.createElement('tr');
            addRow.className = 'add-row';
            addRow.innerHTML = `
                <td colspan="13" style="text-align: center; padding: 10px;">
                    <button type="button" class="btn btn-add" onclick="addNewProductRowToUpload()">+ Add New Product</button>
                </td>
            `;
            tableBody.appendChild(addRow);
        }
        
        window.addNewProductRowToUpload = function() {
            const tableBody = document.getElementById('uploaded-products-body');
            if (!tableBody) return;
            
            // Remove existing add row button temporarily
            const existingAddRow = tableBody.querySelector('.add-row');
            if (existingAddRow) {
                existingAddRow.remove();
            }
            
            // Count existing product rows
            const existingRows = tableBody.querySelectorAll('.product-main-row');
            const rowCount = existingRows.length + 1;
            
            // Generate unique IDs
            const shortTimestamp = Date.now().toString().slice(-6);
            const productBarcodeId = `PROD-${shortTimestamp}-${rowCount}`;
            const boxId = `BOX-${shortTimestamp}-${rowCount}-1`;
            
            // Generate barcodes
            const productBarcode = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(productBarcodeId)}&code=Code128&multiplebarcodes=false&translate-esc=false&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&qunit=Mm&width=100&height=50&quiet=0`;
            const boxBarcode = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(boxId)}&code=Code128&multiplebarcodes=false&translate-esc=false&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&qunit=Mm&width=100&height=50&quiet=0`;
            
            // Create new row
            const newRow = document.createElement('tr');
            newRow.className = 'product-main-row';
            newRow.dataset.productId = productBarcodeId;
            newRow.innerHTML = `
                <td rowspan="1">${rowCount}</td>
                <td rowspan="1"><input type="text" class="table-input" placeholder="e.g., MF-001" data-field="mfId"></td>
                <td rowspan="1"><img src="${productBarcode}" alt="Product Barcode" class="qr-small" data-barcode-id="${productBarcodeId}"></td>
                <td rowspan="1" class="table-cell-auto">${productBarcodeId}</td>
                <td rowspan="1"><input type="text" class="table-input" placeholder="e.g., Plywood Sheet" data-field="name"></td>
                <td rowspan="1"><input type="number" class="table-input" min="1" placeholder="e.g., 10" data-field="qty"></td>
                <td><input type="number" class="table-input" min="1" value="1" data-field="boxesQty" onchange="handleBoxesQtyChange(this)"></td>
                <td><img src="${boxBarcode}" alt="Box Barcode" class="qr-small" data-barcode-id="${boxId}"></td>
                <td class="table-cell-auto">${boxId}</td>
                <td><input type="text" class="table-input" placeholder="e.g., CON-2024-001" data-field="containerInfo"></td>
                <td>
                    <div class="multi-select-dropdown">
                        <div class="multi-select-trigger" onclick="toggleMultiSelect(this)">Select Status</div>
                        <div class="multi-select-options">
                            <label><input type="checkbox" value="Making"> Making</label>
                            <label><input type="checkbox" value="Packed"> Packed</label>
                            <label><input type="checkbox" value="Labeled"> Labeled</label>
                            <label><input type="checkbox" value="In Factory"> In Factory</label>
                            <label><input type="checkbox" value="In Warehouse"> In Warehouse</label>
                            <label><input type="checkbox" value="In Container"> In Container</label>
                        </div>
                        <input type="hidden" class="table-input" data-field="status">
                    </div>
                </td>
                <td><input type="text" class="table-input" placeholder="Additional notes" data-field="note"></td>
                <td><button type="button" class="btn btn-delete" onclick="deleteRow(this)">🗑️</button></td>
            `;
            
            tableBody.appendChild(newRow);
            
            // Add hover functionality
            const barcodeImages = newRow.querySelectorAll('img[data-barcode-id]');
            barcodeImages.forEach(function(img) {
                img.addEventListener('mouseenter', function(e) {
                    showBarcodeTooltip(e, this);
                });
                img.addEventListener('mouseleave', function() {
                    hideBarcodeTooltip();
                });
            });
            
            // Setup multi-select
            setupMultiSelect(newRow);
            
            // Re-add the add row button
            addUploadTableAddRowButton();
        }

        function extractOrderInfo(jsonData) {
            console.log('Extracting order info from:', jsonData);
            
            // Show all available keys in the first row
            if (jsonData.length > 0) {
                console.log('Available columns in Excel:', Object.keys(jsonData[0]));
            }
            
            // Look for order information in the first few rows
            for (let i = 0; i < Math.min(5, jsonData.length); i++) {
                const item = jsonData[i];
                console.log('Processing row', i, ':', item);
                
                // Extract order number
                const orderNumber = item['Order Number'] || item['order_number'] || item['Order No'] || item['order_no'] || item['Order'] || item['order'] || '';
                if (orderNumber) {
                    console.log('Found order number:', orderNumber);
                    document.getElementById('upload-order-number').value = orderNumber;
                }
                
                // Extract client name
                const clientName = item['Client Name'] || item['client_name'] || item['Customer Name'] || item['customer_name'] || item['Client'] || item['client'] || item['Customer'] || item['customer'] || '';
                if (clientName) {
                    console.log('Found client name:', clientName);
                    document.getElementById('upload-client-name').value = clientName;
                }
                
                // Extract order date
                const orderDate = item['Order Date'] || item['order_date'] || item['Date'] || item['date'] || '';
                if (orderDate) {
                    console.log('Found order date:', orderDate);
                    // Format date to YYYY-MM-DD if needed
                    let formattedDate = orderDate;
                    if (typeof orderDate === 'string') {
                        // Try different date formats
                        const dateMatch = orderDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
                        if (dateMatch) {
                            formattedDate = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;
                        }
                    }
                    document.getElementById('upload-order-date').value = formattedDate;
                }
                
                // Extract country & city pin code
                const countryPin = item['Country Pin'] || item['country_pin'] || item['CountryPin'] || item['countryPin'] || item['Pin Code'] || item['pin_code'] || item['Zip Code'] || item['zip_code'] || item['Pin'] || item['pin'] || item['Zip'] || item['zip'] || '';
                if (countryPin) {
                    console.log('Found country pin:', countryPin);
                    const pinInput = document.getElementById('upload-country-pin');
                    if (pinInput) {
                        pinInput.value = countryPin;
                        // Trigger country lookup
                        const event = new Event('input');
                        pinInput.dispatchEvent(event);
                        console.log('Country pin set to:', countryPin);
                    }
                }
            }
        }

        function displayUploadedData() {
            // This function is now replaced by processUploadedData
            // It's kept for backward compatibility
        }

        function showUploadResult(message, type, uploadResult) {
            uploadResult.textContent = message;
            uploadResult.className = `upload-result ${type}`;
            uploadResult.style.display = 'block';
        }
    }

    // Setup Upload Order table functionality


    // Multi-select dropdown functionality
    window.toggleMultiSelect = function(element) {
        const options = element.nextElementSibling;
        options.style.display = options.style.display === 'block' ? 'none' : 'block';
    };

    // Delete row functionality


    function setupMultiSelect(row) {
        const multiSelect = row.querySelector('.multi-select-dropdown');
        if (!multiSelect) return;

        const trigger = multiSelect.querySelector('.multi-select-trigger');
        const options = multiSelect.querySelector('.multi-select-options');
        const hiddenInput = multiSelect.querySelector('input[type="hidden"]');

        if (!trigger || !options || !hiddenInput) return;

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!multiSelect.contains(e.target)) {
                options.style.display = 'none';
            }
        });

        // Handle checkbox changes
        const checkboxes = options.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(function(checkbox) {
            checkbox.addEventListener('change', function() {
                const selectedValues = [];
                checkboxes.forEach(function(cb) {
                    if (cb.checked) {
                        selectedValues.push(cb.value);
                    }
                });
                
                hiddenInput.value = selectedValues.join(', ');
                trigger.textContent = selectedValues.length > 0 ? selectedValues.join(', ') : 'Select Status';
            });
        });
    }

    loadOrders();
    setupCountryLookup();
    setupFileUpload();
});
