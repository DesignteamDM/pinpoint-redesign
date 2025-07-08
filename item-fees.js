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
        
        // Add event delegation for delete buttons and suggestion items
        this.container?.addEventListener('click', (e) => {
            // Handle delete button clicks
            if (e.target.closest('.delete-item-fee')) {
                this.removeItemFee(e.target.closest('.misc-line'));
            }
            // Handle suggestion item clicks
            else if (e.target.classList.contains('suggestion-item')) {
                const input = e.target.closest('td').querySelector('.item-fee-description');
                if (input) {
                    input.value = e.target.getAttribute('data-value');
                    input.focus();
                    this.hideAllSuggestionDropdowns();
                }
            }
        });

        // Handle clicks outside to close dropdowns
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.item-fee-description')) {
                this.hideAllSuggestionDropdowns();
            }
        });

        // Handle input focus to show suggestions
        this.container?.addEventListener('focusin', (e) => {
            if (e.target.classList.contains('item-fee-description')) {
                this.hideAllSuggestionDropdowns();
                const dropdown = e.target.nextElementSibling;
                if (dropdown && dropdown.classList.contains('suggestions-dropdown')) {
                    dropdown.style.display = 'block';
                }
            }
        });
    }

    hideAllSuggestionDropdowns() {
        document.querySelectorAll('.suggestions-dropdown').forEach(dropdown => {
            dropdown.style.display = 'none';
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
        
        items.forEach((item, index) => {
            const inputs = item.querySelectorAll('input, select');
            fees.push({
                description: inputs[0]?.value || '',
                amount: parseFloat(inputs[1]?.value) || 0,
                code: inputs[2]?.value || '',
                taxable: inputs[3]?.checked || false
            });
        });
        
        return fees;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.itemFeesManager = new ItemFeesManager();
});
