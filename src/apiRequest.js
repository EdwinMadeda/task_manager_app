import { useState } from "react";

const apiRequest = async (URL, options = {method: 'GET'}, handleLoading = false) => {
    
    let errMsg = null, result = [], loading;
    options = {
      ...options, 
      headers: {'Content-Type': 'application/json'}
    };

    try {
      const response = await fetch(URL, options);
      if(!response.ok) throw Error('Could not retrieve items');
      result = await response.json();
      loading = true;
      
    } catch (err) {
      errMsg = err.message;
    } finally {
        loading = false;
        return {result, errMsg, loading}
    }
}

export default apiRequest