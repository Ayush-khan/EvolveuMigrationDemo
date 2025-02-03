import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

function DemoTable() {
    // Define your dummy data
    const products = [
        { id: 1, name: 'Product 1', price: 100 },
        { id: 2, name: 'Product 2', price: 200 },
        { id: 3, name: 'Product 3', price: 300 },
        // Add more data as needed
    ];

    const { SearchBar, ClearSearchButton } = Search;

    const columns = [{
        dataField: 'id',
        text: 'Product ID'
    }, {
        dataField: 'name',
        text: 'Product Name'
    }, {
        dataField: 'price',
        text: 'Product Price'
    }];

    return (
        <ToolkitProvider
            keyField="id"
            data={products} // Pass dummy data to the ToolkitProvider
            columns={columns}
            search
        >
            {
                props => (
                    <div>
                        <h3>Input something at below input field:</h3>
                        <SearchBar {...props.searchProps} />
                        <ClearSearchButton text="Clear" {...props.searchProps} /> {/* Fix for defaultProps */}
                        <hr />
                        <BootstrapTable
                            {...props.baseProps}
                        />
                    </div>
                )
            }
        </ToolkitProvider>
    );
}

export default DemoTable;
