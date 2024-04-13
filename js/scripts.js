/* carregamento de dados, via fetch, pegar da API, colocar 
*na fetch os dados, transformar numa array de objetivos e converter na tela 
*/

//declarando variáveis
const url = "https://jsonplaceholder.typicode.com/posts";

//selecionando elementos
const loadingElement = document.querySelector("#loading");
const postsContainer = document.querySelector("#posts-container");

const postPage = document.querySelector("#post");
const postContainer = document.querySelector("#post-container");
const commentsContainer = document.querySelector("#comments-container"); //o erro estava aqui!!!

const commentForm = document.querySelector("#comment-form");
const emailInput = document.querySelector("#email");
const bodyInput = document.querySelector("#body");

//Get id from URL
const urlSearchParams = new URLSearchParams(window.location.search);
const postId = urlSearchParams.get("id");

//função para pegar todos os posts
//GET all posts
//função assincrona - para trabalhar com await dentro dela

async function getAllPosts(){
    //primeira resposta que recebe depois de um fetch
    const response = await fetch(url);
    
    console.log(response);

    const data = await response.json ();
    
    console.log(data);
    
    //escondendo o loading porque eu já recebi os dados
    loadingElement.classList.add("hide");

    //criando os elementos para preencher com o conteúdo
    data.map((post) => {
        const div = document.createElement("div")
        const title = document.createElement("h2")
        const body = document.createElement("p")
        const link = document.createElement("a")

        title.innerText = post.title;
        body.innerText = post.body;
        link.innerText = "Ler";
        link.setAttribute("href", `/post.html?id=${post.id}`);
        
        div.appendChild(title);
        div.appendChild(body);
        div.appendChild(link);
        postsContainer.appendChild(div);
    });
}


//GET individual post - esta função é semelhante à primeira
async function getPost(id){
    const [responsePost, responseComments] = await Promise.all([
        fetch(`${url}/${id}`),
        fetch(`${url}/${id}/comments`),
    ]);

    const dataPost = await responsePost.json();
    const dataComments = await responseComments.json();

    loadingElement.classList.add("hide");
    postPage.classList.remove("hide");

    const title = document.createElement("h1");
    const body = document.createElement("p");

    title.innerText = dataPost.title;
    body.innerText = dataPost.body;

    postContainer.appendChild(title);
    postContainer.appendChild(body);

    dataComments.map((comment) => {
        createComment(comment);
    });
}
    

function createComment(comment){
    //monta uma div com os dados do comentário
    const div = document.createElement("div");
    const email = document.createElement("h3");
    const commentBody = document.createElement("p");

    email.innerText = comment.email;
    commentBody.innerText = comment.body;

    //inserir os dados na div no container de comentários
    div.appendChild(email);
    div.appendChild(commentBody);
    commentsContainer.appendChild(div);

    console.log(comment);
}


//Post a comment
async function postComment(comment){
//POST, PUT, PATCH, DELETE - headers, body
const response = await fetch(url, {
    method: "POST",
    body:comment,
    headers:{
        "Content-type":"application/json",
    },
});

    const data = await response.json();
    createComment(data);

    console.log(data);
}



if(!postId){
    getAllPosts();
}else{
    getPost(postId);

    //Add event to comment form
    commentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let comment = {
            email: emailInput.value,
            body: bodyInput.value,
        };
        comment = JSON.stringify(comment);

        postComment(comment);
    });
}
