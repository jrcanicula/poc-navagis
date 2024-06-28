import React from 'react';


const Filter = ({ types, selectedType, onSelectType }) => {
    return (
        <div className="filter-container">
            <label htmlFor="type">Filter by type:</label>
            <select id="type" value={selectedType} onChange={(e) => onSelectType(e.target.value)}>
                <option value="">All</option>
                {types.map((type) => (
                    <option key={type} value={type}>
                        {type}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Filter;
