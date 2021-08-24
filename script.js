const form = document.createElement("form");
form.setAttribute("method", "post");

const searchBar = document.createElement('input');
searchBar.class = 'searchbar';
searchBar.setAttribute("type", "text");
searchBar.setAttribute("name", "Search");
searchBar.setAttribute("placeholder", "Search");

const submit = document.createElement("button");
submit.setAttribute("type", "submit");
submit.setAttribute("value", " search");

form.appendChild(searchBar);
form.appendChild(submit);
document.getElementById('searchBox').appendChild(form);

const API_KEY = "AIzaSyBk_MUmjFVPZKFHW2NCQBR43VPXF2eehzA"; //AIzaSyC1SxDHlYERTtMnG-YzfkUC5PJbSm6AzQA
const videoList = document.getElementById('videos');
const prevBtn =document.getElementById('pagination');
const pagination =document.getElementById('pagination');
let pageToken = '';

form.addEventListener('submit', e => {
    e.preventDefault();
    searchAndDisplayYoutubeVideos();
});

function paginate(e, obj) {
    e.preventDefault();
    pageToken = obj.getAttribute('data-id');
    searchAndDisplayYoutubeVideos();
}

async function searchAndDisplayYoutubeVideos() {
    const searchString = searchBar.value;

    let searchData ='';    
    const homePage = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&type=video&part=snippet&maxResults=15&q=${searchString}`;
    const nextPage = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&type=video&part=snippet&maxResults=15&q=${searchString}&pageToken=${pageToken}`;
    if (pageToken != '') {
         searchData = await fetch(nextPage);
    }
    else{
         searchData = await fetch(homePage);
    }
    

    //This line is to convert the received data into json format to access them easily
    const searchDataInJson = await searchData.json();

    //this line is same as line 75
    const listItems = searchDataInJson.items;
        
                    if (listItems) {
                       let output = ' <ul> ';
                      
                        let prevNext='<ul>';

                        listItems.forEach(item => {
                            const videoId = item.id.videoId;
                            const videoTitle = item.snippet.title;
                            const description = item.snippet.description;
                            const publishedAt = item.snippet.publishedAt;
                            
                            output +=`<li class = "videoOutput">
                            <a data-fancybox href="https://www.youtube.com/watch?v=${videoId}">
                            <img src="http://i3.ytimg.com/vi/${videoId}/hqdefault.jpg" />
                            </a> 
                           
                            <div class="vidInfo"> 
                            <div class = "titleOfVideo"> ${videoTitle} </div>
                            <div class = "uploadDate" >${publishedAt} </div>
                            <div class = " descriptionOfVideo" >${description}</div>
                            </div>
                          
                            </li>`
                                });

                        if (searchDataInJson.prevPageToken) {  
                            prevNext += ` <a class="paginate" href="#" data-id="${searchDataInJson.prevPageToken}" onclick="paginate(event, this)">Prev</a>`;  
                        }

                        if (searchDataInJson.nextPageToken) {
                            prevNext += ` <a  href="#" class="paginate" data-id="${searchDataInJson.nextPageToken}" onclick="paginate(event, this)">Next</a>`;
                            searchDataInJson.prevPageToken = searchDataInJson.nextPageToken;
                        }

                        // Output list
                        videoList.innerHTML = output;
                        pagination.innerHTML= prevNext;
                    }           
    
}
