# NeuraWeb - Professional Web Development & AI Integration Platform

NeuraWeb is a comprehensive web application that provides professional web development, automation, and AI integration services. Built with modern technologies and designed for scalability and performance.

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router Dom** for client-side routing
- **TailwindCSS** for responsive styling
- **Framer Motion** for smooth animations
- **React Hook Form** for form handling
- **React Hot Toast** for notifications
- **Axios** for API communication

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Prisma ORM** with PostgreSQL
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Helmet** for security headers
- **Morgan** for request logging
- **Rate limiting** for API protection

### External Services
- **Resend** for email delivery
- **Google Calendar API** for appointment booking
- **PostgreSQL** database

## 🏗️ Project Structure

```
neuraweb/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   └── Layout/      # Header, Footer, Layout components
│   │   ├── context/         # React context providers
│   │   │   ├── LanguageContext.tsx  # i18n management
│   │   │   └── ThemeContext.tsx     # Dark mode toggle
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── ContactPage.tsx
│   │   │   ├── QuotePage.tsx
│   │   │   ├── BookingPage.tsx
│   │   │   └── AdminPage.tsx
│   │   ├── utils/           # Utility functions
│   │   └── App.tsx
│   └── package.json
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API route handlers
│   │   ├── services/        # Business logic services
│   │   └── index.ts
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.ts          # Database seeding
│   └── package.json
├── .env.example            # Environment variables template
└── README.md
```

## 🎯 Features

### 🏠 **Homepage**
- Responsive hero section with service overview
- Multi-language support (English/French)
- Dark/light theme toggle
- Call-to-action buttons for contact and quotes
- Professional service cards with animations
- Mobile-first responsive design

### 📧 **Contact System**
- Contact form with validation
- Email delivery via Resend API
- Admin notifications for new messages
- Automatic user confirmation emails
- Form data stored in database

### 💰 **Quote Request System**
- Interactive quote calculator
- Real-time price estimation
- Service type selection (Showcase, E-commerce, Automation, AI)
- Additional options (Custom Design, Maintenance, Support)
- Email notifications to both admin and client
- Quote management in admin panel

### 📅 **Appointment Booking**
- Google Calendar integration
- Available time slot display
- Booking confirmation system
- Email confirmations with meeting details
- Calendar event creation
- Booking management interface

### 🔧 **Admin Dashboard**
- Secure admin authentication
- Quote request management
- Contact message tracking
- Booking overview and management
- Status updates for all requests
- Real-time data display

### 🌐 **Additional Features**
- **Multi-language support** (English/French)
- **Dark mode** with system preference detection
- **Responsive design** for all device sizes
- **Form validation** with real-time feedback
- **Loading states** and error handling
- **Rate limiting** for API protection
- **Security headers** and input sanitization
- **Email templates** for professional communication

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Resend API key (for emails)
- Google Calendar API credentials (optional)

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd neuraweb

# Install root dependencies
npm run install:all
```

### 2. Environment Setup

Copy the environment template:
```bash
cp .env.example .env
```

Fill in your environment variables:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/neuraweb"

# Email Service (Resend)
RESEND_API_KEY="your_resend_api_key_here"
FROM_EMAIL="contact@neuraweb.com"

# Google Calendar API (Optional)
GOOGLE_CALENDAR_API_KEY="your_google_calendar_api_key"
GOOGLE_CALENDAR_ID="your_calendar_id@group.calendar.google.com"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_REFRESH_TOKEN="your_google_refresh_token"

# JWT Secret
JWT_SECRET="your_super_secure_jwt_secret_here"

# Admin Credentials
ADMIN_EMAIL="admin@neuraweb.com"
ADMIN_PASSWORD="admin123"

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:5173"

# Server Port
PORT=3001
```

### 3. Database Setup

```bash
cd backend

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with initial data
npm run db:seed
```

### 4. Development Mode

Run both frontend and backend in development mode:
```bash
# From the root directory
npm run dev
```

Or run them separately:
```bash
# Frontend (port 5173)
npm run dev:frontend

# Backend (port 3001)
npm run dev:backend
```

