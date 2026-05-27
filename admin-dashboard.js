// Mock Data Initialization
function initializeMockData() {
    // Check if mock data already exists
    const existingClients = localStorage.getItem('clients');
    const existingPartners = localStorage.getItem('partners');
    const existingOrders = localStorage.getItem('orders');
    
    if (!existingClients) {
        const mockClients = [
            {
                id: 'CLI-001',
                company: 'ABC Trading Co.',
                email: 'abc@trading.com',
                password: 'abc123',
                status: 'Active',
                createdAt: '2026-03-01T10:00:00Z'
            },
            {
                id: 'CLI-002',
                company: 'Global Imports Ltd.',
                email: 'global@imports.com',
                password: 'global456',
                status: 'Active',
                createdAt: '2026-03-05T14:30:00Z'
            },
            {
                id: 'CLI-003',
                company: 'Sunrise Exports',
                email: 'sunrise@exports.com',
                password: 'sunrise789',
                status: 'Inactive',
                createdAt: '2026-03-10T09:15:00Z'
            }
        ];
        localStorage.setItem('clients', JSON.stringify(mockClients));
    }
    
    if (!existingPartners) {
        const mockPartners = [
            {
                id: 'PAR-001',
                company: 'Fast Logistics Inc.',
                email: 'fast@logistics.com',
                password: 'fast123',
                phone: '+86-123-4567-8901',
                status: 'Active',
                createdAt: '2026-02-15T08:00:00Z'
            },
            {
                id: 'PAR-002',
                company: 'Ocean Freight Solutions',
                email: 'ocean@freight.com',
                password: 'ocean456',
                phone: '+86-987-6543-2100',
                status: 'Active',
                createdAt: '2026-02-20T11:30:00Z'
            },
            {
                id: 'PAR-003',
                company: 'Air Cargo Express',
                email: 'air@cargo.com',
                password: 'air789',
                phone: '+86-555-1234-5678',
                status: 'Active',
                createdAt: '2026-03-01T16:45:00Z'
            }
        ];
        localStorage.setItem('partners', JSON.stringify(mockPartners));
    }
    
    if (!existingOrders) {
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
                        productBarcodeId: 'PBC-001',
                        name: 'Premium Plywood Sheet',
                        qty: 100,
                        boxesQty: 5,
                        boxBarcodeId: 'BOX-001-A',
                        containerInfo: 'CNTR-2026-A',
                        status: 'Loaded',
                        note: 'Handle with care'
                    },
                    {
                        mfId: 'MF-002',
                        productBarcodeId: 'PBC-002',
                        name: 'OSB Board 18mm',
                        qty: 50,
                        boxesQty: 3,
                        boxBarcodeId: 'BOX-001-B',
                        containerInfo: 'CNTR-2026-A',
                        status: 'Pending',
                        note: ''
                    }
                ]
            },
            {
                orderNumber: 'ORD-2026-002',
                clientName: 'Global Imports Ltd.',
                clientEmail: 'global@imports.com',
                orderDate: '2026-03-18',
                countryPin: 'Germany, Hamburg, 20095',
                status: 'Pending',
                assignedClientId: 'CLI-002',
                partnerId: 'PAR-002',
                products: [
                    {
                        mfId: 'MF-003',
                        productBarcodeId: 'PBC-003',
                        name: 'Stainless Steel Coil',
                        qty: 200,
                        boxesQty: 10,
                        boxBarcodeId: 'BOX-002-A',
                        containerInfo: 'CNTR-2026-B',
                        status: 'Pending',
                        note: 'Keep dry'
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
                        productBarcodeId: 'PBC-004',
                        name: 'Purewood Furniture Set',
                        qty: 25,
                        boxesQty: 8,
                        boxBarcodeId: 'BOX-003-A',
                        containerInfo: 'CNTR-2026-C',
                        status: 'Delivered',
                        note: 'Fragile items'
                    },
                    {
                        mfId: 'MF-005',
                        productBarcodeId: 'PBC-005',
                        name: 'Decorative Panels',
                        qty: 75,
                        boxesQty: 4,
                        boxBarcodeId: 'BOX-003-B',
                        containerInfo: 'CNTR-2026-C',
                        status: 'Delivered',
                        note: ''
                    }
                ]
            },
            {
                orderNumber: 'ORD-2026-004',
                clientName: 'Sunrise Exports',
                clientEmail: 'sunrise@exports.com',
                orderDate: '2026-03-22',
                countryPin: 'Australia, Sydney, 2000',
                status: 'In Progress',
                assignedClientId: 'CLI-003',
                partnerId: 'PAR-001',
                products: [
                    {
                        mfId: 'MF-006',
                        productBarcodeId: 'PBC-006',
                        name: 'Marine Plywood',
                        qty: 150,
                        boxesQty: 7,
                        boxBarcodeId: 'BOX-004-A',
                        containerInfo: 'CNTR-2026-D',
                        status: 'Loaded',
                        note: 'Waterproof'
                    }
                ]
            },
            {
                orderNumber: 'ORD-2026-005',
                clientName: 'Global Imports Ltd.',
                clientEmail: 'global@imports.com',
                orderDate: '2026-03-25',
                countryPin: 'France, Paris, 75001',
                status: 'Pending',
                assignedClientId: null,
                partnerId: null,
                products: [
                    {
                        mfId: 'MF-007',
                        productBarcodeId: 'PBC-007',
                        name: 'Aluminum Sheets',
                        qty: 300,
                        boxesQty: 15,
                        boxBarcodeId: '',
                        containerInfo: '',
                        status: 'Pending',
                        note: 'Awaiting assignment'
                    }
                ]
            }
        ];
        localStorage.setItem('orders', JSON.stringify(mockOrders));
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize mock data if not exists
    initializeMockData();

    // Tab functionality
    const tabButtons = document.querySelectorAll('.admin-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // ==================== CLIENT MANAGEMENT ====================
    const addClientBtn = document.getElementById('add-client-btn');
    const clientModal = document.getElementById('client-modal');
    const closeClientModalBtn = document.getElementById('close-client-modal');
    const addClientForm = document.getElementById('add-client-form');
    const clientsTableBody = document.getElementById('clients-table-body');

    if (addClientBtn) {
        addClientBtn.addEventListener('click', function() {
            clientModal.style.display = 'block';
        });
    }

    if (closeClientModalBtn) {
        closeClientModalBtn.addEventListener('click', function() {
            clientModal.style.display = 'none';
        });
    }

    if (clientModal) {
        window.addEventListener('click', function(e) {
            if (e.target === clientModal) {
                clientModal.style.display = 'none';
            }
        });
    }

    if (addClientForm) {
        addClientForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const company = document.getElementById('client-company').value.trim();
            const email = document.getElementById('client-email').value.trim();
            const phone = document.getElementById('client-phone').value.trim();
            const password = document.getElementById('client-password').value;
            const address = document.getElementById('client-address').value.trim();
            
            if (!company || !email || !phone || !password) {
                alert('Please fill in all required fields');
                return;
            }

            const client = {
                id: Date.now().toString(),
                companyName: company,
                email,
                phone,
                password,
                address,
                status: 'Active',
                role: 'client',
                createdAt: new Date().toISOString()
            };

            const clients = JSON.parse(localStorage.getItem('clients') || '[]');
            clients.push(client);
            localStorage.setItem('clients', JSON.stringify(clients));

            addClientForm.reset();
            clientModal.style.display = 'none';
            
            loadClients();
            alert('Client added successfully!');
        });
    }

    function loadClients() {
        if (!clientsTableBody) return;
        
        const clients = JSON.parse(localStorage.getItem('clients') || '[]');
        
        if (clients.length === 0) {
            clientsTableBody.innerHTML = '<tr><td colspan="7" class="no-data">No clients found</td></tr>';
            return;
        }

        clientsTableBody.innerHTML = clients.map(client => `
            <tr>
                <td>${client.id}</td>
                <td>${client.companyName}</td>
                <td>${client.email}</td>
                <td><span class="password-mask">${'•'.repeat(Math.min(client.password?.length || 6, 8))}</span></td>
                <td><span class="status-badge status-${client.status?.toLowerCase() || 'active'}">${client.status || 'Active'}</span></td>
                <td>${new Date(client.createdAt).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-small" onclick='viewClientLogin("${client.id}")'>View Login</button>
                    <button class="btn btn-small" onclick='editClient("${client.id}")'>Edit</button>
                    <button class="btn btn-small" onclick='deleteClient("${client.id}")'>Delete</button>
                </td>
            </tr>
        `).join('');
    }

    // ==================== PARTNER MANAGEMENT ====================
    const addPartnerBtn = document.getElementById('add-partner-btn');
    const partnerModal = document.getElementById('partner-modal');
    const closePartnerModalBtn = document.getElementById('close-partner-modal');
    const addPartnerForm = document.getElementById('add-partner-form');
    const partnersTableBody = document.getElementById('partners-table-body');

    if (addPartnerBtn) {
        addPartnerBtn.addEventListener('click', function() {
            partnerModal.style.display = 'block';
        });
    }

    if (closePartnerModalBtn) {
        closePartnerModalBtn.addEventListener('click', function() {
            partnerModal.style.display = 'none';
        });
    }

    if (partnerModal) {
        window.addEventListener('click', function(e) {
            if (e.target === partnerModal) {
                partnerModal.style.display = 'none';
            }
        });
    }

    if (addPartnerForm) {
        addPartnerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const company = document.getElementById('partner-company').value.trim();
            const email = document.getElementById('partner-email').value.trim();
            const phone = document.getElementById('partner-phone').value.trim();
            const password = document.getElementById('partner-password').value;
            const address = document.getElementById('partner-address').value.trim();
            
            if (!company || !email || !phone || !password) {
                alert('Please fill in all required fields');
                return;
            }

            const partner = {
                id: Date.now().toString(),
                companyName: company,
                email,
                phone,
                password,
                address,
                status: 'Active',
                role: 'partner',
                createdAt: new Date().toISOString()
            };

            const partners = JSON.parse(localStorage.getItem('partners') || '[]');
            partners.push(partner);
            localStorage.setItem('partners', JSON.stringify(partners));

            addPartnerForm.reset();
            partnerModal.style.display = 'none';
            
            loadPartners();
            alert('Partner added successfully!');
        });
    }

    function loadPartners() {
        if (!partnersTableBody) return;
        
        const partners = JSON.parse(localStorage.getItem('partners') || '[]');
        
        if (partners.length === 0) {
            partnersTableBody.innerHTML = '<tr><td colspan="7" class="no-data">No partners found</td></tr>';
            return;
        }

        partnersTableBody.innerHTML = partners.map(partner => `
            <tr>
                <td>${partner.companyName}</td>
                <td>${partner.email}</td>
                <td><span class="password-mask">${'•'.repeat(Math.min(partner.password?.length || 6, 8))}</span></td>
                <td>${partner.phone}</td>
                <td><span class="status-badge status-${partner.status?.toLowerCase() || 'active'}">${partner.status || 'Active'}</span></td>
                <td>${new Date(partner.createdAt).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-small" onclick='viewPartnerLogin("${partner.id}")'>View Login</button>
                    <button class="btn btn-small" onclick='editPartner("${partner.id}")'>Edit</button>
                    <button class="btn btn-small" onclick='deletePartner("${partner.id}")'>Delete</button>
                </td>
            </tr>
        `).join('');
    }

    // ==================== ALL ORDERS ====================
    const adminOrdersBody = document.getElementById('admin-orders-body');
    const orderStatusFilter = document.getElementById('order-status-filter');
    const orderSearch = document.getElementById('order-search');

    function loadAdminOrders() {
        if (!adminOrdersBody) return;
        
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const clients = JSON.parse(localStorage.getItem('clients') || '[]');
        const partners = JSON.parse(localStorage.getItem('partners') || '[]');
        
        if (orders.length === 0) {
            adminOrdersBody.innerHTML = '<tr><td colspan="9" class="no-data">No orders found</td></tr>';
            return;
        }

        // Apply filters
        let filteredOrders = orders;
        
        if (orderStatusFilter && orderStatusFilter.value) {
            filteredOrders = filteredOrders.filter(order => order.status === orderStatusFilter.value);
        }
        
        if (orderSearch && orderSearch.value) {
            const searchTerm = orderSearch.value.toLowerCase();
            filteredOrders = filteredOrders.filter(order => 
                order.orderNumber?.toLowerCase().includes(searchTerm) ||
                order.clientName?.toLowerCase().includes(searchTerm)
            );
        }

        adminOrdersBody.innerHTML = filteredOrders.map(order => {
            const client = clients.find(c => c.id === order.clientId);
            const partner = partners.find(p => p.id === order.partnerId);
            const productCount = order.products?.length || 0;
            const totalBoxes = order.products?.reduce((sum, p) => sum + (parseInt(p.boxesQty) || 0), 0) || 0;
            
            const assignedClient = order.assignedClientId ? clients.find(c => c.id === order.assignedClientId) : null;
            const assignedClientDisplay = order.assignedClientId 
                ? (assignedClient ? `${assignedClient.id} (${assignedClient.companyName})` : order.assignedClientId)
                : '-';
            
            return `
                <tr>
                    <td>${order.orderNumber}</td>
                    <td>${client?.companyName || order.clientName || 'N/A'}</td>
                    <td>${partner?.companyName || order.partnerName || 'N/A'}</td>
                    <td>${productCount}</td>
                    <td>${totalBoxes}</td>
                    <td><span class="status-badge status-${(order.status || 'Pending').toLowerCase()}">${order.status || 'Pending'}</span></td>
                    <td>${order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</td>
                    <td>${assignedClientDisplay}</td>
                    <td>
                        <button class="btn btn-small" onclick="viewOrderDetails('${order.orderNumber}')">View</button>
                        <button class="btn btn-small" onclick="assignClientToOrder('${order.orderNumber}')">Assign Client</button>
                        <button class="btn btn-small" onclick="deleteOrder('${order.orderNumber}')">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    if (orderStatusFilter) {
        orderStatusFilter.addEventListener('change', loadAdminOrders);
    }

    if (orderSearch) {
        orderSearch.addEventListener('input', loadAdminOrders);
    }

    // ==================== GLOBAL FUNCTIONS ====================
    
    // Edit Client Modal
    const editClientModal = document.getElementById('edit-client-modal');
    const closeEditClientModalBtn = document.getElementById('close-edit-client-modal');
    const editClientForm = document.getElementById('edit-client-form');

    if (closeEditClientModalBtn) {
        closeEditClientModalBtn.addEventListener('click', function() {
            editClientModal.style.display = 'none';
        });
    }

    if (editClientModal) {
        window.addEventListener('click', function(e) {
            if (e.target === editClientModal) {
                editClientModal.style.display = 'none';
            }
        });
    }

    if (editClientForm) {
        editClientForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const clientId = document.getElementById('edit-client-id').value;
            const company = document.getElementById('edit-client-company').value.trim();
            const email = document.getElementById('edit-client-email').value.trim();
            const password = document.getElementById('edit-client-password').value;
            const status = document.getElementById('edit-client-status').value;
            const phone = document.getElementById('edit-client-phone').value.trim();
            const address = document.getElementById('edit-client-address').value.trim();
            
            if (!company || !email || !password) {
                alert('Please fill in all required fields');
                return;
            }

            const clients = JSON.parse(localStorage.getItem('clients') || '[]');
            const clientIndex = clients.findIndex(c => c.id === clientId);
            
            if (clientIndex === -1) {
                alert('Client not found');
                return;
            }

            clients[clientIndex] = {
                ...clients[clientIndex],
                companyName: company,
                email,
                password,
                status,
                phone,
                address
            };

            localStorage.setItem('clients', JSON.stringify(clients));
            editClientModal.style.display = 'none';
            loadClients();
            alert('Client updated successfully!');
        });
    }

    // Client functions
    window.viewClientLogin = function(clientId) {
        const clients = JSON.parse(localStorage.getItem('clients') || '[]');
        const client = clients.find(c => c.id === clientId);
        
        if (!client) {
            alert('Client not found');
            return;
        }

        alert(`Client Login Credentials:

Company: ${client.companyName}
Login Email: ${client.email}
Password: ${client.password}

Client can use these credentials to log in.`);
    };

    window.editClient = function(clientId) {
        const clients = JSON.parse(localStorage.getItem('clients') || '[]');
        const client = clients.find(c => c.id === clientId);
        
        if (!client) {
            alert('Client not found');
            return;
        }

        // Populate the edit modal
        document.getElementById('edit-client-id').value = client.id;
        document.getElementById('edit-client-company').value = client.companyName;
        document.getElementById('edit-client-email').value = client.email;
        document.getElementById('edit-client-password').value = client.password;
        document.getElementById('edit-client-status').value = client.status || 'Active';
        document.getElementById('edit-client-phone').value = client.phone || '';
        document.getElementById('edit-client-address').value = client.address || '';
        
        // Show the modal
        editClientModal.style.display = 'block';
    };

    window.deleteClient = function(clientId) {
        if (!confirm('Are you sure you want to delete this client?')) {
            return;
        }

        let clients = JSON.parse(localStorage.getItem('clients') || '[]');
        clients = clients.filter(c => c.id !== clientId);
        localStorage.setItem('clients', JSON.stringify(clients));
        
        loadClients();
        alert('Client deleted successfully!');
    };

    window.resetClientPassword = function(clientId) {
        const clients = JSON.parse(localStorage.getItem('clients') || '[]');
        const client = clients.find(c => c.id === clientId);
        
        if (!client) {
            alert('Client not found');
            return;
        }

        const newPassword = prompt('Enter new password:');
        if (newPassword && newPassword.length >= 6) {
            client.password = newPassword;
            localStorage.setItem('clients', JSON.stringify(clients));
            alert('Password reset successfully!');
        } else {
            alert('Password must be at least 6 characters long');
        }
    };

    // Edit Partner Modal
    const editPartnerModal = document.getElementById('edit-partner-modal');
    const closeEditPartnerModalBtn = document.getElementById('close-edit-partner-modal');
    const editPartnerForm = document.getElementById('edit-partner-form');

    if (closeEditPartnerModalBtn) {
        closeEditPartnerModalBtn.addEventListener('click', function() {
            editPartnerModal.style.display = 'none';
        });
    }

    if (editPartnerModal) {
        window.addEventListener('click', function(e) {
            if (e.target === editPartnerModal) {
                editPartnerModal.style.display = 'none';
            }
        });
    }

    if (editPartnerForm) {
        editPartnerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const partnerId = document.getElementById('edit-partner-id').value;
            const company = document.getElementById('edit-partner-company').value.trim();
            const email = document.getElementById('edit-partner-email').value.trim();
            const password = document.getElementById('edit-partner-password').value;
            const status = document.getElementById('edit-partner-status').value;
            const phone = document.getElementById('edit-partner-phone').value.trim();
            const address = document.getElementById('edit-partner-address').value.trim();
            
            if (!company || !email || !password) {
                alert('Please fill in all required fields');
                return;
            }

            const partners = JSON.parse(localStorage.getItem('partners') || '[]');
            const partnerIndex = partners.findIndex(p => p.id === partnerId);
            
            if (partnerIndex === -1) {
                alert('Partner not found');
                return;
            }

            partners[partnerIndex] = {
                ...partners[partnerIndex],
                companyName: company,
                email,
                password,
                status,
                phone,
                address
            };

            localStorage.setItem('partners', JSON.stringify(partners));
            editPartnerModal.style.display = 'none';
            loadPartners();
            alert('Partner updated successfully!');
        });
    }

    // Partner functions
    window.viewPartnerLogin = function(partnerId) {
        const partners = JSON.parse(localStorage.getItem('partners') || '[]');
        const partner = partners.find(p => p.id === partnerId);
        
        if (!partner) {
            alert('Partner not found');
            return;
        }

        alert(`Partner Login Credentials:

Company: ${partner.companyName}
Login Email: ${partner.email}
Password: ${partner.password}

Partner can use these credentials to log in.`);
    };

    window.editPartner = function(partnerId) {
        const partners = JSON.parse(localStorage.getItem('partners') || '[]');
        const partner = partners.find(p => p.id === partnerId);
        
        if (!partner) {
            alert('Partner not found');
            return;
        }

        // Populate the edit modal
        document.getElementById('edit-partner-id').value = partner.id;
        document.getElementById('edit-partner-company').value = partner.companyName;
        document.getElementById('edit-partner-email').value = partner.email;
        document.getElementById('edit-partner-password').value = partner.password;
        document.getElementById('edit-partner-status').value = partner.status || 'Active';
        document.getElementById('edit-partner-phone').value = partner.phone || '';
        document.getElementById('edit-partner-address').value = partner.address || '';
        
        // Show the modal
        editPartnerModal.style.display = 'block';
    };

    window.deletePartner = function(partnerId) {
        if (!confirm('Are you sure you want to delete this partner?')) {
            return;
        }

        let partners = JSON.parse(localStorage.getItem('partners') || '[]');
        partners = partners.filter(p => p.id !== partnerId);
        localStorage.setItem('partners', JSON.stringify(partners));
        
        loadPartners();
        alert('Partner deleted successfully!');
    };

    window.resetPartnerPassword = function(partnerId) {
        const partners = JSON.parse(localStorage.getItem('partners') || '[]');
        const partner = partners.find(p => p.id === partnerId);
        
        if (!partner) {
            alert('Partner not found');
            return;
        }

        const newPassword = prompt('Enter new password:');
        if (newPassword && newPassword.length >= 6) {
            partner.password = newPassword;
            localStorage.setItem('partners', JSON.stringify(partners));
            alert('Password reset successfully!');
        } else {
            alert('Password must be at least 6 characters long');
        }
    };

    // Order functions
    window.viewOrderDetails = function(orderNumber) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const order = orders.find(o => o.orderNumber === orderNumber);
        
        if (!order) {
            alert('Order not found');
            return;
        }

        const modal = document.getElementById('order-detail-modal');
        const content = document.getElementById('order-detail-content');
        
        // Parse countryPin to extract location and pincode
        const countryPinParts = order.countryPin ? order.countryPin.split(',') : ['', ''];
        const location = countryPinParts[0] ? countryPinParts[0].trim() : '-';
        const pinCode = countryPinParts[1] ? countryPinParts[1].trim() : '-';
        
        // Build product table rows (main products only, not box rows)
        const productsHtml = order.products?.map((product, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${product.mfId || '-'}</td>
                <td>-</td>
                <td>${product.productBarcodeId || '-'}</td>
                <td>${product.name || '-'}</td>
                <td>${product.qty || '-'}</td>
                <td>${product.boxesQty || '-'}</td>
                <td>-</td>
                <td>${product.boxBarcodeId || '-'}</td>
                <td>${product.containerInfo || '-'}</td>
                <td><span class="status-badge status-${(product.status || 'Pending').toLowerCase().replace(/\s+/g, '-')}">${product.status || 'Pending'}</span></td>
                <td>${product.note || '-'}</td>
            </tr>
        `).join('') || '<tr><td colspan="12" style="text-align: center;">No products</td></tr>';

        // Build box summary list (all boxes including additional box rows)
        let boxCounter = 0;
        const boxSummaryHtml = order.products?.map((product) => {
            // Check if this is a box row (has boxBarcodeId but no productBarcodeId)
            if (product.boxBarcodeId) {
                boxCounter++;
                const statusClass = (product.status || 'Pending').toLowerCase().replace(/\s+/g, '-');
                const statusText = product.status || 'Pending';
                return `
                    <div style="margin-bottom: 1.5rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <span style="font-weight: 600;">${boxCounter}</span>
                            <span class="status-badge status-${statusClass}">${statusText}</span>
                        </div>
                        <div style="font-weight: 500; color: #2c3e50; margin-bottom: 0.25rem;">${product.name || 'N/A'}</div>
                        <div style="font-size: 0.9rem; color: #666; line-height: 1.6;">
                            <div><strong>MF ID:</strong> ${product.mfId || '-'}</div>
                            <div><strong>Product QTY:</strong> ${product.qty || '-'}</div>
                            <div><strong>Boxes QTY:</strong> ${product.boxesQty || '1'}</div>
                            <div><strong>Container:</strong> ${product.containerInfo || '-'}</div>
                            <div><strong>Product:</strong> ${product.productBarcodeId || '-'}</div>
                            <div><strong>Box:</strong> ${product.boxBarcodeId}</div>
                        </div>
                    </div>
                `;
            }
            return '';
        }).join('') || '<div style="text-align: center; color: #666;">No boxes found</div>';

        content.innerHTML = `
            <div style="padding: 1rem;">
                <h3>Order Information</h3>
                <div class="info-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                    <div>
                        <span style="color: #666; font-size: 0.9rem;">Order Number</span>
                        <div style="font-weight: 600; color: #2c3e50;">${order.orderNumber}</div>
                    </div>
                    <div>
                        <span style="color: #666; font-size: 0.9rem;">Client Name</span>
                        <div style="font-weight: 600; color: #2c3e50;">${order.clientName || 'N/A'}</div>
                    </div>
                    <div>
                        <span style="color: #666; font-size: 0.9rem;">Order Date</span>
                        <div style="font-weight: 600; color: #2c3e50;">${order.orderDate || '-'}</div>
                    </div>
                    <div>
                        <span style="color: #666; font-size: 0.9rem;">Country & City</span>
                        <div style="font-weight: 600; color: #2c3e50;">${location}</div>
                    </div>
                    <div>
                        <span style="color: #666; font-size: 0.9rem;">Pin Code</span>
                        <div style="font-weight: 600; color: #2c3e50;">${pinCode}</div>
                    </div>
                    <div>
                        <span style="color: #666; font-size: 0.9rem;">Status</span>
                        <div><span class="status-badge status-${(order.status || 'Pending').toLowerCase()}">${order.status || 'Pending'}</span></div>
                    </div>
                </div>
                
                <h3>Product Details</h3>
                <div class="orders-table-container" style="overflow-x: auto;">
                    <table class="orders-table" style="min-width: 1200px;">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Product MF ID</th>
                                <th>Product Barcode</th>
                                <th>Product Barcode ID</th>
                                <th>Product Name</th>
                                <th>Product QTY</th>
                                <th>Boxes QTY</th>
                                <th>Boxes Barcode</th>
                                <th>Boxes Barcode ID</th>
                                <th>Container Info</th>
                                <th>Product Status</th>
                                <th>Note</th>
                            </tr>
                        </thead>
                        <tbody>${productsHtml}</tbody>
                    </table>
                </div>
                
                <h3 style="margin-top: 2rem;">Box Summary</h3>
                <div class="box-summary-container">
                    ${boxSummaryHtml}
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
    };

    // Assign Client to Order Modal
    const assignClientModal = document.getElementById('assign-client-modal');
    const closeAssignClientModalBtn = document.getElementById('close-assign-client-modal');
    const assignClientForm = document.getElementById('assign-client-form');
    const assignClientSelect = document.getElementById('assign-client-select');
    const currentClientAssignment = document.getElementById('current-client-assignment');
    const removeClientAssignmentBtn = document.getElementById('remove-client-assignment');

    if (closeAssignClientModalBtn) {
        closeAssignClientModalBtn.addEventListener('click', function() {
            assignClientModal.style.display = 'none';
        });
    }

    if (assignClientModal) {
        window.addEventListener('click', function(e) {
            if (e.target === assignClientModal) {
                assignClientModal.style.display = 'none';
            }
        });
    }

    if (assignClientForm) {
        assignClientForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const orderNumber = document.getElementById('assign-order-number').value;
            const clientId = assignClientSelect.value;
            
            if (!clientId) {
                alert('Please select a client');
                return;
            }

            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const orderIndex = orders.findIndex(o => o.orderNumber === orderNumber);
            
            if (orderIndex === -1) {
                alert('Order not found');
                return;
            }

            orders[orderIndex].assignedClientId = clientId;
            localStorage.setItem('orders', JSON.stringify(orders));
            
            assignClientModal.style.display = 'none';
            loadAdminOrders();
            alert('Client assigned to order successfully!');
        });
    }

    if (removeClientAssignmentBtn) {
        removeClientAssignmentBtn.addEventListener('click', function() {
            const orderNumber = document.getElementById('assign-order-number').value;
            
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const orderIndex = orders.findIndex(o => o.orderNumber === orderNumber);
            
            if (orderIndex === -1) {
                alert('Order not found');
                return;
            }

            delete orders[orderIndex].assignedClientId;
            localStorage.setItem('orders', JSON.stringify(orders));
            
            assignClientModal.style.display = 'none';
            loadAdminOrders();
            alert('Client assignment removed!');
        });
    }

    window.assignClientToOrder = function(orderNumber) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const order = orders.find(o => o.orderNumber === orderNumber);
        
        if (!order) {
            alert('Order not found');
            return;
        }

        const clients = JSON.parse(localStorage.getItem('clients') || '[]');
        
        // Populate client dropdown
        assignClientSelect.innerHTML = '<option value="">-- Select a Client --</option>';
        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = `${client.companyName} (${client.email})`;
            assignClientSelect.appendChild(option);
        });

        // Show current assignment
        if (order.assignedClientId) {
            const assignedClient = clients.find(c => c.id === order.assignedClientId);
            if (assignedClient) {
                currentClientAssignment.innerHTML = `
                    <strong>Client ID:</strong> ${assignedClient.id}<br>
                    <strong>Company:</strong> ${assignedClient.companyName}<br>
                    <strong>Email:</strong> ${assignedClient.email}
                `;
            } else {
                currentClientAssignment.textContent = 'Unknown client (ID: ' + order.assignedClientId + ')';
            }
            assignClientSelect.value = order.assignedClientId;
        } else {
            currentClientAssignment.textContent = 'No client assigned';
            assignClientSelect.value = '';
        }

        // Store order number
        document.getElementById('assign-order-number').value = orderNumber;
        
        // Show modal
        assignClientModal.style.display = 'block';
    };

    window.deleteOrder = function(orderNumber) {
        if (!confirm('Are you sure you want to delete this order?')) {
            return;
        }

        let orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders = orders.filter(o => o.orderNumber !== orderNumber);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        loadAdminOrders();
        alert('Order deleted successfully!');
    };

    // Close order detail modal
    const closeOrderModalBtn = document.getElementById('close-order-modal');
    const orderDetailModal = document.getElementById('order-detail-modal');
    
    if (closeOrderModalBtn) {
        closeOrderModalBtn.addEventListener('click', function() {
            orderDetailModal.style.display = 'none';
        });
    }

    if (orderDetailModal) {
        window.addEventListener('click', function(e) {
            if (e.target === orderDetailModal) {
                orderDetailModal.style.display = 'none';
            }
        });
    }

    // Load all data on page load
    loadClients();
    loadPartners();
    loadAdminOrders();
});
