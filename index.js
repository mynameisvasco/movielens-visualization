const baseUrl = "http://127.0.0.1:5500";
const visualization = [
  {
    label: "Visualization 1",
    render: renderVisualization1,
  },
];
let activeVisualization = visualization[0];
let movies = [];

function renderVisualization1() {}

async function fetchDataset() {
  const moviesCsv = await (await fetch(`${baseUrl}/dataset/u.item`)).text();
  const ratingsCsv = await (await fetch(`${baseUrl}/dataset/data.csv`)).text();

  movies = Papa.parse(moviesCsv, { header: true }).data;
  console.log({ movies });
}

function setActiveVisualization(index) {
  if (index < visualization.length) {
    activeVisualization = visualization[index];
  }
}

window.addEventListener("load", () => {
  fetchDataset();
});
