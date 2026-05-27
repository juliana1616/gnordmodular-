# Product Requirements Document (PRD)
## Haikou Gnord Trading Co., LTD Website

---

## 1. Project Overview

### 1.1 Company Information
- **Company Name**: Haikou Gnord Trading Co., LTD
- **Location**: No. 1055, 4th Floor, Building A, Haikou Binhai International Business Technology Incubator, Longhua District, Haikou City, Hainan 570000, PRChina
- **Contact**: contactgnord@gmail.com
- **Phone**: 0086-19586567695 (Whatsapp)
- **Established**: 2021

### 1.2 Business Description
We are a premier China-based trading and supply chain partner, specializing in high-end modular furniture and interior solutions for global markets. By cooperating with over 100+ verified manufacturers, we provide designers with reliable execution and private homeowners with bespoke luxury villa fit-outs.

**Service Regions**: India, Russia, the Middle East, Europe, Australia, and the United States

**Core Services**:
- Design services
- Quality control
- Global logistics (under one roof)
- BIS-compliant storage
- High-spec modular kitchen and wardrobe solutions

---

## 2. Website Architecture

### 2.1 Site Structure (3-Layer Hierarchy)

#### Layer 1: Home Page (H1)
- **File**: `index.html`
- **URL**: `/`
- **H1 Title**: "Custom Cabinetry & Wardrobe Solutions"
- **Main Sections**:
  - Hero Section with Image Slider
  - Ply&OSB Products Section (H2)
  - Purewood Products Section (H2)
  - Stainless Steel Products Section (H2)
  - About Us Section (H2)
  - Contact Form Section (H2) - "Work With Us"

#### Layer 2: Product Detail Page (H2)
- **File**: `product-detail.html`
- **URL**: `/product-detail.html`
- **H1 Title**: "Product Details"
- **H2 Title**: "Custom Cabinetry Solution"
- **Features**:
  - Product Image Gallery with 5 thumbnails (93x93px)
  - Main Image Display (800x600px)
  - Product Specifications
  - Request Quote Button
  - Back to Products Button

#### Layer 3: FAQ Page (H3)
- **File**: `faq.html`
- **URL**: `/faq.html`
- **H1 Title**: "Frequently Asked Questions"
- **H2 Title**: "FAQ"
- **Features**:
  - Same Hero Slider as Home Page
  - Hidden GEO-optimized content for AI search
  - Accessible only via footer link

---

## 3. Product Categories

### 3.1 Ply&OSB
- Premium plywood kitchen cabinets
- 6 product styles displayed
- Product images: 380x270px

### 3.2 Purewood
- Pure solid wood cabinets
- 3 product styles displayed
- Product images: 380x270px

### 3.3 Stainless Steel
- Stainless steel cabinet solutions
- 3 product styles displayed
- Product images: 380x270px

---

## 4. Product Specifications

### 4.1 Technical Specifications
- **Carcase Materials**: Anti-moisture Plywood
- **Shutter Finish**: High-Density OSB/ PET-G High Gloss / Anti-scratch PP / Nano-Skin Film/contemporary Aluminum frames with tempered glass
- **Standard Compliance**: EN 13986 / E0 Grade (Formaldehyde < 0.05 mg/m³) & 45° seamless edge banding
- **Hardware**: Blum / Hettich / Higold compatible soft-close systems
- **Package**: Export-ready packaging with reinforced corners for global shipping (FOB/DDP options)
- **Customization**: Fully Customizable

---

## 5. Contact Form Fields

### 5.1 Required Fields
1. **Name** (Text Input) - Required
2. **Email** (Email Input) - Required
3. **Phone Number** (Tel Input with Country Code Selector) - Optional
4. **I am a** (Dropdown) - Required
   - Designer/Interior Company
   - Private Individual/Villa or flat Owner
5. **Project City** (Text Input) - Required
6. **Required Compliance** (Dropdown) - Required
   - BIS (India)
   - AU-NZ Standards
   - Other certificate needed (with text input)
