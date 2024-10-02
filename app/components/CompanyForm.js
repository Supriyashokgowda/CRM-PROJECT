import { useState, useEffect } from 'react';

const CompanyForm = ({ company, onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [industry, setIndustry] = useState('');
    const [description, setDescription] = useState('');
    const [size, setSize] = useState('');
    const [errors, setErrors] = useState({}); // State to store error messages

    // Populate the form fields when a company is selected for editing
    useEffect(() => {
        if (company) {
            setName(company.name);
            setIndustry(company.industry);
            setDescription(company.description);
            setSize(company.size);
        } else {
            // Clear the form when no company is selected
            setName('');
            setIndustry('');
            setDescription('');
            setSize('');
        }
    }, [company]);

    const validate = () => {
        const newErrors = {};
        if (!name) newErrors.name = 'Company name is required';
        if (!industry) newErrors.industry = 'Industry is required';
        if (!description) newErrors.description = 'Description is required';
        if (!size || isNaN(size)) newErrors.size = 'Size must be a number';
        
        setErrors(newErrors); // Update error state
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validate()) return; // Validate before proceeding

        const companyData = {
            name,
            industry,
            description,
            size,
            id: company ? company._id : undefined, // Include ID for update, omit for create
        };

        await onSave(companyData); // Call the onSave prop passed from page.js

        // Reset form fields after submission
        setName('');
        setIndustry('');
        setDescription('');
        setSize('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Company Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>} {/* Display error for name */}

            <input
                type="text"
                placeholder="Industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
            />
            {errors.industry && <p style={{ color: 'red' }}>{errors.industry}</p>} {/* Display error for industry */}

            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />
            {errors.description && <p style={{ color: 'red' }}>{errors.description}</p>} {/* Display error for description */}

            <input
                type="text"
                placeholder="Size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                required
            />
            {errors.size && <p style={{ color: 'red' }}>{errors.size}</p>} {/* Display error for size */}

            <button type="submit">{company ? 'Update Company' : 'Create Company'}</button>
            {company && <button type="button" onClick={onCancel}>Cancel</button>} {/* Cancel button */}
        </form>
    );
};

export default CompanyForm;