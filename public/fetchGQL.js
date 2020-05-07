'use strict';

const fetchGraphql = async (query) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(query)
    };
    try {
        const response = await fetch(process.env.GRAPHQL, options);
        const json = await response.json();
        console.log(json);
        return json.data;
    } catch (e) {
        console.log(e.message);
        return false;
    }
};

const createTopList = async (request) => {
  const createListQuery = {
      query: `
      mutation {
      addTopList(ListName: "${request.ListName}", Reviews: [${request.Reviews}], 
      Comment: "${request.Comment}", Author: "${request.Author}", Tags: [], Discussion: []) {
      id
      ListName
      Reviews {
      id
      }
      Comment
      Author
      Tags
      Discussion{id}
      }
  }`
  };
  const data = await fetchGraphql(createListQuery);
  return data.addTopList;
};

const getAllLists = async () => {
    const getListsQuery = {
        query: `
        {
            topLists {
                id
                ListName
                Reviews {
                    id
                 }
                Comment
                Author
                Tags
                Discussion {
                    Message
                    Author
                }
            }
        }`
    };
    const data = await fetchGraphql(getListsQuery);
    return data.topLists;
};

const getComments = async () => {
  const getCommentsQuery = {
      query: `
      {
        comments(ParentID: $ParentID) {
        id
        Message
        Author
       } 
    }`
  };
  const data = await fetchGraphql(getCommentsQuery);
  return data.comments;
};

const getAllReviews = async () => {
    const allReviewsQuery = {
        query: `{
        reviews {
        id
        MovieTitle
        MoviePoster
        Comment
        Author
        }
      }`
    };
    const data = await fetchGraphql(allReviewsQuery);
    return data.reviews;
};

const getReviews = async (item) => {
  const getReviewsQuery = {
      query: `{
      reviewOnList (id: ["${item.join('\",\"')}"]) {
      id
      MovieTitle
      MoviePoster
      Comment
      Author
        }
      }`
  };
  const data = await fetchGraphql(getReviewsQuery);
  return data.reviewOnList;
};

const createReview = async (request) => {
    console.log(request.MovieTitle);
  const createReviewQuery = {
      query:`
      mutation {
          createReview(MovieTitle: "${request.MovieTitle}", 
          MoviePoster: "${request.MoviePoster}", 
          Comment: "${request.Comment}", 
          Author: "${request.Author}") {
              id
            MovieTitle
            MoviePoster
            Comment
            Author
        }
    }`
  };
  const data = await fetchGraphql(createReviewQuery);
  return data.createReview;
};

const commentOnList = async () => {
  const commentOnListQuery = {
      query:`
      mutation {
          leaveComment(ParentID: $ParentID, Message: $Message, Author: $Author) {
              id
            ParentID
            Message
            Author
        }
    }`
  };
  const data = await fetchGraphql(commentOnListQuery);
  return data.leaveComment;
};