const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

let repositories = [];

findRepository = (request) => {
  const { id } = request.params;
  const index = repositories.findIndex(repository => repository.id === id);
  let repository = null;
  if ( index > -1)
    repository = repositories[index];
  return { index, repository };
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  
  let { index, repository } = findRepository(request);

  if (!repository)
    return response.sendStatus(400);
    
  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  repositories[index] = repository;
  
  return response.json(repositories[index]);

});

app.delete("/repositories/:id", (request, response) => {
  let { index, repository } = findRepository(request);

  if (!repository)
    return response.sendStatus(400);
  
  repositories.splice(index, 1);

  return response.sendStatus(204);
});

app.post("/repositories/:id/like", (request, response) => {
  let { index, repository } = findRepository(request);

  if (!repository)
    return response.sendStatus(400);

  repositories[index].likes++;

  return response.json(repositories[index]);
});

module.exports = app;