### 5. Production Build

```bash
# Build the frontend
npm run build

# Start production server
npm start
```

## 🔧 API Endpoints

### Public Endpoints
- `POST /api/contact` - Submit contact form
- `POST /api/quotes` - Submit quote request
- `GET /api/booking/slots` - Get available time slots
- `POST /api/booking` - Book a meeting
- `GET /api/health` - Health check

### Admin Endpoints (Requires Authentication)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/quotes` - Get all quote requests
- `GET /api/admin/contacts` - Get all contact messages
- `GET /api/admin/bookings` - Get all bookings
- `PATCH /api/admin/:type/:id/status` - Update request status

## 🎨 Design System

### Colors
- **Primary**: Blue shades for main actions and branding
- **Secondary**: Purple shades for accents
- **Accent**: Yellow for highlights
- **Success**: Green for confirmations
- **Warning**: Orange for cautions
- **Error**: Red for errors

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Line Heights**: 150% for body text, 120% for headings

### Spacing
- **System**: 8px base unit
- **Breakpoints**: Mobile-first responsive design
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px

## 🔐 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Helmet.js**: Security headers
- **Input Validation**: Joi schema validation
- **JWT Authentication**: Secure admin access
- **CORS**: Configured for specific origins
- **SQL Injection Protection**: Prisma ORM parameterized queries

## 📱 Mobile Responsiveness

- Mobile-first design approach
- Touch-friendly interface elements
- Optimized loading for mobile connections
- Responsive navigation with mobile menu
- Scalable typography and spacing

## 🌐 Internationalization

Currently supports:
- **English** (default)
- **French**

Easy to extend with additional languages by updating the translation files in `frontend/src/context/LanguageContext.tsx`.

## 🚀 Deployment

### Frontend (Static Hosting)
The frontend builds to static files that can be deployed to:
- Vercel
- Netlify 
- AWS S3 + CloudFront
- GitHub Pages

### Backend (Node.js Hosting)
The backend can be deployed to:
- Heroku
- AWS EC2/ECS
- DigitalOcean Droplets
- Railway
- Render

### Database
Recommended PostgreSQL hosting:
- AWS RDS
- Google Cloud SQL
- Heroku Postgres
- Supabase
- Railway

## 🔧 Usage Instructions

### For Visitors
1. **Browse Services**: Visit the homepage to learn about available services
2. **Get Quote**: Use the quote calculator to estimate project costs
3. **Contact**: Send messages through the contact form
4. **Book Meeting**: Schedule consultations through the booking system
5. **Language/Theme**: Toggle between English/French and dark/light modes

### For Administrators
1. **Login**: Access `/admin` with your credentials
2. **Manage Requests**: View and update status of quotes, contacts, and bookings
3. **Email Integration**: Automatic email notifications for new requests
4. **Calendar Integration**: Booked meetings sync with Google Calendar

## 🔄 Future Improvements

### Phase 1 Enhancements
- [ ] **Payment Integration**: Stripe for quote approvals
- [ ] **File Upload**: Document sharing capability
- [ ] **Live Chat**: Real-time customer support
- [ ] **Portfolio Section**: Showcase completed projects
- [ ] **Blog System**: Content marketing capabilities

### Phase 2 Features
- [ ] **Client Portal**: Project tracking and collaboration
- [ ] **Advanced Analytics**: Business intelligence dashboard
- [ ] **Multi-tenancy**: Support for multiple businesses
- [ ] **Advanced Booking**: Recurring appointments and team calendars
- [ ] **CRM Integration**: HubSpot, Salesforce connectivity

### Technical Improvements
- [ ] **Testing Suite**: Unit, integration, and E2E tests
- [ ] **Performance**: Caching, CDN, and optimization
- [ ] **Monitoring**: Error tracking and performance monitoring
- [ ] **CI/CD**: Automated deployment pipelines
- [ ] **Docker**: Containerization for consistent deployments
- [ ] **Microservices**: Service separation for scalability

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📞 Support

For support, email support@neuraweb.com or create an issue in the repository.

---

**Built with ❤️ by the NeuraWeb Team**