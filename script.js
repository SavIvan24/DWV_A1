document.addEventListener('DOMContentLoaded', () => {
    let filmsData = []; // Store the original data

    // Fetch the JSON file
    fetch('films.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            filmsData = data; // Save the data
            renderTable(data); // Render the table initially
            setupFilters(); // Setup filter event listeners
            setupSorting(); // Setup sorting event listeners
        })
        .catch(error => {
            console.error('Error fetching or parsing JSON:', error);
            const errorMessage = document.createElement('p');
            errorMessage.textContent = `Error: ${error.message}`;
            errorMessage.style.color = 'red';
            document.body.appendChild(errorMessage);
        });

    // Function to render the table
    function renderTable(data) {
        const tbody = document.querySelector('#filmTable tbody');
        tbody.innerHTML = ''; // Clear existing rows

        data.forEach(film => {
            const row = document.createElement('tr');

            const titleCell = document.createElement('td');
            titleCell.textContent = film.title;
            row.appendChild(titleCell);

            const grossCell = document.createElement('td');
            grossCell.textContent = film['worldwide gross'];
            row.appendChild(grossCell);

            const yearCell = document.createElement('td');
            yearCell.textContent = film.year;
            row.appendChild(yearCell);

            const countriesCell = document.createElement('td');
            countriesCell.textContent = film.countries;
            row.appendChild(countriesCell);

            const directorsCell = document.createElement('td');
            directorsCell.textContent = film.directors;
            row.appendChild(directorsCell);

            tbody.appendChild(row);
        });
    }

    // Function to setup filters
    function setupFilters() {
        const filterTitle = document.getElementById('filterTitle');
        const filterYear = document.getElementById('filterYear');

        filterTitle.addEventListener('input', applyFilters);
        filterYear.addEventListener('input', applyFilters);
    }

    // Function to apply filters
    function applyFilters() {
        const filterTitleValue = document.getElementById('filterTitle').value.toLowerCase();
        const filterYearValue = document.getElementById('filterYear').value;

        const filteredData = filmsData.filter(film => {
            const matchesTitle = film.title.toLowerCase().includes(filterTitleValue);
            const matchesYear = filterYearValue ? film.year === parseInt(filterYearValue) : true;
            return matchesTitle && matchesYear;
        });

        renderTable(filteredData);
    }

    // Function to setup sorting
    function setupSorting() {
        document.getElementById('sortTitle').addEventListener('click', () => sortTable('title'));
        document.getElementById('sortGross').addEventListener('click', () => sortTable('worldwide gross'));
        document.getElementById('sortYear').addEventListener('click', () => sortTable('year'));
    }

    // Function to sort the table
    function sortTable(sortBy) {
        const sortedData = [...filmsData].sort((a, b) => {
            if (sortBy === 'worldwide gross') {
                // Remove "$" and commas, then convert to numbers
                const grossA = parseFloat(a[sortBy].replace(/[^0-9.-]+/g, ''));
                const grossB = parseFloat(b[sortBy].replace(/[^0-9.-]+/g, ''));
                return grossA - grossB;
            } else if (sortBy === 'year') {
                return a[sortBy] - b[sortBy];
            } else {
                return a[sortBy].localeCompare(b[sortBy]);
            }
        });

        renderTable(sortedData);
    }
});