import { defineStore } from "pinia";

const apiUrl = "https://projetocomdestinoindefinido.onrender.com"

export const useApiRequestStore = defineStore('ApiRequest', () => {
  async function getRequest(path: String) {
    try {
      const response = await fetch(apiUrl + path);

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      return null
    }
  }

  async function postRequest(path: String, payload: Object) {
    try {
      const response = await fetch(apiUrl + path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      return null
    }
  }

  async function putRequest(path: String, payload: Object) {
    try {
      const response = await fetch(apiUrl + path, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      return null
    }
  }

  async function deleteRequest(path: String) {
    try {
      const response = await fetch(apiUrl + path, { method: 'DELETE', });
      return response.status == 202
    } catch (error) {
      console.error('Fetch error:', error);
      return false
    }
  }

  return {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest
  }
})