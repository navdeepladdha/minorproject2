/**
 * Utility functions for date formatting and manipulation
 */

/**
 * Format a date string to a more readable format
 * @param {string} dateString - ISO date string
 * @param {boolean} includeTime - Whether to include time in the formatted string
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return date.toLocaleDateString('en-US', options);
};

/**
 * Get a relative time string (e.g., "2 days ago", "just now")
 * @param {string} dateString - ISO date string
 * @returns {string} Relative time string
 */
export const getRelativeTimeString = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  const now = new Date();
  const diffInMs = now - date;
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInSecs < 60) {
    return 'Just now';
  } else if (diffInMins < 60) {
    return `${diffInMins} ${diffInMins === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  } else {
    return formatDate(dateString);
  }
};

/**
 * Calculate age from birthdate
 * @param {string} birthdate - ISO date string of birthdate
 * @returns {number|null} Age in years or null if invalid
 */
export const calculateAge = (birthdate) => {
  if (!birthdate) return null;
  
  const birthDate = new Date(birthdate);
  
  if (isNaN(birthDate.getTime())) {
    return null;
  }
  
  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Check if a date is in the past
 * @param {string} dateString - ISO date string
 * @returns {boolean} Whether the date is in the past
 */
export const isDateInPast = (dateString) => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return false;
  }
  
  const now = new Date();
  return date < now;
};

/**
 * Calculate the difference in days between two dates
 * @param {string} date1 - First ISO date string
 * @param {string} date2 - Second ISO date string (defaults to now)
 * @returns {number|null} Difference in days or null if invalid
 */
export const getDaysDifference = (date1, date2 = new Date().toISOString()) => {
  if (!date1) return null;
  
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  
  if (isNaN(firstDate.getTime()) || isNaN(secondDate.getTime())) {
    return null;
  }
  
  const diffInMs = Math.abs(secondDate - firstDate);
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
};

export default {
  formatDate,
  getRelativeTimeString,
  calculateAge,
  isDateInPast,
  getDaysDifference
};