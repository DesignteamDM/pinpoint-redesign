// Item Fees functionality
class ItemFeesManager {
    constructor() {
        this.container = document.getElementById('itemFeesContainer');
        this.template = document.getElementById('itemFeeTemplate');
        this.addButton = document.getElementById('addItemFeeBtn');
        this.itemFeeCount = 0;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        if (this.addButton) {
            this.addButton.addEventListener('click', () => this.addItemFee());
        }
        
        // Add event delegation for delete buttons
        this.container?.addEventListener('click', (e) => {
            // Handle delete button clicks
            if (e.target.closest('.delete-item-fee')) {
                this.removeItemFee(e.target.closest('.misc-line'));
            }
            // Handle add option button clicks (no functionality yet)
            else if (e.target.closest('.add-option-btn-sm')) {
                // Future implementation for adding new options
                console.log('Add option button clicked');
            }
        });
    }

    addItemFee() {
        if (!this.template) return;
        
        this.itemFeeCount++;
        
        // Clone the template content
        const content = this.template.content.cloneNode(true);
        const newItem = content.firstElementChild;
        
        // Update the title
        const title = newItem.querySelector('h5');
        if (title) {
            title.textContent = `Item Fee #${this.itemFeeCount}`;
        }
        
        // Add the new item to the container
        this.container.appendChild(newItem);
        
        // Scroll to the new item
        newItem.scrollIntoView({ behavior: 'smooth' });
    }

    removeItemFee(item) {
        if (item && item.parentNode) {
            item.parentNode.removeChild(item);
            this.itemFeeCount = this.container.children.length;
        }
    }
    


    getItemFeesData() {
        const fees = [];
        const items = this.container?.querySelectorAll('.misc-line') || [];
        
        items.forEach((item) => {
            const select = item.querySelector('.item-fee-description');
            const inputs = item.querySelectorAll('input[type="number"], select:not(.item-fee-description)');
            const checkboxes = item.querySelectorAll('input[type="checkbox"]');
            
            fees.push({
                description: select?.value || '',
                amount: parseFloat(inputs[0]?.value) || 0,
                code: inputs[1]?.value || '',
                taxable: checkboxes[0]?.checked || false
            });
        });
        
        return fees;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.itemFeesManager = new ItemFeesManager();
});
