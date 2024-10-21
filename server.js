
const express = require('express')
const cors = require('cors')
const app = express();
const port = 3000;
const {getCalorieCalculationOutput} = require('./calorieCalculator')
app.use(cors());
app.use(express.json())

app.post('/calculate', (req, res) => {
    const { meals, personalInfo } = req.body;
    const {calorieCountFromFood,requiredCalorie}= getCalorieCalculationOutput(meals,personalInfo)
    console.log(calorieCountFromFood,requiredCalorie)
    res.status(200).json({ calorieCountFromFood, requiredCalorie })
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
