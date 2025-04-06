
import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace with your actual API key when in production
// Ideally, this should be stored in Firebase environment variables
const API_KEY =AIzaSyAP9D699yqKycWsYy3S9y3BDYflYfqnMzE;

// Initialize the Generative AI API
const genAI = new GoogleGenerativeAI(API_KEY);

// Function to get AI recommendations for food donation matching
export const getMatchingRecommendations = async (donationData, charities) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      I have a food donation with the following details:
      - Food type: ${donationData.foodName}
      - Category: ${donationData.category}
      - Quantity: ${donationData.quantity} ${donationData.unit}
      - Expiration date: ${donationData.expirationDate}
      - Storage requirements: ${donationData.storageRequirements || "Not specified"}
      - Transport needed: ${donationData.needsTransport ? "Yes" : "No"}
      
      Here are potential recipient organizations:
      ${charities.map((charity, index) => `
        ${index + 1}. ${charity.organizationName}
        - Distance: ${charity.distance || "Unknown"} miles
        - Serves: ${charity.populationServed || "Various populations"}
        - Capacity: ${charity.capacity || "Unknown"}
      `).join('\n')}
      
      Based on this information, provide the following:
      1. Rank the top 3 best matching organizations for this donation and explain why
      2. Any food safety considerations specific to this donation
      3. Suggest optimal transportation arrangements based on the food type and quantity
    `;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error getting AI recommendations:", error);
    return "Unable to generate AI recommendations at this time.";
  }
};

// Function to analyze food waste patterns and provide insights
export const analyzeWastePatterns = async (donationHistory) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const donationSummary = donationHistory.reduce((acc, donation) => {
      if (!acc[donation.category]) {
        acc[donation.category] = 0;
      }
      acc[donation.category] += parseFloat(donation.quantity);
      return acc;
    }, {});
    
    const prompt = `
      Here is a summary of food donations by category (in ${donationHistory[0]?.unit || "units"}):
      ${Object.entries(donationSummary).map(([category, quantity]) => 
        `- ${category}: ${quantity}`
      ).join('\n')}
      
      Total number of donations: ${donationHistory.length}
      Time period: ${donationHistory[0]?.createdAt ? new Date(donationHistory[0].createdAt).toLocaleDateString() : "Unknown"} to ${donationHistory[donationHistory.length-1]?.createdAt ? new Date(donationHistory[donationHistory.length-1].createdAt).toLocaleDateString() : "Unknown"}
      
      Based on this donation pattern:
      1. Identify potential waste reduction opportunities
      2. Suggest 3 actionable strategies to optimize food donation and reduce waste
      3. Provide insights on seasonal trends if applicable
      4. Recommend inventory management improvements
    `;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error analyzing waste patterns:", error);
    return "Unable to generate waste pattern analysis at this time.";
  }
};

// Function to generate optimized transport routes
export const generateOptimizedRoutes = async (pickupLocation, deliveryLocations) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const locationsText = deliveryLocations.map((loc, index) => 
      `Location ${index + 1}: ${loc.name}, ${loc.address}`
    ).join('\n');
    
    const prompt = `
      I need to optimize a delivery route for food donations.
      
      Starting point (pickup): ${pickupLocation.name}, ${pickupLocation.address}
      
      Delivery points:
      ${locationsText}
      
      Please provide:
      1. An optimized route order to minimize total travel distance
      2. Estimated total distance and time required
      3. Any special considerations for food transportation
      4. Suggestions for time windows to ensure food safety
    `;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating optimized routes:", error);
    return "Unable to generate route optimization at this time.";
  }
};

// Function to predict food expiration and suggest prioritization
export const predictExpirationPriorities = async (inventoryItems) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const inventoryText = inventoryItems.map(item => 
      `- ${item.foodName} (${item.category}): Quantity: ${item.quantity} ${item.unit}, Listed on: ${new Date(item.createdAt).toLocaleDateString()}, Expires: ${item.expirationDate}`
    ).join('\n');
    
    const prompt = `
      Here is the current inventory of food donations:
      ${inventoryText}
      
      Based on this inventory:
      1. Prioritize items that need immediate distribution (high, medium, low priority)
      2. Suggest appropriate recipient types for each high-priority item
      3. Recommend storage adjustments to maximize shelf life
      4. Identify items that may need to be bundled together for efficient distribution
    `;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error predicting expiration priorities:", error);
    return "Unable to generate expiration priorities at this time.";
  }
};

// Function to generate impact reports and insights
export const generateImpactInsights = async (impactData) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      Here is the impact data from our food rescue platform:
      - Total food rescued: ${impactData.totalFood} ${impactData.unit}
      - Number of donations: ${impactData.totalDonations}
      - Number of businesses participating: ${impactData.businessCount}
      - Number of recipient organizations: ${impactData.charityCount}
      - Number of volunteers: ${impactData.volunteerCount}
      - Estimated meals provided: ${impactData.mealsProvided}
      - Environmental impact: ${impactData.carbonSaved} kg CO2 equivalent
      - Time period: ${impactData.timePeriod}
      
      Based on this impact data:
      1. Provide a compelling summary of the social impact
      2. Generate 3 data-driven insights about the program's effectiveness
      3. Suggest 2-3 ways to increase participation and impact
      4. Provide a comparative analysis to industry benchmarks if possible
      5. Suggest how to better communicate these impacts to stakeholders
    `;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating impact insights:", error);
    return "Unable to generate impact insights at this time.";
  }
};

export default {
  getMatchingRecommendations,
  analyzeWastePatterns,
  generateOptimizedRoutes,
  predictExpirationPriorities,
  generateImpactInsights
};
