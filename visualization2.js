function renderVisualization2() {
  let width = 600;
  let height = 600;
  const margin = { top: 50, bottom: 20, left: 50, right: 25 };
  const title = document.createElement("h1");
  const data = getRatingsAveragePerGenreAndOccupation();

  title.classList.add("text-gray-900", "text-3xl", "px-8", "pt-8");
  title.innerText = "Ratings Per Occupation";

  document.getElementById("d3").append(title);

  const svg = d3
    .select("#d3")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  width = 600 - margin.left - margin.right;
  height = 300 - margin.top - margin.bottom;

  var x = d3
    .scaleBand()
    .range([0, width])
    .domain(occupations.map((o) => o.name))
    .padding(0.01);

  svg
    .append("g")
    .style("font-size", 4)
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain")
    .remove();

  var y = d3
    .scaleBand()
    .range([height, 0])
    .domain(genres.map((g) => g.name))
    .padding(0.05);

  svg.append("g").style("font-size", 4).call(d3.axisLeft(y).tickSize(0)).select(".domain").remove();

  const color = d3.scaleSequential().interpolator(d3.interpolateInferno).domain([2.5, 4]);

  svg
    .selectAll()
    .data(Object.entries(data))
    .enter()
    .append("rect")
    .attr("x", (d) => x(d[0].split("$")[0]))
    .attr("y", (d) => y(d[0].split("$")[1]))
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .style("fill", (d) => color(d[1]))
    .style("stroke-width", 4)
    .style("stroke", "none")
    .style("opacity", 0.8);
}

function getRatingsAveragePerGenreAndOccupation() {
  let data = {};
  const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;

  for (const occupation of occupations) {
    for (const genre of genres) {
      data[`${occupation.name}$${genre.name}`] = [];
    }
  }

  for (const entry of dataset) {
    for (const genre of entry.genres) {
      data[`${entry.user.occupation}$${genre}`].push(parseInt(entry.rating));
    }
  }

  for (const key in data) {
    data[key] = average(data[key]);
  }

  return data;
}
