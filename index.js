const baseUrl = "http://127.0.0.1:5500";
const visualization = [
  {
    label: "Visualization 1",
    render: renderVisualization1,
  },
];
let activeVisualization = visualization[0];
let movies = [];
let ratings = [];
let users = [];
let genres = [];

function renderVisualization1(genre = "Action") {
  const { clientWidth: width, clientHeight: height } = document.getElementById("d3");
  const margin = { top: 30, right: 30, bottom: 30, left: 60 };
  const select = document.createElement("select");
  let data = getRatingsPerGenre(genre);

  select.classList.add("absolute", "right-4", "top-4");

  select.onchange = (e) => {
    data = getRatingsPerGenre(select.value);
    update(data);
  };

  for (const genre of genres) {
    if (genre.name === "" || genre.name === "unknown") continue;
    const option = document.createElement("option");
    option.value = genre.name;
    option.defaultSelected = genre.name === "Action";
    option.innerHTML = genre.name;
    select.add(option);
  }
  document.getElementById("d3").append(select);

  const svg = d3
    .select("#d3")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const x = d3.scaleBand().range([0, width]).domain([1, 2, 3, 4, 5]).padding(0.2);

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  const y = d3.scaleLinear().domain([0, 200]).range([height, 0]);

  svg.append("g").call(d3.axisLeft(y));

  function update(data) {
    var u = svg.selectAll("rect").data(data);

    u.enter()
      .append("rect")
      .merge(u)
      .transition()
      .duration(1000)
      .attr("x", (d, i) => x(i + 1))
      .attr("y", (d) => y(d))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d))
      .attr("fill", "#69b3a2");
  }

  update(data);
}

function getRatingsPerGenre(genre) {
  const genreMovies = movies.filter((m) => m[genre] === "1");
  const data = [0, 0, 0, 0, 0];

  for (const movie of genreMovies) {
    const rating = ratings.find((m) => m.item_id === movie.id)?.rating;
    if (rating) {
      data[rating - 1] += 1;
    }
  }

  return data;
}

async function fetchDataset() {
  const moviesCsv = await (await fetch(`${baseUrl}/dataset/u.item`)).text();
  const ratingsCsv = await (await fetch(`${baseUrl}/dataset/u.data`)).text();
  const usersCsv = await (await fetch(`${baseUrl}/dataset/u.user`)).text();
  const genresCsv = await (await fetch(`${baseUrl}/dataset/u.genre`)).text();

  movies = Papa.parse(moviesCsv, { header: true }).data;
  ratings = Papa.parse(ratingsCsv, { header: true }).data;
  users = Papa.parse(usersCsv, { header: true }).data;
  genres = Papa.parse(genresCsv, { header: true }).data;
}

function setActiveVisualization(index) {
  if (index < visualization.length) {
    activeVisualization = visualization[index];
  }
}

window.addEventListener("load", async () => {
  await fetchDataset();

  activeVisualization.render();
});
