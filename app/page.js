"use client"; // Ensures this component runs on the client side

import { useState, useEffect } from 'react';
import CompanyForm from './components/CompanyForm'; // Import the CompanyForm component
import Pagination from './components/Pagination'; // Import the Pagination component
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

export default function Home() {
    const [companies, setCompanies] = useState([]); // Store companies
    const [selectedCompany, setSelectedCompany] = useState(null); // Store the company being edited
    const [searchQuery, setSearchQuery] = useState(''); // State for search input
    const [selectedIndustry, setSelectedIndustry] = useState(''); // State for filtering by industry
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const companiesPerPage = 5; // Number of companies to display per page

    // Fetch companies when the page loads
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch('/api/companies'); // API to fetch all companies
                if (!response.ok) {
                    throw new Error('Failed to fetch companies');
                }
                const data = await response.json();
                setCompanies(data); // Set the companies in state
            } catch (error) {
                toast.error(error.message); // Show error message using Toastify
            }
        };
        fetchCompanies(); // Call the fetch function when the component mounts
    }, []);

    // Handle saving a new or updated company
    const handleSaveCompany = async (companyData) => {
        const method = selectedCompany ? 'PUT' : 'POST'; // Choose between create and update

        try {
            const response = await fetch('/api/companies', {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(companyData), // Send the company data as JSON
            });

            if (!response.ok) {
                throw new Error('Failed to save company');
            }

            const data = await response.json();
            toast.success(data.message); // Show success message using Toastify
            setSelectedCompany(null); // Clear the selected company after saving

            // Refetch companies after the save
            const fetchCompanies = async () => {
                const response = await fetch('/api/companies');
                const data = await response.json();
                setCompanies(data); // Refresh the company list
            };
            fetchCompanies();
        } catch (error) {
            toast.error(error.message); // Show error message using Toastify
        }
    };

    // Handle deleting a company
    const handleDeleteCompany = async (companyId) => {
        try {
            const response = await fetch('/api/companies', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: companyId }), // Send the company ID to delete
            });

            if (!response.ok) {
                throw new Error('Failed to delete company');
            }

            const data = await response.json();
            toast.success(data.message); // Show success message using Toastify

            // Refetch companies after the deletion
            const fetchCompanies = async () => {
                const response = await fetch('/api/companies');
                const data = await response.json();
                setCompanies(data); // Refresh the company list
            };
            fetchCompanies();
        } catch (error) {
            toast.error(error.message); // Show error message using Toastify
        }
    };

    // Handle selecting a company for editing
    const handleSelectCompany = (company) => {
        setSelectedCompany(company); // Set the selected company in the state for editing
    };

    // Filter companies based on search query and selected industry
    const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        (selectedIndustry ? company.industry === selectedIndustry : true) // Filter by industry if selected
    );

    // Calculate total pages based on filtered companies
    const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);
    
    // Slice the companies to show only the current page
    const paginatedCompanies = filteredCompanies.slice((currentPage - 1) * companiesPerPage, currentPage * companiesPerPage);

    // Extract unique industries for dropdown
    const uniqueIndustries = [...new Set(companies.map(company => company.industry))];

    return (
        <div>
            <h1>Company Management</h1>

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
            />

            {/* Industry Filter Dropdown */}
            <select 
                value={selectedIndustry} 
                onChange={(e) => setSelectedIndustry(e.target.value)} // Update selected industry
            >
                <option value="">All Industries</option>
                {uniqueIndustries.map((industry, index) => (
                    <option key={index} value={industry}>{industry}</option> // Dynamic industry options
                ))}
            </select>

            {/* Render the form for creating or updating companies */}
            <CompanyForm 
                company={selectedCompany} // Pass the selected company if in edit mode
                onSave={handleSaveCompany} // Handle save or update
                onCancel={() => setSelectedCompany(null)} // Cancel editing
            />

            {/* Render the list of companies */}
            <h2>Company List</h2>
            <ul>
                {paginatedCompanies.map((company) => (
                    <li key={company._id}>
                        <h3>{company.name}</h3>
                        <p>Industry: {company.industry}</p>
                        <p>Description: {company.description}</p>
                        <p>Size: {company.size}</p>
                        <p>Created At: {new Date(company.createdAt).toLocaleString()}</p>
                        <button onClick={() => handleSelectCompany(company)}>Edit</button>
                        <button onClick={() => handleDeleteCompany(company._id)}>Delete</button>
                    </li>
                ))}
            </ul>

            {/* Add Pagination component */}
            <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
            />

            <ToastContainer /> {/* Add the ToastContainer to render notifications */}
        </div>
    );
}