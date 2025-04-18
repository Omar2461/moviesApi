const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
    <img src="${imgSrc}" alt="">
    ${movie.Title}   (${movie.Year})
`;
  },
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "8dad8c60",
        S: searchTerm,
      },
    });
    if (response.data.Error) {
      return [];
    }
    return response.data.Search;
  },
};

createAutoComplete({
  ...autoCompleteConfig,
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#left-summry"),'left');
  },
  root: document.querySelector("#left-autocomplete"),
});

createAutoComplete({
  ...autoCompleteConfig,
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#right-summry"),'right');
  },
  root: document.querySelector("#right-autocomplete"),
});

const runComparison = () => {
  const rightSideStats = document.querySelectorAll(
    "#right-summry .notification"
  );
  const leftSideStats = document.querySelectorAll("#left-summry .notification");
 
  leftSideStats.forEach((leftState,idx)=>{
const rightState=rightSideStats[idx];

const leftSidevalue=parseInt(leftState.dataset.value);
const rightSideValue=parseInt(rightState.dataset.value);

if(leftSidevalue>rightSideValue){
  rightState.classList.remove('is-primary');
  rightState.classList.add('is-warning');
}else{
  leftState.classList.remove('is-primary');
  leftState.classList.add('is-warning');
}
  })

};

let rightMovie;
let leftMovie;

const onMovieSelect = async (movie, summeryTarget,side) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "8dad8c60",
      i: movie.imdbID,
    },
  });
  const data = response.data;
  summeryTarget.innerHTML = movieTemplate(data);

if(side==='left'){
leftMovie=response.data;
}else{
  rightMovie=response.data;
}
if(leftMovie&&rightMovie){
runComparison();
}

};



const movieTemplate = (movieDetails) => {
  const dollars = parseInt(
    movieDetails.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  );
  const metascore = parseInt(movieDetails.Metascore);
  const imdbRating = parseFloat(movieDetails.imdbRating);
  const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ""));
  let count = 0;
  const awards = movieDetails.Awards.split(" ").forEach((el) => {
    let elememt = parseInt(el);
    if (isNaN(elememt)) {
      return;
    } else {
      count += elememt;
    }
  });
  return `
  <article class='media'>
  <figure class='media-left'>
  <p class='image'>
  <img src="${movieDetails.Poster}">
  </p>
  </figure>
  <div class="media-content">
<div class="content">
   <h1>${movieDetails.Title}</h1>
   <h4>${movieDetails.Genre}</h4>
   <p>${movieDetails.Plot}</p>
</div>
  </div>
  </article>
  <article data-value=${count} class='notification is-primary'>
  <p class="title">${movieDetails.Awards}</p>
  <p class="subtitle">Awards</p>
  </article>
  <article data-value=${dollars} class='notification is-primary'>
  <p class="title">${movieDetails.BoxOffice}</p>
  <p class="subtitle">Box Office</p>
  </article>
  <article data-value=${metascore} class='notification is-primary'>
  <p class="title">${movieDetails.Metascore}</p>
  <p class="subtitle">Metascore</p>
  </article>
  <article data-value=${imdbRating} class='notification is-primary'>
  <p class="title">${movieDetails.imdbRating}</p>
  <p class="subtitle">IMDB Rating</p>
  </article>
  <article data-value=${imdbVotes} class='notification is-primary'>
  <p class="title">${movieDetails.imdbVotes}</p>
  <p class="subtitle">IMDB Votes</p>
  </article>
  `;
};
