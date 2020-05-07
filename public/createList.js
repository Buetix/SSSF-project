'use strict';

window.addEventListener('load', async() => {
    const option = document.querySelector('.reviewSelect');
    
    const init = async () => {
        const data = [];
        try {
            const allRevs = await getAllReviews();
            for (const list of allRevs) {
                data.push(list);
            }
        } catch (e) {
            console.log(e);
        }
        data.forEach(item => {
            option.innerHTML += `<option value="${item.id}"
                                class="option">${item.MovieTitle}</option>`
        })
    };
    init();
});

function validateForm() {
    const name = document.forms["listForm"]["listName"].value;
    const stringCheck = /^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/;
    if (!stringCheck.test(name)) {
        alert("Invalid naming");
        return false;
    }
    
    const createNewList = async () => {
        const request = new Object ( {
            ListName: String,
            Reviews: String,
            Comment: String,
            Author: String
        });
        function getSelected() {
            const selected = document.getElementById("selector");
            const items = [];
            let numSelected = 0;
            for (let i = 0; i < selected.length; i++) {
                let currentOption = selected[i];
                if(currentOption.selected === true) {
                    items.push('"' + currentOption.value + '"');
                    numSelected = numSelected + 1;
                    if(numSelected > 5) {
                        alert('Too many movies selected');
                        return false;
                    }
                }
            }
            return items;
        }
        request.ListName = document.forms["listForm"]["listName"].value;
        request.Reviews = getSelected().toString();
        request.Comment = document.forms["listForm"]["Comment"].value;
        request.Author = document.forms["listForm"]["Author"].value;
        const success = await createTopList(request);
        if (success != null) {
            alert('Created new list successfully')
        }
    };
    createNewList();
    return false;
}