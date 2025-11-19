# Abstract Group IT Ticket Management System

A comprehensive React frontend application for managing IT tickets with role-based access control for different user types in the Abstract Group organization.

## 🚀 Features

### Authentication & Authorization
- **Login-only system** (no registration required)
- **Role-based access control** with 5 different user roles
- **Hardcoded users** with password `123` for all accounts
- **Protected routes** that redirect unauthorized users

### User Roles & Dashboards

#### 1. Employee Dashboard
- **Create tickets** with category/subcategory selection
- **View personal tickets** with filtering and sorting
- **KPI cards** showing ticket statistics
- **Teal color scheme** for employee branding
- **Routes**: Dashboard, My Tickets, Create Ticket

#### 2. IT Person Dashboard
- **Team ticket overview** with comprehensive filtering
- **Approve/Reject functionality** for ticket management
- **KPI metrics** for team performance
- **Dark blue color scheme** for IT team branding
- **Routes**: Dashboard, Create Ticket, Tickets, Agents, Settings, My Profile

#### 3. L1 Manager Dashboard
- **Assigned tickets** for L1 team members
- **Team performance metrics**
- **Approval workflow** for ticket resolution
- **Blue color scheme** for management team
- **Routes**: Dashboard, Tickets, Approvals, Reports, Profile

#### 4. L2 Manager Dashboard
- **Advanced ticket handling** for complex issues
- **Team performance tracking**
- **Approval/rejection capabilities**
- **Blue color scheme** for management team
- **Routes**: Dashboard, Tickets, Approvals, Reports, Profile

#### 5. COO Dashboard (Rashmi)
- **Executive overview** with comprehensive metrics
- **Notification system** with alert bell
- **Multi-tab interface**: Overview, Approvals, SLA Compliance, Reports
- **SLA compliance tracking** by department
- **Export functionality** (PDF/CSV)
- **Blue-gray color scheme** for executive branding
- **Routes**: Dashboard, Reports & Metrics, SLA Compliance, Approval Query, Export Data, My Profile

#### 6. CEO Dashboard (Minan)
- **Executive overview** with comprehensive metrics
- **Notification system** with alert bell
- **Multi-tab interface**: Overview, Approvals, SLA Compliance, Reports
- **SLA compliance tracking** by department
- **Export functionality** (PDF/CSV)
- **Blue-gray color scheme** for executive branding
- **Routes**: Dashboard, Reports & Metrics, SLA Compliance, Approval Query, Export Data, My Profile

### Core Functionality

#### Ticket Management
- **Comprehensive ticket creation** with category/subcategory dropdowns
- **Detailed ticket modals** with timeline, comments, and attachments
- **Status tracking** (Open, Pending, Approved, Rejected, Closed)
- **Priority levels** (High, Medium, Low) with color coding
- **SLA status monitoring** (On-track, At-risk, Breached)

#### Filtering & Sorting
- **Advanced filtering** by category, department, status, priority, date
- **Sortable columns** with visual indicators (▲/▼)
- **Filter reset functionality**
- **Real-time search** across all ticket fields

#### KPI & Analytics
- **Dynamic KPI cards** with trend indicators
- **Department-wise SLA compliance** tracking
- **Performance metrics** and closure time analysis
- **Visual trend indicators** (up/down/neutral)

#### UI/UX Features
- **Responsive design** for mobile and desktop
- **Modern Tailwind CSS** styling
- **Consistent color schemes** per role
- **Interactive modals** and dropdowns
- **Loading states** and error handling
- **Accessible design** with proper ARIA labels

## 🛠️ Tech Stack

- **React 18** with functional components and hooks
- **Vite** for fast development and building
- **React Router DOM** for client-side routing
- **Tailwind CSS** for styling and responsive design
- **Lucide React** for consistent iconography
- **Context API** for state management

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd abstract-group-it-ticket-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:3000`
   - The application will automatically open in your default browser

## 👥 Demo Users

All users have the password: `123`

### User Hierarchy
```
Minan (CEO, minan@abstractgroup.com)
└── Rashmi (COO, rashmi@abstractgroup.com)
    ├── Anjali (L2 Manager, anjali@abstractgroup.com)
    │   ├── Deepak (L1 Manager, deepak@abstractgroup.com)
    │   │   ├── Rahul (IT Person, rahul@abstractgroup.com)
    │   │   │   ├── Tara (Employee, tara@abstractgroup.com)
    │   │   │   └── Alex (Employee, alex@abstractgroup.com)
    │   │   └── Sneha (IT Person, sneha@abstractgroup.com)
    │   │       └── Radha (Employee, radha@abstractgroup.com)
    │   └── Kavita (L1 Manager, kavita@abstractgroup.com)
    │       └── Amit (IT Person, amit@abstractgroup.com)
    │           └── Neha (Employee, neha@abstractgroup.com)
    └── Rohan (L2 Manager, rohan@abstractgroup.com)
        └── Simran (L1 Manager, simran@abstractgroup.com)
            └── Vikas (IT Person, vikas@abstractgroup.com)
                └── Priya (Employee, priya@abstractgroup.com)
