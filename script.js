document.addEventListener('DOMContentLoaded', () => {
    // Fetch the JSON file
    fetch('films.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.querySelector('#filmTable tbody');

            // Loop through the data and create table rows
            data.forEach(film => {
                const row = document.createElement('tr');

                // Create and append table cells for each property
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

                // Append the row to the table body
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching or parsing JSON:', error);
        });
});