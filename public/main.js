'use strict';

window.addEventListener('load', async () => {
   const div = document.querySelector('.grid-container');
    
   const getRevs = async (name, ids) => {
       const dataArray = [];
       const data = [];
       try {
           
           ids.forEach(item => {
               dataArray.push(item.id);
           });
           const revName = await getReviews(dataArray);
           const h3 = document.querySelector('#' + name.replace(/ /g, ''));
           for (const list of revName) {
               data.push(list);
           }
           data.forEach(item => {
               h3.innerHTML += `<div class="review">
                                    <h3>${item.MovieTitle}</h3>
                                    <p>Review: ${item.MoviePoster}/10</p>
                                    <p>Comment: ${item.Comment}</p>
                                    <p class="profilePic">By: ${item.Author}</p></div>`
           })
       } catch (e) {
           console.log(e);
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
           div.innerHTML += `<div class="grid-item" id="${item.ListName.replace(/ /g, '')}">${item.ListName}<br>
                             <p class="profilePic">By: ${item.Author}</p>
                            </div>`;
           getRevs(item.ListName.replace(/ /g, ''), item.Reviews);
       });
   };
   init();
});