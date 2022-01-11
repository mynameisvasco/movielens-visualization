
function renderVisualization4() {
    let width = 600;
    let height = 600;
    const margin = { top: 50, bottom: 20, left: 50, right: 25 };
    const select = document.createElement("select");
    const title = document.createElement("h1");
    let data = []

    title.classList.add("text-gray-900", "text-3xl", "px-8", "pt-4");
    title.innerText = "Genres Relations";
    select.classList.add("absolute", "right-4", "top-4");



    // create the svg area
    var svg = d3.select("#d3")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(220,220)")

    // create input data: a square matrix that provides flow between entities
    var matrix = getGenreCorrelations()

    // give this matrix to d3.chord(): it will calculates all the info we need to draw arc and ribbon
    var chord = d3.chord()
    .padAngle(0.05)     // padding between entities (black arc)
    .sortSubgroups(d3.descending)
    (matrix)


    const tooltip = d3
    .select("#d3")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("position", "absolute")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

  const mouseover = function (event, d) {
    tooltip
      .html(`Genre: ${genres[event.target.__data__.index].name}`)
      .style("opacity", 1);
    d3.select(this).style("stroke", "black").style("stroke-width", "1px");
    d3.select(this).style("opacity", 1);
  };

  const mousemove = function (event, d) {
    tooltip
      .style("transform", "translateY(-55%)")
      .style("left", event.x / 2 + "px")
      .style("top", event.y / 2 - 30 + "px");
  };

  const mouseleave = function (event, d) {
    tooltip.style("opacity", 0);
    d3.select(this).style("stroke", "none");
  };
  

    // add the groups on the inner part of the circle
    svg
    .datum(chord)
    .append("g")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
    .selectAll("g")
    .data(function(d) { return d.groups; })
    .enter()
    .append("g")
    .append("path")
    .style("fill", "grey")
    .style("stroke", "black")
    .attr("d", d3.arc()
        .innerRadius(200)
        .outerRadius(210)
    )

    // Add the links between groups
    svg
    .datum(chord)
    .append("g")
    .selectAll("path")
    .data(function(d) { return d; })
    .enter()
    .append("path")
    .attr("d", d3.ribbon()
        .radius(200)
    )
    .style("fill", "#ff11f0")
    .style("stroke", "black");
}

function getGenreCorrelations() {
    let data = [];
    const all_genres = {}
    
    for (let i=0;i<genres.length;i++) {
        all_genres[genres[i].name] = i
        let lst = []
        for (let i=0;i<genres.length;i++) {
            lst.push(0)
        }
        data.push(lst)
    }

    for (const entry of dataset) {
        let movie_genres = entry.genres
        for (genre1 of movie_genres) {
            for (genre2 of movie_genres) {
                data[all_genres[genre1]][all_genres[genre2]] += 1
                data[all_genres[genre2]][all_genres[genre1]] += 1
            }
        }
    }
    
    return data;
  }