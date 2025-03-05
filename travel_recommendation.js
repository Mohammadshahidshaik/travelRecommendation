document.addEventListener("DOMContentLoaded", function () {
    let allRecommendations = {}; // Store all fetched recommendations

    // Function to display recommendations
    function displayRecommendations(recommendations) {
        const recommendationsDiv = document.getElementById("recommendations");
        recommendationsDiv.innerHTML = ""; // Clear previous content

        if (recommendations.length === 0) {
            recommendationsDiv.innerHTML = "<p>No results found.</p>";
            return;
        }

        recommendations.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("item");

            const itemName = document.createElement("h3");
            itemName.textContent = item.name;
            itemDiv.appendChild(itemName);

            const itemImage = document.createElement("img");
            itemImage.src = item.imageUrl;
            itemImage.alt = item.name;
            itemDiv.appendChild(itemImage);

            const itemDescription = document.createElement("p");
            itemDescription.textContent = item.description;
            itemDiv.appendChild(itemDescription);

            recommendationsDiv.appendChild(itemDiv);
        });
    }

    // Handle Search
    document.getElementById("search-form").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form submission

        const searchQuery = document.getElementById("search-input").value.trim().toLowerCase();
        if (searchQuery === "") {
            displayRecommendations([]); // Clear display if search is empty
            return;
        }

        // Fetch recommendations from API
        fetch("travel_recommendation_api_json")
            .then(response => response.json())
            .then(data => {
                allRecommendations = data; // Store full data

                let filteredRecommendations = [];

                if (allRecommendations[searchQuery]) {
                    filteredRecommendations = allRecommendations[searchQuery];
                } else {
                    Object.keys(allRecommendations).forEach(category => {
                        allRecommendations[category].forEach(item => {
                            if (item.name.toLowerCase().includes(searchQuery)) {
                                filteredRecommendations.push(item);
                            }
                        });
                    });
                }

                displayRecommendations(filteredRecommendations);
            })
            .catch(error => console.error("Error loading recommendations:", error));
    });

    // Reset Search
    document.getElementById("reset-btn").addEventListener("click", function () {
        document.getElementById("search-input").value = "";
        displayRecommendations([]); // Clear display on reset
    });
});
