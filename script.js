// import { getCalorieCalculationOutput } from "./server";
const checkCalorieButton = document.getElementById('check-calorie');

checkCalorieButton.addEventListener('click', function() {
    const meals = {
        breakfast:  document.getElementById('breakfast').value,
        lunch: document.getElementById('lunch').value,
        dinner: document.getElementById('dinner').value,
        snack: document.getElementById('snack').value
    };
    const personalInfo = {
        weight: parseInt(document.getElementById('weight').value),
        height: parseInt(document.getElementById('height').value),
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        activityFactors:document.getElementById('activity-level').value
    };
    (async()=>{
        
        const data = await fetchCalorie(meals,personalInfo)

        const calorieCountFromFood = data.calorieCountFromFood;
        const requiredCalorie = data.requiredCalorie;
        document.getElementById('calorie-from-food').textContent = calorieCountFromFood;
        document.getElementById('required-calorie').textContent = requiredCalorie;
        const calorieStatus = calorieCountFromFood > requiredCalorie ? 
            'You are consuming more calories than needed.' : 
            'You are consuming fewer calories than needed.';
        
        document.getElementById('calorie-status').textContent = calorieStatus;
    })()

})

const fetchCalorie = async (meals,personalInfo) => {
    const response = await fetch('http://localhost:3000/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            meals,personalInfo
         }),
    });
    return await response.json()
}