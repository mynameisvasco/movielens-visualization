function renderVisualization1(genre = "Action") {
  let width = 600;
  let height = 300;
  const margin = { top: 50, bottom: 20, left: 50, right: 25 };
  const select = document.createElement("select");
  const title = document.createElement("h1");
  const totalRatingsText = document.createElement("p");
  let data = getRatingsNumberPerGenre(genre);

  let totalRatings = Object.entries(data).reduce((acc, e) => +acc + +e[1].female + e[1].male, 0);

  title.classList.add("text-gray-900", "text-3xl", "px-8", "pt-4");
  title.innerText = "Ratings Per Genre";
  totalRatingsText.classList.add("text-gray-600", "text-xl", "px-8", "pt-2");
  totalRatingsText.innerHTML = `${totalRatings} total ratings<br> ${
    Math.round((totalRatings / dataset.length) * 10000) / 100
  }% of the dataset`;
  select.classList.add("absolute", "right-4", "top-4");

  select.onchange = (e) => {
    data = getRatingsNumberPerGenre(select.value);
    update(data);
    totalRatings = Object.entries(data).reduce((acc, e) => +acc + +e[1].female + e[1].male, 0);

    totalRatingsText.innerHTML = `${totalRatings} total ratings<br> ${
      Math.round((totalRatings / dataset.length) * 10000) / 100
    }% of the dataset`;
  };

  for (const genre of genres) {
    if (genre.name === "" || genre.name === "unknown") continue;
    const option = document.createElement("option");
    option.value = genre.name;
    option.defaultSelected = genre.name === "Action";
    option.innerHTML = genre.name;
    select.add(option);
  }

  document.getElementById("d3").append(title);
  document.getElementById("d3").append(select);
  document.getElementById("d3").append(totalRatingsText);

  const svg = d3
    .select("#d3")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  width = 600 - margin.left - margin.right;
  height = 300 - margin.top - margin.bottom;

  const groups = [1, 2, 3, 4, 5];
  const subgroups = ["male", "female"];

  const x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
  svg.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(x).tickSize(0));

  svg
    .append("text")
    .style("font-size", 8)
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + 15)
    .text("Rating");

  const y = d3.scaleLinear().domain([0, 8000]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  svg
    .append("text")
    .style("font-size", 8)
    .attr("text-anchor", "end")
    .attr("y", -10)
    .attr("x", margin.left)
    .text("Total Ratings");

  const xSubgroup = d3.scaleBand().domain(subgroups).range([0, x.bandwidth()]).padding([0.05]);
  const color = d3
    .scaleOrdinal()
    .domain(subgroups)
    .range(["rgb(99, 102, 241)", "rgb(244 114 182)"]);

  const tooltip = d3
    .select("#d3")
    .append("div")
    .style("opacity", 1)
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "5px");

  const mouseover = function (d) {
    tooltip.style("opacity", 1);
    d3.select(this).style("stroke", "black").style("stroke-width", "1px").style("opacity", 1);
  };

  const mousemove = function (event, d) {
    tooltip
      .html(`Sex: ${d.key} <br> Number of Ratings: ${d.value}`)
      .style("left", event.x / 2 + "px")
      .style("top", event.y / 2 + "px");
  };

  const mouseleave = function (d) {
    tooltip.style("opacity", 0);
    d3.select(this).style("stroke", "none").style("opacity", 0.8);
  };

  const g = svg.append("g");

  function update(data) {
    let bars = g.selectAll("g").data(data);
    const enter = bars.enter().append("g");
    bars = enter.merge(bars).attr("transform", (d, i) => `translate(${x(i + 1)}, 0)`);

    const rect = bars.selectAll("rect").data(function (d) {
      return subgroups.map(function (key) {
        return { key: key, value: d[key] };
      });
    });

    rect
      .enter()
      .append("rect")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .merge(rect)
      .transition()
      .duration(1000)
      .attr("x", (d) => xSubgroup(d.key))
      .attr("y", (d) => y(d.value))
      .attr("width", xSubgroup.bandwidth())
      .attr("height", (d) => height - y(d.value))
      .attr("fill", (d) => color(d.key));
  }

  update(data);
}

function getRatingsNumberPerGenre(genre) {
  let data = [];

  for (let i = 0; i < 5; i++) {
    data.push({ female: 0, male: 0 });
  }

  for (const entry of dataset) {
    if (entry.genres.includes(genre)) {
      if (entry.user.sex === "M") {
        data[entry.rating - 1].male += 1;
      } else if (entry.user.sex === "F") {
        data[entry.rating - 1].female += 1;
      }
    }
  }

  return data;
}
