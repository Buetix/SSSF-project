'use strict';

window.addEventListener('load', async () => {
   const div = document.querySelector('.grid-item');
   const rfrsh = document.querySelector('#refresh');
   
   const init = async () => {
       const data = [];
       try {
           const topLists = await getAllLists();
           for (const list of topLists) {
               console.log(list);
               data.push(list);
           }
       } catch (e) {
           console.log(e);
       }
       
       div.innerHTML = '';
       data.forEach(item => {
           div.innerHTML += `<div>${item.ListName}<br>
                            ${item.Reviews}
                            
                                </div>`
       });
   };
   init();

    rfrsh.addEventListener('click', init);
});