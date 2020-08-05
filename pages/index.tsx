import React from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { initializeApollo } from "../lib/apolloClient";
import { ME } from "../components/Navbar";
import { GetServerSideProps } from "next";

const ALL_ARTICLES = gql`
  query ALL_ARTICLES {
    articles {
      _id
      title
    }
  }
`;
const LOGIN = gql`
  mutation LOGIN {
    login
  }
`;

const LOGOUT = gql`
  mutation LOGOUT {
    logout
  }
`;
const HomePage = ({ test }) => {
  const { data, loading } = useQuery(ALL_ARTICLES);
  const [login] = useMutation(LOGIN, { refetchQueries: [{ query: ME }] });
  const [logout] = useMutation(LOGOUT, { refetchQueries: [{ query: ME }] });

  return (
    <div>
      <h1>SSR</h1>

      <button onClick={() => login()}>Login</button>
      <button onClick={() => logout()}>Logout</button>

      <div>
        {data.articles.map((article) => (
          <article key={article._id}>
            <h2>{article.title}</h2>
          </article>
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apolloClient = initializeApollo(null, ctx);

  await apolloClient.query({
    query: ALL_ARTICLES,
  });

  await apolloClient.query({
    query: ME,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
};

export default HomePage;
