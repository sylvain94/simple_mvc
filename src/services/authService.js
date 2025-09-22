import { apiPut, apiGet } from './api.js'

/**
 * Authentication service
 */
const authService = {
  /**
   * Authenticate the user
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {Promise} - Authentication result
   */
  async login(username, password) {
    try {
      console.log('🔐 Tring to authenticate for:', username);
      
      const response = await fetch(`/api/v1/authentication/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify({
          userid: username,
          password: password
        })
      });

      console.log('📡 Server response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      // Read the response content
      const responseText = await response.text();
      console.log('📄 Raw response content:', responseText);

      if (!response.ok) {
        console.error('❌ HTTP Error:', response.status, response.statusText);
        console.error('📄 Error content:', responseText);
        throw new Error(`Error ${response.status}: ${response.statusText}. Content: ${responseText}`);
      }

      // Parse the JSON response to get the token
      let authResult;
      try {
        authResult = JSON.parse(responseText);
        console.log('✅ Parsed JSON response:', authResult);
      } catch (parseError) {
        console.error('❌ Erreur de parsing JSON:', parseError);
        throw new Error(`Invalid server response: ${responseText}`);
      }
      
      if (!authResult.token) {
        console.error('❌ No token in the response:', authResult);
        throw new Error('No token received from server');
      }

      // Decode JWT to get expiration (optional, for better session management)
      let expiresAt = Date.now() + (30 * 60 * 1000); // Default 30 minutes
      try {
        const tokenPayload = JSON.parse(atob(authResult.token.split('.')[1]));
        if (tokenPayload.exp) {
          expiresAt = tokenPayload.exp * 1000; // Convert to milliseconds
        }
      } catch (e) {
        console.warn('Could not decode JWT expiration, using default 30 minutes');
      }

      // Create session with real JWT token
      const sessionData = {
        username,
        token: authResult.token, // Use the real JWT token
        expiresAt: expiresAt
      };
      
      // Store the session data
      localStorage.setItem('session', JSON.stringify(sessionData));
      console.log('💾 Session stored:', sessionData);
      
      // Retrieve the user information
      console.log('👤 Retrieving user information for:', username);
      try {
        const user = await apiGet(`/utils/users/getByUserID/${username}`, true);
        console.log('✅ User information retrieved:', user);
        localStorage.setItem('user', JSON.stringify(user));
        
        console.log('🎉 Authentication successful!');
        return { user, token: authResult.token };
      } catch (userError) {
        console.error('❌ Error retrieving user information:', userError);
        // We can continue even if we can't retrieve the user information
        console.log('⚠️ Authentication successful but user information not available');
        return { user: { username }, token: authResult.token };
      }
    } catch (error) {
      throw new Error(error.message || 'Authentication error');
    }
  },

  /**
   * Logout the user
   */
  logout() {
    // Clean all session data
    localStorage.removeItem('session');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Redirect to the login page
    window.location.href = '/login';
  },

  /**
   * Check if the user is authenticated
   * @returns {boolean} - True if the user is authenticated
   */
  isAuthenticated() {
    const sessionData = localStorage.getItem('session');
    if (!sessionData) return false;

    try {
      const { expiresAt } = JSON.parse(sessionData);
      if (Date.now() > expiresAt) {
        this.logout();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Get the authentication token
   * @returns {string|null} - The authentication token or null
   */
  getToken() {
    const sessionData = localStorage.getItem('session');
    if (!sessionData) return null;

    try {
      const { token } = JSON.parse(sessionData);
      return token;
    } catch {
      return null;
    }
  },

  /**
   * Get the current user
   * @returns {Object|null} - The current user or null
   */
  getCurrentUser() {
    const userData = localStorage.getItem('user');
    if (!userData) return null;

    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  },

  /**
   * Check if the user has the admin role
   * @returns {boolean} - True if the user is admin
   */
  isAdmin() {
    const user = this.getCurrentUser();
    return user?.admin === true; // Based on the 'admin' field of your user_entity table
  },

  /**
   * Add the token to all API requests
   * @param {string} url - The URL to fetch
   * @param {Object} options - The options for the fetch request
   * @returns {Promise} - The fetch result
   */
  fetchWithAuth(url, options = {}) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.status === 401) {
        this.logout();
        throw new Error('Session expired');
      }
      return response;
    });
  }
};

export { authService };
