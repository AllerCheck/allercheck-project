// src/api/ArticlesApi.jsx
import axios from 'axios';

const fetchArticles = async (query) => {
  const API_KEY = 'be1fec524ab14f5e8aa27add7daadcb6'; // Replace with your actual News API key
  const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}`;

  try {
    const response = await axios.get(url);
    return response.data.articles;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

export { fetchArticles };