7. **Design Inquiry** (Dropdown) - Required
   - Need Design(drawing) Service
   - Execution Only (I have drawings)
8. **Import Custom Support** (Dropdown) - Required
   - Need DDP door to door service
   - Can Import By Ourself
   - *Note: We only can do several countries DDP service*
9. **Message** (Textarea) - Required

### 5.2 Form Features
- Real-time validation
- Google reCAPTCHA v3 integration
- Error messaging
- Success confirmation

---

## 6. SEO & GEO Requirements

### 6.1 SEO Implementation
- **Meta Descriptions**: Unique for each page
- **Meta Keywords**: Relevant to page content
- **Canonical URLs**: Properly set for each page
- **Open Graph Tags**: Complete set for social sharing
- **Twitter Card Tags**: Complete set for Twitter sharing
- **Heading Structure**: Proper H1→H2→H3 hierarchy
- **Semantic HTML**: Proper use of header, nav, main, section, footer

### 6.2 GEO AI Search Optimization
- **FAQ Page**: Contains hidden paragraph for AI search indexing
- **Hidden Content**: Company description for search engines (display: none)
- **Content**: "We are a premier China-based trading and supply chain partner, specializing in high-end modular furniture and interior solutions for global markets..."

---

## 7. Technical Requirements

### 7.1 Technologies Used
- **HTML5**: Semantic structure
- **CSS3**: Mobile-first responsive design
- **JavaScript**: Form validation, image gallery, slider
- **Google Analytics**: Event tracking
- **Google reCAPTCHA v3**: Anti-bot protection

### 7.2 Responsive Design
- **Mobile**: < 768px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### 7.3 Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## 8. Design Specifications

### 8.1 Color Scheme
- **Primary Color**: #c19a6b (Gold/Bronze)
- **Primary Hover**: #a88355
- **Secondary Color**: #2c3e50 (Dark Blue)
- **Background White**: #ffffff
- **Background Light**: #f8f9fa
- **Background Dark**: #2c3e50 (Footer)
- **Text Color**: #333333
- **Border Color**: #e0e0e0

### 8.2 Typography
- **Font Family**: System fonts (sans-serif)
- **Base Font Size**: 16px
- **Line Height**: 1.6

### 8.3 Image Sizes
- **Hero Slider**: 1200x600px
- **Product Cards**: 380x270px
- **Product Thumbnails**: 93x93px
- **Main Product Image**: 800x600px

---

## 9. Features & Functionality

### 9.1 Header & Navigation
- Sticky navigation on scroll
- Mobile hamburger menu
- Smooth scroll to sections
- Active state indicators

### 9.2 Hero Section
- Auto-playing image slider (3 images)
- Manual navigation buttons
- Dot indicators
- Hero text overlay

### 9.3 Product Gallery
- 5 thumbnail images
- Click to view main image
- Previous/Next navigation
- Image counter display
- Thumbnail sidebar: max-height 500px

### 9.4 WhatsApp Integration
- Floating WhatsApp button (bottom-right)
- Slow blink animation
- Text: "Message Us by Whatsapp"
- Link: https://wa.me/861234567890

### 9.5 Social Media Links
- Facebook
- Instagram
- YouTube
- TikTok
- Located in footer

---

## 10. Footer Structure

### 10.1 Footer Content
- **Company Info**:
  - Company Name
  - Address (3 lines)
  - Phone Number
  - Email
- **Quick Links**:
  - FAQ link (no heading)
- **Social Links**:
  - Social media icons
- **Copyright**: 2021 Haikou Gnord Trading Co., LTD. All rights reserved.

---

## 11. Accessibility Requirements

### 11.1 ARIA Labels
- Proper use of aria-label, aria-labelledby, aria-describedby
- Role attributes for navigation and content
- aria-required for form fields

