// COMPARE TABLE
const table = document.getElementById("compare-table");
const checkboxes = table.querySelectorAll('input[type="checkbox"][data-col]');
const itemColWidth = table.rows[0].cells[0].offsetWidth;

let currentStickyIndex = null;

// Utility Functions
function getColIndex(cell) {
    return cell?.getAttribute("data-original-index");
}

function unstickCurrentColumn() {
    const rows = Array.from(table.rows);

    rows.forEach(row => {
        const stickyCells = row.querySelectorAll(".sticky-compare");
        stickyCells.forEach(cell => {
        cell.classList.remove("sticky", "sticky-compare");
        cell.style.left = "";
        });

        const cells = Array.from(row.querySelectorAll("[data-original-index]"));
        cells.sort((a, b) =>
        parseInt(getColIndex(a)) - parseInt(getColIndex(b))
        ).forEach(cell => row.appendChild(cell));
    });

    document.body.classList.remove("sticky-active");

    currentStickyIndex = null;

    // Uncheck all checkboxes
    checkboxes.forEach(cb => cb.checked = false);
}

function stickColumn(colIndex) {
    const rows = Array.from(table.rows);

    rows.forEach(row => {
        const cell = row.querySelector(`[data-original-index="${colIndex}"]`);
        if (!cell) return;

        // Move cell to second column (after "Item")
        row.insertBefore(cell, row.cells[1]);

        // Style as sticky
        cell.classList.add("sticky", "sticky-compare");
        cell.style.left = `${itemColWidth}px`;
        document.body.classList.add("sticky-active");

        // Remove sticky class from any previous sticky cells
        const stickyCells = row.querySelectorAll(".sticky-compare");
        stickyCells.forEach(c => {
        if (getColIndex(c) !== colIndex) {
            c.classList.remove("sticky", "sticky-compare");
            c.style.left = "";
        }
        });
    });

    currentStickyIndex = colIndex;

    // Sync checkboxes
    checkboxes.forEach(cb =>
        cb.checked = cb.getAttribute("data-col") === colIndex
    );
}

function toggleColumn(colIndex) {
    if (colIndex === currentStickyIndex) {
        unstickCurrentColumn();
    } else {
        stickColumn(colIndex);
    }
}

// Event Handlers
checkboxes.forEach(checkbox => {
    checkbox.addEventListener("change", () => {
        const colIndex = checkbox.getAttribute("data-col");
        checkbox.checked ? stickColumn(colIndex) : unstickCurrentColumn();
    });
});

table.addEventListener("click", e => {
    const cell = e.target.closest("td, th");
    const colIndex = getColIndex(cell);
    if (!colIndex) return;
    toggleColumn(colIndex);
});

// NAVIGATION MENU
const navButtons = document.querySelector('.nav-buttons');
const chevronButton = navButtons.querySelector('.btn-chevron');
const chevronButtonText = navButtons.querySelector('.visually-hidden');
const navList = navButtons.querySelector('.list-inline');

function toggleMenu() {
    const isVisible = navList.classList.contains('is-visible');
    navList.classList.toggle('is-visible');
    
    chevronButtonText.textContent = isVisible ? 'open menu' : 'close menu';
}

chevronButton.addEventListener('click', toggleMenu);

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth >= 768) {
            navList.classList.remove('is-visible');
            chevronButtonText.textContent = 'open menu';
        }
    }, 250);
});