
import axios from 'axios';

const API_URL = 'https://fakestoreapi.com/products';

export const fetchProducts =  async () => {
  try {

    const response =  await axios.get(API_URL);
    
    
  return response.data;
    
  } catch (error) {
    console.log(error);
    
  }


};



export const fetchProductById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  };

