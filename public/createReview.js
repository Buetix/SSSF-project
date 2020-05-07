'use strict';

function validateForm() {
    const name = document.forms["reviewForm"]["MovieTitle"].value;
    const stringCheck = /^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/;
    if (!stringCheck.test(name)) {
        alert("Invalid naming");
        return false;
    }
    const createNewReview = async () => {
        const request = new Object ({
            MovieTitle: String,
            MoviePoster: String,
            Comment: String,
            Author: String
        });
        request.MovieTitle = document.forms["reviewForm"]["MovieTitle"].value;
        request.MoviePoster = document.forms["reviewForm"]["MoviePoster"].value.toString();
        request.Comment = document.forms["reviewForm"]["Comment"].value;
        request.Author = document.forms["reviewForm"]["Author"].value;
        console.log(request);
        const success = await createReview(request);
        if (success != null) {
            alert('Successfully created a new review. \n' +
                'Now reset the form to create another');
        }
        
    };
    createNewReview();
    return false;
}