require('dotenv').config()

const { GoogleGenerativeAI } = require("@google/generative-ai")
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const getCalorieIntakeOutput = async (dailyFoodIntake) =>{
    let calorieCount = 0
    for (const dailyFood of Object.values(dailyFoodIntake)) {
        const promtToAI = "Calculate the total calorie count for the following food items: " + dailyFood + 
        " Provide a rough estimate using general assumptions. Response should ONLY include the total calorie value (a single number). Ignore any additional textual information."
    
        const res = await model.generateContent(promtToAI);
        const resBody = res.response.text()
        calorieCount = calorieCount + Number(resBody)
    }
    return calorieCount
}

const dailyCalorieIntakeRequired = (personalInfo) => {
    let bodyMassRatio;
    const weight = personalInfo['weight']
    const height = personalInfo['height']
    const activityLevel = personalInfo['activityFactors']
    const gender = personalInfo['gender']
    const age = personalInfo['age']
    // height in cm , weight in kg
    if (gender.toLowerCase() === 'male') {
        bodyMassRatio = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bodyMassRatio = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    const activityFactors = {
        sedentary: 1.2,
        lightlyActive: 1.375,
        moderatelyActive: 1.55,
        veryActive: 1.725,
        superActive: 1.9
    };
    const activityFactor = activityFactors[activityLevel.toLowerCase()];
    if (!activityFactor) {
        throw new Error("Invalid activity level. Use 'sedentary', 'lightlyActive', 'moderatelyActive', 'veryActive', or 'superActive'.");
    }
    const necessaryCalorieDaily = bodyMassRatio * activityFactor;
    return necessaryCalorieDaily; 
}

const getCalorieCalculationOutput = async (dietDetail,personalInfo) => {    
    const calorieCountFromFood = await getCalorieIntakeOutput(dietDetail)
    const requiredCalorie = dailyCalorieIntakeRequired(personalInfo)
    return {calorieCountFromFood,requiredCalorie}

    if (calorieCountFromFood>requiredCalorie){
        console.log("You are eating more than necessary. Required Calorie : " + requiredCalorie + " Calorie from Food : " +  calorieCountFromFood)
    } else {
        console.log("You are healthy. Required Calorie: " + requiredCalorie + " Calorie from Food: " +  calorieCountFromFood)
    }
}

module.exports = { getCalorieCalculationOutput }