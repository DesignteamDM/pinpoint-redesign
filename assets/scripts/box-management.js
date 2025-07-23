// Box Management State
let boxes = [];
let items = []; // This will be populated from the order details
let currentBoxId = null; // Track the currently selected box for printing

// Initialize box management
function initializeBoxManagement() {
    // Load saved data from localStorage if available
    // const savedData = localStorage.getItem('boxManagementData');
    // if (savedData) {
    //     const data = JSON.parse(savedData);
    //     boxes = data.boxes || [];
    //     items = data.items || [];
        
        // Ensure qtyPacked is in sync with box contents
    //     items.forEach(item => {
    //         const totalPacked = boxes.reduce((total, box) => {
    //             const boxItem = box.items.find(i => i.id === item.id);
    //             return total + (boxItem ? boxItem.quantity : 0);
    //         }, 0);
            
    //         item.qtyPacked = totalPacked;
    //         if (totalPacked === 0) {
    //             delete item.boxId;
    //         }
    //     });
    // } else {
        // Initialize with sample data or fetch from order details
        initializeSampleItems();
    // }
    updateUI();
    
    // Add event listener for print button
    document.getElementById('printBoxContentsBtn')?.addEventListener('click', function() {
        if (currentBoxId) {
            printPackingSlip(currentBoxId);
        }
    });
}

// Initialize sample items (replace with actual order items)
function initializeSampleItems() {
    items = [
        { id: 1, name: 'Mens Corporate Quarter Snap Up Sweater Fleece', color: 'BLACK/WHITE_001', size: 'XL', qtyOrdered: 144, qtyPacked: 0, boxId: null },
        { id: 2, name: 'Mens Corporate Quarter Snap Up Sweater Fleece', color: 'BLACK/WHITE_001', size: '2XL', qtyOrdered: 72, qtyPacked: 0, boxId: null },
        { id: 3, name: 'Mens Corporate Quarter Snap Up Sweater Fleece', color: 'BLACK/WHITE_001', size: '3XL', qtyOrdered: 72, qtyPacked: 0, boxId: null },
        { id: 4, name: 'Womens Classic Polo Shirt', color: 'BLACK/WHITE_001', size: 'S', qtyOrdered: 25, qtyPacked: 0, boxId: null },
        { id: 5, name: 'Womens Classic Polo Shirt', color: 'BLACK/WHITE_001', size: 'M', qtyOrdered: 50, qtyPacked: 0, boxId: null },
        { id: 6, name: 'Womens Classic Polo Shirt', color: 'BLACK/WHITE_001', size: 'L', qtyOrdered: 75, qtyPacked: 0, boxId: null }
    ];
}

// Open box management modal
function openBoxManagementModal() {
    const modal = document.getElementById('boxManagementModal');
    modal.style.display = 'block';
    updateUI();
}

// Close box management modal
function closeBoxManagementModal() {
    const modal = document.getElementById('boxManagementModal');
    modal.style.display = 'none';
}

// Add a new box
function addNewBox() {
    const boxNumber = boxes.length + 1;
    boxes.push({
        id: Date.now(),
        number: boxNumber,
        trackingNumber: '',
        items: []
    });
    updateUI();
}

