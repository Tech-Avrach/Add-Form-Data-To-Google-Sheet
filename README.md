## Introduction

In this tutorial, we'll learn how to submit HTML form data directly to Google Sheets using React.js. By leveraging Google Apps Script, we'll create a seamless connection between your React app and a Google Sheet, allowing you to store and manage form submissions efficiently. Follow along as we set up this integration step-by-step.


## HTML/JSX File Overview

- A form with input fields
- A function to store the form values in a variable
- A function to handle the submission of the form data

These components will work together to capture user input and manage the data efficiently.

## Basic Structure for HTML/JSX File

```jsx
import React, { useState } from 'react';
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState('');

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Console form data
    console.log(formData);
  };

  return (
    <>
      <h1 className="title">Form Data to Google Sheet</h1>
      <div className="main">
        <div className="contact-form">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                name="name"
                placeholder="Your Name.."
                value={formData.name}
                onChange={handleInputChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email.."
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                name="phone"
                placeholder="Phone Number.."
                value={formData.phone}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="subject"
                placeholder="Your Subject.."
                value={formData.subject}
                onChange={handleInputChange}
              />
            </div>
            <textarea
              name="message"
              placeholder="Enter Your Message.."
              value={formData.message}
              onChange={handleInputChange}
            />
            <button type="submit">SUBMIT MESSAGE</button>
          </form>
          {status && <p className="form-status">{status}</p>}
        </div>
      </div>
    </>
  )
}

export default App
```

## Steps to Create a New Google Spreadsheet

1. **Open Google Sheets**
   - Navigate to [Google Sheets](https://sheets.google.com) in your web browser. If you are not already signed in to your Google account, you will be prompted to do so.

2. **Create a New Spreadsheet**
   - Once you are on the Google Sheets homepage, click on the `+` icon labeled "Blank" or "New Spreadsheet." This will open a new, untitled spreadsheet.

3. **Name Your Spreadsheet**
   - Click on the title of the new spreadsheet, which is usually "Untitled spreadsheet," located at the top-left corner of the page. Enter a descriptive name for your spreadsheet and press `Enter` to save.

4. **Rename sheet1**
   - Click on the name of new spreadSheet which is usually "sheet1" located at the bottom-left corner of the page. Rename it according your need 

5. **open Extensions**
   - open Extenshions from top bar of your sheet and then click on "App Script".

6. **Add this Script**

```js
var sheetName = ''

        var scriptProp = PropertiesService.getScriptProperties()

function intialSetup() {
    var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    scriptProp.setProperty('key', activeSpreadsheet.getId());
    Logger.log(activeSpreadsheet.getId());  // Log to verify the spreadsheet ID
}

function doPost(e) {
    try {
        var spreadsheetId = scriptProp.getProperty('key');
        Logger.log('Spreadsheet ID: ' + spreadsheetId);  // Log the spreadsheet ID

        var doc = SpreadsheetApp.openById(spreadsheetId);
        var sheet = doc.getSheetByName(sheetName);

        Logger.log('Sheet: ' + sheet);  // Log if sheet is null or valid

        var sheets = doc.getSheets();
    
    var sheetNames = sheets.map(function(sheet) {
        return sheet.getName();
    });

    // Logger.log('Available sheets: ' + sheetNames.join(', '));

        if (!sheet) {
            throw new Error('Sheet not found: ' + sheet + ' Available sheets: ' + sheetNames.join(', '));
        }

        var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        var nextRow = sheet.getLastRow() + 1;

        var newRow = headers.map(function (header) {
            return header === 'timestamp' ? new Date() : e.parameter[header];
        });

        sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

        return ContentService
            .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
            .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
        Logger.log('Error: ' + error.message);
        return ContentService
            .createTextOutput(JSON.stringify({ 
                'result': 'error', 
                'error': error.message 
            }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}
```

7. **Add SheetName**
   - Add sheet name which you have named in bottom-left corner of your google sheet.

8. **Deploy Script**
   - Deploy the script by clicking on deploy button from top-right corner and make sure to deploy it as a web app, then copy the url you get after the deployment.

9. **Add Column Names**
   - Add column names in the first row of your spreadsheet. Ensure these column names match the keys of the object in your code’s form. For example, in your case, the columns should be:

     - **Name**
     - **Email**
     - **Phone**
     - **Subject**
     - **Message**

10. **Add api calling in your code**
    - modify submit function to call the api and send the formData to sheet.

    ```jsx
            const handleSubmit = async (e) => {
        e.preventDefault();
    
        const scriptURL = 'https://script.google.com/macros/s/AKfycbwUFZEpCYvcw5wR48u9tEYGt2yvErAXDPDpF99IgYl*************************';
    
        // Convert form data to URLSearchParams for x-www-form-urlencoded format
        const formParams = new URLSearchParams();
        for (const key in formData) {
            formParams.append(key, formData[key]);
        }
    
        try {
            const response = await fetch(scriptURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formParams.toString(),
            });
    
            console.log("Response: ", response);
    
            if (response.ok) {
                setStatus('Message sent successfully!');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: ''
                });
            } else {
                setStatus('Failed to send message. Please try again.');
            }
        } catch (error) {
            console.log("Error: ", error);
            setStatus('Error occurred. Please try again.');
        }
    };
    ```


    - Your whole code must look like 

    ```jsx
    import React, { useState } from 'react';
    import './App.css'

    function App() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [status, setStatus] = useState('');

    // Handle form input changes
    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
        ...prevData,
        [name]: value
    }));
    };


        // Handle form submission
        const handleSubmit = async (e) => {
        e.preventDefault();
    
        const scriptURL = 'https://script.google.com/macros/s/AKfycbwUFZEpCYvcw5wR48u9tEYGt2yvErAXDPDpF99IgYl*************************';
    
        // Convert form data to URLSearchParams for x-www-form-urlencoded format
        const formParams = new URLSearchParams();
        for (const key in formData) {
            formParams.append(key, formData[key]);
        }
    
        try {
            const response = await fetch(scriptURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formParams.toString(),
            });
    
            console.log("Response: ", response);
    
            if (response.ok) {
                setStatus('Message sent successfully!');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: ''
                });
            } else {
                setStatus('Failed to send message. Please try again.');
            }
        } catch (error) {
            console.log("Error: ", error);
            setStatus('Error occurred. Please try again.');
        }
    };

    return (
        <>
        <h1 className="title">Form Data to Google Sheet</h1>
        <div className="main">
            <div className="contact-form">
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                <input
                    type="text"
                    name="name"
                    placeholder="Your Name.."
                    value={formData.name}
                    onChange={handleInputChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Your Email.."
                    value={formData.email}
                    onChange={handleInputChange}
                />
                </div>
                <div className="form-row">
                <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number.."
                    value={formData.phone}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="subject"
                    placeholder="Your Subject.."
                    value={formData.subject}
                    onChange={handleInputChange}
                />
                </div>
                <textarea
                name="message"
                placeholder="Enter Your Message.."
                value={formData.message}
                onChange={handleInputChange}
                />
                <button type="submit">SUBMIT MESSAGE</button>
            </form>
            {status && <p className="form-status">{status}</p>}
            </div>
        </div>
        </>
    )
    }

    export default App
 
    ```

11. **Process completed**
    - Now you can add data to your google sheet seemless if you have followed these following steps 






