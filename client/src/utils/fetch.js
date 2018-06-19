export const fetchPost = ({url, body = {}}) => fetch(url,
  {
    body: JSON.stringify(body),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }
);
