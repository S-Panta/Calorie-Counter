require('dotenv').config()
const { GoogleGenerativeAI } = require("@google/generative-ai")
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const prompt = require('prompt-sync')();

const getCalorieIntakeOutput = async (dailyFoodIntake) =>{
    let calorieCount = 0
    for (let dailyFood of dailyFoodIntake) {
        const promtToAI = "Calculate the total calorie count for the following food items: " + dailyFood + 
        " Provide a rough estimate using general assumptions. Response should ONLY include the total calorie value (a single number). Ignore any additional textual information."
    
        const res = await model.generateContent(promtToAI);
        const resBody = res.response.text()
        calorieCount = calorieCount + Number(resBody)
        // console.log(resBody)
    }
    return calorieCount
}

const dailyCalorieIntakeRequired = (
    age,
    weight,
    height,
    gender,
    activityLevel
) => {
    let bodyMassRatio;
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

const getResult = async () => {
    const breakfast = prompt("Enter your morning diet: ")
    const lunch =  prompt("Enter your lunch diet: ")
    const dinner = prompt("Enter dinner: ")
    const extraSnacks = prompt("Enter if you had any drink or extra foods")

    let dailyFoodIntake = []
    dailyFoodIntake.push(breakfast,lunch,dinner,extraSnacks)
    
    const calorieCountFromFood = await getCalorieIntakeOutput(dailyFoodIntake)
    const age =  prompt("Enter your age : ")
    const weight = prompt("Enter your weight(in kg) : ")
    const height = prompt("Enter your height (in cm) : "); 
    const gender = prompt("Enter your gender : "); 
    const activityLevel = prompt("Choose from  'sedentary', 'lightlyActive', 'moderatelyActive', 'veryActive', or 'superActive'."); 

    const requiredCalorie = dailyCalorieIntakeRequired(age,weight,height,gender,activityLevel)

    if (calorieCountFromFood>requiredCalorie){
        console.log("You are eating more than necessary. Required Calorie : " + requiredCalorie + " Calorie from Food : " +  calorieCountFromFood)
    } else {
        console.log("You are healthy. Required Calorie: " + requiredCalorie + " Calorie from Food: " +  calorieCountFromFood)
    }
}

getResult()