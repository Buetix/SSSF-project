'use strict';

window.addEventListener('load', async () => {
   const div = document.querySelector('.grid-container');
   const rfrsh = document.querySelector('#refresh');
    
   const getRevs = async (name, ids) => {
       const bruh = [];
       const data = [];
       try {
           
           ids.forEach(item => {
               bruh.push(item.id);
               console.log(bruh);
           });
           const revName = await getReviews(bruh);
           const h3 = document.querySelector('#' + name);
           for (const list of revName) {
               data.push(list);
           }
           data.forEach(item => {
               h3.innerHTML += `<h3 class="review">${item.MovieTitle}</h3>`
           })
       } catch (e) {
           console.log(e)
       }
   };
   const init = async () => {
       const data = [];
       try {
           const topLists = await getAllLists();
           for (const list of topLists) {
               data.push(list);
           }
       } catch (e) {
           console.log(e);
       }
       
       div.innerHTML = '';
       data.forEach(item => {
           div.innerHTML += `<div class="grid-item" id="${item.ListName}">${item.ListName}<br>
                            </div>`;
           getRevs(item.ListName, item.Reviews);
       });
   };
   init();

    rfrsh.addEventListener('click', init);
});