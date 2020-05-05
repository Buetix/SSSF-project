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
        const response = await fetch('https://localhost:8000/graphql', options)
        const json = await response.json();
        console.log(json);
        return json.data;
    } catch (e) {
        console.log(e.message);
        return false;
    }
};

const createTopList = async (topList) => {
  const createListQuery = {
      query: `
      mutation {
      addTopList(ListName: $ListName, Reviews: [$review1, $review2, $review3, $review4, $review5], 
      Comment: $Comment, Author: $Author, Tags: [$tag1, $tag2], Discussion: []) {
      id
      ListName
      Reviews
      Comment
      Author
      Tags
      Discussion
      }
  }`,
      variables: topList,
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
    console.log(data);
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

const createReview = async () => {
  const createReviewQuery = {
      query:`
      mutation {
          createReview(MovieTitle: $MovieTitle, MoviePoster: $MoviePoster, Comment: $Comment, Author: $Author) {
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