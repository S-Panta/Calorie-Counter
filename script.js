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

    fetchCalorie(meals,personalInfo)

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
    console.log(await response.json())

    // if (response.ok) {
    //     const data = await response.json();
    //     document.getElementById('response').innerText = data.response || 'No response generated.';
    // } else {
    //     document.getElementById('response').innerText = 'Error generating response.';
    // }
}