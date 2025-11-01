import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_URL = process.env.MGNREGA_API_URL;

async function debugAPI() {
  try {
    console.log('🔍 API URL:', API_URL);
    
    const response = await axios.get(API_URL);
    
    console.log('📊 Response status:', response.status);
    console.log('📋 Response headers:', response.headers);
    console.log('📦 Response data structure:', typeof response.data);
    console.log('🔢 Response data keys:', Object.keys(response.data));
    
    if (response.data.records) {
      console.log('📝 Records found:', response.data.records.length);
      console.log('🔍 First record:', JSON.stringify(response.data.records[0], null, 2));
    } else if (Array.isArray(response.data)) {
      console.log('📝 Array data length:', response.data.length);
      console.log('🔍 First item:', JSON.stringify(response.data[0], null, 2));
    } else {
      console.log('📄 Full response:', JSON.stringify(response.data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ API call failed:', error.message);
    if (error.response) {
      console.error('📄 Error response:', error.response.data);
    }
  }
}

debugAPI();