import React , { useEffect } from 'react';
import { useQuery, gql } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CssBaseline,
  Grid,
  Box,
  Typography,
  Container,
} from '@mui/material';

import { useAuth } from '../data/Auth';
// import { requestOAuthToken } from '../api/oauth_token';

const GET_POSTS = gql`
  query Query {
    GetPosts {
      posts {
        id
        description
        photoPath
        user {
          id
          email
          username
        }
        votes {
          id
          type
        }
      }
      error {
        message
      }
    }
  }
`;


export default function Post() {
  const navigate = useNavigate()
  // useAuth()
  // console.log(authtoken)
  const { data, error, loading } = useQuery(GET_POSTS);

  if (error) return <div>Error Page</div>;

  if (loading) return <div>Spinner...</div>;

  const { GetPosts } = data;

  return (
    <Box>
      <main>
        <Box
          sx={{
            bgcolor: 'transparent',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              POSTS
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              description's user
            </Typography>
          </Container>
        </Box>

        <Container sx={{ py: 8 }} maxWidth="md">
          <Grid container spacing={4}>
            {GetPosts.posts.map((posts: any) => (
              <Grid item key={posts.id} xs={5} sm={5} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      bgcolor: 'background.paper'
                    }}
                    image={posts.photoPath}
                    alt="random"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {posts.id}
                    </Typography>
                    <Typography>
                      {posts.description}
                    </Typography>
                    <Typography variant="h6" sx={{top:20}}>
                      Posted by {posts.user.username}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">View</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        
      </main>
    </Box>
  );
}