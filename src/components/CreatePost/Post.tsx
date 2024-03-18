import React from "react";
import "./Post.css";
import { gql, useMutation } from "@apollo/client";

const CREATE_POST = gql`
  mutation CreatePost(
    $picture: String!
    $description: String!
    $username: String!
  ) {
    CreatePosts(
      picture: $picture
      description: $description
      username: $username
    ) {
      error {
        message
      }
      post {
        ...Post
      }
    }
  }
`;

export default function Post({
  id,
  description,
  photoPath,
  username,
  votes,
  voteType
}) {
  const [createPost, { data, loading }] = useMutation(CREATE_POST);
  // const [unpublishPost, { data: unpublishData, loading: unpublishLoading }] =
  //   useMutation(UNPUBLISH_POST);

  // const formatedDate = new Date(Number(date));
  const formatedDate = new Date();
  return (
    <div
      className="Post"
      style={voteType === 1 ? { backgroundColor: "hotpink" } : {}}
    >
      {username === "ABC" && (
        <p
          className="Post__publish"
          onClick={() => {
            createPost({
              variables: {
                picture: id,
                description: description,
                username: username,
              },
            });
          }}
        >
          publish
        </p>
      )}
      {/* {isMyProfile && published === true && (
        <p
          className="Post__publish"
          onClick={() => {
            unpublishPost({
              variables: {
                postId: id,
              },
            });
          }}
        >
          unpublish
        </p>
      )} */}
      <div className="Post__header-container">
        <h2>{id}</h2>
        <h4>
          Created At {`${formatedDate}`.split(" ").splice(0, 3).join(" ")} by{" "}
          {username}
        </h4>
      </div>
      <p>{description}</p>
    </div>
  );
}