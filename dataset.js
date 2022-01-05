const baseUrl = "http://127.0.0.1:5500";
let movies = [];
let ratings = [];
let users = [];
let genres = [];

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

fetchDataset();