```

### Quick Access Users
| Role | Email | Name | Department |
|------|-------|------|------------|
| CEO | minan@abstractgroup.com | Minan | Executive |
| COO | rashmi@abstractgroup.com | Rashmi | Executive |
| L2 Manager | anjali@abstractgroup.com | Anjali | Management |
| L1 Manager | deepak@abstractgroup.com | Deepak | Management |
| IT Person | rahul@abstractgroup.com | Rahul | IT |
| Employee | tara@abstractgroup.com | Tara | Operations |

## 🎯 Usage Guide

### For Employees
1. **Login** with your credentials
2. **View dashboard** with your ticket statistics
3. **Create new tickets** using the "Create New Ticket" button
4. **Filter and sort** your tickets by various criteria
5. **View ticket details** by clicking on any ticket

### For IT Persons
1. **Access team overview** with all tickets
2. **Filter tickets** by category, status, and date
3. **Approve or reject** tickets using the action buttons
4. **Monitor team performance** through KPI cards
5. **Navigate between sections**: Dashboard, Create Ticket, Tickets, Agents, Settings, My Profile

### For L1/L2 Managers
1. **View assigned tickets** for your team
2. **Track team performance** metrics
3. **Handle ticket approvals** and rejections
4. **Monitor workload** through dashboard KPIs
5. **Navigate between sections**: Dashboard, Tickets, Approvals, Reports, Profile

### For COO (Rashmi) & CEO (Minan)
1. **Access executive dashboard** with comprehensive metrics
2. **Navigate between tabs**: Overview, Approvals, SLA Compliance, Reports
3. **Monitor SLA compliance** across all departments
4. **Export data** in PDF or CSV format
5. **View notifications** through the bell icon
6. **Access profile** through the avatar dropdown
7. **Navigate between sections**: Dashboard, Reports & Metrics, SLA Compliance, Approval Query, Export Data, My Profile

## 📁 Project Structure

```
src/
├── components/
│   ├── dashboards/          # Role-specific dashboard components
│   │   ├── EmployeeDashboard.jsx
│   │   ├── ITPersonDashboard.jsx
│   │   ├── ManagerL1Dashboard.jsx
│   │   ├── ManagerL2Dashboard.jsx
│   │   ├── COODashboard.jsx
│   │   └── CEODashboard.jsx
│   ├── shared/              # Reusable components
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── TicketTable.jsx
│   │   ├── TicketModal.jsx
│   │   ├── CreateTicketModal.jsx
│   │   └── KPICards.jsx
│   ├── Login.jsx
│   └── ProtectedRoute.jsx
├── contexts/
│   └── AuthContext.jsx      # Authentication state management
├── data/
│   └── hardcodedData.js     # Sample data and users
├── App.jsx                  # Main application component with routing
├── main.jsx                 # Application entry point
└── index.css                # Global styles and Tailwind imports
```

## 🎨 Design System

### Color Schemes
- **Employee**: Teal (`#14b8a6`)
- **IT Person**: Dark Blue (`#1e40af`)
- **L1/L2 Manager**: Blue (`#3b82f6`)
- **COO/CEO**: Blue-Gray (`#475569`)

### Components
- **Cards**: White background with subtle shadows
- **Buttons**: Consistent styling with hover effects
- **Tables**: Sortable headers with filter capabilities
- **Modals**: Full-screen overlays with detailed information
- **Forms**: Clean input fields with validation

## 🔧 Customization

### Adding New Users
Edit `src/data/hardcodedData.js` to add new users:
```javascript
{
  id: 17,
  name: "New User",
  email: "new.user@abstractgroup.com",
  password: "123",
  role: "employee", // employee, it_person, manager_l1, manager_l2, coo, ceo
  department: "IT"
}
```

### Modifying Categories
Update the categories object in `src/data/hardcodedData.js`:
```javascript
export const categories = {
  "New Category": ["Subcategory 1", "Subcategory 2"],
  // ... existing categories
};
```

### Styling Changes
- Modify `tailwind.config.js` for color scheme changes
- Update `src/index.css` for global style modifications
- Edit individual components for specific styling needs

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Static Hosting
The built files in the `dist` folder can be deployed to any static hosting service like:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 🔮 Future Enhancements

### Backend Integration
- Replace hardcoded data with API calls
- Implement real-time updates with WebSockets
- Add file upload functionality for attachments
- Implement email notifications

### Additional Features
- Advanced reporting and analytics
- Mobile app development
- Integration with external ticketing systems
- Automated SLA monitoring and alerts
- Advanced user management and permissions

### Performance Optimizations
- Implement lazy loading for large datasets
- Add caching mechanisms
- Optimize bundle size with code splitting
- Implement virtual scrolling for large tables

## 📝 License

This project is created for Abstract Group's internal IT ticket management system.

## 🤝 Contributing

This is an internal project for Abstract Group. For any modifications or enhancements, please contact the development team.

---

**Built with ❤️ for Abstract Group IT Team**
