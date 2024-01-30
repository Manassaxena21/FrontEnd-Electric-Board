// src/components/HomePageGrid.js
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './HomePageGrid.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCalendar } from '@fortawesome/free-solid-svg-icons';

const HomePageGrid = () => { //Column Names
    const columnLabelMapping = {
        id: 'Connection ID',
        applicantName: 'Applicant Name',
        gender: 'Gender',
        district: 'District',
        state: 'State',
        pincode: 'Pincode',
        ownership: 'Ownership',
        govtIdType: 'Government ID Type',
        idNumber: 'ID Number',
        category: 'Category',
        loadApplied: 'Load Applied (in KV)',
        dateOfApplication: 'Date of Application',
        dateOfApproval: 'Date of Approval',
        modifiedDate: 'Modified Date',
        status: 'Status',
        reviewerId: 'Reviewer ID',
        reviewerName: 'Reviewer Name',
        reviewerComments: 'Reviewer Comments',
      };
      //Column Name to be visible 
    const columnsToShow = ['applicantName', 'idNumber', 'dateOfApplication', 'loadApplied'];  
      //---------------------------useState hooks for initialisation-------------------------//
    const [data, setData] = useState([]); //useState with current value and updated value
    const [displayedData, setDisplayedData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editedData, setEditedData] = useState(null);

    useEffect(() => {//Mounting the effect side effect on function
        // Fetch data from Spring Boot backend
        fetch('http://localhost:8080/api/electricity-connections/home') // fetch the api
            .then(response => response.json())// promise executed
            .then(data => {
                console.log(data); // Log the data to the console
                setData(data);
                setDisplayedData(data.slice(0, pageSize));
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [pageSize]);

    const handleViewDetailsAsync = (index) => { // functions for state Management
        const originalIndex = data.findIndex(item => item.id === displayedData[index].id); // display data according to index
        setSelectedRow(originalIndex);
        
    };

    const handleHideDetailsAsync = () => {
        setSelectedRow(null);
        setEditMode(false); // Close edit mode when going back to the table
        setEditedData(null);
    };

    const handlePageSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(1); // Handle Page Size
        setDisplayedData(data.slice(0, size));
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1); //Handle Search
        applyFiltersAndPaginate(term, startDate,endDate);
    };

    const handleDateChange = (dates) => {
        const [start, end] = dates;

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`; //Format Date
        };

        const formattedStartDate = start ? new Date(formatDate(start)) : '';
        const formattedEndDate = end ? new Date(formatDate(end)):'';
        setStartDate(start);
        setEndDate(end);
        setCurrentPage(1); // Pagenation
        console.log(formattedStartDate);
        applyFiltersAndPaginate(searchTerm, formattedStartDate, formattedEndDate);
    };

    const handleEdit = (index) => {
        console.log('Clicked Edit button for index:', index);

    const originalIndex = index + (pageSize * (currentPage - 1));
    console.log('Calculated originalIndex:', originalIndex);

    if (originalIndex < data.length) {
        console.log('Editing data item:', data[originalIndex]);
        setEditMode(true);
        setEditedData({ ...data[originalIndex] });
    } else {
        console.error('Original index not found for displayed item at index:', index);
    }
    };

    const handleSaveEdit = async () => {
        try {
            // Validate loadApplied
            if (editedData.loadApplied > 2000 || editedData.loadApplied < 0) {
                alert('LoadApplied cannot exceed 2000 or be less than 0.');
                return;
            }
    
            // Update the data in the backend
            const response = await fetch(`http://localhost:8080/api/electricity-connections/update/${editedData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedData),
            });
    
            if (response.ok) {
                // Update the data in the frontend
                const updatedData = [...data];
                const indexToUpdate = updatedData.findIndex(item => item.id === editedData.id);
                updatedData[indexToUpdate] = { ...editedData };
    
                setData(updatedData);
                setDisplayedData(updatedData.slice(0, pageSize));
                setEditMode(false);
                setEditedData(null);
            } else {
                console.error('Failed to update data:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };
    

    const applyFiltersAndPaginate = (search, startDate,endDate) => {
        console.log('Filter Start Date:', startDate);
        console.log('Filter End Date:', endDate);
        let filteredData = data;

        if (search) {
            const searchStr = search.toString().toLowerCase().trim();
            filteredData = filteredData.filter(item => {
                const idNumberStr = item.idNumber.toString().toLowerCase().trim();
                console.log('Search Term:', searchStr);
                console.log('ID Number:', idNumberStr);
                console.log('Match:', idNumberStr.startsWith(searchStr));
                return idNumberStr.startsWith(searchStr);
            });
        }

        if (startDate && endDate) {
            filteredData = filteredData.filter(item => {
                const applicationDate = new Date(item.dateOfApplication);
                return applicationDate >= startDate && applicationDate <= endDate;
            });
        }
        console.log('Filtered Data:', filteredData);

        setDisplayedData(filteredData.slice(0, pageSize));
    };

    return (
        <div className="table-container">
            <h1 className="title">Welcome to MPPL</h1>

            {/* Pagination controls */}
            {selectedRow === null && !editMode && (
            <div className='upper-tab'>
                <div className="pagenation-class">
                    <label>Rows per page:</label>
                    <select onChange={(e) => handlePageSizeChange(Number(e.target.value))}>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
                <div className='datepicker'>
                    <label>
                        <DatePicker
                            startDate={startDate}
                            endDate={endDate}
                            selected={startDate}
                            onChange={handleDateChange}
                            selectsRange
                            isClearable
                            showClearButton={false}
                            //placeholderText="Select date range"
                            dateFormat="yyyy-MM-dd" // Set the desired date format
                        />
                        <FontAwesomeIcon icon={faCalendar} className='date-icon' />   
                    </label>
                </div>
                <div className='search-bar'>
                    <label><FontAwesomeIcon icon={faSearch} className='search-icon' />
                    <input type="text" value={searchTerm} onChange={(e) => 
                        handleSearch(e.target.value)} />
                    </label>
                </div>
            </div>
            )}

            {selectedRow !== null && !editMode ? (
                // Display full details for the selected row
                <div className="details-table-container">
                    <button className='button-back' onClick={handleHideDetailsAsync}>Back to Table</button>
                    <button className='button-edit' onClick={() => handleEdit(selectedRow)}>Edit</button>
                    <div>
                        <table className="details-table">
                            <thead>
                                <tr>
                                    <th>Attribute</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(data[selectedRow]).map(([key, value]) => (
                                    <tr key={key}>
                                        <td>{columnLabelMapping[key] || key}</td>
                                        <td>{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : editMode && editedData ? (
                // Display the edit form or modal
                <div className="edit-form-container">
    <h2>Edit Connection</h2>
    <table>
        <tbody>
            <tr>
                <td>Applicant Name:</td>
                <td>
                    <input
                        type="text"
                        value={editedData.applicantName}
                        onChange={(e) => setEditedData({ ...editedData, applicantName: e.target.value })}
                        disabled // Disable editing for applicantName
                    />
                </td>
            </tr>
            <tr>
                <td>Load Applied:</td>
                <td>
                    <input
                        type="number"
                        value={editedData.loadApplied}
                        onChange={(e) => setEditedData({ ...editedData, loadApplied: parseInt(e.target.value) || 0 })}
                    />
                </td>
            </tr>
            <tr>
                <td>GovtID Type:</td>
                <td>
                    <input
                        type="text"
                        value={editedData.govtIdType}
                        onChange={(e) => setEditedData({ ...editedData, govtIdType: e.target.value })}
                        disabled // Disable editing for applicantName
                    />
                </td>
            </tr>
            <tr>
                <td>Status:</td>
                    <td>
                        <select
                            value={editedData.status}
                            onChange={(e) => setEditedData({ ...editedData, status: e.target.value })}
                        >
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Pending">Pending</option>
                        <option value="Connection Released">Connection Released</option>
                        </select>
                    </td>
            </tr>
            <tr>
                <td>Category:</td>
                    <td>
                        <select
                            value={editedData.category}
                            onChange={(e) => setEditedData({ ...editedData, category: e.target.value })}
                        >
                        <option value="Commerical">Commercial</option>
                        <option value="Residential">Residential</option>

                        </select>
                </td>
            </tr>
            {/* Add similar rows for other editable fields */}
            <tr>
                <td>Date of Application:</td>
                <td>
                    <input
                        type="text"
                        value={editedData.dateOfApplication}
                        onChange={(e) => setEditedData({ ...editedData, dateOfApplication: e.target.value })}
                        disabled // Disable editing for dateOfApplication
                    />
                </td>
            </tr>
        </tbody>
    </table>

    {/* Add Save and Cancel buttons */}
    <button onClick={handleSaveEdit}>Save</button>
    <button className='button-cancel' onClick={handleHideDetailsAsync}>Cancel</button>
</div>
            ) : (
                // Display table with limited columns
                <table>
                    {/* Table headers */}
                    <thead>
                        <tr>
                            {columnsToShow.map((column) => (
                                <th key={column}>{columnLabelMapping[column] || column}</th>
                            ))}
                            <th>Action</th>
                        </tr>
                    </thead>
                    {/* Table body */}
                    <tbody>
                        {displayedData.map((connection, index) => (
                            <tr key={connection.id}>
                                {columnsToShow.map((column) => (
                                    <td key={column}>{connection[column] || 'N/A'}</td>
                                ))}
                                <td>
                                    <button onClick={() => handleViewDetailsAsync(index)}>View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default HomePageGrid;
