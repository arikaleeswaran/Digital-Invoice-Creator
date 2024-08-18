# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Digital Invoice Generator

This project is a digital invoice generator application with a React frontend and Express backend. It allows users to create, manage, and export professional invoices easily.

## Features

- Create and edit invoices
- Add multiple line items to invoices
- Calculate subtotals and totals automatically
- Generate PDF invoices for download
- Save invoices to a database
- User authentication and authorization
- Responsive design for desktop and mobile use

## Tech Stack

- Frontend: React, React Router, Axios
- Backend: Node.js, Express
- Database: MongoDB
- PDF Generation: PDFKit
- Authentication: JSON Web Tokens (JWT)

## Installation

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- MongoDB

### Setup

1. Clone the repository

2. Install dependencies for both frontend and Backend

3. Set up environment variables

- Create a `.env` file in the `backend` directory

4. Start the backend server

5. In a new terminal, start the frontend development server

6. Open your browser and navigate to `http://localhost:3000` to use the application.

## Usage

1. Register a new account or log in with existing credentials.
2. Click on "Create New Invoice" to start a new invoice.
3. Fill in the client details and add line items to the invoice.
4. Save the invoice or generate a PDF for download.
5. View and manage your invoices from the dashboard.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
