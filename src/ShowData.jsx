import React, { useEffect } from 'react'

const ShowData = () => {

    useEffect(() => {

        const getAllSheetData = async () => {
            const scriptURL = 'https://script.google.com/macros/s/AKfycbwOzar5hIae2x7bXU0EnTSGU9pzLA9Qu0IDfsUN4nb8AOHFcrmuTLoHRlHNp459oRet/exec';
        
            try {
                const formParams = new URLSearchParams();
                formParams.append("action", "getAllData");  // Action to indicate fetching all data
        
                const response = await fetch(scriptURL);
        
                if (response.ok) {
                    const data = await response.json();
                    console.log("All Data: ", data);  // Handle and display the full data here
                } else {
                    console.error("Error fetching all data: ", response);
                }
            } catch (error) {
                console.error("Error: ", error);
            }
        };
        
        // Call the function to fetch all the data from the Google Sheet
        getAllSheetData();  // Call the function to fetch data

    }, []);
    return (
        <div>ShowData</div>
    )
}

export default ShowData