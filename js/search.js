// 클라이언트  front
const TMDB_KEY = "cbe5331fb762952b00b95c46156a35c9";
const list = document.querySelector(".list");
const searchTxt = document.querySelector(".search-txt");
const btnMore = document.querySelector(".btn-more");
const movieDetail = document.querySelector(".movie-detail");


// 엔터 검색
searchTxt.addEventListener("keyup", function (e) {
  if (e.keyCode === 13) {
    const myFetch = fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&language=ko-KR&page=1&include_adult=false&query=${searchTxt.value}`);
    myFetch
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        console.log(result);
        list.innerHTML = "";
        makeList(result);
      })
      .catch(function () {
        console.log("안왔음");
      });
  }
});

// 더 보기 클릭이벤트 
let pageNum = 1;

btnMore.addEventListener("click", function () {
  pageNum++;
  loadMovie(pageNum);
});
loadMovie(pageNum);

// 영화 퍼블리싱
function makeList(result) {
  result.results.forEach(function (item, idx) {
    list.innerHTML =
      list.innerHTML +
      `<li data-id="${item.id}">
    <div class="img-box"><img src="https://image.tmdb.org/t/p/original${item.poster_path}"></div>
    <div class="contents-box">
      <h2>${item.title}</h2>
      <p>${item.original_title}</p>
      <p>${item.release_date}</p>
      <p class="overview">${item.overview}</p>
    </div>
  </li>`;
  });

  //li추가된후 코드.....
  gsap.from(".list li", { opacity: 0, stagger: 0.02 });
  const movieItems = document.querySelectorAll(".list li");
  movieItems.forEach(function (item, idx) {
    item.addEventListener("click", function () {
      //console.log(item.dataset.id);
      const movieID = item.dataset.id;
      const movieFetch = fetch(`https://api.themoviedb.org/3/movie/${movieID}?api_key=${TMDB_KEY}&language=ko-KR`);
      movieFetch
        .then(function (response) {
          console.log("디테일한 영화정보 받았음");
          return response.json();
        })
        .then(function (result) {
          console.log(result);
          movieDetail.classList.add("on");
          document.body.classList.add("off");

          // 애니메이션
          gsap.fromTo(".movie-detail", { y: "100%" }, { y: 0, duration: 1, ease: "power4" });

          //  name에  / 추가
          let txtGenres = "";
          result.genres.forEach(function (item, idx) {
            if (idx === 0) {
              txtGenres += item.name;
            } else {
              txtGenres += "/" + item.name;
            }
          });

          // on될떄 실행 서브 모달창
          movieDetail.innerHTML = `
            <div class="img-box"><img src="https://image.tmdb.org/t/p/original${result.backdrop_path}" alt="" /></div>
            <div class="contents-box">
              <h2 class="title">${result.title}</h2>
              <p>${result.original_title}</p>
              <p>${txtGenres}</p>
              <p><a href="${result.homepage}" target="_blank">${result.homepage}</a></p>
              <p>${result.release_date}</p>
              <p>${result.popularity}</p>
              <p>${result.runtime}</p>
              <p class="overview">${result.overview}</p>
            </div>
          <button class="btn-close"><span class="material-icons md-48">
          close
          </span></button>
          `;

          // 닫기 버튼 
          const btnClose = document.querySelector(".btn-close");
          btnClose.addEventListener("click", function () {
            movieDetail.classList.remove("on");
            document.body.classList.remove("off");
          });
        })
        .catch(function () {
          console.log("디테일한 영화정보 못받았음");
        });
      // https://api.themoviedb.org/3/movie/{movie_id}?api_key=c3531c0fd9611d97111b750a606e8fdb&language=ko-KR
    });
  });
}

// 더보기 클릭했을 때 페이지 for돌림
function loadMovie(pageNum = 1) {
  const myFetch = fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&language=ko-KR&page=${pageNum}`);
  myFetch
    .then(function (response) {
      //console.log("약속 잘 이행되었음");
      console.log(response);
      return response.json();
    })
    .then(function (result) {
      console.log("json으로 변환 완료 되었음");
      //여기에 내가 필요한 코드 넣는 곳
      console.log(result.results);
      makeList(result);
    })
    .catch(function () {
      console.log("약속이 거절되었음");
    });
}