### 11.2 Keyboard Navigation
- All interactive elements keyboard accessible
- Focus indicators visible
- Skip to main content link

### 11.3 Screen Reader Support
- Semantic HTML structure
- Alt text for images
- Form labels properly associated

---

## 12. Performance Requirements

### 12.1 Loading Performance
- Lazy loading for images below the fold
- Eager loading for hero images
- Optimized image sizes

### 12.2 Security
- Google reCAPTCHA v3 for form submission
- HTTPS required
- No sensitive data in URLs

---

## 13. Deployment Information

### 13.1 Hosting
- **Platform**: Vercel (recommended)
- **Source**: GitHub repository
- **Domain**: Custom domain to be configured

### 13.2 File Structure
```
/
├── index.html          (Home Page - H1)
├── product-detail.html (Product Detail - H2)
├── faq.html           (FAQ Page - H3)
├── style.css          (Main stylesheet)
├── script.js          (JavaScript functionality)
└── PRD.md             (This document)
```

---

## 14. Future Enhancements

### 14.1 Potential Features
- Multi-language support
- Product filtering and search
- Customer testimonials section
- Project portfolio gallery
- Live chat integration
- Blog section

### 14.2 SEO Improvements
- Schema.org markup
- XML sitemap
- Robots.txt optimization
- Page speed optimization
- Image alt text enhancement

---

## 15. Maintenance & Updates

### 15.1 Regular Updates
- Product information updates
- Contact information changes
- SEO content optimization
- Security patches

### 15.2 Monitoring
- Google Analytics tracking
- Search Console monitoring
- Performance monitoring
- Error logging

---

## 16. Container Tracking & QR Code Verification System (New Module)

### 16.1 Product Background
Our company operates in furniture export and custom manufacturing. Currently, container loading relies on manual Excel tracking, which is error‑prone and inefficient. To improve traceability, transparency, and operational efficiency, we will build a lightweight MVP for box and container tracking using QR codes. This system will serve as the first module of a future full‑scale B2B CRM platform.

### 16.2 Product Vision
To create a web‑based tracking system that automates box labeling, loading verification, and client‑side inspection. All operations will be completed online without local Excel files, enabling real‑time data synchronization and traceability.

### 16.3 Target Users
1. **Admin**: Owner / IT manager (full access)
2. **Internal Staff**: Warehouse / Logistics (scan & view)
3. **External Clients**: Overseas buyers (view & scan)

### 16.4 Core Value
- Eliminate manual Excel work.
- Provide real‑time box status tracking.
- Enable clients to verify contents instantly via QR scan.
- Build a digital foundation for future CRM expansion.

---

## 17. Feature Requirements (MVP Scope)

### 17.1 Core Features

#### Feature 1: Web‑based Order & Box Creation
- Users create a delivery order on the website.
- Input: order number, product code, total boxes per product.
- System automatically generates unique box IDs.

#### Feature 2: Auto QR Code Generation (Web‑based)
- The system calls a free QR API to generate a QR code for each box.
- Each QR code links to the box's unique ID and public query page.
- QR codes are displayed directly on the web page.

#### Feature 3: Web‑based Excel Generation & Download
- System generates a complete Excel file containing:
  - Order number
  - Product code
  - Box ID
  - QR code image for each box
  - Total boxes per product
- Excel can be downloaded and printed directly from the website.

#### Feature 4: Online Printing Support
- Users can print the QR code list directly from the web page (A4 format).
- No local Excel required.

#### Feature 5: Loading Scan (Internal Use)
- Warehouse staff scan box QR codes using the website.
- System records box as "Loaded" with timestamp.

#### Feature 6: Client QR Verification
- Clients scan any box QR code.
- System displays:
  - Product code
  - Total boxes for the product
  - Order reference
  - **Detailed contents inside the box**

#### Feature 7: Client Excel Download
- Clients can download the full container Excel from the website.