// Add item to box
function addItemToBox(itemId, boxId, quantity) {
    const item = items.find(i => i.id === itemId);
    const box = boxes.find(b => b.id === boxId);
    
    if (item && box && quantity > 0) {
        const remaining = item.qtyOrdered - (item.qtyPacked || 0);
        const qtyToAdd = Math.min(quantity, remaining);
        
        if (qtyToAdd <= 0) return;
        
        // Update the item's packed quantity
        item.qtyPacked = (item.qtyPacked || 0) + qtyToAdd;
        
        // Don't set boxId on the item since we want to allow multiple boxes
        
        // Check if this item is already in the box
        const existingItem = box.items.find(i => i.id === itemId);
        if (existingItem) {
            // Item already exists in box, update quantity
            existingItem.quantity += qtyToAdd;
        } else {
            // Add new item to box
            box.items.push({
                id: item.id,
                name: item.name,
                color: item.color,
                size: item.size,
                quantity: qtyToAdd,
                qtyOrdered: item.qtyOrdered
            });
        }
        
        saveData();
        updateUI();
        
        // Show success message
        const boxNumber = box.number;
        const itemName = item.name;
        const itemSize = item.size;
        
        // You can uncomment this to show a notification if you have a notification system
        // showNotification(`Added ${qtyToAdd} ${itemName} (${itemSize}) to Box ${boxNumber}`, 'success');
    }
}

// Remove item from box
function removeItemFromBox(itemId, boxId, quantity = null) {
    const item = items.find(i => i.id === itemId);
    const box = boxes.find(b => b.id === boxId);
    
    if (item && box) {
        const boxItem = box.items.find(i => i.id === itemId);
        if (!boxItem) return;
        
        // Parse quantity to remove (default to all if not specified)
        let qtyToRemove = quantity !== null ? parseInt(quantity, 10) : boxItem.quantity;
        if (isNaN(qtyToRemove) || qtyToRemove <= 0) {
            qtyToRemove = boxItem.quantity; // Default to removing all if invalid quantity
        }
        
        // Ensure we don't remove more than what's in the box
        qtyToRemove = Math.min(qtyToRemove, boxItem.quantity);
        
        if (qtyToRemove <= 0) return;
        
        // Update or remove the item from the box first
        if (boxItem.quantity > qtyToRemove) {
            // Only remove part of the quantity
            boxItem.quantity -= qtyToRemove;
        } else {
            // Remove the entire item from the box
            box.items = box.items.filter(i => i.id !== itemId);
        }
        
        // Then update the item's packed quantity based on actual box contents
        const totalPacked = boxes.reduce((total, b) => {
            const boxItem = b.items.find(i => i.id === itemId);
            return total + (boxItem ? boxItem.quantity : 0);
        }, 0);
        
        item.qtyPacked = totalPacked;
        
        // If all items are removed from the box, remove the box
        if (box.items.length === 0) {
            boxes = boxes.filter(b => b.id !== boxId);
        }
        
        // If no more of this item is packed, ensure boxId is cleared
        if (item.qtyPacked === 0) {
            delete item.boxId;
        }
        
        saveData();
        updateUI();
    }
}

// Save tracking number for a box
function saveTrackingNumber(boxId, trackingNumber) {
    const box = boxes.find(b => b.id === boxId);
    if (box) {
        box.trackingNumber = trackingNumber.trim();
        saveData();
        updateUI();
        
        // Update the tracking number in the main shipments table if it exists
        updateTrackingNumbersInShipments();
    }
}

// Update tracking numbers in the main shipments table
function updateTrackingNumbersInShipments() {
    // This function would need to be implemented based on how your shipments table is structured
    // It should update the tracking numbers in the main shipments table to match the boxes
    console.log('Updating tracking numbers in shipments table...');
    // Implementation depends on your specific HTML structure
}

