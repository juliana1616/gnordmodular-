document.addEventListener('DOMContentLoaded', function() {
    console.log('Login handler loaded');
    
    const loginForms = document.querySelectorAll('.login-form');
    console.log('Found login forms:', loginForms.length);
    
    if (loginForms.length === 0) {
        console.error('No login forms found on page');
    }
    
    loginForms.forEach((form, index) => {
        console.log('Attaching submit handler to form', index);
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted');
            
            // Get inputs by ID instead of type to handle password visibility toggle
            const emailInput = form.querySelector('#email');
            const passwordInput = form.querySelector('#password');
            
            if (!emailInput || !passwordInput) {
                console.error('Email or password input not found by ID');
                // Fallback to type selector
                const emailByType = form.querySelector('input[type="email"]');
                const passwordByType = form.querySelector('input[type="password"]');
                
                if (!emailByType || !passwordByType) {
                    console.error('Fallback also failed');
                    alert('Form error: Please refresh the page and try again');
                    return;
                }
                
                const email = emailByType.value.trim();
                const password = passwordByType.value.trim();
                console.log('Using fallback selectors');
            } else {
                var email = emailInput.value.trim();
                var password = passwordInput.value.trim();
                console.log('Using ID selectors');
            }
            
            console.log('Email entered:', email ? 'Yes' : 'No');
            console.log('Password entered:', password ? 'Yes' : 'No');
            
            if (!email || !password) {
                alert('Please enter both email and password');
                return;
            }
            
            const hasLoginCard = document.body.querySelector('.login-card') !== null;
            const hasAdminCard = document.body.querySelector('.admin-card') !== null;
            const loginHeading = document.getElementById('login-heading');
            const isPartner = loginHeading && loginHeading.textContent.includes('Partner');
            
            console.log('Page type detection:', { hasLoginCard, hasAdminCard, isPartner });
            
            let pageType = null;
            if (hasLoginCard) {
                if (hasAdminCard) {
                    pageType = 'admin';
                } else if (isPartner) {
                    pageType = 'partner';
                } else {
                    pageType = 'client';
                }
            }
            
            console.log('Detected page type:', pageType);
            
            if (pageType === 'admin') {
                handleAdminLogin(email, password);
            } else if (pageType === 'partner') {
                handlePartnerLogin(email, password);
            } else if (pageType === 'client') {
                handleClientLogin(email, password);
            } else {
                console.error('Could not determine page type');
                alert('Login error: Could not determine login type');
            }
        });
    });
    
    function handleAdminLogin(email, password) {
        // Check for custom password (set via change password)
        const customPassword = localStorage.getItem('adminPassword');
        const resetData = JSON.parse(localStorage.getItem('adminPasswordReset') || '{}');
        
        // Check if using temporary password
        if (resetData.tempPassword && password === resetData.tempPassword) {
            localStorage.setItem('userRole', 'admin');
            localStorage.setItem('userEmail', email);
            alert('Temporary password accepted. Please create a new password.');
            window.location.href = 'admin-change-password.html?temp=true';
            return;
        }
        
        // Check custom password first, then default
        const validPassword = customPassword || 'juliana798798';
        
        if (email === 'julianazhujy@hotmail.com' && password === validPassword) {
            localStorage.setItem('userRole', 'admin');
            localStorage.setItem('userEmail', email);
            alert('Admin login successful!');
            window.location.href = 'admin-dashboard.html';
        } else {
            alert('Invalid admin credentials');
        }
    }
    
    function handlePartnerLogin(email, password) {
        // Get partners from localStorage (created via Partner Management)
        const partners = JSON.parse(localStorage.getItem('partners') || '[]');
        
        // Find partner with matching email and password
        const partner = partners.find(p => p.email === email && p.password === password);
        
        if (partner) {
            localStorage.setItem('userRole', 'partner');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('partnerId', partner.id);
            localStorage.setItem('partnerCompany', partner.companyName);
            alert('Partner login successful!');
            window.location.href = 'partner-dashboard.html';
        } else {
            alert('Invalid email or password');
        }
    }
    
    function handleClientLogin(email, password) {
        // Get clients from localStorage (created via Client Management)
        const clients = JSON.parse(localStorage.getItem('clients') || '[]');
        
        // Find client with matching email and password
        const client = clients.find(c => c.email === email && c.password === password);
        
        if (client) {
            localStorage.setItem('userRole', 'client');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('clientId', client.id);
            localStorage.setItem('clientCompany', client.companyName);
            alert('Client login successful!');
            window.location.href = 'client-dashboard.html';
        } else {
            alert('Invalid email or password');
        }
    }
    
    // Password toggle functionality
    const togglePasswordBtn = document.getElementById('toggle-password');
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const eyeIcon = document.getElementById('eye-icon');
            const eyeSlashIcon = document.getElementById('eye-slash-icon');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeIcon.style.display = 'none';
                eyeSlashIcon.style.display = 'block';
                this.setAttribute('aria-label', 'Hide password');
            } else {
                passwordInput.type = 'password';
                eyeIcon.style.display = 'block';
                eyeSlashIcon.style.display = 'none';
                this.setAttribute('aria-label', 'Show password');
            }
        });
    }
});