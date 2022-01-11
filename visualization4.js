function renderVisualization4() {
  let width = 1000;
  let height = 1000;
  const title = document.createElement("h1");

  title.classList.add("text-gray-900", "text-3xl", "px-8", "pt-4");
  title.innerText = "Genres Relations";

  document.getElementById("d3").append(title);

  const colors = [
    "#440154ff",
    "#31668dff",
    "#37b578ff",
    "#fde725ff",
    "#D2D6EF",
    "#AF929D",
    "#A0E7E5",
    "#B4F8C8",
    "#FBE7C6",
    "#FFAEBC",
    "#A49393",
    "#67595E",
    "#81B622",
    "#ECF87F",
    "#DBA40E",
    "#787D12",
    "#21B6A8",
    "#A3EBB1",
  ];

  // create the svg area
  var svg = d3
    .select("#d3")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(250,250)");

  // create input data: a square matrix that provides flow between entities
  const matrix = getGenreCorrelations();

  // give this matrix to d3.chord(): it will calculates all the info we need to draw arc and ribbon
  const chord = d3
    .chord()
    .padAngle(0.05) // padding between entities (black arc)
    .sortSubgroups(d3.descending)(matrix);

  const mouseover = function (event, d) {
    if (d.index !== undefined) {
      d3.selectAll(".d-path").style("opacity", 0);
      d3.selectAll(`.d-path-${d.index}`).style("opacity", "1");
    }
  };

  const mouseleave = function (event, d) {
    d3.selectAll(`.d-path`).style("opacity", "1");
  };

  svg
    .datum(chord)
    .append("g")
    .selectAll("g")
    .data((d) => d.groups)
    .enter()
    .append("g")
    .append("path")
    .on("mouseover", mouseover)
    .on("mouseleave", mouseleave)
    .style("fill", (d, i) => colors[i])
    .style("stroke", "black")
    .attr("class", (d, i) => `d d-${i}`)
    .attr("d", d3.arc().innerRadius(200).outerRadius(210));

  svg
    .datum(chord)
    .append("g")
    .selectAll("path")
    .data((d) => d)
    .enter()
    .append("path")
    .attr("d", d3.ribbon().radius(200))
    .style("fill", (d) => colors[d.source.index])
    .attr("class", (d) => `d-path d-path-${d.source.index}`)
    .style("stroke", "black");
}

function getGenreCorrelations() {
  let data = [];
  const all_genres = {};

  for (let i = 0; i < genres.length; i++) {
    all_genres[genres[i].name] = i;
    let lst = [];
    for (let i = 0; i < genres.length; i++) {
      lst.push(0);
    }
    data.push(lst);
  }

  for (const entry of dataset) {
    let movie_genres = entry.genres;
    for (genre1 of movie_genres) {
      for (genre2 of movie_genres) {
        data[all_genres[genre1]][all_genres[genre2]] += 1;
        data[all_genres[genre2]][all_genres[genre1]] += 1;
      }
    }
  }

  return data;
}
