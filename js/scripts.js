// Armazena o endpoint em uma variável
const url = "https://jsonplaceholder.typicode.com/posts";

// Seleciona e armazena o "Carregando..." em uma variável
const loadingElement = document.querySelector("#loading");
// Seleciona e armazena o container de posts do index
const postsContainer = document.querySelector("#posts-container");

// Seleciona e armazena todo o conteúdo da página de posts, com exceção do loading
const postPage = document.querySelector("#post");
// Seleciona e armazena o conteúdo do post selecionado
const postContainer = document.querySelector("#post-container");
// Seleciona e armazena a div que traz os comentários
const commentsContainer = document.querySelector("#comments-container");

// Seleciona e armazena os elementos do form de comentários
const commentForm = document.querySelector("#comment-form");
const emailInput = document.querySelector("#email");
const bodyInput = document.querySelector("#body");

// Seleciona e armazena o id pela url
const urlSearchParams = new URLSearchParams(window.location.search);
const postId = urlSearchParams.get("id");

// Get all posts (para o index)

async function getAllPosts() {
  // faz a requisição da API
  const response = await fetch(url);
  // armazena o json em uma variável
  const data = await response.json();
  // esconde o loading
  loadingElement.classList.add("hide");
  // desmembra o json em cada post
  data.map((post) => {
    // cria os elementos HTML que vão receber os dados
    const div = document.createElement("div");
    const title = document.createElement("h2");
    const body = document.createElement("p");
    const link = document.createElement("a");
    // inclui os dados do json nos elementos e cria um botão para direcionar ao post
    title.innerText = post.title;
    body.innerText = post.body;
    link.innerText = "Ler";
    link.setAttribute("href", `/post.html?id=${post.id}`);
    // inclui os elementos na div pai
    div.appendChild(title);
    div.appendChild(body);
    div.appendChild(link);
    // inclui a div pai no index
    postsContainer.appendChild(div);
  });
}

// Get individual post (para a página de post)

async function getPost(id) {
  // solicita com uma Promise tanto o post pelo ID quanto seus comentários
  const [responsePost, responseComments] = await Promise.all([
    fetch(`${url}/${id}`),
    fetch(`${url}/${id}/comments`),
  ]);
  // armazena o json em uma variável
  const dataPost = await responsePost.json();
  const dataComments = await responseComments.json();
  // esconde o loading e mostra o post
  loadingElement.classList.add("hide");
  postPage.classList.remove("hide");

  // cria os elementos do post
  const title = document.createElement("h1");
  const body = document.createElement("p");
  // insere os dados do json nos elementos criados
  title.innerText = dataPost.title;
  body.innerText = dataPost.body;
  // insere o post no html
  postContainer.appendChild(title);
  postContainer.appendChild(body);

  // cria o comentário com a função createComment a partir do map
  dataComments.map((comment) => {
    createComment(comment);
  });
}

// função que cria um comentário
function createComment(comment) {
  // cria os elementos dos comentários
  const div = document.createElement("div");
  const email = document.createElement("h3");
  const commentBody = document.createElement("p");
  // insere os dados do json nos elementos criados
  email.innerText = comment.email;
  commentBody.innerText = comment.body;

  // insere o comentário na div
  div.appendChild(email);
  div.appendChild(commentBody);
  // insere a div na página
  commentsContainer.appendChild(div);
  // limpa os dados do form após o envio
  commentForm.reset();
}

// Função assíncrona para criar um comentário
async function postComment(comment) {
  // fetch com métodos que não são GET precisam do objeto com method, body e headers
  const response = await fetch(`${url}/${postId}/comments`, {
    method: "POST",
    // comment já em formato JSON
    body: comment,
    headers: {
      "Content-type": "application/json",
    },
  });
  // armazena a resposta da API com o body do novo comentário
  const data = await response.json();
  // função de criar comentário com os dados recem recebidos da API
  createComment(data);
}

// Se a url não tiver ID, mostra todos os posts, se tiver, mostra somente o do ID
if (!postId) {
  getAllPosts();
} else {
  getPost(postId);

  // Adiciona evento para o enviar o comentário
  commentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // captura o valor dos inputs e armazena em um objeto
    let comment = {
      email: emailInput.value,
      body: bodyInput.value,
    };
    // transforma o objeto em JSON para ser recebido pela API
    comment = JSON.stringify(comment);

    postComment(comment);
  });
}
