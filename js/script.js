const commentsList = document.getElementById('commentslist');
const commentBox = document.getElementById('commentBox');

/**
 * Add Comments to list of comments and store in localstorage
 */
let addComment = () => {
    if(!localStorage.getItem("comments")) {
        let comments = [];
        localStorage.setItem("comments", JSON.stringify(comments));
    }

    comments = JSON.parse(localStorage.getItem('comments'));
    comments.push({
        parentCommentId : null,
        commentId : Math.random().toString().substr(2,7),
        commentText : commentBox.value,
        childComments : [],
        likes : 0
    });
    localStorage.setItem("comments", JSON.stringify(comments));
    createCommentsListView();
    commentBox.value = "";
}


/**
 * Get List of Comments Added
 */

let getAllComments = () => JSON.parse(localStorage.getItem('comments'));

/**
 * Set comments in local storage
 */
let setAllComments = (comments) => localStorage.setItem("comments", JSON.stringify(comments));


/**
 * Create Single Comment View
 * @param {*} obj 
 * @param {*} padding 
 * @returns 
 */
let createSingleCommentCard = (obj, padding) => 
`
    <div style="background-color:#f6f6f6;margin-left:${padding}px;border:2px solid green;width:400px;border-radius:10px;" id=${obj.commentId}>
    ${obj.commentText}
    <div class="like p-2 cursor" onclick="handleClickLikeBtn(obj,obj.commentId)"><i class="fa fa-thumbs-o-up"></i><span class="ml-1">Like</span><span style="color:red">${obj.likes === 0? '' : obj.likes}</span></div>
    <div class="like p-2 cursor action-collapse" data-toggle="collapse" aria-expanded="true" aria-controls="collapse-1" href="#collapse-1"><i class="fa fa-commenting-o"></i><span class="ml-1">Reply</span><span style="color:red">${obj.childComments.length === 0? '' : obj.childComments.length}</span></div>
    <div class="like p-2 cursor action-collapse" data-toggle="collapse" aria-expanded="true" aria-controls="collapse-2" href="#collapse-2"><i class="fa fa-edit"></i><span class="ml-1">Edit</span></div>
    <div class="like p-2 cursor action-collapse" data-toggle="collapse" aria-expanded="true" aria-controls="collapse-2" href="#collapse-2"><i class="fa fa-trash"></i><span class="ml-1">Delete</span></div>
    </div>
`;



let createCommentCards = (commentsList, padding = 0) => {
   let fullCommentView = "";
   for(let comment of commentsList){
    fullCommentView += createSingleCommentCard(comment, padding);
       if(comment.childComments.length > 0) {
        fullCommentView += createCommentCards(comment.childComments, (padding += 20));
           padding -= 20;
       }
   }
   return fullCommentView;
};


/**
 * Create View for Comments
 */
let createCommentsListView = () => {
    let commentsFromLocalStorage = getAllComments();
    if(commentsFromLocalStorage.length > 0){
        let commentsView = createCommentCards(commentsFromLocalStorage);
        console.log(commentsView, commentsFromLocalStorage);
        commentsList.innerHTML = commentsView;
    }
}


/**
 * Function to handle click of like icon
 * @param {*} comments 
 * @param {*} commentLikeId 
 */
let handleClickLikeBtn = (comments, commentLikeId) => {
    for(let comment of comments) {
        if(comment.commentId === commentLikeId){
            comment.likes += 1;
        }
        else if(comment.childComments.length > 0){
           handleClickLikeBtn(comment.childComments, commentLikeId);
        }
    }
}

/**
 * Function to handle Edit Icon
 * @param {*} comments 
 * @param {*} updateCommentId 
 * @param {*} updateCommentText 
 */
let handleClickEdit = (comments, updateCommentId, updateCommentText) => {
    for(let comment of comments) {
        if(comment.commentId === updateCommentId){
            comment.commentText = updateCommentText;
        }
        else if(comment.childComments.length > 0){
            handleClickEdit(comment.childComments, updateCommentId, updateCommentText);
        }
    }
}


/**
 * Function to handle deletion of comment
 * @param {*} comments 
 * @param {*} commentId 
 */
let handleDeleteComment = (comments, commentId) => {
    for(let i in comments) {
        if(comments[i].commentId === commentId){
            comments.splice(i,1);
        }
        else if(comments[i].childComments.length > 0){
            handleDeleteComment(comments[i].childComments, commentId);
        }
    }
}
createCommentsListView();
