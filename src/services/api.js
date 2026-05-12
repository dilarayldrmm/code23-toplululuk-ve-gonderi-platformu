const BASE_URL = 'https://dummyjson.com';

export async function loginRequest(username, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      password,
      expiresInMins: 30,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Giriş başarısız');
  }

  return data;
}

export async function getPosts(limit = 10, skip = 0) {
  const response = await fetch(`${BASE_URL}/posts?limit=${limit}&skip=${skip}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error('Gönderiler alınamadı');
  }

  return data;
}

export async function searchPosts(query) {
  const response = await fetch(`${BASE_URL}/posts/search?q=${query}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error('Arama yapılamadı');
  }

  return data;
}

export async function getPostComments(postId) {
  const response = await fetch(`${BASE_URL}/posts/${postId}/comments`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error('Yorumlar alınamadı');
  }

  return data;
}