#### Feature 8: Admin Layer
- **Admin-only dashboard** for full system control.
- Manage all users: internal staff, warehouse staff, clients.
- View, edit, reset passwords for all users.
- View all orders, box records, and scan history.
- Full data export capability.

#### Feature 9: Mobile Camera QR Scanner
- Web-based QR scanner using device camera.
- One‑tap access to camera for scanning.
- Automatic QR code detection and data extraction.
- Real‑time status update after scan.
- Works on all modern mobile browsers.

#### Feature 10: Box Contents Detail
- Each box can have a detailed list of items inside.
- Input fields include:
  - Item name (e.g., screw, panel, hardware)
  - Quantity
  - Specification (e.g., size, type)
- The details are stored in the database and displayed when the box QR code is scanned.
- Box contents are also included in the downloadable Excel file.

### 17.2 Data Structure

**Table: box_records**

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| order_number | Text | Client order reference |
| product_code | Text | Product SKU |
| box_id | Text | Unique box ID |
| total_boxes | Number | Total boxes for this product |
| status | Text | Loaded / Pending |
| loaded_at | Timestamp | Scan time |

**Table: box_contents**

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| box_id | Text | Linked to box_records.box_id |
| item_name | Text | Name of item (screw, panel, etc.) |
| quantity | Number | Quantity of item |
| specification | Text | Size, type, or other details |

**Table: users (managed by Supabase Auth)**

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | User ID |
| email | Text | Login email |
| role | Text | admin / staff / client |
| password | Text | Hashed password |

---

## 18. User Stories

- As a logistics user, I want to create an order online and auto‑generate box IDs and QR codes so I can print labels immediately.
- As a warehouse loader, I want to scan QR codes to record loaded boxes without manual entry.
- As a client, I want to scan a box to view its product details and total quantity.
- As a client, I want to download a complete Excel of all boxes for customs and inventory.
- As an admin, I want to manage all users and reset passwords when needed.
- As a staff member, I want to use my phone camera to scan QR codes quickly.
- As a client, I want to scan a box and see exactly what items are inside, including quantity and specifications.

---

## 19. Technical Architecture

| Component | Technology |
|-----------|------------|
| Frontend | HTML / CSS / JS (Vercel) |
| Database | Supabase |
| QR Generation | Free public QR API |
| Excel Export | SheetJS library (supports QR images) |
| QR Scanner | JavaScript + WebRTC (browser camera API) |
| User Auth | Supabase Auth (roles: admin, staff, client) |
| Hosting | Existing Vercel project with custom domain |

---

## 20. System Workflow

1. Create order → auto‑generate box IDs & QR codes.
2. Enter detailed contents for each box.
3. Print QR labels from website.
4. Scan during loading → update status.
5. Client scans → view details and box contents.
6. Download Excel (with QR codes and contents) from website.
7. Admin manages users and system data.

---

## 21. Non‑Functional Requirements

- **Mobile‑friendly interface**: Responsive design optimized for mobile devices.
- **QR generation < 1 second**: QR codes must be generated within 1 second per box.
- **QR scanning < 1 second**: QR code scanning and recognition must complete within 1 second.
- **Excel compatible**: Generated Excel files must be compatible with Microsoft Excel and Google Sheets.
- **Secure read‑only access for clients**: Clients can only view their own order data, no modifications allowed.
- **Admin access protected by authentication**: Admin dashboard requires secure login with role-based access control.

---

## 22. Acceptance Criteria

- [ ] Box IDs and QR codes generated correctly with unique identifiers.
- [ ] Excel downloaded with QR images and box contents included.
- [ ] Scan updates status in database with timestamp recorded.
- [ ] Client scan shows correct product info and box contents.
- [ ] Admin can view and manage all users (create, edit, reset passwords).
- [ ] Mobile camera scanner works reliably across modern mobile browsers.

---

**Document Version**: 1.2
**Last Updated**: 2026-03-22
**Author**: Development Team
