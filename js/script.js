// Declare an array to store user data
var dataUser = users;

// Declare a variable to store API data
let apiData;

// Declare an array to store unique random numbers
let randomNumberArray = [];

// Define the API URL
let apiUsers = "https://randomuser.me/api/?results=53";

//Specifying the number of users per page
const usersPerPage=10;

// Select HTML elements by ID
const totalUserElement = document.querySelector("#total-users");
const contactListElement = document.getElementById("contact-list");
const paginationElement = document.getElementById("pagination");

// Fetch and process API data
async function getApiData(url) {
    // Make an asynchronous API request using the fetch function
    const response = await fetch(url);

    // Parse the response as JSON
    const data = await response.json();

    // Log the API data to the console
    console.log("This data is of Public API")
    console.log(data);

    // Return the array of API results
    return data.results;
}

// Function to get Data from the API based on a random number
function getRandomApiData(number) {
    // Check if the API data is available
    if (!apiData) {
        // Log an error if API data is not available
        console.error("API data is not available yet.");
        return;
    }

    // Validate the random number
    if (number < 0 || number >= apiData.length) {
        // Log an error for an invalid random number
        console.error("Invalid random number:", number);
        return;
    }

    // Extract user details from the API data
    const userApiData = apiData[number];
    const fullName = `${userApiData.name.first} ${userApiData.name.last}`;
    const date = new Date(userApiData.registered.date);
    const formattedDate = `${date.getFullYear() % 100}/${date.getMonth() + 1}/${date.getDate()}`;
    const email = userApiData.email;
    const picture = userApiData.picture.thumbnail;

    // Create a user object
    const user = {
        name: fullName,
        image: picture,
        email: email,
        joined: formattedDate,
    };

    // Add the user to the dataUser array
    dataUser.push(user);
}

//To check all the extracted and datafile data together
console.log(dataUser);

// Function to update the total number of users in the UI
function updateTotalUsers() {
    totalUserElement.textContent = dataUser.length;
}

// Function to display the users in the UI
function displayUsers(usersArray) {
    // Clear the existing content in the contactListElement
    contactListElement.innerHTML = "";

    // Loop through the provided array of users and create HTML elements for each user
    for (let i = 0; i < usersArray.length; i++) {
        const listItem = document.createElement("li");
        listItem.className = "contact-item cf";
        listItem.innerHTML =
            `<div class="contact-details">
        <img class="avatar" src="${usersArray[i].image}">
        <h3>${usersArray[i].name}</h3>
        <span class="email">${usersArray[i].email}</span>
            </div>
            <div class="joined-details">
              <span class="date">Joined ${usersArray[i].joined}</span>
            </div>`;

        // Append the created HTML element to the contactListElement
        contactListElement.appendChild(listItem);
    }
}

//Function to calculate the total number of pages
function calculateTotalPages(){
     var pages=Math.ceil(dataUser.length/usersPerPage);
     console.log(`There will be total ${pages}`);
        return pages;
}

//Function to generate pagination controls
function generatePaginationControls(){
    const totalPages=calculateTotalPages();
    paginationElement.innerHTML="";

    for(let i=1;i<=totalPages;i++){
        const listItem=document.createElement("li");
        const pageLink=document.createElement("a");
        pageLink.href="#";
        pageLink.textContent=i;
        
        pageLink.addEventListener("click",function(){
            displayUsersForPage(i,usersPerPage);
        });
        listItem.appendChild(pageLink);
        paginationElement.appendChild(listItem);
        
    }

}

// Function to display users for a specific page
function displayUsersForPage(pageNumber,usersPerPage) {
    const startIndex = (pageNumber - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;

    // Slice the dataUser array to get users for the current page
    const usersForPage = dataUser.slice(startIndex, endIndex);

    // Display the users for the current page
    displayUsers(usersForPage);
}


// Function to run all operations after the page loads
async function runEverything() {
    // Fetch API data and assign it to the apiData variable
    apiData = await getApiData(apiUsers);

    // Generate unique random numbers and store them in the randomNumberArray
    for (var i = 0; i < 44; i++) {
        var random;
        do {
            random = Math.floor(Math.random() * apiData.length);
        } while (randomNumberArray.includes(random));
        randomNumberArray.push(random);
    }

    // Add users to the dataUser array based on the random numbers
    for (var i = 0; i < randomNumberArray.length; i++) {
        getRandomApiData(randomNumberArray[i]);
    }

    // Update and display the total number of users
    updateTotalUsers();
    
    // Display the users in the UI
    displayUsers(dataUser.slice(0,usersPerPage));

    //Generate pagination controls after displaying first page.
    generatePaginationControls();
}

// Run the runEverything function after the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", runEverything);