// Print all packing slips
function printPackingSlips() {
    if (boxes.length === 0) {
        alert('No boxes to print.');
        return;
    }
    
    // Open a new window for printing
    const printWindow = window.open('', '_blank');
    let printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>All Packing Slips</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .packing-slip { page-break-after: always; margin-bottom: 30px; }
                .packing-slip:last-child { page-break-after: auto; }
                h4 { color: #333; margin-bottom: 10px; }
                table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                th { text-align: left; border-bottom: 2px solid #333; padding: 8px; }
                td { padding: 8px; border-bottom: 1px solid #ddd; }
                .footer { margin-top: 20px; padding-top: 10px; border-top: 1px solid #ddd; }
                @media print {
                    @page { size: auto; margin: 10mm; }
                    body { padding: 0; }
                }
            </style>
        </head>
        <body>
    `;
    
    // Add each box's packing slip to the print content
    boxes.forEach((box, index) => {
        printContent += `
            <div class="packing-slip">
                <h3>Packing Slip - Box ${box.number}</h3>
                ${box.trackingNumber ? `<p><strong>Tracking #:</strong> ${box.trackingNumber}</p>` : ''}
                
                <h4>Items in this box:</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Color</th>
                            <th>Size</th>
                            <th style="text-align: right;">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${box.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.color}</td>
                                <td>${item.size}</td>
                                <td style="text-align: right;">${item.quantity}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="footer">
                    <p><strong>Total Items:</strong> ${box.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                    <p>Packed on: ${new Date().toLocaleDateString()}</p>
                </div>
            </div>
        `;
    });
    
    printContent += `
            <script>
                window.onload = function() { 
                    // Print automatically when loaded
                    setTimeout(function() {
                        window.print();
                        // Close the window after printing
                        window.onafterprint = function() {
                            window.close();
                        };
                    }, 500);
                };
            </script>
        </body>
        </html>
    `;
    
    // Write the content to the new window and close the document
    printWindow.document.write(printContent);
    printWindow.document.close();
}

// Update the UI
function updateUI() {
    // Update available items list
    const availableItemsTbody = document.getElementById('availableItems');
    availableItemsTbody.innerHTML = '';
    
    items.forEach(item => {
        const remaining = item.qtyOrdered - (item.qtyPacked || 0);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.color}</td>
            <td>${item.size}</td>
            <td>${item.qtyOrdered}</td>
            <td>${item.qtyPacked || 0} of ${item.qtyOrdered}</td>
            <td>
                ${remaining > 0 ? `
                    <div style="display: flex; gap: 5px;">
                        <input 
                            type="number" 
                            min="1" 
                            max="${remaining}" 
                            value="${remaining}" 
                            class="form-control form-control-sm" 
                            style="width: 80px;"
                            id="qty-input-${item.id}"
                            placeholder="Qty"
                        >
                        <select 
                            onchange="handleBoxSelection(${item.id}, this)" 
                            class="form-control form-control-sm"
                            id="box-select-${item.id}"
                        >
                            <option value="">Select Box</option>
                            ${boxes.map(box => `
                                <option value="${box.id}">Box ${box.number}</option>
                            `).join('')}
                            <option value="new">+ New Box</option>
                        </select>
                    </div>

                ` : 'Fully Packed'}
            </td>
        `;
        availableItemsTbody.appendChild(row);
    });
    
    // Update box list
    const boxList = document.getElementById('boxList');
    boxList.innerHTML = '';
    
    if (boxes.length === 0) {
        boxList.innerHTML = '<p class="pui-text-center pui-p-10px" style="color: #666;">No boxes created yet. Add a box to get started.</p>';
    } else {
        boxes.forEach(box => {
            const boxElement = document.createElement('div');
            boxElement.className = 'box-item pui-mb-10px';
            
            
            const itemCount = box.items.reduce((total, item) => total + item.quantity, 0);
            
            boxElement.innerHTML = `
                <div class="box-item-header">
                    <h4 style="margin: 0;">Box ${box.number} (${itemCount} items)</h4>
                    <div>
                        <button class="pui-btn pui-btn-sm pui-btn-link" onclick="deleteBox(${box.id})">
                        <svg style="display:block" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                                <path d="M3 6h18"></path>
                                                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                                                <line x1="10" x2="10" y1="11" y2="17"></line>
                                                                <line x1="14" x2="14" y1="11" y2="17"></line>
                                                            </svg>
                        </button>
                        
                    </div>
                </div>
                
                ${box.trackingNumber ? `
                    <div class="box-item-tracking pui-mb-10px">
                        <span class="pui-badge pui-badge-success pui-me-5px">
                            Tracking: ${box.trackingNumber}
                           
                        </span>
                    </div>
                ` : ''}
                <div class="box-items">
                    ${box.items.length > 0 ? `
                        <table class="data-table pui-mb-none" style="width: 100%;">
                        <colgroup>
                            <col style="width: 30%;">
                            <col style="width: 30%;">
                            <col style="width: 20%;">
                            <col style="width: 10%;">
                            <col style="width: 10%;">
                        </colgroup>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Color</th>
                                    <th>Size</th>
                                    <th>Qty</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                ${box.items.map(item => `
                                    <tr>
                                        <td>${item.name}</td>
                                        <td>${item.color}</td>
                                        <td>${item.size}</td>
                                        <td>${item.quantity}</td>
                                        <td style="text-align: right;">
                                            <button class="btn-action" title="Delete" 
                                                    onclick="removeItemFromBox(${item.id}, ${box.id})">
                                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                                <path d="M3 6h18"></path>
                                                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                                                <line x1="10" x2="10" y1="11" y2="17"></line>
                                                                <line x1="14" x2="14" y1="11" y2="17"></line>
                                                            </svg>
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : '<p>No items in this box yet.</p>'}
                </div>
                <div class="box-item-actions pui-text-right pui-mb-5px">
                    
                    
                        <button class="pui-btn pui-btn-sm pui-btn-primary pui-ms-10px" 
                                onclick="saveTrackingNumber(${box.id}, document.getElementById('tracking-${box.id}').value)">
                            Print
                        </button>
                        
                 
                </div>
            `;
            
            boxList.appendChild(boxElement);
        });
    }
    
    // Update box selector for tracking numbers
    const boxSelector = document.getElementById('boxSelector');
    boxSelector.innerHTML = '<option value="">Select a box</option>' + 
        boxes.map(box => `
            <option value="${box.id}">Box ${box.number}${box.trackingNumber ? ` (${box.trackingNumber})` : ''}</option>
        `).join('');
    
    // Update summary
    updateBoxSummary();
    
    // Save to localStorage
    saveData();
}

// Update the box summary on the main page
function updateBoxSummary() {
    const boxSummary = document.getElementById('boxSummary');
    if (boxes.length === 0) {
        boxSummary.innerHTML = '<p>No boxes have been created yet. Click "Manage Boxes" to get started.</p>';
    } else {
        boxSummary.innerHTML = `
            <div class="pui-row">
                <div class="pui-col-md-12">
                    <h4>Box Summary</h4>
                    <table class="data-table" style="width: 100%;">
                        <thead>
                            <tr>
                                <th>Box #</th>
                                <th>Items</th>
                                <th>Tracking #</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${boxes.map(box => {
                                const itemCount = box.items.reduce((total, item) => total + item.quantity, 0);
                                return `
                                    <tr>
                                        <td>Box ${box.number}</td>
                                        <td>${itemCount} items</td>
                                        <td>${box.trackingNumber || 'Not set'}</td>
                                        <td>
                                            <button class="pui-btn pui-btn-sm pui-btn-primary" 
                                                    onclick="printPackingSlip(${box.id})">
                                                Print Slip
                                            </button>
                                            ${box.trackingNumber ? `
                                                <button class="pui-btn pui-btn-sm pui-btn-secondary" 
                                                        onclick="showBoxContents('${box.trackingNumber}')">
                                                    View Contents
                                                </button>
                                            ` : ''}
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
}

// Delete a box
function deleteBox(boxId) {
    if (confirm('Are you sure you want to delete this box? All items will be returned to available items.')) {
        // Return all items to available
        const box = boxes.find(b => b.id === boxId);
        if (box) {
            box.items.forEach(boxItem => {
                const item = items.find(i => i.id === boxItem.id);
                if (item) {
                    // Reset qtyPacked and ensure it doesn't go below 0
                    item.qtyPacked = Math.max(0, (item.qtyPacked || 0) - boxItem.quantity);
                    // Remove boxId reference since we're no longer tracking which box it's in
                    delete item.boxId;
                }
            });
        }
        
        // Remove the box
        boxes = boxes.filter(b => b.id !== boxId);
        saveData();
        updateUI();
        
        // If we're viewing the deleted box in the modal, close it
        if (currentBoxId === boxId) {
            const modal = document.getElementById('boxContentsModal');
            if (modal) {
                modal.style.display = 'none';
            }
            currentBoxId = null;
        }
    }
}

// Print packing slip for a specific box
function printPackingSlip(boxId) {
    const box = boxes.find(b => b.id === boxId);
    if (!box) return;
    
    currentBoxId = boxId; // Store the current box ID for printing
    
    // Create a print-friendly version of the box contents
    const printContent = `
        <div class="box-contents">
            <h4>Packing Slip - Box ${box.number}</h4>
            ${box.trackingNumber ? `<p><strong>Tracking #:</strong> ${box.trackingNumber}</p>` : ''}
            
            <h5>Items in this box:</h5>
            <table class="data-table" style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <thead>
                    <tr>
                        <th style="text-align: left; border-bottom: 1px solid #ddd;">Item</th>
                        <th style="text-align: left; border-bottom: 1px solid #ddd;">Color</th>
                        <th style="text-align: left; border-bottom: 1px solid #ddd;">Size</th>
                        <th style="text-align: right; border-bottom: 1px solid #ddd;">Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    ${box.items.map(item => `
                        <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${item.name}</td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${item.color}</td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${item.size}</td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${item.quantity}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #ddd;">
                <p><strong>Total Items:</strong> ${box.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                <p>Packed on: ${new Date().toLocaleDateString()}</p>
            </div>
        </div>
    `;
    
    // Show the print preview in the modal
    const boxContentsBody = document.getElementById('boxContentsBody');
    if (boxContentsBody) {
        boxContentsBody.innerHTML = printContent;
        document.getElementById('boxContentsModal').style.display = 'block';
    } else {
        // Fallback to browser print if modal isn't available
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Packing Slip - Box ${box.number}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h4 { color: #333; margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                    th { text-align: left; border-bottom: 2px solid #333; padding: 8px; }
                    td { padding: 8px; border-bottom: 1px solid #ddd; }
                    .footer { margin-top: 30px; padding-top: 10px; border-top: 1px solid #ddd; }
                    @media print {
                        @page { size: auto; margin: 0; }
                        body { padding: 20px; }
                    }
                </style>
            </head>
            <body>
                ${printContent}
                <script>
                    window.onload = function() { window.print(); };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }
}

// Show box contents in a popup
function showBoxContents(trackingNumber) {
    const box = boxes.find(b => b.trackingNumber === trackingNumber);
    if (!box) {
        alert('Box not found with tracking number: ' + trackingNumber);
        return;
    }
    
    currentBoxId = box.id; // Store the current box ID for printing
    
    // Create the content for the modal
    let content = `
        <div class="box-contents">
            <h4>Box ${box.number} - ${trackingNumber}</h4>
            
            <h5>Items in this box:</h5>
            <table class="data-table" style="width: 100%;">
                <thead>
                    <tr>
                        <th style="text-align: left;">Item</th>
                        <th style="text-align: left;">Color</th>
                        <th style="text-align: left;">Size</th>
                        <th style="text-align: right;">Quantity</th>
                        <th style="text-align: right;">Ordered</th>
                    </tr>
                </thead>
                <tbody>
                    ${box.items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.color}</td>
                            <td>${item.size}</td>
                            <td style="text-align: right;">${item.quantity}</td>
                            <td style="text-align: right;">${item.qtyOrdered || 'N/A'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div style="margin-top: 20px;">
                <p><strong>Total Items:</strong> ${box.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
            </div>
        </div>
    `;
    
    // Update the modal content and show it
    const boxContentsBody = document.getElementById('boxContentsBody');
    if (boxContentsBody) {
        boxContentsBody.innerHTML = content;
        document.getElementById('boxContentsModal').style.display = 'block';
    } else {
        // Fallback to alert if modal isn't available
        alert('Box Contents:\\n' + 
              box.items.map(item => 
                  `${item.quantity}x ${item.name} (${item.color}, ${item.size})`
              ).join('\\n'));
    }
}

// Save data to localStorage
function saveData() {
    const data = {
        boxes: boxes,
        items: items
    };
    localStorage.setItem('boxManagementData', JSON.stringify(data));
    
    // Update the box summary on the main page
    updateBoxSummary();
}

// Update the box summary on the main page
function updateBoxSummary() {
    const summaryElement = document.getElementById('boxSummary');
    if (!summaryElement) return;
    
    if (boxes.length === 0) {
        summaryElement.innerHTML = '<p>No boxes created yet.</p>';
        return;
    }
    
    let summaryHtml = `
        <div style="margin-bottom: 15px;">
            <h4>Box Summary (${boxes.length} ${boxes.length === 1 ? 'Box' : 'Boxes'})</h4>
            <table class="data-table" style="width: 100%;">
                <thead>
                    <tr>
                        <th>Box #</th>
                        <th>Items</th>
                        <th>Tracking #</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    boxes.forEach(box => {
        const itemCount = box.items.reduce((total, item) => total + item.quantity, 0);
        
        summaryHtml += `
            <tr>
                <td>${box.number}</td>
                <td>${itemCount} ${itemCount === 1 ? 'item' : 'items'}</td>
                <td>
                    ${box.trackingNumber ? 
                        `<a href="#" onclick="showBoxContents('${box.trackingNumber}'); return false;">${box.trackingNumber}</a>` : 
                        '<span class="text-muted">None</span>'
                    }
                </td>
                <td>
                    <button class="pui-btn pui-btn-sm pui-btn-secondary" onclick="printPackingSlip(${box.id})">
                        Print Slip
                    </button>
                </td>
            </tr>
        `;
    });
    
    summaryHtml += `
                </tbody>
            </table>
        </div>
    `;
    
    summaryElement.innerHTML = summaryHtml;
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeBoxManagement();
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('boxManagementModal');
        if (event.target === modal) {
            closeBoxManagementModal();
        }
    };
});

// Handle box selection from dropdown
function handleBoxSelection(itemId, selectElement) {
    const selectedValue = selectElement.value;
    const qtyInput = document.getElementById(`qty-input-${itemId}`);
    const quantity = parseInt(qtyInput.value) || 1;
    
    if (selectedValue === 'new') {
        // Create a new box
        const newBox = {
            id: Date.now(),
            number: boxes.length + 1,
            trackingNumber: '',
            items: []
        };
        
        // Add the new box
        boxes.push(newBox);
        
        // Add the item to the new box
        addItemToBox(itemId, newBox.id, quantity);
        
        // Reset the select element
        selectElement.value = '';
    } else if (selectedValue) {
        // Add to existing box
        addItemToBox(itemId, parseInt(selectedValue), quantity);
        
        // Reset the select element
        selectElement.value = '';
    }
    
    // Save and update UI
    saveData();
    updateUI();
}

// Make functions available globally
window.openBoxManagementModal = openBoxManagementModal;
window.closeBoxManagementModal = closeBoxManagementModal;
window.addNewBox = addNewBox;
window.addItemToBox = addItemToBox;
window.removeItemFromBox = removeItemFromBox;
window.saveTrackingNumber = saveTrackingNumber;
window.printPackingSlip = printPackingSlip;
window.showBoxContents = showBoxContents;
window.deleteBox = deleteBox;
window.handleBoxSelection = handleBoxSelection;